<?php

namespace App\Http\Controllers\Payments\Paypal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Payment;
use App\Models\User;
use App\Models\Plan;
use App\Http\Traits\ManageSubscriptions;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PaypalWebhookController extends Controller
{
    use ManageSubscriptions;

    public function handle(Request $request)
    {
        Log::info('--- PayPal Webhook Hit ---');
        Log::info('Raw Payload: ' . json_encode($request->all()));

        $paypal = new PayPalClient;
        $paypal->setApiCredentials(config('paypal'));

        // 1. Verify webhook signature
        try {
            $verification = $paypal->verifyWebHook([
                'auth_algo'         => $request->header('PAYPAL-AUTH-ALGO'),
                'cert_url'          => $request->header('PAYPAL-CERT-URL'),
                'transmission_id'   => $request->header('PAYPAL-TRANSMISSION-ID'),
                'transmission_sig'  => $request->header('PAYPAL-TRANSMISSION-SIG'),
                'transmission_time' => $request->header('PAYPAL-TRANSMISSION-TIME'),
                'webhook_id'        => config('paypal.webhook_id'),
                'webhook_event'     => $request->all(),
            ]);

            if (($verification['verification_status'] ?? null) !== 'SUCCESS') {
                Log::warning('Invalid PayPal webhook signature');
                return response()->json(['error' => 'Invalid signature'], 401);
            }
        } catch (\Exception $e) {
            Log::error('PayPal webhook verification failed: ' . $e->getMessage());
            return response()->json(['error' => 'Webhook verification failed'], 500);
        }

        $event = $request->all();
        $eventType = $event['event_type'] ?? null;
        $resource = $event['resource'] ?? [];

        // Extract metadata from custom fields or payment reference
        $metadata = (object) ($resource['custom'] ?? []);
        $userId      = $metadata->user_id ?? null;
        $planId      = $metadata->plan_id ?? null;
        $productCode = $metadata->product_code ?? null;
        $paymentId   = $metadata->payment_id ?? null;

        $payment = $paymentId ? Payment::find($paymentId) : null;

        if (!$payment) {
            Log::warning("Payment not found for PayPal order: " . ($resource['id'] ?? 'unknown'));
            return response()->json(['error' => 'Payment not found'], 404);
        }

        // Idempotency guard
        if ($payment->status === 'completed') {
            return response()->json(['status' => 'already_processed']);
        }

        switch ($eventType) {
            case 'PAYMENT.CAPTURE.COMPLETED':

                $capturedAmount = $resource['amount']['value'] ?? null;
                $currency       = $resource['amount']['currency_code'] ?? null;

                // Optional: validate amount & currency
                if ((float) $capturedAmount !== (float) $payment->amount) {
                    Log::warning("PayPal amount mismatch: expected {$payment->amount}, got {$capturedAmount}");
                    return response()->json(['error' => 'Amount mismatch'], 422);
                }

                // Update payment
                $receiptNumber = 'T' . rand(100000, 999999) . now()->format('Ymd');
                $payment->update([
                    'status'         => 'completed',
                    'transaction_id' => $resource['id'] ?? null,
                    'receipt_number' => $receiptNumber,
                    'paid_at'        => now(),
                ]);

                // Notify user
                try {
                    $user = User::find($userId);
                    if ($user && $payment->plan) {
                        $receipt = [
                            'receipt_number' => $payment->receipt_number,
                            'product_code'   => $payment->plan->product_code,
                            'plan_name'      => $payment->plan->name,
                            'amount'         => number_format($payment->amount, 2) . ' ' . strtoupper($payment->currency),
                            'date'           => now()->format('M d, Y'),
                            'expires'        => $payment->plan->duration_days
                                ? now()->addDays($payment->plan->duration_days)->format('M d, Y')
                                : 'N/A',
                        ];
                        $user->notify(new \App\Notifications\PaymentReceipt($receipt));
                    }
                } catch (\Exception $e) {
                    Log::error('Payment receipt notification failed: ' . $e->getMessage());
                }

                // Activate subscription
                if ($userId && $planId && $productCode) {
                    $user = User::find($userId);
                    $plan = Plan::find($planId);
                    if ($user && $plan) {
                        $this->createOrUpdateSubscription($user, $plan, $productCode, $paymentId);
                    }
                }

                break;

            case 'PAYMENT.CAPTURE.DENIED':
            case 'PAYMENT.CAPTURE.FAILED':
                $payment->update(['status' => 'failed']);
                break;
        }

        return response()->json(['status' => 'ok']);
    }
}
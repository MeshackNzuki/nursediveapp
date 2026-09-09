<?php

namespace App\Http\Controllers\Payments\Paypal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\User;
use App\Http\Traits\ManageSubscriptions;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use Throwable;

class PaypalController extends Controller
{
    use ManageSubscriptions;

    /**
     * Create PayPal Order (Payment Intent)
     */
    public function createPaymentIntent(Request $request)
    {
        $data = $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $plan = Plan::findOrFail($data['plan_id']);

        // Create local payment record
        $payment = Payment::create([
            'user_id' => auth()->id(),
            'plan_id' => $plan->id,
            'amount' => $plan->price,
            'status' => 'pending',
            'source' => 'paypal',
        ]);

        $paypal = new PayPalClient;
        $paypal->setApiCredentials(config('paypal'));
        $paypal->getAccessToken();

        try {
            $order = $paypal->createOrder([
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'reference_id' => (string) $payment->id,
                        'amount' => [
                            'currency_code' => 'USD',
                            'value' => number_format($plan->price, 2, '.', ''),
                        ],
                        'custom_id' => json_encode([
                            'user_id' => auth()->id(),
                            'plan_id' => $plan->id,
                            'payment_id' => $payment->id,
                            'product_code' => $plan->product_code,
                        ]),
                    ],
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('PayPal createOrder exception', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
                'payment' => $payment->id,
            ]);
            $payment->update(['status' => 'failed']);
            return $this->ResError(['message' => 'Unable to create PayPal order'], 422);
        }

        // Save PayPal order ID
        $payment->update(['transaction_id' => $order['id'] ?? null]);

        return $this->ResSuccess([
            'orderId'   => $order['id'] ?? null,
            'paymentId' => $payment->id,
        ]);
    }

    /**
     * Capture PayPal Payment
     */
    public function capturePayment(Request $request)
    {
        $data = $request->validate([
            'payment_id' => 'required|exists:payments,id',
            'order_id'   => 'required|string',
        ]);

        $payment = Payment::with('plan')->findOrFail($data['payment_id']);

        if ($payment->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->ResError('Unauthorized', 403);
        }

        // Idempotency guard
        if ($payment->status === 'completed') {
            return $this->ResSuccess(['status' => 'already_processed']);
        }

        if ($payment->transaction_id && $payment->transaction_id !== $data['order_id']) {
            return $this->ResError(['message' => 'PayPal order mismatch'], 422);
        }

        $paypal = new PayPalClient;
        $paypal->setApiCredentials(config('paypal'));
        $paypal->getAccessToken();

        try {
            $result = $paypal->capturePaymentOrder($data['order_id']);
        } catch (Throwable $e) {
            Log::error('PayPal capturePayment exception', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
                'payment' => $payment->id,
            ]);
            $payment->update(['status' => 'failed']);
            return $this->ResError(['message' => 'Payment capture failed'], 422);
        }

        if (($result['status'] ?? null) === 'COMPLETED') {
            $capture = data_get($result, 'purchase_units.0.payments.captures.0', []);
            $capturedAmount = data_get($capture, 'amount.value');
            $capturedCurrency = data_get($capture, 'amount.currency_code');

            if ((float) $capturedAmount !== (float) $payment->amount || strtoupper((string) $capturedCurrency) !== 'USD') {
                Log::warning('PayPal capture mismatch', [
                    'payment' => $payment->id,
                    'expected_amount' => $payment->amount,
                    'captured_amount' => $capturedAmount,
                    'captured_currency' => $capturedCurrency,
                ]);
                $payment->update(['status' => 'failed']);
                return $this->ResError(['message' => 'Payment amount mismatch'], 422);
            }

            $receiptNumber = 'T' . rand(100000, 999999) . now()->format('Ymd');

            $payment->update([
                'status'         => 'completed',
                'transaction_id' => data_get($capture, 'id', $payment->transaction_id),
                'paid_at'        => now(),
                'receipt_number' => $receiptNumber,
            ]);

            // Fetch metadata to activate subscription
            $metadata = json_decode(data_get($result, 'purchase_units.0.custom_id', '{}'), true) ?: [];
            $userId      = $metadata['user_id'] ?? $payment->user_id;
            $planId      = $metadata['plan_id'] ?? $payment->plan_id;
            $productCode = $metadata['product_code'] ?? ($payment->plan->product_code ?? null);

            // Notify user
            try {
                $user = User::find($userId);
                if ($user && $payment->plan) {
                    $receipt = [
                        'receipt_number' => $payment->receipt_number,
                        'product_code'   => $payment->plan->product_code,
                        'plan_name'      => $payment->plan->name,
                        'amount'         => number_format($payment->amount, 2) . ' USD',
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
                    $this->createOrUpdateSubscription($user, $plan, $productCode, $payment->id);
                }
            }
        } else {
            $payment->update(['status' => 'failed']);
        }

        return $this->ResSuccess(['status' => $payment->status]);
    }
}

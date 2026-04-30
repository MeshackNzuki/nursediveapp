<?php

namespace App\Http\Controllers\Payments\Stripe;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Webhook;
use App\Models\Payment;
use App\Models\User;
use App\Models\Plan;
use App\Http\Traits\ManageSubscriptions;
use Illuminate\Support\Facades\Log;

class StripeWebhookController extends Controller
{
    use ManageSubscriptions;

    public function handle(Request $request)
    {
        Log::info('--- Stripe Webhook Hit ---');
        Log::info('Raw Payload: ' . $request->getContent());

        Stripe::setApiKey(env('STRIPE_SECRET'));
        $endpointSecret = env('STRIPE_WEBHOOK_SECRET');
        $sigHeader = $request->header('Stripe-Signature');
        $payload   = $request->getContent();

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch (\UnexpectedValueException $e) {
            Log::error('Invalid Stripe payload: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error('Invalid Stripe signature: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $intent   = $event->data->object;
            $metadata = (object) ($intent->metadata ?? []);
            $userId      = $metadata->user_id ?? null;
            $planId      = $metadata->plan_id ?? null;
            $productCode = $metadata->product_code ?? null;
            $paymentId   = $metadata->payment_id ?? null;

            $payment = $paymentId ? Payment::find($paymentId) : null;

            if ($payment && $payment->status !== 'completed') {
                $receiptNumber = 'T' . rand(100000, 999999) . now()->format('Ymd');
                $chargeId      = $intent->charges->data[0]->id ?? $intent->id;

                $payment->update([
                    'status'         => 'completed',
                    'transaction_id' => $chargeId,
                    'receipt_number' => $receiptNumber,
                ]);

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

                if ($userId && $planId && $productCode) {
                    $user = User::find($userId);
                    $plan = Plan::find($planId);

                    if ($user && $plan) {
                        $this->createOrUpdateSubscription($user, $plan, $productCode, $paymentId);
                    }
                }
            }
        }

        if ($event->type === 'payment_intent.payment_failed') {
            $intent    = $event->data->object;
            $metadata  = (object) ($intent->metadata ?? []);
            $paymentId = $metadata->payment_id ?? null;

            if ($paymentId && ($payment = Payment::find($paymentId))) {
                $payment->update(['status' => 'failed']);
            }
        }

        return 1;
    }
}
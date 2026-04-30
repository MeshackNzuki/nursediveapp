<?php

namespace App\Http\Controllers\Payments\Stripe;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Payment;
use App\Models\Plan;

class StripeController extends Controller
{
    /**
     * Handle creating a Stripe PaymentIntent
     */
    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $data = $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $plan = Plan::findOrFail($data['plan_id']);

        // First create a local payment record
        $payment = Payment::create([
            'user_id' => auth()->id(),
            'plan_id' => $plan->id,
            'amount'  => $plan->price,
            'status'  => 'pending',
            'source' => 'stripe',
        ]);

        // Convert to cents
        $amountInCents = $plan->price * 100;

        // Create PaymentIntent with metadata linking back to our DB
        $paymentIntent = PaymentIntent::create([
            'amount' => $amountInCents,
            'currency' => 'usd',
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
            'metadata' => [
                'user_id'      => auth()->id(),
                'plan_id'      => $plan->id,
                'product_code' => $plan->product_code,
                'payment_id'   => $payment->id, // optional
            ]
        ]);
        return $this->ResSuccess([
            'clientSecret' => $paymentIntent->client_secret,
            'paymentId' => $payment->id
        ]);
    }
}

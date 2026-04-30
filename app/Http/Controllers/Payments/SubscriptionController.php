<?php

namespace App\Http\Controllers\Payments;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Payment;

class SubscriptionController extends Controller
{
    public function checkAccess(Request $request)
    {
        $user = $request->user();
        $paymentId = $request->query('payment_id');

        // Find the payment record
        $payment = $paymentId ? Payment::find($paymentId) : null;

        // Handle subscriptions (assuming User hasOne UserSubscription)
        $subscriptionRecord = $user->subscription()->first();

        $subscriptions = [];
        if ($subscriptionRecord) {
            $subscriptions = is_string($subscriptionRecord->subscriptions)
                ? json_decode($subscriptionRecord->subscriptions, true)
                : $subscriptionRecord->subscriptions;
        }

        return $this->ResSuccess([
            'subscriptions'  => $subscriptions,
            'payment_status' => $payment->status ?? '',
            'plan'           => $payment->plan ?? null,
        ]);
    }
}

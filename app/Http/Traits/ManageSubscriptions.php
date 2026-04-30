<?php

namespace App\Http\Traits;

use App\Models\User;
use App\Models\Plan;
use App\Models\UserSubscription;
use Carbon\Carbon;

trait ManageSubscriptions
{
    public function createOrUpdateSubscription(User $user, Plan $plan, string $productCode, ?int $paymentId = null)
    {
        //reset notification flags  'expired_sent' => 0,  'expiring_sent' => 0,
        $user->update([
            'subscription_expired_sent' => 0,
            'subscription_expiring_sent' => 0,
        ]);

        // Fetch or create the UserSubscription record
        $userSub = UserSubscription::firstOrCreate(
            ['user_id' => $user->id],
            ['subscriptions' => json_encode([])]
        );

        // Decode existing subscriptions JSON
        $subscriptions = is_string($userSub->subscriptions)
            ? json_decode($userSub->subscriptions, true) ?: []
            : ($userSub->subscriptions ?? []);

        $duration = (int) $plan->duration_days;

        // If the product already exists, extend expiry
        if (isset($subscriptions[$productCode])) {
            $current = $subscriptions[$productCode][0];
            $currentExpiry = Carbon::parse($current['expires']);
            $newExpiry = $currentExpiry->greaterThan(now())
                ? $currentExpiry->addDays($duration)
                : now()->addDays($duration);

            $subscriptions[$productCode][0] = [
                'plan_id'      => $plan->id,
                'plan_name'    => $plan->name,
                'product_code' => $productCode,
                'expires'      => $newExpiry->toDateString(),
                'payment_id'   => $paymentId,
            ];
        } else {
            // New subscription
            $subscriptions[$productCode] = [[
                'plan_id'      => $plan->id,
                'plan_name'    => $plan->name,
                'product_code' => $productCode,
                'expires'      => now()->addDays($duration)->toDateString(),
                'payment_id'   => $paymentId,
            ]];
        }

        // Save back to DB
        $userSub->subscriptions = json_encode($subscriptions);
        $userSub->save();

        return $subscriptions;
    }
}
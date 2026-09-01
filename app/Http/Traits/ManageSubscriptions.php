<?php

namespace App\Http\Traits;

use App\Models\User;
use App\Models\Plan;
use App\Models\UserSubscription;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

trait ManageSubscriptions
{
    public function createOrUpdateSubscription(User $user, Plan $plan, string $productCode, ?int $paymentId = null)
    {
        $notificationFlags = $user->subscription_notification_flags ?? [];
        if (is_string($notificationFlags)) {
            $notificationFlags = json_decode($notificationFlags, true) ?: [];
        }

        foreach (['subscription_expired', 'subscription_expiring', 'trial_ended', 'trial_ending'] as $event) {
            unset($notificationFlags[$productCode][$event]);
        }

        $userUpdates = [];

        if (Schema::hasColumn('users', 'subscription_notification_flags')) {
            $userUpdates['subscription_notification_flags'] = $notificationFlags;
        }

        foreach (['subscription_expired_sent', 'subscription_expiring_sent', 'trial_ending_sent', 'trial_ended_sent'] as $column) {
            if (Schema::hasColumn('users', $column)) {
                $userUpdates[$column] = 0;
            }
        }

        if ($userUpdates) {
            $user->forceFill($userUpdates)->save();
        }

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

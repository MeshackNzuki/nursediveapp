<?php

namespace App\Http\Controllers\Notifications;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Nursing\ExamAttempt as NA;
use App\Models\Teas\ExamAttempt as TA;
use App\Models\Nclex\ExamAttempt as NCA;
use App\Notifications\{
    SubscriptionExpiring,
    SubscriptionExpired,
    TrialEnding,
    TrialEnded,
    FirstEngagement,
    DailyNotificationSummary
};
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Collection;

class ClientNotificationController extends Controller
{
    protected const PRODUCTS = ['nursing', 'teas', 'nclex'];

    protected const ATTEMPT_MODELS = [
        'nursing' => NA::class,
        'teas' => TA::class,
        'nclex' => NCA::class,
    ];

    protected const PRICING_ROUTES = [
        'nursing' => '/nursing-pricing',
        'teas' => '/teas-pricing',
        'nclex' => '/nclex-pricing',
    ];

    protected const LEGACY_NOTIFICATION_COLUMNS = [
        'subscription_expired' => 'subscription_expired_sent',
        'subscription_expiring' => 'subscription_expiring_sent',
        'trial_ending' => 'trial_ending_sent',
        'trial_ended' => 'trial_ended_sent',
    ];

    protected array $summary = [
        'expiring' => 0,
        'expired' => 0,
        'trial_ending' => 0,
        'trial_ended' => 0,
        'engagement' => 0,
    ];

    protected $usersByProduct = [];

    protected function productPricingUrl(string $product, string $event): string
    {
        $baseUrl = rtrim(
            config('app.frontend_url', env('APP_FRONTEND_URL', 'https://app.nursedive.com')),
            '/'
        );
        $path = self::PRICING_ROUTES[$product] ?? '/subscription';
        $query = http_build_query([
            'source' => 'email',
            'campaign' => $event,
            'product' => $product,
        ]);

        return "{$baseUrl}{$path}?{$query}";
    }

    protected function normalizeNotificationFlags($flags): array
    {
        if (is_string($flags)) {
            return json_decode($flags, true) ?: [];
        }

        return is_array($flags) ? $flags : [];
    }

    protected function notificationSent(User $user, string $product, string $event): bool
    {
        if (Schema::hasColumn('users', 'subscription_notification_flags')) {
            $flags = $this->normalizeNotificationFlags($user->subscription_notification_flags ?? []);
            return filled($flags[$product][$event] ?? null);
        }

        $legacyColumn = self::LEGACY_NOTIFICATION_COLUMNS[$event] ?? null;
        return $legacyColumn ? (bool) ($user->{$legacyColumn} ?? false) : false;
    }

    protected function markNotificationSent(User $user, string $product, string $event): void
    {
        if (Schema::hasColumn('users', 'subscription_notification_flags')) {
            $flags = $this->normalizeNotificationFlags($user->subscription_notification_flags ?? []);
            $flags[$product][$event] = now()->toDateTimeString();

            $user->forceFill(['subscription_notification_flags' => $flags])->save();
            $user->subscription_notification_flags = $flags;
            return;
        }

        $legacyColumn = self::LEGACY_NOTIFICATION_COLUMNS[$event] ?? null;
        if ($legacyColumn && Schema::hasColumn('users', $legacyColumn)) {
            $user->forceFill([$legacyColumn => 1])->save();
            $user->{$legacyColumn} = 1;
        }
    }

    protected function usersForProduct(string $product): Collection
    {
        if (!isset(self::ATTEMPT_MODELS[$product])) {
            return collect();
        }

        return $this->usersByProduct[$product] ??= $this->loadUsersWithAttemptsAndSubscriptions($product);
    }

    protected function loadUsersWithAttemptsAndSubscriptions(string $product): Collection
    {
        $attemptModel = self::ATTEMPT_MODELS[$product];
        $userIds = $attemptModel::query()
            ->select('user_id')
            ->whereNotNull('user_id')
            ->distinct()
            ->pluck('user_id');

        if ($userIds->isEmpty()) {
            return collect();
        }

        return User::with('subscription')
            ->whereIn('id', $userIds)
            ->whereHas('subscription')
            ->get()
            ->filter(fn($user) => filled($user->subscription?->subscriptions));
    }

    protected function eachUserSubscription(string $product, callable $callback): void
    {
        foreach ($this->usersForProduct($product) as $user) {
            $subscriptions = $user->subscription->subscriptions ?? [];
            if (!$subscriptions || !isset($subscriptions[$product])) continue;

            foreach ($subscriptions[$product] as $plan) {
                $callback($user, $product, (object) $plan);
            }
        }
    }

    // ======================================================
    // 🔔 NOTIFICATION METHODS
    // ======================================================

    public function notifyFreeTrialEnded(): void
    {

        foreach (self::PRODUCTS as $product) {
            $this->eachUserSubscription($product, function ($user, $product, $plan) {
                if (
                    $plan->plan_name === 'trial' &&
                    Carbon::parse($plan->expires)->isPast() &&
                    !$this->notificationSent($user, $product, 'trial_ended')
                ) {
                    try {
                        $user->notify(new TrialEnded(
                            $user,
                            $product,
                            $plan->expires,
                            $this->productPricingUrl($product, 'trial_ended')
                        ));
                        $this->markNotificationSent($user, $product, 'trial_ended');
                        $this->summary['trial_ended']++;
                    } catch (\Throwable $e) {
                        Log::error("❌ TrialEnded failed for user {$user->id}: {$e->getMessage()}");
                    }
                } else {
                }
            });
        }
    }

    public function notifyFreeTrialEnding(): void
    {
        $target = Carbon::now()->addDays(2)->toDateString();


        foreach (self::PRODUCTS as $product) {
            $this->eachUserSubscription($product, function ($user, $product, $plan) use ($target) {
                if (
                    $plan->plan_name === 'trial' &&
                    $plan->expires === $target &&
                    !$this->notificationSent($user, $product, 'trial_ending')
                ) {
                    try {
                        $user->notify(new TrialEnding(
                            $user,
                            $product,
                            $plan->expires,
                            $this->productPricingUrl($product, 'trial_ending')
                        ));
                        $this->markNotificationSent($user, $product, 'trial_ending');
                        $this->summary['trial_ending']++;
                    } catch (\Throwable $e) {
                        Log::error("❌ TrialEnding failed for user {$user->id}: {$e->getMessage()}");
                    }
                } else {
                }
            });
        }
    }

    public function notifyExpiredSubscriptions(): void
    {
        $today = Carbon::today()->toDateString();

        foreach (self::PRODUCTS as $product) {
            $this->eachUserSubscription($product, function ($user, $product, $plan) use ($today) {
                if (
                    $plan->plan_name !== 'trial' &&
                    $plan->expires === $today &&
                    !$this->notificationSent($user, $product, 'subscription_expired')
                ) {
                    try {
                        $user->notify(new SubscriptionExpired(
                            $user,
                            $product,
                            $plan->expires,
                            $this->productPricingUrl($product, 'subscription_expired')
                        ));
                        $this->markNotificationSent($user, $product, 'subscription_expired');
                        $this->summary['expired']++;
                    } catch (\Throwable $e) {
                        Log::error("❌ Expired notice failed for user {$user->id}: {$e->getMessage()}");
                    }
                } else {
                }
            });
        }
    }

    public function notifyExpiringSubscriptions(): void
    {
        $target = Carbon::now()->addDays(3)->toDateString();

        foreach (self::PRODUCTS as $product) {
            $this->eachUserSubscription($product, function ($user, $product, $plan) use ($target) {
                if (
                    $plan->plan_name !== 'trial' &&
                    $plan->expires === $target &&
                    !$this->notificationSent($user, $product, 'subscription_expiring')
                ) {
                    try {
                        $user->notify(new SubscriptionExpiring(
                            $user,
                            $product,
                            $plan->expires,
                            $this->productPricingUrl($product, 'subscription_expiring')
                        ));
                        $this->markNotificationSent($user, $product, 'subscription_expiring');
                        $this->summary['expiring']++;
                    } catch (\Throwable $e) {
                        Log::error("❌ Expiring notice failed for user {$user->id}: {$e->getMessage()}");
                    }
                } else {
                }
            });
        }
    }

    public function notifyFirstEngagement(): void
    {

        foreach (self::PRODUCTS as $product) {
            foreach ($this->usersForProduct($product) as $user) {
                if ($user->created_at->lte(Carbon::now()->subDays(3)) && !$user->first_engagement_sent) {
                    try {
                        $user->notify(new FirstEngagement());
                        $user->update(['first_engagement_sent' => 1]);
                        $user->first_engagement_sent = 1;
                        $this->summary['engagement']++;
                    } catch (\Throwable $e) {
                        Log::error("❌ First engagement failed for user {$user->id}: {$e->getMessage()}");
                    }
                } else {
                }
            }
        }
    }

    public function sendDailySummary(): void
    {
        $emails = json_decode(env('ADMIN_NOTIFICATION_EMAILS'), true);
        if (!is_array($emails)) {
            $emails = array_map('trim', explode(',', env('ADMIN_NOTIFICATION_EMAILS', 'info@nursedive.com')));
        }

        foreach ($emails as $email) {
            try {
                Notification::route('mail', $email)
                    ->notify(new DailyNotificationSummary($this->summary));
            } catch (\Throwable $e) {
                Log::error("❌ Daily summary failed for {$email}: {$e->getMessage()}");
            }
        }
    }
}

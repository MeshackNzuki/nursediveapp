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
use Illuminate\Support\Collection;

class ClientNotificationController extends Controller
{
    protected const PRODUCTS = ['nursing', 'teas', 'nclex'];

    protected const ATTEMPT_MODELS = [
        'nursing' => NA::class,
        'teas' => TA::class,
        'nclex' => NCA::class,
    ];

    protected array $summary = [
        'expiring' => 0,
        'expired' => 0,
        'trial_ending' => 0,
        'trial_ended' => 0,
        'engagement' => 0,
    ];

    protected $usersByProduct = [];

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
                    !$user->trial_ended_sent
                ) {
                    try {
                        $user->notify(new TrialEnded($user, $product, $plan->expires));
                        $user->update(['trial_ended_sent' => 1]);
                        $user->trial_ended_sent = 1;
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
                    !$user->trial_ending_sent
                ) {
                    try {
                        $user->notify(new TrialEnding($user, $product, $plan->expires));
                        $user->update(['trial_ending_sent' => 1]);
                        $user->trial_ending_sent = 1;
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
                    !$user->expired_sent
                ) {
                    try {
                        $user->notify(new SubscriptionExpired($user, $product, $plan));
                        $user->update(['expired_sent' => 1]);
                        $user->expired_sent = 1;
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
                    !$user->expiring_sent
                ) {
                    try {
                        $user->notify(new SubscriptionExpiring($user, $product, $plan));
                        $user->update(['expiring_sent' => 1]);
                        $user->expiring_sent = 1;
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
                        $user->notify(new FirstEngagement($user, $product));
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

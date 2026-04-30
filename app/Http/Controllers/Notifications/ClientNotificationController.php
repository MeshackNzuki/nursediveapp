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

class ClientNotificationController extends Controller
{
    protected array $summary = [
        'expiring' => 0,
        'expired' => 0,
        'trial_ending' => 0,
        'trial_ended' => 0,
        'engagement' => 0,
    ];

    protected $usersByProduct = [];

    public function __construct()
    {
        $this->loadUsersWithAttemptsAndSubscriptions();
    }

    protected function loadUsersWithAttemptsAndSubscriptions(): void
    {
        $this->usersByProduct = [
            'nursing' => User::with('subscription')
                ->whereIn('id', NA::pluck('user_id')->unique())
                ->get()
                ->filter(fn($u) => $u->subscription && $u->subscription->subscriptions),

            'teas' => User::with('subscription')
                ->whereIn('id', TA::pluck('user_id')->unique())
                ->get()
                ->filter(fn($u) => $u->subscription && $u->subscription->subscriptions),

            'nclex' => User::with('subscription')
                ->whereIn('id', NCA::pluck('user_id')->unique())
                ->get()
                ->filter(fn($u) => $u->subscription && $u->subscription->subscriptions),
        ];
    }

    protected function eachUserSubscription(string $product, callable $callback): void
    {
        foreach ($this->usersByProduct[$product] as $user) {
            $subscriptions = json_decode($user->subscription->subscriptions ?? '', true);
            if (!$subscriptions || !isset($subscriptions[$product])) continue;

            foreach ($subscriptions[$product] as $plan) {
                $callback($user->fresh(), $product, (object) $plan);
            }
        }
    }

    // ======================================================
    // 🔔 NOTIFICATION METHODS
    // ======================================================

    public function notifyFreeTrialEnded(): void
    {

        foreach (['nursing', 'teas', 'nclex'] as $product) {
            $this->eachUserSubscription($product, function ($user, $product, $plan) {
                if (
                    $plan->plan_name === 'trial' &&
                    Carbon::parse($plan->expires)->isPast() &&
                    !$user->trial_ended_sent
                ) {
                    try {
                        $user->notify(new TrialEnded($user, $product, $plan->expires));
                        $user->update(['trial_ended_sent' => 1]);
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


        foreach (['nursing', 'teas', 'nclex'] as $product) {
            $this->eachUserSubscription($product, function ($user, $product, $plan) use ($target) {
                if (
                    $plan->plan_name === 'trial' &&
                    $plan->expires === $target &&
                    !$user->trial_ending_sent
                ) {
                    try {
                        $user->notify(new TrialEnding($user, $product, $plan->expires));
                        $user->update(['trial_ending_sent' => 1]);
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

        foreach (['nursing', 'teas', 'nclex'] as $product) {
            $this->eachUserSubscription($product, function ($user, $product, $plan) use ($today) {
                if (
                    $plan->plan_name !== 'trial' &&
                    $plan->expires === $today &&
                    !$user->expired_sent
                ) {
                    try {
                        $user->notify(new SubscriptionExpired($user, $product, $plan));
                        $user->update(['expired_sent' => 1]);
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

        foreach (['nursing', 'teas', 'nclex'] as $product) {
            $this->eachUserSubscription($product, function ($user, $product, $plan) use ($target) {
                if (
                    $plan->plan_name !== 'trial' &&
                    $plan->expires === $target &&
                    !$user->expiring_sent
                ) {
                    try {
                        $user->notify(new SubscriptionExpiring($user, $product, $plan));
                        $user->update(['expiring_sent' => 1]);
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

        foreach (['nursing', 'teas', 'nclex'] as $product) {
            foreach ($this->usersByProduct[$product] as $user) {
                $user = $user->fresh();

                if ($user->created_at->lte(Carbon::now()->subDays(3)) && !$user->first_engagement_sent) {
                    try {
                        $user->notify(new FirstEngagement($user, $product));
                        $user->update(['first_engagement_sent' => 1]);
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
            $emails = array_map('trim', explode(',', env('ADMIN_NOTIFICATION_EMAILS', 'nursedivelearning@gmail.com')));
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

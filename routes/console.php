<?php

use App\Http\Controllers\Notifications\ClientNotificationController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

/**
 * Wrap scheduled notification tasks with consistent logging.
 */
$safeSchedule = function (string $name, callable $callback) {
    return function () use ($name, $callback) {
        Log::info("[Scheduler] Starting job: {$name} @ " . now());

        try {
            $callback();
            Log::info("[Scheduler] Completed job: {$name} @ " . now());
        } catch (\Throwable $e) {
            Log::error("[Scheduler] Failed job: {$name}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    };
};

// =====================================================
// Scheduled Jobs
// =====================================================

Schedule::call($safeSchedule(
    'notifyExpiringSubscriptions',
    fn() => (new ClientNotificationController())->notifyExpiringSubscriptions()
))->name('notify-expiring-subscriptions')
    ->dailyAt('08:00')
    ->withoutOverlapping(30);

Schedule::call($safeSchedule(
    'notifyExpiredSubscriptions',
    fn() => (new ClientNotificationController())->notifyExpiredSubscriptions()
))->name('notify-expired-subscriptions')
    ->dailyAt('08:10')
    ->withoutOverlapping(30);

Schedule::call($safeSchedule(
    'notifyFreeTrialEnded',
    fn() => (new ClientNotificationController())->notifyFreeTrialEnded()
))->name('notify-free-trial-ended')
    ->dailyAt('08:20')
    ->withoutOverlapping(30);

Schedule::call($safeSchedule(
    'notifyFreeTrialEnding',
    fn() => (new ClientNotificationController())->notifyFreeTrialEnding()
))->name('notify-free-trial-ending')
    ->dailyAt('08:30')
    ->withoutOverlapping(30);

Schedule::call($safeSchedule(
    'notifyFirstEngagement',
    fn() => (new ClientNotificationController())->notifyFirstEngagement()
))->name('notify-first-engagement')
    ->dailyAt('08:40')
    ->withoutOverlapping(30);

// Optional daily summary (disabled)
// Schedule::call($safeSchedule(
//     'sendDailySummary',
//     fn() => (new ClientNotificationController())->sendDailySummary()
// ))->name('send-daily-notification-summary')
//     ->dailyAt('21:30')
//     ->withoutOverlapping(30);

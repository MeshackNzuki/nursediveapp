<?php

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;
use App\Http\Controllers\Notifications\ClientNotificationController;

$notifier = new ClientNotificationController();

/**
 * A safe job wrapper that logs start, success, and failure.
 */
function safeSchedule(string $name, callable $callback)
{
    return function () use ($name, $callback) {
        // Log::info("🔹 [Scheduler] Starting job: {$name} @ " . now());
        try {
            $callback();
            // Log::info("✅ [Scheduler] Completed job: {$name} @ " . now());
        } catch (Throwable $e) {
            // Log::error("❌ [Scheduler] Failed job: {$name}", [
            //     'error' => $e->getMessage(),
            //     'trace' => $e->getTraceAsString(),
            // ]);
        }
    };
}

// =====================================================
// Scheduled Jobs (run every cron tick — every 5 minutes)
// =====================================================

Schedule::call(safeSchedule(
    'notifyExpiringSubscriptions',
    fn() => $notifier->notifyExpiringSubscriptions()
));

Schedule::call(safeSchedule(
    'notifyExpiredSubscriptions',
    fn() => $notifier->notifyExpiredSubscriptions()
))->after(fn() => sleep(30));

Schedule::call(safeSchedule(
    'notifyFreeTrialEnded',
    fn() => $notifier->notifyFreeTrialEnded()
))->after(fn() => sleep(60));

Schedule::call(safeSchedule(
    'notifyFreeTrialEnding',
    fn() => $notifier->notifyFreeTrialEnding()
))->after(fn() => sleep(90));

Schedule::call(safeSchedule(
    'notifyFirstEngagement',
    fn() => $notifier->notifyFirstEngagement()
))->after(fn() => sleep(120));

// Optional daily summary (disabled)
// Schedule::call(safeSchedule(
//     'sendDailySummary',
//     fn() => $notifier->sendDailySummary()
// ))->dailyAt('21:30');
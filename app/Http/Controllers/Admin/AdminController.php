<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Nursing\ExamAttempt  as NA;
use App\Models\Teas\ExamAttempt as TA;
use App\Models\Nclex\ExamAttempt as NCA;
use App\Models\User;
use App\Models\Payment;
use App\Models\ExamFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Carbon\Carbon;

class AdminController extends Controller
{
    private function activeUsersSince(Carbon $since): int
    {
        return User::where('last_seen_at', '>=', $since)->count();
    }

    private function withLastActive($query)
    {
        return $query->select('users.*')->selectRaw('users.last_seen_at as last_active');
    }

    public function dashData()
    {
        $now = now();
        $safeGrowth = function (float|int $current, float|int $previous): float {
            if ($previous <= 0) {
                return $current > 0 ? 100.0 : 0.0;
            }

            return round((($current - $previous) / $previous) * 100, 1);
        };

        // Payments
        $teasAmount = (float) Payment::where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'teas'))
            ->sum('amount');

        $nclexAmount = (float) Payment::where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'nclex'))
            ->sum('amount');

        $nursingAmount = (float) Payment::where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'nursing'))
            ->sum('amount');

        $teasPaymentsCount = Payment::where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'teas'))
            ->count();

        $nursingPaymentsCount = Payment::where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'nursing'))
            ->count();

        $nclexPaymentsCount = Payment::where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'nclex'))
            ->count();

        $teasUniquePayers = Payment::where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'teas'))
            ->distinct('user_id')
            ->count('user_id');

        $nursingUniquePayers = Payment::where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'nursing'))
            ->distinct('user_id')
            ->count('user_id');

        $nclexUniquePayers = Payment::where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'nclex'))
            ->distinct('user_id')
            ->count('user_id');

        $totalPayments = (float) Payment::where('status', 'completed')->sum('amount');
        $totalPaymentsCount = Payment::where('status', 'completed')->count();
        $uniquePayers = Payment::where('status', 'completed')
            ->distinct('user_id')
            ->count('user_id');

        // Active users based on real authenticated request activity.
        $active24h = $this->activeUsersSince($now->copy()->subHours(24));
        $active12h = $this->activeUsersSince($now->copy()->subHours(12));
        $active6h = $this->activeUsersSince($now->copy()->subHours(6));

        // Rolling "active in the last N days" windows (last_seen_at is refreshed on every authenticated request).
        $activeByDays = [];
        foreach ([2, 3, 4, 5, 6, 7, 14, 30] as $days) {
            $activeByDays["active_{$days}d"] = $this->activeUsersSince($now->copy()->subDays($days));
        }

        // 7-day retention: of users who signed up 7 to 14 days ago, how many were seen in the last 7 days.
        $retentionCohort = User::whereBetween('created_at', [$now->copy()->subDays(14), $now->copy()->subDays(7)]);
        $retentionCohortSize = (clone $retentionCohort)->count();
        $retentionRetained = (clone $retentionCohort)->where('last_seen_at', '>=', $now->copy()->subDays(7))->count();
        $retention7dPct = $retentionCohortSize > 0 ? round(($retentionRetained / $retentionCohortSize) * 100, 1) : 0.0;

        // Practice activity across all three products (attempt tables).
        $attemptsLast7 = TA::where('created_at', '>=', $now->copy()->subDays(7))->count()
            + NA::where('created_at', '>=', $now->copy()->subDays(7))->count()
            + NCA::where('created_at', '>=', $now->copy()->subDays(7))->count();
        $attemptsLast30 = TA::where('created_at', '>=', $now->copy()->subDays(30))->count()
            + NA::where('created_at', '>=', $now->copy()->subDays(30))->count()
            + NCA::where('created_at', '>=', $now->copy()->subDays(30))->count();


        // Unique users who have taken exams
        $teasUsers = TA::distinct('user_id')->count('user_id');
        $nursingUsers = NA::distinct('user_id')->count('user_id');
        $nclexUsers = NCA::distinct('user_id')->count('user_id');
        $teasAttempts = TA::count();
        $nursingAttempts = NA::count();
        $nclexAttempts = NCA::count();

        $totalUsers = User::count();

        $users = User::with('subscription')->get();

        $nursingSubscribed = 0;
        $teasSubscribed = 0;
        $nclexSubscribed = 0;
        $allSubscribed = 0;
        $onTrialOnly = 0;

        foreach ($users as $user) {
            if (!$user->subscription || !$user->subscription->subscriptions) continue;

            $subscriptions = $user->subscription->subscriptions;
            if (is_string($subscriptions)) {
                $subscriptions = json_decode($subscriptions, true) ?? [];
            }
            if (!is_array($subscriptions)) {
                $subscriptions = [];
            }

            $hasActive = false;
            $hasLiveTrial = false;

            foreach (['nursing', 'teas', 'nclex'] as $product) {
                if (empty($subscriptions[$product]) || !is_array($subscriptions[$product])) continue;

                foreach ($subscriptions[$product] as $plan) {
                    if (empty($plan['expires'])) continue;

                    $expires = Carbon::parse($plan['expires']);
                    $planName = strtolower((string) ($plan['plan_name'] ?? $plan['name'] ?? ''));

                    if ($planName === 'trial') {
                        if ($expires->isFuture()) $hasLiveTrial = true;
                        continue;
                    }
                    if (!$expires->isFuture()) {
                        continue;
                    }

                    if ($product === 'nursing') $nursingSubscribed++;
                    if ($product === 'teas') $teasSubscribed++;
                    if ($product === 'nclex') $nclexSubscribed++;
                    $hasActive = true;
                    break; // stop checking further plans for this product
                }
            }

            if ($hasActive) $allSubscribed++;
            if (!$hasActive && $hasLiveTrial) $onTrialOnly++;
        }

        $signupLast30 = User::where('created_at', '>=', $now->copy()->subDays(30))->count();
        $signupPrev30 = User::whereBetween('created_at', [
            $now->copy()->subDays(60),
            $now->copy()->subDays(30),
        ])->count();

        $paymentsLast30 = (float) Payment::where('status', 'completed')
            ->whereRaw('COALESCE(paid_at, created_at) >= ?', [$now->copy()->subDays(30)])
            ->sum('amount');

        $paymentsPrev30 = (float) Payment::where('status', 'completed')
            ->whereRaw('COALESCE(paid_at, created_at) >= ?', [$now->copy()->subDays(60)])
            ->whereRaw('COALESCE(paid_at, created_at) < ?', [$now->copy()->subDays(30)])
            ->sum('amount');

        $paymentsCountLast30 = Payment::where('status', 'completed')
            ->whereRaw('COALESCE(paid_at, created_at) >= ?', [$now->copy()->subDays(30)])
            ->count();

        $paymentsCountPrev30 = Payment::where('status', 'completed')
            ->whereRaw('COALESCE(paid_at, created_at) >= ?', [$now->copy()->subDays(60)])
            ->whereRaw('COALESCE(paid_at, created_at) < ?', [$now->copy()->subDays(30)])
            ->count();

        $trendStart = $now->copy()->subDays(13)->startOfDay();

        $signupTrendRaw = User::selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->where('created_at', '>=', $trendStart)
            ->groupBy('day')
            ->orderBy('day')
            ->pluck('total', 'day');

        $revenueTrendRaw = Payment::selectRaw('DATE(COALESCE(paid_at, created_at)) as day, SUM(amount) as total')
            ->where('status', 'completed')
            ->whereRaw('COALESCE(paid_at, created_at) >= ?', [$trendStart])
            ->groupBy(DB::raw('DATE(COALESCE(paid_at, created_at))'))
            ->orderBy('day')
            ->pluck('total', 'day');

        $activityRows = DB::query()
            ->fromSub(
                TA::selectRaw('user_id, DATE(created_at) as day')->where('created_at', '>=', $trendStart)
                    ->unionAll(NA::selectRaw('user_id, DATE(created_at) as day')->where('created_at', '>=', $trendStart))
                    ->unionAll(NCA::selectRaw('user_id, DATE(created_at) as day')->where('created_at', '>=', $trendStart)),
                'activity'
            )
            ->selectRaw('day, COUNT(*) as attempts, COUNT(DISTINCT user_id) as learners')
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $activeLearnersLast7 = DB::query()
            ->fromSub(
                TA::selectRaw('user_id')->where('created_at', '>=', $now->copy()->subDays(7))
                    ->unionAll(NA::selectRaw('user_id')->where('created_at', '>=', $now->copy()->subDays(7)))
                    ->unionAll(NCA::selectRaw('user_id')->where('created_at', '>=', $now->copy()->subDays(7))),
                'recent'
            )
            ->distinct()
            ->count('user_id');

        $labels = [];
        $signupsTrend = [];
        $revenueTrend = [];
        $attemptsTrend = [];
        $learnersTrend = [];

        $cursor = $trendStart->copy();
        while ($cursor->lte($now)) {
            $dayKey = $cursor->toDateString();
            $labels[] = $cursor->format('M j');
            $signupsTrend[] = (int) ($signupTrendRaw[$dayKey] ?? 0);
            $revenueTrend[] = round((float) ($revenueTrendRaw[$dayKey] ?? 0), 2);
            $attemptsTrend[] = (int) ($activityRows[$dayKey]->attempts ?? 0);
            $learnersTrend[] = (int) ($activityRows[$dayKey]->learners ?? 0);
            $cursor->addDay();
        }

        $payerConversionRate = $totalUsers > 0
            ? round(($uniquePayers / $totalUsers) * 100, 1)
            : 0.0;

        $subscriptionRate = $totalUsers > 0
            ? round(($allSubscribed / $totalUsers) * 100, 1)
            : 0.0;

        $avgRevenuePerPayer = $uniquePayers > 0
            ? round($totalPayments / $uniquePayers, 2)
            : 0.0;

        $avgRevenuePerPayment = $totalPaymentsCount > 0
            ? round($totalPayments / $totalPaymentsCount, 2)
            : 0.0;

        return $this->ResSuccess([
            'total_signups'     => $totalUsers,
            'twofour_hr_signups'     => User::where('created_at', '>=', $now->copy()->subDay())->count(),
            'onetwo_hr_signups'     => User::where('created_at', '>=', $now->copy()->subHours(12))->count(),
            'six_hr_signups'      => User::where('created_at', '>=', $now->copy()->subHours(6))->count(),
            'seven_days_signups'    => User::where('created_at', '>=', $now->copy()->subDays(7))->count(),

            'active_24hr'       => $active24h,
            'active_12hr'       => $active12h,
            'active_6hr'        => $active6h,
            ...$activeByDays,
            'retention_7d_pct'  => $retention7dPct,
            'retention_cohort_size' => $retentionCohortSize,
            'retention_retained' => $retentionRetained,
            'attempts_last_7_days' => $attemptsLast7,
            'attempts_last_30_days' => $attemptsLast30,
            'active_learners_last_7_days' => $activeLearnersLast7,
            'trial_only_users'  => $onTrialOnly,
            'signups_today'     => User::where('created_at', '>=', $now->copy()->startOfDay())->count(),

            'total_payments'    => $totalPayments,
            'teas_payments'     => $teasAmount,
            'nclex_payments'    => $nclexAmount,
            'nursing_payments'  => $nursingAmount,

            'teas_attempts'     => $teasAttempts,
            'nursing_attempts'  => $nursingAttempts,
            'nclex_attempts'    => $nclexAttempts,

            'teas_users'        => $teasUsers,
            'nclex_users'       => $nclexUsers,
            'nursing_users'     => $nursingUsers,
            'total_users'       => $totalUsers,
            'nursing_subscribed' => $nursingSubscribed,
            'teas_subscribed'    => $teasSubscribed,
            'nclex_subscribed'   => $nclexSubscribed,
            'all_subscribed'     => $allSubscribed,

            'signups_last_30_days' => $signupLast30,
            'signups_last_60_days' => User::where('created_at', '>=', $now->copy()->subDays(60))->count(),
            'signups_previous_30_days' => $signupPrev30,
            'signups_growth_pct' => $safeGrowth($signupLast30, $signupPrev30),

            'payments_last_30_days' => round($paymentsLast30, 2),
            'payments_previous_30_days' => round($paymentsPrev30, 2),
            'payments_growth_pct' => $safeGrowth($paymentsLast30, $paymentsPrev30),
            'payments_count_last_30_days' => $paymentsCountLast30,
            'payments_count_previous_30_days' => $paymentsCountPrev30,
            'payments_count_growth_pct' => $safeGrowth($paymentsCountLast30, $paymentsCountPrev30),

            'unique_payers' => $uniquePayers,
            'payer_conversion_rate_pct' => $payerConversionRate,
            'subscription_rate_pct' => $subscriptionRate,
            'avg_revenue_per_payer' => $avgRevenuePerPayer,
            'avg_revenue_per_payment' => $avgRevenuePerPayment,

            'teas_payments_count' => $teasPaymentsCount,
            'nursing_payments_count' => $nursingPaymentsCount,
            'nclex_payments_count' => $nclexPaymentsCount,
            'teas_unique_payers' => $teasUniquePayers,
            'nursing_unique_payers' => $nursingUniquePayers,
            'nclex_unique_payers' => $nclexUniquePayers,

            'trends' => [
                'labels' => $labels,
                'signups' => $signupsTrend,
                'revenue' => $revenueTrend,
                'attempts' => $attemptsTrend,
                'learners' => $learnersTrend,
            ],

            'product_breakdown' => [
                [
                    'code' => 'teas',
                    'name' => 'TEAS',
                    'revenue' => round($teasAmount, 2),
                    'payments_count' => $teasPaymentsCount,
                    'unique_payers' => $teasUniquePayers,
                    'active_subscribers' => $teasSubscribed,
                    'attempt_users' => $teasUsers,
                    'attempts' => $teasAttempts,
                    'revenue_share_pct' => $totalPayments > 0 ? round(($teasAmount / $totalPayments) * 100, 1) : 0.0,
                ],
                [
                    'code' => 'nursing',
                    'name' => 'Nursing',
                    'revenue' => round($nursingAmount, 2),
                    'payments_count' => $nursingPaymentsCount,
                    'unique_payers' => $nursingUniquePayers,
                    'active_subscribers' => $nursingSubscribed,
                    'attempt_users' => $nursingUsers,
                    'attempts' => $nursingAttempts,
                    'revenue_share_pct' => $totalPayments > 0 ? round(($nursingAmount / $totalPayments) * 100, 1) : 0.0,
                ],
                [
                    'code' => 'nclex',
                    'name' => 'NCLEX',
                    'revenue' => round($nclexAmount, 2),
                    'payments_count' => $nclexPaymentsCount,
                    'unique_payers' => $nclexUniquePayers,
                    'active_subscribers' => $nclexSubscribed,
                    'attempt_users' => $nclexUsers,
                    'attempts' => $nclexAttempts,
                    'revenue_share_pct' => $totalPayments > 0 ? round(($nclexAmount / $totalPayments) * 100, 1) : 0.0,
                ],
            ],
        ]);
    }


    public function usersPerProductOrAll(Request $request)
    {
        $query = $this->withLastActive(User::with(['roles', 'permissions', 'subscription']));

        $ids = collect();

        if ($request->boolean('nursing')) {
            $ids = $ids->merge(NA::pluck('user_id')->unique());
        }
        if ($request->boolean('teas')) {
            $ids = $ids->merge(TA::pluck('user_id')->unique());
        }
        if ($request->boolean('nclex')) {
            $ids = $ids->merge(NCA::pluck('user_id')->unique());
        }

        if ($ids->isNotEmpty()) {
            $query->whereIn('id', $ids->unique());
        }

        $now = Carbon::now();

        $users = $query->get()->map(function ($user) use ($now, $request) {
            $subscriptionFlag = false;

            if ($user->subscription && $user->subscription->subscriptions) {
                $subscriptions = json_decode($user->subscription->subscriptions, true);

                // Determine which product(s) to check
                $productsToCheck = collect();
                if ($request->boolean('nursing')) $productsToCheck->push('nursing');
                if ($request->boolean('teas')) $productsToCheck->push('teas');
                if ($request->boolean('nclex')) $productsToCheck->push('nclex');

                // If no filter, check all
                if ($productsToCheck->isEmpty()) {
                    $productsToCheck = collect(array_keys($subscriptions));
                }

                foreach ($productsToCheck as $product) {
                    if (!isset($subscriptions[$product])) continue;

                    foreach ($subscriptions[$product] as $plan) {
                        $expires = Carbon::parse($plan['expires']);
                        if (
                            $plan['plan_name'] !== 'trial' &&
                            $expires->isFuture()
                        ) {
                            $subscriptionFlag = true;
                            break 2; // stop checking once one valid found
                        }
                    }
                }
            }

            $user->subscribed = $subscriptionFlag;
            return $user;
        });

        return $this->ResSuccess([
            'users' => $users,
            'message' => 'Users retrieved successfully'
        ], 200);
    }

    public function teasPayments()
    {
        $teasPayments = Payment::with(['user:id,email', 'plan:id,product_code'])
            ->where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'teas'))
            ->get()
            ->map(fn($p) => [
                'email'          => $p->user?->email,
                'product_code'   => $p->plan?->product_code,
                'amount'         => $p->amount,
                'status'         => $p->status,
                'transaction_id' => $p->transaction_id,
                'receipt_number' => $p->receipt_number,
                'paid_at'        => $p->paid_at,
            ]);

        return $this->ResSuccess($teasPayments);
    }

    public function nursingPayments()
    {
        $nursingPayments = Payment::with(['user:id,email', 'plan:id,product_code'])
            ->where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'nursing'))
            ->get()
            ->map(fn($p) => [
                'email'          => $p->user?->email,
                'product_code'   => $p->plan?->product_code,
                'amount'         => $p->amount,
                'status'         => $p->status,
                'transaction_id' => $p->transaction_id,
                'receipt_number' => $p->receipt_number,
                'paid_at'        => $p->paid_at,
            ]);

        return $this->ResSuccess($nursingPayments);
    }

    public function nclexPayments()
    {
        $nclexPayments = Payment::with(['user:id,email', 'plan:id,product_code'])
            ->where('status', 'completed')
            ->whereHas('plan', fn($q) => $q->where('product_code', 'nclex'))
            ->get()
            ->map(fn($p) => [
                'email'          => $p->user?->email,
                'product_code'   => $p->plan?->product_code,
                'amount'         => $p->amount,
                'status'         => $p->status,
                'transaction_id' => $p->transaction_id,
                'receipt_number' => $p->receipt_number,
                'paid_at'        => $p->paid_at,
            ]);

        return $this->ResSuccess($nclexPayments);
    }

    public function filterSignups(Request $request)
    {
        $request->validate([
            'start' => 'nullable|date',
            'end'   => 'nullable|date|after_or_equal:start',
        ]);

        $query = User::query();

        if ($request->filled('start')) {
            $query->whereDate('created_at', '>=', $request->start);
        }

        if ($request->filled('end')) {
            $query->whereDate('created_at', '<=', $request->end);
        }

        $count = $query->count();

        return $this->ResSuccess([
            'count' => $count,
            'start' => $request->start,
            'end'   => $request->end,
        ]);
    }

    public function examFeedback(Request $request)
    {
        if (!$request->user()?->hasAnyRole(['super-admin', 'admin'])) {
            return $this->ResError('Unauthorized', 403);
        }

        $search = trim((string) $request->query('q', ''));
        $limit = (int) $request->query('limit', 300);
        $limit = max(1, min($limit, 1000));

        $query = ExamFeedback::query()
            ->with(['user:id,name,email'])
            ->latest();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('message', 'like', '%' . $search . '%')
                    ->orWhere('source_product', 'like', '%' . $search . '%')
                    ->orWhere('issue_type', 'like', '%' . $search . '%')
                    ->orWhere('status', 'like', '%' . $search . '%')
                    ->orWhere('question_id', 'like', '%' . $search . '%')
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', '%' . $search . '%')
                            ->orWhere('email', 'like', '%' . $search . '%');
                    });
            });
        }

        $feedback = $query->limit($limit)->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'user_id' => $item->user_id,
                'user_name' => $item->user?->name,
                'user_email' => $item->user?->email,
                'source_product' => $item->source_product,
                'exam_mode' => $item->exam_mode,
                'exam_id' => $item->exam_id,
                'question_id' => $item->question_id,
                'issue_type' => $item->issue_type,
                'message' => $item->message,
                'route' => $item->route,
                'metadata' => $item->metadata,
                'status' => $item->status,
                'created_at' => $item->created_at,
            ];
        });

        return $this->ResSuccess($feedback);
    }
}

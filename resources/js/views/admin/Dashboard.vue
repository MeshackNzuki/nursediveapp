<template>
    <div class="dash-shell">
        <div v-if="isSuperAdmin" class="mx-auto max-w-screen-2xl space-y-6">
            <AdminHeader title="Platform overview" :subtitle="`Last synced ${syncedAt}`">
                <template #actions>
                    <button type="button" class="dash-btn theme-surface theme-shadow shrink-0 px-3 py-1.5 text-[11px]" :disabled="loading" @click="fetchDashData">
                        <i :class="loading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'" class="text-[10px]"></i> Refresh
                    </button>
                </template>
            </AdminHeader>

            <div v-if="loading && !hasData" class="grid gap-4 xl:grid-cols-12">
                <div v-for="n in 6" :key="n" class="h-20 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60 xl:col-span-2"></div>
                <div class="h-80 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60 xl:col-span-7"></div>
                <div class="h-80 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60 xl:col-span-5"></div>
            </div>

            <section v-else-if="fetchError" class="analysis-state-error flex flex-wrap items-center justify-between gap-3">
                <span>{{ fetchError }}</span>
                <button type="button" class="dash-btn bg-rose-600 px-4 py-1.5 text-xs text-white" @click="fetchDashData">Retry</button>
            </section>

            <template v-else>
                <!-- ================= KPI STRIP ================= -->
                <section class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                    <div v-for="(kpi, index) in kpis" :key="kpi.label" class="ui-rise dash-card-white flex items-center gap-3 p-3"
                        :style="{ animationDelay: `${40 + index * 40}ms` }">
                        <span class="dash-icon-tile theme-icon h-10 w-10 shrink-0"><i :class="kpi.icon"></i></span>
                        <div class="min-w-0">
                            <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ kpi.label }}</p>
                            <p class="text-lg font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ kpi.value }}</p>
                            <p class="truncate text-[11px]" :class="kpi.deltaClass || 'text-slate-500 dark:text-slate-400'">{{ kpi.detail }}</p>
                        </div>
                    </div>
                </section>

                <!-- ================= ACTIVITY ================= -->
                <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                    <!-- Active users ladder -->
                    <article class="ui-rise dash-card xl:col-span-5" style="animation-delay: 160ms">
                        <div class="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-50" aria-hidden="true"></div>
                        <div class="relative flex items-start justify-between gap-3">
                            <div>
                                <h2 class="dash-title">Active users</h2>
                                <p class="analysis-muted mt-1">Users seen on the platform within each window, as a share of all {{ formatNumber(totalUsers) }} accounts.</p>
                            </div>
                            <span class="dash-icon-tile theme-icon h-10 w-10"><i class="pi pi-wave-pulse"></i></span>
                        </div>

                        <div class="relative mt-4 space-y-2">
                            <div v-for="w in activeWindows" :key="w.key" class="group">
                                <div class="mb-1 flex items-center justify-between text-xs">
                                    <span class="font-bold text-slate-700 dark:text-slate-200">{{ w.label }}</span>
                                    <span class="tabular-nums text-slate-500 dark:text-slate-300">
                                        <strong class="text-slate-900 dark:text-white">{{ formatNumber(w.value) }}</strong> · {{ formatPercent(w.percent) }}
                                    </span>
                                </div>
                                <div class="dash-progress h-2.5 bg-light-blue-500">
                                    <div class="relative h-full overflow-hidden rounded-full transition-all duration-700" :class="w.highlight ? 'theme-bar' : 'bg-slate-300 dark:bg-slate-600'"
                                        :style="{ width: `${clampPercent(w.percent)}%` }">
                                        <span v-if="w.highlight" class="ui-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="relative mt-4 grid grid-cols-2 gap-2">
                            <div class="dash-tile-soft px-3 py-2">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">7-day retention</p>
                                <p class="text-lg font-extrabold tabular-nums" :class="retentionTone">{{ formatPercent(dashdata.retention_7d_pct) }}</p>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ formatNumber(dashdata.retention_retained) }} of {{ formatNumber(dashdata.retention_cohort_size) }} who joined 7–14 days ago came back</p>
                            </div>
                            <div class="dash-tile-soft px-3 py-2">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Practising this week</p>
                                <p class="text-lg font-extrabold tabular-nums text-slate-950 dark:text-white">{{ formatNumber(dashdata.active_learners_last_7_days) }}</p>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ formatNumber(dashdata.attempts_last_7_days) }} attempts in 7 days · {{ formatNumber(dashdata.attempts_last_30_days) }} in 30</p>
                            </div>
                        </div>
                    </article>

                    <!-- Practice activity trend -->
                    <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 200ms">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 class="dash-title">Practice activity, last 14 days</h2>
                                <p class="analysis-muted mt-1">Attempts per day and the distinct learners behind them, across all three products.</p>
                            </div>
                            <div class="flex gap-2">
                                <span class="analysis-pill theme-soft border text-[11px]">{{ formatNumber(totalTrendAttempts) }} attempts</span>
                                <span class="analysis-pill border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">peak {{ formatNumber(peakLearners) }} learners</span>
                            </div>
                        </div>
                        <div class="dash-card-white mt-4 h-72 p-3">
                            <Bar v-if="activityChartData" :key="`activity-${themeStore.currentTheme}`" :data="activityChartData" :options="activityChartOptions" />
                        </div>
                    </article>
                </section>

                <!-- ================= GROWTH ================= -->
                <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                    <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 240ms">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 class="dash-title">Signups</h2>
                                <p class="analysis-muted mt-1">New accounts by window, and the last 14 days as a trend.</p>
                            </div>
                            <span class="analysis-pill border text-[11px]" :class="growthTagClass(dashdata.signups_growth_pct)">{{ formatGrowth(dashdata.signups_growth_pct) }}</span>
                        </div>
                        <div class="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-7">
                            <div v-for="s in signupWindows" :key="s.label" class="dash-tile-soft px-2 py-2 text-center">
                                <p class="text-lg font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ formatNumber(s.value) }}</p>
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ s.label }}</p>
                            </div>
                        </div>
                        <div class="dash-card-white mt-4 h-60 p-3">
                            <Line v-if="signupChartData" :key="`signups-${themeStore.currentTheme}`" :data="signupChartData" :options="lineOptions" />
                        </div>
                    </article>

                    <article class="ui-rise dash-card xl:col-span-5" style="animation-delay: 280ms">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <h2 class="dash-title">Conversion funnel</h2>
                                <p class="analysis-muted mt-1">From registered accounts to paying, subscribed, and active learners.</p>
                            </div>
                            <span class="dash-icon-tile theme-icon h-10 w-10"><i class="pi pi-filter"></i></span>
                        </div>
                        <div class="mt-4 space-y-3">
                            <div v-for="(step, index) in funnelSteps" :key="step.label">
                                <div class="mb-1 flex items-center justify-between text-xs">
                                    <span class="font-bold text-slate-700 dark:text-slate-200">{{ step.label }}</span>
                                    <span class="tabular-nums text-slate-500 dark:text-slate-300"><strong class="text-slate-900 dark:text-white">{{ formatNumber(step.value) }}</strong> · {{ formatPercent(step.percent) }}</span>
                                </div>
                                <div class="dash-progress h-3 bg-light-blue-500">
                                    <div class="h-full rounded-full transition-all duration-700" :class="index === 0 ? 'bg-slate-400 dark:bg-slate-500' : 'theme-bar'" :style="{ width: `${clampPercent(step.percent)}%` }"></div>
                                </div>
                            </div>
                        </div>
                        <div class="dash-tile-soft mt-4 flex items-center gap-3">
                            <span class="dash-icon-tile h-9 w-9 shrink-0 bg-linear-to-br from-amber-400 to-orange-500 text-white shadow"><i class="pi pi-clock"></i></span>
                            <div class="min-w-0">
                                <p class="text-sm font-extrabold text-slate-950 dark:text-white">{{ formatNumber(dashdata.trial_only_users) }} on a live trial with no paid plan</p>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400">The clearest upgrade audience right now.</p>
                            </div>
                        </div>
                    </article>
                </section>

                <!-- ================= REVENUE ================= -->
                <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                    <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 320ms">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 class="dash-title">Revenue by product</h2>
                                <p class="analysis-muted mt-1">Completed payments only.</p>
                            </div>
                            <span class="analysis-pill theme-soft border text-[11px]">{{ formatCurrency(dashdata.total_payments) }} all time</span>
                        </div>
                        <div class="mt-4 grid gap-3 md:grid-cols-3">
                            <article v-for="product in productBreakdown" :key="product.code" class="group dash-card-white dash-hover-lift relative overflow-hidden">
                                <div class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-linear-to-br opacity-60 blur-2xl" :class="productStyle(product.code).wash" aria-hidden="true"></div>
                                <div class="relative flex items-center justify-between gap-2">
                                    <div class="flex items-center gap-2">
                                        <span class="dash-icon-tile h-9 w-9 text-sm shadow" :class="productStyle(product.code).tile"><i :class="productStyle(product.code).icon"></i></span>
                                        <h3 class="text-sm font-extrabold text-slate-950 dark:text-white">{{ product.name }}</h3>
                                    </div>
                                    <span class="text-[11px] font-bold tabular-nums" :class="productStyle(product.code).ink">{{ formatPercent(product.revenue_share_pct) }}</span>
                                </div>
                                <p class="relative mt-3 text-2xl font-black tabular-nums tracking-tight text-slate-950 dark:text-white">{{ formatCurrency(product.revenue) }}</p>
                                <div class="dash-progress relative mt-2 h-2 bg-light-blue-500">
                                    <div class="h-full rounded-full transition-all duration-700" :class="productStyle(product.code).bar" :style="{ width: `${clampPercent(product.revenue_share_pct)}%` }"></div>
                                </div>
                                <dl class="relative mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                                    <div class="flex items-center justify-between"><dt class="text-slate-500 dark:text-slate-400">Subscribers</dt><dd class="font-bold tabular-nums text-slate-900 dark:text-white">{{ formatNumber(product.active_subscribers) }}</dd></div>
                                    <div class="flex items-center justify-between"><dt class="text-slate-500 dark:text-slate-400">Payers</dt><dd class="font-bold tabular-nums text-slate-900 dark:text-white">{{ formatNumber(product.unique_payers) }}</dd></div>
                                    <div class="flex items-center justify-between"><dt class="text-slate-500 dark:text-slate-400">Payments</dt><dd class="font-bold tabular-nums text-slate-900 dark:text-white">{{ formatNumber(product.payments_count) }}</dd></div>
                                    <div class="flex items-center justify-between"><dt class="text-slate-500 dark:text-slate-400">Attempts</dt><dd class="font-bold tabular-nums text-slate-900 dark:text-white">{{ formatNumber(product.attempts) }}</dd></div>
                                </dl>
                                <div class="relative mt-3 flex gap-1.5">
                                    <router-link :to="paymentRouteForProduct(product.code)" class="dash-btn-ghost flex-1 px-2 py-1 text-[11px]">Payments</router-link>
                                    <router-link :to="userRouteForProduct(product.code)" class="dash-btn-ghost flex-1 px-2 py-1 text-[11px]">Users</router-link>
                                </div>
                            </article>
                        </div>
                    </article>

                    <article class="ui-rise dash-card xl:col-span-5" style="animation-delay: 360ms">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 class="dash-title">Revenue, last 14 days</h2>
                                <p class="analysis-muted mt-1">{{ formatCurrency(totalTrendRevenue) }} collected in the window.</p>
                            </div>
                            <span class="analysis-pill border text-[11px]" :class="growthTagClass(dashdata.payments_growth_pct)">{{ formatGrowth(dashdata.payments_growth_pct) }}</span>
                        </div>
                        <div class="dash-card-white mt-4 h-60 p-3">
                            <Line v-if="revenueChartData" :key="`revenue-${themeStore.currentTheme}`" :data="revenueChartData" :options="currencyLineOptions" />
                        </div>
                    </article>
                </section>

                <!-- ================= SIGNUP FILTER ================= -->
                <section class="ui-rise dash-card" style="animation-delay: 400ms">
                    <div class="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                        <div>
                            <h2 class="dash-title">Signups in a date range</h2>
                            <p class="analysis-muted mt-1">Count new accounts between any two dates.</p>
                            <div class="mt-3 grid gap-3 sm:grid-cols-2">
                                <label class="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    Start
                                    <input v-model="startDate" type="date" class="theme-focus mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-800 shadow-sm focus:outline-none dark:border-sky-700 dark:bg-sky-950 dark:text-slate-100" />
                                </label>
                                <label class="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    End
                                    <input v-model="endDate" type="date" class="theme-focus mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-800 shadow-sm focus:outline-none dark:border-sky-700 dark:bg-sky-950 dark:text-slate-100" />
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-col items-stretch gap-2 md:w-64">
                            <button type="button" class="dash-btn theme-surface theme-shadow px-5 py-2.5" :disabled="filtering" @click="apply">
                                <i :class="filtering ? 'pi pi-spin pi-spinner' : 'pi pi-search'" class="text-[10px]"></i> {{ filtering ? "Counting..." : "Count signups" }}
                            </button>
                            <p v-if="filteredCount !== null" class="dash-tile-soft text-center text-sm font-bold text-slate-900 dark:text-white">
                                <span class="text-xl font-black tabular-nums">{{ formatNumber(filteredCount) }}</span> signups
                                <span class="block text-[11px] font-semibold text-slate-500 dark:text-slate-300">{{ startDate || "start" }} → {{ endDate || "today" }}</span>
                            </p>
                        </div>
                    </div>
                </section>
            </template>
        </div>

        <div v-else class="mx-auto mt-10 max-w-xl">
            <div class="dash-card-white border-amber-200 p-8 text-center">
                <span class="dash-icon-tile mx-auto h-12 w-12 bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg"><i class="pi pi-lock"></i></span>
                <h2 class="mt-4 text-xl font-extrabold text-slate-950 dark:text-white">Admin access required</h2>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Your account does not have permission to view this dashboard.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { Bar, Line } from "vue-chartjs";
import { BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js";
import AdminHeader from "../../components/Admin/AdminHeader.vue";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/Theme";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const { user } = useAuthStore();
const themeStore = useThemeStore();

const dashdata = ref({});
const loading = ref(false);
const filtering = ref(false);
const fetchError = ref("");
const syncedAt = ref("never");
const startDate = ref("");
const endDate = ref("");
const filteredCount = ref(null);

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

const safe = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};
const clampPercent = (value) => Math.max(0, Math.min(100, safe(value)));
const formatNumber = (value) => numberFormatter.format(safe(value));
const formatCurrency = (value) => currencyFormatter.format(safe(value));
const formatPercent = (value) => `${percentFormatter.format(safe(value))}%`;
const formatGrowth = (value) => `${safe(value) >= 0 ? "+" : ""}${percentFormatter.format(safe(value))}% vs previous 30 days`;
const growthTagClass = (value) =>
    safe(value) >= 0
        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
        : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200";
const ratioPercent = (value, total) => (safe(total) > 0 ? (safe(value) / safe(total)) * 100 : 0);

const hexToRgba = (hex, alpha) => {
    const clean = String(hex || "#0ea5e9").replace("#", "");
    const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
    const n = parseInt(full, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const isSuperAdmin = computed(() => user?.roles?.[0] === "super-admin");
const hasData = computed(() => Object.keys(dashdata.value).length > 0);
const totalUsers = computed(() => safe(dashdata.value.total_users || dashdata.value.total_signups));

/* ---------- KPIs ---------- */
const kpis = computed(() => [
    { label: "Total users", value: formatNumber(totalUsers.value), detail: `${formatNumber(dashdata.value.signups_today)} joined today`, icon: "pi pi-users" },
    { label: "Active 24h", value: formatNumber(dashdata.value.active_24hr), detail: `${formatPercent(ratioPercent(dashdata.value.active_24hr, totalUsers.value))} of all users`, icon: "pi pi-bolt" },
    { label: "Active 7d", value: formatNumber(dashdata.value.active_7d), detail: `${formatNumber(dashdata.value.active_30d)} in 30 days`, icon: "pi pi-calendar" },
    { label: "Revenue 30d", value: formatCurrency(dashdata.value.payments_last_30_days), detail: formatGrowth(dashdata.value.payments_growth_pct), icon: "pi pi-wallet", deltaClass: safe(dashdata.value.payments_growth_pct) >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300" },
    { label: "Subscribers", value: formatNumber(dashdata.value.all_subscribed), detail: `${formatPercent(dashdata.value.subscription_rate_pct)} subscription rate`, icon: "pi pi-verified" },
    { label: "Payer conversion", value: formatPercent(dashdata.value.payer_conversion_rate_pct), detail: `${formatCurrency(dashdata.value.avg_revenue_per_payer)} per payer`, icon: "pi pi-percentage" },
]);

/* ---------- Active windows ---------- */
const activeWindows = computed(() =>
    [
        { key: "active_6hr", label: "Last 6 hours" },
        { key: "active_12hr", label: "Last 12 hours" },
        { key: "active_24hr", label: "Last 24 hours", highlight: true },
        { key: "active_2d", label: "Last 2 days" },
        { key: "active_3d", label: "Last 3 days" },
        { key: "active_4d", label: "Last 4 days" },
        { key: "active_5d", label: "Last 5 days" },
        { key: "active_6d", label: "Last 6 days" },
        { key: "active_7d", label: "Last 7 days", highlight: true },
        { key: "active_14d", label: "Last 14 days" },
        { key: "active_30d", label: "Last 30 days", highlight: true },
    ].map((w) => ({ ...w, value: safe(dashdata.value[w.key]), percent: ratioPercent(dashdata.value[w.key], totalUsers.value) })),
);

const retentionTone = computed(() => {
    const r = safe(dashdata.value.retention_7d_pct);
    if (r >= 40) return "text-emerald-600 dark:text-emerald-300";
    if (r >= 20) return "text-amber-600 dark:text-amber-300";
    return "text-rose-600 dark:text-rose-300";
});

/* ---------- Signups ---------- */
const signupWindows = computed(() => [
    { label: "6h", value: dashdata.value.six_hr_signups },
    { label: "12h", value: dashdata.value.onetwo_hr_signups },
    { label: "24h", value: dashdata.value.twofour_hr_signups },
    { label: "Today", value: dashdata.value.signups_today },
    { label: "7d", value: dashdata.value.seven_days_signups },
    { label: "30d", value: dashdata.value.signups_last_30_days },
    { label: "60d", value: dashdata.value.signups_last_60_days },
]);

/* ---------- Funnel ---------- */
const funnelSteps = computed(() => [
    { label: "Registered", value: totalUsers.value, percent: 100 },
    { label: "Unique payers", value: safe(dashdata.value.unique_payers), percent: ratioPercent(dashdata.value.unique_payers, totalUsers.value) },
    { label: "Active subscribers", value: safe(dashdata.value.all_subscribed), percent: ratioPercent(dashdata.value.all_subscribed, totalUsers.value) },
    { label: "Practising this week", value: safe(dashdata.value.active_learners_last_7_days), percent: ratioPercent(dashdata.value.active_learners_last_7_days, totalUsers.value) },
    { label: "Seen in last 24h", value: safe(dashdata.value.active_24hr), percent: ratioPercent(dashdata.value.active_24hr, totalUsers.value) },
]);

/* ---------- Products ---------- */
const PRODUCT_STYLE = {
    teas: { icon: "pi pi-file-edit", tile: "bg-linear-to-br from-cyan-500 to-sky-500 text-white", bar: "bg-linear-to-r from-cyan-500 to-sky-500", wash: "from-cyan-300/60 to-sky-200/30", ink: "text-cyan-700 dark:text-cyan-300" },
    nursing: { icon: "pi pi-briefcase", tile: "bg-linear-to-br from-emerald-500 to-teal-400 text-white", bar: "bg-linear-to-r from-emerald-500 to-teal-400", wash: "from-emerald-300/60 to-teal-200/30", ink: "text-emerald-700 dark:text-emerald-300" },
    nclex: { icon: "pi pi-bolt", tile: "bg-linear-to-br from-blue-500 to-indigo-500 text-white", bar: "bg-linear-to-r from-blue-500 to-indigo-500", wash: "from-blue-300/60 to-indigo-200/30", ink: "text-blue-700 dark:text-blue-300" },
};
const productStyle = (code) => PRODUCT_STYLE[code] || PRODUCT_STYLE.teas;

const productBreakdown = computed(() => {
    if (Array.isArray(dashdata.value.product_breakdown) && dashdata.value.product_breakdown.length > 0) return dashdata.value.product_breakdown;
    return ["teas", "nursing", "nclex"].map((code) => ({
        code,
        name: code === "teas" ? "TEAS" : code === "nursing" ? "Nursing" : "NCLEX",
        revenue: safe(dashdata.value[`${code}_payments`]),
        payments_count: safe(dashdata.value[`${code}_payments_count`]),
        unique_payers: safe(dashdata.value[`${code}_unique_payers`]),
        active_subscribers: safe(dashdata.value[`${code}_subscribed`]),
        attempts: safe(dashdata.value[`${code}_attempts`]),
        revenue_share_pct: ratioPercent(dashdata.value[`${code}_payments`], dashdata.value.total_payments),
    }));
});

const paymentRouteForProduct = (code) => (code === "teas" ? "/admin/teas-payments" : code === "nursing" ? "/admin/nursing-payments" : "/admin/nclex-payments");
const userRouteForProduct = (code) => `/admin/users?${code}=1`;

/* ---------- Charts ---------- */
const trendLabels = computed(() => dashdata.value?.trends?.labels ?? []);
const trendSignups = computed(() => (dashdata.value?.trends?.signups ?? []).map(safe));
const trendRevenue = computed(() => (dashdata.value?.trends?.revenue ?? []).map(safe));
const trendAttempts = computed(() => (dashdata.value?.trends?.attempts ?? []).map(safe));
const trendLearners = computed(() => (dashdata.value?.trends?.learners ?? []).map(safe));
const totalTrendRevenue = computed(() => trendRevenue.value.reduce((s, v) => s + v, 0));
const totalTrendAttempts = computed(() => trendAttempts.value.reduce((s, v) => s + v, 0));
const peakLearners = computed(() => Math.max(0, ...trendLearners.value));

const accent = computed(() => themeStore.tokens.accent);
const accent2 = computed(() => themeStore.tokens.accent2);

const baseScales = () => ({
    x: { grid: { display: false }, ticks: { color: "#64748b", font: { size: 11 } } },
    y: { beginAtZero: true, grid: { color: "rgba(100, 116, 139, 0.12)" }, ticks: { color: "#64748b", font: { size: 11 }, precision: 0 } },
});
const tooltipStyle = { backgroundColor: "rgba(11, 40, 69, 0.95)", padding: 10, titleFont: { size: 12, weight: "bold" }, bodyFont: { size: 12 }, cornerRadius: 10 };

const lineOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipStyle }, scales: baseScales() };
const currencyLineOptions = {
    ...lineOptions,
    plugins: { legend: { display: false }, tooltip: { ...tooltipStyle, callbacks: { label: (ctx) => ` ${formatCurrency(ctx.parsed.y)}` } } },
    scales: { ...baseScales(), y: { ...baseScales().y, ticks: { ...baseScales().y.ticks, callback: (v) => `$${v}` } } },
};
const activityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { display: true, position: "top", labels: { usePointStyle: true, boxWidth: 8, color: "#475569", font: { size: 11 } } }, tooltip: tooltipStyle },
    scales: baseScales(),
};

const signupChartData = computed(() => ({
    labels: trendLabels.value,
    datasets: [{ label: "Signups", data: trendSignups.value, borderColor: accent2.value, backgroundColor: hexToRgba(accent.value, 0.18), borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: accent2.value, pointBorderColor: "#fff", pointBorderWidth: 2, pointHoverRadius: 6 }],
}));
const revenueChartData = computed(() => ({
    labels: trendLabels.value,
    datasets: [{ label: "Revenue", data: trendRevenue.value, borderColor: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.14)", borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: "#10b981", pointBorderColor: "#fff", pointBorderWidth: 2, pointHoverRadius: 6 }],
}));
const activityChartData = computed(() => ({
    labels: trendLabels.value,
    datasets: [
        { type: "bar", label: "Attempts", data: trendAttempts.value, backgroundColor: hexToRgba(accent.value, 0.35), borderColor: accent2.value, borderWidth: 1, borderRadius: 6, maxBarThickness: 28 },
        { type: "line", label: "Learners", data: trendLearners.value, borderColor: "#10b981", backgroundColor: "#10b981", borderWidth: 2, tension: 0.4, pointRadius: 3, pointBackgroundColor: "#10b981", pointBorderColor: "#fff", pointBorderWidth: 2 },
    ],
}));

/* ---------- Data ---------- */
const fetchDashData = async () => {
    loading.value = true;
    fetchError.value = "";
    try {
        const res = await axios.get("/admin/dashdata");
        dashdata.value = res.data.data ?? {};
        syncedAt.value = new Date().toLocaleString();
    } catch (err) {
        console.error("Failed to fetch dashdata:", err);
        fetchError.value = "Could not load dashboard data. Please retry.";
    } finally {
        loading.value = false;
    }
};

const apply = async () => {
    filtering.value = true;
    try {
        const res = await axios.post("/admin/signups-filter", { start: startDate.value, end: endDate.value });
        filteredCount.value = safe(res?.data?.data?.count);
    } catch (err) {
        console.error("Failed to filter signups:", err);
    } finally {
        filtering.value = false;
    }
};

onMounted(fetchDashData);
</script>

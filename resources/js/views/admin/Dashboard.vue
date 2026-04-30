<template>
    <div class="min-h-screen bg-slate-100 px-4 py-6 dark:bg-sky-950 md:px-6 lg:px-8">
        <div v-if="isSuperAdmin" class="mx-auto max-w-7xl space-y-6">
            <section
                class="rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-cyan-50 p-5 shadow-sm dark:border-sky-800 dark:from-sky-900 dark:via-sky-900 dark:to-sky-950">
                <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p class="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Admin Console
                        </p>
                        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100 md:text-3xl">
                            Platform Performance Overview
                        </h1>
                        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Last synced: {{ syncedAt }}
                        </p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <router-link
                            class="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-500 hover:text-sky-600 dark:border-sky-700 dark:text-slate-200"
                            to="/admin/users?all=1">
                            Manage Users
                        </router-link>
                        <router-link
                            class="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-sky-700 dark:text-slate-200"
                            to="/admin/teas-payments">
                            View Payments
                        </router-link>
                    </div>
                </div>
            </section>

            <section v-if="loading"
                class="rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-sky-800 dark:bg-sky-900">
                <p class="text-sm text-slate-600 dark:text-slate-300">Loading dashboard metrics...</p>
            </section>

            <section v-else-if="fetchError"
                class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-800 dark:bg-rose-900/20">
                <p class="text-sm font-medium text-rose-600 dark:text-rose-300">{{ fetchError }}</p>
                <button
                    class="mt-3 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                    @click="fetchDashData">
                    Retry
                </button>
            </section>

            <template v-else>
                <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <article v-for="card in executiveCards" :key="card.label"
                        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-sky-800 dark:bg-sky-900">
                        <div v-if="!card.isMultiValue" class="flex items-start justify-between gap-3">
                            <div>
                                <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">{{
                                    card.label }}</p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                    {{ card.isCurrency ? formatCurrency(card.value) : card.isPercent ?
                                        formatPercent(card.value) : formatNumber(card.value) }}
                                </p>
                            </div>
                            <i
                                :class="[card.icon, 'rounded-full bg-sky-100 p-2 text-lg text-sky-600 dark:bg-sky-800 dark:text-sky-300']"></i>
                        </div>
                        <div v-else>
                            <div class="flex items-start justify-between gap-3 mb-3">
                                <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">{{
                                    card.label }}</p>
                                <i
                                    :class="[card.icon, 'rounded-full bg-sky-100 p-2 text-lg text-sky-600 dark:bg-sky-800 dark:text-sky-300']"></i>
                            </div>
                            <div class="grid grid-cols-3 gap-2">
                                <div v-for="item in card.items" :key="item.label"
                                    class="rounded-lg bg-slate-50 p-2 dark:bg-sky-950/50">
                                    <p class="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{{
                                        item.label }}</p>
                                    <p class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{{
                                        formatNumber(item.value) }}</p>
                                </div>
                            </div>
                        </div>
                        <p v-if="!card.isMultiValue" class="mt-3 text-sm text-slate-600 dark:text-slate-300">{{
                            card.subtitle }}</p>
                        <span v-if="!card.isMultiValue && typeof card.growth === 'number'"
                            :class="[growthTagClass(card.growth), 'mt-3 inline-flex rounded-full px-2 py-1 text-xs font-semibold']">
                            {{ formatGrowth(card.growth) }}
                        </span>
                    </article>
                </section>

                <section class="grid gap-6 xl:grid-cols-3">
                    <article
                        class="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Product Revenue &
                                Adoption</h2>
                            <span class="text-xs text-slate-500 dark:text-slate-300">Based on completed payments</span>
                        </div>
                        <div class="mt-4 grid gap-4 md:grid-cols-3">
                            <article v-for="product in productBreakdown" :key="product.code" :class="[
                                'rounded-2xl border p-4',
                                product.code === 'teas'
                                    ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-700 dark:bg-emerald-900/20'
                                    : product.code === 'nursing'
                                        ? 'border-sky-200 bg-sky-50/70 dark:border-sky-700 dark:bg-sky-950/60'
                                        : 'border-amber-200 bg-amber-50/60 dark:border-amber-700 dark:bg-amber-900/20',
                            ]">
                                <div class="flex items-center justify-between">
                                    <h3 class="font-semibold text-slate-900 dark:text-slate-100">{{ product.name }}</h3>
                                    <span class="text-xs font-medium text-slate-600 dark:text-slate-300">{{
                                        formatPercent(product.revenue_share_pct) }} share</span>
                                </div>
                                <p class="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{{
                                    formatCurrency(product.revenue) }}</p>
                                <div class="mt-3 h-2 rounded-full bg-slate-200 dark:bg-sky-800">
                                    <div :class="[
                                        'h-2 rounded-full transition-all',
                                        product.code === 'teas'
                                            ? 'bg-emerald-500'
                                            : product.code === 'nursing'
                                                ? 'bg-sky-500'
                                                : 'bg-amber-500',
                                    ]" :style="{ width: `${clampPercent(product.revenue_share_pct)}%` }"></div>
                                </div>
                                <div class="mt-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                    <div class="flex items-center justify-between">
                                        <span>Active subscribers</span>
                                        <span class="font-semibold">{{ formatNumber(product.active_subscribers)
                                            }}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span>Unique payers</span>
                                        <span class="font-semibold">{{ formatNumber(product.unique_payers) }}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span>Payments</span>
                                        <span class="font-semibold">{{ formatNumber(product.payments_count) }}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span>Exam attempts</span>
                                        <span class="font-semibold">{{ formatNumber(product.attempts) }}</span>
                                    </div>
                                </div>
                                <div class="mt-4 flex gap-2 text-xs">
                                    <router-link
                                        class="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-300 transition hover:ring-slate-500 dark:bg-sky-950 dark:text-slate-200 dark:ring-sky-700"
                                        :to="paymentRouteForProduct(product.code)">
                                        Payments
                                    </router-link>
                                    <router-link
                                        class="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-300 transition hover:ring-slate-500 dark:bg-sky-950 dark:text-slate-200 dark:ring-sky-700"
                                        :to="userRouteForProduct(product.code)">
                                        Users
                                    </router-link>
                                </div>
                            </article>
                        </div>
                    </article>

                    <article
                        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
                        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Conversion Funnel</h2>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Pipeline from signups to active
                            learners</p>
                        <div class="mt-4 space-y-4">
                            <div v-for="step in funnelSteps" :key="step.label">
                                <div
                                    class="mb-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                                    <span>{{ step.label }}</span>
                                    <span class="font-semibold">{{ formatNumber(step.value) }} ({{
                                        formatPercent(step.percent) }})</span>
                                </div>
                                <div class="h-2 rounded-full bg-slate-200 dark:bg-sky-800">
                                    <div class="h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                                        :style="{ width: `${clampPercent(step.percent)}%` }"></div>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>
                <section class="grid gap-6 xl:grid-cols-2">
                    <article
                        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">14-Day Signup Trend
                            </h2>
                            <span class="text-xs text-slate-500 dark:text-slate-300">{{ formatNumber(totalTrendSignups)
                                }} signups</span>
                        </div>
                        <div class="mt-4 h-64">
                            <Line v-if="signupChartData" :data="signupChartData" :options="chartOptions" />
                        </div>
                    </article>

                    <article
                        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">14-Day Revenue Trend
                            </h2>
                            <span class="text-xs text-slate-500 dark:text-slate-300">{{
                                formatCurrency(totalTrendRevenue) }}</span>
                        </div>
                        <div class="mt-4 h-64">
                            <Line v-if="revenueChartData" :data="revenueChartData" :options="chartOptions" />
                        </div>
                    </article>
                </section>

                <section class="grid gap-6 xl:grid-cols-2">
                    <article
                        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
                        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Platform Activity
                        </h2>
                        <div class="mt-4 space-y-4">
                            <div v-for="entry in activeWindows" :key="entry.label">
                                <div
                                    class="mb-1 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                    <span>{{ entry.label }}</span>
                                    <span class="font-semibold">{{ formatNumber(entry.value) }} users ({{
                                        formatPercent(entry.percent) }})</span>
                                </div>
                                <div class="h-2 rounded-full bg-slate-200 dark:bg-sky-800">
                                    <div class="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500"
                                        :style="{ width: `${clampPercent(entry.percent)}%` }"></div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div
                                class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-sky-700 dark:bg-sky-950">
                                <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Total Exam
                                    Attempts</p>
                                <p class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{{
                                    formatNumber(totalAttempts) }}</p>
                            </div>
                            <div
                                class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-sky-700 dark:bg-sky-950">
                                <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Active
                                    Learners</p>
                                <p class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{{
                                    formatNumber(totalAttemptUsers) }}</p>
                            </div>
                        </div>
                    </article>

                    <article
                        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
                        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Signup Filter</h2>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Track conversions within any date
                            range</p>
                        <div class="mt-4 grid gap-3 md:grid-cols-2">
                            <label class="text-sm text-slate-600 dark:text-slate-300">
                                Start Date
                                <input v-model="startDate" type="date"
                                    class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-700 outline-none transition focus:border-sky-500 dark:border-sky-700 dark:bg-sky-950 dark:text-slate-200" />
                            </label>
                            <label class="text-sm text-slate-600 dark:text-slate-300">
                                End Date
                                <input v-model="endDate" type="date"
                                    class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-700 outline-none transition focus:border-sky-500 dark:border-sky-700 dark:bg-sky-950 dark:text-slate-200" />
                            </label>
                        </div>
                        <button
                            class="mt-4 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                            :disabled="filtering" @click="apply">
                            {{ filtering ? "Applying..." : "Apply Range" }}
                        </button>
                        <p v-if="filteredCount !== null"
                            class="mt-4 rounded-xl bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {{ formatNumber(filteredCount) }} users signed up between
                            {{ startDate || "start" }} and {{ endDate || "today" }}.
                        </p>
                    </article>
                </section>
            </template>
        </div>

        <div v-else
            class="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center shadow-sm dark:border-amber-700 dark:bg-amber-900/20">
            <h2 class="text-xl font-semibold text-amber-800 dark:text-amber-200">Admin Access Required</h2>
            <p class="mt-2 text-sm text-amber-700 dark:text-amber-300">
                Your account does not have permissions to view this dashboard.
            </p>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

const { user } = useAuthStore();

const dashdata = ref({});
const loading = ref(false);
const filtering = ref(false);
const fetchError = ref("");
const syncedAt = ref("-");

const startDate = ref("");
const endDate = ref("");
const filteredCount = ref(null);

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});
const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
});
const percentFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            titleFont: { size: 14, weight: "bold" },
            bodyFont: { size: 13 },
            borderColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: 1,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: "#64748b",
                font: { size: 12 },
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                color: "rgba(100, 116, 139, 0.1)",
            },
            ticks: {
                color: "#64748b",
                font: { size: 12 },
            },
        },
    },
};

const safe = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const clampPercent = (value) => Math.max(0, Math.min(100, safe(value)));
const formatNumber = (value) => numberFormatter.format(safe(value));
const formatCurrency = (value) => currencyFormatter.format(safe(value));
const compactCurrency = (value) => compactCurrencyFormatter.format(safe(value));
const formatPercent = (value) => `${percentFormatter.format(safe(value))}%`;
const formatGrowth = (value) => `${safe(value) >= 0 ? "+" : ""}${percentFormatter.format(safe(value))}% vs previous period`;

const growthTagClass = (value) =>
    safe(value) >= 0
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
        : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";

const ratioPercent = (value, total) => (safe(total) > 0 ? (safe(value) / safe(total)) * 100 : 0);
const trendBarHeight = (value, maxValue) => `${Math.max(8, Math.round((safe(value) / Math.max(safe(maxValue), 1)) * 100))}%`;

const isSuperAdmin = computed(() => user?.roles?.[0] === "super-admin");
const totalUsers = computed(() => safe(dashdata.value.total_users || dashdata.value.total_signups));
const totalAttempts = computed(() => safe(dashdata.value.teas_attempts) + safe(dashdata.value.nursing_attempts) + safe(dashdata.value.nclex_attempts));
const totalAttemptUsers = computed(() => safe(dashdata.value.teas_users) + safe(dashdata.value.nursing_users) + safe(dashdata.value.nclex_users));

const executiveCards = computed(() => [
    {
        label: "Total Users",
        value: totalUsers.value,
        subtitle: `${formatNumber(dashdata.value.signups_last_30_days)} new users in the last 30 days`,
        growth: safe(dashdata.value.signups_growth_pct),
        icon: "pi pi-users",
    },
    {
        label: "Recent Signups",
        isMultiValue: true,
        items: [

            {
                label: "24hr",
                value: safe(dashdata.value.twofour_hr_signups),
            },
            {
                label: "12hr",
                value: safe(dashdata.value.onetwo_hr_signups),
            },
            {
                label: "6hr",
                value: safe(dashdata.value.six_hr_signups),
            },
            {
                label: "7d",
                value: safe(dashdata.value.seven_days_signups),
            },
            {
                label: "30d",
                value: safe(dashdata.value.signups_last_30_days),
            },
            {
                label: "60d",
                value: safe(dashdata.value.signups_last_60_days),

            }
        ],

        icon: "pi pi-arrow-up-right",
    },
    {
        label: "Revenue (30 Days)",
        value: safe(dashdata.value.payments_last_30_days),
        subtitle: `${formatNumber(dashdata.value.payments_count_last_30_days)} completed payments`,
        growth: safe(dashdata.value.payments_growth_pct),
        isCurrency: true,
        icon: "pi pi-wallet",
    },
    {
        label: "Payer Conversion",
        value: safe(dashdata.value.payer_conversion_rate_pct),
        subtitle: `${formatNumber(dashdata.value.unique_payers)} unique paying users`,
        isPercent: true,
        icon: "pi pi-percentage",
    },
    {
        label: "Avg Revenue / Payer",
        value: safe(dashdata.value.avg_revenue_per_payer),
        subtitle: `${formatCurrency(dashdata.value.avg_revenue_per_payment)} per completed payment`,
        isCurrency: true,
        icon: "pi pi-dollar",
    },
    {
        label: "All-Time Revenue",
        value: safe(dashdata.value.total_payments),
        subtitle: "Lifetime completed payment revenue",
        isCurrency: true,
        icon: "pi pi-chart-line",
    },
]);

const productBreakdown = computed(() => {
    if (Array.isArray(dashdata.value.product_breakdown) && dashdata.value.product_breakdown.length > 0) {
        return dashdata.value.product_breakdown;
    }

    return [
        {
            code: "teas",
            name: "TEAS",
            revenue: safe(dashdata.value.teas_payments),
            payments_count: safe(dashdata.value.teas_payments_count),
            unique_payers: safe(dashdata.value.teas_unique_payers),
            active_subscribers: safe(dashdata.value.teas_subscribed),
            attempts: safe(dashdata.value.teas_attempts),
            revenue_share_pct: ratioPercent(dashdata.value.teas_payments, dashdata.value.total_payments),
        },
        {
            code: "nursing",
            name: "Nursing",
            revenue: safe(dashdata.value.nursing_payments),
            payments_count: safe(dashdata.value.nursing_payments_count),
            unique_payers: safe(dashdata.value.nursing_unique_payers),
            active_subscribers: safe(dashdata.value.nursing_subscribed),
            attempts: safe(dashdata.value.nursing_attempts),
            revenue_share_pct: ratioPercent(dashdata.value.nursing_payments, dashdata.value.total_payments),
        },
        {
            code: "nclex",
            name: "NCLEX",
            revenue: safe(dashdata.value.nclex_payments),
            payments_count: safe(dashdata.value.nclex_payments_count),
            unique_payers: safe(dashdata.value.nclex_unique_payers),
            active_subscribers: safe(dashdata.value.nclex_subscribed),
            attempts: safe(dashdata.value.nclex_attempts),
            revenue_share_pct: ratioPercent(dashdata.value.nclex_payments, dashdata.value.total_payments),
        },
    ];
});

const funnelSteps = computed(() => [
    {
        label: "Registered Users",
        value: totalUsers.value,
        percent: 100,
    },
    {
        label: "Unique Payers",
        value: safe(dashdata.value.unique_payers),
        percent: ratioPercent(dashdata.value.unique_payers, totalUsers.value),
    },
    {
        label: "Active Subscribers",
        value: safe(dashdata.value.all_subscribed),
        percent: ratioPercent(dashdata.value.all_subscribed, totalUsers.value),
    },
    {
        label: "Active in Last 24h",
        value: safe(dashdata.value.active_24hr),
        percent: ratioPercent(dashdata.value.active_24hr, totalUsers.value),
    },
]);

const activeWindows = computed(() => [
    {
        label: "Active in 6 hours",
        value: safe(dashdata.value.active_6hr),
        percent: ratioPercent(dashdata.value.active_6hr, totalUsers.value),
    },
    {
        label: "Active in 12 hours",
        value: safe(dashdata.value.active_12hr),
        percent: ratioPercent(dashdata.value.active_12hr, totalUsers.value),
    },
    {
        label: "Active in 24 hours",
        value: safe(dashdata.value.active_24hr),
        percent: ratioPercent(dashdata.value.active_24hr, totalUsers.value),
    },
]);

const trendLabels = computed(() => dashdata.value?.trends?.labels ?? []);
const trendSignups = computed(() => dashdata.value?.trends?.signups ?? []);
const trendRevenue = computed(() => dashdata.value?.trends?.revenue ?? []);

const totalTrendSignups = computed(() => trendSignups.value.reduce((sum, item) => sum + safe(item), 0));
const totalTrendRevenue = computed(() => trendRevenue.value.reduce((sum, item) => sum + safe(item), 0));

const maxSignupTrend = computed(() => {
    const max = Math.max(1, ...trendSignups.value.map((item) => safe(item)));
    return Number.isFinite(max) ? max : 1;
});

const maxRevenueTrend = computed(() => {
    const max = Math.max(1, ...trendRevenue.value.map((item) => safe(item)));
    return Number.isFinite(max) ? max : 1;
});

const signupChartData = computed(() => ({
    labels: trendLabels.value,
    datasets: [
        {
            label: "Signups",
            data: trendSignups.value.map((item) => safe(item)),
            borderColor: "#0ea5e9",
            backgroundColor: "rgba(6, 182, 212, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#0ea5e9",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 7,
        },
    ],
}));

const revenueChartData = computed(() => ({
    labels: trendLabels.value,
    datasets: [
        {
            label: "Revenue",
            data: trendRevenue.value.map((item) => safe(item)),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#10b981",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 7,
        },
    ],
}));

const signupBars = computed(() =>
    trendLabels.value.map((label, index) => ({
        label,
        value: safe(trendSignups.value[index]),
        height: trendBarHeight(trendSignups.value[index], maxSignupTrend.value),
    })),
);

const revenueBars = computed(() =>
    trendLabels.value.map((label, index) => ({
        label,
        value: safe(trendRevenue.value[index]),
        height: trendBarHeight(trendRevenue.value[index], maxRevenueTrend.value),
    })),
);

const paymentRouteForProduct = (code) => {
    if (code === "teas") return "/admin/teas-payments";
    if (code === "nursing") return "/admin/nursing-payments";
    return "/admin/nclex-payments";
};

const userRouteForProduct = (code) => {
    if (code === "teas") return "/admin/users?teas=1";
    if (code === "nursing") return "/admin/users?nursing=1";
    return "/admin/users?nclex=1";
};

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
        const res = await axios.post("/admin/signups-filter", {
            start: startDate.value,
            end: endDate.value,
        });
        filteredCount.value = safe(res?.data?.data?.count);
    } catch (err) {
        console.error("Failed to filter signups:", err);
    } finally {
        filtering.value = false;
    }
};

onMounted(fetchDashData);
</script>

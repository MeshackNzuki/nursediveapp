<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { useMainStore } from "../stores";
import EmailVerification from "../components/EmailVerification.vue";
import ExamIcon from "../components/ExamIcon.vue";
import Socials from "../components/Socials.vue";
import { secondsToHms } from "../utils/secondsToHms";

const router = useRouter();
const mainStore = useMainStore();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { active, isTrial, wasTrial, daysLeft } = authStore;
const isAuthenticated = computed(() => authStore.is_authenticated);

const products = [
    {
        code: "teas",
        tileClass: "bg-linear-to-br from-cyan-500 to-sky-500 text-white shadow-cyan-500/30",
        washClass: "from-cyan-400/45 to-sky-300/25 dark:from-cyan-500/30 dark:to-sky-400/15",
        patternClass: "pattern-grid",
        inkClass: "text-cyan-600 dark:text-cyan-300",
        icon: "pi pi-file-edit",
        name: "TEAS 7",
        abb: "ATI",
        subtitle: "Exam-focused prep for reading, math, science, and language",
        bundleLabel: "Exam Prep Combo",
        dashboardRoute: "/teas",
        pricingRoute: "/teas-pricing",
        cardClass: "border-cyan-200 bg-cyan-50/80 dark:border-cyan-900/70 dark:bg-cyan-950/30",
        bundleClass: "bg-cyan-100 text-cyan-900 dark:bg-cyan-900/70 dark:text-cyan-100",
        ribbonClass: "border-cyan-200 bg-cyan-100 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
        moduleShellClass: "border-cyan-200 bg-sky-50/70 dark:border-cyan-800 dark:bg-cyan-950/40",
        modules: [
            { label: "Q-Bank", icon: "pi pi-book", iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-200" },
            { label: "Timed Tests", icon: "pi pi-clock", iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-900/70 dark:text-sky-200" },
            { label: "Analytics", icon: "pi pi-chart-line", iconClass: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-200" },
        ],
    },
    {
        code: "nursing",
        tileClass: "bg-linear-to-br from-emerald-500 to-teal-400 text-white shadow-emerald-500/30",
        washClass: "from-emerald-400/45 to-teal-300/25 dark:from-emerald-500/30 dark:to-teal-400/15",
        patternClass: "pattern-dots",
        inkClass: "text-emerald-600 dark:text-emerald-300",
        icon: "pi pi-briefcase",
        name: "Nursing School",
        abb: "BSN",
        subtitle: "Comprehensive nursing school test bank and targeted remediation",
        bundleLabel: "Nursing Success Kit",
        dashboardRoute: "/nursing",
        pricingRoute: "/nursing-pricing",
        cardClass: "border-emerald-200 bg-emerald-50/75 dark:border-emerald-900/70 dark:bg-emerald-950/30",
        bundleClass: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/70 dark:text-emerald-100",
        ribbonClass: "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
        moduleShellClass: "border-emerald-200 bg-teal-50/70 dark:border-emerald-800 dark:bg-emerald-950/40",
        modules: [
            { label: "Q-Bank", icon: "pi pi-book", iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-200" },
            { label: "Exit Exams", icon: "pi pi-file-edit", iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-200" },
            { label: "Lessons", icon: "pi pi-play", iconClass: "bg-rose-100 text-rose-500 dark:bg-rose-900/60 dark:text-rose-200" },
        ],
    },
    {
        code: "nclex",
        tileClass: "bg-linear-to-br from-blue-500 to-indigo-500 text-white shadow-blue-500/30",
        washClass: "from-blue-400/45 to-indigo-300/25 dark:from-blue-500/30 dark:to-indigo-400/15",
        patternClass: "pattern-diagonal",
        inkClass: "text-blue-600 dark:text-blue-300",
        icon: "pi pi-bolt",
        name: "NCLEX RN/PN",
        abb: "RN",
        subtitle: "High-fidelity NCLEX-style practice with readiness intelligence",
        bundleLabel: "Readiness Combo",
        dashboardRoute: "/nclex",
        pricingRoute: "/nclex-pricing",
        cardClass: "border-blue-200 bg-blue-50/75 dark:border-blue-900/70 dark:bg-sky-950/30",
        bundleClass: "bg-blue-100 text-blue-900 dark:bg-blue-900/70 dark:text-blue-100",
        ribbonClass: "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100",
        moduleShellClass: "border-blue-200 bg-indigo-50/60 dark:border-blue-800 dark:bg-sky-950/40",
        modules: [
            { label: "CAT Exams", icon: "pi pi-sliders-h", iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-200" },
            { label: "Q-Bank", icon: "pi pi-book", iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-200" },
            { label: "Readiness", icon: "pi pi-chart-line", iconClass: "bg-violet-100 text-violet-600 dark:bg-violet-900/60 dark:text-violet-200" },
        ],
    },
];

const streakDays = ref(1);
const latestAttempt = ref(null);
const latestAttemptLoading = ref(false);
const latestAttemptError = ref("");
let latestAttemptRequestId = 0;

const firstName = computed(() => {
    const fullName = user.value?.name || "Student";
    return fullName.split(" ")[0];
});

const isAdmin = computed(() => {
    const role = user.value?.roles?.[0];
    return role === "super-admin" || role === "admin";
});

const planStatus = (code) => {
    if (active(code)) return "active";
    if (isTrial(code)) return "trial";
    if (wasTrial(code)) return "expired";
    return "expired";
};

const statusLabel = (code) => {
    const status = planStatus(code);
    if (status === "active") return "Active";
    if (status === "trial") return "Trial";
    return "Needs Upgrade";
};

const statusClass = (code) => {
    const status = planStatus(code);
    if (status === "active") return "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200";
    if (status === "trial") return "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950/70 dark:text-amber-200";
    return "border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-950/70 dark:text-rose-200";
};

const productPlans = (code) => {
    const plans = user.value?.subscriptions?.[code];
    return Array.isArray(plans) ? plans : [];
};

const productExpiryDate = (code) => {
    const dates = productPlans(code)
        .map((plan) => {
            if (!plan?.expires) return null;
            const date = new Date(`${plan.expires}T23:59:59`);
            return Number.isNaN(date.getTime()) ? null : date;
        })
        .filter(Boolean);

    if (!dates.length) return null;

    const now = Date.now();
    const future = dates
        .filter((date) => date.getTime() >= now)
        .sort((a, b) => a.getTime() - b.getTime());

    if (future.length) return future[0];

    return dates.sort((a, b) => b.getTime() - a.getTime())[0];
};

const formatProductDate = (date) => {
    return date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const accessHeading = (code) => {
    const status = planStatus(code);
    if (status === "active") return "Subscription expires:";
    if (status === "trial") return "Trial expires:";
    return productPlans(code).length ? "Access expired:" : "Access status:";
};

const accessValue = (code) => {
    const expiry = productExpiryDate(code);
    if (expiry) return formatProductDate(expiry);
    return "Choose a plan to start";
};

const accessDetail = (code) => {
    const status = planStatus(code);
    const days = daysLeft(code);

    if (status === "active") {
        return days > 0 ? `${days} day${days === 1 ? "" : "s"} left` : "Expires today";
    }

    if (status === "trial") {
        return days > 0 ? `${days} trial day${days === 1 ? "" : "s"} left` : "Trial ends today";
    }

    return productPlans(code).length ? "Renew to unlock every tool" : "Subscribe to unlock every tool";
};

const accessIconClass = (code) => {
    const status = planStatus(code);
    if (status === "active") return "pi pi-check-circle text-emerald-600 dark:text-emerald-300";
    if (status === "trial") return "pi pi-clock text-amber-600 dark:text-amber-300";
    return "pi pi-lock text-rose-600 dark:text-rose-300";
};

const productPrimaryLabel = (code) => {
    const status = planStatus(code);
    if (status === "active") return "Open Dashboard";
    if (status === "trial") return "Continue Trial";
    return productPlans(code).length ? "Limited Access" : "Limited Access";
};

const productPrimaryRoute = (product) => {
    return planStatus(product.code) === "expired" ? product.dashboardRoute : product.dashboardRoute;
};

const activeCount = computed(() =>
    products.filter((product) => planStatus(product.code) === "active").length,
);

const trialCount = computed(() =>
    products.filter((product) => planStatus(product.code) === "trial").length,
);

const needsUpgradeCount = computed(() =>
    products.filter((product) => planStatus(product.code) === "expired").length,
);

const initials = computed(() => {
    if (!user.value?.name) return "U";
    return user.value.name
        .split(" ")
        .slice(0, 2)
        .map((chunk) => chunk[0])
        .join("")
        .toUpperCase();
});

const streakMessage = computed(() => {
    if (streakDays.value >= 14) return "Outstanding consistency";
    if (streakDays.value >= 7) return "Strong momentum";
    if (streakDays.value >= 3) return "Great study rhythm";
    return "Fresh start, keep going";
});

const userActivityDate = computed(() => {
    const raw = user.value?.last_login || user.value?.updated_at || user.value?.created_at;
    if (!raw) return null;
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
});

const formatRelativeTime = (date) => {
    const diffMs = Date.now() - date.getTime();
    const minuteMs = 60 * 1000;
    const hourMs = 60 * minuteMs;
    const dayMs = 24 * hourMs;

    if (diffMs < minuteMs) return "Just now";
    if (diffMs < hourMs) return `${Math.floor(diffMs / minuteMs)}m ago`;
    if (diffMs < dayMs) return `${Math.floor(diffMs / hourMs)}h ago`;
    if (diffMs < dayMs * 7) return `${Math.floor(diffMs / dayMs)}d ago`;

    return date.toLocaleDateString();
};

const lastActivityText = computed(() => {
    if (!userActivityDate.value) return "No recent activity";
    return formatRelativeTime(userActivityDate.value);
});

const focusTip = computed(() => {
    if (needsUpgradeCount.value > 0) {
        return `Upgrade ${needsUpgradeCount.value} plan${needsUpgradeCount.value > 1 ? "s" : ""} to unlock full access.`;
    }
    if (trialCount.value > 0) {
        return "Convert your trial plan for uninterrupted prep.";
    }
    return "Keep your streak alive with one focused timed quiz today.";
});

const lastProduct = computed(() =>
    products.find((product) => product.code === mainStore.last_product_code) || null,
);

const fallbackProduct = computed(() =>
    products.find((product) => planStatus(product.code) === "active") ||
    products.find((product) => planStatus(product.code) === "trial") ||
    null,
);

const primaryProduct = computed(() => lastProduct.value || fallbackProduct.value);

const primaryActionRoute = computed(() => {
    const product = primaryProduct.value;
    if (!product) return "/subscription";
    return planStatus(product.code) === "expired" ? product.pricingRoute : product.dashboardRoute;
});

const primaryActionLabel = computed(() => {
    const product = primaryProduct.value;
    if (!product) return "View Subscription Plans";
    if (planStatus(product.code) === "expired") return `View ${product.name} Plans`;
    if (lastProduct.value?.code === product.code) return `Continue ${product.name}`;
    return `Open ${product.name}`;
});

const commandStats = computed(() => [
    {
        label: "Streak",
        value: `${streakDays.value}d`,
        detail: streakMessage.value,
        icon: "pi pi-bolt",
        class: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
    },
    {
        label: "Active",
        value: activeCount.value,
        detail: "Plans ready",
        icon: "pi pi-check-circle",
        class: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
    },
    {
        label: "Upgrade",
        value: needsUpgradeCount.value,
        detail: needsUpgradeCount.value ? "Needs action" : "All clear",
        icon: needsUpgradeCount.value ? "pi pi-lock" : "pi pi-shield",
        class: needsUpgradeCount.value
            ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
            : "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200",
    },
]);

const guestHeroStats = [
    {
        label: "Exam Tracks",
        value: "3",
        detail: "TEAS, Nursing, NCLEX",
        icon: "pi pi-map",
        class: "bg-light-blue-500 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200",
    },
    {
        label: "Pass Guarantee",
        value: "99% chance",
        detail: "Our students pass on first try",
        icon: "pi pi-book",
        class: " bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
    },
    {
        label: "Pricing",
        value: "student friendly",
        detail: "Save big and get more",
        icon: "pi pi-shield",
        class: " bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
    },
];

const clampPercent = (value) => Math.max(0, Math.min(100, Number(value) || 0));

const scoreToneClass = (score) => {
    if (score >= 75) return "text-emerald-600 dark:text-emerald-300";
    if (score >= 55) return "text-amber-600 dark:text-amber-300";
    return "text-red-600 dark:text-red-300";
};

const scoreFillClass = (score) => {
    if (score >= 75) return "bg-emerald-500";
    if (score >= 55) return "bg-amber-500";
    return "bg-red-500 dark:bg-red-400";
};

const scoreSummary = (score) => {
    if (score >= 85) return "Excellent momentum";
    if (score >= 75) return "Strong readiness";
    if (score >= 55) return "Improving steadily";
    return "Needs focused review";
};

const attemptTimestamp = (attempt) => {
    const raw = attempt?.completed_at || attempt?.updated_at || attempt?.created_at;
    if (!raw) return 0;
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const isAttemptCompleted = (attempt) => attempt?.completed === true || Number(attempt?.completed) === 1;

const normalizeAttempt = (attempt, productCode, source = "exam") => ({
    ...attempt,
    productCode,
    source,
    attempt_id: attempt?.attempt_id || attempt?.id,
    sub_topic_name:
        attempt?.sub_topic_name ||
        (source === "cat" ? "Computer Adaptive Test" : "Practice Attempt"),
});

const sortAttemptsByLatest = (attempts) => {
    return [...attempts].sort((a, b) => {
        const dateDiff = attemptTimestamp(b) - attemptTimestamp(a);
        if (dateDiff !== 0) return dateDiff;
        return Number(b?.attempt_id || b?.id || 0) - Number(a?.attempt_id || a?.id || 0);
    });
};

const fetchLatestAttempt = async () => {
    const product = lastProduct.value;
    const requestId = ++latestAttemptRequestId;

    latestAttempt.value = null;
    latestAttemptError.value = "";
    latestAttemptLoading.value = false;

    if (!isAuthenticated.value) return;
    if (!product) return;

    latestAttemptLoading.value = true;

    try {
        const responses = await Promise.all([
            axios.get(`${product.code}/previous-attempts`, { showLoader: false }),
            product.code === "nclex"
                ? axios.get("nclex/cat-attempts", { showLoader: false }).catch(() => ({ data: { data: [] } }))
                : Promise.resolve({ data: { data: [] } }),
        ]);

        if (requestId !== latestAttemptRequestId) return;

        const regularAttempts = Array.isArray(responses[0]?.data?.data)
            ? responses[0].data.data.map((attempt) => normalizeAttempt(attempt, product.code))
            : [];
        const catAttempts = Array.isArray(responses[1]?.data?.data)
            ? responses[1].data.data.map((attempt) => normalizeAttempt(attempt, "nclex", "cat"))
            : [];
        const attempts = sortAttemptsByLatest([...regularAttempts, ...catAttempts]);

        latestAttempt.value = attempts[0] || null;
    } catch {
        if (requestId === latestAttemptRequestId) {
            latestAttemptError.value = "Latest report is unavailable right now.";
        }
    } finally {
        if (requestId === latestAttemptRequestId) {
            latestAttemptLoading.value = false;
        }
    }
};

const latestAttemptScore = computed(() => clampPercent(Math.round(Number(latestAttempt.value?.score) || 0)));
const PASS_MARK = 75;
const latestRing = 2 * Math.PI * 30;
const latestRingOffset = computed(() => latestRing * (1 - latestAttemptScore.value / 100));

const whyItems = [
    { title: "Realistic question quality", copy: "Questions aligned with real exam style and difficulty.", icon: "pi pi-verified", tile: "bg-linear-to-br from-sky-500 to-cyan-400 shadow-sky-500/30" },
    { title: "Weak-area focus", copy: "Target gaps and improve with feedback loops.", icon: "pi pi-bullseye", tile: "bg-linear-to-br from-emerald-500 to-teal-400 shadow-emerald-500/30" },
    { title: "Comprehensive analytics", copy: "Track momentum, confidence, and readiness over time.", icon: "pi pi-chart-line", tile: "bg-linear-to-br from-amber-400 to-orange-500 shadow-amber-500/30" },
    { title: "High pass-rate strategy", copy: "Structured routines and guided practice built for exam success.", icon: "pi pi-trophy", tile: "bg-linear-to-br from-rose-500 to-pink-500 shadow-rose-500/30" },
];

const latestAttemptLinearStyle = computed(() => ({
    width: `${latestAttemptScore.value}%`,
}));

const latestAttemptRingStyle = computed(() => ({
    "--value": latestAttemptScore.value,
    "--size": "4.75rem",
    "--thickness": "7px",
}));

const latestAttemptDate = computed(() => {
    const timestamp = attemptTimestamp(latestAttempt.value);
    if (!timestamp) return "Date unavailable";
    return new Date(timestamp).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
});

const latestAttemptTime = computed(() => {
    const formatted = secondsToHms(latestAttempt.value?.time_taken || 0);
    return formatted || "No timer";
});

const latestAttemptStatusLabel = computed(() =>
    isAttemptCompleted(latestAttempt.value) ? "Completed" : "In progress",
);

const latestAttemptReportRoute = computed(() => {
    if (!latestAttempt.value?.attempt_id) return "";
    if (latestAttempt.value.source === "cat") {
        return `/nclex/adaptive-report/${latestAttempt.value.attempt_id}`;
    }
    return `/${latestAttempt.value.productCode}/performance-report/${latestAttempt.value.attempt_id}`;
});

const summaryStats = computed(() => [
    {
        label: "Active Plans",
        value: activeCount.value,
        detail: "Ready to use",
        icon: "pi pi-check-circle",
        tone: "text-emerald-600 dark:text-emerald-300",
    },

    {
        label: "Need Upgrade",
        value: needsUpgradeCount.value,
        detail: "Locked or expired",
        icon: "pi pi-lock",
        tone: "text-rose-600 dark:text-rose-300",
    },
    {
        label: "Study Streak",
        value: `${streakDays.value}d`,
        detail: streakMessage.value,
        icon: "",
        blob: "🔥",
        tone: "text-sky-600 dark:text-sky-300",
    },
]);

const toLocalDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const updateVisitStreak = () => {
    if (typeof window === "undefined") return;

    const uid = user.value?.id || user.value?.email || "guest";
    const key = `nursenex_streak_${uid}`;

    const today = new Date();
    const todayKey = toLocalDateKey(today);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = toLocalDateKey(yesterday);

    let data = { lastVisit: todayKey, streak: 1 };

    try {
        const saved = window.localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.lastVisit === todayKey) {
                data = { ...parsed };
            } else if (parsed?.lastVisit === yesterdayKey) {
                data = { lastVisit: todayKey, streak: Number(parsed.streak || 0) + 1 };
            }
        }
    } catch {
        data = { lastVisit: todayKey, streak: 1 };
    }

    streakDays.value = Math.max(1, Number(data.streak || 1));

    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch {
        // Ignore localStorage write failures.
    }
};

const goToSupport = () => {
    window.location.href = "mailto:support@nursenex.com";
};

watch(
    [() => mainStore.last_product_code, isAuthenticated],
    fetchLatestAttempt,
    { immediate: true },
);

onMounted(() => {
    updateVisitStreak();
});
</script>
<template>
    <div class="dash-shell">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <!-- ================= SIGNED-IN HERO ================= -->
            <section v-if="isAuthenticated" class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
                <div class="ui-rise">
                    <div class="relative overflow-hidden rounded-3xl p-4 sm:p-6">
                        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                            <div
                                class="ui-drift absolute -top-28 -right-20 h-80 w-80 rounded-full blur-3xl theme-glow opacity-70">
                            </div>
                            <div
                                class="ui-drift-slow absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10">
                            </div>
                            <div
                                class="absolute inset-0 opacity-[0.28] [background-image:radial-gradient(circle_at_1px_1px,var(--theme-border)_1px,transparent_0)] [background-size:24px_24px]">
                            </div>
                        </div>
                        <div class="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div class="flex min-w-0 items-start gap-3 sm:gap-4">
                                <div class="theme-ring-gradient shrink-0 rounded-2xl p-[2px] shadow-lg">
                                    <div v-if="user?.avatar"
                                        class="h-14 w-14 overflow-hidden rounded-[14px] bg-white sm:h-16 sm:w-16 dark:bg-slate-900">
                                        <img :src="'/storage/' + user.avatar" class="h-full w-full object-cover"
                                            alt="User Avatar" />
                                    </div>
                                    <div v-else
                                        class="theme-surface flex h-14 w-14 items-center justify-center rounded-[14px] text-base font-black sm:h-16 sm:w-16 sm:text-lg">
                                        {{ initials }}
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <span class="dash-chip theme-soft py-1 text-[11px]">
                                            <span class="relative flex h-1.5 w-1.5">
                                                <span
                                                    class="theme-dot absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"></span>
                                                <span
                                                    class="theme-dot relative inline-flex h-1.5 w-1.5 rounded-full"></span>
                                            </span>
                                            <span class="truncate">{{ primaryProduct?.name || "Study Hub" }}</span>
                                        </span>
                                        <span
                                            class="dash-chip border-amber-200 bg-amber-50 py-1 text-[11px] text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                                            <i class="pi pi-bolt text-[10px]"></i>
                                            {{ streakDays }}d streak
                                        </span>
                                    </div>
                                    <h1
                                        class="mt-3 max-w-3xl break-words text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl xl:text-4xl dark:text-slate-100">
                                        Ready when you are,
                                        <span class="theme-text-gradient">{{ firstName }}</span>
                                    </h1>
                                    <p
                                        class="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                                        {{ focusTip }}
                                    </p>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:w-56 lg:grid-cols-1">
                                <button type="button"
                                    class="dash-btn theme-surface theme-shadow min-h-11 w-full text-sm"
                                    @click="router.push(primaryActionRoute)">
                                    <span class="truncate">{{ primaryActionLabel }}</span>
                                    <i class="pi pi-arrow-right text-xs"></i>
                                </button>
                                <button type="button" class="dash-btn-ghost min-h-11 w-full text-sm"
                                    @click="router.push('/subscription')">
                                    <i class="pi pi-credit-card text-xs"></i>
                                    <span>Plans</span>
                                </button>
                            </div>
                        </div>
                        <!-- Latest attempt -->
                        <div class="dash-card-white relative mt-5">
                            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div class="min-w-0 flex-1">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <p class="dash-eyebrow theme-text">Latest attempt</p>
                                        <span v-if="lastProduct" class="analysis-pill theme-soft border text-[11px]">{{
                                            lastProduct.name }}</span>
                                    </div>

                                    <div v-if="latestAttemptLoading" class="mt-3">
                                        <div class="h-4 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-800">
                                        </div>
                                        <div
                                            class="mt-3 h-2 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-800">
                                        </div>
                                    </div>

                                    <div v-else-if="latestAttempt" class="mt-3">
                                        <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                                            <div class="min-w-0">
                                                <h3
                                                    class="break-words text-base font-extrabold text-slate-950 dark:text-slate-100">
                                                    {{ latestAttempt.sub_topic_name }}
                                                </h3>
                                                <p
                                                    class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                                    <span><i class="pi pi-calendar mr-1 text-[10px]"></i>{{
                                                        latestAttemptDate }}</span>
                                                    <span aria-hidden="true">&middot;</span>
                                                    <span><i class="pi pi-clock mr-1 text-[10px]"></i>{{
                                                        latestAttemptTime }}</span>
                                                    <span aria-hidden="true">&middot;</span>
                                                    <span class="analysis-pill px-2 py-0.5 text-[10px]"
                                                        :class="latestAttemptStatusLabel === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200'">
                                                        {{ latestAttemptStatusLabel }}
                                                    </span>
                                                </p>
                                            </div>
                                            <p class="text-sm font-bold" :class="scoreToneClass(latestAttemptScore)">{{
                                                scoreSummary(latestAttemptScore) }}</p>
                                        </div>
                                        <div class="mt-4">
                                            <div
                                                class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide">
                                                <span class="text-slate-500 dark:text-slate-400">Score vs {{ PASS_MARK
                                                }}% pass mark</span>
                                                <span :class="scoreToneClass(latestAttemptScore)">{{ latestAttemptScore
                                                }}%</span>
                                            </div>
                                            <div class="dash-progress relative mt-2 h-2.5 bg-light-blue-500">
                                                <div class="relative h-full overflow-hidden rounded-full transition-all duration-700"
                                                    :class="scoreFillClass(latestAttemptScore)"
                                                    :style="latestAttemptLinearStyle">
                                                    <span
                                                        class="ui-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent"></span>
                                                </div>
                                                <span
                                                    class="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-slate-700 dark:bg-slate-200"
                                                    :style="{ left: `${PASS_MARK}%` }"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-else class="mt-3">
                                        <h3 class="text-base font-extrabold text-slate-950 dark:text-slate-100">{{
                                            latestAttemptError || "No recent attempt yet" }}</h3>
                                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Open a product and
                                            complete an attempt to light up this report.</p>
                                    </div>
                                </div>

                                <div v-if="latestAttempt && !latestAttemptLoading"
                                    class="flex w-full shrink-0 items-center gap-4 md:w-auto md:flex-col md:justify-center">
                                    <div class="relative h-20 w-20 shrink-0">
                                        <svg class="h-20 w-20 -rotate-90" viewBox="0 0 72 72" aria-hidden="true">
                                            <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor"
                                                stroke-width="7" class="text-slate-200 dark:text-slate-700" />
                                            <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor"
                                                stroke-width="7" stroke-linecap="round" :stroke-dasharray="latestRing"
                                                :stroke-dashoffset="latestRingOffset"
                                                :class="scoreToneClass(latestAttemptScore)"
                                                class="transition-[stroke-dashoffset] duration-1000 ease-out" />
                                            <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor"
                                                stroke-width="9" :stroke-dasharray="`1.5 ${latestRing - 1.5}`"
                                                :stroke-dashoffset="latestRing * (1 - PASS_MARK / 100)"
                                                class="text-slate-600 dark:text-slate-200" />
                                        </svg>
                                        <span
                                            class="absolute inset-0 flex items-center justify-center text-sm font-black tabular-nums text-slate-900 dark:text-white">{{
                                                latestAttemptScore }}%</span>
                                    </div>
                                    <button v-if="latestAttemptReportRoute" type="button"
                                        class="dash-btn theme-surface theme-shadow px-4 py-2 text-xs"
                                        @click="router.push(latestAttemptReportRoute)">
                                        <span>View report</span>
                                        <i class="pi pi-arrow-right text-[10px]"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <EmailVerification v-if="!user?.email_verified" class="mt-5 lg:hidden" />
                </div>

                <aside
                    class="ui-rise relative hidden overflow-hidden rounded-3xl border border-sky-100 bg-light-blue-500 p-5 lg:block dark:!border-slate-800 dark:!bg-slate-900"
                    style="animation-delay: 80ms">
                    <div
                        class="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-700">
                    </div>
                    <div
                        class="relative flex min-h-28 items-center gap-4 border-b border-white/25 pb-5 dark:border-slate-800">
                        <div
                            class="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/95 shadow-custom ring-1 ring-sky-100 dark:!bg-slate-950 dark:ring-slate-800">
                            <ExamIcon size="78" class="drop-shadow-sm" />
                        </div>
                        <div class="min-w-0">
                            <span
                                class="inline-flex max-w-full items-center rounded-3xl bg-white/10 px-2.5 py-1 text-[11px] font-semibold leading-tight text-bright-sun-500 break-words ring-1 ring-white/20">
                                {{ focusTip }}
                            </span>
                            <p class="mt-2 text-xs leading-tight text-white">Last activity: {{ lastActivityText }}</p>
                        </div>
                    </div>
                    <EmailVerification v-if="!user?.email_verified" class="relative mt-4 max-w-none" />
                    <div class="relative mt-4 grid grid-cols-3 gap-2">
                        <div v-for="stat in commandStats" :key="stat.label"
                            class="dash-tile-soft px-2 py-2 text-center">
                            <i :class="[stat.icon, 'text-xs theme-text']"></i>
                            <p
                                class="mt-1 text-base font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">
                                {{ stat.value }}</p>
                            <p class="text-[9px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                {{ stat.label }}</p>
                        </div>
                    </div>
                    <div class="relative mt-4 flex flex-col gap-2">
                        <button type="button" class="dash-btn theme-surface theme-shadow w-full py-2.5"
                            @click="router.push(primaryActionRoute)">
                            {{ primaryActionLabel }} <i class="pi pi-arrow-right text-[10px]"></i>
                        </button>
                        <button type="button" class="dash-btn-ghost w-full py-2.5"
                            @click="router.push('/subscription')">
                            <i class="pi pi-credit-card"></i> View subscription plans
                        </button>
                        <router-link v-if="isAdmin" to="/admin" class="dash-btn-ghost w-full py-2.5">
                            <i class="pi pi-cog"></i> Open admin panel
                        </router-link>
                    </div>
                </aside>
            </section>
            <!-- ================= GUEST HERO ================= -->
            <section v-else class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch lg:gap-6">
                <div class="ui-rise relative overflow-hidden rounded-3xl p-4 sm:p-6">

                    <div class="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="dash-chip theme-soft py-1 text-[11px]"><i
                                        class="pi pi-sparkles text-[10px]"></i> Start free</span>
                                <span
                                    class="dash-chip border-amber-200 bg-amber-50 py-1 text-[11px] text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                                    <i class="pi pi-shield text-[10px]"></i> No auto-billing
                                </span>
                            </div>
                            <h1
                                class="mt-3 max-w-3xl break-words text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl xl:text-4xl dark:text-slate-100">
                                Practice smarter for
                                <span class="theme-text-gradient">TEAS, nursing school, and NCLEX</span>
                            </h1>

                            <p
                                class="mt-3 max-w-2xl text-sm font-medium text-slate-600 md:text-base dark:text-slate-300">
                                Build readiness with realistic questions, focused remediation, timed practice,
                                and progress insights across every major nursing exam track.
                            </p>
                        </div>
                        <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:w-56 lg:grid-cols-1">
                            <button type="button" class="dash-btn theme-surface theme-shadow min-h-11 w-full text-sm"
                                @click="router.push('/register')">
                                <i class="pi pi-user-plus text-xs"></i>
                                <span class="text-center leading-tight">Create free account</span>
                            </button>
                            <button type="button" class="dash-btn-ghost min-h-11 w-full text-sm"
                                @click="router.push('/login')">
                                <i class="pi pi-sign-in text-xs"></i>
                                <span>Sign in</span>
                            </button>
                            <button type="button" class="dash-btn-ghost min-h-11 w-full text-sm"
                                @click="router.push('/subscription')">
                                <i class="pi pi-credit-card text-xs"></i>
                                <span>Plans</span>
                            </button>
                        </div>
                    </div>
                    <div class="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div v-for="stat in guestHeroStats" :key="stat.label"
                            class="rounded-2xl border border-white/60 p-3 shadow-sm dark:border-white/5"
                            :class="stat.class">
                            <div class="flex items-center justify-between gap-3">
                                <p class="text-[10px] font-bold uppercase tracking-wide">{{ stat.label }}</p>
                                <i :class="[stat.icon, 'text-sm']"></i>
                            </div>
                            <p class="mt-2 text-xl font-black leading-none">{{ stat.value }}</p>
                            <p class="mt-1 text-xs font-semibold opacity-80">{{ stat.detail }}</p>
                        </div>
                    </div>
                    <div class="dash-card-white relative mt-5">
                        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p class="dash-eyebrow theme-text">Choose your starting point</p>
                                <p class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Preview a track, then keep your progress when you create an account.
                                </p>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <router-link v-for="product in products" :key="`guest-chip-${product.code}`"
                                    :to="product.dashboardRoute" class="dash-btn theme-surface px-3 py-1.5 text-xs">
                                    <i :class="product.icon" class="text-[10px]"></i> {{ product.name }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <aside
                    class="ui-rise relative hidden overflow-hidden rounded-3xl border border-sky-100 bg-light-blue-500 p-5 lg:block dark:!border-slate-800 dark:!bg-slate-900"
                    style="animation-delay: 80ms">
                    <div
                        class="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-700">
                    </div>
                    <div
                        class="relative flex min-h-28 items-center gap-4 border-b border-white/25 pb-5 dark:border-slate-800">
                        <div
                            class="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/95 shadow-custom ring-1 ring-sky-100 dark:!bg-slate-950 dark:ring-slate-800">
                            <ExamIcon size="78" class="drop-shadow-sm" />
                        </div>
                        <div class="min-w-0">
                            <span
                                class="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-bright-sun-500 ring-1 ring-white/20">Select
                                your path</span>
                            <p class="mt-2 text-lg font-extrabold leading-tight text-white">What are you studying today?
                            </p>
                        </div>
                    </div>
                    <div class="relative mt-4 space-y-2">
                        <button v-for="product in products" :key="`guest-${product.code}`" type="button"
                            class="group dash-tile flex w-full items-center gap-3 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            @click="router.push(product.dashboardRoute)">
                            <span class="dash-icon-tile h-10 w-10 shadow-lg group-hover:scale-110 group-hover:-rotate-3"
                                :class="product.tileClass">
                                <i :class="product.icon"></i>
                            </span>
                            <span class="min-w-0 flex-1">
                                <span class="block text-sm font-extrabold text-slate-950 dark:text-white">{{
                                    product.name }}</span>
                                <span class="block truncate text-xs text-slate-500 dark:text-slate-300">{{
                                    product.subtitle }}</span>
                            </span>
                            <i
                                class="pi pi-arrow-right text-xs text-slate-400 transition-transform group-hover:translate-x-0.5"></i>
                        </button>
                    </div>
                </aside>
            </section>

            <!-- ================= PRODUCTS ================= -->
            <section class="space-y-4">
                <div class="ui-rise flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
                    style="animation-delay: 120ms">
                    <div>
                        <p class="dash-eyebrow theme-text">Your tracks</p>
                        <h2
                            class="mt-1 text-xl font-extrabold tracking-tight text-slate-950 md:text-2xl dark:text-slate-100">
                            Select a product</h2>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">Choose a track and continue from where you
                        left off.</p>
                </div>

                <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <article v-for="(product, index) in products" :key="product.code"
                        class="group dash-card-white dash-hover-lift ui-rise relative flex min-h-full flex-col p-5 md:p-6"
                        :class="primaryProduct?.code === product.code ? 'ring-2 theme-border' : ''"
                        :style="{ animationDelay: `${160 + index * 70}ms`, ...(primaryProduct?.code === product.code ? { '--tw-ring-color': 'var(--theme-accent)' } : {}) }">
                        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                            <div class="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-linear-to-br opacity-70 blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-100"
                                :class="product.washClass"></div>
                            <div class="ui-pan absolute inset-0 opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.15]"
                                :class="[product.patternClass, product.inkClass]"></div>
                            <i class="absolute -bottom-6 -right-4 text-[110px] opacity-[0.06] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                                :class="[product.icon, product.inkClass]"></i>
                        </div>

                        <div class="relative flex items-start justify-between gap-3">
                            <div class="flex items-center gap-3">
                                <span
                                    class="dash-icon-tile h-12 w-12 text-xl shadow-lg group-hover:scale-110 group-hover:-rotate-3"
                                    :class="product.tileClass">
                                    <i :class="product.icon"></i>
                                </span>
                                <div class="min-w-0">
                                    <p class="text-[10px] font-black uppercase tracking-[0.18em]"
                                        :class="product.inkClass">{{ product.abb }}</p>
                                    <h3
                                        class="text-lg font-extrabold leading-tight tracking-tight text-slate-950 dark:text-slate-100">
                                        {{ product.name }}</h3>
                                </div>
                            </div>
                            <div class="flex flex-col items-end gap-1.5">
                                <span class="analysis-pill border text-[11px]" :class="statusClass(product.code)">{{
                                    statusLabel(product.code) }}</span>
                                <span v-if="primaryProduct?.code === product.code"
                                    class="analysis-pill theme-soft border text-[10px]">
                                    <i class="pi pi-compass mr-1"></i>Continue here
                                </span>
                            </div>
                        </div>

                        <p class="relative mt-3 text-sm leading-5 text-slate-600 dark:text-slate-300">{{
                            product.subtitle }}</p>

                        <span
                            class="relative mt-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold"
                            :class="product.bundleClass">
                            <i class="pi pi-gift text-[10px]"></i>{{ product.bundleLabel }}
                        </span>

                        <div class="relative mt-4 grid grid-cols-3 gap-2">
                            <button v-for="module in product.modules" :key="module.label" type="button"
                                class="dash-tile-soft flex flex-col items-center gap-1.5 px-2 py-2.5 text-center transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                @click="router.push(product.dashboardRoute)">
                                <span class="inline-flex h-8 w-8 items-center justify-center rounded-xl text-sm"
                                    :class="module.iconClass"><i :class="module.icon"></i></span>
                                <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200">{{ module.label
                                }}</span>
                            </button>
                        </div>

                        <div class="dash-tile relative mt-4 flex items-start gap-3">
                            <span
                                class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-base shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                                <i :class="accessIconClass(product.code)"></i>
                            </span>
                            <div class="min-w-0">
                                <p
                                    class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    {{ accessHeading(product.code) }}</p>
                                <p class="mt-0.5 text-sm font-extrabold text-slate-950 dark:text-slate-100">{{
                                    accessValue(product.code) }}</p>
                                <p class="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{{
                                    accessDetail(product.code) }}</p>
                            </div>
                        </div>

                        <div class="relative mt-auto grid grid-cols-1 gap-2 pt-5 sm:grid-cols-[1fr_auto]">
                            <button type="button" class="dash-btn theme-surface theme-shadow min-h-11 w-full text-sm"
                                @click="router.push(productPrimaryRoute(product))">
                                <span>{{ productPrimaryLabel(product.code) }}</span>
                                <i class="pi pi-arrow-right text-xs"></i>
                            </button>
                            <button type="button" class="dash-btn-ghost min-h-11 text-sm"
                                @click="router.push(product.pricingRoute)">
                                <i class="pi pi-credit-card text-xs"></i>
                                <span>Pricing</span>
                            </button>
                        </div>
                    </article>
                </div>
            </section>

            <!-- ================= ACCOUNT SNAPSHOT ================= -->
            <section v-if="isAuthenticated" class="ui-rise dash-card" style="animation-delay: 300ms">
                <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p class="dash-eyebrow theme-text">Account snapshot</p>
                        <h2 class="dash-title mt-1">Where you stand</h2>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">Quick access, trial, and streak visibility.
                    </p>
                </div>
                <dl class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div v-for="stat in summaryStats" :key="stat.label"
                        class="dash-tile-soft flex items-center gap-3 px-3 py-2.5">
                        <span v-if="stat.blob"
                            class="dash-icon-tile h-9 w-9 shrink-0 bg-orange-100 text-base ring-1 ring-orange-200 dark:bg-orange-900/30 dark:ring-orange-800/60">{{
                                stat.blob }}</span>
                        <span v-else class="dash-icon-tile theme-icon h-9 w-9 shrink-0 text-sm"><i
                                :class="stat.icon"></i></span>
                        <div class="min-w-0">
                            <dd
                                class="text-lg font-extrabold leading-tight tabular-nums text-slate-950 dark:text-slate-100">
                                {{ stat.value }}</dd>
                            <dt class="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-300">{{
                                stat.label }} · {{ stat.detail }}</dt>
                        </div>
                    </div>
                </dl>
            </section>

            <!-- ================= WHY + HELP ================= -->
            <section class="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <div class="ui-rise dash-card xl:col-span-2" style="animation-delay: 340ms">
                    <p class="dash-eyebrow theme-text">Why Nursenex</p>
                    <h3 class="dash-title mt-1">Built for consistent practice</h3>
                    <p class="analysis-muted mt-1">Measurable progress and readiness decisions, not just question
                        counts.</p>
                    <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div v-for="item in whyItems" :key="item.title"
                            class="group dash-card-white dash-hover-lift flex items-start gap-3">
                            <span
                                class="dash-icon-tile h-10 w-10 shrink-0 text-white shadow-lg group-hover:scale-110 group-hover:-rotate-3"
                                :class="item.tile"><i :class="item.icon"></i></span>
                            <div>
                                <p class="text-sm font-extrabold text-slate-900 dark:text-slate-100">{{ item.title }}
                                </p>
                                <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{ item.copy }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ui-rise dash-card flex flex-col justify-between gap-4" style="animation-delay: 380ms">
                    <div class="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-50"
                        aria-hidden="true"></div>
                    <div class="relative">
                        <span class="dash-icon-tile theme-icon h-11 w-11"><i class="pi pi-comments"></i></span>
                        <h3 class="dash-title mt-3">Need help?</h3>
                        <p class="analysis-muted mt-1 leading-6">We value your feedback and are here to support your
                            preparation journey.</p>
                    </div>
                    <div class="relative space-y-2.5">
                        <button type="button" class="dash-btn theme-surface theme-shadow w-full py-2.5"
                            @click="goToSupport">
                            <i class="pi pi-envelope"></i> Contact support
                        </button>
                        <p class="text-xs text-slate-500 dark:text-slate-400">You can also use the live chat at the
                            bottom-right corner.</p>
                    </div>
                </div>
            </section>

            <!-- ================= SOCIAL ================= -->
            <section class="ui-rise dash-card" style="animation-delay: 420ms">
                <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p class="dash-eyebrow theme-text">Community</p>
                        <h3 class="dash-title mt-1">Share and connect</h3>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">Join our social channels for updates, tips,
                        and success stories.</p>
                </div>
                <Socials />
            </section>
        </div>
    </div>
</template>

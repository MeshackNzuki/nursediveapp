<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { useMainStore } from "../stores";
import CommonButton from "../components/Buttons/CommonButton.vue";
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
    const key = `nursedive_streak_${uid}`;

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
    window.location.href = "mailto:support@nursedive.com";
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
    <div
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-white-500 p-4 text-slate-700 md:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh] dark:bg-slate-900 dark:text-slate-100">
        <div class="mx-auto max-w-7xl space-y-6">
            <section v-if="isAuthenticated" class="overflow-hidden px-0 pt-2 pb-4 sm:p-5 md:p-6">
                <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
                    <div>
                        <div
                            class="relative overflow-hidden rounded-[28px]  p-4  sm:p-5 dark:border-slate-800 dark:from-slate-950 dark:via-sky-950 dark:to-cyan-950">

                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-cyan-200/35 to-transparent dark:from-cyan-500/10">
                            </div>

                            <div class="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div class="flex min-w-0 items-start gap-3 sm:gap-4">
                                    <div v-if="user?.avatar"
                                        class="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-custom ring-2 ring-sky-200 sm:h-16 sm:w-16 dark:border-slate-900 dark:bg-slate-800 dark:ring-sky-900">
                                        <img :src="'/storage/' + user.avatar" class="h-full w-full object-cover"
                                            alt="User Avatar" />
                                    </div>
                                    <div v-else
                                        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-800 text-base font-black text-white shadow-custom ring-2 ring-sky-200 sm:h-16 sm:w-16 sm:text-lg dark:ring-sky-900">
                                        {{ initials }}
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <span
                                                class="inline-flex max-w-full items-center gap-1.5 rounded-full border border-sky-200 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-sky-700 shadow-sm dark:border-sky-700 dark:bg-slate-900/80 dark:text-sky-200">
                                                <i class="pi pi-compass text-[10px]"></i>
                                                <span class="truncate">{{ primaryProduct?.name || "Study Hub" }}</span>
                                            </span>
                                            <span
                                                class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                                                <i class="pi pi-bolt text-[10px]"></i>
                                                {{ streakDays }}d streak
                                            </span>
                                        </div>

                                        <h1
                                            class="mt-3 max-w-3xl break-words text-2xl font-black leading-tight text-slate-950 sm:text-3xl xl:text-4xl dark:text-slate-100">
                                            Ready when you are,
                                            <span
                                                class="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent dark:from-sky-300 dark:via-cyan-200 dark:to-emerald-200">
                                                {{ firstName }}
                                            </span>
                                        </h1>
                                        <p
                                            class="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                                            {{ focusTip }}
                                        </p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:w-56 lg:grid-cols-1">
                                    <button type="button"
                                        class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-sky-500/95 px-4 py-2.5 text-sm font-bold text-white shadow-custom transition hover:-translate-y-0.5 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                        @click="router.push(primaryActionRoute)">
                                        <span class="truncate">{{ primaryActionLabel }}</span>
                                        <i class="pi pi-arrow-right text-xs"></i>
                                    </button>
                                    <button type="button"
                                        class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-custom transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:border-sky-700 dark:hover:bg-slate-800"
                                        @click="router.push('/subscription')">
                                        <i class="pi pi-credit-card text-xs"></i>
                                        <span>Plans</span>
                                    </button>
                                </div>
                            </div>

                            <div
                                class="relative mt-4 rounded-2xl border border-white/80 bg-white/85 p-3 shadow-sm ring-1 ring-white/60 sm:p-4 dark:border-slate-800 dark:bg-slate-950/60 dark:ring-slate-800">
                                <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div class="min-w-0 flex-1">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <p class="text-xs font-bold uppercase text-sky-600 dark:text-sky-300">
                                                Latest Attempt
                                            </p>
                                            <span v-if="lastProduct"
                                                class="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-sky-100 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                                                {{ lastProduct.name }}
                                            </span>
                                        </div>
                                        <div v-if="latestAttemptLoading" class="mt-3">
                                            <div class="h-4 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-800">
                                            </div>
                                            <div
                                                class="mt-3 h-2 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-800">
                                            </div>
                                        </div>
                                        <div v-else-if="latestAttempt" class="mt-3">
                                            <div
                                                class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                                                <div class="min-w-0">
                                                    <h3
                                                        class="break-words text-base font-bold text-slate-950 dark:text-slate-100">
                                                        {{ latestAttempt.sub_topic_name }}
                                                    </h3>
                                                    <p
                                                        class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                                        <span>{{ latestAttemptDate }}</span>
                                                        <span aria-hidden="true">&middot;</span>
                                                        <span>{{ latestAttemptTime }}</span>
                                                        <span aria-hidden="true">&middot;</span>
                                                        <span>{{ latestAttemptStatusLabel }}</span>
                                                    </p>
                                                </div>
                                                <p class="text-sm font-semibold"
                                                    :class="scoreToneClass(latestAttemptScore)">
                                                    {{ scoreSummary(latestAttemptScore) }}
                                                </p>
                                            </div>
                                            <div class="mt-4">
                                                <div class="flex items-center justify-between text-xs font-semibold">
                                                    <span class="text-slate-500 dark:text-slate-400">Score
                                                        progress</span>
                                                    <span :class="scoreToneClass(latestAttemptScore)">
                                                        {{ latestAttemptScore }}%
                                                    </span>
                                                </div>
                                                <div
                                                    class="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                                    <div class="h-full rounded-full transition-all duration-500"
                                                        :class="scoreFillClass(latestAttemptScore)"
                                                        :style="latestAttemptLinearStyle"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else class="mt-3">
                                            <h3 class="text-base font-bold text-slate-950 dark:text-slate-100">
                                                {{ latestAttemptError || "No recent attempt yet" }}
                                            </h3>
                                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                Open a product and complete an attempt to light up this report.
                                            </p>
                                        </div>
                                    </div>
                                    <div v-if="latestAttempt && !latestAttemptLoading"
                                        class="flex w-full shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between md:w-auto md:flex-col md:items-center md:justify-center">
                                        <div class="radial-progress bg-gray-200/80 text-sm font-bold shadow-custom ring-1 ring-transparent dark:bg-slate-800 dark:ring-slate-700"
                                            :class="scoreToneClass(latestAttemptScore)" :style="latestAttemptRingStyle"
                                            role="progressbar" :aria-valuenow="latestAttemptScore">
                                            {{ latestAttemptScore }}%
                                        </div>
                                        <button v-if="latestAttemptReportRoute" type="button"
                                            class="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-sky-500/95 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:w-auto dark:bg-sky-500/95 dark:hover:bg-sky-500"
                                            @click="router.push(latestAttemptReportRoute)">
                                            <span>View Report</span>
                                            <i class="pi pi-arrow-right text-[10px]"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <EmailVerification v-if="!user?.email_verified" class="mt-5 lg:hidden" />
                    </div>
                    <aside
                        class="relative hidden overflow-hidden rounded-3xl border border-sky-100 bg-light-blue-500 p-5  lg:block dark:!border-slate-800 dark:!bg-slate-900">
                        <div
                            class="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-700">
                        </div>
                        <EmailVerification v-if="!user?.email_verified" class="max-w-none" />
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
                                <p class="mt-2 text-xs leading-tight text-white">
                                    Last activity: {{ lastActivityText }}
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <CommonButton :buttonText="primaryActionLabel" icon2="pi pi-arrow-right"
                                :action="() => router.push(primaryActionRoute)"
                                classes="w-full bg-sky-500/95 py-2.5 text-white shadow-none hover:bg-sky-700" />
                            <CommonButton buttonText="View Subscription Plans" icon="pi pi-credit-card me-1"
                                :action="() => router.push('/subscription')"
                                classes="w-full border border-slate-200 bg-white py-2.5 text-slate-700 shadow-none hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" />
                            <router-link v-if="isAdmin" to="/admin"
                                class="flex w-full items-center justify-center rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
                                <i class="pi pi-cog mr-2 text-xs"></i>
                                Open Admin Panel
                            </router-link>
                        </div>
                    </aside>
                </div>
            </section>
            <section v-else class="overflow-hidden px-0 pt-2 pb-4 sm:p-5 md:p-6">
                <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
                    <div>
                        <div
                            class="relative overflow-hidden rounded-[28px] p-4 sm:p-5 dark:border-slate-800 dark:from-slate-950 dark:via-sky-950 dark:to-cyan-950">
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-cyan-200/35 to-transparent dark:from-cyan-500/10">
                            </div>

                            <div class="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div class="min-w-0 flex-1">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <span
                                            class="inline-flex max-w-full items-center gap-1.5 rounded-full border border-sky-200 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-sky-700 shadow-sm dark:border-sky-700 dark:bg-slate-900/80 dark:text-sky-200">
                                            <i class="pi pi-sparkles text-[10px]"></i>
                                            <span>Start free</span>
                                        </span>
                                        <span
                                            class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                                            <i class="pi pi-shield text-[10px]"></i>
                                            No auto-billing
                                        </span>
                                    </div>

                                    <h1
                                        class="mt-3 max-w-3xl break-words text-2xl font-black leading-tight text-slate-950 sm:text-3xl xl:text-4xl dark:text-slate-100">
                                        Practice smarter for
                                        <span
                                            class="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent dark:from-sky-300 dark:via-cyan-200 dark:to-emerald-200">
                                            TEAS, nursing school, and NCLEX
                                        </span>
                                    </h1>

                                    <p
                                        class="mt-3 max-w-2xl text-sm font-medium  text-slate-500 md:text-base dark:text-slate-300">
                                        Build readiness with realistic questions, focused remediation, timed practice,
                                        and progress insights across every major nursing exam track.
                                    </p>
                                </div>

                                <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:w-56 lg:grid-cols-1">
                                    <button type="button"
                                        class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-sky-500/95 px-4 py-2.5 text-sm font-bold text-white shadow-custom transition hover:-translate-y-0.5 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                        @click="router.push('/register')">
                                        <i class="pi pi-user-plus text-xs"></i>
                                        <span class="text-center leading-tight">Create Free Account</span>
                                    </button>
                                    <button type="button"
                                        class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-custom transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:border-sky-700 dark:hover:bg-slate-800"
                                        @click="router.push('/login')">
                                        <i class="pi pi-sign-in text-xs"></i>
                                        <span>Sign In</span>
                                    </button>
                                    <button type="button"
                                        class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-100 dark:hover:border-sky-700 dark:hover:text-sky-200"
                                        @click="router.push('/subscription')">
                                        <i class="pi pi-credit-card text-xs"></i>
                                        <span>Plans</span>
                                    </button>
                                </div>
                            </div>
                            <div class="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div v-for="stat in guestHeroStats" :key="stat.label" class="rounded-2xl  p-3 "
                                    :class="stat.class">
                                    <div class="flex items-center justify-between gap-3">
                                        <p class="text-[11px] font-bold uppercase">{{ stat.label }}</p>
                                        <i :class="[stat.icon, 'text-sm']"></i>
                                    </div>
                                    <p class="mt-2 text-xl font-black leading-none">{{ stat.value }}</p>
                                    <p class="mt-1 text-xs font-semibold opacity-80">{{ stat.detail }}</p>
                                </div>
                            </div>

                            <div
                                class="relative mt-8 rounded-2xl border border-white/80 bg-white/85   ring-1 ring-white/60  dark:border-slate-800 dark:bg-slate-950/60 dark:ring-slate-800">
                                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p class="text-md font-bold  text-sky-600 dark:text-sky-300">
                                            Choose your starting point
                                        </p>
                                        <p class="mt-1 text-sm font-semibold text-slate6700 dark:text-slate-200">
                                            Preview a track, then keep your progress when you create an account.
                                        </p>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        <router-link v-for="product in products" :key="`guest-chip-${product.code}`"
                                            :to="product.dashboardRoute"
                                            class="inline-flex min-h-8 items-center rounded-full bg-sky-500 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-700">
                                            {{ product.name }}
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <aside
                        class="relative hidden overflow-hidden rounded-3xl border border-sky-100 bg-light-blue-500 p-5  lg:block dark:!border-slate-800 dark:!bg-slate-900">
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
                                    class="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-bright-sun-500 ring-1 ring-white/20">
                                    Select your path
                                </span>
                                <p class="mt-2 text-lg font-extrabold leading-tight text-white">
                                    What are you studying today?
                                </p>
                            </div>
                        </div>
                        <div class="relative mt-4 divide-y divide-sky-100/80 dark:divide-slate-800">
                            <div v-for="product in products" :key="`guest-${product.code}`"
                                class="group/study flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                                <div class="min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-sky-700 shadow-sm ring-1 ring-sky-100 dark:bg-slate-950 dark:text-sky-300 dark:ring-slate-800">
                                            <i class="pi pi-book text-xs"></i>
                                        </span>
                                        <p class="font-semibold text-sky-900 dark:text-slate-100">
                                            {{ product.name }}
                                        </p>
                                    </div>
                                    <p class="mt-1.5 pl-9 text-sm leading-5 text-slate-500 dark:text-slate-400">
                                        {{ product.subtitle }}
                                    </p>
                                </div>
                                <button type="button"
                                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-white text-sky-700 transition group-hover/study:-translate-y-0.5 group-hover/study:border-sky-200 group-hover/study:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:text-sky-300 dark:group-hover/study:border-sky-700 dark:group-hover/study:bg-slate-800"
                                    :aria-label="`Open ${product.name}`" @click="router.push(product.dashboardRoute)">
                                    <i class="pi pi-arrow-right text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
            <section class="space-y-4">
                <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2
                            class="mt-1 text-xl font-semibold tracking-tight text-slate-950 md:text-2xl dark:text-slate-100">
                            Select Product {{ primaryProduct ? `(Auto Selected :- ${primaryProduct.name} )` : "" }}
                        </h2>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        Choose a track and continue from where you left off.
                    </p>
                </div>
                <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <article v-for="product in products" :key="product.code"
                        class="group relative flex min-h-full flex-col overflow-hidden rounded-lg border p-5 shadow-custom transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-26px_rgba(15,23,42,0.45)] md:p-6"
                        :class="product.cardClass">
                        <div class="absolute right-0 top-0 rounded-bl-lg border-b border-l px-3 py-1 text-xs font-medium italic"
                            :class="product.ribbonClass">
                            {{ product.abb }}
                        </div>

                        <div class="flex items-center justify-between gap-3 pr-12">
                            <span
                                class="inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                                :class="product.bundleClass">
                                <span class="inline-flex shrink-0 items-center gap-1">
                                    <span
                                        class="inline-flex h-5 w-5 items-center justify-center rounded bg-white/75 text-[10px] text-blue-600 shadow-custom dark:bg-white/15 dark:text-blue-100">
                                        <i class="pi pi-book"></i>
                                    </span>
                                    <span class="text-[10px] font-bold text-slate-400 dark:text-slate-300">+</span>
                                    <span
                                        class="inline-flex h-5 w-5 items-center justify-center rounded bg-white/75 text-[10px] text-sky-600 shadow-custom dark:bg-white/15 dark:text-sky-100">
                                        <i class="pi pi-play"></i>
                                    </span>
                                </span>
                                <span class="truncate">{{ product.bundleLabel }}</span>
                            </span>
                        </div>

                        <div class="mt-5">
                            <div class="flex flex-wrap items-center gap-2">
                                <h3 class="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                                    {{ product.name }}
                                </h3>
                                <span class="rounded-full border px-2 py-0.5 text-[11px] font-semibold"
                                    :class="statusClass(product.code)">
                                    {{ statusLabel(product.code) }}
                                </span>
                            </div>
                            <p class="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                                {{ product.subtitle }}
                            </p>

                            <div class="mt-4 flex flex-wrap items-center rounded-lg border px-2.5 py-2.5"
                                :class="product.moduleShellClass">
                                <button v-for="(module, index) in product.modules" :key="module.label" type="button"
                                    class="inline-flex min-h-9 min-w-0 flex-1 items-center justify-center gap-2 px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:text-sky-700 dark:text-slate-200 dark:hover:text-sky-200"
                                    :class="index < product.modules.length - 1 ? 'border-r border-sky-200/80 dark:border-slate-700' : ''"
                                    @click="router.push(product.dashboardRoute)">
                                    <span
                                        class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs"
                                        :class="module.iconClass">
                                        <i :class="module.icon"></i>
                                    </span>
                                    <span class="truncate">{{ module.label }}</span>
                                </button>
                            </div>

                            <div
                                class="mt-4 flex items-start gap-3 rounded-lg bg-light-blue-500 p-4 shadow-custom ring-1 ring-white/70 dark:!bg-slate-950/60 dark:ring-slate-800">
                                <span
                                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-base dark:border-slate-700 dark:bg-slate-900">
                                    <i :class="accessIconClass(product.code)"></i>
                                </span>
                                <div class="min-w-0">
                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        {{ accessHeading(product.code) }}
                                    </p>
                                    <p class="mt-0.5 text-sm font-bold text-slate-950 dark:text-slate-100">
                                        {{ accessValue(product.code) }}
                                    </p>
                                    <p class="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        {{ accessDetail(product.code) }}
                                    </p>
                                </div>
                            </div>

                            <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                                <button type="button"
                                    class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-sky-500/95 px-5 py-2.5 text-sm font-semibold text-white shadow-custom transition hover:-translate-y-0.5 hover:bg-sky-500/95/95 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:bg-sky-500/95 dark:hover:bg-sky-500"
                                    @click="router.push(productPrimaryRoute(product))">
                                    <span>{{ productPrimaryLabel(product.code) }}</span>
                                    <i class="pi pi-arrow-right text-xs"></i>
                                </button>
                                <button type="button"
                                    class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/80 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-custom transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-700 dark:hover:bg-slate-800 dark:hover:text-sky-200"
                                    @click="router.push(product.pricingRoute)">
                                    <i class="pi pi-credit-card text-xs"></i>
                                    <span>Pricing</span>
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <section class=" md:p-6 ">
                <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                            Account Snapshot
                        </p>

                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        Quick access, trial, and streak visibility.
                    </p>
                </div>

                <dl class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div v-for="stat in summaryStats" :key="stat.label"
                        class="rounded-lg border p-3 bg-light-blue-500 dark:border-slate-800 dark:bg-slate-950/50">
                        <dt
                            class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            <span v-if="stat.blob"
                                class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-[13px] ring-1 ring-orange-200 dark:bg-orange-900/30 dark:ring-orange-800/60">
                                {{ stat.blob }}
                            </span>
                            <span v-else
                                class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                                <i :class="[stat.icon, stat.tone]"></i>
                            </span>
                            {{ stat.label }}
                        </dt>
                        <dd class="mt-3 text-2xl font-bold text-slate-950 dark:text-slate-100">
                            {{ stat.value }}
                        </dd>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {{ stat.detail }}
                        </p>
                    </div>
                </dl>
            </section>

            <section class="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <div class="rounded-[1.75rem]  md:p-6 xl:col-span-2 dark:border-slate-800 dark:bg-slate-900">
                    <h3 class="text-lg font-semibold text-slate-950 dark:text-slate-100">Why NurseDive</h3>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Designed for consistent practice, measurable progress, and readiness decisions.
                    </p>
                    <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div
                            class="rounded-r-lg border-l-2 border-sky-500 bg-gradient-to-r from-sky-500/10 via-sky-50 to-transparent p-3 pl-4 dark:from-sky-500/20 dark:via-slate-900/80 dark:to-transparent">
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Realistic Question
                                Quality</p>
                            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Questions aligned with real exam style and difficulty.
                            </p>
                        </div>
                        <div
                            class="rounded-r-lg border-l-2 border-emerald-500 bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-transparent p-3 pl-4 dark:from-emerald-500/20 dark:via-slate-900/80 dark:to-transparent">
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Weak-Area Focus</p>
                            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Target gaps and improve with feedback loops.
                            </p>
                        </div>
                        <div
                            class="rounded-r-lg border-l-2 border-amber-500 bg-gradient-to-r from-amber-500/10 via-amber-50 to-transparent p-3 pl-4 dark:from-amber-500/20 dark:via-slate-900/80 dark:to-transparent">
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Comprehensive Analytics
                            </p>
                            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Track momentum, confidence, and readiness over time.
                            </p>
                        </div>
                        <div
                            class="rounded-r-lg border-l-2 border-rose-500 bg-gradient-to-r from-rose-500/10 via-rose-50 to-transparent p-3 pl-4 dark:from-rose-500/20 dark:via-slate-900/80 dark:to-transparent">
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">High Pass-Rate Strategy
                            </p>
                            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Structured routines and guided practice built for exam success.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col justify-between gap-4  md:p-6">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-950 dark:text-slate-100">Need Help?</h3>
                        <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            We value your feedback and are here to support your preparation journey.
                        </p>
                    </div>
                    <div class="space-y-2.5">
                        <CommonButton buttonText="Contact Support" icon="pi pi-envelope me-1" :action="goToSupport"
                            classes="w-full bg-sky-500/95 py-2.5 text-white shadow-none hover:bg-sky-700" />
                        <p class="text-xs text-slate-500 dark:text-slate-400">
                            You can also use the live chat at the bottom-right corner.
                        </p>
                    </div>
                </div>
            </section>
            <section class="md:p-6 dark:border-slate-800 dark:bg-slate-900">
                <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <h3 class="text-lg font-semibold text-slate-950 dark:text-slate-100">Share and Connect</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        Join our social channels for updates, tips, and success stories.
                    </p>
                </div>
                <Socials />
            </section>
        </div>
    </div>
</template>

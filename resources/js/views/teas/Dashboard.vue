<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import axios from "axios";
import { useAuthStore } from "../../stores/authStore";
import { useTeasExamStore } from "../../stores/teasExamStore";
import Probability from "../../components/Probability.vue";
import ExamIcon from "../../components/ExamIcon.vue";
import PracticeProgressPeersChart from "../../components/Dashboard/PracticeProgressPeersChart.vue";
import StudySchedulePanel from "../../components/Dashboard/StudySchedulePanel.vue";
import StreakCard from "../../components/Dashboard/StreakCard.vue";
import TodayFocusPanel from "../../components/Dashboard/TodayFocusPanel.vue";
import DashboardSnapshot from "../../components/Dashboard/DashboardSnapshot.vue";
import type { SnapshotSection } from "../../components/Dashboard/DashboardSnapshot.vue";
import type { FocusAttempt, FocusReviewTask, FocusSection } from "../../components/Dashboard/TodayFocusPanel.vue";

interface TeasModule {
    id: number;
    title: string;
    shortTitle: string;
    description: string;
    ctaLabel: string;
    icon: string;
    total: number;
    color: string;
    barClass: string;
    tileClass: string;
    washClass: string;
    patternClass: string;
    inkClass: string;
    borderClass: string;
}

interface TeasAttempt {
    id?: number | string | null;
    attempt_id?: number | string | null;
    sub_topic_id?: number | string | null;
    sub_topic_name?: string | null;
    category_id?: number | string | null;
    score?: number | string | null;
    mode?: string | null;
    completed?: boolean | number | string | null;
    completed_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    suspend_index?: number | string | null;
}

const TEAS_REVIEW_SCORE = 70;
const REFERRAL_REWARD_DAYS = 15;
const PASS_MARK = 75;

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const teasStore = useTeasExamStore();
const { teas_exam_date, dashdata } = storeToRefs(teasStore);
const teasAttempts = ref<TeasAttempt[]>([]);

const teasModules: TeasModule[] = [
    {
        id: 2,
        title: "TEAS Math",
        shortTitle: "Math",
        description: "Arithmetic, algebra, and data interpretation drills.",
        ctaLabel: "Practice Math",
        icon: "pi pi-calculator",
        total: 67,
        color: "text-sky-600 dark:text-sky-300",
        barClass: "bg-gradient-to-r from-sky-500 to-cyan-400",
        tileClass: "bg-linear-to-br from-sky-500 to-cyan-400 text-white shadow-sky-500/30",
        washClass: "from-sky-400/45 to-cyan-300/25 dark:from-sky-500/30 dark:to-cyan-400/15",
        patternClass: "pattern-grid",
        inkClass: "text-sky-600 dark:text-sky-300",
        borderClass: "border-sky-100 hover:border-sky-300 dark:border-sky-800 dark:hover:border-sky-600",
    },
    {
        id: 8,
        title: "TEAS Language",
        shortTitle: "Language",
        description: "Grammar, punctuation, and language usage mastery.",
        ctaLabel: "Practice Language",
        icon: "pi pi-language",
        total: 77,
        color: "text-indigo-600 dark:text-indigo-300",
        barClass: "bg-gradient-to-r from-indigo-500 to-sky-400",
        tileClass: "bg-linear-to-br from-indigo-500 to-sky-400 text-white shadow-indigo-500/30",
        washClass: "from-indigo-400/45 to-sky-300/25 dark:from-indigo-500/30 dark:to-sky-400/15",
        patternClass: "pattern-lines",
        inkClass: "text-indigo-600 dark:text-indigo-300",
        borderClass: "border-indigo-100 hover:border-indigo-300 dark:border-indigo-900 dark:hover:border-indigo-600",
    },
    {
        id: 4,
        title: "TEAS Science",
        shortTitle: "Science",
        description: "Biology, chemistry, and scientific reasoning prep.",
        ctaLabel: "Practice Science",
        icon: "pi pi-sliders-h",
        total: 80,
        color: "text-emerald-600 dark:text-emerald-300",
        barClass: "bg-gradient-to-r from-emerald-500 to-teal-400",
        tileClass: "bg-linear-to-br from-emerald-500 to-teal-400 text-white shadow-emerald-500/30",
        washClass: "from-emerald-400/45 to-teal-300/25 dark:from-emerald-500/30 dark:to-teal-400/15",
        patternClass: "pattern-dots",
        inkClass: "text-emerald-600 dark:text-emerald-300",
        borderClass: "border-emerald-100 hover:border-emerald-300 dark:border-emerald-900 dark:hover:border-emerald-600",
    },
    {
        id: 6,
        title: "TEAS Reading",
        shortTitle: "Reading",
        description: "Comprehension, inference, and text analysis training.",
        ctaLabel: "Practice Reading",
        icon: "pi pi-book",
        total: 49,
        color: "text-orange-600 dark:text-orange-300",
        barClass: "bg-gradient-to-r from-orange-500 to-amber-400",
        tileClass: "bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-orange-500/30",
        washClass: "from-orange-400/45 to-amber-300/25 dark:from-orange-500/30 dark:to-amber-400/15",
        patternClass: "pattern-diagonal",
        inkClass: "text-orange-600 dark:text-orange-300",
        borderClass: "border-orange-100 hover:border-orange-300 dark:border-orange-900 dark:hover:border-orange-600",
    },
];

const quickActions = [
    { label: "Math", route: "/teas/test-bank-loader/2", icon: "pi pi-calculator" },
    { label: "Science", route: "/teas/test-bank-loader/4", icon: "pi pi-sliders-h" },
    { label: "Language", route: "/teas/test-bank-loader/8", icon: "pi pi-language" },
    { label: "Reading", route: "/teas/test-bank-loader/6", icon: "pi pi-book" },
    { label: "Performance", route: "/teas/performance-analysis", icon: "pi pi-chart-line" },
];

const toNumber = (value: unknown) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const firstName = computed(() => {
    const name = user.value?.name?.trim();
    return name ? name.split(/\s+/)[0] : "";
});
const welcomeHeading = computed(() => (firstName.value ? `Welcome back, ${firstName.value}` : "Welcome back"));

const averageScore = computed(() => {
    const rawScore = dashdata.value?.average_score;
    if (rawScore === null || rawScore === undefined || rawScore === "") {
        return "...";
    }

    const score = Number(rawScore);
    if (!Number.isFinite(score)) return "...";

    return `${Math.max(0, Math.min(100, Math.round(score)))}%`;
});

const averageScoreNumber = computed(() => {
    const score = Number(dashdata.value?.average_score);
    if (!Number.isFinite(score)) return null;
    if (score === 0 && teasAttempts.value.length === 0) return null;
    return Math.max(0, Math.min(100, Math.round(score)));
});

const RING_RADIUS = 26;
const ringCircumference = 2 * Math.PI * RING_RADIUS;
const ringOffset = computed(() => ringCircumference * (1 - (averageScoreNumber.value ?? 0) / 100));

const daysToExam = computed<number | null>(() => {
    const raw = teas_exam_date.value as unknown;
    if (!raw) return null;
    const exam = raw instanceof Date ? new Date(raw) : new Date(/^\d{4}-\d{2}-\d{2}$/.test(String(raw)) ? `${raw}T00:00:00` : String(raw));
    if (Number.isNaN(exam.getTime())) return null;
    exam.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((exam.getTime() - today.getTime()) / 86400000);
});

const examCountdown = computed(() => {
    const days = daysToExam.value;
    if (days === null) return { value: "—", label: "Set your exam date", tone: "muted" };
    if (days > 1) return { value: String(days), label: "days to exam", tone: days <= 14 ? "hot" : "ok" };
    if (days === 1) return { value: "1", label: "day to exam", tone: "hot" };
    if (days === 0) return { value: "Today", label: "is exam day", tone: "hot" };
    return { value: String(Math.abs(days)), label: "days since exam", tone: "muted" };
});

const attemptedByCategory = (categoryId: number) => {
    const attempted = new Set<number>();

    teasAttempts.value.forEach((attempt) => {
        const attemptCategoryId = toNumber(attempt.category_id);
        const examId = toNumber(attempt.sub_topic_id);

        if (attemptCategoryId === categoryId && examId > 0) {
            attempted.add(examId);
        }
    });

    return attempted.size;
};

const teasModulesWithProgress = computed(() =>
    teasModules.map((module) => {
        const attempted = Math.min(module.total, attemptedByCategory(module.id));
        const percent = module.total > 0 ? Math.round((attempted / module.total) * 100) : 0;

        return {
            ...module,
            route: `/teas/test-bank-loader/${module.id}`,
            attempted,
            percent,
        };
    }),
);

const teasAttemptedTotal = computed(() =>
    new Set(teasAttempts.value.map((attempt) => toNumber(attempt.sub_topic_id)).filter((id) => id > 0)).size,
);

const attemptTimestamp = (attempt: TeasAttempt) => {
    const raw = attempt.completed_at || attempt.updated_at || attempt.created_at;
    if (!raw) return 0;

    const timestamp = new Date(raw).getTime();
    return Number.isFinite(timestamp) ? timestamp : 0;
};

const isCompletedAttempt = (attempt: TeasAttempt) =>
    attempt.completed === true || attempt.completed === 1 || attempt.completed === "1";

const sortedAttempts = computed(() =>
    [...teasAttempts.value].sort((a, b) => attemptTimestamp(b) - attemptTimestamp(a)),
);

const latestAttempt = computed(() => sortedAttempts.value[0] || null);

const latestCompletedAttempt = computed(() =>
    sortedAttempts.value.find((attempt) => isCompletedAttempt(attempt)) || null,
);

const pausedAttempt = computed(() =>
    sortedAttempts.value.find((attempt) => !isCompletedAttempt(attempt) && toNumber(attempt.id || attempt.attempt_id) > 0) || null,
);

const latestAttemptScore = computed(() => {
    const score = toNumber(latestAttempt.value?.score);
    return Math.max(0, Math.min(100, Math.round(score)));
});

const latestAttemptStatus = computed(() => {
    if (!latestAttempt.value) return "Ready";
    return isCompletedAttempt(latestAttempt.value) ? "Completed" : "Paused";
});

const latestAttemptBadgeClass = computed(() => {
    if (!latestAttempt.value) return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200";
    if (isCompletedAttempt(latestAttempt.value)) {
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200";
    }

    return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200";
});

const latestAttemptDateText = computed(() => {
    const timestamp = latestAttempt.value ? attemptTimestamp(latestAttempt.value) : 0;
    if (!timestamp) return "No date recorded";

    return new Date(timestamp).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
});

const nextPracticeMove = computed(() => {
    if (pausedAttempt.value) {
        const attemptId = pausedAttempt.value.attempt_id || pausedAttempt.value.id;

        return {
            title: `Resume ${pausedAttempt.value.sub_topic_name || "your paused TEAS set"}`,
            detail: "Pick up where you stopped and keep the attempt history clean.",
            primaryLabel: "Resume Set",
            primaryRoute: `/teas/exam/${attemptId}?resume=true`,
            icon: "pi pi-play",
        };
    }

    if (latestCompletedAttempt.value) {
        const score = Math.round(toNumber(latestCompletedAttempt.value.score));
        const attemptId = latestCompletedAttempt.value.attempt_id || latestCompletedAttempt.value.id;
        const needsReview = score < TEAS_REVIEW_SCORE;

        return {
            title: needsReview ? "Review your TEAS misses" : "Keep your TEAS rhythm",
            detail: needsReview
                ? `Your last completed score was ${score}%. Review the rationale, then retake a focused set.`
                : `Your last completed score was ${score}%. Stack another timed set while the rhythm is warm.`,
            primaryLabel: needsReview ? "Review Attempt" : "Take Another Set",
            primaryRoute: needsReview && attemptId
                ? `/teas/exam/${attemptId}?mode=review`
                : "/teas/test-bank-loader/2",
            icon: needsReview ? "pi pi-eye" : "pi pi-arrow-right",
        };
    }

    return {
        title: "Start your first tracked TEAS attempt",
        detail: "Begin with Math, Science, Language, or Reading to unlock score trends and smarter recommendations.",
        primaryLabel: "Start Math",
        primaryRoute: "/teas/test-bank-loader/2",
        icon: "pi pi-play",
    };
});

const scoreToneClass = (score: number) => {
    if (score >= TEAS_REVIEW_SCORE) return "text-emerald-600 dark:text-emerald-300";
    if (score >= 50) return "text-amber-600 dark:text-amber-300";
    return "text-rose-600 dark:text-rose-300";
};

const scoreBarClass = (score: number) => {
    if (score >= TEAS_REVIEW_SCORE) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
};

/* ---------- Today's Focus (shared panel) ---------- */
const focusSections = computed<FocusSection[]>(() =>
    teasModulesWithProgress.value.map((module) => ({
        id: module.id,
        title: module.title,
        shortTitle: module.shortTitle,
        icon: module.icon,
        route: module.route,
        tileClass: module.tileClass,
        inkClass: module.inkClass,
        percent: module.percent,
    })),
);

const focusAttempts = computed<FocusAttempt[]>(() =>
    teasAttempts.value.map((attempt) => ({
        sectionId: toNumber(attempt.category_id) || null,
        score: attempt.score === null || attempt.score === undefined || attempt.score === "" ? null : toNumber(attempt.score),
        completed: isCompletedAttempt(attempt),
        timestamp: attemptTimestamp(attempt),
    })),
);

const snapshotSections = computed<SnapshotSection[]>(() =>
    teasModulesWithProgress.value.map((module) => ({
        id: module.id,
        label: module.shortTitle,
        attempted: module.attempted,
        total: module.total,
        barClass: module.barClass,
    })),
);

const sectionLabels = Object.fromEntries(teasModules.map((module) => [String(module.id), module.shortTitle]));

const focusReviewTask = computed<FocusReviewTask | null>(() => {
    const last = latestCompletedAttempt.value;
    if (!last) return null;
    const score = Math.round(toNumber(last.score));
    const attemptId = last.attempt_id || last.id;
    if (score >= PASS_MARK || !attemptId) return null;
    return {
        label: `Review your misses in ${last.sub_topic_name || "your last set"}`,
        helper: `Scored ${score}%. Read the rationales while they are fresh.`,
        route: `/teas/exam/${attemptId}?mode=review`,
    };
});

onMounted(async () => {
    teasStore.getEssentials();

    try {
        const attemptsResponse = await axios.get("/teas/previous-attempts", { showLoader: false });
        teasAttempts.value = Array.isArray(attemptsResponse.data?.data) ? attemptsResponse.data.data : [];
    } catch {
        teasAttempts.value = [];
    }
});

const handleExamDateUpdated = (date: string) => {
    teas_exam_date.value = date;
};
</script>

<template>
    <div class="dash-shell">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <!-- ================= HERO + EXAM CARD ================= -->
            <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
            <section class="ui-rise dash-card p-5 md:p-7 xl:col-span-8">
                <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                    <div class="ui-drift absolute -top-28 -right-20 h-80 w-80 rounded-full blur-3xl theme-glow opacity-70"></div>
                    <div class="ui-drift-slow absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10"></div>
                    <div
                        class="absolute inset-0 opacity-[0.28] [background-image:radial-gradient(circle_at_1px_1px,var(--theme-border)_1px,transparent_0)] [background-size:24px_24px]">
                    </div>
                </div>

                <div class="relative space-y-5">
                    <div class="min-w-0">
                        <p class="dash-eyebrow theme-text inline-flex items-center gap-2">
                            <span class="relative flex h-2 w-2">
                                <span class="theme-dot absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"></span>
                                <span class="theme-dot relative inline-flex h-2 w-2 rounded-full"></span>
                            </span>
                            ATI TEAS Dashboard
                        </p>
                        <h1 class="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
                            {{ welcomeHeading }}
                        </h1>
                        <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
                            Build confidence with focused TEAS drills, check readiness, and keep your study plan moving.
                        </p>

                        <div class="mt-5 flex flex-wrap gap-2">
                            <RouterLink v-for="action in quickActions" :key="action.route" :to="action.route"
                                class="dash-chip theme-soft theme-focus">
                                <i :class="action.icon"></i>
                                {{ action.label }}
                            </RouterLink>
                            <RouterLink to="/teas/guide-topics"
                                class="dash-chip border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-200">
                                <i class="pi pi-map"></i>
                                Study Guides
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Instrument panel: readiness + countdown on the theme surface -->
                    <div class="theme-surface theme-shadow relative overflow-hidden rounded-2xl p-4">
                        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                            <div class="absolute -top-16 -right-12 h-40 w-40 rounded-full bg-white/20 blur-2xl"></div>
                            <div
                                class="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:18px_18px]">
                            </div>
                        </div>

                        <div class="relative grid grid-cols-[auto_1fr] gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                            <div class="relative h-20 w-20 shrink-0">
                                <svg class="h-20 w-20 -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
                                    <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-opacity="0.22" stroke-width="6" />
                                    <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"
                                        :stroke-dasharray="ringCircumference" :stroke-dashoffset="ringOffset"
                                        class="transition-[stroke-dashoffset] duration-1000 ease-out" />
                                    <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="8"
                                        :stroke-dasharray="`1.5 ${ringCircumference - 1.5}`"
                                        :stroke-dashoffset="ringCircumference * (1 - PASS_MARK / 100)" stroke-opacity="0.9" />
                                </svg>
                                <span class="absolute inset-0 flex flex-col items-center justify-center leading-none">
                                    <span class="text-lg font-black tabular-nums">{{ averageScore }}</span>
                                    <span class="mt-0.5 text-[9px] font-bold uppercase tracking-wide opacity-80">avg</span>
                                </span>
                            </div>

                            <div class="min-w-0">
                                <p class="text-[10px] font-bold uppercase tracking-[0.16em] opacity-80">Readiness</p>
                                <p class="mt-1 text-sm font-extrabold leading-snug">
                                    {{ averageScoreNumber === null ? "No scored attempts yet" : averageScoreNumber >= PASS_MARK ? "Above the pass mark" : `${PASS_MARK - averageScoreNumber} pts to pass mark` }}
                                </p>
                                <p class="mt-1 text-xs opacity-80">Pass mark {{ PASS_MARK }}% · {{ teasAttemptedTotal }} exams attempted</p>
                            </div>

                            <a href="#schedule"
                                class="group col-span-2 flex items-center justify-between gap-3 rounded-xl border border-current/25 bg-white/15 px-3 py-2.5 backdrop-blur-sm transition duration-200 hover:bg-white/25 sm:col-span-1 sm:min-w-28 sm:flex-col sm:items-start sm:justify-center">
                                <div>
                                    <p class="text-2xl font-black leading-none tabular-nums"
                                        :class="examCountdown.tone === 'hot' ? 'animate-pulse' : ''">
                                        {{ examCountdown.value }}
                                    </p>
                                    <p class="mt-1 text-[10px] font-bold uppercase tracking-wide opacity-80">{{ examCountdown.label }}</p>
                                </div>
                                <i class="pi pi-calendar text-sm opacity-80 transition-transform group-hover:scale-110 sm:hidden"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <aside class="ui-rise xl:col-span-4" style="animation-delay: 80ms">
                <div
                    class="relative flex min-h-28 items-center gap-4 rounded-2xl border-b bg-sky-800 p-4 shadow-custom">
                    <div
                        class="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/95 text-sky-700 shadow-custom ring-1 ring-sky-100 dark:bg-slate-950 dark:text-sky-200 dark:ring-slate-800">
                        <ExamIcon :size="86" />
                    </div>
                    <div class="min-w-0">
                        <span
                            class="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-bright-sun-500 ring-1 ring-white/20">
                            {{ teasAttemptedTotal }} attempted
                        </span>
                        <p class="mt-2 text-lg font-extrabold leading-tight text-white">
                            {{ teasAttemptedTotal }} exams attempted so far
                        </p>
                        <RouterLink to="/teas/performance-analysis"
                            class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
                            View Details
                        </RouterLink>
                    </div>
                </div>

                <div class="ui-rise mt-5" style="animation-delay: 140ms">
                    <DashboardSnapshot :attempts="focusAttempts" :sections="snapshotSections" :pass-mark="PASS_MARK"
                        :total-override="dashdata?.teas_attempts ?? null" section-noun="section" />
                </div>

                <div class="ui-rise mt-5" style="animation-delay: 220ms">
                    <StreakCard product-code="teas" />
                </div>
            </aside>
            </section>

            <!-- ================= PRACTICE AREAS + PROBABILITY ================= -->
            <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 160ms">
                    <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 class="dash-title">TEAS Practice Areas</h2>
                            <p class="text-xs text-slate-500 dark:text-slate-300">
                                See attempted exams across each TEAS section.
                            </p>
                        </div>
                        <span class="analysis-pill theme-soft border">
                            {{ teasAttemptedTotal }} attempted
                        </span>
                    </div>

                    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <RouterLink v-for="(module, index) in teasModulesWithProgress" :key="module.id" :to="module.route"
                            class="group dash-card-white dash-hover-lift ui-rise flex h-full flex-col"
                            :class="module.borderClass" :style="{ animationDelay: `${220 + index * 60}ms` }">
                            <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                                <div class="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-linear-to-br opacity-70 blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-100"
                                    :class="module.washClass"></div>
                                <div class="ui-pan absolute inset-0 opacity-[0.09] transition-opacity duration-500 group-hover:opacity-[0.16]"
                                    :class="[module.patternClass, module.inkClass]"></div>
                                <i class="absolute -bottom-5 -right-3 text-[104px] opacity-[0.07] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                                    :class="[module.icon, module.inkClass]"></i>
                            </div>

                            <div class="relative flex items-start justify-between gap-3">
                                <div class="flex min-w-0 items-start gap-3">
                                    <span class="dash-icon-tile h-11 w-11 shadow-lg group-hover:scale-110 group-hover:-rotate-3"
                                        :class="module.tileClass">
                                        <i :class="module.icon"></i>
                                    </span>
                                    <div class="min-w-0">
                                        <h3 class="font-bold leading-tight text-slate-950 dark:text-white">
                                            {{ module.title }}
                                        </h3>
                                        <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                            {{ module.description }}
                                        </p>
                                    </div>
                                </div>
                                <span class="analysis-pill shrink-0 border border-current/20 bg-white/70 text-[11px] font-bold backdrop-blur-sm dark:bg-slate-950/40"
                                    :class="module.inkClass">
                                    {{ module.total }} sets
                                </span>
                            </div>

                            <div class="relative mt-auto pt-5">
                                <div class="mb-2 flex items-center justify-between text-xs">
                                    <span class="font-semibold text-slate-500 dark:text-slate-300">Exam attempted</span>
                                    <span class="font-extrabold tabular-nums text-slate-950 dark:text-white">
                                        {{ module.attempted }} / {{ module.total }}
                                    </span>
                                </div>
                                <div class="dash-progress bg-light-blue-500">
                                    <div class="relative h-full overflow-hidden rounded-full transition-all duration-700 ease-out"
                                        :class="module.barClass" :style="{ width: `${module.percent}%` }">
                                        <span v-if="module.percent > 0"
                                            class="ui-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent"></span>
                                    </div>
                                </div>
                                <div class="mt-3 flex items-center justify-between gap-2">
                                    <span class="text-xs font-semibold text-slate-500 dark:text-slate-300">
                                        {{ module.percent }}% complete
                                    </span>
                                    <span class="dash-btn theme-surface shrink-0 px-3 py-1.5 group-hover:translate-x-0.5">
                                        {{ module.ctaLabel }} <i class="pi pi-arrow-right text-[10px]"></i>
                                    </span>
                                </div>
                            </div>
                        </RouterLink>
                    </div>

                    <!-- Next step -->
                    <section class="mt-4">
                        <div class="dash-card-white grid gap-3 md:grid-cols-2">
                            <div class="min-w-0">
                                <p class="dash-eyebrow theme-text">Personal Next Step</p>
                                <h3 class="mt-1 text-base font-extrabold text-slate-950 dark:text-white">
                                    {{ nextPracticeMove.title }}
                                </h3>
                                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    {{ nextPracticeMove.detail }}
                                </p>
                                <div class="mt-4 flex flex-wrap gap-2">
                                    <RouterLink :to="nextPracticeMove.primaryRoute" class="dash-btn theme-surface theme-shadow">
                                        <i :class="nextPracticeMove.icon"></i>
                                        {{ nextPracticeMove.primaryLabel }}
                                    </RouterLink>
                                    <RouterLink to="/teas/performance-analysis" class="dash-btn-ghost">
                                        <i class="pi pi-chart-line"></i>
                                        Analyze
                                    </RouterLink>
                                    <RouterLink to="/teas/previous-attempts" class="dash-btn-ghost">
                                        <i class="pi pi-history"></i>
                                        History
                                    </RouterLink>
                                </div>
                            </div>

                            <div class="dash-tile-soft min-w-0">
                                <div class="flex items-center justify-between gap-3">
                                    <span class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                        Last attempt
                                    </span>
                                    <span class="analysis-pill text-[11px]" :class="latestAttemptBadgeClass">
                                        {{ latestAttemptStatus }}
                                    </span>
                                </div>
                                <template v-if="latestAttempt">
                                    <p class="mt-3 truncate text-sm font-bold text-slate-950 dark:text-white">
                                        {{ latestAttempt.sub_topic_name || "TEAS practice set" }}
                                    </p>
                                    <div class="mt-3 flex items-end justify-between gap-3">
                                        <div>
                                            <p class="text-2xl font-extrabold tabular-nums" :class="scoreToneClass(latestAttemptScore)">
                                                {{ latestAttemptScore }}%
                                            </p>
                                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">
                                                {{ latestAttemptDateText }}
                                            </p>
                                        </div>
                                        <div class="dash-progress h-2 w-24">
                                            <div class="h-full rounded-full transition-all duration-700"
                                                :class="scoreBarClass(latestAttemptScore)"
                                                :style="{ width: `${latestAttemptScore}%` }"></div>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <p class="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        No attempts yet.
                                    </p>
                                    <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">
                                        Start any TEAS section and this panel will turn into a progress shortcut.
                                    </p>
                                </template>
                            </div>
                        </div>
                    </section>

                    <!-- Referral nudge -->
                    <RouterLink to="/referral"
                        class="group dash-card-white dash-hover-lift mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div class="pointer-events-none absolute -top-12 -left-10 h-36 w-36 rounded-full bg-rose-200/50 blur-3xl dark:bg-rose-500/15"
                            aria-hidden="true"></div>
                        <div class="relative flex -space-x-2 shrink-0">
                            <span class="inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-rose-500 to-pink-600 text-white shadow dark:border-sky-950">
                                <i class="pi pi-user text-sm"></i>
                            </span>
                            <span class="theme-surface inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-white shadow dark:border-sky-950">
                                <i class="pi pi-heart-fill text-sm"></i>
                            </span>
                            <span class="inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-amber-400 to-orange-500 text-white shadow dark:border-sky-950">
                                <i class="pi pi-gift text-sm"></i>
                            </span>
                        </div>
                        <div class="relative min-w-0 flex-1">
                            <p class="dash-eyebrow text-rose-600 dark:text-rose-300">Need more free days of full access?</p>
                            <p class="mt-1 text-sm font-extrabold text-slate-950 dark:text-white">
                                Refer a friend and you both get {{ REFERRAL_REWARD_DAYS }} days free.
                            </p>
                            <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-300">
                                Rewards unlock once their first payment clears.
                            </p>
                        </div>
                        <span class="dash-btn relative shrink-0 bg-linear-to-r from-rose-600 to-orange-500 text-white group-hover:translate-x-0.5">
                            Refer now <i class="pi pi-arrow-right text-[10px]"></i>
                        </span>
                    </RouterLink>
                </article>

                <div class="ui-rise min-w-0 xl:col-span-5" style="animation-delay: 200ms">
                    <Probability :pass-mark="PASS_MARK" product="teas" section-field="category_id" :section-labels="sectionLabels" />
                </div>
            </section>

            <!-- ================= FOCUS + PEERS ================= -->
            <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <div class="ui-rise min-w-0 xl:col-span-5" style="animation-delay: 260ms">
                    <TodayFocusPanel product="teas" :pass-mark="PASS_MARK" :sections="focusSections" :attempts="focusAttempts"
                        :days-to-exam="daysToExam" :review-task="focusReviewTask"
                        :study-link="{ label: 'Browse study guides', route: '/teas/guide-topics' }"
                        subtitle="Ranked from your section scores, recency, and coverage." />
                </div>

                <div class="ui-rise min-w-0 xl:col-span-7" style="animation-delay: 300ms">
                    <PracticeProgressPeersChart product-label="TEAS" />
                </div>
            </section>

            <div class="ui-rise" style="animation-delay: 340ms">
                <StudySchedulePanel product-code="teas" :initial-exam-date="teas_exam_date"
                    progress-route="/teas/performance-analysis" study-route="/teas/guide-topics" title="TEAS Study Schedule"
                    @updated="handleExamDateUpdated" />
            </div>
        </div>
    </div>
</template>

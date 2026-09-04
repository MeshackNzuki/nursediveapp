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
import referfriend from "../../assets/images/referfriend2.png";

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

const summaryStats = computed(() => [
    {
        label: "Attempts",
        value: dashdata.value?.teas_attempts ?? teasAttempts.value.length,
        detail: "All time practice",
        icon: "pi pi-pencil",
        color: "text-sky-600 dark:text-sky-300",
    },
    {
        label: "Avg. Score",
        value: averageScore.value,
        detail: "Recent attempts",
        icon: "pi pi-percentage",
        color: "text-emerald-600 dark:text-emerald-300",
    },
    {
        label: "Areas",
        value: teasModules.length,
        detail: "Math, Science, Language, Reading",
        icon: "pi pi-th-large",
        color: "text-orange-600 dark:text-orange-300",
    },
]);

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

const focusCards = computed(() =>
    [...teasModulesWithProgress.value]
        .sort((a, b) => a.percent - b.percent)
        .slice(0, 2)
        .map((module, index) => ({
            key: `teas-focus-${module.id}`,
            title: module.title,
            icon: module.icon,
            color: module.color,
            route: module.route,
            targetScore: index === 0 ? 70 : 75,
            targetCopy: index === 0 ? "At least 70%" : "At least 75%",
            goal: `${Math.max(10, Math.round(module.total * 0.15))} questions`,
            duration: index === 0 ? "30 min" : "40 min",
            helper: module.percent > 0 ? `${module.percent}% complete. Keep building.` : "Start here to build momentum.",
            community: index === 0 ? "12k joined" : "9k joined",
        })),
);

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
    <div
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-white-500 p-4 text-gray-700 dark:bg-slate-900 dark:text-gray-50 sm:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh]">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
                <article class="rounded-2xl p-5 xl:col-span-8">
                    <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div class="min-w-0">
                            <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-200">
                                ATI TEAS Dashboard
                            </p>
                            <h1 class="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                                {{ welcomeHeading }}
                            </h1>
                            <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Build confidence with focused TEAS drills, check readiness, and keep your study plan
                                moving.
                            </p>
                        </div>

                        <div class="w-full lg:max-w-sm">
                            <StreakCard product-code="teas" />
                        </div>
                    </div>

                    <article class="mt-5 rounded-2xl border bg-light-blue-500 p-4 dark:border-sky-800 dark:bg-sky-900">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Find Practice</h2>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                                    Jump into a TEAS section or review your performance from the same surface.
                                </p>
                            </div>
                            <span
                                class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200">
                                <i class="pi pi-search"></i>
                            </span>
                        </div>

                        <div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <RouterLink v-for="module in teasModulesWithProgress" :key="module.id" :to="module.route"
                                class="flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-sky-50 dark:border-sky-800 dark:bg-sky-950/60 dark:text-slate-100 dark:hover:bg-sky-900">
                                <i :class="[module.icon, module.color]"></i>
                                {{ module.shortTitle }}
                            </RouterLink>
                        </div>
                    </article>

                    <div class="mt-5 flex flex-wrap gap-2">
                        <RouterLink v-for="action in quickActions" :key="action.route" :to="action.route"
                            class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/70 dark:text-sky-100 dark:hover:bg-sky-900">
                            <i :class="action.icon"></i>
                            {{ action.label }}
                        </RouterLink>
                        <RouterLink to="/teas/guide-topics"
                            class="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-200">
                            <i class="pi pi-map"></i>
                            Study Guides
                        </RouterLink>
                    </div>
                </article>

                <aside class="hidden xl:col-span-4 xl:block">
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

                    <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div v-for="stat in summaryStats" :key="stat.label"
                            class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-sky-800 dark:bg-sky-950/60">
                            <div class="flex items-center justify-between gap-3">
                                <span
                                    class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    {{ stat.label }}
                                </span>
                                <i :class="[stat.icon, stat.color, 'text-sm']"></i>
                            </div>
                            <p class="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{{ stat.value }}</p>
                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">{{ stat.detail }}</p>
                        </div>
                    </div>
                </aside>
            </section>

            <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <article
                    class="rounded-2xl border border-slate-200 bg-light-blue-500 p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900 xl:col-span-7">
                    <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 class="text-lg font-extrabold text-slate-950 dark:text-white">TEAS Practice Areas</h2>
                            <p class="text-xs text-slate-500 dark:text-slate-300">
                                See attempted exams across each TEAS section.
                            </p>
                        </div>
                        <span
                            class="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
                            {{ teasAttemptedTotal }} attempted
                        </span>
                    </div>

                    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <RouterLink v-for="module in teasModulesWithProgress" :key="module.id" :to="module.route"
                            class="group flex h-full flex-col rounded-xl border border-sky-100 bg-gradient-to-br from-blue-200 via-white to-amber-400 p-4 shadow-custom transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50 dark:border-sky-800 dark:bg-sky-950/50 dark:hover:bg-sky-950">
                            <div class="flex items-start justify-between gap-3">
                                <div class="flex min-w-0 items-start gap-3">
                                    <span
                                        class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-lg ring-1 ring-sky-100 dark:bg-sky-900/70 dark:ring-sky-800"
                                        :class="module.color">
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
                                <span
                                    class="shrink-0 rounded-full border border-sky-100 bg-light-blue-500 px-2.5 py-1 text-[11px] font-bold text-sky-800 dark:border-sky-800 dark:bg-sky-900 dark:text-sky-100">
                                    {{ module.total }} sets
                                </span>
                            </div>

                            <div class="mt-auto pt-5">
                                <div class="mb-2 flex items-center justify-between text-xs">
                                    <span class="font-semibold text-slate-500 dark:text-slate-300">Exam attempted</span>
                                    <span class="font-extrabold text-slate-950 dark:text-white">
                                        {{ module.attempted }} / {{ module.total }}
                                    </span>
                                </div>
                                <div
                                    class="h-2.5 overflow-hidden rounded-full bg-light-blue-500 ring-1 ring-sky-100 dark:bg-slate-800 dark:ring-slate-700">
                                    <div class="h-full rounded-full transition-all duration-500"
                                        :class="module.barClass" :style="{ width: `${module.percent}%` }"></div>
                                </div>
                                <div class="mt-3 flex items-center justify-between gap-2">
                                    <span class="text-xs font-semibold text-slate-500 dark:text-slate-300">
                                        {{ module.percent }}% complete
                                    </span>
                                    <span
                                        class="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky-800 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition group-hover:translate-x-0.5 group-hover:bg-sky-900 dark:bg-sky-700 dark:group-hover:bg-sky-600">
                                        {{ module.ctaLabel }} <i class="pi pi-arrow-right text-[10px]"></i>
                                    </span>
                                </div>
                            </div>
                        </RouterLink>
                    </div>

                    <section class="mt-4">
                        <div
                            class="grid gap-3 rounded-xl border border-sky-100 bg-white p-4 shadow-custom dark:border-sky-800 dark:bg-sky-950/60 md:grid-cols-2">
                            <div class="min-w-0">
                                <p class="text-xs font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-200">
                                    Personal Next Step
                                </p>
                                <h3 class="mt-1 text-base font-extrabold text-slate-950 dark:text-white">
                                    {{ nextPracticeMove.title }}
                                </h3>
                                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    {{ nextPracticeMove.detail }}
                                </p>
                                <div class="mt-4 flex flex-wrap gap-2">
                                    <RouterLink :to="nextPracticeMove.primaryRoute"
                                        class="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-600">
                                        <i :class="nextPracticeMove.icon"></i>
                                        {{ nextPracticeMove.primaryLabel }}
                                    </RouterLink>
                                    <RouterLink to="/teas/performance-analysis"
                                        class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-sky-800 dark:text-slate-100 dark:hover:bg-sky-900">
                                        <i class="pi pi-chart-line"></i>
                                        Analyze
                                    </RouterLink>
                                    <RouterLink to="/teas/previous-attempts"
                                        class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-sky-800 dark:text-slate-100 dark:hover:bg-sky-900">
                                        <i class="pi pi-history"></i>
                                        History
                                    </RouterLink>
                                </div>
                            </div>

                            <div class="min-w-0 rounded-xl bg-light-blue-500 p-3 dark:bg-sky-900/70">
                                <div class="flex items-center justify-between gap-3">
                                    <span
                                        class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                        Last attempt
                                    </span>
                                    <span class="rounded-full px-2.5 py-1 text-[11px] font-bold"
                                        :class="latestAttemptBadgeClass">
                                        {{ latestAttemptStatus }}
                                    </span>
                                </div>
                                <template v-if="latestAttempt">
                                    <p class="mt-3 truncate text-sm font-bold text-slate-950 dark:text-white">
                                        {{ latestAttempt.sub_topic_name || "TEAS practice set" }}
                                    </p>
                                    <div class="mt-3 flex items-end justify-between gap-3">
                                        <div>
                                            <p class="text-2xl font-extrabold"
                                                :class="scoreToneClass(latestAttemptScore)">
                                                {{ latestAttemptScore }}%
                                            </p>
                                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">
                                                {{ latestAttemptDateText }}
                                            </p>
                                        </div>
                                        <div
                                            class="h-2 w-24 overflow-hidden rounded-full bg-white ring-1 ring-sky-100 dark:bg-slate-800 dark:ring-sky-800">
                                            <div class="h-full rounded-full" :class="scoreBarClass(latestAttemptScore)"
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
                    <div
                        class="flex flex-col mt-4 gap-3 rounded-xl border border-sky-100 bg-white p-4 shadow-custom dark:border-sky-800 dark:bg-sky-950/60 ">
                        <div class="min-w-0">
                            <p class="text-xs font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-200">
                                Need more free days of full access
                            </p>
                        </div>
                        <div @click="$router.push('/referral')" class="flex flex-row cursor-pointer">
                            <img :src="referfriend" alt="Refer a Friend" class="h-full w-full rounded-lg" />
                        </div>
                    </div>
                </article>

                <div class="min-w-0 xl:col-span-5">
                    <Probability :pass-mark="75" product="teas" />
                </div>
            </section>

            <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <article
                    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900 xl:col-span-5">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Today's Focus</h2>
                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                                Two targeted starts based on your TEAS section progress.
                            </p>
                        </div>
                        <span
                            class="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                            Smart Sets
                        </span>
                    </div>

                    <div class="mt-4 space-y-3">
                        <article v-for="card in focusCards" :key="card.key"
                            class="grid grid-cols-12 gap-4 rounded-xl border border-slate-200 bg-light-blue-500 p-3 dark:border-sky-800 dark:bg-sky-950/60">
                            <div class="col-span-4 flex flex-col items-center justify-between text-center text-sm">
                                <div class="radial-progress bg-white shadow-sm dark:bg-sky-900/70" :class="card.color"
                                    :style="{ '--value': card.targetScore }" role="progressbar">
                                    <i :class="card.icon"></i>
                                </div>
                                <span class="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-300">
                                    {{ card.targetCopy }}
                                </span>
                            </div>

                            <div class="col-span-8 min-w-0 text-sm">
                                <h3 class="truncate font-semibold text-slate-950 dark:text-white">{{ card.title }}</h3>
                                <div
                                    class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
                                    <span><i class="pi pi-arrow-up mr-1 text-teal-500"></i>{{ card.goal }}</span>
                                    <span><i class="pi pi-clock mr-1"></i>{{ card.duration }}</span>
                                </div>
                                <p
                                    class="mt-3 rounded-full bg-teal-500/15 px-3 py-1 text-center text-xs font-semibold text-teal-700 dark:text-teal-200">
                                    {{ card.helper }}
                                </p>
                                <div class="mt-4 flex flex-wrap gap-2">
                                    <span
                                        class="rounded-full border border-dashed border-teal-500 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                        {{ card.community }}
                                    </span>
                                    <RouterLink :to="card.route"
                                        class="rounded-full bg-sky-500 px-4 py-1 text-xs font-semibold text-white transition hover:bg-sky-600">
                                        Start
                                    </RouterLink>
                                </div>
                            </div>
                        </article>
                    </div>
                </article>

                <div class="min-w-0 xl:col-span-7">
                    <PracticeProgressPeersChart product-label="TEAS" />
                </div>
            </section>

            <StudySchedulePanel product-code="teas" :initial-exam-date="teas_exam_date"
                progress-route="/teas/performance-analysis" study-route="/teas/guide-topics" title="TEAS Study Schedule"
                @updated="handleExamDateUpdated" />
        </div>
    </div>
</template>

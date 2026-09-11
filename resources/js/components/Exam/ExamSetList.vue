<template>
    <div class="space-y-5">
        <!-- ================= HERO ================= -->
        <section class="ui-rise dash-card p-5 md:p-6">
            <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                <div class="ui-drift absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl theme-glow opacity-60"></div>
                <div class="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_1px_1px,var(--theme-border)_1px,transparent_0)] [background-size:22px_22px]"></div>
            </div>

            <div class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div class="min-w-0">
                    <slot name="lead"></slot>
                    <p class="dash-eyebrow theme-text">{{ eyebrow }}</p>
                    <h2 class="mt-1 text-2xl font-black tracking-tight text-slate-950 md:text-3xl dark:text-white">{{ title }}</h2>
                    <p v-if="subtitle" class="mt-1 max-w-xl text-sm text-slate-600 dark:text-slate-300">{{ subtitle }}</p>
                </div>
                <div class="flex flex-wrap gap-2 lg:justify-end">
                    <slot name="actions"></slot>
                </div>
            </div>

            <!-- Stats -->
            <div class="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div v-for="stat in stats" :key="stat.label" class="dash-card-white flex items-center gap-2.5 p-2.5">
                    <span class="dash-icon-tile h-9 w-9 shrink-0 text-sm" :class="stat.tile"><i :class="stat.icon"></i></span>
                    <div class="min-w-0">
                        <p class="text-lg font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ stat.value }}</p>
                        <p class="truncate text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ stat.label }}</p>
                    </div>
                </div>
            </div>

            <!-- Search + filters -->
            <div class="relative mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <label class="theme-ring-gradient relative block w-full rounded-full p-[2px] lg:max-w-md">
                    <span class="relative flex items-center rounded-full bg-white dark:bg-sky-950">
                        <i class="pi pi-search pointer-events-none absolute left-4 text-sm theme-text"></i>
                        <input v-model="search" type="text" :placeholder="searchPlaceholder" autocomplete="off"
                            class="w-full rounded-full bg-transparent py-2.5 pr-10 pl-11 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100" />
                        <button v-if="search" type="button" class="absolute right-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-sky-900" aria-label="Clear search" @click="search = ''">
                            <i class="pi pi-times text-[10px]"></i>
                        </button>
                    </span>
                </label>
                <div class="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
                    <button v-for="chip in filterChips" :key="chip.key" type="button" class="dash-chip shrink-0 whitespace-nowrap px-3 py-1.5 text-[11px]"
                        :class="filter === chip.key ? 'theme-surface border-transparent shadow-md' : 'theme-soft theme-focus'" @click="filter = chip.key">
                        {{ chip.label }} <span class="rounded-full bg-white/25 px-1.5 text-[10px] tabular-nums dark:bg-white/10">{{ chip.count }}</span>
                    </button>
                    <label class="ml-1 inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-300">
                        <i class="pi pi-sort-alt text-[10px]"></i>
                        <select v-model="sort" class="theme-focus rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-bold text-slate-700 focus:outline-none dark:border-sky-700 dark:bg-sky-950 dark:text-slate-100">
                            <option value="default">Set order</option>
                            <option value="recent">Recently attempted</option>
                            <option value="high">Highest score</option>
                            <option value="low">Lowest score</option>
                            <option value="name">Name A–Z</option>
                        </select>
                    </label>
                </div>
            </div>
        </section>

        <!-- ================= LIST ================= -->
        <div v-if="loading" class="grid gap-4" :class="gridClass">
            <div v-for="n in 6" :key="n" class="h-48 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60"></div>
        </div>

        <div v-else-if="visibleExams.length === 0" class="dash-card-white flex flex-col items-center gap-2 py-12 text-center">
            <span class="dash-icon-tile theme-icon h-12 w-12"><i class="pi pi-inbox"></i></span>
            <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ exams.length === 0 ? "No exam sets here yet" : "Nothing matches that search or filter" }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-300">{{ exams.length === 0 ? "Check back soon." : "Try a different keyword or switch the filter back to all sets." }}</p>
            <button v-if="exams.length > 0" type="button" class="dash-btn-ghost mt-2 px-4 py-1.5 text-xs" @click="resetFilters">Show all sets</button>
        </div>

        <TransitionGroup v-else name="fade" tag="div" class="grid gap-4" :class="gridClass" appear>
            <article v-for="(exam, index) in visibleExams" :key="exam.id" class="group dash-card-white dash-hover-lift flex flex-col p-4 sm:p-5"
                :class="{ 'ring-2 ring-amber-300 ring-offset-0': statusOf(exam) === 'progress' }">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex min-w-0 items-start gap-3">
                        <span class="dash-icon-tile h-9 w-9 shrink-0 text-[11px] font-extrabold" :class="statusOf(exam) === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : statusOf(exam) === 'progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200' : 'theme-icon'">
                            {{ index + 1 }}
                        </span>
                        <div class="min-w-0">
                            <h3 class="text-sm font-extrabold leading-snug text-slate-950 dark:text-white">{{ displayName(exam) }}</h3>
                            <p v-if="exam.description" class="mt-0.5 line-clamp-2 text-[11px] text-slate-500 dark:text-slate-300">{{ exam.description }}</p>
                        </div>
                    </div>
                    <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky-700 px-2 py-0.5 text-[10px] font-bold text-white" :title="`${questionCount(exam)} questions`">
                        <i class="pi pi-list text-[9px]"></i> {{ questionCount(exam) }}
                    </span>
                </div>

                <div class="mt-4">
                    <ExamSetProgress :score="scoreOf(exam)" :completed="completedOf(exam)" :questions="questionCount(exam)" :last-attempt-at="lastAttemptAt(exam)" :pass-mark="passMark" />
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                    <button v-if="statusOf(exam) === 'progress'" type="button" class="dash-btn bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 text-white" @click="emit('resume', attemptIdOf(exam) as number, exam)">
                        <i class="pi pi-play text-[10px]"></i> Resume
                    </button>
                    <button v-if="statusOf(exam) === 'completed'" type="button" class="dash-btn-ghost px-4 py-2" @click="emit('review', attemptIdOf(exam) as number, exam)">
                        <i class="pi pi-eye text-[10px]"></i> Review
                    </button>
                    <button type="button" class="dash-btn px-4 py-2" :class="statusOf(exam) === 'new' ? 'theme-surface theme-shadow' : 'dash-btn-ghost'" @click="emit('start', exam)">
                        <i :class="statusOf(exam) === 'new' ? 'pi pi-play' : 'pi pi-refresh'" class="text-[10px]"></i>
                        {{ statusOf(exam) === "new" ? startLabel : retakeLabel }}
                    </button>
                </div>
            </article>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ExamSetProgress from "./ExamSetProgress.vue";

export type ExamSetItem = { id: number; name: string; description?: string | null; questions_count?: number | string | null; question_count?: number | string | null };
export type ExamAttemptLike = { id: number; sub_topic_id: number | string; score?: number | string | null; completed?: boolean | number | string | null; completed_at?: string | null; updated_at?: string | null; created_at?: string | null };
type Status = "new" | "progress" | "completed";
type Filter = "all" | Status;

const props = withDefaults(
    defineProps<{
        exams: ExamSetItem[];
        attempts: ExamAttemptLike[];
        title: string;
        subtitle?: string;
        eyebrow?: string;
        loading?: boolean;
        searchPlaceholder?: string;
        namePrefix?: string;
        columns?: 2 | 3;
        passMark?: number;
        startLabel?: string;
        retakeLabel?: string;
        /** Optional custom ordering for the default sort. */
        sortDefault?: (a: ExamSetItem, b: ExamSetItem) => number;
    }>(),
    { subtitle: "", eyebrow: "Exam sets", loading: false, searchPlaceholder: "Search exam sets...", namePrefix: "", columns: 3, passMark: 75, startLabel: "Take exam", retakeLabel: "Retake", sortDefault: undefined },
);
const emit = defineEmits<{ (e: "start", exam: ExamSetItem): void; (e: "resume", attemptId: number, exam: ExamSetItem): void; (e: "review", attemptId: number, exam: ExamSetItem): void }>();

const search = ref("");
const filter = ref<Filter>("all");
const sort = ref<"default" | "recent" | "high" | "low" | "name">("default");

const normalize = (s: string) => String(s || "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
const displayName = (exam: ExamSetItem) => {
    const n = normalize(exam.name);
    return `${props.namePrefix}${n.charAt(0).toUpperCase()}${n.slice(1)}`;
};
const questionCount = (exam: ExamSetItem) => Number(exam.questions_count ?? exam.question_count ?? 0) || 0;

const attemptFor = (exam: ExamSetItem) => props.attempts?.find((a) => String(a.sub_topic_id) === String(exam.id));
const scoreOf = (exam: ExamSetItem) => {
    const a = attemptFor(exam);
    return a ? Math.round(Number(a.score) || 0) : 0;
};
const completedOf = (exam: ExamSetItem) => {
    const a = attemptFor(exam);
    if (!a) return null;
    return Boolean(Number(a.completed) || a.completed === true);
};
const attemptIdOf = (exam: ExamSetItem) => attemptFor(exam)?.id ?? null;
const lastAttemptAt = (exam: ExamSetItem) => {
    const a = attemptFor(exam);
    return a ? a.completed_at || a.updated_at || a.created_at || null : null;
};
const statusOf = (exam: ExamSetItem): Status => {
    const a = attemptFor(exam);
    if (!a) return "new";
    return completedOf(exam) ? "completed" : "progress";
};

const counts = computed(() => ({
    all: props.exams.length,
    new: props.exams.filter((e) => statusOf(e) === "new").length,
    progress: props.exams.filter((e) => statusOf(e) === "progress").length,
    completed: props.exams.filter((e) => statusOf(e) === "completed").length,
}));
const averageScore = computed(() => {
    const scores = props.exams.map(scoreOf).filter((s) => s > 0);
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
});
const stats = computed(() => [
    { label: "Exam sets", value: counts.value.all, icon: "pi pi-list", tile: "theme-icon" },
    { label: "Completed", value: counts.value.completed, icon: "pi pi-check-circle", tile: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200" },
    { label: "In progress", value: counts.value.progress, icon: "pi pi-history", tile: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200" },
    { label: "Avg score", value: averageScore.value ? `${averageScore.value}%` : "–", icon: "pi pi-chart-line", tile: averageScore.value >= props.passMark ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200" : "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200" },
]);
const filterChips = computed(() => [
    { key: "all" as Filter, label: "All", count: counts.value.all },
    { key: "new" as Filter, label: "Not started", count: counts.value.new },
    { key: "progress" as Filter, label: "In progress", count: counts.value.progress },
    { key: "completed" as Filter, label: "Completed", count: counts.value.completed },
]);

const visibleExams = computed(() => {
    let list = [...props.exams];
    const q = search.value.trim().toLowerCase();
    if (q) list = list.filter((e) => displayName(e).toLowerCase().includes(q));
    if (filter.value !== "all") list = list.filter((e) => statusOf(e) === filter.value);
    switch (sort.value) {
        case "recent":
            list.sort((a, b) => new Date(lastAttemptAt(b) || 0).getTime() - new Date(lastAttemptAt(a) || 0).getTime());
            break;
        case "high":
            list.sort((a, b) => scoreOf(b) - scoreOf(a));
            break;
        case "low":
            list.sort((a, b) => (scoreOf(a) || 101) - (scoreOf(b) || 101));
            break;
        case "name":
            list.sort((a, b) => displayName(a).localeCompare(displayName(b)));
            break;
        default:
            if (props.sortDefault) list.sort(props.sortDefault);
    }
    return list;
});

const gridClass = computed(() => (props.columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"));
const resetFilters = () => {
    search.value = "";
    filter.value = "all";
};
</script>

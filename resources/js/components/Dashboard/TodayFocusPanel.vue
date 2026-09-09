<template>
    <article class="dash-card h-full">
        <div class="pointer-events-none absolute -top-16 -left-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-50"
            aria-hidden="true"></div>

        <div class="relative flex items-start justify-between gap-3">
            <div>
                <h2 class="dash-title">Today's Focus</h2>
                <p class="analysis-muted mt-1">{{ subtitle }}</p>
            </div>
            <span class="analysis-pill theme-soft border text-[11px]">
                <i class="pi pi-bolt mr-1"></i>{{ intensity.name }}
            </span>
        </div>

        <!-- Picks -->
        <div class="relative mt-4 space-y-3">
            <p v-if="!focusCards.length" class="dash-tile text-sm text-slate-500 dark:text-slate-300">
                Loading your sections...
            </p>
            <article v-for="card in focusCards" :key="card.key" class="group dash-tile dash-hover-lift relative overflow-hidden">
                <i v-if="!card.emoji" class="pointer-events-none absolute -bottom-4 -right-2 text-[88px] opacity-[0.06] transition-transform duration-500 group-hover:-rotate-6"
                    :class="[card.icon, card.inkClass]" aria-hidden="true"></i>
                <span v-else class="pointer-events-none absolute -bottom-3 -right-1 text-[72px] opacity-[0.08] transition-transform duration-500 group-hover:-rotate-6"
                    aria-hidden="true">{{ card.emoji }}</span>

                <div class="relative flex items-start gap-3">
                    <!-- Section score ring -->
                    <div class="relative h-16 w-16 shrink-0">
                        <svg class="h-16 w-16 -rotate-90" viewBox="0 0 52 52" aria-hidden="true">
                            <circle cx="26" cy="26" r="22" fill="none" stroke="currentColor" stroke-width="5"
                                class="text-slate-200 dark:text-slate-700" />
                            <circle cx="26" cy="26" r="22" fill="none" stroke="currentColor" stroke-width="5"
                                stroke-linecap="round" :stroke-dasharray="ringCircumference"
                                :stroke-dashoffset="card.ringOffset" :class="card.scoreTone"
                                class="transition-[stroke-dashoffset] duration-1000 ease-out" />
                            <circle cx="26" cy="26" r="22" fill="none" stroke="currentColor" stroke-width="7"
                                :stroke-dasharray="`1.5 ${ringCircumference - 1.5}`"
                                :stroke-dashoffset="ringCircumference * (1 - passMark / 100)"
                                class="text-slate-500 dark:text-slate-300" />
                        </svg>
                        <span class="absolute inset-0 flex flex-col items-center justify-center leading-none">
                            <span class="text-sm font-black tabular-nums text-slate-900 dark:text-white">
                                {{ card.hasScore ? `${card.score}%` : "—" }}
                            </span>
                            <span class="mt-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-400">avg</span>
                        </span>
                    </div>

                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2">
                            <span class="dash-icon-tile h-7 w-7 text-xs shadow" :class="card.tileClass">
                                <span v-if="card.emoji">{{ card.emoji }}</span>
                                <i v-else :class="card.icon"></i>
                            </span>
                            <h3 class="truncate text-sm font-extrabold text-slate-950 dark:text-white">{{ card.title }}</h3>
                        </div>
                        <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.14em]" :class="card.inkClass">
                            {{ card.rank }}
                        </p>
                        <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                            <i class="pi pi-info-circle mr-1 text-[10px] opacity-70"></i>{{ card.why }}
                        </p>
                    </div>
                </div>

                <div class="relative mt-3 flex items-center justify-between gap-2">
                    <button type="button" @click.prevent="swapPick(card.id)"
                        class="theme-focus inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-sky-900"
                        title="Swap for another section">
                        <i class="pi pi-refresh text-[10px]"></i>
                        Swap
                    </button>
                    <RouterLink :to="card.route" class="dash-btn theme-surface px-4 py-1.5">
                        Start <i class="pi pi-arrow-right text-[10px]"></i>
                    </RouterLink>
                </div>
            </article>
        </div>

        <!-- Daily plan -->
        <div class="dash-card-white relative mt-4">
            <div class="flex items-center justify-between gap-3">
                <div>
                    <p class="dash-eyebrow theme-text">Today's plan</p>
                    <p class="mt-0.5 text-sm font-extrabold text-slate-950 dark:text-white">
                        {{ planComplete ? "Plan complete. Well done." : `${planDoneCount} of ${planTasks.length} done` }}
                    </p>
                </div>
                <span v-if="planComplete"
                    class="ui-pop inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                    <i class="pi pi-check"></i>
                </span>
                <span v-else class="text-xs font-bold tabular-nums theme-text">{{ planProgress }}%</span>
            </div>
            <div class="dash-progress mt-3 h-2 bg-light-blue-500">
                <div class="relative h-full overflow-hidden rounded-full transition-all duration-700 ease-out"
                    :class="planComplete ? 'bg-emerald-500' : 'theme-bar'" :style="{ width: `${planProgress}%` }">
                    <span v-if="planProgress > 0 && !planComplete"
                        class="ui-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent"></span>
                </div>
            </div>

            <ul class="mt-3 space-y-2">
                <li v-for="task in planTasks" :key="task.id"
                    class="flex items-start gap-3 rounded-xl border p-2.5 transition-colors" :class="isTaskDone(task)
                        ? 'border-emerald-100 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30'
                        : 'border-slate-200 bg-slate-50 dark:border-sky-800 dark:bg-sky-950/40'">
                    <button type="button" @click="toggleTask(task)"
                        class="theme-focus mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition"
                        :class="isTaskDone(task)
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-300 bg-white text-transparent hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900'"
                        :aria-pressed="isTaskDone(task)" :aria-label="`Mark ${task.label} done`">
                        <i class="pi pi-check text-[10px]"></i>
                    </button>
                    <div class="min-w-0 flex-1">
                        <p class="text-sm font-bold text-slate-900 dark:text-white"
                            :class="isTaskDone(task) ? 'line-through opacity-60' : ''">
                            <i :class="task.icon" class="mr-1 text-xs opacity-70"></i>{{ task.label }}
                        </p>
                        <p class="text-xs text-slate-500 dark:text-slate-300">{{ task.helper }}</p>
                    </div>
                    <RouterLink v-if="task.route && !isTaskDone(task)" :to="task.route"
                        class="dash-btn-ghost shrink-0 px-3 py-1 text-[11px]">
                        Go
                    </RouterLink>
                    <button v-else-if="task.kind === 'session' && !isTaskDone(task)" type="button" @click="startFocusSession"
                        :disabled="focusSession.isActive.value" class="dash-btn theme-surface shrink-0 px-3 py-1 text-[11px] disabled:opacity-60">
                        <i class="pi pi-play text-[10px]"></i>
                        {{ focusSession.isActive.value ? focusSession.remainingLabel.value : "Start" }}
                    </button>
                </li>
            </ul>

            <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
                <RouterLink v-if="studyLink" :to="studyLink.route" class="text-xs font-bold theme-text hover:underline">
                    <i class="pi pi-map mr-1"></i>{{ studyLink.label }}
                </RouterLink>
                <span v-else></span>
                <span class="text-[11px] text-slate-400">Resets each day</span>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/authStore";
import { useFocusSession } from "../../utils/focusSession";

/**
 * Today's Focus: ranks the given sections from real signals (average score vs
 * pass mark, days since last practice, coverage), builds a 3-task daily plan,
 * and persists swaps + checklist per learner per day in localStorage.
 */

export interface FocusSection {
    id: number | string;
    title: string;
    shortTitle: string;
    icon: string;
    route: string;
    tileClass: string;
    inkClass: string;
    /** 0-100 share of this section's sets already attempted */
    percent: number;
    emoji?: string | null;
}

export interface FocusAttempt {
    sectionId: number | string | null;
    score: number | null;
    completed: boolean;
    timestamp: number;
}

export interface FocusReviewTask {
    label: string;
    helper: string;
    route: string;
}

const props = withDefaults(
    defineProps<{
        product: string;
        passMark: number;
        sections: FocusSection[];
        attempts: FocusAttempt[];
        daysToExam?: number | null;
        reviewTask?: FocusReviewTask | null;
        studyLink?: { label: string; route: string } | null;
        subtitle?: string;
    }>(),
    {
        daysToExam: null,
        reviewTask: null,
        studyLink: null,
        subtitle: "Ranked from your scores, recency, and coverage.",
    },
);

const { user } = storeToRefs(useAuthStore());
const focusSession = useFocusSession();

/* ---------- storage ---------- */
const toDayKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const todayKey = toDayKey(new Date());
const learnerKey = computed(() => String(user.value?.id || user.value?.email || "guest"));
const skipsStorageKey = computed(() => `nursenex_focus_skips_${learnerKey.value}_${props.product}_${todayKey}`);
const planStorageKey = computed(() => `nursenex_focus_plan_${learnerKey.value}_${props.product}_${todayKey}`);

const readJson = <T,>(key: string, fallback: T): T => {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
};
const writeJson = (key: string, value: unknown) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore storage failures
    }
};

/* ---------- signals ---------- */
interface SectionSignal {
    id: number | string;
    average: number | null;
    attempts: number;
    daysSince: number | null;
    percent: number;
    gap: number | null;
    priority: number;
    rotate: number;
}

// Daily rotation so equally-weak (e.g. untouched) sections don't always show in the same order.
const dailyHash = (id: number | string) => {
    let h = 2166136261;
    for (const ch of `${todayKey}:${id}`) {
        h ^= ch.charCodeAt(0);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0) % 1000;
};

const sectionSignals = computed<SectionSignal[]>(() =>
    props.sections.map((section) => {
        const own = props.attempts.filter((a) => String(a.sectionId) === String(section.id));
        const scores = own.filter((a) => a.completed && a.score !== null).map((a) => Math.max(0, Math.min(100, a.score as number)));
        const average = scores.length ? Math.round(scores.reduce((sum, v) => sum + v, 0) / scores.length) : null;
        const last = own.reduce((max, a) => Math.max(max, a.timestamp), 0);
        const daysSince = last ? Math.floor((Date.now() - last) / 86400000) : null;
        const gap = average === null ? null : props.passMark - average;

        const gapWeight = average === null ? 18 : Math.max(0, gap ?? 0) * 1.4;
        const staleWeight = daysSince === null ? 16 : Math.min(daysSince, 14) * 1.2;
        const coverageWeight = (100 - section.percent) * 0.12;

        return {
            id: section.id,
            average,
            attempts: scores.length,
            daysSince,
            percent: section.percent,
            gap,
            priority: Math.round(gapWeight + staleWeight + coverageWeight),
            rotate: dailyHash(section.id),
        };
    }),
);

const rankedSections = computed(() =>
    [...sectionSignals.value].sort((a, b) => b.priority - a.priority || a.rotate - b.rotate),
);

const skippedIds = ref<Array<number | string>>(readJson<Array<number | string>>(skipsStorageKey.value, []));
watch(skippedIds, (value) => writeJson(skipsStorageKey.value, value), { deep: true });

const focusPicks = computed(() => {
    const available = rankedSections.value.filter((s) => !skippedIds.value.includes(s.id));
    const pool = available.length >= 2 ? available : rankedSections.value;
    return pool.slice(0, 2);
});

const swapPick = (sectionId: number | string) => {
    const next = [...skippedIds.value, sectionId];
    skippedIds.value = next.length >= rankedSections.value.length - 1 ? [] : next;
};

const describeWhy = (signal: SectionSignal) => {
    const parts: string[] = [];
    if (signal.average === null) parts.push("no scored attempts yet");
    else if (signal.gap !== null && signal.gap > 0) parts.push(`${signal.gap} pts under the pass mark`);
    else parts.push("above the pass mark, keep it warm");
    if (signal.daysSince === null) parts.push("never practiced");
    else if (signal.daysSince >= 3) parts.push(`untouched for ${signal.daysSince} days`);
    else if (signal.daysSince === 0) parts.push("practiced today");
    if (signal.percent < 25) parts.push(`${signal.percent}% of sets covered`);
    const text = parts.slice(0, 2).join(", ");
    return text.charAt(0).toUpperCase() + text.slice(1) + ".";
};

const ringCircumference = 2 * Math.PI * 22;

const focusCards = computed(() =>
    focusPicks.value.flatMap((signal, index) => {
        const section = props.sections.find((s) => String(s.id) === String(signal.id));
        if (!section) return [];
        const score = signal.average ?? 0;
        return [{
            key: `${props.product}-focus-${section.id}`,
            id: section.id,
            title: section.title,
            shortTitle: section.shortTitle,
            icon: section.icon,
            emoji: section.emoji || null,
            tileClass: section.tileClass,
            inkClass: section.inkClass,
            route: section.route,
            rank: index === 0 ? "Top priority" : "Next up",
            score,
            hasScore: signal.average !== null,
            ringOffset: ringCircumference * (1 - score / 100),
            scoreTone: signal.average === null
                ? "text-slate-400"
                : score >= props.passMark
                    ? "text-emerald-600 dark:text-emerald-300"
                    : score >= 50
                        ? "text-amber-600 dark:text-amber-300"
                        : "text-rose-600 dark:text-rose-300",
            why: describeWhy(signal),
        }];
    }),
);

/* ---------- daily plan ---------- */
const intensity = computed(() => {
    const days = props.daysToExam;
    if (days !== null && days >= 0 && days <= 14) return { name: "Final stretch", q1: 25, q2: 20, minutes: 30 };
    if (days !== null && days >= 0 && days <= 60) return { name: "Steady build", q1: 20, q2: 15, minutes: 25 };
    return { name: "Light start", q1: 15, q2: 10, minutes: 20 };
});

interface PlanTask {
    id: string;
    label: string;
    helper: string;
    icon: string;
    route: string | null;
    kind: "practice" | "review" | "session";
}

const planTasks = computed<PlanTask[]>(() => {
    const [first, second] = focusCards.value;
    const tasks: PlanTask[] = [];
    if (first) {
        tasks.push({
            id: `practice-${first.id}`,
            label: `${intensity.value.q1} ${first.shortTitle} questions`,
            helper: first.why,
            icon: first.icon,
            route: first.route,
            kind: "practice",
        });
    }
    if (props.reviewTask) {
        tasks.push({ id: `review-${props.reviewTask.route}`, ...props.reviewTask, icon: "pi pi-eye", kind: "review" });
    } else if (second) {
        tasks.push({
            id: `practice-${second.id}`,
            label: `${intensity.value.q2} ${second.shortTitle} questions`,
            helper: second.why,
            icon: second.icon,
            route: second.route,
            kind: "practice",
        });
    }
    tasks.push({
        id: "session",
        label: `One ${intensity.value.minutes}-minute focus session`,
        helper: "Timer runs in the corner while you work. Completes on its own.",
        icon: "pi pi-stopwatch",
        route: null,
        kind: "session",
    });
    return tasks;
});

const manualDone = ref<Record<string, boolean>>(readJson<Record<string, boolean>>(planStorageKey.value, {}));
watch(manualDone, (value) => writeJson(planStorageKey.value, value), { deep: true });

const isTaskDone = (task: PlanTask) =>
    task.kind === "session"
        ? focusSession.completedToday(props.product) || !!manualDone.value[task.id]
        : !!manualDone.value[task.id];

const toggleTask = (task: PlanTask) => {
    manualDone.value = { ...manualDone.value, [task.id]: !manualDone.value[task.id] };
};

const planDoneCount = computed(() => planTasks.value.filter((task) => isTaskDone(task)).length);
const planComplete = computed(() => planTasks.value.length > 0 && planDoneCount.value === planTasks.value.length);
const planProgress = computed(() => (planTasks.value.length ? Math.round((planDoneCount.value / planTasks.value.length) * 100) : 0));

const startFocusSession = () => {
    const pick = focusCards.value[0];
    focusSession.start({
        minutes: intensity.value.minutes,
        label: pick ? pick.shortTitle : props.product.toUpperCase(),
        route: pick ? pick.route : `/${props.product}`,
        product: props.product,
    });
};
</script>

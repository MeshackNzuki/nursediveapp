<template>
    <section class="dash-card-white group/snap relative">
        <div class="pointer-events-none absolute -top-14 -right-14 h-40 w-40 rounded-full blur-3xl theme-glow opacity-40 transition-opacity duration-300 group-hover/snap:opacity-70"
            aria-hidden="true"></div>

        <div class="relative flex items-center justify-between gap-3">
            <div>
                <p class="dash-eyebrow theme-text">Snapshot</p>
                <p class="mt-0.5 text-sm font-extrabold text-slate-950 dark:text-white">{{ headline }}</p>
            </div>
            <span class="dash-icon-tile theme-icon h-9 w-9">
                <i class="pi pi-compass"></i>
            </span>
        </div>

        <!-- Headline numbers -->
        <div class="relative mt-3 grid grid-cols-3 gap-2">
            <div class="dash-tile-soft flex items-center gap-2 px-2.5 py-2">
                <span class="dash-icon-tile theme-icon h-7 w-7 shrink-0 text-xs"><i class="pi pi-pencil"></i></span>
                <div class="min-w-0">
                    <p class="text-base font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ totalAttempts }}</p>
                    <p class="truncate text-[10px] font-semibold text-slate-500 dark:text-slate-300">Attempts · {{ weekAttempts }} this week</p>
                </div>
            </div>
            <div class="dash-tile-soft flex items-center gap-2 px-2.5 py-2">
                <span class="dash-icon-tile theme-icon h-7 w-7 shrink-0 text-xs"><i class="pi pi-percentage"></i></span>
                <div class="min-w-0">
                    <p class="text-base font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">
                        {{ averageScore === null ? "—" : `${averageScore}%` }}
                    </p>
                    <p class="truncate text-[10px] font-semibold text-slate-500 dark:text-slate-300">
                        <i :class="['pi text-[8px]', deltaIcon]"></i> {{ deltaText }}
                    </p>
                </div>
            </div>
            <div class="dash-tile-soft flex items-center gap-2 px-2.5 py-2">
                <span class="dash-icon-tile theme-icon h-7 w-7 shrink-0 text-xs"><i class="pi pi-th-large"></i></span>
                <div class="min-w-0">
                    <p class="text-base font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ coveragePercent }}%</p>
                    <p class="truncate text-[10px] font-semibold text-slate-500 dark:text-slate-300">{{ coveredSets }}/{{ totalSets }} sets</p>
                </div>
            </div>
        </div>

        <!-- 14-day activity -->
        <div class="relative mt-3">
            <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                <span>Last 14 days</span>
                <span class="tabular-nums">{{ activeDays }} active {{ activeDays === 1 ? "day" : "days" }}</span>
            </div>
            <div class="mt-1.5 flex h-7 items-end gap-1" aria-label="Attempts per day over the last two weeks">
                <div v-for="day in activity" :key="day.key" class="relative flex h-full flex-1 items-end"
                    :title="`${day.label}: ${day.count} ${day.count === 1 ? 'attempt' : 'attempts'}`">
                    <div class="w-full rounded-sm transition-all duration-500"
                        :class="day.count ? 'theme-bar' : 'bg-slate-200/80 dark:bg-slate-700/70'"
                        :style="{ height: day.count ? `${Math.max(25, (day.count / maxDaily) * 100)}%` : '3px' }"></div>
                    <span v-if="day.today" class="theme-dot absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"></span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface SnapshotAttempt {
    timestamp: number;
    score: number | null;
    completed: boolean;
}

export interface SnapshotSection {
    id: number | string;
    label: string;
    attempted: number;
    total: number;
    barClass: string;
}

const props = withDefaults(
    defineProps<{
        attempts: SnapshotAttempt[];
        sections: SnapshotSection[];
        passMark: number;
        /** Word used for a section, e.g. "section" or "bank" */
        sectionNoun?: string;
        /** Optional all-time attempt count from the API; falls back to the attempts list */
        totalOverride?: number | null;
    }>(),
    { sectionNoun: "section", totalOverride: null },
);

const DAY = 86400000;
const toDayKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const totalAttempts = computed(() => props.totalOverride ?? props.attempts.length);

const weekAttempts = computed(() => {
    const cutoff = Date.now() - 7 * DAY;
    return props.attempts.filter((a) => a.timestamp >= cutoff).length;
});

const scored = computed(() =>
    [...props.attempts]
        .filter((a) => a.completed && a.score !== null)
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((a) => a.score as number),
);

const avg = (values: number[]) => (values.length ? Math.round(values.reduce((s, v) => s + v, 0) / values.length) : null);

const averageScore = computed(() => avg(scored.value));
/* Delta: last 5 scored attempts vs the 5 before them */
const scoreDelta = computed(() => {
    const recent = avg(scored.value.slice(0, 5));
    const previous = avg(scored.value.slice(5, 10));
    if (recent === null || previous === null) return null;
    return recent - previous;
});
const deltaText = computed(() => {
    if (scoreDelta.value === null) return scored.value.length ? "vs pass mark " + (averageScore.value! - props.passMark >= 0 ? "+" : "") + (averageScore.value! - props.passMark) : "no scores yet";
    if (scoreDelta.value === 0) return "steady";
    return `${scoreDelta.value > 0 ? "+" : ""}${scoreDelta.value} vs previous 5`;
});
const deltaIcon = computed(() => (scoreDelta.value === null || scoreDelta.value === 0 ? "pi-minus" : scoreDelta.value > 0 ? "pi-arrow-up-right" : "pi-arrow-down-right"));
/* Activity strip */
const activity = computed(() => {
    const counts = new Map<string, number>();
    props.attempts.forEach((a) => {
        if (!a.timestamp) return;
        const key = toDayKey(new Date(a.timestamp));
        counts.set(key, (counts.get(key) || 0) + 1);
    });
    const today = new Date();
    return Array.from({ length: 14 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (13 - i));
        const key = toDayKey(date);
        return {
            key,
            count: counts.get(key) || 0,
            today: i === 13,
            label: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
        };
    });
});
const maxDaily = computed(() => Math.max(1, ...activity.value.map((d) => d.count)));
const activeDays = computed(() => activity.value.filter((d) => d.count > 0).length);

/* Coverage */
const totalSets = computed(() => props.sections.reduce((s, sec) => s + Math.max(0, sec.total), 0));
const coveredSets = computed(() => props.sections.reduce((s, sec) => s + Math.min(sec.attempted, sec.total), 0));
const coveragePercent = computed(() => (totalSets.value ? Math.round((coveredSets.value / totalSets.value) * 100) : 0));

const headline = computed(() => {
    if (!totalAttempts.value) return "Your first attempt starts the story.";
    if (weekAttempts.value === 0) return "Quiet week. One set gets you moving.";
    if (averageScore.value !== null && averageScore.value >= props.passMark) return "Above the pass mark. Keep the rhythm.";
    return `${weekAttempts.value} ${weekAttempts.value === 1 ? "attempt" : "attempts"} this week. Nice momentum.`;
});
</script>

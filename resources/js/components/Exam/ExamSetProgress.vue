<template>
    <div class="set-progress" :class="[`set-progress--${tone}`, { 'set-progress--empty': !hasScore }]">
        <div class="flex items-center gap-3">
            <span class="set-progress-ring" :style="{ '--p': `${hasScore ? clamped : 0}%` }" :aria-label="hasScore ? `${clamped}% score` : 'No score yet'">
                <span>
                    <template v-if="hasScore">{{ clamped }}<small>%</small></template>
                    <i v-else class="pi pi-play text-[10px]"></i>
                </span>
            </span>
            <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-1.5">
                    <span class="set-progress-status" :class="statusClass">
                        <i :class="statusIcon"></i> {{ statusLabel }}
                    </span>
                    <span v-if="questions" class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{{ questions }} questions</span>
                </div>
                <p class="mt-1 truncate text-xs font-bold" :class="hasScore ? 'set-progress-ink' : 'text-slate-600 dark:text-slate-300'">
                    {{ hasScore ? gradeLabel : "First attempt sets your baseline." }}
                </p>
            </div>
        </div>

        <div class="set-progress-track" role="progressbar" :aria-valuenow="hasScore ? clamped : 0" aria-valuemin="0" aria-valuemax="100">
            <span class="set-progress-fill" :style="{ width: `${hasScore ? clamped : 0}%` }"></span>
            <span class="set-progress-tick" :style="{ left: `${passMark}%` }" :title="`Pass mark ${passMark}%`"></span>
        </div>
        <p class="mt-1.5 flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span v-if="hasScore">{{ deltaLabel }}</span>
            <span v-else>Pass mark {{ passMark }}%</span>
            <span v-if="hasScore && lastAttemptAt" class="truncate">{{ timeAgo(lastAttemptAt) }}</span>
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { timeAgo } from "../../utils/timeAgo";

const props = withDefaults(
    defineProps<{
        /** Best or latest score in percent; 0 or null means no attempt yet. */
        score?: number | null;
        /** Whether the latest attempt was completed (false = resumable). */
        completed?: boolean | null;
        questions?: number | string | null;
        passMark?: number;
        lastAttemptAt?: string | null;
    }>(),
    { score: 0, completed: null, questions: null, passMark: 75, lastAttemptAt: null },
);

const clamped = computed(() => Math.max(0, Math.min(100, Math.round(Number(props.score) || 0))));
const hasScore = computed(() => clamped.value > 0);

const tone = computed<"none" | "pass" | "near" | "low">(() => {
    if (!hasScore.value) return "none";
    if (clamped.value >= props.passMark) return "pass";
    if (clamped.value >= props.passMark - 15) return "near";
    return "low";
});

const gradeLabel = computed(() => {
    const s = clamped.value;
    if (s >= 90) return "Excellent. Exam-ready on this set.";
    if (s >= props.passMark) return "Passing. Keep it sharp with a retake.";
    if (s >= props.passMark - 15) return "Almost there. Review the misses.";
    if (s >= 40) return "Building. Work through the rationales.";
    return "Needs work. Tutor mode will help.";
});

const deltaLabel = computed(() => {
    const diff = clamped.value - props.passMark;
    if (diff === 0) return "Right at the pass mark";
    return diff > 0 ? `${diff} pts above pass mark` : `${Math.abs(diff)} pts to pass mark`;
});

const statusLabel = computed(() => {
    if (!hasScore.value) return "Not started";
    if (props.completed === false) return "In progress";
    if (props.completed === true) return "Completed";
    return "Attempted";
});
const statusIcon = computed(() => {
    if (!hasScore.value) return "pi pi-circle";
    if (props.completed === false) return "pi pi-history";
    return "pi pi-check-circle";
});
const statusClass = computed(() => {
    if (!hasScore.value) return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
    if (props.completed === false) return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200";
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200";
});
</script>

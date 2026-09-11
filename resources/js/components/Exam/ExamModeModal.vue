<template>
    <dialog ref="dialogRef" class="modal" @close="emit('close')">
        <div class="modal-box exam-mode-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2" aria-label="Close">✕</button>
            </form>

            <p class="dash-eyebrow theme-text">{{ eyebrow }}</p>
            <h3 class="mt-1 pr-8 text-lg font-extrabold leading-snug text-slate-950">{{ exam?.name || "Practice set" }}</h3>
            <p class="mt-1 text-xs text-slate-500">
                <template v-if="questionCount">{{ questionCount }} questions · about {{ estimatedMinutes }} min · </template>choose how you want to work through it.
            </p>

            <div v-if="previewCount" class="exam-mode-preview">
                <i class="pi pi-lock"></i>
                <span>Preview plan: the first <strong>{{ previewCount }}</strong> questions are open. You can unlock the whole set any time from inside the exam.</span>
            </div>

            <div class="mt-4 grid gap-2" :class="modeCards.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'">
                <button v-for="mode in modeCards" :key="mode.key" type="button" class="exam-mode-card group" :class="mode.card" @click="choose(mode.key)">
                    <span class="flex items-center gap-2">
                        <span class="dash-icon-tile h-9 w-9 text-sm" :class="mode.tile"><i :class="mode.icon"></i></span>
                        <span class="text-sm font-extrabold text-slate-950">{{ mode.title }}</span>
                    </span>
                    <span class="mt-2 block text-[11px] leading-snug text-slate-500">{{ mode.description }}</span>
                    <span class="exam-mode-cta mt-3" :class="mode.button">
                        {{ mode.cta }} <i class="pi pi-arrow-right text-[9px] transition-transform group-hover:translate-x-0.5"></i>
                    </span>
                </button>
            </div>

            <p class="mt-3 text-[11px] text-slate-400"><i class="pi pi-info-circle mr-1"></i>You can pause at any point and resume from the test bank.</p>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "../../stores/authStore";

export type ExamMode = "tutor" | "exam" | "review";
type ExamLike = { id: number | string; name: string; questions_count?: number | string | null; question_count?: number | string | null } | null;

const props = withDefaults(
    defineProps<{
        product: "nursing" | "teas";
        exam: ExamLike;
        modes?: ExamMode[];
        eyebrow?: string;
        /** Questions open on a preview/trial plan; defaults per product. */
        previewLimit?: number;
    }>(),
    { modes: () => ["tutor", "exam"], eyebrow: "Start practice", previewLimit: 0 },
);
const emit = defineEmits<{ (e: "select", mode: ExamMode): void; (e: "close"): void }>();

const authStore = useAuthStore();
const dialogRef = ref<HTMLDialogElement | null>(null);

const MODE_META: Record<ExamMode, { title: string; description: string; cta: string; icon: string; tile: string; button: string; card: string }> = {
    tutor: {
        title: "Tutor mode",
        description: "Rationale after each answer. Notes and AI help on.",
        cta: "Start tutor",
        icon: "pi pi-comments",
        tile: "bg-teal-100 text-teal-700",
        button: "bg-teal-600 text-white hover:bg-teal-700",
        card: "hover:border-teal-300",
    },
    exam: {
        title: "Exam mode",
        description: "Timed and distraction-free. Rationales at the end.",
        cta: "Start exam",
        icon: "pi pi-stopwatch",
        tile: "bg-sky-700 text-white shadow-md shadow-sky-700/30",
        button: "bg-sky-700 text-white hover:bg-sky-800",
        card: "hover:border-sky-400",
    },
    review: {
        title: "Review",
        description: "Every question with the answer key shown.",
        cta: "Open review",
        icon: "pi pi-eye",
        tile: "bg-slate-200 text-slate-700",
        button: "bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100",
        card: "hover:border-slate-400",
    },
};

const modeCards = computed(() => props.modes.map((key) => ({ key, ...MODE_META[key] })));
const questionCount = computed(() => Number(props.exam?.questions_count ?? props.exam?.question_count ?? 0) || 0);
const estimatedMinutes = computed(() => Math.max(5, Math.round(questionCount.value * 1.2)));
const previewCount = computed(() => {
    if (authStore.active(props.product)) return 0;
    return props.previewLimit || (props.product === "teas" ? 4 : 15);
});

const choose = (mode: ExamMode) => {
    emit("select", mode);
    close();
};
const open = () => dialogRef.value?.showModal();
const close = () => dialogRef.value?.close();

defineExpose({ open, close });
</script>

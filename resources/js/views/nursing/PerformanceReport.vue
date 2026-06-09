<template>
    <div
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll rounded-2xl bg-slate-50 p-4 sm:p-6 dark:bg-slate-950">
        <div class="pointer-events-none absolute inset-0 -z-10">
            <div
                class="absolute -left-32 -top-20 h-[260px] w-[260px] rounded-full bg-gradient-to-r from-cyan-300/40 via-sky-300/40 to-emerald-300/30 blur-[100px] dark:from-cyan-500/20 dark:via-sky-500/20 dark:to-emerald-500/15">
            </div>
            <div
                class="absolute right-0 top-24 h-[320px] w-[320px] rounded-full bg-gradient-to-r from-emerald-300/30 via-sky-300/30 to-cyan-300/30 blur-[110px] dark:from-emerald-500/15 dark:via-sky-500/15 dark:to-cyan-500/15">
            </div>
        </div>

        <div class="mx-auto max-w-6xl">
            <div class="mb-5 rounded-2xl">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Performance Report</h1>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <CommonButton v-if="!isCompleted" icon2="pi pi-pause" buttonText="Resume Exam"
                            class="bg-gradient-to-r from-amber-500 to-orange-500" :action="resumeExam" />
                        <CommonButton icon2="pi pi-refresh" buttonText="Review Attempt" :action="reviewAnswers" />
                        <CommonButton :action="() => $router.push('/nursing/performance-analysis')"
                            button-text="Performance Analysis" icon2="" />
                    </div>
                </div>
            </div>

            <div v-if="!report"
                class="rounded-3xl bg-white/90 p-10 text-center text-slate-500 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.55)] dark:bg-slate-900/80 dark:text-slate-300">
                Loading report...
            </div>

            <div v-else class="space-y-5">
                <section
                    class="rounded-3xl bg-white/95 p-5 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.65)] backdrop-blur-sm dark:bg-slate-900/85">
                    <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div class="max-w-3xl">
                            <h2 class="break-words font-sans text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                {{ normalizeText(report.exam.name) }} ({{ report.mode }} Mode)
                            </h2>
                            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Taken on <strong>{{ formatDate(report.completed_at) }}.</strong>

                            </p>
                            <div class="mt-3 flex flex-wrap gap-2">
                                <span
                                    class="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800 shadow-sm shadow-sky-100 dark:bg-sky-900/45 dark:text-sky-100 dark:shadow-none">
                                    Time: {{ secondsToHms(report.time_taken) }}
                                </span>
                                <span class="rounded-full px-3 py-1 text-xs font-semibold shadow-sm dark:shadow-none"
                                    :class="isCompleted
                                        ? 'bg-emerald-100 text-emerald-800 shadow-emerald-100 dark:bg-emerald-900/45 dark:text-emerald-100'
                                        : 'bg-rose-100 text-rose-700 shadow-rose-100 dark:bg-rose-900/45 dark:text-rose-100'">
                                    {{ isCompleted ? 'Completed' : 'Not Completed' }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="flex min-w-[190px] flex-col items-center gap-2 rounded-2xl  px-5 py-4 shadow-inner shadow-slate-200/70 dark:bg-slate-950/45 dark:shadow-none">
                            <div class="radial-progress h-28 w-28 rounded-full bg-white text-2xl font-bold shadow-sm dark:bg-slate-900"
                                :class="progressRingClass" :style="`--value: ${scoreRounded}`" role="progressbar">
                                {{ scoreRounded }}%
                            </div>
                            <span class="text-base font-semibold" :class="gradeClass">{{ gradeText }}</span>
                        </div>
                    </div>

                    <div v-if="!isCompleted"
                        class="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm shadow-amber-100/80 dark:bg-amber-900/30 dark:text-amber-100 dark:shadow-none">
                        This attempt is incomplete, so scores may be lower than your true performance.
                        <button class="ml-1 cursor-pointer font-semibold underline decoration-dashed"
                            @click="resumeExam">
                            Resume exam
                        </button>
                    </div>

                    <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                        <div
                            class="rounded-2xl bg-indigo-50 px-4 py-4 shadow-sm shadow-indigo-100/80 dark:bg-indigo-950/45 dark:shadow-none">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <div
                                        class="text-[11px] font-semibold uppercase tracking-wide text-indigo-700/80 dark:text-indigo-200">
                                        Total
                                    </div>
                                    <div
                                        class="mt-2 text-3xl font-bold leading-none text-indigo-950 dark:text-indigo-100">
                                        {{ totalQuestions }}
                                    </div>
                                </div>
                                <span
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:bg-indigo-500 dark:shadow-none">
                                    <i class="pi pi-list text-sm"></i>
                                </span>
                            </div>
                        </div>
                        <div
                            class="rounded-2xl bg-emerald-50 px-4 py-4 shadow-sm shadow-emerald-100/80 dark:bg-emerald-950/45 dark:shadow-none">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <div
                                        class="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-200">
                                        Correct
                                    </div>
                                    <div
                                        class="mt-2 text-3xl font-bold leading-none text-emerald-800 dark:text-emerald-100">
                                        {{ correctCount }}
                                    </div>
                                </div>
                                <span
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:bg-emerald-500 dark:shadow-none">
                                    <i class="pi pi-check text-sm"></i>
                                </span>
                            </div>
                        </div>
                        <div
                            class="rounded-2xl bg-rose-50 px-4 py-4 shadow-sm shadow-rose-100/80 dark:bg-rose-950/45 dark:shadow-none">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <div
                                        class="text-[11px] font-semibold uppercase tracking-wide text-rose-700/80 dark:text-rose-200">
                                        Incorrect
                                    </div>
                                    <div class="mt-2 text-3xl font-bold leading-none text-rose-800 dark:text-rose-100">
                                        {{ incorrectCount }}
                                    </div>
                                </div>
                                <span
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm shadow-rose-200 dark:bg-rose-500 dark:shadow-none">
                                    <i class="pi pi-times text-sm"></i>
                                </span>
                            </div>
                        </div>
                        <div
                            class="rounded-2xl bg-sky-50 px-4 py-4 shadow-sm shadow-sky-100/80 dark:bg-sky-950/45 dark:shadow-none">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <div
                                        class="text-[11px] font-semibold uppercase tracking-wide text-sky-700/80 dark:text-sky-200">
                                        Attempted
                                    </div>
                                    <div class="mt-2 text-3xl font-bold leading-none text-sky-800 dark:text-sky-100">
                                        {{ attemptedCount }}
                                    </div>
                                </div>
                                <span
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm shadow-sky-200 dark:bg-sky-500 dark:shadow-none">
                                    <i class="pi pi-pencil text-sm"></i>
                                </span>
                            </div>
                        </div>
                        <div
                            class="rounded-2xl bg-amber-50 px-4 py-4 shadow-sm shadow-amber-100/80 dark:bg-amber-950/45 dark:shadow-none">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <div
                                        class="text-[11px] font-semibold uppercase tracking-wide text-amber-700/80 dark:text-amber-200">
                                        Unanswered
                                    </div>
                                    <div
                                        class="mt-2 text-3xl font-bold leading-none text-amber-800 dark:text-amber-100">
                                        {{ unansweredCount }}
                                    </div>
                                </div>
                                <span
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-200 dark:shadow-none">
                                    <i class="pi pi-minus text-sm"></i>
                                </span>
                            </div>
                        </div>
                        <div
                            class="rounded-2xl bg-violet-50 px-4 py-4 shadow-sm shadow-violet-100/80 dark:bg-violet-950/45 dark:shadow-none">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <div
                                        class="text-[11px] font-semibold uppercase tracking-wide text-violet-700/80 dark:text-violet-200">
                                        Accuracy
                                    </div>
                                    <div
                                        class="mt-2 text-3xl font-bold leading-none text-violet-900 dark:text-violet-100">
                                        {{ accuracyPercent }}%
                                    </div>
                                </div>
                                <span
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-200 dark:bg-violet-500 dark:shadow-none">
                                    <i class="pi pi-chart-line text-sm"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    class="rounded-3xl bg-white/95 p-5 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.55)] backdrop-blur-sm dark:bg-slate-900/85">
                    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div class="max-w-3xl">
                            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Readiness Insight</h3>
                            <p class="mt-2 text-slate-600 dark:text-slate-300">
                                Your current readiness is
                                <span :class="readinessClass" class="font-semibold">{{ readinessLabel }}</span>.
                                {{ readinessText }}
                            </p>
                            <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">
                                You answered <span class="font-semibold text-emerald-600 dark:text-emerald-300">{{
                                    correctCount
                                }}</span>
                                out of <span class="font-semibold text-slate-700 dark:text-slate-100">{{
                                    totalQuestions
                                }}</span>
                                questions correctly.
                            </p>
                        </div>
                        <div
                            class="rounded-2xl bg-slate-50 px-5 py-4 text-center shadow-inner shadow-slate-200/70 dark:bg-slate-950/45 dark:shadow-none">
                            <div
                                class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Score
                            </div>
                            <div class="mt-1 text-3xl font-bold text-slate-950 dark:text-slate-100">
                                {{ scoreRounded }}%
                            </div>
                        </div>
                    </div>

                    <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div
                            class="rounded-2xl bg-rose-50 p-4 shadow-sm shadow-rose-100/80 dark:bg-rose-950/40 dark:shadow-none">
                            <div class="flex items-center gap-3">
                                <span
                                    class="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white">
                                    <i class="pi pi-arrow-down text-sm"></i>
                                </span>
                                <div>
                                    <div class="text-sm font-semibold text-rose-800 dark:text-rose-100">Low Readiness
                                    </div>
                                    <div class="mt-0.5 text-xs text-rose-700/80 dark:text-rose-200/80">Below 50%</div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="rounded-2xl bg-amber-50 p-4 shadow-sm shadow-amber-100/80 dark:bg-amber-950/40 dark:shadow-none">
                            <div class="flex items-center gap-3">
                                <span
                                    class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white">
                                    <i class="pi pi-minus text-sm"></i>
                                </span>
                                <div>
                                    <div class="text-sm font-semibold text-amber-800 dark:text-amber-100">Moderate
                                        Readiness
                                    </div>
                                    <div class="mt-0.5 text-xs text-amber-700/80 dark:text-amber-200/80">50% to 69%
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="rounded-2xl bg-emerald-50 p-4 shadow-sm shadow-emerald-100/80 dark:bg-emerald-950/40 dark:shadow-none">
                            <div class="flex items-center gap-3">
                                <span
                                    class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                                    <i class="pi pi-arrow-up text-sm"></i>
                                </span>
                                <div>
                                    <div class="text-sm font-semibold text-emerald-800 dark:text-emerald-100">High
                                        Readiness
                                    </div>
                                    <div class="mt-0.5 text-xs text-emerald-700/80 dark:text-emerald-200/80">70% and
                                        above
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div
                    class="flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-white/70 p-3 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.5)] backdrop-blur-sm dark:bg-slate-900/60">
                    <CommonButton icon="pi pi-arrow-left" buttonText="Previous Tests"
                        :action="() => router.push('/nursing/previous-attempts')" />
                    <CommonButton icon2="pi pi-refresh" buttonText="Review Attempt" :action="reviewAnswers" />
                    <CommonButton icon="pi pi-replay" buttonText="Retake Exam" :action="openModal" />
                </div>
            </div>
        </div>

        <dialog ref="modalRef" id="examModal" class="modal">
            <div class="modal-box">
                <div class="modal-action mt-4">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button>
                    </form>
                </div>
                <h3 class="mb-4 text-lg font-bold">Start "{{ report?.exam?.name }}" as:</h3>
                <div class="flex justify-end gap-4">
                    <CommonButton button-text="Exam Mode" :action="() => goToExam('exam')" />
                    <CommonButton button-text="Tutor Mode" :action="() => goToExam('tutor')" />
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonButton from '../../components/Buttons/CommonButton.vue'
import { normalizeText } from '../../utils/normalizeText'
import { secondsToHms } from '../../utils/secondsToHms'

type ResultItem = {
    correct: boolean
}

const route = useRoute()
const router = useRouter()

const modalRef = ref<HTMLDialogElement | null>(null)
const report = ref<any>(null)

const attemptId = route.path.split('/').pop()

onMounted(() => {
    axios.get(`/nursing/performance-report/${attemptId}`)
        .then((res) => {
            report.value = res.data.data
        })
        .catch((err) => {
            console.error('Error fetching performance report:', err)
            report.value = null
        })
})

function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

function reviewAnswers() {
    router.push(`/nursing/exam/${attemptId}?mode=review`)
}

const resumeExam = () => {
    if (!report.value?.attempt_id) return
    router.push(`/nursing/exam/${report.value.attempt_id}?resume=true`)
}

function openModal() {
    modalRef.value?.showModal()
}

const goToExam = (mode: 'tutor' | 'exam') => {
    if (!report.value) return
    router.push(`/nursing/exam/${report.value.exam.id}?mode=${mode}`)
    modalRef.value?.close()
}

const parsedResults = computed<Record<string, ResultItem>>(() => {
    try {
        return JSON.parse(report.value?.results || '{}') as Record<string, ResultItem>
    } catch {
        return {}
    }
})

const correctCount = computed(() =>
    Object.values(parsedResults.value).filter((r) => r.correct).length
)

const incorrectCount = computed(() => {
    const parsedIncorrect = Object.values(parsedResults.value).filter((r) => !r.correct).length
    if (parsedIncorrect > 0) return parsedIncorrect
    return Math.max(totalQuestions.value - correctCount.value, 0)
})

const totalQuestions = computed(() => {
    const fromExam = Number(report.value?.exam?.questions_count ?? report.value?.exam?.question_count ?? 0)
    if (fromExam > 0) return fromExam
    return Object.keys(parsedResults.value).length
})

const attemptedCount = computed(() => Object.keys(parsedResults.value).length)
const unansweredCount = computed(() => Math.max(totalQuestions.value - attemptedCount.value, 0))
const accuracyPercent = computed(() => {
    if (totalQuestions.value <= 0) return 0
    return Math.round((correctCount.value / totalQuestions.value) * 100)
})

const isCompleted = computed(() => Number(report.value?.completed) === 1 || report.value?.completed === true)
const score = computed(() => Number(report.value?.score) || 0)
const scoreRounded = computed(() => Math.round(score.value))

const progressRingClass = computed(() => {
    if (score.value >= 70) return 'text-emerald-500'
    if (score.value >= 50) return 'text-amber-500'
    return 'text-rose-500'
})

const gradeText = computed(() => {
    if (score.value >= 70) return 'Strong performance'
    if (score.value >= 50) return 'Making progress'
    return 'Needs reinforcement'
})

const gradeClass = computed(() => {
    if (score.value >= 70) return 'text-emerald-600 dark:text-emerald-300'
    if (score.value >= 50) return 'text-amber-600 dark:text-amber-300'
    return 'text-rose-600 dark:text-rose-300'
})

const readinessLabel = computed(() => {
    if (score.value >= 70) return 'high'
    if (score.value >= 50) return 'moderate'
    return 'low'
})

const readinessClass = computed(() => {
    if (score.value >= 70) return 'text-emerald-600 dark:text-emerald-300'
    if (score.value >= 50) return 'text-amber-600 dark:text-amber-300'
    return 'text-rose-600 dark:text-rose-300'
})

const readinessText = computed(() => {
    if (score.value >= 70) return 'Keep polishing weak areas to stay above the passing threshold.'
    if (score.value >= 50) return 'Target missed concepts and run another timed attempt soon.'
    return 'Focus on fundamentals first, then retest with tutor mode support.'
})
</script>

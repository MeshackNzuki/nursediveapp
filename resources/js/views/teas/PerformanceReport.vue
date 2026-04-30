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
            <div v-if="score > 85" class="absolute inset-0 overflow-hidden">
                <div
                    v-confetti="{ particleCount: 420, force: 0.35, stageHeight: 500, stageWidth: 2000, particleSize: 4 }" />
            </div>
        </div>

        <div class="mx-auto max-w-6xl">
            <div
                class="mb-5 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Performance Report</h1>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">TEAS exam attempt summary</p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <CommonButton v-if="!isCompleted && report?.attempt_id" icon2="pi pi-pause" buttonText="Resume Exam"
                            class="bg-gradient-to-r from-amber-500 to-orange-500" :action="resumeExam" />
                        <CommonButton icon2="pi pi-refresh" buttonText="Review Attempt" :action="reviewAnswers" />
                        <CommonButton :action="() => $router.push('/teas/performance-analysis')"
                            button-text="Performance Analysis" icon2="pi pi-chart-line" />
                    </div>
                </div>
            </div>

            <div v-if="!report"
                class="rounded-2xl border border-slate-200 bg-white/80 p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                Loading report...
            </div>

            <div v-else class="space-y-5">
                <section
                    class="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_-36px_rgba(2,132,199,0.55)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
                    <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div class="max-w-3xl">
                            <h2 class="break-words text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {{ normalizeText(report.exam.name) }}
                            </h2>
                            <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">
                                Taken on <strong>{{ formatDate(report.completed_at) }}</strong>
                                in <span class="capitalize font-medium">{{ report.mode }}</span> mode
                            </p>
                            <div class="mt-3 flex flex-wrap gap-2">
                                <span
                                    class="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-700/60 dark:bg-sky-900/30 dark:text-sky-200">
                                    Time: {{ secondsToHms(report.time_taken) }}
                                </span>
                                <span
                                    class="rounded-full border px-3 py-1 text-xs font-semibold"
                                    :class="isCompleted
                                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-900/30 dark:text-emerald-200'
                                        : 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700/60 dark:bg-rose-900/30 dark:text-rose-200'">
                                    {{ isCompleted ? 'Completed' : 'Not Completed' }}
                                </span>
                                <span v-if="!isCompleted && report?.suspend_index"
                                    class="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-700/60 dark:bg-amber-900/25 dark:text-amber-200">
                                    Suspended at Q#{{ report.suspend_index }}
                                </span>
                            </div>
                        </div>

                        <div class="flex min-w-[180px] flex-col items-center gap-2">
                            <div class="radial-progress h-28 w-28 rounded-full bg-white text-2xl font-bold shadow-lg dark:bg-slate-900"
                                :class="progressRingClass" :style="`--value: ${scoreRounded}`" role="progressbar">
                                {{ scoreRounded }}%
                            </div>
                            <span class="text-base font-semibold" :class="gradeClass">{{ gradeText }}</span>
                        </div>
                    </div>

                    <div v-if="!isCompleted"
                        class="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700/60 dark:bg-amber-900/25 dark:text-amber-100">
                        This attempt is incomplete, so scores may be lower than your true performance.
                        <button v-if="report?.attempt_id" class="ml-1 cursor-pointer font-semibold underline decoration-dashed"
                            @click="resumeExam">
                            Resume exam
                        </button>
                    </div>

                    <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                        <div
                            class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-700 dark:bg-slate-800/60">
                            <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                Total
                            </div>
                            <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ totalQuestions }}
                            </div>
                        </div>
                        <div
                            class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-center dark:border-emerald-700/60 dark:bg-emerald-900/25">
                            <div class="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                                Correct
                            </div>
                            <div class="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-200">{{ correctCount }}
                            </div>
                        </div>
                        <div
                            class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-center dark:border-rose-700/60 dark:bg-rose-900/25">
                            <div class="text-[11px] font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-200">
                                Incorrect
                            </div>
                            <div class="mt-1 text-2xl font-bold text-rose-700 dark:text-rose-200">{{ incorrectCount }}
                            </div>
                        </div>
                        <div
                            class="rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-center dark:border-sky-700/60 dark:bg-sky-900/25">
                            <div class="text-[11px] font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-200">
                                Attempted
                            </div>
                            <div class="mt-1 text-2xl font-bold text-sky-700 dark:text-sky-200">{{ attemptedCount }}
                            </div>
                        </div>
                        <div
                            class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-center dark:border-amber-700/60 dark:bg-amber-900/25">
                            <div class="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">
                                Unanswered
                            </div>
                            <div class="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-200">{{ unansweredCount }}
                            </div>
                        </div>
                        <div
                            class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-700 dark:bg-slate-800/60">
                            <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                Accuracy
                            </div>
                            <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ accuracyPercent }}%
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    class="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.38)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
                    <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Readiness Insight</h3>
                    <p class="mt-2 text-slate-600 dark:text-slate-300">
                        Your current readiness is
                        <span :class="readinessClass" class="font-semibold">{{ readinessLabel }}</span>.
                        {{ readinessText }}
                    </p>
                    <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">
                        You answered <span class="font-semibold text-emerald-600 dark:text-emerald-300">{{ correctCount }}</span>
                        out of <span class="font-semibold text-slate-700 dark:text-slate-100">{{ totalQuestions }}</span>
                        questions correctly.
                    </p>

                    <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div class="rounded-xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-700/60 dark:bg-rose-900/20">
                            <div class="text-sm font-semibold text-rose-700 dark:text-rose-200">Low Readiness</div>
                            <div class="mt-1 text-xs text-rose-700/90 dark:text-rose-200/90">Below 50%</div>
                        </div>
                        <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-700/60 dark:bg-amber-900/20">
                            <div class="text-sm font-semibold text-amber-700 dark:text-amber-200">Moderate Readiness</div>
                            <div class="mt-1 text-xs text-amber-700/90 dark:text-amber-200/90">50% to 69%</div>
                        </div>
                        <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-700/60 dark:bg-emerald-900/20">
                            <div class="text-sm font-semibold text-emerald-700 dark:text-emerald-200">High Readiness</div>
                            <div class="mt-1 text-xs text-emerald-700/90 dark:text-emerald-200/90">70% and above</div>
                        </div>
                    </div>
                </section>

                <div class="flex flex-wrap items-center justify-center gap-3 pb-2">
                    <CommonButton icon="pi pi-arrow-left" buttonText="Previous Tests"
                        :action="() => router.push('/teas/previous-attempts')" />
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
import { vConfetti } from '@neoconfetti/vue'
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
    axios.get(`/teas/performance-report/${attemptId}`)
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
    router.push(`/teas/exam/${attemptId}?mode=review`)
}

function resumeExam() {
    if (!report.value?.attempt_id) return
    router.push(`/teas/exam/${report.value.attempt_id}?resume=true`)
}

function openModal() {
    modalRef.value?.showModal()
}

const goToExam = (mode: 'tutor' | 'exam') => {
    if (!report.value) return
    router.push(`/teas/exam/${report.value.exam.id}?mode=${mode}`)
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

const totalQuestions = computed(() => {
    const fromExam = Number(report.value?.exam?.question_count ?? report.value?.exam?.questions_count ?? 0)
    if (fromExam > 0) return fromExam
    return Object.keys(parsedResults.value).length
})

const incorrectCount = computed(() => {
    const parsedIncorrect = Object.values(parsedResults.value).filter((r) => !r.correct).length
    if (parsedIncorrect > 0) return parsedIncorrect
    return Math.max(totalQuestions.value - correctCount.value, 0)
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

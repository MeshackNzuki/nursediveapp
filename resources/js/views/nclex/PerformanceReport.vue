<template>
    <div
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll rounded-2xl bg-slate-100 p-4 sm:p-6 dark:bg-slate-950">
        <div class="mx-auto max-w-6xl">
            <div class="mb-5 rounded-2xl">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Performance Report</h1>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <CommonButton icon2="pi pi-refresh" buttonText="Review Attempt" :action="reviewAnswers" />
                        <CommonButton :action="() => $router.push('/nclex/performance-analysis')"
                            button-text="Performance Analysis" icon2="" />
                    </div>
                </div>
            </div>

            <div v-if="!report"
                class="rounded-[2rem] bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                Loading report...
            </div>

            <div v-else
                class="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8 dark:bg-slate-900 dark:ring-slate-800">
                <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 class="text-xl font-sans font-semibold text-slate-800 dark:text-slate-100">
                            {{ normalizeText(report.exam.name) }}
                        </h2>
                        <p class="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
                            Completed on {{ formatDate(report.completed_at) }}.
                        </p>
                    </div>
                    <div :class="progressRingClass" class="radial-progress text-xs"
                        :style="`--value: ${scoreRounded}; --size: 1.5rem; --thickness: 2px`"
                        :aria-valuenow="scoreRounded" role="progressbar">{{ scoreRounded }}%</div>
                    <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="isCompleted
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'">
                        {{ isCompleted ? 'Completed' : 'Not Completed' }}
                    </span>
                </div>

                <section
                    class="overflow-hidden rounded-[1.75rem] bg-sky-50/70 ring-1 ring-sky-200 dark:bg-slate-950/40 dark:ring-sky-900/50">
                    <div
                        class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-900/20">
                        <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">
                            Attempt Performance Summary
                        </h3>
                        <div class="flex items-center gap-2">
                            <span
                                class="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-600 text-white shadow-sm shadow-cyan-200 dark:shadow-none">
                                <i class="pi pi-chart-pie text-sm"></i>
                            </span>
                            <div class="leading-tight">
                                <div class="text-sm font-bold text-slate-800 dark:text-slate-100">NurseDive</div>
                                <div
                                    class="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    NCLEX Readiness
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="grid gap-6 border-t border-slate-200/80 px-5 py-6 lg:grid-cols-[1.25fr_0.75fr_1fr] dark:border-slate-800">
                        <div>
                            <div class="space-y-3">
                                <div
                                    class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    <span class="h-4 w-4 rounded-sm bg-blue-600"></span>
                                    Passing Target:
                                    <span class="font-bold text-slate-900 dark:text-slate-100">{{ targetScore }}%</span>
                                </div>
                                <div
                                    class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    <span class="h-4 w-4 rounded-sm bg-emerald-500"></span>
                                    Your Score:
                                    <span class="font-bold text-slate-900 dark:text-slate-100">{{ scoreRounded
                                    }}%</span>
                                </div>
                            </div>

                            <div class="mt-7">
                                <div class="relative h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                    <div class="h-full rounded-full bg-emerald-500" :style="scoreBarStyle"></div>
                                    <span class="absolute top-0 h-full w-1 rounded-full bg-blue-600 shadow-sm"
                                        :style="targetMarkerStyle"></span>
                                </div>
                                <div
                                    class="mt-2 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <span>0%</span>
                                    <span>{{ scoreGapText }}</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col items-center justify-center text-center">
                            <div class="text-sm font-semibold text-slate-400 dark:text-slate-500">
                                Chances of Passing
                            </div>
                            <div class="mt-3 text-2xl font-bold" :class="passingChanceClass">
                                {{ passingChanceLabel }}
                            </div>
                            <div class="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                {{ gradeText }}
                            </div>
                        </div>

                        <div class="flex items-center justify-center">
                            <div class="w-full max-w-[260px]">
                                <div class="relative mx-auto h-28 w-56">
                                    <div
                                        class="absolute bottom-0 left-1/2 h-24 w-52 -translate-x-1/2 overflow-hidden rounded-t-full bg-slate-200 dark:bg-slate-800">
                                        <div class="grid h-full grid-cols-4 text-[10px] font-bold text-slate-500">
                                            <div
                                                class="flex items-center justify-center bg-rose-100 text-rose-500 dark:bg-rose-950 dark:text-rose-200">
                                                Low
                                            </div>
                                            <div
                                                class="flex items-center justify-center bg-orange-200 text-orange-600 dark:bg-orange-950 dark:text-orange-200">
                                                Borderline
                                            </div>
                                            <div
                                                class="flex items-center justify-center bg-indigo-100 text-indigo-500 dark:bg-indigo-950 dark:text-indigo-200">
                                                High
                                            </div>
                                            <div
                                                class="flex items-center justify-center bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-200">
                                                Very High
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        class="absolute bottom-3 left-1/2 h-16 w-1 origin-bottom rounded-full bg-slate-700 shadow-sm dark:bg-slate-200"
                                        :style="gaugeNeedleStyle"></span>
                                    <span
                                        class="absolute bottom-1 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-slate-700 ring-4 ring-white dark:bg-slate-200 dark:ring-slate-900"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div v-if="!isCompleted"
                    class="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-100 dark:bg-amber-900/25 dark:text-amber-100 dark:ring-amber-800/50">
                    This attempt is incomplete, so scores may be lower than your true performance.
                </div>

                <dl class="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div class="flex items-center gap-3">
                        <dt class="font-semibold text-slate-400 dark:text-slate-500">Test Id</dt>
                        <dd
                            class="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {{ report.attempt_id }}
                        </dd>
                    </div>
                    <div class="flex items-center gap-3">
                        <dt class="font-semibold text-slate-400 dark:text-slate-500">Q-Bank Mode</dt>
                        <dd
                            class="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            Assessment / {{ report.mode }}
                        </dd>
                    </div>
                    <div class="flex items-center gap-3">
                        <dt class="font-semibold text-slate-400 dark:text-slate-500">Questions</dt>
                        <dd
                            class="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {{ attemptedCount }} of {{ totalQuestions }}
                        </dd>
                    </div>
                    <div class="flex items-center gap-3">
                        <dt class="font-semibold text-slate-400 dark:text-slate-500">Time</dt>
                        <dd
                            class="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {{ secondsToHms(report.time_taken) }}
                        </dd>
                    </div>
                </dl>

                <section class="mt-8">
                    <div class="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h3 class="text-base font-semibold text-slate-950 dark:text-slate-100">Attempt Breakdown
                            </h3>
                            <p class="text-sm text-slate-500 dark:text-slate-400">
                                {{ readinessText }}
                            </p>
                        </div>
                        <div class="text-sm font-semibold" :class="readinessClass">
                            {{ correctCount }} correct / {{ totalQuestions }} total ({{ accuracyPercent }}% accuracy)
                        </div>
                    </div>

                    <div class="overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800">
                        <table class="w-full min-w-[720px] border-collapse text-left text-sm">
                            <thead class="bg-slate-700 text-white dark:bg-slate-800">
                                <tr>
                                    <th class="px-5 py-4 font-semibold">Result</th>
                                    <th class="px-5 py-4 font-semibold">Count</th>
                                    <th class="px-5 py-4 font-semibold">Share</th>
                                    <th class="px-5 py-4 font-semibold">Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in breakdownRows" :key="row.label" :class="index % 2 === 0
                                    ? 'bg-white dark:bg-slate-900'
                                    : 'bg-slate-50 dark:bg-slate-950/60'">
                                    <td class="px-5 py-4">
                                        <div class="flex items-center gap-3">
                                            <span
                                                class="flex h-6 w-6 items-center justify-center rounded-full text-white"
                                                :class="row.iconClass">
                                                <i :class="[row.icon, 'text-[11px]']"></i>
                                            </span>
                                            <span class="font-semibold text-slate-900 dark:text-slate-100">{{ row.label
                                            }}</span>
                                        </div>
                                    </td>
                                    <td class="px-5 py-4 font-medium text-slate-700 dark:text-slate-200">
                                        {{ row.value }} / {{ totalQuestions }}
                                    </td>
                                    <td class="px-5 py-4 font-medium text-slate-700 dark:text-slate-200">
                                        {{ row.share }}%
                                    </td>
                                    <td class="px-5 py-4 text-slate-500 dark:text-slate-400">
                                        {{ row.detail }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <CommonButton icon="pi pi-arrow-left" buttonText="Previous Tests"
                        :action="() => router.push('/nclex/previous-attempts')" />
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
    selected?: unknown
}

const route = useRoute()
const router = useRouter()

const modalRef = ref<HTMLDialogElement | null>(null)
const report = ref<any>(null)

const attemptId = route.path.split('/').pop()

onMounted(() => {
    axios.get(`/nclex/performance-report/${attemptId}`)
        .then((res) => {
            report.value = res.data.data
        })
        .catch((err) => {
            console.error('Error fetching performance report:', err)
            report.value = null
        })
})

const progressRingClass = computed(() => {
    if (score.value >= 70) return 'text-emerald-500'
    if (score.value >= 50) return 'text-amber-500'
    return 'text-rose-500'
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
    router.push(`/nclex/exam/${attemptId}?mode=review`)
}

function openModal() {
    modalRef.value?.showModal()
}

const goToExam = (mode: 'tutor' | 'exam') => {
    if (!report.value) return
    router.push(`/nclex/exam/${report.value.exam.id}?mode=${mode}`)
    modalRef.value?.close()
}

const parsedResults = computed<Record<string, ResultItem>>(() => {
    const rawResults = report.value?.results

    if (!rawResults) return {}

    if (typeof rawResults === 'object') {
        return rawResults as Record<string, ResultItem>
    }

    try {
        return JSON.parse(rawResults) as Record<string, ResultItem>
    } catch {
        return {}
    }
})

const correctCount = computed(() =>
    Object.values(parsedResults.value).filter((r) => r?.correct === true).length
)

const incorrectCount = computed(() => {
    return Object.values(parsedResults.value).filter((r) => r?.correct === false).length
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

const targetScore = 70

const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100)
const percentOfTotal = (value: number) => {
    if (totalQuestions.value <= 0) return 0
    return Math.round((value / totalQuestions.value) * 100)
}

const scorePercent = computed(() => clampPercent(scoreRounded.value))
const correctPercent = computed(() => percentOfTotal(correctCount.value))
const incorrectPercent = computed(() => percentOfTotal(incorrectCount.value))
const attemptedPercent = computed(() => percentOfTotal(attemptedCount.value))
const unansweredPercent = computed(() => percentOfTotal(unansweredCount.value))

const scoreBarStyle = computed(() => ({
    width: `${scorePercent.value}%`,
}))

const targetMarkerStyle = computed(() => ({
    left: `${targetScore}%`,
    transform: 'translateX(-50%)',
}))

const gaugeNeedleStyle = computed(() => {
    const rotation = Math.round((scorePercent.value / 100) * 150 - 75)
    return {
        transform: `translateX(-50%) rotate(${rotation}deg)`,
    }
})

const scoreGapText = computed(() => {
    const gap = scorePercent.value - targetScore
    if (gap === 0) return 'At target'
    if (gap > 0) return `${gap} pts above target`
    return `${Math.abs(gap)} pts below target`
})

const passingChanceLabel = computed(() => {
    if (score.value >= 85) return 'Very High'
    if (score.value >= 70) return 'High'
    if (score.value >= 50) return 'Borderline'
    return 'Low'
})

const passingChanceClass = computed(() => {
    if (score.value >= 85) return 'text-emerald-600 dark:text-emerald-300'
    if (score.value >= 70) return 'text-indigo-600 dark:text-indigo-300'
    if (score.value >= 50) return 'text-orange-500 dark:text-orange-300'
    return 'text-rose-600 dark:text-rose-300'
})

const breakdownRows = computed(() => [
    {
        label: 'Correct',
        value: correctCount.value,
        share: correctPercent.value,
        detail: 'Questions answered correctly.',
        icon: 'pi pi-check',
        iconClass: 'bg-emerald-500',
    },
    {
        label: 'Incorrect',
        value: incorrectCount.value,
        share: incorrectPercent.value,
        detail: 'Questions attempted but missed.',
        icon: 'pi pi-times',
        iconClass: 'bg-rose-500',
    },
    {
        label: 'Attempted',
        value: attemptedCount.value,
        share: attemptedPercent.value,
        detail: 'Questions with a submitted response.',
        icon: 'pi pi-pencil',
        iconClass: 'bg-sky-500',
    },
    {
        label: 'Unanswered',
        value: unansweredCount.value,
        share: unansweredPercent.value,
        detail: 'Questions left blank or not reached.',
        icon: 'pi pi-minus',
        iconClass: 'bg-amber-500',
    },
])

const gradeText = computed(() => {
    if (score.value >= 70) return 'Strong performance'
    if (score.value >= 50) return 'Making progress'
    return 'Needs reinforcement'
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

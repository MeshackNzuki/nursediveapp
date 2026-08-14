<template>
    <section
        class="rounded-3xl border border-sky-100 bg-light-blue-500 p-4 shadow-cusom dark:!border-sky-800 dark:!bg-sky-900/70">
        <header class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <div class="flex flex-wrap items-center gap-2">
                    <span
                        class="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white-500 text-sky-700 shadow-custom dark:bg-sky-950 dark:text-sky-200">
                        <i class="pi pi-chart-line text-sm"></i>
                    </span>
                    <div>
                        <h3 class="text-lg font-extrabold leading-tight text-slate-900 dark:text-white">
                            Pass Probability
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-300">
                            Recent-weighted readiness estimate for {{ productLabel }}.
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap gap-2">
                <span
                    class="rounded-full border border-sky-100 bg-white-500 px-3 py-1 text-xs font-bold text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100">
                    Pass mark {{ passMark }}%
                </span>
                <span class="rounded-full border px-3 py-1 text-xs font-bold" :class="readinessBadgeClass">
                    {{ readinessBand }}
                </span>
            </div>
        </header>

        <div v-if="isLoading" class="grid gap-4 lg:grid-cols-[300px,1fr] lg:items-center">
            <div class="h-56 animate-pulse rounded-3xl bg-white/80 dark:bg-sky-950/60"></div>
            <div class="space-y-3">
                <div class="h-24 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60"></div>
                <div class="grid gap-3 sm:grid-cols-3">
                    <div v-for="item in 3" :key="item"
                        class="h-20 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60"></div>
                </div>
            </div>
        </div>

        <div v-else-if="!hasScores"
            class="rounded-3xl border border-dashed border-sky-200 bg-white-500 p-5 text-center shadow-custom dark:border-sky-800 dark:bg-sky-950/60">
            <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-light-blue-500 text-sky-700 dark:bg-sky-900 dark:text-sky-200">
                <i class="pi pi-play text-base"></i>
            </div>
            <h4 class="mt-3 text-base font-extrabold text-slate-900 dark:text-white">No scored attempts yet</h4>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                Complete a few timed or tutor-mode attempts and this panel will estimate pass probability,
                consistency, and next steps.
            </p>
            <p v-if="errorText" class="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-300">
                {{ errorText }}
            </p>
        </div>

        <div v-else class="grid gap-4 lg:grid-cols-[300px,1fr] lg:items-center">
            <div
                class="rounded-3xl border border-sky-100 bg-white-500 p-4 shadow-custom dark:border-sky-800 dark:bg-sky-950/60">
                <Gaunge label="Pass chance" :level="probability" :pass-mark="passMark" />
                <div class="mt-3 rounded-2xl bg-light-blue-500 p-3 text-center dark:bg-sky-900/70">
                    <p class="text-sm font-bold text-slate-900 dark:text-white">{{ readinessCopy }}</p>
                </div>
            </div>

            <div class="space-y-3">
                <div
                    class="rounded-2xl border border-sky-100 bg-white-500 p-4 shadow-custom dark:border-sky-800 dark:bg-sky-950/60">
                    <div class="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span class="font-bold text-slate-800 dark:text-slate-100">Current pass chance</span>
                        <span class="inline-flex items-center gap-1 text-lg font-extrabold" :class="probabilityColor">
                            <i :class="['pi text-sm', trendIcon]"></i>
                            {{ probability }}%
                        </span>
                    </div>
                    <div
                        class="h-3 overflow-hidden rounded-full bg-light-blue-500 ring-1 ring-sky-100 dark:bg-slate-800 dark:ring-slate-700">
                        <div class="h-full rounded-full transition-all duration-700" :class="probabilityBarClass"
                            :style="{ width: `${probability}%` }"></div>
                    </div>
                    <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span class="font-semibold text-slate-500 dark:text-slate-300">
                            Based on {{ attemptsCount }} scored {{ attemptsCount === 1 ? 'attempt' : 'attempts' }}
                        </span>
                        <span class="font-bold" :class="trendClass">{{ trendText }}</span>
                    </div>
                </div>

                <div class="grid gap-3 sm:grid-cols-3">
                    <div v-for="metric in metrics" :key="metric.label"
                        class="rounded-2xl border border-sky-100 bg-white-500 p-3 shadow-custom dark:border-sky-800 dark:bg-sky-950/60">
                        <div class="flex items-center justify-between gap-2">
                            <span
                                class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
                                {{ metric.label }}
                            </span>
                            <i :class="[metric.icon, metric.color, 'text-sm']"></i>
                        </div>
                        <p class="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">{{ metric.value }}</p>
                        <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">{{ metric.detail }}</p>
                    </div>
                </div>

                <div
                    class="rounded-2xl border border-sky-100 bg-light-blue-500 p-4 dark:border-sky-800 dark:bg-sky-950/60">
                    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div class="min-w-0">
                            <p class="text-xs font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-200">
                                Next best move
                            </p>
                            <p class="mt-1 text-xs  text-slate-800 dark:text-slate-100">
                                {{ nextGoal }}
                            </p>
                        </div>
                        <div class="flex shrink-0 flex-wrap gap-1.5">
                            <span v-for="attempt in recentScoreChips" :key="attempt.id"
                                class="rounded-full border px-2.5 py-1 text-xs font-bold"
                                :class="scoreChipClass(attempt.score)">
                                {{ attempt.score }}%
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    class="rounded-2xl border border-sky-100 bg-white-500 px-3 py-2 text-xs shadow-custom dark:border-sky-800 dark:bg-sky-950/60">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-slate-500 dark:text-slate-300">
                            Average:
                            <strong class="text-slate-800 dark:text-slate-100">{{ averageScore }}%</strong>
                        </span>
                        <span class="text-slate-500 dark:text-slate-300">
                            Recent:
                            <strong class="text-slate-800 dark:text-slate-100">{{ recentAverage }}%</strong>
                        </span>
                        <span class="text-slate-500 dark:text-slate-300">
                            Range:
                            <strong class="text-slate-800 dark:text-slate-100">{{ lowestScore }} - {{ highestScore
                                }}%</strong>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import Gaunge from './Gaunge.vue'

type Attempt = {
    id?: number | string
    score?: number | string | null
    completed?: boolean | number | string | null
    completed_at?: string | null
    created_at?: string | null
    updated_at?: string | null
}

type ScoredAttempt = {
    id: string
    score: number
    completed: boolean
    timestamp: number
}

const props = defineProps<{
    product: string
    passMark: number
}>()

const attempts = ref<Attempt[]>([])
const isLoading = ref(true)
const errorText = ref('')

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))

const toScore = (value: unknown) => {
    const score = Number(value)
    if (!Number.isFinite(score)) return null
    return clamp(Math.round(score))
}

const attemptTime = (attempt: Attempt) => {
    const raw = attempt.completed_at || attempt.updated_at || attempt.created_at
    if (!raw) return 0
    const timestamp = new Date(raw).getTime()
    return Number.isFinite(timestamp) ? timestamp : 0
}

const isCompleted = (value: unknown) => value === true || value === 1 || value === '1'

const fetchAttempts = async () => {
    isLoading.value = true
    errorText.value = ''

    try {
        const response = await axios.get(`${props.product}/previous-attempts`, { showLoader: false })
        attempts.value = Array.isArray(response.data?.data) ? response.data.data : []
    } catch {
        attempts.value = []
        errorText.value = 'Unable to load attempts right now.'
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchAttempts)

watch(() => props.product, fetchAttempts)

const productLabel = computed(() => {
    const labels: Record<string, string> = {
        teas: 'TEAS',
        nursing: 'Nursing',
        nclex: 'NCLEX',
    }

    return labels[props.product] || props.product.toUpperCase()
})

const normalizedAttempts = computed<ScoredAttempt[]>(() =>
    attempts.value
        .map((attempt, index) => {
            const score = toScore(attempt.score)
            if (score === null) return null

            return {
                id: String(attempt.id ?? `${index}-${score}`),
                score,
                completed: isCompleted(attempt.completed),
                timestamp: attemptTime(attempt),
            }
        })
        .filter((attempt): attempt is ScoredAttempt => !!attempt)
        .sort((a, b) => b.timestamp - a.timestamp)
)

const completedAttempts = computed(() => normalizedAttempts.value.filter((attempt) => attempt.completed))

const analyzedAttempts = computed(() =>
    completedAttempts.value.length ? completedAttempts.value : normalizedAttempts.value
)

const hasScores = computed(() => analyzedAttempts.value.length > 0)
const attemptsCount = computed(() => analyzedAttempts.value.length)
const recentAttempts = computed(() => analyzedAttempts.value.slice(0, 10))

const average = (values: number[]) => {
    if (!values.length) return 0
    return values.reduce((sum, value) => sum + value, 0) / values.length
}

const analyzedScores = computed(() => analyzedAttempts.value.map((attempt) => attempt.score))
const recentScores = computed(() => recentAttempts.value.map((attempt) => attempt.score))

const averageScore = computed(() => Math.round(average(analyzedScores.value)))
const recentAverage = computed(() => Math.round(average(recentScores.value)))

const highestScore = computed(() => analyzedScores.value.length ? Math.max(...analyzedScores.value) : 0)
const lowestScore = computed(() => analyzedScores.value.length ? Math.min(...analyzedScores.value) : 0)
const latestScore = computed(() => recentAttempts.value[0]?.score ?? 0)

const trendDelta = computed(() => {
    const recent = recentScores.value.slice(0, 3)
    const previous = recentScores.value.slice(3, 6)

    if (recent.length < 2 || previous.length < 2) return 0
    return Math.round(average(recent) - average(previous))
})

const confidenceScore = computed(() => {
    const scores = recentScores.value
    if (!scores.length) return 0

    const avg = average(scores)
    const variance = average(scores.map((score) => Math.pow(score - avg, 2)))
    const stddev = Math.sqrt(variance)
    const sampleStrength = Math.min(scores.length / 6, 1) * 35
    const confidence = 45 + sampleStrength - stddev * 1.25

    return Math.round(clamp(confidence, 25, 96))
})

const readinessScore = computed(() => {
    if (!hasScores.value) return 0

    const scoreSignal = recentAverage.value * 0.65 + averageScore.value * 0.35
    const trendAdjustment = clamp(trendDelta.value, -10, 10) * 0.8
    const confidenceAdjustment = (confidenceScore.value - 70) * 0.12

    return clamp(scoreSignal + trendAdjustment + confidenceAdjustment)
})

const probability = computed(() => {
    if (!hasScores.value) return 0

    const p = 1 / (1 + Math.exp(-(readinessScore.value - props.passMark) / 6))
    if (Number.isNaN(p)) return 0
    return Math.round(p * 100)
})

const adjustedReadiness = computed(() =>
    Math.round(clamp(probability.value * 0.75 + confidenceScore.value * 0.25))
)

const passGap = computed(() => Math.round(recentAverage.value - props.passMark))

const readinessBand = computed(() => {
    if (probability.value < 45) return 'Needs reps'
    if (probability.value < 70) return 'Building'
    if (probability.value < 86) return 'On track'
    return 'Exam ready'
})

const readinessCopy = computed(() => {
    if (probability.value >= 86) return 'Strong readiness. Protect your pace and review missed rationales.'
    if (probability.value >= 70) return 'You are close. A little more consistency should move the needle.'
    if (passGap.value < -10) return 'Focus on content gaps before stacking longer timed exams.'
    return 'Keep practicing. The model needs stronger recent scores to lift confidence.'
})

const nextGoal = computed(() => {
    if (attemptsCount.value < 3) return 'Complete at least 3 scored attempts to unlock a steadier estimate.'
    if (passGap.value < 0) return `Raise your recent average by ${Math.abs(passGap.value)} points to clear the pass mark.`
    if (confidenceScore.value < 70) return 'Repeat 2 mixed-topic attempts to improve consistency across sessions.'
    if (trendDelta.value < -4) return 'Retake a weak area today; your recent trend is slipping.'
    return 'Take one timed mixed set, then review rationales while the misses are fresh.'
})

const trendIcon = computed(() => {
    if (trendDelta.value < -3) return 'pi-arrow-down'
    if (trendDelta.value > 3) return 'pi-arrow-up'
    return 'pi-minus'
})

const trendText = computed(() => {
    if (trendDelta.value > 0) return `Trend +${trendDelta.value} pts`
    if (trendDelta.value < 0) return `Trend ${trendDelta.value} pts`
    return 'Trend steady'
})

const trendClass = computed(() => {
    if (trendDelta.value < -3) return 'text-rose-600 dark:text-rose-300'
    if (trendDelta.value > 3) return 'text-emerald-600 dark:text-emerald-300'
    return 'text-slate-500 dark:text-slate-300'
})

const probabilityColor = computed(() => {
    if (probability.value < 45) return 'text-rose-600 dark:text-rose-300'
    if (probability.value < 70) return 'text-amber-600 dark:text-amber-300'
    if (probability.value < 86) return 'text-sky-700 dark:text-sky-200'
    return 'text-emerald-600 dark:text-emerald-300'
})

const probabilityBarClass = computed(() => {
    if (probability.value < 45) return 'bg-rose-500'
    if (probability.value < 70) return 'bg-amber-500'
    if (probability.value < 86) return 'bg-sky-500'
    return 'bg-emerald-500'
})

const readinessBadgeClass = computed(() => {
    if (probability.value < 45) return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200'
    if (probability.value < 70) return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
    if (probability.value < 86) return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-200'
    return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
})

const metrics = computed(() => [
    {
        label: 'Recent avg',
        value: `${recentAverage.value}%`,
        detail: `${passGap.value >= 0 ? '+' : ''}${passGap.value} pts vs pass mark`,
        icon: 'pi pi-bullseye',
        color: passGap.value >= 0 ? 'text-emerald-600' : 'text-amber-600',
    },
    {
        label: 'Consistency',
        value: `${confidenceScore.value}%`,
        detail: 'Higher means less score swing lately',
        icon: 'pi pi-wave-pulse',
        color: confidenceScore.value >= 70 ? 'text-emerald-600' : 'text-amber-600',
    },
    {
        label: 'Last score',
        value: `${latestScore.value}%`,
        detail: `${adjustedReadiness.value}% adjusted readiness`,
        icon: 'pi pi-history',
        color: latestScore.value >= props.passMark ? 'text-emerald-600' : 'text-sky-600',
    },
])

const recentScoreChips = computed(() => recentAttempts.value.slice(0, 5))

const scoreChipClass = (score: number) => {
    if (score >= props.passMark + 10) return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
    if (score >= props.passMark) return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-200'
    if (score >= props.passMark - 10) return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
    return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200'
}
</script>

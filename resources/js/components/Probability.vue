<template>
    <section class="dash-card h-full p-4">
        <div class="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-50"
            aria-hidden="true"></div>

        <header class="relative mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-start gap-3">
                <span class="dash-icon-tile theme-icon h-10 w-10 rounded-2xl">
                    <i class="pi pi-chart-line"></i>
                </span>
                <div>
                    <h3 class="dash-title leading-tight">Pass Probability</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-300">
                        Recent-weighted readiness estimate for {{ productLabel }}.
                    </p>
                </div>
            </div>

            <div class="flex flex-wrap gap-2">
                <span class="analysis-pill theme-soft border">Pass mark {{ passMark }}%</span>
                <span class="analysis-pill border" :class="readinessBadgeClass">{{ readinessBand }}</span>
            </div>
        </header>

        <!-- Loading -->
        <div v-if="isLoading" class="relative grid gap-4 lg:grid-cols-[300px,1fr] lg:items-start">
            <div class="h-64 animate-pulse rounded-3xl bg-white/80 dark:bg-sky-950/60"></div>
            <div class="space-y-3">
                <div class="h-28 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60"></div>
                <div class="grid gap-3 sm:grid-cols-3">
                    <div v-for="item in 3" :key="item" class="h-24 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60"></div>
                </div>
                <div class="h-24 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60"></div>
            </div>
        </div>

        <!-- Empty -->
        <div v-else-if="!hasScores" class="dash-card-white relative rounded-3xl border-dashed p-5 text-center">
            <div class="dash-icon-tile theme-icon mx-auto h-12 w-12 rounded-2xl">
                <i class="pi pi-play text-base"></i>
            </div>
            <h4 class="mt-3 text-base font-extrabold text-slate-900 dark:text-white">No scored attempts yet</h4>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                Complete a few timed or tutor-mode attempts and this panel will estimate pass probability,
                show your trajectory, and point at the section holding you back.
            </p>
            <p v-if="errorText" class="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-300">{{ errorText }}</p>
        </div>

        <!-- Loaded -->
        <div v-else class="relative grid gap-4 lg:grid-cols-[300px,1fr] lg:items-start">
            <!-- Gauge column -->
            <div class="dash-card-white rounded-3xl">
                <Gaunge label="Pass chance" :level="probability" :pass-mark="passMark" />

                <div class="mt-3 flex items-center justify-center gap-2 text-xs">
                    <span class="font-semibold text-slate-500 dark:text-slate-300">Likely range</span>
                    <span class="analysis-pill theme-soft border tabular-nums">{{ rangeLow }}–{{ rangeHigh }}%</span>
                </div>
                <div class="dash-progress relative mt-2 h-1.5 bg-light-blue-500">
                    <div class="absolute inset-y-0 rounded-full theme-bar opacity-80"
                        :style="{ left: `${rangeLow}%`, width: `${Math.max(2, rangeHigh - rangeLow)}%` }"></div>
                    <div class="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-slate-700 dark:bg-slate-200"
                        :style="{ left: `${passMark}%` }" title="Pass mark"></div>
                </div>
                <p class="mt-1.5 text-center text-[11px] text-slate-500 dark:text-slate-300">
                    Narrows as you log more attempts ({{ attemptsCount }} so far).
                </p>

                <div class="dash-tile-soft mt-3 text-center">
                    <p class="text-sm font-bold text-slate-900 dark:text-white">{{ readinessCopy }}</p>
                </div>
            </div>

            <!-- Detail column -->
            <div class="space-y-3">
                <!-- Trajectory -->
                <div class="dash-card-white">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p class="dash-eyebrow theme-text">Trajectory</p>
                            <p class="mt-1 flex items-baseline gap-2">
                                <span class="text-2xl font-extrabold tabular-nums" :class="probabilityColor">{{ probability }}%</span>
                                <span class="inline-flex items-center gap-1 text-xs font-bold" :class="deltaClass">
                                    <i :class="['pi text-[10px]', deltaIcon]"></i>
                                    {{ deltaText }}
                                </span>
                            </p>
                        </div>
                        <p v-if="weakestSection" class="max-w-[220px] text-right text-xs leading-5 text-slate-600 dark:text-slate-300">
                            <i class="pi pi-flag-fill mr-1 text-[10px] text-rose-500"></i>
                            <strong class="text-slate-900 dark:text-white">{{ weakestSection.label }}</strong>
                            is dragging you down: {{ weakestSection.average }}% avg,
                            {{ weakestSection.gap }} pts under the pass mark.
                        </p>
                    </div>

                    <div class="mt-3 h-16 w-full">
                        <svg viewBox="0 0 200 60" preserveAspectRatio="none" class="h-full w-full overflow-visible" aria-hidden="true">
                            <defs>
                                <linearGradient :id="sparkFillId" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="var(--theme-accent)" stop-opacity="0.35" />
                                    <stop offset="100%" stop-color="var(--theme-accent)" stop-opacity="0" />
                                </linearGradient>
                            </defs>
                            <line x1="0" :y1="sparkY(passMark)" x2="200" :y2="sparkY(passMark)" stroke="currentColor"
                                stroke-opacity="0.35" stroke-width="1" stroke-dasharray="3 3" class="text-slate-500" />
                            <path :d="sparkArea" :fill="`url(#${sparkFillId})`" />
                            <path :d="sparkLine" fill="none" stroke="var(--theme-accent-2)" stroke-width="2.2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <circle v-for="(pt, i) in sparkPoints" :key="i" :cx="pt.x" :cy="pt.y" :r="i === sparkPoints.length - 1 ? 3.5 : 2"
                                fill="white" stroke="var(--theme-accent-2)" stroke-width="1.8" />
                        </svg>
                    </div>
                    <div class="mt-1 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                        <span>{{ sparkPoints.length }} most recent attempts</span>
                        <span>dashed line = pass mark</span>
                    </div>
                </div>

                <!-- Metrics -->
                <div class="grid gap-3 sm:grid-cols-3">
                    <div v-for="metric in metrics" :key="metric.label" class="dash-card-white dash-hover-lift p-3">
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
                                {{ metric.label }}
                            </span>
                            <i :class="[metric.icon, metric.color, 'text-sm']"></i>
                        </div>
                        <p class="mt-2 text-xl font-extrabold tabular-nums text-slate-900 dark:text-white">{{ metric.value }}</p>
                        <p class="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-300">{{ metric.detail }}</p>
                    </div>
                </div>

                <!-- Next move + what-if -->
                <div class="dash-tile-soft">
                    <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div class="min-w-0 flex-1">
                            <p class="dash-eyebrow theme-text">Next best move</p>
                            <p class="mt-1 text-xs leading-5 text-slate-800 dark:text-slate-100">{{ nextGoal }}</p>
                            <p v-if="projection" class="mt-2 inline-flex items-center gap-1.5 rounded-full border theme-soft px-2.5 py-1 text-[11px] font-bold">
                                <i class="pi pi-sparkles text-[10px]"></i>
                                Two more attempts at {{ projection.target }}% would lift you to about {{ projection.probability }}%.
                            </p>
                        </div>
                        <div class="flex shrink-0 flex-wrap gap-1.5 md:max-w-[200px] md:justify-end">
                            <span v-for="attempt in recentScoreChips" :key="attempt.id"
                                class="inline-flex flex-col items-center rounded-xl border px-2 py-1 text-[11px] font-bold leading-tight"
                                :class="scoreChipClass(attempt.score)" :title="attempt.sectionLabel || ''">
                                <span class="tabular-nums">{{ attempt.score }}%</span>
                                <span class="text-[9px] font-semibold opacity-70">{{ attempt.when }}</span>
                            </span>
                        </div>
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
import { average, clamp, estimateReadiness, likelyRange, readinessTrajectory, relativeTime } from '../utils/readiness'

type Attempt = {
    id?: number | string
    score?: number | string | null
    completed?: boolean | number | string | null
    completed_at?: string | null
    created_at?: string | null
    updated_at?: string | null
    [key: string]: unknown
}

type ScoredAttempt = {
    id: string
    score: number
    completed: boolean
    timestamp: number
    sectionId: string | null
}

const props = withDefaults(
    defineProps<{
        product: string
        passMark: number
        /** Attempt field that identifies the section (e.g. category_id, question_subject_id) */
        sectionField?: string
        /** Section id -> display label, used for the "weakest section" callout */
        sectionLabels?: Record<string, string>
    }>(),
    {
        sectionField: 'category_id',
        sectionLabels: () => ({}),
    },
)

const attempts = ref<Attempt[]>([])
const isLoading = ref(true)
const errorText = ref('')
const sparkFillId = `spark-fill-${Math.random().toString(36).slice(2, 9)}`

const toScore = (value: unknown) => {
    const score = Number(value)
    if (!Number.isFinite(score)) return null
    return clamp(Math.round(score))
}

const attemptTime = (attempt: Attempt) => {
    const raw = attempt.completed_at || attempt.updated_at || attempt.created_at
    if (!raw) return 0
    const timestamp = new Date(String(raw)).getTime()
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
    const labels: Record<string, string> = { teas: 'TEAS', nursing: 'Nursing', nclex: 'NCLEX' }
    return labels[props.product] || props.product.toUpperCase()
})

const estimate = estimateReadiness

/* ------------------------------------------------------------------ */
const normalizedAttempts = computed<ScoredAttempt[]>(() =>
    attempts.value
        .map((attempt, index) => {
            const score = toScore(attempt.score)
            if (score === null) return null
            const rawSection = attempt[props.sectionField]
            return {
                id: String(attempt.id ?? `${index}-${score}`),
                score,
                completed: isCompleted(attempt.completed),
                timestamp: attemptTime(attempt),
                sectionId: rawSection === null || rawSection === undefined || rawSection === '' ? null : String(rawSection),
            }
        })
        .filter((attempt): attempt is ScoredAttempt => !!attempt)
        .sort((a, b) => b.timestamp - a.timestamp),
)

const completedAttempts = computed(() => normalizedAttempts.value.filter((a) => a.completed))
const analyzedAttempts = computed(() => (completedAttempts.value.length ? completedAttempts.value : normalizedAttempts.value))
const analyzedScores = computed(() => analyzedAttempts.value.map((a) => a.score))

const hasScores = computed(() => analyzedAttempts.value.length > 0)
const attemptsCount = computed(() => analyzedAttempts.value.length)
const recentAttempts = computed(() => analyzedAttempts.value.slice(0, 10))

const current = computed(() => estimate(analyzedScores.value, props.passMark))
const probability = computed(() => current.value.probability)
const confidenceScore = computed(() => current.value.confidence)
const recentAverage = computed(() => current.value.recentAverage)
const averageScore = computed(() => current.value.averageScore)
const trendDelta = computed(() => current.value.trendDelta)

const highestScore = computed(() => (analyzedScores.value.length ? Math.max(...analyzedScores.value) : 0))
const lowestScore = computed(() => (analyzedScores.value.length ? Math.min(...analyzedScores.value) : 0))
const latestScore = computed(() => recentAttempts.value[0]?.score ?? 0)
const passGap = computed(() => Math.round(recentAverage.value - props.passMark))

/* Likely range: wider when confidence is low, narrows with more consistent attempts */
const rangeLow = computed(() => likelyRange(probability.value, confidenceScore.value).low)
const rangeHigh = computed(() => likelyRange(probability.value, confidenceScore.value).high)

/* Trajectory: replay the model over the last 8 attempts (chronological) */
const trajectory = computed(() => readinessTrajectory(analyzedScores.value, props.passMark, 8))

const sparkY = (value: number) => 56 - (clamp(value) / 100) * 52
const sparkPoints = computed(() => {
    const pts = trajectory.value
    if (pts.length === 1) return [{ x: 0, y: sparkY(pts[0]) }, { x: 200, y: sparkY(pts[0]) }]
    return pts.map((v, i) => ({ x: (i / (pts.length - 1)) * 200, y: sparkY(v) }))
})
const sparkLine = computed(() => sparkPoints.value.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' '))
const sparkArea = computed(() => `${sparkLine.value} L 200 60 L 0 60 Z`)

const probabilityDelta = computed(() => {
    const pts = trajectory.value
    if (pts.length < 2) return null
    const back = Math.min(3, pts.length - 1)
    return pts[pts.length - 1] - pts[pts.length - 1 - back]
})
const deltaText = computed(() => {
    if (probabilityDelta.value === null) return 'first reading'
    if (probabilityDelta.value === 0) return 'holding steady'
    return `${probabilityDelta.value > 0 ? '+' : ''}${probabilityDelta.value} pts over your last ${Math.min(3, trajectory.value.length - 1)} attempts`
})
const deltaIcon = computed(() => (probabilityDelta.value === null || probabilityDelta.value === 0 ? 'pi-minus' : probabilityDelta.value > 0 ? 'pi-arrow-up-right' : 'pi-arrow-down-right'))
const deltaClass = computed(() => {
    if (probabilityDelta.value === null || probabilityDelta.value === 0) return 'text-slate-500 dark:text-slate-300'
    return probabilityDelta.value > 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
})

/* Weakest section */
const weakestSection = computed(() => {
    const groups = new Map<string, number[]>()
    analyzedAttempts.value.forEach((a) => {
        if (!a.sectionId) return
        if (!groups.has(a.sectionId)) groups.set(a.sectionId, [])
        groups.get(a.sectionId)!.push(a.score)
    })
    if (groups.size < 2) return null
    let worst: { id: string; average: number } | null = null
    groups.forEach((scores, id) => {
        const avg = Math.round(average(scores))
        if (!worst || avg < worst.average) worst = { id, average: avg }
    })
    if (!worst) return null
    const w = worst as { id: string; average: number }
    const gap = props.passMark - w.average
    if (gap <= 0) return null
    return { id: w.id, label: props.sectionLabels[w.id] || `Section ${w.id}`, average: w.average, gap }
})

/* What-if projection */
const projection = computed(() => {
    if (!hasScores.value || probability.value >= 90) return null
    const target = clamp(Math.max(props.passMark + 5, recentAverage.value + 8), 0, 100)
    const simulated = [target, target, ...analyzedScores.value]
    const next = estimate(simulated, props.passMark).probability
    if (next <= probability.value) return null
    return { target, probability: next }
})

/* Copy */
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
    if (weakestSection.value) return `Spend your next session on ${weakestSection.value.label}. Lifting it closes most of the gap.`
    if (passGap.value < 0) return `Raise your recent average by ${Math.abs(passGap.value)} points to clear the pass mark.`
    if (confidenceScore.value < 70) return 'Repeat 2 mixed-topic attempts to improve consistency across sessions.'
    if (trendDelta.value < -4) return 'Retake a weak area today; your recent trend is slipping.'
    return 'Take one timed mixed set, then review rationales while the misses are fresh.'
})

const probabilityColor = computed(() => {
    if (probability.value < 45) return 'text-rose-600 dark:text-rose-300'
    if (probability.value < 70) return 'text-amber-600 dark:text-amber-300'
    if (probability.value < 86) return 'theme-text'
    return 'text-emerald-600 dark:text-emerald-300'
})

const readinessBadgeClass = computed(() => {
    if (probability.value < 45) return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200'
    if (probability.value < 70) return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
    if (probability.value < 86) return 'theme-soft'
    return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
})

const metrics = computed(() => [
    {
        label: 'Recent avg',
        value: `${recentAverage.value}%`,
        detail: `${passGap.value >= 0 ? '+' : ''}${passGap.value} pts vs pass mark · all-time ${averageScore.value}%`,
        icon: 'pi pi-bullseye',
        color: passGap.value >= 0 ? 'text-emerald-600' : 'text-amber-600',
    },
    {
        label: 'Consistency',
        value: `${confidenceScore.value}%`,
        detail: `Scores range ${lowestScore.value}–${highestScore.value}%`,
        icon: 'pi pi-wave-pulse',
        color: confidenceScore.value >= 70 ? 'text-emerald-600' : 'text-amber-600',
    },
    {
        label: 'Last score',
        value: `${latestScore.value}%`,
        detail: trendDelta.value === 0 ? 'Trend steady' : `Trend ${trendDelta.value > 0 ? '+' : ''}${trendDelta.value} pts`,
        icon: 'pi pi-history',
        color: latestScore.value >= props.passMark ? 'text-emerald-600' : 'theme-text',
    },
])

const recentScoreChips = computed(() =>
    recentAttempts.value.slice(0, 5).map((a) => ({
        id: a.id,
        score: a.score,
        when: relativeTime(a.timestamp),
        sectionLabel: a.sectionId ? props.sectionLabels[a.sectionId] || '' : '',
    })),
)

const scoreChipClass = (score: number) => {
    if (score >= props.passMark + 10) return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
    if (score >= props.passMark) return 'theme-soft'
    if (score >= props.passMark - 10) return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
    return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200'
}
</script>

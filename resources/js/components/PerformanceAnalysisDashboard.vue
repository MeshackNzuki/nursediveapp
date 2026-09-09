<template>
    <div class="dash-shell">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <!-- ================= HEADER ================= -->
            <header class="ui-rise flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div class="min-w-0">
                    <p class="dash-eyebrow theme-text inline-flex items-center gap-2">
                        <span class="relative flex h-2 w-2">
                            <span class="theme-dot absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"></span>
                            <span class="theme-dot relative inline-flex h-2 w-2 rounded-full"></span>
                        </span>
                        {{ productLabel }} Analytics
                    </p>
                    <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                        Performance Analysis
                    </h1>
                    <p class="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                        Track readiness, consistency, and score movement across your {{ productLabel }} attempts.
                    </p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <RouterLink :to="reportsRoute" class="dash-btn-ghost">
                        <i class="pi pi-history"></i>
                        All attempts
                    </RouterLink>
                    <RouterLink :to="testsRoute" class="dash-btn theme-surface theme-shadow">
                        Take a test
                        <i class="pi pi-arrow-right text-[10px]"></i>
                    </RouterLink>
                </div>
            </header>

            <GuestSavePrompt v-if="isGuest" :product="guestPromptProduct" :product-label="productLabel" :redirect="reportsRoute" />

            <template v-else>
                <div v-if="loading" class="grid gap-4 xl:grid-cols-12">
                    <div v-for="n in 4" :key="n" class="h-20 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60 xl:col-span-3"></div>
                    <div class="h-80 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60 xl:col-span-5"></div>
                    <div class="h-80 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60 xl:col-span-7"></div>
                </div>

                <div v-else-if="fetchError" class="analysis-state-error">{{ fetchError }}</div>

                <section v-else-if="!hasAttempts" class="ui-rise dash-card p-8 text-center">
                    <div class="dash-icon-tile theme-icon mx-auto h-12 w-12 rounded-2xl">
                        <i class="pi pi-chart-line text-lg"></i>
                    </div>
                    <h2 class="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">No attempts recorded yet</h2>
                    <p class="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-300">
                        Complete a {{ productLabel }} practice test to unlock readiness scoring, trends, and recommendations.
                    </p>
                    <RouterLink :to="testsRoute" class="dash-btn theme-surface theme-shadow mt-5 px-5 py-2.5">
                        Start {{ productLabel }} test <i class="pi pi-arrow-right text-[10px]"></i>
                    </RouterLink>
                </section>

                <template v-else>
                    <!-- ================= STAT STRIP ================= -->
                    <section class="grid grid-cols-2 gap-3 xl:grid-cols-4">
                        <div v-for="(stat, index) in statStrip" :key="stat.label"
                            class="ui-rise dash-card-white dash-hover-lift flex items-center gap-3 p-3"
                            :style="{ animationDelay: `${60 + index * 50}ms` }">
                            <span class="dash-icon-tile theme-icon h-10 w-10 shrink-0">
                                <i :class="stat.icon"></i>
                            </span>
                            <div class="min-w-0">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ stat.label }}</p>
                                <p class="text-xl font-extrabold leading-tight tabular-nums" :class="stat.valueClass">{{ stat.value }}</p>
                                <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">{{ stat.detail }}</p>
                            </div>
                        </div>
                    </section>

                    <!-- ================= READINESS + TREND ================= -->
                    <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                        <article class="ui-rise dash-card xl:col-span-5" style="animation-delay: 160ms">
                            <div class="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-50" aria-hidden="true"></div>
                            <div class="relative flex items-start justify-between gap-3">
                                <div>
                                    <h2 class="dash-title">Readiness Estimate</h2>
                                    <p class="analysis-muted mt-1">Recent-weighted, with trend and consistency.</p>
                                </div>
                                <span class="analysis-pill border" :class="bandPillClass">{{ band }}</span>
                            </div>

                            <div class="dash-card-white relative mt-4 rounded-3xl">
                                <Gaunge label="Pass probability" :level="estimate.probability" :pass-mark="passMark" />
                                <div class="mt-3 flex items-center justify-center gap-2 text-xs">
                                    <span class="font-semibold text-slate-500 dark:text-slate-300">Likely range</span>
                                    <span class="analysis-pill theme-soft border tabular-nums">{{ range.low }}–{{ range.high }}%</span>
                                </div>
                                <div class="dash-progress relative mt-2 h-1.5 bg-light-blue-500">
                                    <div class="absolute inset-y-0 rounded-full theme-bar opacity-80"
                                        :style="{ left: `${range.low}%`, width: `${Math.max(2, range.high - range.low)}%` }"></div>
                                    <div class="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-slate-700 dark:bg-slate-200"
                                        :style="{ left: `${passMark}%` }"></div>
                                </div>
                            </div>

                            <dl class="relative mt-3 space-y-2">
                                <div v-for="metric in readinessMetrics" :key="metric.label" class="dash-tile flex items-center justify-between gap-3 px-3 py-2.5">
                                    <dt class="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        <span class="dash-icon-tile theme-icon h-7 w-7 text-xs"><i :class="metric.icon"></i></span>
                                        {{ metric.label }}
                                    </dt>
                                    <dd class="text-right">
                                        <span class="text-sm font-extrabold tabular-nums" :class="metric.valueClass">{{ metric.value }}</span>
                                        <span class="block text-[11px] text-slate-500 dark:text-slate-400">{{ metric.detail }}</span>
                                    </dd>
                                </div>
                            </dl>

                            <p v-if="projection" class="relative mt-3 inline-flex items-center gap-1.5 rounded-full border theme-soft px-3 py-1.5 text-[11px] font-bold">
                                <i class="pi pi-sparkles text-[10px]"></i>
                                Two more attempts at {{ projection.target }}% would lift you to about {{ projection.probability }}%.
                            </p>
                        </article>

                        <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 200ms">
                            <div class="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 class="dash-title">Score Trend</h2>
                                    <p class="analysis-muted mt-1">Every scored attempt, oldest to newest. Dashed line is the pass mark.</p>
                                </div>
                                <span class="inline-flex items-center gap-1 text-xs font-bold" :class="trendClass">
                                    <i :class="['pi text-[10px]', trendIcon]"></i>{{ trendText }}
                                </span>
                            </div>

                            <div class="dash-card-white mt-4 p-3">
                                <div class="relative h-56 w-full">
                                    <svg :viewBox="`0 0 ${chart.width} ${chart.height}`" preserveAspectRatio="none" class="h-full w-full overflow-visible" aria-hidden="true">
                                        <defs>
                                            <linearGradient :id="chartFillId" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stop-color="var(--theme-accent)" stop-opacity="0.3" />
                                                <stop offset="100%" stop-color="var(--theme-accent)" stop-opacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <g v-for="tick in [0, 25, 50, 75, 100]" :key="tick">
                                            <line :x1="chart.padX" :y1="chart.y(tick)" :x2="chart.width - chart.padX" :y2="chart.y(tick)"
                                                stroke="currentColor" stroke-opacity="0.12" stroke-width="1" class="text-slate-500" />
                                            <text :x="chart.padX - 6" :y="chart.y(tick) + 3" text-anchor="end" font-size="9" fill="currentColor"
                                                class="text-slate-400">{{ tick }}</text>
                                        </g>
                                        <line :x1="chart.padX" :y1="chart.y(passMark)" :x2="chart.width - chart.padX" :y2="chart.y(passMark)"
                                            stroke="currentColor" stroke-opacity="0.5" stroke-width="1.2" stroke-dasharray="4 4" class="text-slate-600 dark:text-slate-300" />
                                        <path :d="chart.area" :fill="`url(#${chartFillId})`" />
                                        <path :d="chart.line" fill="none" stroke="var(--theme-accent-2)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                                        <g v-for="pt in chart.points" :key="pt.key">
                                            <circle :cx="pt.x" :cy="pt.y" r="4" fill="white" :stroke="pt.color" stroke-width="2.2" class="cursor-pointer" @click="openReport(pt.attempt)">
                                                <title>{{ pt.title }}</title>
                                            </circle>
                                        </g>
                                    </svg>
                                </div>
                                <div class="mt-1 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                                    <span>{{ chart.firstLabel }}</span>
                                    <span>{{ chart.points.length }} attempts · click a point to open its report</span>
                                    <span>{{ chart.lastLabel }}</span>
                                </div>
                            </div>

                            <div class="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                                <div class="dash-tile">
                                    <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                        <span>Weekly activity</span>
                                        <span class="tabular-nums">{{ weekly.total }} in 8 weeks</span>
                                    </div>
                                    <div class="mt-2 flex h-10 items-end gap-1.5">
                                        <div v-for="w in weekly.weeks" :key="w.key" class="flex h-full flex-1 flex-col items-center justify-end gap-1" :title="`${w.label}: ${w.count}`">
                                            <div class="w-full rounded-sm transition-all duration-500" :class="w.count ? 'theme-bar' : 'bg-slate-200/80 dark:bg-slate-700/70'"
                                                :style="{ height: w.count ? `${Math.max(20, (w.count / weekly.max) * 100)}%` : '3px' }"></div>
                                            <span class="text-[8px] font-bold text-slate-400">{{ w.short }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="dash-tile flex flex-col justify-center gap-2 sm:min-w-44">
                                    <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">By mode</p>
                                    <div v-for="m in modeSplit" :key="m.mode" class="flex items-center justify-between gap-3 text-xs">
                                        <span class="analysis-pill theme-soft border capitalize">{{ m.mode }}</span>
                                        <span class="font-bold tabular-nums text-slate-800 dark:text-slate-100">{{ m.average }}% <span class="font-semibold text-slate-400">· {{ m.count }}</span></span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </section>

                    <!-- ================= EXAM BREAKDOWN + RECOMMENDATION ================= -->
                    <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                        <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 260ms">
                            <div class="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 class="dash-title">Exam Breakdown</h2>
                                    <p class="analysis-muted mt-1">Where you're strong, where you're slipping. Sorted weakest first.</p>
                                </div>
                                <span class="analysis-pill theme-soft border">{{ examBreakdown.length }} exams</span>
                            </div>

                            <div class="mt-4 space-y-2">
                                <button v-for="row in examBreakdown" :key="row.name" type="button" @click="openReport(row.latest)"
                                    class="group dash-tile flex w-full items-center gap-3 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                    <div class="relative h-11 w-11 shrink-0">
                                        <svg class="h-11 w-11 -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
                                            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="4" class="text-slate-200 dark:text-slate-700" />
                                            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                                                :stroke-dasharray="ringC" :stroke-dashoffset="ringC * (1 - row.average / 100)" :class="row.tone" />
                                        </svg>
                                        <span class="absolute inset-0 flex items-center justify-center text-[10px] font-black tabular-nums text-slate-900 dark:text-white">{{ row.average }}</span>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <p class="truncate text-sm font-extrabold text-slate-900 dark:text-white">{{ row.name }}</p>
                                        <p class="text-[11px] text-slate-500 dark:text-slate-300">
                                            {{ row.count }} {{ row.count === 1 ? "attempt" : "attempts" }} · best {{ row.best }}% · last {{ row.last }}%
                                        </p>
                                    </div>
                                    <span class="hidden items-center gap-1 text-xs font-bold sm:inline-flex" :class="row.deltaClass">
                                        <i :class="['pi text-[10px]', row.deltaIcon]"></i>{{ row.deltaText }}
                                    </span>
                                    <span class="analysis-pill border text-[11px]" :class="row.pill">{{ row.bandLabel }}</span>
                                    <i class="pi pi-arrow-right text-xs text-slate-400 transition-transform group-hover:translate-x-0.5"></i>
                                </button>
                            </div>
                        </article>

                        <article class="ui-rise dash-card xl:col-span-5" style="animation-delay: 300ms">
                            <div class="flex items-start gap-3">
                                <span class="dash-icon-tile h-10 w-10 bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                                    <i class="pi pi-lightbulb"></i>
                                </span>
                                <div>
                                    <h2 class="dash-title">Recommendation</h2>
                                    <p class="analysis-muted mt-1">Priorities adjust with your current score band.</p>
                                </div>
                            </div>

                            <div class="dash-card-white mt-4">
                                <div class="flex items-center justify-between gap-3 text-sm">
                                    <span class="font-semibold text-slate-600 dark:text-slate-300">Average vs pass mark</span>
                                    <span class="font-extrabold tabular-nums text-slate-900 dark:text-white">{{ estimate.averageScore }}% / {{ passMark }}%</span>
                                </div>
                                <div class="dash-progress relative mt-3 h-3 bg-light-blue-500">
                                    <div class="h-full rounded-full transition-all duration-700" :class="averageBarClass" :style="{ width: `${estimate.averageScore}%` }"></div>
                                    <span class="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-slate-700 dark:bg-slate-200" :style="{ left: `${passMark}%` }"></span>
                                </div>
                                <p class="mt-2 text-xs font-semibold" :class="scoreToneClass(estimate.averageScore, passMark)">{{ targetGapText }}</p>
                            </div>

                            <ul class="mt-3 space-y-2">
                                <li v-for="item in recommendationRows" :key="item.title" class="dash-tile flex gap-3">
                                    <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white" :class="item.iconClass">
                                        <i :class="[item.icon, 'text-[11px]']"></i>
                                    </span>
                                    <div>
                                        <h3 class="text-sm font-extrabold text-slate-900 dark:text-white">{{ item.title }}</h3>
                                        <p class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-300">{{ item.detail }}</p>
                                    </div>
                                </li>
                            </ul>
                        </article>
                    </section>

                    <!-- ================= SCORE HISTORY ================= -->
                    <section class="ui-rise dash-card" style="animation-delay: 340ms">
                        <div class="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h2 class="dash-title">Score History</h2>
                                <p class="analysis-muted mt-1">Your most recent attempts with band and report access.</p>
                            </div>
                            <RouterLink :to="reportsRoute" class="dash-btn-ghost">
                                View all attempts <i class="pi pi-arrow-right text-[10px]"></i>
                            </RouterLink>
                        </div>

                        <div class="dash-card-white mt-4 overflow-x-auto p-0">
                            <table class="w-full min-w-[680px] border-collapse text-left text-sm">
                                <thead>
                                    <tr class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                        <th class="px-4 py-3">Exam</th>
                                        <th class="px-4 py-3">When</th>
                                        <th class="px-4 py-3">Mode</th>
                                        <th class="px-4 py-3">Score</th>
                                        <th class="px-4 py-3">Band</th>
                                        <th class="px-4 py-3 text-right">Report</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="attempt in recentAttempts" :key="attempt.id"
                                        class="cursor-pointer border-t border-slate-100 transition hover:bg-light-blue-500 dark:border-sky-900 dark:hover:bg-sky-950/60"
                                        @click="openReport(attempt)">
                                        <td class="px-4 py-3">
                                            <div class="font-bold text-slate-900 dark:text-white">{{ normalizeText(attempt.sub_topic_name) }}</div>
                                            <div class="text-[11px] text-slate-500 dark:text-slate-400">Attempt #{{ attempt.attempt_id ?? attempt.id }}{{ isCompleted(attempt) ? "" : " · in progress" }}</div>
                                        </td>
                                        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ formatDate(attempt.completed_at ?? attempt.created_at) }}</td>
                                        <td class="px-4 py-3"><span class="analysis-pill theme-soft border capitalize">{{ attempt.mode || "exam" }}</span></td>
                                        <td class="px-4 py-3 font-extrabold tabular-nums" :class="scoreToneClass(scoreNumber(attempt.score), passMark)">{{ Math.round(scoreNumber(attempt.score)) }}%</td>
                                        <td class="px-4 py-3"><span class="analysis-pill border text-[11px]" :class="scorePillClass(scoreNumber(attempt.score), passMark)">{{ bandLabelFor(scoreNumber(attempt.score)) }}</span></td>
                                        <td class="px-4 py-3 text-right">
                                            <span class="dash-btn theme-surface px-3 py-1 text-[11px]">View <i class="pi pi-arrow-right text-[10px]"></i></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </template>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import GuestSavePrompt from './GuestSavePrompt.vue'
import Gaunge from './Gaunge.vue'
import { useAuthStore } from '../stores/authStore'
import { normalizeText } from '../utils/normalizeText'
import {
    average,
    clamp,
    estimateReadiness,
    likelyRange,
    readinessBand,
    readinessTrajectory,
    scoreBarClass,
    scorePillClass,
    scoreToneClass,
} from '../utils/readiness'

type Attempt = {
    id: number
    attempt_id?: number
    sub_topic_name: string
    score: number | string
    mode?: string
    completed?: boolean | number
    completed_at?: string
    created_at?: string
}

const props = withDefaults(defineProps<{ product: string; productLabel: string; passMark?: number }>(), { passMark: 75 })

const router = useRouter()
const authStore = useAuthStore()

const attempts = ref<Attempt[]>([])
const loading = ref(true)
const fetchError = ref('')
const isGuest = computed(() => !authStore.is_authenticated)
const chartFillId = `analysis-fill-${Math.random().toString(36).slice(2, 9)}`
const ringC = 2 * Math.PI * 16

const apiProduct = computed(() => props.product.replace(/^\/+/, ''))
const baseRoute = computed(() => `/${apiProduct.value}`)
const reportsRoute = computed(() => `${baseRoute.value}/previous-attempts`)
const testsRoute = computed(() => `${baseRoute.value}/`)
const guestPromptProduct = computed(() => (apiProduct.value === 'nursing' || apiProduct.value === 'teas' ? apiProduct.value : undefined))

const fetchAttempts = async () => {
    loading.value = true
    fetchError.value = ''
    try {
        const response = await axios.get(`/${apiProduct.value}/previous-attempts`)
        attempts.value = Array.isArray(response.data?.data) ? response.data.data : []
    } catch (error) {
        console.error(`Error fetching ${props.productLabel} performance analysis:`, error)
        fetchError.value = `We could not load your ${props.productLabel} performance analysis right now.`
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (isGuest.value) {
        loading.value = false
        return
    }
    fetchAttempts()
})

watch(isGuest, (guest) => {
    if (guest) {
        attempts.value = []
        fetchError.value = ''
        loading.value = false
        return
    }
    fetchAttempts()
})

/* ---------- normalisation ---------- */
const scoreNumber = (score: number | string | undefined) => clamp(Math.round(Number(score) || 0))
const isCompleted = (attempt: Attempt) => Number(attempt.completed) === 1 || attempt.completed === true
const attemptTime = (attempt: Attempt) => {
    const date = new Date(attempt.completed_at ?? attempt.created_at ?? 0)
    return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

const hasAttempts = computed(() => attempts.value.length > 0)
const sortedAttempts = computed(() => [...attempts.value].sort((a, b) => attemptTime(b) - attemptTime(a)))
const completedAttempts = computed(() => sortedAttempts.value.filter(isCompleted))
const scoredAttempts = computed(() => (completedAttempts.value.length ? completedAttempts.value : sortedAttempts.value))
const scores = computed(() => scoredAttempts.value.map((a) => scoreNumber(a.score)))

/* ---------- readiness ---------- */
const estimate = computed(() => estimateReadiness(scores.value, props.passMark))
const range = computed(() => likelyRange(estimate.value.probability, estimate.value.confidence))
const band = computed(() => readinessBand(estimate.value.probability))
const bandPillClass = computed(() => {
    const p = estimate.value.probability
    if (p < 45) return scorePillClass(0, props.passMark)
    if (p < 70) return scorePillClass(props.passMark - 10, props.passMark)
    if (p < 86) return 'theme-soft'
    return scorePillClass(100, props.passMark)
})

const trajectory = computed(() => readinessTrajectory(scores.value, props.passMark, 8))
const probabilityDelta = computed(() => {
    const pts = trajectory.value
    if (pts.length < 2) return null
    const back = Math.min(3, pts.length - 1)
    return pts[pts.length - 1] - pts[pts.length - 1 - back]
})

const readinessMetrics = computed(() => [
    {
        label: 'Pass probability',
        value: `${estimate.value.probability}%`,
        detail: probabilityDelta.value === null ? 'first reading' : `${probabilityDelta.value >= 0 ? '+' : ''}${probabilityDelta.value} pts over last ${Math.min(3, trajectory.value.length - 1)} attempts`,
        icon: 'pi pi-chart-line',
        valueClass: estimate.value.probability >= 70 ? 'text-emerald-600 dark:text-emerald-300' : estimate.value.probability >= 45 ? 'text-amber-600 dark:text-amber-300' : 'text-rose-600 dark:text-rose-300',
    },
    {
        label: 'Consistency',
        value: `${estimate.value.confidence}%`,
        detail: `Scores range ${lowestScore.value}–${highestScore.value}%`,
        icon: 'pi pi-wave-pulse',
        valueClass: estimate.value.confidence >= 70 ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300',
    },
    {
        label: 'Recent average',
        value: `${estimate.value.recentAverage}%`,
        detail: `${estimate.value.trendDelta >= 0 ? '+' : ''}${estimate.value.trendDelta} pts trend · all-time ${estimate.value.averageScore}%`,
        icon: 'pi pi-bullseye',
        valueClass: scoreToneClass(estimate.value.recentAverage, props.passMark),
    },
])

const projection = computed(() => {
    if (!scores.value.length || estimate.value.probability >= 90) return null
    const target = clamp(Math.max(props.passMark + 5, estimate.value.recentAverage + 8))
    const next = estimateReadiness([target, target, ...scores.value], props.passMark).probability
    return next > estimate.value.probability ? { target, probability: next } : null
})

/* ---------- stat strip ---------- */
const highestScore = computed(() => (scores.value.length ? Math.max(...scores.value) : 0))
const lowestScore = computed(() => (scores.value.length ? Math.min(...scores.value) : 0))
const averageDelta = computed(() => {
    const recent = scores.value.slice(0, 5)
    const previous = scores.value.slice(5, 10)
    if (recent.length < 2 || previous.length < 2) return null
    return Math.round(average(recent) - average(previous))
})
const bestAttempt = computed(() => scoredAttempts.value.reduce<Attempt | null>((best, a) => (!best || scoreNumber(a.score) > scoreNumber(best.score) ? a : best), null))

const statStrip = computed(() => [
    {
        label: 'Attempts',
        value: String(attempts.value.length),
        detail: `${completedAttempts.value.length} completed · ${attempts.value.length - completedAttempts.value.length} in progress`,
        icon: 'pi pi-file',
        valueClass: 'text-slate-950 dark:text-white',
    },
    {
        label: 'Average score',
        value: `${estimate.value.averageScore}%`,
        detail: averageDelta.value === null ? 'Delta appears after 4 attempts' : `${averageDelta.value >= 0 ? '+' : ''}${averageDelta.value} vs previous 5 attempts`,
        icon: 'pi pi-percentage',
        valueClass: scoreToneClass(estimate.value.averageScore, props.passMark),
    },
    {
        label: 'Best score',
        value: `${highestScore.value}%`,
        detail: bestAttempt.value ? normalizeText(bestAttempt.value.sub_topic_name) : 'Best recorded result',
        icon: 'pi pi-star',
        valueClass: 'text-emerald-600 dark:text-emerald-300',
    },
    {
        label: 'Pass probability',
        value: `${estimate.value.probability}%`,
        detail: `${band.value} · likely ${range.value.low}–${range.value.high}%`,
        icon: 'pi pi-chart-line',
        valueClass: 'theme-text',
    },
])

/* ---------- trend ---------- */
const trendText = computed(() => {
    const d = estimate.value.trendDelta
    if (scores.value.length < 2) return 'Trend starts after two attempts'
    if (d === 0) return 'Holding steady'
    return `${Math.abs(d)} pts ${d > 0 ? 'up' : 'down'} recently`
})
const trendIcon = computed(() => (scores.value.length < 2 || estimate.value.trendDelta === 0 ? 'pi-minus' : estimate.value.trendDelta > 0 ? 'pi-arrow-up-right' : 'pi-arrow-down-right'))
const trendClass = computed(() => {
    if (scores.value.length < 2 || estimate.value.trendDelta === 0) return 'text-slate-500 dark:text-slate-300'
    return estimate.value.trendDelta > 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
})

const shortDate = (ts: number) => (ts ? new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '')

const chart = computed(() => {
    const width = 600
    const height = 200
    const padX = 28
    const padY = 12
    const y = (v: number) => height - padY - (clamp(v) / 100) * (height - padY * 2)
    const series = [...scoredAttempts.value].reverse().slice(-20)
    const n = series.length
    const x = (i: number) => (n <= 1 ? width / 2 : padX + (i / (n - 1)) * (width - padX * 2))
    const points = series.map((attempt, i) => {
        const s = scoreNumber(attempt.score)
        return {
            key: `${attempt.id}-${i}`,
            x: x(i),
            y: y(s),
            color: s >= props.passMark ? '#10b981' : s >= props.passMark - 15 ? '#f59e0b' : '#f43f5e',
            title: `${normalizeText(attempt.sub_topic_name)} · ${s}% · ${shortDate(attemptTime(attempt))}`,
            attempt,
        }
    })
    const line = points.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ')
    const area = points.length ? `${line} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z` : ''
    return {
        width, height, padX, y, points, line, area,
        firstLabel: series.length ? shortDate(attemptTime(series[0])) : '',
        lastLabel: series.length ? shortDate(attemptTime(series[series.length - 1])) : '',
    }
})

const weekly = computed(() => {
    const now = new Date()
    const startOfWeek = (d: Date) => {
        const c = new Date(d)
        c.setHours(0, 0, 0, 0)
        c.setDate(c.getDate() - c.getDay())
        return c
    }
    const thisWeek = startOfWeek(now)
    const weeks = Array.from({ length: 8 }, (_, i) => {
        const start = new Date(thisWeek)
        start.setDate(thisWeek.getDate() - (7 - i) * 7)
        const end = new Date(start)
        end.setDate(start.getDate() + 7)
        const count = attempts.value.filter((a) => {
            const t = attemptTime(a)
            return t >= start.getTime() && t < end.getTime()
        }).length
        return { key: start.toISOString(), count, label: `Week of ${shortDate(start.getTime())}`, short: i === 7 ? 'now' : `${7 - i}w` }
    })
    return { weeks, total: weeks.reduce((s, w) => s + w.count, 0), max: Math.max(1, ...weeks.map((w) => w.count)) }
})

const modeSplit = computed(() => {
    const groups = new Map<string, number[]>()
    scoredAttempts.value.forEach((a) => {
        const mode = (a.mode || 'exam').toLowerCase()
        if (!groups.has(mode)) groups.set(mode, [])
        groups.get(mode)!.push(scoreNumber(a.score))
    })
    return [...groups.entries()].map(([mode, list]) => ({ mode, count: list.length, average: Math.round(average(list)) })).sort((a, b) => b.count - a.count)
})

/* ---------- exam breakdown ---------- */
const bandLabelFor = (score: number) => (score >= props.passMark ? 'Passing' : score >= props.passMark - 15 ? 'Close' : 'Below')

const examBreakdown = computed(() => {
    const groups = new Map<string, Attempt[]>()
    scoredAttempts.value.forEach((a) => {
        const name = normalizeText(a.sub_topic_name) || 'Practice set'
        if (!groups.has(name)) groups.set(name, [])
        groups.get(name)!.push(a)
    })
    return [...groups.entries()]
        .map(([name, list]) => {
            const s = list.map((a) => scoreNumber(a.score)) // newest first
            const avg = Math.round(average(s))
            const delta = s.length >= 2 ? s[0] - s[1] : null
            return {
                name,
                count: s.length,
                average: avg,
                best: Math.max(...s),
                last: s[0],
                latest: list[0],
                tone: scoreToneClass(avg, props.passMark),
                pill: scorePillClass(avg, props.passMark),
                bandLabel: bandLabelFor(avg),
                deltaText: delta === null ? 'one attempt' : delta === 0 ? 'no change' : `${delta > 0 ? '+' : ''}${delta} vs previous`,
                deltaIcon: delta === null || delta === 0 ? 'pi-minus' : delta > 0 ? 'pi-arrow-up-right' : 'pi-arrow-down-right',
                deltaClass: delta === null || delta === 0 ? 'text-slate-400' : delta > 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300',
            }
        })
        .sort((a, b) => a.average - b.average)
        .slice(0, 8)
})

/* ---------- recommendation ---------- */
const averageBarClass = computed(() => scoreBarClass(estimate.value.averageScore, props.passMark))
const targetGapText = computed(() => {
    const gap = estimate.value.averageScore - props.passMark
    if (gap === 0) return 'At the pass mark'
    return gap > 0 ? `${gap} pts above the pass mark` : `${Math.abs(gap)} pts below the pass mark`
})

const recommendationRows = computed(() => {
    const weakest = examBreakdown.value[0]
    const avg = estimate.value.averageScore
    const weakRow = weakest && weakest.average < props.passMark
        ? [{ title: `Retake ${weakest.name}`, detail: `Averaging ${weakest.average}% across ${weakest.count} ${weakest.count === 1 ? 'attempt' : 'attempts'}. Review its rationales, then retake in tutor mode.`, icon: 'pi pi-flag-fill', iconClass: 'bg-rose-500' }]
        : []
    if (avg >= props.passMark) {
        return [
            ...weakRow,
            { title: 'Protect your passing range', detail: 'Keep timed practice in rotation so accuracy holds under exam pacing.', icon: 'pi pi-check-circle', iconClass: 'bg-emerald-500' },
            { title: 'Review missed rationales', detail: 'Use recent report misses to polish weak concepts before adding harder tests.', icon: 'pi pi-search', iconClass: 'bg-sky-500' },
            { title: 'Maintain consistency', detail: 'Repeat mixed-topic attempts and watch for score dips across the next few sessions.', icon: 'pi pi-refresh', iconClass: 'bg-teal-500' },
        ].slice(0, 3)
    }
    if (avg >= props.passMark - 15) {
        return [
            ...weakRow,
            { title: 'Close the target gap', detail: 'Prioritize exams under the pass mark and retest them in short focused blocks.', icon: 'pi pi-chart-line', iconClass: 'bg-amber-500' },
            { title: 'Use tutor mode deliberately', detail: 'Pause on rationales immediately after missed questions to correct patterns fast.', icon: 'pi pi-book', iconClass: 'bg-sky-500' },
            { title: 'Schedule a timed check', detail: 'Run another assessment after review to confirm the score movement is real.', icon: 'pi pi-clock', iconClass: 'bg-teal-500' },
        ].slice(0, 3)
    }
    return [
        ...weakRow,
        { title: 'Rebuild the foundation first', detail: 'Start with core content review before stacking longer timed attempts.', icon: 'pi pi-book', iconClass: 'bg-rose-500' },
        { title: 'Practice in smaller sets', detail: 'Use shorter tests to identify recurring misses without adding fatigue.', icon: 'pi pi-list', iconClass: 'bg-amber-500' },
        { title: 'Retest after review', detail: 'Repeat recently missed topics once rationales feel clear and usable.', icon: 'pi pi-refresh', iconClass: 'bg-sky-500' },
    ].slice(0, 3)
})

/* ---------- history ---------- */
const recentAttempts = computed(() => sortedAttempts.value.slice(0, 8))

const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not recorded'
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return 'Not recorded'
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const openReport = (attempt: Attempt) => {
    router.push(`${baseRoute.value}/performance-report/${attempt.attempt_id ?? attempt.id}`)
}
</script>

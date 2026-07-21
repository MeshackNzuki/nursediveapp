<template>
    <div class="analysis-shell">
        <div class="analysis-container">
            <div class="analysis-header">
                <div>
                    <p class="analysis-eyebrow">{{ productLabel }} Analytics</p>
                    <h1 class="analysis-title">Performance Analysis</h1>
                    <p class="analysis-subtitle">
                        Track readiness, consistency, and score movement across your {{ productLabel }} attempts.
                    </p>
                </div>

                <div class="analysis-actions">
                    <CommonButton icon="pi pi-arrow-left" button-text="Reports"
                        :action="() => router.push(reportsRoute)" />
                    <CommonButton icon2="pi pi-arrow-right" button-text="Take Test"
                        :action="() => router.push(testsRoute)" />
                </div>
            </div>

            <GuestSavePrompt v-if="isGuest" :product="guestPromptProduct" :product-label="productLabel"
                :redirect="reportsRoute" />

            <template v-else>
                <div v-if="loading" class="analysis-state">
                    Loading performance analysis...
                </div>

                <div v-else-if="fetchError" class="analysis-state-error">
                    {{ fetchError }}
                </div>

                <template v-else>
                <div class="analysis-stat-grid">
                    <StatCard icon="pi pi-file" label="Total Attempts" :quantity="attempts.length"
                        :description="`${completedCount} completed`" variant="sky" pattern="grid" />

                    <StatCard icon="pi pi-chart-line" label="Average Score" :quantity="averageScore" suffix="%"
                        :description="scoreTrendText" variant="amber" pattern="diagonal" />

                    <StatCard icon="pi pi-star" label="Highest Score" :quantity="highestScore" suffix="%"
                        description="Best recorded result" variant="accent" pattern="dots" />

                    <StatCard icon="pi pi-exclamation-triangle" label="Lowest Score" :quantity="lowestScore" suffix="%"
                        description="Use as a review signal" variant="rose" pattern="stripes" />
                </div>

                <section v-if="!hasAttempts" class="analysis-panel p-8 text-center">
                    <div
                        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
                        <i class="pi pi-chart-line text-lg"></i>
                    </div>
                    <h2 class="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        No attempts recorded yet
                    </h2>
                    <p class="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                        Complete a {{ productLabel }} practice test to unlock readiness scoring, recommendations, and
                        score history.
                    </p>
                    <div class="mt-5 flex justify-center">
                        <CommonButton icon2="pi pi-arrow-right" :button-text="`Start ${productLabel} Test`"
                            :action="() => router.push(testsRoute)" />
                    </div>
                </section>

                <template v-else>
                    <div class="analysis-two-column">
                        <section class="analysis-panel">
                            <div class="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <h2 class="analysis-section-heading">Readiness Estimate</h2>
                                    <p class="analysis-muted">
                                        Built from your average score and recent consistency.
                                    </p>
                                </div>
                                <span class="analysis-pill" :class="readinessBadgeClass">
                                    {{ readinessLabel }}
                                </span>
                            </div>

                            <div class="analysis-panel-soft">
                                <Gaunge :pass-mark="passMark" label="Pass Probability" :level="probability" />
                            </div>

                            <dl class="analysis-metric-list">
                                <div v-for="metric in probabilityMetrics" :key="metric.label"
                                    class="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                                    <dt class="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                                        <i :class="[metric.icon, metric.iconClass]"></i>
                                        {{ metric.label }}
                                    </dt>
                                    <dd class="font-semibold" :class="metric.valueClass">
                                        {{ metric.value }}
                                    </dd>
                                </div>
                            </dl>
                        </section>

                        <section class="analysis-panel">
                            <div class="mb-4 flex items-start gap-3">
                                <span
                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800/60">
                                    <i class="pi pi-lightbulb text-base"></i>
                                </span>
                                <div>
                                    <h2 class="analysis-section-heading">Professional Recommendation</h2>
                                    <p class="analysis-muted">
                                        Priorities adjust with your current score band.
                                    </p>
                                </div>
                            </div>

                            <div
                                class="mb-4 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 dark:bg-slate-950/50 dark:ring-slate-800">
                                <div class="flex items-center justify-between gap-3">
                                    <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        Target score
                                    </span>
                                    <span class="text-sm font-bold text-slate-900 dark:text-slate-100">
                                        {{ passMark }}%
                                    </span>
                                </div>
                                <div class="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                    <div class="h-full rounded-full" :class="averageBarClass"
                                        :style="{ width: `${averageBarWidth}%` }"></div>
                                </div>
                                <div
                                    class="mt-2 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <span>{{ averageScore }}% average</span>
                                    <span>{{ targetGapText }}</span>
                                </div>
                            </div>

                            <ul class="divide-y divide-slate-200 dark:divide-slate-800">
                                <li v-for="item in recommendationRows" :key="item.title" class="flex gap-3 py-3">
                                    <span
                                        class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                                        :class="item.iconClass">
                                        <i :class="[item.icon, 'text-[11px]']"></i>
                                    </span>
                                    <div>
                                        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {{ item.title }}
                                        </h3>
                                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            {{ item.detail }}
                                        </p>
                                    </div>
                                </li>
                            </ul>

                            <div class="mt-5 flex flex-wrap gap-2">
                                <CommonButton icon2="pi pi-arrow-right" button-text="Go to reports"
                                    :action="() => router.push(reportsRoute)" />
                                <CommonButton icon2="pi pi-arrow-right" button-text="Take more tests"
                                    :action="() => router.push(testsRoute)" />
                            </div>
                        </section>
                    </div>

                    <section class="analysis-table-section">
                        <div class="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 class="analysis-section-heading">Score History</h2>
                                <p class="analysis-muted">
                                    Recent attempts with score band and report access.
                                </p>
                            </div>
                            <div class="text-sm font-semibold" :class="scoreTrendClass">
                                {{ scoreTrendText }}
                            </div>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="analysis-table">
                                <thead class="analysis-table-head">
                                    <tr>
                                        <th class="analysis-table-th">Exam</th>
                                        <th class="analysis-table-th">Completed</th>
                                        <th class="analysis-table-th">Mode</th>
                                        <th class="analysis-table-th">Score</th>
                                        <th class="analysis-table-th">Report</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(attempt, index) in recentAttempts" :key="attempt.id"
                                        :class="index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-950/60'">
                                        <td class="analysis-table-td">
                                            <div class="font-semibold text-slate-900 dark:text-slate-100">
                                                {{ normalizeText(attempt.sub_topic_name) }}
                                            </div>
                                            <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                Attempt #{{ attempt.attempt_id ?? attempt.id }}
                                            </div>
                                        </td>
                                        <td class="analysis-table-td text-slate-600 dark:text-slate-300">
                                            {{ formatDate(attempt.completed_at ?? attempt.created_at) }}
                                        </td>
                                        <td class="analysis-table-td">
                                            <span
                                                class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                                {{ attempt.mode || 'exam' }}
                                            </span>
                                        </td>
                                        <td class="analysis-table-td">
                                            <span class="font-bold" :class="scoreToneClass(attempt.score)">
                                                {{ Math.round(scoreNumber(attempt.score)) }}%
                                            </span>
                                        </td>
                                        <td class="analysis-table-td">
                                            <button
                                                class="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-200 dark:ring-sky-800/60"
                                                @click="openReport(attempt)">
                                                View
                                                <i class="pi pi-arrow-right text-[10px]"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="flex justify-center border-t border-slate-200 px-5 py-4 dark:border-slate-800">
                            <CommonButton icon2="pi pi-arrow-right" button-text="View all attempts"
                                :action="() => router.push(reportsRoute)" />
                        </div>
                    </section>
                </template>
                </template>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import CommonButton from './Buttons/CommonButton.vue'
import GuestSavePrompt from './GuestSavePrompt.vue'
import Gaunge from './Gaunge.vue'
import StatCard from './Stats/NewStat.vue'
import { useAuthStore } from '../stores/authStore'
import { normalizeText } from '../utils/normalizeText'

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

const props = withDefaults(defineProps<{
    product: string
    productLabel: string
    passMark?: number
}>(), {
    passMark: 75,
})

const router = useRouter()
const authStore = useAuthStore()

const attempts = ref<Attempt[]>([])
const loading = ref(true)
const fetchError = ref('')
const isGuest = computed(() => !authStore.is_authenticated)

const apiProduct = computed(() => props.product.replace(/^\/+/, ''))
const baseRoute = computed(() => `/${apiProduct.value}`)
const reportsRoute = computed(() => `${baseRoute.value}/previous-attempts`)
const testsRoute = computed(() => `${baseRoute.value}/`)
const guestPromptProduct = computed(() => {
    if (apiProduct.value === 'nursing' || apiProduct.value === 'teas') {
        return apiProduct.value
    }

    return undefined
})

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

const scoreNumber = (score: number | string | undefined) => Number(score) || 0
const hasAttempts = computed(() => attempts.value.length > 0)

const completedCount = computed(() => {
    return attempts.value.filter((attempt) => Number(attempt.completed) === 1 || attempt.completed === true).length
})

const safeScores = computed(() => attempts.value.map((attempt) => scoreNumber(attempt.score)))
const scoredAttempts = computed(() => safeScores.value.filter((score) => Number.isFinite(score)))

const averageScore = computed(() => {
    if (!scoredAttempts.value.length) return 0
    const total = scoredAttempts.value.reduce((sum, score) => sum + score, 0)
    return Math.round(total / scoredAttempts.value.length)
})

const highestScore = computed(() => {
    if (!scoredAttempts.value.length) return 0
    return Math.round(Math.max(...scoredAttempts.value))
})

const lowestScore = computed(() => {
    if (!scoredAttempts.value.length) return 0
    return Math.round(Math.min(...scoredAttempts.value))
})

const attemptTime = (attempt: Attempt) => {
    const date = new Date(attempt.completed_at ?? attempt.created_at ?? 0)
    return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

const sortedAttempts = computed(() => {
    return [...attempts.value].sort((a, b) => attemptTime(b) - attemptTime(a))
})

const recentAttempts = computed(() => sortedAttempts.value.slice(0, 6))
const latestScore = computed(() => scoreNumber(sortedAttempts.value[0]?.score))
const previousScore = computed(() => scoreNumber(sortedAttempts.value[1]?.score))

const scoreTrendText = computed(() => {
    if (sortedAttempts.value.length < 2) return 'Trend starts after two attempts'

    const delta = Math.round(latestScore.value - previousScore.value)
    if (delta === 0) return 'No change from prior attempt'

    const direction = delta > 0 ? 'up' : 'down'
    return `${Math.abs(delta)} pts ${direction} from prior attempt`
})

const scoreTrendClass = computed(() => {
    if (sortedAttempts.value.length < 2) return 'text-slate-500 dark:text-slate-400'
    if (latestScore.value > previousScore.value) return 'text-emerald-600 dark:text-emerald-300'
    if (latestScore.value < previousScore.value) return 'text-rose-600 dark:text-rose-300'
    return 'text-slate-500 dark:text-slate-400'
})

const probability = computed(() => {
    const score = Number(averageScore.value) || 0
    if (score <= 0) return 0

    const probabilityValue = 1 / (1 + Math.exp(-(score - props.passMark) / 5))
    if (Number.isNaN(probabilityValue)) return 0

    return Math.round(probabilityValue * 100)
})

const confidenceScore = computed(() => {
    const recent = sortedAttempts.value.slice(0, 10).map((attempt) => scoreNumber(attempt.score))
    if (recent.length < 2) return 50

    const average = recent.reduce((sum, score) => sum + score, 0) / recent.length
    const variance = recent.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / recent.length
    const standardDeviation = Math.sqrt(variance)

    if (Number.isNaN(standardDeviation)) return 50

    return Math.round(100 - Math.min(standardDeviation * 2, 60))
})

const difficultyAdjusted = computed(() => {
    const adjusted = Math.round((probability.value * 0.7) + (confidenceScore.value * 0.3))
    return Math.min(100, Math.max(0, adjusted))
})

const readinessLabel = computed(() => {
    if (averageScore.value >= props.passMark) return 'On Track'
    if (averageScore.value >= props.passMark - 15) return 'Near Target'
    return 'Needs Focus'
})

const readinessBadgeClass = computed(() => {
    if (averageScore.value >= props.passMark) {
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
    }

    if (averageScore.value >= props.passMark - 15) {
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'
    }

    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'
})

const probabilityColor = computed(() => {
    if (probability.value < 50) return 'text-rose-600 dark:text-rose-300'
    if (probability.value < 80) return 'text-amber-600 dark:text-amber-300'
    return 'text-emerald-600 dark:text-emerald-300'
})

const difficultyColor = computed(() => {
    if (difficultyAdjusted.value < 50) return 'text-rose-600 dark:text-rose-300'
    if (difficultyAdjusted.value < 80) return 'text-amber-600 dark:text-amber-300'
    return 'text-emerald-600 dark:text-emerald-300'
})

const probabilityMetrics = computed(() => [
    {
        label: 'Pass probability',
        value: `${probability.value}%`,
        icon: 'pi pi-chart-line',
        iconClass: 'text-sky-500',
        valueClass: probabilityColor.value,
    },
    {
        label: 'Confidence level',
        value: `${confidenceScore.value}%`,
        icon: 'pi pi-check-circle',
        iconClass: 'text-teal-500',
        valueClass: 'text-slate-900 dark:text-slate-100',
    },
    {
        label: 'Difficulty-adjusted',
        value: `${difficultyAdjusted.value}%`,
        icon: 'pi pi-exclamation-triangle',
        iconClass: 'text-amber-500',
        valueClass: difficultyColor.value,
    },
])

const averageBarWidth = computed(() => Math.min(Math.max(averageScore.value, 0), 100))

const averageBarClass = computed(() => {
    if (averageScore.value >= props.passMark) return 'bg-emerald-500'
    if (averageScore.value >= props.passMark - 15) return 'bg-amber-500'
    return 'bg-rose-500'
})

const targetGapText = computed(() => {
    const gap = averageScore.value - props.passMark
    if (gap === 0) return 'At target'
    if (gap > 0) return `${gap} pts above target`
    return `${Math.abs(gap)} pts below target`
})

const recommendationRows = computed(() => {
    if (averageScore.value >= props.passMark) {
        return [
            {
                title: 'Protect your passing range',
                detail: 'Keep timed practice in rotation so accuracy holds under exam pacing.',
                icon: 'pi pi-check-circle',
                iconClass: 'bg-emerald-500',
            },
            {
                title: 'Review missed rationales',
                detail: 'Use recent report misses to polish weak concepts before adding harder tests.',
                icon: 'pi pi-search',
                iconClass: 'bg-sky-500',
            },
            {
                title: 'Maintain consistency',
                detail: 'Repeat mixed-topic attempts and watch for score dips across the next few sessions.',
                icon: 'pi pi-refresh',
                iconClass: 'bg-teal-500',
            },
        ]
    }

    if (averageScore.value >= props.passMark - 15) {
        return [
            {
                title: 'Close the target gap',
                detail: 'Prioritize topics under 60% and retest them in short focused blocks.',
                icon: 'pi pi-chart-line',
                iconClass: 'bg-amber-500',
            },
            {
                title: 'Use tutor mode deliberately',
                detail: 'Pause on rationales immediately after missed questions to correct patterns fast.',
                icon: 'pi pi-book',
                iconClass: 'bg-sky-500',
            },
            {
                title: 'Schedule a timed check',
                detail: 'Run another assessment after review to confirm the score movement is real.',
                icon: 'pi pi-clock',
                iconClass: 'bg-teal-500',
            },
        ]
    }

    return [
        {
            title: 'Rebuild the foundation first',
            detail: 'Start with core content review before stacking longer timed attempts.',
            icon: 'pi pi-book',
            iconClass: 'bg-rose-500',
        },
        {
            title: 'Practice in smaller sets',
            detail: 'Use shorter tests to identify recurring misses without adding unnecessary fatigue.',
            icon: 'pi pi-list',
            iconClass: 'bg-amber-500',
        },
        {
            title: 'Retest after review',
            detail: 'Repeat recently missed topics once rationales feel clear and usable.',
            icon: 'pi pi-refresh',
            iconClass: 'bg-sky-500',
        },
    ]
})

const scoreToneClass = (score: number | string) => {
    const value = scoreNumber(score)
    if (value >= props.passMark) return 'text-emerald-600 dark:text-emerald-300'
    if (value >= props.passMark - 15) return 'text-amber-600 dark:text-amber-300'
    return 'text-rose-600 dark:text-rose-300'
}

const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not recorded'

    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return 'Not recorded'

    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

const openReport = (attempt: Attempt) => {
    router.push(`${baseRoute.value}/performance-report/${attempt.attempt_id ?? attempt.id}`)
}
</script>

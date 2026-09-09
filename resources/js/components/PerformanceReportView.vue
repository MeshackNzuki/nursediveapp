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
                        {{ productLabel }} Report
                    </p>
                    <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                        {{ report ? normalizeText(report.exam?.name) : "Performance Report" }}
                    </h1>
                    <p v-if="report" class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {{ isCompleted ? `Completed ${formatDate(report.completed_at)}` : `Started ${formatDate(report.created_at)} · not yet completed` }}
                        · Attempt #{{ report.attempt_id }}
                    </p>
                </div>
                <div v-if="!isGuest && report" class="flex flex-wrap gap-2">
                    <button v-if="!isCompleted && report.attempt_id" type="button" @click="resumeExam"
                        class="dash-btn bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30">
                        <i class="pi pi-play"></i> Resume exam
                    </button>
                    <button type="button" @click="reviewAnswers" class="dash-btn-ghost">
                        <i class="pi pi-eye"></i> Review answers
                    </button>
                    <RouterLink :to="`${baseRoute}/performance-analysis`" class="dash-btn theme-surface theme-shadow">
                        Performance analysis <i class="pi pi-arrow-right text-[10px]"></i>
                    </RouterLink>
                </div>
            </header>

            <GuestSavePrompt v-if="isGuest" :product="guestPromptProduct" :product-label="productLabel" :redirect="route.fullPath" />

            <div v-else-if="loadError" class="analysis-state-error">{{ loadError }}</div>

            <div v-else-if="!report" class="grid gap-4 xl:grid-cols-12">
                <div class="h-72 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60 xl:col-span-7"></div>
                <div class="h-72 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60 xl:col-span-5"></div>
                <div class="h-56 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60 xl:col-span-12"></div>
            </div>

            <template v-else>
                <div v-if="!isCompleted" class="ui-rise flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
                    <i class="pi pi-exclamation-triangle"></i>
                    <span class="flex-1">This attempt is incomplete, so the score reflects only the questions reached so far.</span>
                    <button v-if="report.attempt_id" type="button" class="font-bold underline decoration-dashed" @click="resumeExam">Resume now</button>
                </div>

                <!-- ================= SUMMARY + VERDICT ================= -->
                <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                    <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 60ms">
                        <div class="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-50" aria-hidden="true"></div>

                        <div class="relative grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
                            <!-- Score ring -->
                            <div class="relative mx-auto h-36 w-36">
                                <svg class="h-36 w-36 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" stroke-width="10" class="text-slate-200 dark:text-slate-700" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"
                                        :stroke-dasharray="bigRing" :stroke-dashoffset="bigRing * (1 - scoreRounded / 100)" :class="scoreTone"
                                        class="transition-[stroke-dashoffset] duration-1000 ease-out" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" stroke-width="12"
                                        :stroke-dasharray="`2 ${bigRing - 2}`" :stroke-dashoffset="bigRing * (1 - passMark / 100)" class="text-slate-600 dark:text-slate-200" />
                                </svg>
                                <div class="absolute inset-0 flex flex-col items-center justify-center leading-none">
                                    <span class="text-3xl font-black tabular-nums text-slate-950 dark:text-white">{{ scoreRounded }}%</span>
                                    <span class="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">score</span>
                                </div>
                            </div>

                            <div class="min-w-0">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="analysis-pill border" :class="scorePill">{{ verdict.label }}</span>
                                    <span class="analysis-pill theme-soft border">Pass mark {{ passMark }}%</span>
                                    <span class="analysis-pill border capitalize" :class="isCompleted ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200' : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200'">
                                        {{ isCompleted ? "Completed" : "In progress" }}
                                    </span>
                                </div>
                                <h2 class="mt-3 text-lg font-extrabold text-slate-950 dark:text-white">{{ verdict.headline }}</h2>
                                <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ verdict.detail }}</p>

                                <div class="mt-4">
                                    <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                        <span>Score vs pass mark</span>
                                        <span :class="scoreTone">{{ gapText }}</span>
                                    </div>
                                    <div class="dash-progress relative mt-2 h-3 bg-light-blue-500">
                                        <div class="h-full rounded-full transition-all duration-700" :class="scoreBar" :style="{ width: `${scoreRounded}%` }"></div>
                                        <span class="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-slate-700 dark:bg-slate-200" :style="{ left: `${passMark}%` }"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Facts -->
                        <dl class="relative mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
                            <div v-for="fact in facts" :key="fact.label" class="dash-tile-soft flex items-center gap-2 px-2.5 py-2">
                                <span class="dash-icon-tile theme-icon h-7 w-7 shrink-0 text-xs"><i :class="fact.icon"></i></span>
                                <div class="min-w-0">
                                    <dd class="truncate text-sm font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ fact.value }}</dd>
                                    <dt class="truncate text-[10px] font-semibold text-slate-500 dark:text-slate-300">{{ fact.label }}</dt>
                                </div>
                            </div>
                        </dl>
                    </article>

                    <!-- Breakdown -->
                    <article class="ui-rise dash-card xl:col-span-5" style="animation-delay: 120ms">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <h2 class="dash-title">Attempt Breakdown</h2>
                                <p class="analysis-muted mt-1">{{ correctCount }} correct of {{ totalQuestions }} · {{ accuracyPercent }}% accuracy</p>
                            </div>
                            <span class="dash-icon-tile theme-icon h-10 w-10"><i class="pi pi-chart-pie"></i></span>
                        </div>

                        <!-- Stacked bar -->
                        <div class="mt-4 flex h-4 w-full gap-0.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div v-for="row in breakdownRows.filter((r) => r.share > 0)" :key="row.label" class="h-full transition-all duration-700" :class="row.barClass" :style="{ width: `${row.share}%` }" :title="`${row.label}: ${row.value}`"></div>
                        </div>

                        <ul class="mt-4 space-y-2">
                            <li v-for="row in breakdownRows" :key="row.label" class="dash-tile flex items-center gap-3">
                                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow" :class="row.barClass">
                                    <i :class="[row.icon, 'text-xs']"></i>
                                </span>
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-extrabold text-slate-900 dark:text-white">{{ row.label }}</p>
                                    <p class="text-[11px] text-slate-500 dark:text-slate-300">{{ row.detail }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-extrabold tabular-nums text-slate-900 dark:text-white">{{ row.value }}</p>
                                    <p class="text-[11px] tabular-nums text-slate-400">{{ row.share }}%</p>
                                </div>
                            </li>
                        </ul>
                    </article>
                </section>

                <!-- ================= QUESTION MAP + PACING ================= -->
                <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                    <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 180ms">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 class="dash-title">Question Map</h2>
                                <p class="analysis-muted mt-1">One tile per question in order. Hover for the outcome, click to review.</p>
                            </div>
                            <div class="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                <span class="inline-flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-sm bg-emerald-500"></span>Correct</span>
                                <span class="inline-flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-sm bg-rose-500"></span>Incorrect</span>
                                <span class="inline-flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-sm bg-slate-300 dark:bg-slate-600"></span>Unanswered</span>
                            </div>
                        </div>

                        <div class="dash-card-white mt-4">
                            <div class="grid gap-1.5" style="grid-template-columns: repeat(auto-fill, minmax(28px, 1fr))">
                                <button v-for="tile in questionMap" :key="tile.index" type="button" @click="reviewAnswers"
                                    class="flex h-7 items-center justify-center rounded-md text-[10px] font-black text-white transition hover:scale-110" :class="tile.cls"
                                    :title="`Q${tile.index}: ${tile.label}`">
                                    {{ tile.index }}
                                </button>
                            </div>
                        </div>

                        <div class="mt-3 grid gap-2 sm:grid-cols-3">
                            <div class="dash-tile-soft px-3 py-2">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Longest correct run</p>
                                <p class="text-base font-extrabold tabular-nums text-emerald-600 dark:text-emerald-300">{{ streaks.bestCorrect }} in a row</p>
                            </div>
                            <div class="dash-tile-soft px-3 py-2">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Longest miss run</p>
                                <p class="text-base font-extrabold tabular-nums text-rose-600 dark:text-rose-300">{{ streaks.bestMiss }} in a row</p>
                            </div>
                            <div class="dash-tile-soft px-3 py-2">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">First half vs second</p>
                                <p class="text-base font-extrabold tabular-nums text-slate-900 dark:text-white">{{ halves.first }}% → {{ halves.second }}%</p>
                            </div>
                        </div>
                    </article>

                    <article class="ui-rise dash-card xl:col-span-5" style="animation-delay: 240ms">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <h2 class="dash-title">Pacing</h2>
                                <p class="analysis-muted mt-1">How you spent your time on this attempt.</p>
                            </div>
                            <span class="dash-icon-tile theme-icon h-10 w-10"><i class="pi pi-stopwatch"></i></span>
                        </div>

                        <div class="dash-card-white mt-4 text-center">
                            <p class="text-3xl font-black tabular-nums text-slate-950 dark:text-white">{{ secondsToHms(timeTaken) }}</p>
                            <p class="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-300">total time</p>
                        </div>
                        <div class="mt-3 grid grid-cols-2 gap-2">
                            <div class="dash-tile-soft px-3 py-2">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Per question</p>
                                <p class="text-base font-extrabold tabular-nums text-slate-900 dark:text-white">{{ perQuestion }}</p>
                            </div>
                            <div class="dash-tile-soft px-3 py-2">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Pace</p>
                                <p class="text-base font-extrabold" :class="pace.cls">{{ pace.label }}</p>
                            </div>
                        </div>
                        <p class="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">{{ pace.detail }}</p>
                    </article>
                </section>

                <!-- ================= HISTORY ON THIS EXAM + NEXT STEPS ================= -->
                <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                    <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 300ms">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 class="dash-title">Your history on this exam</h2>
                                <p class="analysis-muted mt-1">{{ historyCopy }}</p>
                            </div>
                            <span v-if="previousAttempt" class="inline-flex items-center gap-1 text-xs font-bold" :class="historyDelta >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'">
                                <i :class="['pi text-[10px]', historyDelta >= 0 ? 'pi-arrow-up-right' : 'pi-arrow-down-right']"></i>
                                {{ historyDelta >= 0 ? "+" : "" }}{{ historyDelta }} vs previous
                            </span>
                        </div>

                        <div v-if="examHistory.length > 1" class="dash-card-white mt-4 p-3">
                            <div class="relative flex h-28 items-end gap-2">
                                <span class="pointer-events-none absolute left-0 right-0 border-t border-dashed border-slate-400/60" :style="{ bottom: `${passMark}%` }" title="Pass mark"></span>
                                <div v-for="h in examHistory" :key="h.id" class="group flex h-full flex-1 flex-col items-center justify-end gap-1" :title="`${h.score}% · ${formatDate(h.when)}`">
                                    <span class="text-[10px] font-bold tabular-nums text-slate-500 dark:text-slate-300">{{ h.score }}%</span>
                                    <div class="w-full rounded-t-md transition-all duration-700" :class="h.current ? 'theme-bar' : 'bg-slate-300 dark:bg-slate-600'" :style="{ height: `${Math.max(6, h.score)}%` }"></div>
                                    <span class="text-[9px] font-bold" :class="h.current ? 'theme-text' : 'text-slate-400'">{{ h.current ? "this" : h.short }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else class="dash-tile-soft mt-4 text-sm text-slate-600 dark:text-slate-300">
                            This is your first attempt at this exam. Retake it after reviewing and the comparison will appear here.
                        </div>

                        <div class="mt-3 grid grid-cols-3 gap-2">
                            <div class="dash-tile-soft px-3 py-2">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Attempts</p>
                                <p class="text-base font-extrabold tabular-nums text-slate-900 dark:text-white">{{ examHistory.length }}</p>
                            </div>
                            <div class="dash-tile-soft px-3 py-2">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Best</p>
                                <p class="text-base font-extrabold tabular-nums text-emerald-600 dark:text-emerald-300">{{ examBest }}%</p>
                            </div>
                            <div class="dash-tile-soft px-3 py-2">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Average</p>
                                <p class="text-base font-extrabold tabular-nums text-slate-900 dark:text-white">{{ examAverage }}%</p>
                            </div>
                        </div>
                    </article>

                    <article class="ui-rise dash-card xl:col-span-5" style="animation-delay: 360ms">
                        <div class="flex items-start gap-3">
                            <span class="dash-icon-tile h-10 w-10 bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"><i class="pi pi-lightbulb"></i></span>
                            <div>
                                <h2 class="dash-title">Next steps</h2>
                                <p class="analysis-muted mt-1">Based on this attempt.</p>
                            </div>
                        </div>
                        <ul class="mt-4 space-y-2">
                            <li v-for="step in nextSteps" :key="step.title" class="dash-tile flex gap-3">
                                <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white" :class="step.iconClass"><i :class="[step.icon, 'text-[11px]']"></i></span>
                                <div>
                                    <h3 class="text-sm font-extrabold text-slate-900 dark:text-white">{{ step.title }}</h3>
                                    <p class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-300">{{ step.detail }}</p>
                                </div>
                            </li>
                        </ul>
                        <div class="mt-4 flex flex-wrap gap-2">
                            <button type="button" @click="reviewAnswers" class="dash-btn theme-surface theme-shadow"><i class="pi pi-eye"></i> Review answers</button>
                            <button type="button" @click="openModal" class="dash-btn-ghost"><i class="pi pi-replay"></i> Retake exam</button>
                            <RouterLink :to="`${baseRoute}/previous-attempts`" class="dash-btn-ghost"><i class="pi pi-history"></i> All attempts</RouterLink>
                        </div>
                    </article>
                </section>
            </template>
        </div>

        <dialog ref="modalRef" class="modal">
            <div class="modal-box bg-white text-gray-900 dark:bg-sky-950 dark:text-white">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button>
                </form>
                <h3 class="mb-4 pr-8 text-lg">Start <span class="font-bold italic">{{ report?.exam?.name }}</span> in:</h3>
                <div class="flex flex-wrap justify-end gap-3">
                    <button type="button" class="dash-btn-ghost" @click="goToExam('tutor')">Tutor mode</button>
                    <button type="button" class="dash-btn theme-surface" @click="goToExam('exam')">Exam mode</button>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GuestSavePrompt from './GuestSavePrompt.vue'
import { useAuthStore } from '../stores/authStore'
import { normalizeText } from '../utils/normalizeText'
import { secondsToHms } from '../utils/secondsToHms'
import { average, clamp, scoreBarClass, scorePillClass, scoreToneClass } from '../utils/readiness'

type ResultItem = { correct: boolean; selected?: unknown }

const props = withDefaults(defineProps<{ product: string; productLabel: string; passMark?: number }>(), { passMark: 75 })

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const modalRef = ref<HTMLDialogElement | null>(null)
const report = ref<any>(null)
const loadError = ref('')
const siblingAttempts = ref<any[]>([])
const isGuest = computed(() => !authStore.is_authenticated)

const apiProduct = computed(() => props.product.replace(/^\/+/, ''))
const baseRoute = computed(() => `/${apiProduct.value}`)
const guestPromptProduct = computed(() => (apiProduct.value === 'nursing' || apiProduct.value === 'teas' ? apiProduct.value : undefined))
const attemptId = computed(() => String(route.params.attemptId ?? route.path.split('/').pop()))
const bigRing = 2 * Math.PI * 50

const fetchReport = async () => {
    loadError.value = ''
    try {
        const res = await axios.get(`/${apiProduct.value}/performance-report/${attemptId.value}`)
        report.value = res.data.data
    } catch (err) {
        console.error('Error fetching performance report:', err)
        report.value = null
        loadError.value = 'We could not load this report right now.'
        return
    }
    try {
        const res = await axios.get(`/${apiProduct.value}/previous-attempts`, { showLoader: false })
        siblingAttempts.value = Array.isArray(res.data?.data) ? res.data.data : []
    } catch {
        siblingAttempts.value = []
    }
}

onMounted(() => {
    if (!isGuest.value) fetchReport()
})
watch(isGuest, (guest) => {
    if (guest) {
        report.value = null
        return
    }
    fetchReport()
})
watch(attemptId, () => {
    if (!isGuest.value) fetchReport()
})

/* ---------- navigation ---------- */
const reviewAnswers = () => router.push(`${baseRoute.value}/exam/${attemptId.value}?mode=review`)
const resumeExam = () => {
    if (!report.value?.attempt_id) return
    router.push(`${baseRoute.value}/exam/${report.value.attempt_id}?resume=true`)
}
const openModal = () => modalRef.value?.showModal()
const goToExam = (mode: 'tutor' | 'exam') => {
    if (!report.value) return
    router.push(`${baseRoute.value}/exam/${report.value.exam.id}?mode=${mode}`)
    modalRef.value?.close()
}

/* ---------- results ---------- */
const parsedResults = computed<Record<string, ResultItem>>(() => {
    const raw = report.value?.results
    if (!raw) return {}
    if (typeof raw === 'object') return raw as Record<string, ResultItem>
    try {
        return JSON.parse(raw) as Record<string, ResultItem>
    } catch {
        return {}
    }
})

const orderedResults = computed(() =>
    Object.entries(parsedResults.value)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([key, item]) => ({ key, correct: item?.correct === true, incorrect: item?.correct === false })),
)

const correctCount = computed(() => orderedResults.value.filter((r) => r.correct).length)
const incorrectCount = computed(() => orderedResults.value.filter((r) => r.incorrect).length)
const attemptedCount = computed(() => orderedResults.value.length)
const totalQuestions = computed(() => {
    const fromExam = Number(report.value?.exam?.question_count ?? report.value?.exam?.questions_count ?? 0)
    return fromExam > 0 ? fromExam : attemptedCount.value
})
const unansweredCount = computed(() => Math.max(totalQuestions.value - attemptedCount.value, 0))
const accuracyPercent = computed(() => (totalQuestions.value ? Math.round((correctCount.value / totalQuestions.value) * 100) : 0))
const shareOf = (n: number) => (totalQuestions.value ? Math.round((n / totalQuestions.value) * 100) : 0)

const isCompleted = computed(() => Number(report.value?.completed) === 1 || report.value?.completed === true)
const score = computed(() => clamp(Number(report.value?.score) || 0))
const scoreRounded = computed(() => Math.round(score.value))
const scoreTone = computed(() => scoreToneClass(scoreRounded.value, props.passMark))
const scoreBar = computed(() => scoreBarClass(scoreRounded.value, props.passMark))
const scorePill = computed(() => scorePillClass(scoreRounded.value, props.passMark))
const gapText = computed(() => {
    const gap = scoreRounded.value - props.passMark
    if (gap === 0) return 'At the pass mark'
    return gap > 0 ? `${gap} pts above` : `${Math.abs(gap)} pts below`
})

const verdict = computed(() => {
    const s = scoreRounded.value
    if (s >= props.passMark + 10) return { label: 'Very high', headline: 'Comfortably above the pass mark.', detail: 'This is exam-ready territory. Protect it with timed mixed sets and keep reviewing the few misses.' }
    if (s >= props.passMark) return { label: 'Passing', headline: 'You cleared the pass mark.', detail: 'A solid result. Tightening the misses below turns a pass into a safe pass.' }
    if (s >= props.passMark - 15) return { label: 'Close', headline: 'Just under the pass mark.', detail: 'A focused review of the incorrect questions is likely enough to flip this on the retake.' }
    return { label: 'Below', headline: 'Below the pass mark for now.', detail: 'Treat this as a diagnostic. Rebuild the concepts behind the misses before retaking under time.' }
})

const facts = computed(() => [
    { label: 'Questions answered', value: `${attemptedCount.value} / ${totalQuestions.value}`, icon: 'pi pi-list' },
    { label: 'Mode', value: String(report.value?.mode || 'exam'), icon: 'pi pi-sliders-h' },
    { label: 'Time taken', value: secondsToHms(timeTaken.value), icon: 'pi pi-clock' },
    { label: 'Accuracy', value: `${accuracyPercent.value}%`, icon: 'pi pi-bullseye' },
])

const breakdownRows = computed(() => [
    { label: 'Correct', value: correctCount.value, share: shareOf(correctCount.value), detail: 'Answered correctly.', icon: 'pi pi-check', barClass: 'bg-emerald-500' },
    { label: 'Incorrect', value: incorrectCount.value, share: shareOf(incorrectCount.value), detail: 'Attempted but missed.', icon: 'pi pi-times', barClass: 'bg-rose-500' },
    { label: 'Unanswered', value: unansweredCount.value, share: shareOf(unansweredCount.value), detail: 'Left blank or not reached.', icon: 'pi pi-minus', barClass: 'bg-slate-400' },
])

/* ---------- question map ---------- */
const questionMap = computed(() => {
    const tiles = orderedResults.value.map((r, i) => ({
        index: i + 1,
        label: r.correct ? 'Correct' : r.incorrect ? 'Incorrect' : 'Unanswered',
        cls: r.correct ? 'bg-emerald-500' : r.incorrect ? 'bg-rose-500' : 'bg-slate-300 text-slate-600 dark:bg-slate-600 dark:text-slate-200',
    }))
    for (let i = tiles.length; i < totalQuestions.value; i += 1) {
        tiles.push({ index: i + 1, label: 'Unanswered', cls: 'bg-slate-300 text-slate-600 dark:bg-slate-600 dark:text-slate-200' })
    }
    return tiles
})

const streaks = computed(() => {
    let bestCorrect = 0, bestMiss = 0, runC = 0, runM = 0
    orderedResults.value.forEach((r) => {
        runC = r.correct ? runC + 1 : 0
        runM = r.incorrect ? runM + 1 : 0
        bestCorrect = Math.max(bestCorrect, runC)
        bestMiss = Math.max(bestMiss, runM)
    })
    return { bestCorrect, bestMiss }
})

const halves = computed(() => {
    const list = orderedResults.value
    const mid = Math.ceil(list.length / 2)
    const pct = (part: typeof list) => (part.length ? Math.round((part.filter((r) => r.correct).length / part.length) * 100) : 0)
    return { first: pct(list.slice(0, mid)), second: pct(list.slice(mid)) }
})

/* ---------- pacing ---------- */
const timeTaken = computed(() => Number(report.value?.time_taken) || 0)
const perQuestionSeconds = computed(() => (attemptedCount.value ? Math.round(timeTaken.value / attemptedCount.value) : 0))
const perQuestion = computed(() => (perQuestionSeconds.value ? `${perQuestionSeconds.value}s` : '—'))
const pace = computed(() => {
    const s = perQuestionSeconds.value
    if (!s) return { label: 'No timing', cls: 'text-slate-400', detail: 'Timing was not recorded for this attempt.' }
    if (s < 40) return { label: 'Fast', cls: 'text-amber-600 dark:text-amber-300', detail: `About ${s} seconds per question. Quick pace. If misses cluster, slow down and read the stem twice before choosing.` }
    if (s <= 90) return { label: 'On pace', cls: 'text-emerald-600 dark:text-emerald-300', detail: `About ${s} seconds per question, which matches typical exam pacing.` }
    return { label: 'Slow', cls: 'text-rose-600 dark:text-rose-300', detail: `About ${s} seconds per question. Practise committing sooner on questions you know, and flag the rest.` }
})

/* ---------- history on this exam ---------- */
const subTopicId = computed(() => Number(report.value?.sub_topic_id ?? report.value?.exam?.id ?? 0))
const attemptTs = (a: any) => {
    const t = new Date(a?.completed_at || a?.updated_at || a?.created_at || 0).getTime()
    return Number.isFinite(t) ? t : 0
}
const examHistory = computed(() => {
    const currentId = Number(report.value?.attempt_id)
    const list = siblingAttempts.value
        .filter((a) => Number(a?.sub_topic_id) === subTopicId.value && (Number(a?.completed) === 1 || a?.completed === true || Number(a?.attempt_id ?? a?.id) === currentId))
        .map((a) => ({ id: Number(a.attempt_id ?? a.id), score: clamp(Math.round(Number(a.score) || 0)), when: a.completed_at || a.created_at, ts: attemptTs(a) }))
        .sort((a, b) => a.ts - b.ts)
        .slice(-8)
    if (!list.some((a) => a.id === currentId) && report.value) {
        list.push({ id: currentId, score: scoreRounded.value, when: report.value.completed_at || report.value.created_at, ts: attemptTs(report.value) })
    }
    return list.map((a) => ({ ...a, current: a.id === currentId, short: a.ts ? new Date(a.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '' }))
})
const previousAttempt = computed(() => {
    const idx = examHistory.value.findIndex((a) => a.current)
    return idx > 0 ? examHistory.value[idx - 1] : null
})
const historyDelta = computed(() => (previousAttempt.value ? scoreRounded.value - previousAttempt.value.score : 0))
const examBest = computed(() => (examHistory.value.length ? Math.max(...examHistory.value.map((a) => a.score)) : scoreRounded.value))
const examAverage = computed(() => (examHistory.value.length ? Math.round(average(examHistory.value.map((a) => a.score))) : scoreRounded.value))
const historyCopy = computed(() => {
    if (examHistory.value.length <= 1) return 'First attempt on this exam.'
    if (historyDelta.value > 0) return `Up ${historyDelta.value} points on your previous attempt. The review is paying off.`
    if (historyDelta.value < 0) return `Down ${Math.abs(historyDelta.value)} points from your previous attempt. Worth a slower review pass.`
    return 'Same score as your previous attempt.'
})

/* ---------- next steps ---------- */
const nextSteps = computed(() => {
    const steps: { title: string; detail: string; icon: string; iconClass: string }[] = []
    if (!isCompleted.value) steps.push({ title: 'Finish the attempt', detail: `${unansweredCount.value} questions are still unanswered. Resume to get a complete score.`, icon: 'pi pi-play', iconClass: 'bg-amber-500' })
    if (incorrectCount.value > 0) steps.push({ title: `Review the ${incorrectCount.value} ${incorrectCount.value === 1 ? 'miss' : 'misses'}`, detail: 'Open review mode and read the rationale on every red tile before anything else.', icon: 'pi pi-eye', iconClass: 'bg-rose-500' })
    if (streaks.value.bestMiss >= 3) steps.push({ title: 'Break the miss streak pattern', detail: `You missed ${streaks.value.bestMiss} in a row at one point. Check whether it was one topic or a pacing dip.`, icon: 'pi pi-flag-fill', iconClass: 'bg-orange-500' })
    if (halves.value.second + 10 < halves.value.first && orderedResults.value.length >= 10) steps.push({ title: 'Watch late-exam fatigue', detail: `Accuracy fell from ${halves.value.first}% to ${halves.value.second}% in the second half. Build stamina with longer sets.`, icon: 'pi pi-clock', iconClass: 'bg-indigo-500' })
    if (scoreRounded.value >= props.passMark) steps.push({ title: 'Retake under exam mode', detail: 'Confirm the result holds with a timed retake in a few days.', icon: 'pi pi-replay', iconClass: 'bg-emerald-500' })
    else steps.push({ title: 'Retake in tutor mode', detail: 'Rationales after each question fix patterns fastest when you are under the pass mark.', icon: 'pi pi-book', iconClass: 'bg-sky-500' })
    return steps.slice(0, 4)
})

function formatDate(dateStr?: string) {
    if (!dateStr) return 'date not recorded'
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return 'date not recorded'
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

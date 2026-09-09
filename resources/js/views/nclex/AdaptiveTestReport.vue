<template>
    <div class="dash-shell">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <!-- ================= HEADER + SNAPSHOT ================= -->
            <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
                <article class="ui-rise rounded-2xl p-5 xl:col-span-8">
                    <p class="dash-eyebrow theme-text inline-flex items-center gap-2">
                        <span class="relative flex h-2 w-2">
                            <span class="theme-dot absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"></span>
                            <span class="theme-dot relative inline-flex h-2 w-2 rounded-full"></span>
                        </span>
                        NCLEX CAT Report
                    </p>
                    <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                        Adaptive Test Report
                    </h1>
                    <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Review your adaptive score, difficulty movement, and subject-level performance before the next
                        CAT run.
                    </p>

                    <div class="mt-5 flex flex-wrap gap-2">
                        <RouterLink to="/nclex/cat" class="dash-chip theme-soft theme-focus"><i class="pi pi-desktop"></i> CAT Simulator</RouterLink>
                        <RouterLink to="/nclex/performance-analysis" class="dash-chip theme-soft theme-focus"><i class="pi pi-chart-line"></i> Analysis</RouterLink>
                        <RouterLink to="/nclex/previous-attempts" class="dash-chip theme-soft theme-focus"><i class="pi pi-history"></i> History</RouterLink>
                        <RouterLink to="/nclex" class="dash-chip theme-soft theme-focus"><i class="pi pi-gauge"></i> Dashboard</RouterLink>
                    </div>
                </article>

                <aside class="ui-rise xl:col-span-4" style="animation-delay: 80ms">
                    <div class="flex h-full items-center justify-between gap-4 rounded-2xl border-b bg-sky-800 p-5 shadow-custom">
                        <div>
                            <span
                                class="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-bright-sun-500 ring-1 ring-white/20">
                                Adaptive snapshot
                            </span>
                            <p class="mt-3 text-lg font-extrabold leading-tight text-white">
                                {{ isLoading ? "Loading report..." : reportSnapshot }}
                            </p>
                        </div>
                        <div class="radial-progress shrink-0 bg-white/95 text-sm font-extrabold shadow-custom"
                            :class="scoreRingClass" :style="{ '--value': scoreRounded }" role="progressbar">
                            {{ scoreRounded }}%
                        </div>
                    </div>
                </aside>
            </section>

            <div v-if="isLoading" class="grid gap-4 xl:grid-cols-12">
                <div class="h-80 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60 xl:col-span-4"></div>
                <div class="h-80 animate-pulse rounded-2xl bg-white/80 dark:bg-sky-950/60 xl:col-span-8"></div>
            </div>

            <div v-else-if="!attempt" class="analysis-state-error">This adaptive report could not be loaded.</div>

            <template v-else>
                <!-- ================= SCORE + ANALYSIS ================= -->
                <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                    <article class="ui-rise dash-card xl:col-span-4" style="animation-delay: 120ms">
                        <div class="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-50" aria-hidden="true"></div>
                        <div class="relative flex flex-col items-center text-center">
                            <div class="relative h-40 w-40">
                                <svg class="h-40 w-40 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" stroke-width="10" class="text-slate-200 dark:text-slate-700" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"
                                        :stroke-dasharray="bigRing" :stroke-dashoffset="bigRing * (1 - scoreRounded / 100)" :class="scoreRingClass"
                                        class="transition-[stroke-dashoffset] duration-1000 ease-out" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" stroke-width="12"
                                        :stroke-dasharray="`2 ${bigRing - 2}`" :stroke-dashoffset="bigRing * (1 - PASS_THRESHOLD / 100)" class="text-slate-600 dark:text-slate-200" />
                                </svg>
                                <div class="absolute inset-0 flex flex-col items-center justify-center leading-none">
                                    <span class="text-4xl font-black tabular-nums text-slate-950 dark:text-white">{{ scoreRounded }}%</span>
                                    <span class="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">threshold {{ PASS_THRESHOLD }}%</span>
                                </div>
                            </div>

                            <span class="analysis-pill mt-4 border px-5 py-2 text-sm font-extrabold" :class="statusPillClass">{{ statusLabel }}</span>
                            <p class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
                                Completed {{ formatDate(displayAttempt.completed_at) }}
                            </p>
                        </div>

                        <dl class="relative mt-5 grid grid-cols-2 gap-2">
                            <div v-for="metric in scoreSummaryCards" :key="metric.label" class="dash-tile-soft px-3 py-2">
                                <dt class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ metric.label }}</dt>
                                <dd class="mt-0.5 truncate text-sm font-extrabold tabular-nums text-slate-950 dark:text-white">{{ metric.value }}</dd>
                            </div>
                        </dl>
                    </article>

                    <article class="ui-rise dash-card xl:col-span-8" style="animation-delay: 160ms">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 class="dash-title">Performance Analysis</h2>
                                <p class="analysis-muted mt-1">Adaptive metrics explain how the run moved and where to focus next.</p>
                            </div>
                            <span class="analysis-pill theme-soft border">
                                {{ totalAdaptiveAttempts }} CAT {{ totalAdaptiveAttempts === 1 ? "attempt" : "attempts" }}
                            </span>
                        </div>

                        <div class="dash-card-white mt-4">
                            <div class="flex items-start gap-3">
                                <span class="dash-icon-tile h-11 w-11 bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                                    <i class="pi pi-comment"></i>
                                </span>
                                <div>
                                    <h3 class="font-extrabold text-slate-950 dark:text-white">{{ remarksTitle }}</h3>
                                    <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ remarksCopy }}</p>
                                    <p v-if="weakestSubject" class="mt-2 inline-flex items-center gap-1.5 rounded-full border theme-soft px-3 py-1 text-[11px] font-bold">
                                        <i class="pi pi-flag-fill text-[10px] text-rose-500"></i>
                                        Weakest subject: {{ weakestSubject.name }} at {{ Math.round(weakestSubject.percentage) }}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <!-- Final difficulty gauge -->
                            <div class="dash-card-white">
                                <div class="flex items-center justify-between gap-3">
                                    <span class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Final difficulty</span>
                                    <span class="dash-icon-tile theme-icon h-8 w-8 text-sm"><i class="pi pi-sliders-v"></i></span>
                                </div>
                                <p class="mt-2 text-2xl font-extrabold tabular-nums text-slate-950 dark:text-white">
                                    {{ finalDifficulty }}<span class="text-sm font-bold text-slate-400">/100</span>
                                </p>
                                <div class="dash-progress mt-3 h-2.5 bg-light-blue-500">
                                    <div class="h-full rounded-full theme-bar transition-all duration-700" :style="{ width: `${finalDifficulty}%` }"></div>
                                </div>
                                <p class="mt-2 text-[11px] text-slate-500 dark:text-slate-300">{{ difficultyCopy }}</p>
                            </div>

                            <!-- Theta scale -->
                            <div class="dash-card-white">
                                <div class="flex items-center justify-between gap-3">
                                    <span class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Ability theta</span>
                                    <span class="dash-icon-tile theme-icon h-8 w-8 text-sm"><i class="pi pi-wave-pulse"></i></span>
                                </div>
                                <p class="mt-2 text-2xl font-extrabold tabular-nums text-slate-950 dark:text-white">{{ thetaDisplay }}</p>
                                <div class="relative mt-3 h-2.5 rounded-full bg-linear-to-r from-rose-300 via-amber-300 to-emerald-400">
                                    <span class="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-slate-500/60" style="left: 50%"></span>
                                    <span class="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-900 shadow transition-all duration-700 dark:border-slate-900 dark:bg-white"
                                        :style="{ left: `${thetaPercent}%` }"></span>
                                </div>
                                <div class="mt-1 flex justify-between text-[9px] font-bold text-slate-400"><span>-3</span><span>0</span><span>+3</span></div>
                                <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-300">{{ thetaCopy }}</p>
                            </div>
                        </div>

                        <!-- Run comparison -->
                        <div v-if="runHistory.length > 1" class="dash-tile mt-4">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Your CAT runs</p>
                                    <p class="text-sm font-extrabold text-slate-900 dark:text-white">{{ runComparisonCopy }}</p>
                                </div>
                                <span v-if="previousRunDelta !== null" class="inline-flex items-center gap-1 text-xs font-bold" :class="previousRunDelta >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'">
                                    <i :class="['pi text-[10px]', previousRunDelta >= 0 ? 'pi-arrow-up-right' : 'pi-arrow-down-right']"></i>
                                    {{ previousRunDelta >= 0 ? "+" : "" }}{{ previousRunDelta }} vs previous run
                                </span>
                            </div>
                            <div class="relative mt-3 flex h-20 items-end gap-2">
                                <span class="pointer-events-none absolute left-0 right-0 border-t border-dashed border-slate-400/60" :style="{ bottom: `${PASS_THRESHOLD}%` }"></span>
                                <div v-for="run in runHistory" :key="run.id" class="flex h-full flex-1 cursor-pointer flex-col items-center justify-end gap-1"
                                    :title="`${run.score}% · ${formatDate(run.when)}`" @click="run.current ? null : router.push(`/nclex/adaptive-report/${run.id}`)">
                                    <span class="text-[10px] font-bold tabular-nums text-slate-500 dark:text-slate-300">{{ run.score }}%</span>
                                    <div class="w-full rounded-t-md transition-all duration-700" :class="run.current ? 'theme-bar' : run.score >= PASS_THRESHOLD ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-rose-300 dark:bg-rose-800'"
                                        :style="{ height: `${Math.max(6, run.score)}%` }"></div>
                                    <span class="text-[9px] font-bold" :class="run.current ? 'theme-text' : 'text-slate-400'">{{ run.current ? "this" : run.short }}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>

                <!-- ================= SUBJECT PERFORMANCE ================= -->
                <section class="ui-rise dash-card" style="animation-delay: 220ms">
                    <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 class="dash-title">Subject Performance</h2>
                            <p class="analysis-muted mt-1">Subject trends from this adaptive run, weakest first.</p>
                        </div>
                        <span class="analysis-pill theme-soft border">{{ subjectScores.length }} sections</span>
                    </div>

                    <div v-if="subjectScores.length > 0" class="grid gap-3 md:grid-cols-2">
                        <article v-for="(subject, index) in sortedSubjects" :key="subject.id"
                            class="dash-card-white dash-hover-lift ui-rise flex items-center gap-3" :style="{ animationDelay: `${260 + index * 40}ms` }">
                            <div class="relative h-14 w-14 shrink-0">
                                <svg class="h-14 w-14 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
                                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="5" class="text-slate-200 dark:text-slate-700" />
                                    <circle cx="24" cy="24" r="20" fill="none" :stroke="subject.barColor" stroke-width="5" stroke-linecap="round"
                                        :stroke-dasharray="smallRing" :stroke-dashoffset="smallRing * (1 - Math.min(100, subject.percentage) / 100)"
                                        class="transition-[stroke-dashoffset] duration-1000 ease-out" />
                                </svg>
                                <span class="absolute inset-0 flex items-center justify-center text-xs font-black tabular-nums" :class="subjectScoreClass(subject.percentage)">
                                    {{ Math.round(subject.percentage) }}%
                                </span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="truncate text-sm font-extrabold text-slate-950 dark:text-white">{{ subject.name }}</h3>
                                <p class="text-[11px] text-slate-500 dark:text-slate-300">{{ subject.correct }} correct out of {{ subject.total }}</p>
                                <div class="dash-progress mt-2 h-1.5 bg-light-blue-500">
                                    <div class="h-full rounded-full transition-all duration-700" :style="{ width: `${Math.round(subject.percentage)}%`, backgroundColor: subject.barColor }"></div>
                                </div>
                            </div>
                            <span v-if="index === 0 && subject.percentage < PASS_THRESHOLD" class="analysis-pill border border-rose-200 bg-rose-50 text-[10px] text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">Focus</span>
                        </article>
                    </div>
                    <div v-else class="dash-card-white border-dashed p-10 text-center text-sm font-semibold text-slate-500 dark:text-slate-300">
                        No subject-specific data available for this attempt.
                    </div>
                </section>

                <div class="ui-rise flex flex-wrap justify-end gap-2" style="animation-delay: 300ms">
                    <RouterLink to="/nclex/cat" class="dash-btn-ghost px-5 py-2.5"><i class="pi pi-arrow-left"></i> Back to CAT</RouterLink>
                    <RouterLink to="/nclex/cat" class="dash-btn theme-surface theme-shadow px-5 py-2.5"><i class="pi pi-refresh"></i> Start another CAT</RouterLink>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const PASS_THRESHOLD = 65

const route = useRoute()
const router = useRouter()
const attempt = ref<any>(null)
const attempts = ref<any[]>([])
const isLoading = ref(true)

const displayAttempt = computed(() => {
    if (attempt.value) {
        return attempt.value
    }

    return {
        score: 0,
        suspend_index: 0,
        completed_at: new Date().toISOString(),
        time_taken: 0,
        mode: 'exam',
        final_difficulty: 0,
        theta: 0,
    }
})

onMounted(async () => {
    try {
        const attemptId = route.params.id
        const { data } = await axios.get(`/nclex/cat-attempts/${attemptId}`)
        attempt.value = data.data
    } catch (error) {
        console.error('Error loading report:', error)
        attempt.value = null
    } finally {
        isLoading.value = false
    }

    try {
        const { data } = await axios.get('/nclex/cat-attempts')
        attempts.value = data.data || []
    } catch (error) {
        console.error('Error loading attempt history:', error)
    }
})

const scoreRounded = computed(() => Math.round(Number(displayAttempt.value.score || 0)))
const passed = computed(() => scoreRounded.value >= PASS_THRESHOLD)
const statusLabel = computed(() => passed.value ? 'PASSED' : 'NEEDS REVIEW')
const totalAdaptiveAttempts = computed(() => attempts.value.length)
const thetaDisplay = computed(() => {
    const theta = Number(displayAttempt.value.theta)
    return Number.isFinite(theta) ? theta.toFixed(2) : '0.00'
})

const scoreRingClass = computed(() => {
    if (!attempt.value) return 'text-slate-400'
    return passed.value ? 'text-emerald-600' : 'text-rose-600'
})

const statusPillClass = computed(() =>
    passed.value
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200'
        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-200'
)

const scoreSummaryCards = computed(() => [
    { label: 'Questions', value: `${displayAttempt.value.suspend_index || 0}/150` },
    { label: 'Date', value: formatDate(displayAttempt.value.completed_at) },
    { label: 'Time', value: formatTime(Number(displayAttempt.value.time_taken || 0)) },
    { label: 'Mode', value: String(displayAttempt.value.mode || 'exam').toUpperCase() },
])

const reportSnapshot = computed(() => {
    if (!attempt.value) return 'Report unavailable.'
    return `${scoreRounded.value}% scored on ${formatDate(displayAttempt.value.completed_at)}.`
})

const remarksTitle = computed(() => {
    if (scoreRounded.value >= 80) return 'Excellent adaptive performance'
    if (scoreRounded.value >= PASS_THRESHOLD) return 'Strong CAT performance'
    if (scoreRounded.value >= 50) return 'Progress with clear targets'
    return 'Fundamentals need reinforcement'
})

const remarksCopy = computed(() => {
    if (scoreRounded.value >= 80) {
        return 'You demonstrated strong readiness across this adaptive run. Keep reviewing rationales so accuracy stays durable under pressure.'
    }

    if (scoreRounded.value >= PASS_THRESHOLD) {
        return 'You passed this adaptive run. Use the subject breakdown to polish weaker areas before taking another CAT.'
    }

    if (scoreRounded.value >= 50) {
        return 'You are close enough for targeted remediation to matter. Review lower-scoring subjects, then retest after focused practice.'
    }

    return 'This run points to larger knowledge gaps. Rebuild fundamentals with tutor mode and short linear sets before another adaptive attempt.'
})

const bigRing = 2 * Math.PI * 50
const smallRing = 2 * Math.PI * 20

const finalDifficulty = computed(() => Math.max(0, Math.min(100, Math.round(Number(displayAttempt.value.final_difficulty) || 0))))
const difficultyCopy = computed(() => {
    const d = finalDifficulty.value
    if (d >= 70) return 'The engine pushed you into hard items, a strong sign.'
    if (d >= 45) return 'You settled around mid-level difficulty.'
    return 'Difficulty stayed low; accuracy on easier items needs work first.'
})

const thetaPercent = computed(() => {
    const theta = Number(displayAttempt.value.theta)
    if (!Number.isFinite(theta)) return 50
    return Math.max(0, Math.min(100, ((theta + 3) / 6) * 100))
})
const thetaCopy = computed(() => {
    const theta = Number(displayAttempt.value.theta)
    if (!Number.isFinite(theta)) return 'Ability estimate unavailable.'
    if (theta >= 1) return 'Well above the average candidate.'
    if (theta >= 0) return 'At or slightly above average ability.'
    if (theta >= -1) return 'Slightly below average; targeted review should lift this.'
    return 'Below average; rebuild fundamentals before another run.'
})

const attemptTime = (a: any) => {
    const t = new Date(a?.completed_at || a?.created_at || 0).getTime()
    return Number.isFinite(t) ? t : 0
}
const runHistory = computed(() => {
    const currentId = Number(displayAttempt.value?.id ?? route.params.id)
    const list = [...attempts.value]
        .map((a) => ({ id: Number(a.id), score: Math.max(0, Math.min(100, Math.round(Number(a.score) || 0))), when: a.completed_at || a.created_at, ts: attemptTime(a) }))
        .sort((a, b) => a.ts - b.ts)
        .slice(-8)
    if (!list.some((a) => a.id === currentId) && attempt.value) {
        list.push({ id: currentId, score: scoreRounded.value, when: displayAttempt.value.completed_at, ts: attemptTime(displayAttempt.value) })
    }
    return list.map((a) => ({ ...a, current: a.id === currentId, short: a.ts ? new Date(a.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '' }))
})
const previousRunDelta = computed(() => {
    const idx = runHistory.value.findIndex((r) => r.current)
    if (idx <= 0) return null
    return runHistory.value[idx].score - runHistory.value[idx - 1].score
})
const runComparisonCopy = computed(() => {
    const scores = runHistory.value.map((r) => r.score)
    const best = Math.max(...scores)
    if (scoreRounded.value >= best) return 'Your best CAT run so far.'
    return `Best run ${best}%. Average ${Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)}%.`
})

const safeJsonParse = (value: unknown) => {
    if (!value) return null
    if (typeof value === 'string') {
        try {
            return JSON.parse(value)
        } catch {
            return null
        }
    }
    return value
}

const subjectNameMap = computed<Record<string, string>>(() => {
    const parsed = safeJsonParse(attempt.value?.subject_name_map)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return {}
    }

    return Object.entries(parsed as Record<string, unknown>).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && String(value).trim().length > 0) {
            acc[String(key)] = String(value)
        }
        return acc
    }, {} as Record<string, string>)
})

const resolveSubjectName = (
    idCandidate: string | number | undefined,
    fallbackKey: string | number | undefined,
) => {
    const candidates = [idCandidate, fallbackKey]
        .map((candidate) => (candidate === null || candidate === undefined ? null : String(candidate)))
        .filter((candidate): candidate is string => !!candidate)

    for (const key of candidates) {
        const matched = subjectNameMap.value[key]
        if (matched) {
            return matched
        }
    }

    return null
}

const deriveDefaultSectionName = (fallbackKey: string | number | undefined) => {
    const mappedName = resolveSubjectName(fallbackKey, fallbackKey)
    if (mappedName) {
        return mappedName
    }

    if (fallbackKey === null || fallbackKey === undefined) {
        return 'Section'
    }

    const label = String(fallbackKey)
    return /^\d+$/.test(label) ? `Subject ${label}` : `Section ${label}`
}

const normalizeSectionEntry = (section: any, fallbackKey: string | number | undefined) => {
    const correct = Number(section?.correct ?? section?.correct_answers ?? section?.correct_count ?? 0) || 0
    let total = Number(section?.total ?? section?.total_questions ?? section?.questions ?? 1) || 1
    if (total <= 0) total = 1
    const sectionId = section?.subject_id ?? section?.id ?? fallbackKey
    const name = section?.name
        ?? section?.title
        ?? section?.label
        ?? resolveSubjectName(sectionId, fallbackKey)
        ?? deriveDefaultSectionName(fallbackKey)
    const id = sectionId ?? name
    const percentage = (correct / total) * 100

    const barColor = percentage >= 80 ? '#10b981' :
        percentage >= PASS_THRESHOLD ? '#3b82f6' :
            percentage >= 50 ? '#eab308' : '#ef4444'

    return { id, name, correct, total, percentage, barColor }
}

const parseSectionsPayload = (payload: unknown) => {
    const parsed = safeJsonParse(payload)
    if (!parsed) return []

    if (Array.isArray(parsed)) {
        return parsed.map((section, index) => normalizeSectionEntry(section ?? {}, index + 1))
    }

    if (typeof parsed === 'object') {
        return Object.entries(parsed).map(([key, section]) => normalizeSectionEntry(section ?? {}, key))
    }

    return []
}

const subjectScores = computed(() => {
    if (!attempt.value) return []

    const sectionsPayload = attempt.value.sections
    const fallbackPayload = attempt.value.subject_scores

    const primaryEntries = parseSectionsPayload(sectionsPayload ?? fallbackPayload)
    if (primaryEntries.length) {
        return primaryEntries.sort((a, b) => b.percentage - a.percentage)
    }

    if (sectionsPayload && fallbackPayload && fallbackPayload !== sectionsPayload) {
        const fallbackEntries = parseSectionsPayload(fallbackPayload)
        if (fallbackEntries.length) {
            return fallbackEntries.sort((a, b) => b.percentage - a.percentage)
        }
    }

    return []
})

const sortedSubjects = computed(() => [...subjectScores.value].sort((a, b) => a.percentage - b.percentage))
const weakestSubject = computed(() => {
    const first = sortedSubjects.value[0]
    return first && first.percentage < PASS_THRESHOLD ? first : null
})

function subjectScoreClass(percentage: number) {
    if (percentage >= 80) return 'text-emerald-600 dark:text-emerald-300'
    if (percentage >= PASS_THRESHOLD) return 'text-blue-600 dark:text-blue-300'
    if (percentage >= 50) return 'text-amber-600 dark:text-amber-300'
    return 'text-rose-600 dark:text-rose-300'
}

function formatDate(date?: string | null) {
    if (!date) return 'No date recorded'

    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return 'No date recorded'

    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
        return `${hours}h ${minutes}m`
    }
    return `${minutes}m ${secs}s`
}
</script>

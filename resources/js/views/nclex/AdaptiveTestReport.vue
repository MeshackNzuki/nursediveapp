<template>
    <div
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-white-500 p-4 text-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh]">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
                <article class="rounded-2xl p-5 xl:col-span-8">
                    <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-200">
                        NCLEX CAT Report
                    </p>
                    <h1 class="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                        Adaptive Test Report
                    </h1>
                    <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Review your adaptive score, difficulty movement, and subject-level performance before the next
                        CAT run.
                    </p>

                    <div class="mt-5 flex flex-wrap gap-2">
                        <RouterLink to="/nclex/cat"
                            class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                            <i class="pi pi-desktop"></i>
                            CAT Simulator
                        </RouterLink>
                        <RouterLink to="/nclex/performance-analysis"
                            class="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-200">
                            <i class="pi pi-chart-line"></i>
                            Analysis
                        </RouterLink>
                        <RouterLink to="/nclex"
                            class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-sky-800 dark:text-slate-100 dark:hover:bg-sky-900">
                            <i class="pi pi-gauge"></i>
                            Dashboard
                        </RouterLink>
                    </div>
                </article>

                <aside class="xl:col-span-4">
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

            <div v-if="isLoading"
                class="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm dark:border-sky-800 dark:bg-sky-900 dark:text-slate-300">
                Loading adaptive report...
            </div>

            <div v-else-if="!attempt"
                class="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-sm font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
                This adaptive report could not be loaded.
            </div>

            <template v-else>
                <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                    <article
                        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900 xl:col-span-4">
                        <div class="flex flex-col items-center text-center">
                            <div class="radial-progress bg-light-blue-500 text-3xl font-extrabold shadow-sm dark:bg-sky-950/60"
                                :class="scoreRingClass" :style="{ '--value': scoreRounded, '--size': '9rem', '--thickness': '10px' }"
                                role="progressbar">
                                {{ scoreRounded }}%
                            </div>

                            <span class="mt-5 rounded-full px-5 py-2 text-sm font-extrabold" :class="statusPillClass">
                                {{ statusLabel }}
                            </span>
                            <p class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
                                Completed {{ formatDate(displayAttempt.completed_at) }}
                            </p>
                        </div>

                        <dl class="mt-6 grid gap-3 text-sm">
                            <div v-for="metric in scoreSummaryCards" :key="metric.label"
                                class="flex items-center justify-between rounded-xl bg-light-blue-500 px-3 py-2 dark:bg-sky-950/60">
                                <dt class="font-semibold text-slate-500 dark:text-slate-300">{{ metric.label }}</dt>
                                <dd class="font-extrabold text-slate-950 dark:text-white">{{ metric.value }}</dd>
                            </div>
                        </dl>
                    </article>

                    <article
                        class="rounded-2xl border border-slate-200 bg-light-blue-500 p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900 xl:col-span-8">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 class="text-lg font-extrabold text-slate-950 dark:text-white">Performance Analysis</h2>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                                    Adaptive metrics explain how the run moved and where to focus next.
                                </p>
                            </div>
                            <span class="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-bold text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
                                {{ totalAdaptiveAttempts }} CAT {{ totalAdaptiveAttempts === 1 ? "attempt" : "attempts" }}
                            </span>
                        </div>

                        <div class="mt-5 rounded-xl border border-sky-100 bg-white p-4 shadow-custom dark:border-sky-800 dark:bg-sky-950/60">
                            <div class="flex items-start gap-3">
                                <span
                                    class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100 dark:bg-sky-900/70 dark:text-sky-200 dark:ring-sky-800">
                                    <i class="pi pi-comment"></i>
                                </span>
                                <div>
                                    <h3 class="font-bold text-slate-950 dark:text-white">{{ remarksTitle }}</h3>
                                    <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                        {{ remarksCopy }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div class="rounded-xl border border-sky-100 bg-white p-4 dark:border-sky-800 dark:bg-sky-950/60">
                                <div class="flex items-center justify-between gap-3">
                                    <span class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                        Final Difficulty
                                    </span>
                                    <i class="pi pi-sliders-v text-sky-600 dark:text-sky-300"></i>
                                </div>
                                <p class="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">
                                    {{ displayAttempt.final_difficulty || 0 }}/100
                                </p>
                            </div>

                            <div class="rounded-xl border border-sky-100 bg-white p-4 dark:border-sky-800 dark:bg-sky-950/60">
                                <div class="flex items-center justify-between gap-3">
                                    <span class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                        Ability Theta
                                    </span>
                                    <i class="pi pi-wave-pulse text-emerald-600 dark:text-emerald-300"></i>
                                </div>
                                <p class="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">
                                    {{ thetaDisplay }}
                                </p>
                            </div>
                        </div>
                    </article>
                </section>

                <section
                    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
                    <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Subject Performance</h2>
                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                                Subject trends from this adaptive run.
                            </p>
                        </div>
                        <span
                            class="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
                            {{ subjectScores.length }} sections
                        </span>
                    </div>

                    <div v-if="subjectScores.length > 0" class="space-y-4">
                        <article v-for="subject in subjectScores" :key="subject.id"
                            class="rounded-xl border border-slate-200 bg-light-blue-500 p-4 dark:border-sky-800 dark:bg-sky-950/60">
                            <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
                                <div class="min-w-0">
                                    <h3 class="font-bold text-slate-950 dark:text-white">{{ subject.name }}</h3>
                                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">
                                        {{ subject.correct }} correct out of {{ subject.total }}
                                    </p>
                                </div>
                                <span class="font-extrabold" :class="subjectScoreClass(subject.percentage)">
                                    {{ Math.round(subject.percentage) }}%
                                </span>
                            </div>
                            <div class="h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-sky-100 dark:bg-slate-800 dark:ring-sky-800">
                                <div :style="{ width: `${Math.round(subject.percentage)}%`, backgroundColor: subject.barColor }"
                                    class="h-full rounded-full transition-all duration-500"></div>
                            </div>
                        </article>
                    </div>
                    <div v-else
                        class="rounded-xl border border-dashed border-slate-300 bg-light-blue-500 p-10 text-center text-slate-500 dark:border-sky-800 dark:bg-sky-950/60 dark:text-slate-300">
                        No subject-specific data available for this attempt.
                    </div>
                </section>

                <div class="flex flex-wrap justify-end gap-3">
                    <CommonButton button-text="Back to CAT" icon="pi pi-arrow-left"
                        classes="border border-slate-200 bg-white text-slate-700 shadow-none hover:bg-slate-100 dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100 dark:hover:bg-sky-900"
                        :action="() => router.push('/nclex/cat')" />
                    <CommonButton button-text="Start Another CAT" icon="pi pi-refresh"
                        classes="bg-sky-500 text-white shadow-none hover:bg-sky-600"
                        :action="() => router.push('/nclex/cat')" />
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import CommonButton from '../../components/Buttons/CommonButton.vue'

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

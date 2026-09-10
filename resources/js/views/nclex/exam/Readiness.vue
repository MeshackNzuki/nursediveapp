<template>
    <div class="dash-shell">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
                <article class="ui-rise rounded-2xl p-5 xl:col-span-8">
                    <p class="dash-eyebrow theme-text inline-flex items-center gap-2">
                        <span class="relative flex h-2 w-2">
                            <span class="theme-dot absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"></span>
                            <span class="theme-dot relative inline-flex h-2 w-2 rounded-full"></span>
                        </span>
                        NCLEX Readiness
                    </p>
                    <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                        Readiness Assessment Tests
                    </h1>
                    <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Timed exam-mode checks to measure exam-day consistency, pacing, and confidence under pressure.
                    </p>

                    <div class="mt-5 flex flex-wrap gap-2">
                        <RouterLink to="/nclex"
                            class="dash-chip theme-soft theme-focus">
                            <i class="pi pi-gauge"></i>
                            Dashboard
                        </RouterLink>
                        <RouterLink to="/nclex/linear"
                            class="dash-chip theme-soft theme-focus">
                            <i class="pi pi-book"></i>
                            Linear
                        </RouterLink>
                        <RouterLink to="/nclex/cat"
                            class="dash-chip theme-soft theme-focus">
                            <i class="pi pi-desktop"></i>
                            CAT
                        </RouterLink>
                    </div>
                </article>

                <aside class="ui-rise xl:col-span-4" style="animation-delay: 80ms">
                    <div class="dash-card grid h-full gap-2 p-4 sm:grid-cols-3 xl:grid-cols-1 xl:content-center">
                        <div class="pointer-events-none absolute -top-14 -right-14 h-40 w-40 rounded-full blur-3xl theme-glow opacity-50" aria-hidden="true"></div>
                        <p class="dash-eyebrow theme-text relative sm:col-span-3 xl:col-span-1">Snapshot</p>
                        <div class="dash-tile-soft flex items-center gap-3 px-3 py-2.5">
                            <span class="dash-icon-tile theme-icon h-9 w-9 shrink-0 text-sm"><i class="pi pi-bullseye"></i></span>
                            <div class="min-w-0">
                                <p class="text-lg font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ exams.length }}</p>
                                <p class="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-300">Readiness sets · Available checks</p>
                            </div>
                        </div>
                        <div class="dash-tile-soft flex items-center gap-3 px-3 py-2.5">
                            <span class="dash-icon-tile theme-icon h-9 w-9 shrink-0 text-sm"><i class="pi pi-pencil"></i></span>
                            <div class="min-w-0">
                                <p class="text-lg font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ attemptedCount }}</p>
                                <p class="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-300">Attempted · With saved scores</p>
                            </div>
                        </div>
                        <div class="dash-tile-soft flex items-center gap-3 px-3 py-2.5">
                            <span class="dash-icon-tile theme-icon h-9 w-9 shrink-0 text-sm"><i class="pi pi-percentage"></i></span>
                            <div class="min-w-0">
                                <p class="text-lg font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ averageScore }}%</p>
                                <p class="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-300">Avg. score · Across attempted sets</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            <section class="ui-rise dash-card" style="animation-delay: 160ms">
                <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 class="dash-title">
                            {{ subject || "Readiness assessments" }}
                        </h2>
                        <p class="text-xs text-slate-500 dark:text-slate-300">
                            Readiness tests run in exam mode so the score reflects timed decision-making.
                        </p>
                    </div>
                    <div class="relative lg:w-80">
                        <i class="pi pi-search pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                        <input v-model="searchTerm" type="search" :placeholder="`Search ${subject || 'readiness sets'}...`"
                            class="theme-focus h-10 w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 focus:outline-none dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100" />
                    </div>
                </div>

                <div v-if="filteredExams.length === 0 && searchTerm === ''"
                    class="dash-card-white border-dashed p-10 text-center text-sm font-semibold text-slate-500 dark:text-slate-300">
                    Loading exams...
                </div>
                <div v-else-if="filteredExams.length === 0"
                    class="dash-card-white border-dashed p-10 text-center text-sm font-semibold text-slate-500 dark:text-slate-300">
                    No exams found for that search.
                </div>

                <transition-group v-else name="fade" tag="div" class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
                    appear>
                    <article v-for="exam in filteredExams" :key="exam.id" :class="[
                        'group dash-card-white flex h-full flex-col',
                        isExamLocked(exam) ? 'opacity-80' : 'dash-hover-lift'
                    ]">
                        <div class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 theme-glow group-hover:opacity-100" aria-hidden="true"></div>
                        <div class="relative flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <h3 class="font-bold leading-tight text-slate-950 dark:text-white">
                                    {{ normalizeText(exam.name) }}
                                </h3>
                                <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                    {{ isExamLocked(exam) ? "Unlock readiness checkpoints for timed NCLEX confidence and saved scoring." : examScore(exam) ? "Retake this checkpoint to confirm consistency." : "Start this checkpoint when you want a clean readiness signal." }}
                                </p>
                            </div>
                            <div class="flex shrink-0 items-center gap-2">
                                <span
                                    class="theme-icon inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-bold tabular-nums" title="Questions">
                                    85
                                </span>
                                <span v-if="isExamLocked(exam)"
                                    class="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-rose-100 px-2 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-200"
                                    title="Locked exam">
                                    <i class="pi pi-lock"></i>
                                </span>
                            </div>
                        </div>

                        <div class="relative mt-auto pt-5">
                            <div v-if="examScore(exam)" class="dash-tile-soft px-3 py-2">
                                <div class="flex items-center gap-2">
                                    <div class="dash-progress h-2 flex-1">
                                        <div class="h-2 rounded-full transition-all duration-700" :style="dynamicProgressStyle(examScore(exam))"></div>
                                    </div>
                                    <span class="text-xs font-extrabold text-slate-950 dark:text-white">{{ examScore(exam) }}%</span>
                                </div>
                                <p class="mt-2 text-xs font-semibold" :class="gradeColor(examScore(exam))">
                                    {{ gradeComment(examScore(exam)) }}
                                </p>
                            </div>
                            <div v-else class="dash-tile border-dashed px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-300">
                                <i class="pi pi-sparkles mr-1 text-[10px]"></i>No attempt yet.
                            </div>

                            <div class="mt-4 flex items-center justify-between gap-2">
                                <Small :button-text="isExamLocked(exam) ? 'Unlock Check' : examScore(exam) ? 'Retake Exam' : 'Take Exam'"
                                    :icon="isExamLocked(exam) ? 'pi pi-lock-open' : examScore(exam) ? 'pi pi-refresh' : 'pi pi-play'"
                                    :classes="isExamLocked(exam)
                                        ? 'border-0 bg-slate-900 text-white hover:bg-slate-800 shadow-none'
                                        : examScore(exam)
                                            ? 'border-0 bg-amber-500 text-white hover:bg-amber-600 shadow-none'
                                            : 'border-0 shadow-none'"
                                    :action="() => goToExam(exam)" />
                                <span
                                    class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                    {{ isExamLocked(exam) ? 'Upgrade' : examScore(exam) ? 'Attempted' : 'Exam mode' }}
                                </span>
                            </div>
                        </div>
                    </article>
                </transition-group>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Small from '../../../components/Buttons/Small.vue'
import { normalizeText } from '../../../utils/normalizeText'
import { dynamicProgressStyle, gradeColor, gradeComment } from '../../../utils/grader'
import { useAuthStore } from '../../../stores/authStore'
import { trackPaywallEvent } from '../../../utils/paywallEvents'

const exams = ref<{ id: number; name: string; description?: string; trial_mode?: number | boolean }[]>([])
const searchTerm = ref('')
const subject = ref('Readiness assessments')
const attempts = ref<any[]>([])

const router = useRouter()
const authStore = useAuthStore()
const hasPremiumAccess = computed(() => authStore.isActive('nclex'))

onMounted(async () => {
    try {
        const response = await axios.get('/nclex/readiness')
        exams.value = response.data.data.subtopics || []
        subject.value = response.data.data.name || 'Readiness assessments'
        trackLockedPaywallShown()
    } catch (error) {
        console.error('Error fetching exams:', error)
    }

    try {
        const res = await axios.get('/nclex/previous-attempts')
        attempts.value = res.data.data || []
    } catch {
        attempts.value = []
    }
})

const filteredExams = computed(() => {
    if (!searchTerm.value.trim()) return exams.value
    return exams.value.filter((exam) => exam.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
})

const examScore = (exam: { id: number }) => {
    const attempt = attempts.value?.find(a => a.sub_topic_id == exam.id)
    if (!attempt) return 0
    return Math.round(attempt.score)
}

const attemptedCount = computed(() => exams.value.filter((exam) => examScore(exam) > 0).length)

const averageScore = computed(() => {
    const scores = exams.value.map((exam) => examScore(exam)).filter((score) => score > 0)
    if (!scores.length) return 0
    const total = scores.reduce((sum, score) => sum + score, 0)
    return Math.round(total / scores.length)
})

function isExamLocked(exam: { trial_mode?: number | boolean }) {
    if (hasPremiumAccess.value) return false
    return Number(exam?.trial_mode ?? 0) !== 1
}

const goToExam = (exam: { id: number; trial_mode?: number | boolean }) => {
    if (exam?.id && isExamLocked(exam)) {
        goToUpgrade(exam as { id: number; name: string })
        return
    }

    if (exam?.id) {
        router.push(`/nclex/exam/${exam.id}?mode=exam`)
    }
}

function goToUpgrade(exam: { id: number; name: string }) {
    trackPaywallEvent('pricing_clicked', {
        product: 'nclex',
        placement: 'readiness_locked_card',
        exam_id: exam.id,
        exam_name: exam.name,
    })

    router.push({
        path: authStore.pricingRoute('nclex'),
        query: { redirect: `/nclex/exam/${exam.id}?mode=exam` },
    })
}

function trackLockedPaywallShown() {
    if (hasPremiumAccess.value) return

    const lockedCount = exams.value.filter((exam) => isExamLocked(exam)).length
    if (!lockedCount) return

    trackPaywallEvent('paywall_shown', {
        product: 'nclex',
        placement: 'readiness_locked_cards',
        locked_count: lockedCount,
    })
}
</script>

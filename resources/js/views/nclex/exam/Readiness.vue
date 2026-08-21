<template>
    <div
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-white-500 p-4 text-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh]">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
                <article class="rounded-2xl p-5 xl:col-span-8">
                    <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-200">
                        NCLEX Readiness
                    </p>
                    <h1 class="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                        Readiness Assessment Tests
                    </h1>
                    <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Timed exam-mode checks to measure exam-day consistency, pacing, and confidence under pressure.
                    </p>

                    <div class="mt-5 flex flex-wrap gap-2">
                        <RouterLink to="/nclex"
                            class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-sky-800 dark:text-slate-100 dark:hover:bg-sky-900">
                            <i class="pi pi-gauge"></i>
                            Dashboard
                        </RouterLink>
                        <RouterLink to="/nclex/linear"
                            class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                            <i class="pi pi-book"></i>
                            Linear
                        </RouterLink>
                        <RouterLink to="/nclex/cat"
                            class="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200">
                            <i class="pi pi-desktop"></i>
                            CAT
                        </RouterLink>
                    </div>
                </article>

                <aside class="xl:col-span-4">
                    <div
                        class="grid h-full grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-light-blue-500 p-4 dark:border-sky-800 dark:bg-sky-900 sm:grid-cols-3 xl:grid-cols-1">
                        <div class="rounded-xl border border-sky-100 bg-white p-3 dark:border-sky-800 dark:bg-sky-950/60">
                            <div class="flex items-center justify-between gap-3">
                                <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    Readiness sets
                                </span>
                                <i class="pi pi-bullseye text-sky-600 dark:text-sky-300"></i>
                            </div>
                            <p class="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{{ exams.length }}</p>
                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Available checks</p>
                        </div>
                        <div class="rounded-xl border border-sky-100 bg-white p-3 dark:border-sky-800 dark:bg-sky-950/60">
                            <div class="flex items-center justify-between gap-3">
                                <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    Attempted
                                </span>
                                <i class="pi pi-pencil text-emerald-600 dark:text-emerald-300"></i>
                            </div>
                            <p class="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{{ attemptedCount }}</p>
                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">With saved scores</p>
                        </div>
                        <div class="rounded-xl border border-sky-100 bg-white p-3 dark:border-sky-800 dark:bg-sky-950/60">
                            <div class="flex items-center justify-between gap-3">
                                <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    Avg. score
                                </span>
                                <i class="pi pi-percentage text-orange-600 dark:text-orange-300"></i>
                            </div>
                            <p class="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{{ averageScore }}%</p>
                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Across attempted sets</p>
                        </div>
                    </div>
                </aside>
            </section>

            <section
                class="rounded-2xl border border-slate-200 bg-light-blue-500 p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
                <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 class="text-lg font-extrabold text-slate-950 dark:text-white">
                            {{ subject || "Readiness assessments" }}
                        </h2>
                        <p class="text-xs text-slate-500 dark:text-slate-300">
                            Readiness tests run in exam mode so the score reflects timed decision-making.
                        </p>
                    </div>
                    <input v-model="searchTerm" type="search" :placeholder="`Search ${subject || 'readiness sets'}...`"
                        class="h-10 w-full rounded-full border border-sky-200 bg-white px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100 lg:w-80" />
                </div>

                <div v-if="filteredExams.length === 0 && searchTerm === ''"
                    class="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-sky-800 dark:bg-sky-950/60 dark:text-slate-300">
                    Loading exams...
                </div>
                <div v-else-if="filteredExams.length === 0"
                    class="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-sky-800 dark:bg-sky-950/60 dark:text-slate-300">
                    No exams found for that search.
                </div>

                <transition-group v-else name="fade" tag="div" class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
                    appear>
                    <article v-for="exam in filteredExams" :key="exam.id" :class="[
                        'group flex h-full flex-col rounded-xl border border-sky-100 bg-white p-4 shadow-custom transition duration-300 dark:border-sky-800 dark:bg-sky-950/50',
                        isExamLocked(exam)
                            ? 'opacity-80'
                            : 'hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50 dark:hover:bg-sky-950'
                    ]">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <h3 class="font-bold leading-tight text-slate-950 dark:text-white">
                                    {{ normalizeText(exam.name) }}
                                </h3>
                                <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                    {{ examScore(exam) ? "Retake this checkpoint to confirm consistency." : "Start this checkpoint when you want a clean readiness signal." }}
                                </p>
                            </div>
                            <div class="flex shrink-0 items-center gap-2">
                                <span
                                    class="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-sky-50 px-2 text-xs font-bold text-sky-700 ring-1 ring-sky-100 dark:bg-sky-900/70 dark:text-sky-200 dark:ring-sky-800">
                                    85
                                </span>
                                <span v-if="isExamLocked(exam)"
                                    class="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-rose-100 px-2 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-200"
                                    title="Locked exam">
                                    <i class="pi pi-lock"></i>
                                </span>
                            </div>
                        </div>

                        <div class="mt-auto pt-5">
                            <div v-if="examScore(exam)"
                                class="rounded-xl border border-slate-200 bg-light-blue-500 px-3 py-2 dark:border-sky-800 dark:bg-sky-900/70">
                                <div class="flex items-center gap-2">
                                    <div class="h-2 flex-1 overflow-hidden rounded-full bg-white ring-1 ring-sky-100 dark:bg-slate-800 dark:ring-sky-800">
                                        <div class="h-2 rounded-full" :style="dynamicProgressStyle(examScore(exam))"></div>
                                    </div>
                                    <span class="text-xs font-extrabold text-slate-950 dark:text-white">{{ examScore(exam) }}%</span>
                                </div>
                                <p class="mt-2 text-xs font-semibold" :class="gradeColor(examScore(exam))">
                                    {{ gradeComment(examScore(exam)) }}
                                </p>
                            </div>
                            <div v-else
                                class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-sky-800 dark:bg-sky-900/60 dark:text-slate-300">
                                No attempt yet.
                            </div>

                            <div class="mt-4 flex items-center justify-between gap-2">
                                <Small :button-text="isExamLocked(exam) ? 'Locked' : examScore(exam) ? 'Retake Exam' : 'Take Exam'"
                                    :icon="isExamLocked(exam) ? 'pi pi-lock' : examScore(exam) ? 'pi pi-refresh' : 'pi pi-play'"
                                    :classes="isExamLocked(exam)
                                        ? 'border-0 bg-rose-500 text-white hover:bg-rose-500 cursor-not-allowed shadow-none'
                                        : examScore(exam)
                                            ? 'border-0 bg-amber-500 text-white hover:bg-amber-600 shadow-none'
                                            : 'border-0 bg-sky-500 text-white hover:bg-sky-600 shadow-none'"
                                    :action="() => goToExam(exam)" />
                                <span
                                    class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                    {{ isExamLocked(exam) ? 'Locked' : examScore(exam) ? 'Attempted' : 'Exam mode' }}
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
    if (exam?.id && !isExamLocked(exam)) {
        router.push(`/nclex/exam/${exam.id}?mode=exam`)
    }
}
</script>

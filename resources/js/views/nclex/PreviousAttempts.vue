<template>
    <div
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-white-500 p-4 text-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh]">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
                <article class="rounded-2xl p-5 xl:col-span-8">
                    <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-200">
                        NCLEX History
                    </p>
                    <h1 class="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                        Previous Attempts
                    </h1>
                    <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Review saved linear and readiness attempts, revisit rationales, and open performance reports.
                    </p>

                    <div class="mt-5 flex flex-wrap gap-2">
                        <RouterLink to="/nclex/linear"
                            class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                            <i class="pi pi-book"></i>
                            Linear
                        </RouterLink>
                        <RouterLink to="/nclex/readiness"
                            class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                            <i class="pi pi-bullseye"></i>
                            Readiness
                        </RouterLink>
                        <RouterLink to="/nclex/performance-analysis"
                            class="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-200">
                            <i class="pi pi-chart-line"></i>
                            Analysis
                        </RouterLink>
                    </div>
                </article>

                <aside class="xl:col-span-4">
                    <div
                        class="grid h-full grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-light-blue-500 p-4 dark:border-sky-800 dark:bg-sky-900 sm:grid-cols-3 xl:grid-cols-1">
                        <div class="rounded-xl border border-sky-100 bg-white p-3 dark:border-sky-800 dark:bg-sky-950/60">
                            <div class="flex items-center justify-between gap-3">
                                <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    Attempts
                                </span>
                                <i class="pi pi-pencil text-sky-600 dark:text-sky-300"></i>
                            </div>
                            <p class="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{{ attempts.length }}</p>
                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Saved records</p>
                        </div>
                        <div class="rounded-xl border border-sky-100 bg-white p-3 dark:border-sky-800 dark:bg-sky-950/60">
                            <div class="flex items-center justify-between gap-3">
                                <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    Completed
                                </span>
                                <i class="pi pi-check-circle text-emerald-600 dark:text-emerald-300"></i>
                            </div>
                            <p class="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{{ completedAttempts }}</p>
                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Finished sets</p>
                        </div>
                        <div class="rounded-xl border border-sky-100 bg-white p-3 dark:border-sky-800 dark:bg-sky-950/60">
                            <div class="flex items-center justify-between gap-3">
                                <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    Avg. score
                                </span>
                                <i class="pi pi-percentage text-orange-600 dark:text-orange-300"></i>
                            </div>
                            <p class="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{{ averageScore }}%</p>
                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Across attempts</p>
                        </div>
                    </div>
                </aside>
            </section>

            <section
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
                <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Attempt Records</h2>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                            {{ filteredAttempts.length }} matching {{ filteredAttempts.length === 1 ? "record" : "records" }}.
                        </p>
                    </div>
                    <input v-model="searchTerm" type="search" placeholder="Search attempts..."
                        class="h-10 w-full rounded-full border border-sky-200 bg-white px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100 lg:w-80" />
                </div>

                <div v-if="filteredAttempts.length"
                    class="overflow-x-auto rounded-xl border border-slate-200 dark:border-sky-800">
                    <table class="w-full min-w-[760px] text-left text-sm">
                        <thead class="bg-slate-700 text-white dark:bg-slate-800">
                            <tr>
                                <th class="px-4 py-3 font-semibold">Exam Title</th>
                                <th class="px-4 py-3 font-semibold">Attempted At</th>
                                <th class="px-4 py-3 font-semibold">Score</th>
                                <th class="px-4 py-3 font-semibold">Status</th>
                                <th class="px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200 dark:divide-sky-800">
                            <tr v-for="attempt in filteredAttempts" :key="attempt.id"
                                class="bg-white transition hover:bg-sky-50 dark:bg-sky-950/40 dark:hover:bg-sky-950">
                                <td class="px-4 py-3">
                                    <div class="font-semibold text-slate-950 dark:text-white">
                                        {{ normalizeText(attempt.sub_topic_name || "NCLEX practice set") }}
                                    </div>
                                    <div class="mt-1 text-xs text-slate-500 dark:text-slate-300">
                                        {{ attempt.mode || "exam" }} mode
                                    </div>
                                </td>
                                <td class="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                                    {{ formatDate(attempt.created_at || attempt.completed_at) }}
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2">
                                        <div class="h-2 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div class="h-full rounded-full" :style="dynamicProgressStyle(attempt.score || 0)">
                                            </div>
                                        </div>
                                        <span class="font-bold" :class="scoreToneClass(attempt.score || 0)">
                                            {{ Math.round(attempt.score || 0) }}%
                                        </span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="attempt.completed == 1
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200'">
                                        {{ attempt.completed == 1 ? 'Completed' : 'Paused' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex flex-wrap gap-2">
                                        <button type="button" @click="viewReport(attempt.id)"
                                            class="inline-flex items-center gap-2 rounded-full bg-sky-500 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-600">
                                            <i class="pi pi-file"></i>
                                            Report
                                        </button>
                                        <button type="button" @click="ReviewAttempt(attempt.id)"
                                            class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-sky-800 dark:text-slate-100 dark:hover:bg-sky-900">
                                            <i class="pi pi-eye"></i>
                                            Review
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else
                    class="rounded-xl border border-dashed border-slate-300 bg-light-blue-500 p-10 text-center text-slate-500 dark:border-sky-800 dark:bg-sky-950/60 dark:text-slate-300">
                    No attempts found.
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { normalizeText } from '../../utils/normalizeText'
import { dynamicProgressStyle } from '../../utils/grader'

const router = useRouter()

const attempts = ref<any[]>([])
const searchTerm = ref('')

const filteredAttempts = computed(() => {
    const query = searchTerm.value.trim().toLowerCase()
    if (!query) {
        return attempts.value
    }

    return attempts.value.filter((attempt) => {
        const name = String(attempt.sub_topic_name || '').toLowerCase()
        const score = String(attempt.score || '')
        const date = formatDate(attempt.created_at || attempt.completed_at).toLowerCase()

        return name.includes(query) || score.includes(query) || date.includes(query)
    })
})

const completedAttempts = computed(() =>
    attempts.value.filter((attempt) => attempt.completed === true || attempt.completed === 1 || attempt.completed === '1').length
)

const averageScore = computed(() => {
    const scores = attempts.value.map((attempt) => Number(attempt.score)).filter((score) => Number.isFinite(score))
    if (!scores.length) return 0

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
})

const fetchAttempts = async () => {
    try {
        const response = await axios.get('nclex/previous-attempts')
        attempts.value = Array.isArray(response.data?.data) ? response.data.data : []
    } catch {
        attempts.value = []
    }
}

onMounted(() => {
    fetchAttempts()
})

function formatDate(date?: string | null) {
    if (!date) return 'No date recorded'

    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return 'No date recorded'

    return parsed.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

function scoreToneClass(score: number | string) {
    const value = Number(score)
    if (value >= 75) return 'text-emerald-600 dark:text-emerald-300'
    if (value >= 55) return 'text-amber-600 dark:text-amber-300'
    return 'text-rose-600 dark:text-rose-300'
}

function viewReport(attemptId: number) {
    router.push(`/nclex/performance-report/${attemptId}`)
}

function ReviewAttempt(attemptId: number) {
    router.push(`/nclex/exam/${attemptId}?mode=review`)
}
</script>

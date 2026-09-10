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
                        NCLEX History
                    </p>
                    <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">Previous Attempts</h1>
                    <p class="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                        Linear and readiness sets with reports and reviews, plus your adaptive CAT runs.
                    </p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <RouterLink to="/nclex/linear" class="dash-chip theme-soft theme-focus"><i class="pi pi-book"></i> Linear</RouterLink>
                    <RouterLink to="/nclex/readiness" class="dash-chip theme-soft theme-focus"><i class="pi pi-bullseye"></i> Readiness</RouterLink>
                    <RouterLink to="/nclex/cat" class="dash-chip theme-soft theme-focus"><i class="pi pi-desktop"></i> CAT</RouterLink>
                    <RouterLink to="/nclex/performance-analysis" class="dash-btn theme-surface theme-shadow">
                        Performance analysis <i class="pi pi-arrow-right text-[10px]"></i>
                    </RouterLink>
                </div>
            </header>

            <!-- ================= SUMMARY ================= -->
            <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div v-for="(stat, index) in summary" :key="stat.label" class="ui-rise dash-card-white flex items-center gap-3 p-3"
                    :style="{ animationDelay: `${60 + index * 50}ms` }">
                    <span class="dash-icon-tile theme-icon h-10 w-10 shrink-0"><i :class="stat.icon"></i></span>
                    <div class="min-w-0">
                        <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ stat.label }}</p>
                        <p class="text-xl font-extrabold leading-tight tabular-nums" :class="stat.valueClass">{{ stat.value }}</p>
                        <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">{{ stat.detail }}</p>
                    </div>
                </div>
            </section>

            <!-- ================= STANDARD ATTEMPTS ================= -->
            <section class="ui-rise dash-card" style="animation-delay: 200ms">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 class="dash-title">Linear and readiness sets</h2>
                        <p class="analysis-muted mt-1">{{ visibleAttempts.length }} of {{ attempts.length }} records</p>
                    </div>
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div class="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 dark:border-sky-800 dark:bg-sky-950">
                            <button v-for="f in filters" :key="f.key" type="button" @click="activeFilter = f.key"
                                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition"
                                :class="activeFilter === f.key ? 'theme-surface shadow-md' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-sky-900'">
                                {{ f.label }}
                                <span class="rounded-full px-1.5 text-[10px] tabular-nums" :class="activeFilter === f.key ? 'bg-white/25' : 'bg-slate-100 text-slate-500 dark:bg-sky-900 dark:text-slate-300'">{{ f.count }}</span>
                            </button>
                        </div>
                        <div class="relative sm:w-64">
                            <i class="pi pi-search pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                            <input v-model="searchTerm" type="search" placeholder="Search attempts"
                                class="theme-focus w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 focus:outline-none dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100" />
                        </div>
                    </div>
                </div>

                <div v-if="loading" class="mt-4 space-y-2">
                    <div v-for="n in 5" :key="n" class="h-14 animate-pulse rounded-xl bg-white/80 dark:bg-sky-950/60"></div>
                </div>

                <div v-else-if="visibleAttempts.length" class="dash-card-white mt-4 overflow-x-auto p-0">
                    <table class="w-full min-w-[780px] border-collapse text-left text-sm">
                        <thead>
                            <tr class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                <th class="px-4 py-3">Exam</th>
                                <th class="px-4 py-3">When</th>
                                <th class="px-4 py-3 w-56">Score</th>
                                <th class="px-4 py-3">Status</th>
                                <th class="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="attempt in visibleAttempts" :key="attempt.id"
                                class="border-t border-slate-100 transition hover:bg-light-blue-500 dark:border-sky-900 dark:hover:bg-sky-950/60">
                                <td class="px-4 py-3">
                                    <div class="font-bold text-slate-900 dark:text-white">{{ normalizeText(attempt.sub_topic_name || "NCLEX practice set") }}</div>
                                    <div class="text-[11px] text-slate-500 dark:text-slate-400"><span class="capitalize">{{ attempt.mode || "exam" }}</span> mode · #{{ attempt.id }}</div>
                                </td>
                                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                                    <div>{{ formatDate(attempt.created_at || attempt.completed_at) }}</div>
                                    <div class="text-[11px] text-slate-400">{{ relativeTime(ts(attempt)) }}</div>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="dash-progress h-2 flex-1 bg-light-blue-500">
                                            <div class="h-full rounded-full transition-all duration-700" :class="scoreBarClass(scoreOf(attempt), PASS_MARK)" :style="{ width: `${scoreOf(attempt)}%` }"></div>
                                        </div>
                                        <span class="w-12 text-right font-extrabold tabular-nums" :class="scoreToneClass(scoreOf(attempt), PASS_MARK)">{{ scoreOf(attempt) }}%</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="analysis-pill border text-[11px]" :class="isCompleted(attempt) ? scorePillClass(scoreOf(attempt), PASS_MARK) : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200'">
                                        {{ isCompleted(attempt) ? (scoreOf(attempt) >= PASS_MARK ? "Passing" : scoreOf(attempt) >= PASS_MARK - 15 ? "Close" : "Below") : "Paused" }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex justify-end gap-1.5">
                                        <button type="button" @click="viewReport(attempt.id)" class="dash-btn theme-surface px-3 py-1 text-[11px]"><i class="pi pi-file text-[10px]"></i> Report</button>
                                        <button type="button" @click="reviewAttempt(attempt.id)" class="dash-btn-ghost px-3 py-1 text-[11px]"><i class="pi pi-eye text-[10px]"></i> Review</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else class="dash-card-white mt-4 border-dashed p-8 text-center">
                    <div class="dash-icon-tile theme-icon mx-auto h-12 w-12 rounded-2xl"><i class="pi pi-inbox text-lg"></i></div>
                    <p class="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">{{ attempts.length ? "Nothing matches that filter." : "No attempts yet." }}</p>
                </div>
            </section>

            <!-- ================= CAT RUNS ================= -->
            <section class="ui-rise dash-card" style="animation-delay: 260ms">
                <div class="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 class="dash-title">CAT simulator runs</h2>
                        <p class="analysis-muted mt-1">Adaptive runs are scored against the {{ CAT_PASS_THRESHOLD }}% CAT threshold and have their own report.</p>
                    </div>
                    <span class="analysis-pill theme-soft border">{{ catAttempts.length }} {{ catAttempts.length === 1 ? "run" : "runs" }}</span>
                </div>

                <div v-if="catAttempts.length" class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <button v-for="run in sortedCatAttempts" :key="run.id" type="button" @click="viewCatReport(run.id)"
                        class="group dash-card-white dash-hover-lift flex items-center gap-3 text-left">
                        <div class="relative h-14 w-14 shrink-0">
                            <svg class="h-14 w-14 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
                                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="5" class="text-slate-200 dark:text-slate-700" />
                                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"
                                    :stroke-dasharray="catRing" :stroke-dashoffset="catRing * (1 - scoreOf(run) / 100)"
                                    :class="scoreOf(run) >= CAT_PASS_THRESHOLD ? 'text-emerald-500' : 'text-rose-500'" />
                            </svg>
                            <span class="absolute inset-0 flex items-center justify-center text-xs font-black tabular-nums text-slate-900 dark:text-white">{{ scoreOf(run) }}%</span>
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="text-sm font-extrabold text-slate-900 dark:text-white">CAT run #{{ run.id }}</p>
                            <p class="text-[11px] text-slate-500 dark:text-slate-300">
                                {{ formatDate(run.completed_at || run.created_at) }} · {{ run.suspend_index || 0 }}/150 questions
                            </p>
                            <span class="analysis-pill mt-1.5 inline-block border text-[10px]"
                                :class="scoreOf(run) >= CAT_PASS_THRESHOLD ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200' : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200'">
                                {{ scoreOf(run) >= CAT_PASS_THRESHOLD ? "Passed" : "Needs review" }}
                            </span>
                        </div>
                        <i class="pi pi-arrow-right text-xs text-slate-400 transition-transform group-hover:translate-x-0.5"></i>
                    </button>
                </div>
                <div v-else class="dash-card-white mt-4 border-dashed p-6 text-center">
                    <p class="text-sm font-extrabold text-slate-900 dark:text-white">No CAT runs yet.</p>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">The adaptive simulator gives you three runs a month.</p>
                    <RouterLink to="/nclex/cat" class="dash-btn theme-surface theme-shadow mt-3">Start a CAT run <i class="pi pi-arrow-right text-[10px]"></i></RouterLink>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { normalizeText } from '../../utils/normalizeText'
import { average, clamp, relativeTime, scoreBarClass, scorePillClass, scoreToneClass } from '../../utils/readiness'

const PASS_MARK = 75
const CAT_PASS_THRESHOLD = 65
const catRing = 2 * Math.PI * 20

const router = useRouter()
const attempts = ref<any[]>([])
const catAttempts = ref<any[]>([])
const loading = ref(true)
const searchTerm = ref('')
const activeFilter = ref<'all' | 'completed' | 'paused'>('all')

const isCompleted = (a: any) => a?.completed === true || a?.completed === 1 || a?.completed === '1'
const scoreOf = (a: any) => clamp(Math.round(Number(a?.score) || 0))
const ts = (a: any) => {
    const t = new Date(a?.completed_at || a?.created_at || 0).getTime()
    return Number.isFinite(t) ? t : 0
}

const filters = computed(() => [
    { key: 'all' as const, label: 'All', count: attempts.value.length },
    { key: 'completed' as const, label: 'Completed', count: attempts.value.filter(isCompleted).length },
    { key: 'paused' as const, label: 'Paused', count: attempts.value.filter((a) => !isCompleted(a)).length },
])

const visibleAttempts = computed(() => {
    const q = searchTerm.value.trim().toLowerCase()
    return [...attempts.value]
        .filter((a) => (activeFilter.value === 'completed' ? isCompleted(a) : activeFilter.value === 'paused' ? !isCompleted(a) : true))
        .filter((a) => !q || String(a.sub_topic_name || '').toLowerCase().includes(q) || String(a.score || '').includes(q) || formatDate(a.created_at || a.completed_at).toLowerCase().includes(q))
        .sort((a, b) => ts(b) - ts(a))
})

const sortedCatAttempts = computed(() => [...catAttempts.value].sort((a, b) => ts(b) - ts(a)))

const summary = computed(() => {
    const completed = attempts.value.filter(isCompleted)
    const scores = completed.map(scoreOf)
    const avg = scores.length ? Math.round(average(scores)) : 0
    const catScores = catAttempts.value.map(scoreOf)
    const catPassed = catScores.filter((s) => s >= CAT_PASS_THRESHOLD).length
    return [
        { label: 'Standard attempts', value: String(attempts.value.length), detail: `${completed.length} completed · ${attempts.value.length - completed.length} paused`, icon: 'pi pi-file', valueClass: 'text-slate-950 dark:text-white' },
        { label: 'Average score', value: scores.length ? `${avg}%` : '—', detail: scores.length ? `${avg >= PASS_MARK ? '+' : ''}${avg - PASS_MARK} pts vs ${PASS_MARK}% mark` : 'No completed attempts', icon: 'pi pi-percentage', valueClass: scores.length ? scoreToneClass(avg, PASS_MARK) : 'text-slate-400' },
        { label: 'CAT runs', value: String(catAttempts.value.length), detail: catAttempts.value.length ? `${catPassed} passed the ${CAT_PASS_THRESHOLD}% threshold` : 'No adaptive runs yet', icon: 'pi pi-desktop', valueClass: 'text-slate-950 dark:text-white' },
        { label: 'Best CAT', value: catScores.length ? `${Math.max(...catScores)}%` : '—', detail: catScores.length ? `Average ${Math.round(average(catScores))}%` : 'Take a run to see it here', icon: 'pi pi-star', valueClass: catScores.length ? scoreToneClass(Math.max(...catScores), CAT_PASS_THRESHOLD) : 'text-slate-400' },
    ]
})

const fetchAll = async () => {
    loading.value = true
    const [standard, cat] = await Promise.allSettled([
        axios.get('nclex/previous-attempts'),
        axios.get('nclex/cat-attempts', { showLoader: false }),
    ])
    attempts.value = standard.status === 'fulfilled' && Array.isArray(standard.value.data?.data) ? standard.value.data.data : []
    catAttempts.value = cat.status === 'fulfilled' && Array.isArray(cat.value.data?.data) ? cat.value.data.data : []
    loading.value = false
}

onMounted(fetchAll)

function formatDate(date?: string | null) {
    if (!date) return 'No date recorded'
    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return 'No date recorded'
    return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const viewReport = (id: number) => router.push(`/nclex/performance-report/${id}`)
const reviewAttempt = (id: number) => router.push(`/nclex/exam/${id}?mode=review`)
const viewCatReport = (id: number) => router.push(`/nclex/adaptive-report/${id}`)
</script>

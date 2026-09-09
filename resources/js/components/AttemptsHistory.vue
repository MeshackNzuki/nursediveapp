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
                        {{ productLabel }} History
                    </p>
                    <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">Previous Attempts</h1>
                    <p class="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                        Every {{ productLabel }} attempt you've made, with quick access to reports, reviews, and resumes.
                    </p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <RouterLink :to="`${baseRoute}/performance-analysis`" class="dash-btn-ghost">
                        <i class="pi pi-chart-line"></i> Performance analysis
                    </RouterLink>
                    <RouterLink :to="`${baseRoute}/`" class="dash-btn theme-surface theme-shadow">
                        Take a test <i class="pi pi-arrow-right text-[10px]"></i>
                    </RouterLink>
                </div>
            </header>

            <GuestSavePrompt v-if="isGuest" :product="guestPromptProduct" :product-label="productLabel" :redirect="`${baseRoute}/previous-attempts`" />

            <template v-else>
                <!-- Summary -->
                <section class="grid grid-cols-2 gap-3 xl:grid-cols-4">
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

                <!-- Table -->
                <section class="ui-rise dash-card" style="animation-delay: 200ms">
                    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div class="flex flex-wrap items-center gap-1 rounded-full border border-slate-200 bg-white p-1 dark:border-sky-800 dark:bg-sky-950">
                            <button v-for="f in filters" :key="f.key" type="button" @click="activeFilter = f.key"
                                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition"
                                :class="activeFilter === f.key ? 'theme-surface shadow-md' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-sky-900'">
                                {{ f.label }}
                                <span class="rounded-full px-1.5 text-[10px] tabular-nums" :class="activeFilter === f.key ? 'bg-white/25' : 'bg-slate-100 text-slate-500 dark:bg-sky-900 dark:text-slate-300'">{{ f.count }}</span>
                            </button>
                        </div>

                        <div class="flex items-center gap-2">
                            <div class="relative flex-1 lg:w-72">
                                <i class="pi pi-search pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                                <input v-model="searchTerm" type="text" placeholder="Search exam, mode, or date"
                                    class="theme-focus w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 focus:outline-none dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100" />
                            </div>
                            <button type="button" @click="sortDesc = !sortDesc" class="dash-btn-ghost px-3 py-2" :title="sortDesc ? 'Newest first' : 'Oldest first'">
                                <i :class="sortDesc ? 'pi pi-sort-amount-down' : 'pi pi-sort-amount-up'"></i>
                            </button>
                        </div>
                    </div>

                    <div v-if="loading" class="mt-4 space-y-2">
                        <div v-for="n in 6" :key="n" class="h-14 animate-pulse rounded-xl bg-white/80 dark:bg-sky-950/60"></div>
                    </div>

                    <div v-else-if="!visibleAttempts.length" class="dash-card-white mt-4 border-dashed p-8 text-center">
                        <div class="dash-icon-tile theme-icon mx-auto h-12 w-12 rounded-2xl"><i class="pi pi-inbox text-lg"></i></div>
                        <p class="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">
                            {{ attempts.length ? "Nothing matches that filter." : "No attempts yet." }}
                        </p>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">
                            {{ attempts.length ? "Try another filter or clear the search." : "Your first attempt will appear here with its report." }}
                        </p>
                    </div>

                    <div v-else class="dash-card-white mt-4 overflow-x-auto p-0">
                        <table class="w-full min-w-[820px] border-collapse text-left text-sm">
                            <thead>
                                <tr class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    <th class="px-4 py-3">Exam</th>
                                    <th class="px-4 py-3">When</th>
                                    <th class="px-4 py-3">Mode</th>
                                    <th class="px-4 py-3 w-56">Score</th>
                                    <th class="px-4 py-3">Status</th>
                                    <th class="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="attempt in visibleAttempts" :key="attempt.key"
                                    class="border-t border-slate-100 transition hover:bg-light-blue-500 dark:border-sky-900 dark:hover:bg-sky-950/60">
                                    <td class="px-4 py-3">
                                        <div class="font-bold text-slate-900 dark:text-white">{{ attempt.name }}</div>
                                        <div class="text-[11px] text-slate-500 dark:text-slate-400">Attempt #{{ attempt.id }}</div>
                                    </td>
                                    <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                                        <div>{{ attempt.dateLabel }}</div>
                                        <div class="text-[11px] text-slate-400">{{ attempt.relative }}</div>
                                    </td>
                                    <td class="px-4 py-3"><span class="analysis-pill theme-soft border capitalize">{{ attempt.mode }}</span></td>
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-3">
                                            <div class="dash-progress h-2 flex-1 bg-light-blue-500">
                                                <div class="h-full rounded-full transition-all duration-700" :class="attempt.bar" :style="{ width: `${attempt.score}%` }"></div>
                                            </div>
                                            <span class="w-12 text-right font-extrabold tabular-nums" :class="attempt.tone">{{ attempt.score }}%</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span class="analysis-pill border text-[11px]" :class="attempt.completed ? attempt.pill : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200'">
                                            {{ attempt.completed ? attempt.band : "In progress" }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <div class="flex justify-end gap-1.5">
                                            <button v-if="!attempt.completed" type="button" @click="resume(attempt.id)"
                                                class="dash-btn bg-linear-to-r from-amber-500 to-orange-500 px-3 py-1 text-[11px] text-white shadow-amber-500/30">
                                                <i class="pi pi-play text-[10px]"></i> Resume
                                            </button>
                                            <button type="button" @click="viewReport(attempt.id)" class="dash-btn theme-surface px-3 py-1 text-[11px]">
                                                <i class="pi pi-file text-[10px]"></i> Report
                                            </button>
                                            <button type="button" @click="review(attempt.id)" class="dash-btn-ghost px-3 py-1 text-[11px]">
                                                <i class="pi pi-eye text-[10px]"></i> Review
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p v-if="!loading && visibleAttempts.length" class="mt-3 text-right text-[11px] text-slate-400">
                        Showing {{ visibleAttempts.length }} of {{ attempts.length }} attempts
                    </p>
                </section>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import GuestSavePrompt from './GuestSavePrompt.vue'
import { useAuthStore } from '../stores/authStore'
import { normalizeText } from '../utils/normalizeText'
import { average, clamp, relativeTime, scoreBarClass, scorePillClass, scoreToneClass } from '../utils/readiness'

const props = withDefaults(defineProps<{ product: string; productLabel: string; passMark?: number }>(), { passMark: 75 })

const router = useRouter()
const authStore = useAuthStore()
const isGuest = computed(() => !authStore.is_authenticated)

const apiProduct = computed(() => props.product.replace(/^\/+/, ''))
const baseRoute = computed(() => `/${apiProduct.value}`)
const guestPromptProduct = computed(() => (apiProduct.value === 'nursing' || apiProduct.value === 'teas' ? apiProduct.value : undefined))

const attempts = ref<any[]>([])
const loading = ref(true)
const searchTerm = ref('')
const sortDesc = ref(true)
const activeFilter = ref<'all' | 'completed' | 'progress' | 'passing' | 'below'>('all')

const fetchAttempts = async () => {
    loading.value = true
    try {
        const response = await axios.get(`${apiProduct.value}/previous-attempts`)
        attempts.value = Array.isArray(response.data?.data) ? response.data.data : []
    } catch {
        attempts.value = []
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
    if (!guest) fetchAttempts()
})

const isCompleted = (a: any) => Number(a?.completed) === 1 || a?.completed === true
const ts = (a: any) => {
    const t = new Date(a?.completed_at || a?.created_at || 0).getTime()
    return Number.isFinite(t) ? t : 0
}
const bandLabel = (score: number) => (score >= props.passMark ? 'Passing' : score >= props.passMark - 15 ? 'Close' : 'Below')

const normalized = computed(() =>
    attempts.value.map((a, index) => {
        const score = clamp(Math.round(Number(a.score) || 0))
        const when = ts(a)
        return {
            key: `${a.attempt_id ?? a.id}-${index}`,
            id: Number(a.attempt_id ?? a.id),
            name: normalizeText(a.sub_topic_name) || 'Practice set',
            mode: String(a.mode || 'exam').toLowerCase(),
            score,
            completed: isCompleted(a),
            when,
            dateLabel: when ? new Date(when).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not recorded',
            relative: relativeTime(when),
            band: bandLabel(score),
            tone: scoreToneClass(score, props.passMark),
            bar: scoreBarClass(score, props.passMark),
            pill: scorePillClass(score, props.passMark),
        }
    }),
)

const filters = computed(() => [
    { key: 'all' as const, label: 'All', count: normalized.value.length },
    { key: 'completed' as const, label: 'Completed', count: normalized.value.filter((a) => a.completed).length },
    { key: 'progress' as const, label: 'In progress', count: normalized.value.filter((a) => !a.completed).length },
    { key: 'passing' as const, label: 'Passing', count: normalized.value.filter((a) => a.completed && a.score >= props.passMark).length },
    { key: 'below' as const, label: 'Below mark', count: normalized.value.filter((a) => a.completed && a.score < props.passMark).length },
])

const visibleAttempts = computed(() => {
    const q = searchTerm.value.trim().toLowerCase()
    return normalized.value
        .filter((a) => {
            if (activeFilter.value === 'completed') return a.completed
            if (activeFilter.value === 'progress') return !a.completed
            if (activeFilter.value === 'passing') return a.completed && a.score >= props.passMark
            if (activeFilter.value === 'below') return a.completed && a.score < props.passMark
            return true
        })
        .filter((a) => !q || a.name.toLowerCase().includes(q) || a.mode.includes(q) || a.dateLabel.toLowerCase().includes(q) || String(a.score).includes(q))
        .sort((a, b) => (sortDesc.value ? b.when - a.when : a.when - b.when))
})

const summary = computed(() => {
    const completed = normalized.value.filter((a) => a.completed)
    const scores = completed.map((a) => a.score)
    const avg = scores.length ? Math.round(average(scores)) : 0
    const passing = completed.filter((a) => a.score >= props.passMark).length
    const last = [...normalized.value].sort((a, b) => b.when - a.when)[0]
    return [
        { label: 'Total attempts', value: String(normalized.value.length), detail: `${completed.length} completed · ${normalized.value.length - completed.length} in progress`, icon: 'pi pi-file', valueClass: 'text-slate-950 dark:text-white' },
        { label: 'Average score', value: scores.length ? `${avg}%` : '—', detail: scores.length ? `${avg >= props.passMark ? '+' : ''}${avg - props.passMark} pts vs pass mark` : 'No completed attempts', icon: 'pi pi-percentage', valueClass: scores.length ? scoreToneClass(avg, props.passMark) : 'text-slate-400' },
        { label: 'Pass rate', value: completed.length ? `${Math.round((passing / completed.length) * 100)}%` : '—', detail: `${passing} of ${completed.length} at or above ${props.passMark}%`, icon: 'pi pi-verified', valueClass: 'text-emerald-600 dark:text-emerald-300' },
        { label: 'Last attempt', value: last ? `${last.score}%` : '—', detail: last ? `${last.name} · ${last.relative}` : 'Nothing yet', icon: 'pi pi-history', valueClass: last ? last.tone : 'text-slate-400' },
    ]
})

const viewReport = (id: number) => router.push(`${baseRoute.value}/performance-report/${id}`)
const review = (id: number) => router.push(`${baseRoute.value}/exam/${id}?mode=review`)
const resume = (id: number) => router.push(`${baseRoute.value}/exam/${id}?resume=true`)
</script>

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
                        NCLEX CAT Simulator
                    </p>
                    <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                        Computerized Adaptive Testing
                    </h1>
                    <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Use adaptive runs to test clinical judgment under shifting difficulty and review the report
                        before your next practice decision.
                    </p>

                    <div class="mt-5 flex flex-wrap items-center gap-2">
                        <button type="button" @click="openStartModal" :disabled="hasCatPremiumAccess && !canStartCat"
                            class="dash-btn theme-surface theme-shadow px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50">
                            <i class="pi pi-play"></i> Start a CAT
                        </button>
                        <button type="button" @click="goToLatestReport" :disabled="!hasAttempts"
                            class="dash-btn-ghost px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50">
                            <i class="pi pi-chart-bar"></i> Latest report
                        </button>
                        <RouterLink to="/nclex/performance-analysis" class="dash-btn-ghost px-5 py-2.5">
                            <i class="pi pi-wave-pulse"></i> Analysis
                        </RouterLink>
                    </div>

                    <!-- Monthly run meter -->
                    <div class="dash-card mt-5 flex flex-wrap items-center justify-between gap-4 p-4">
                        <div class="flex items-center gap-3">
                            <span class="dash-icon-tile theme-icon h-10 w-10"><i class="pi pi-calendar"></i></span>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">This month</p>
                                <p class="text-sm font-extrabold text-slate-950 dark:text-white">
                                    {{ remainingAttemptsThisMonth }} of {{ monthlyLimit }} {{ remainingAttemptsThisMonth === 1 ? "run" : "runs" }} left
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2" aria-label="Monthly CAT runs">
                            <span v-for="n in monthlyLimit" :key="n" class="h-3 w-10 rounded-full transition-colors duration-500"
                                :class="n <= attemptsThisMonth ? 'theme-bar' : 'bg-slate-200 dark:bg-slate-700'"
                                :title="n <= attemptsThisMonth ? 'Used' : 'Available'"></span>
                        </div>
                        <p class="w-full text-xs font-semibold sm:w-auto" :class="hasCatPremiumAccess ? 'text-slate-500 dark:text-slate-300' : 'text-amber-700 dark:text-amber-300'">
                            {{ monthlyAttemptSummary }}
                        </p>
                    </div>

                    <UpgradePrompt v-if="!hasCatPremiumAccess" product="nclex" variant="inline" placement="nclex_cat"
                        title="The adaptive simulator is a Premium feature." :show-continue="false" class="mt-4"
                        message="Three CAT runs a month, each with a difficulty trace, ability estimate and subject breakdown. Your linear and readiness sets are still open in the meantime." />
                </article>

                <aside class="ui-rise xl:col-span-4" style="animation-delay: 80ms">
                    <div class="flex h-full flex-col justify-between rounded-2xl border-b bg-sky-800 p-5 shadow-custom">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <span
                                    class="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-bright-sun-500 ring-1 ring-white/20">
                                    Adaptive snapshot
                                </span>
                                <p class="mt-3 text-lg font-extrabold leading-tight text-white">
                                    {{ latestAttemptSummary }}
                                </p>
                            </div>
                            <div class="radial-progress shrink-0 bg-white/95 text-sm font-extrabold shadow-custom"
                                :class="latestStatusClass" :style="{ '--value': 100 }" role="progressbar">
                                {{ latestStatusLabel }}
                            </div>
                        </div>
                        <div class="mt-5 grid grid-cols-3 gap-2">
                            <div class="rounded-xl bg-white/10 p-3 text-white ring-1 ring-white/15">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-sky-100">Pass rate</p>
                                <p class="mt-1 text-xl font-extrabold tabular-nums">{{ passRate }}%</p>
                            </div>
                            <div class="rounded-xl bg-white/10 p-3 text-white ring-1 ring-white/15">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-sky-100">Attempts</p>
                                <p class="mt-1 text-xl font-extrabold tabular-nums">{{ attemptCount }}</p>
                            </div>
                            <div class="rounded-xl bg-white/10 p-3 text-white ring-1 ring-white/15">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-sky-100">Avg.</p>
                                <p class="mt-1 text-xl font-extrabold tabular-nums">{{ Math.round(averageScore) }}%</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            <!-- ================= WORKFLOW + LAST SESSION ================= -->
            <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 160ms">
                    <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 class="dash-title">Adaptive Workflow</h2>
                            <p class="text-xs text-slate-500 dark:text-slate-300">
                                A CAT run should lead directly into review and targeted remediation.
                            </p>
                        </div>
                        <span class="analysis-pill theme-soft border">{{ remainingAttemptsThisMonth }} left this month</span>
                    </div>

                    <ol class="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <li v-for="(card, index) in workflowCards" :key="card.title"
                            class="group dash-card-white dash-hover-lift ui-rise relative overflow-hidden"
                            :style="{ animationDelay: `${220 + index * 60}ms` }">
                            <i class="pointer-events-none absolute -bottom-5 -right-3 text-[96px] opacity-[0.06] transition-transform duration-500 group-hover:-rotate-6"
                                :class="[card.icon, card.color]" aria-hidden="true"></i>
                            <div class="relative flex items-start gap-3">
                                <span class="dash-icon-tile theme-icon h-11 w-11 text-lg group-hover:scale-110">
                                    <i :class="card.icon"></i>
                                </span>
                                <div class="min-w-0">
                                    <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Step {{ index + 1 }}</p>
                                    <h3 class="font-bold leading-tight text-slate-950 dark:text-white">{{ card.title }}</h3>
                                    <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{{ card.copy }}</p>
                                </div>
                            </div>
                        </li>
                    </ol>
                </article>

                <article class="ui-rise dash-card xl:col-span-5" style="animation-delay: 200ms">
                    <div class="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-50" aria-hidden="true"></div>
                    <div class="relative flex items-start justify-between gap-3">
                        <div>
                            <h2 class="dash-title">Last Session Snapshot</h2>
                            <p class="analysis-muted mt-1">The newest adaptive result becomes your report shortcut.</p>
                        </div>
                        <span class="analysis-pill border" :class="latestStatusPillClass">{{ latestStatusLabel }}</span>
                    </div>

                    <div class="dash-card-white relative mt-4">
                        <div class="flex items-end justify-between gap-4">
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Score</p>
                                <p class="mt-1 text-3xl font-extrabold tabular-nums" :class="latestScoreClass">
                                    {{ hasAttempts ? `${latestScoreRounded}%` : "--" }}
                                </p>
                            </div>
                            <div class="min-w-0 text-right">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Completed</p>
                                <p class="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                                    {{ hasAttempts ? formatDate(recentAttempt?.completed_at || recentAttempt?.created_at) : "No run yet" }}
                                </p>
                                <p v-if="hasAttempts" class="text-[11px] text-slate-500 dark:text-slate-300">{{ recentAttempt?.suspend_index || 0 }}/150 questions</p>
                            </div>
                        </div>
                        <div class="dash-progress relative mt-4 h-2.5 bg-light-blue-500">
                            <div class="h-full rounded-full transition-all duration-700" :class="latestScoreBarClass" :style="{ width: `${hasAttempts ? latestScoreRounded : 0}%` }"></div>
                            <span class="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-slate-700 dark:bg-slate-200" :style="{ left: `${passThreshold}%` }" :title="`Pass threshold ${passThreshold}%`"></span>
                        </div>
                        <p class="mt-1.5 text-[11px] text-slate-500 dark:text-slate-300">Threshold {{ passThreshold }}%</p>
                    </div>

                    <!-- Run-by-run scores -->
                    <div v-if="attempts.length > 1" class="dash-tile relative mt-3">
                        <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                            <span>Run history</span>
                            <span>{{ Math.min(attempts.length, 8) }} runs</span>
                        </div>
                        <div class="relative mt-2 flex h-20 items-end gap-1.5">
                            <span class="pointer-events-none absolute left-0 right-0 border-t border-dashed border-slate-400/60" :style="{ bottom: `${passThreshold}%` }"></span>
                            <div v-for="run in [...attempts].slice(0, 8).reverse()" :key="run.id"
                                class="flex h-full flex-1 cursor-pointer flex-col items-center justify-end gap-1" :title="`${Math.round(run.score || 0)}% · ${formatDate(run.completed_at || run.created_at)}`" @click="viewReport(run.id)">
                                <div class="w-full rounded-t-md transition-all duration-700" :class="Number(run.score) >= passThreshold ? 'bg-emerald-500' : 'bg-rose-400'"
                                    :style="{ height: `${Math.max(6, Math.min(100, Math.round(run.score || 0)))}%` }"></div>
                            </div>
                        </div>
                    </div>

                    <div class="relative mt-4 flex flex-wrap gap-2">
                        <button type="button" @click="openStartModal" :disabled="hasCatPremiumAccess && !canStartCat"
                            class="dash-btn theme-surface theme-shadow disabled:cursor-not-allowed disabled:opacity-50">
                            <i class="pi pi-play"></i> Start CAT
                        </button>
                        <button type="button" @click="goToLatestReport" :disabled="!hasAttempts" class="dash-btn-ghost disabled:cursor-not-allowed disabled:opacity-50">
                            <i class="pi pi-chart-bar"></i> Report
                        </button>
                    </div>
                </article>
            </section>

            <!-- ================= RECENT ATTEMPTS ================= -->
            <section class="ui-rise dash-card" style="animation-delay: 280ms">
                <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 class="dash-title">Recent CAT Attempts</h2>
                        <p class="analysis-muted mt-1">Review adaptive runs and compare outcomes over time.</p>
                    </div>
                    <span class="analysis-pill theme-soft border">{{ attemptCount }} logged</span>
                </div>

                <div v-if="attempts.length > 0" class="dash-card-white overflow-x-auto p-0">
                    <table class="w-full min-w-[680px] border-collapse text-left text-sm">
                        <thead>
                            <tr class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                <th class="px-4 py-3">Date</th>
                                <th class="px-4 py-3">Questions</th>
                                <th class="px-4 py-3 w-56">Score</th>
                                <th class="px-4 py-3">Status</th>
                                <th class="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="attempt in attempts.slice(0, 5)" :key="attempt.id"
                                class="cursor-pointer border-t border-slate-100 transition hover:bg-light-blue-500 dark:border-sky-900 dark:hover:bg-sky-950/60" @click="viewReport(attempt.id)">
                                <td class="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{{ formatDate(attempt.completed_at || attempt.created_at) }}</td>
                                <td class="px-4 py-3 tabular-nums text-slate-600 dark:text-slate-300">{{ attempt.suspend_index || "0" }}/150</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="dash-progress h-2 flex-1 bg-light-blue-500">
                                            <div class="h-full rounded-full transition-all duration-700" :class="attempt.score >= passThreshold ? 'bg-emerald-500' : 'bg-rose-500'"
                                                :style="{ width: `${Math.max(0, Math.min(100, Math.round(attempt.score || 0)))}%` }"></div>
                                        </div>
                                        <span class="w-12 text-right font-extrabold tabular-nums text-slate-950 dark:text-white">{{ Math.round(attempt.score || 0) }}%</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="analysis-pill border text-[11px]" :class="attempt.score >= passThreshold
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                                        : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200'">
                                        {{ attempt.score >= passThreshold ? 'Passed' : 'Needs review' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <span class="dash-btn theme-surface px-3 py-1 text-[11px]"><i class="pi pi-chart-bar text-[10px]"></i> Report</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else class="dash-card-white border-dashed p-10 text-center">
                    <div class="dash-icon-tile theme-icon mx-auto h-12 w-12 rounded-2xl"><i class="pi pi-desktop text-lg"></i></div>
                    <p class="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">No CAT attempts yet.</p>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">Your first adaptive run will appear here with its report.</p>
                </div>
            </section>
        </div>

        <dialog id="my_modal_3" class="modal">
            <div class="modal-box bg-white text-slate-900 dark:bg-sky-950 dark:text-slate-100">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-slate-500 dark:text-slate-300">x</button>
                </form>

                <p class="dash-eyebrow theme-text">Before you start</p>
                <h3 class="mt-1 pr-8 text-lg font-extrabold">NCLEX CAT Exam Instructions</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Answer each question carefully. The adaptive engine adjusts difficulty as you move, and you cannot
                    return to previous questions during the run.
                </p>

                <div class="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <div v-for="tip in modalTips" :key="tip" class="dash-tile-soft flex items-start gap-2">
                        <span class="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"><i class="pi pi-check text-[10px]"></i></span>
                        <span>{{ tip }}</span>
                    </div>
                </div>

                <div class="theme-soft mt-4 rounded-xl border p-3 text-xs font-semibold">{{ modalLimitSummary }}</div>

                <div class="mt-5 flex justify-end">
                    <button type="button" @click="startExam" :disabled="!canStartCat" class="dash-btn theme-surface theme-shadow px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50">
                        <i class="pi pi-play"></i> Start CAT now
                    </button>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import UpgradePrompt from '../../../components/UpgradePrompt.vue'
import { useCatExamStore } from '../../../stores/catExamStore'
import { useAuthStore } from '../../../stores/authStore'

const catStore = useCatExamStore()
const authStore = useAuthStore()

const router = useRouter()
const attempts = ref<any[]>([])
const monthlyLimit = 3
const hasCatPremiumAccess = computed(() => authStore.active('nclex') && !authStore.isTrial('nclex'))
const passThreshold = computed(() => Number((catStore as any).passThreshold ?? 65))

const workflowCards = [
    {
        title: 'Adaptive difficulty',
        copy: 'Question difficulty responds to your performance so each run becomes a sharper readiness signal.',
        icon: 'pi pi-sliders-v',
        color: 'text-sky-600 dark:text-sky-300',
    },
    {
        title: 'Clinical judgment',
        copy: 'Mixed items keep the focus on safety, prioritization, and nursing decisions under pressure.',
        icon: 'pi pi-heart',
        color: 'text-emerald-600 dark:text-emerald-300',
    },
    {
        title: 'Report review',
        copy: 'Adaptive reports surface subject trends and score movement so the next practice step is obvious.',
        icon: 'pi pi-chart-bar',
        color: 'text-indigo-600 dark:text-indigo-300',
    },
    {
        title: 'Monthly pacing',
        copy: 'Three CAT attempts per month encourages deliberate review between high-stakes simulations.',
        icon: 'pi pi-calendar',
        color: 'text-orange-600 dark:text-orange-300',
    },
]

const modalTips = [
    'Read every option before selecting your answer.',
    'Prioritize patient safety, ABCs, and nursing judgment.',
    'Use tutor review after the report to target weak areas.',
]

onMounted(async () => {
    if (!hasCatPremiumAccess.value) {
        return
    }

    try {
        const res = await axios.get('nclex/cat-attempts')
        attempts.value = res.data.data || []
    } catch (error) {
        console.error('Error fetching CAT attempts:', error)
    }
})

const passRate = computed(() => {
    if (attempts.value.length === 0) return 0
    const passed = attempts.value.filter((a) => a.score >= passThreshold.value).length
    return Math.round((passed / attempts.value.length) * 100)
})

const attemptCount = computed(() => attempts.value.length)

const averageScore = computed(() => {
    if (attempts.value.length === 0) return 0
    const total = attempts.value.reduce((sum, attempt) => sum + Number(attempt.score || 0), 0)
    return total / attempts.value.length
})

const hasAttempts = computed(() => attemptCount.value > 0)
const recentAttempt = computed(() => attempts.value[0] ?? null)
const latestScoreRounded = computed(() => Math.round(Number(recentAttempt.value?.score || 0)))
const attemptsThisMonth = computed(() =>
    attempts.value.filter((attempt) =>
        isCurrentMonth(attempt.completed_at ?? attempt.created_at)
    ).length
)
const remainingAttemptsThisMonth = computed(() =>
    Math.max(0, monthlyLimit - attemptsThisMonth.value)
)
const canStartCat = computed(() => remainingAttemptsThisMonth.value > 0)
const monthlyAttemptSummary = computed(() => {
    if (!hasCatPremiumAccess.value) {
        return 'CAT is available for active paid NCLEX plans.'
    }

    if (canStartCat.value) {
        const suffix = remainingAttemptsThisMonth.value === 1 ? '' : 's'
        return `${remainingAttemptsThisMonth.value} CAT attempt${suffix} remaining this month.`
    }

    return 'Monthly CAT limit reached (3 attempts). Available again next month.'
})
const modalLimitSummary = computed(() => {
    if (canStartCat.value) {
        return `You can take the CAT exam ${monthlyLimit} times per month. ${remainingAttemptsThisMonth.value} remaining this month.`
    }

    return `You can take the CAT exam ${monthlyLimit} times per month. You have reached the monthly limit.`
})

const latestAttemptSummary = computed(() => {
    if (!recentAttempt.value) {
        return 'No CAT attempts yet. Start an adaptive run to unlock your first report.'
    }

    return `Last attempt on ${formatDate(recentAttempt.value.completed_at || recentAttempt.value.created_at)} with ${latestScoreRounded.value}% achieved.`
})

const latestStatusLabel = computed(() => {
    if (!hasAttempts.value) return 'No Test'
    return latestScoreRounded.value >= passThreshold.value ? 'PASS' : 'REVIEW'
})

const latestStatusClass = computed(() => {
    if (!hasAttempts.value) return 'text-orange-500'
    return latestScoreRounded.value >= passThreshold.value ? 'text-emerald-600' : 'text-rose-500'
})

const latestStatusPillClass = computed(() => {
    if (!hasAttempts.value) return 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-200'
    return latestScoreRounded.value >= passThreshold.value
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200'
        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-200'
})

const latestScoreClass = computed(() => {
    if (!hasAttempts.value) return 'text-slate-400 dark:text-slate-500'
    return latestScoreRounded.value >= passThreshold.value
        ? 'text-emerald-600 dark:text-emerald-300'
        : 'text-rose-600 dark:text-rose-300'
})

const latestScoreBarClass = computed(() => {
    if (!hasAttempts.value) return 'bg-slate-300'
    return latestScoreRounded.value >= passThreshold.value ? 'bg-emerald-500' : 'bg-rose-500'
})

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

function isCurrentMonth(date?: string | null) {
    if (!date) return false

    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return false

    const now = new Date()
    return (
        parsed.getFullYear() === now.getFullYear() &&
        parsed.getMonth() === now.getMonth()
    )
}

function openStartModal() {
    if (!hasCatPremiumAccess.value) {
        router.push({
            path: authStore.pricingRoute('nclex'),
            query: { redirect: '/nclex/exam/cat' },
        })
        return
    }

    if (!canStartCat.value) return

    const modal = document.getElementById('my_modal_3') as HTMLDialogElement | null
    modal?.showModal()
}

function startExam() {
    if (!hasCatPremiumAccess.value) {
        router.push({
            path: authStore.pricingRoute('nclex'),
            query: { redirect: '/nclex/exam/cat' },
        })
        return
    }

    if (!canStartCat.value) return
    router.push('/nclex/exam/cat')
}

function viewReport(attemptId: number) {
    router.push(`/nclex/adaptive-report/${attemptId}`)
}

function goToLatestReport() {
    if (!hasAttempts.value || !recentAttempt.value) return
    viewReport(recentAttempt.value.id)
}
</script>

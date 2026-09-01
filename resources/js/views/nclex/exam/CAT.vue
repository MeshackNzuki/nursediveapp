<template>
    <div
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-white-500 p-4 text-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh]">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
                <article class="rounded-2xl p-5 xl:col-span-8">
                    <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-200">
                        NCLEX CAT Simulator
                    </p>
                    <h1 class="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                        Computerized Adaptive Testing
                    </h1>
                    <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Use adaptive runs to test clinical judgment under shifting difficulty and review the report
                        before your next practice decision.
                    </p>

                    <div class="mt-5 flex flex-wrap gap-3">
                        <CommonButton button-text="Start a CAT" icon="pi pi-play"
                            classes="bg-sky-500 text-white shadow-none hover:bg-sky-600"
                            :action="openStartModal" :disabled="hasCatPremiumAccess && !canStartCat" />

                        <CommonButton button-text="Latest Report" icon="pi pi-chart-bar"
                            classes="border border-slate-200 bg-white text-slate-700 shadow-none hover:bg-slate-100 dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100 dark:hover:bg-sky-900"
                            :action="goToLatestReport" :disabled="!hasAttempts" />

                        <RouterLink to="/nclex/performance-analysis"
                            class="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100 dark:hover:bg-sky-900">
                            <i class="pi pi-wave-pulse"></i>
                            Analysis
                        </RouterLink>
                    </div>

                    <p class="mt-4 text-xs font-semibold" :class="hasCatPremiumAccess ? 'text-slate-500 dark:text-slate-300' : 'text-amber-700 dark:text-amber-300'">
                        {{ monthlyAttemptSummary }}
                    </p>
                </article>

                <aside class="xl:col-span-4">
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
                                <p class="mt-1 text-xl font-extrabold">{{ passRate }}%</p>
                            </div>
                            <div class="rounded-xl bg-white/10 p-3 text-white ring-1 ring-white/15">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-sky-100">Attempts</p>
                                <p class="mt-1 text-xl font-extrabold">{{ attemptCount }}</p>
                            </div>
                            <div class="rounded-xl bg-white/10 p-3 text-white ring-1 ring-white/15">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-sky-100">Avg.</p>
                                <p class="mt-1 text-xl font-extrabold">{{ Math.round(averageScore) }}%</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <article
                    class="rounded-2xl border border-slate-200 bg-light-blue-500 p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900 xl:col-span-7">
                    <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 class="text-lg font-extrabold text-slate-950 dark:text-white">Adaptive Workflow</h2>
                            <p class="text-xs text-slate-500 dark:text-slate-300">
                                A CAT run should lead directly into review and targeted remediation.
                            </p>
                        </div>
                        <span
                            class="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
                            {{ remainingAttemptsThisMonth }} left this month
                        </span>
                    </div>

                    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <article v-for="card in workflowCards" :key="card.title"
                            class="rounded-xl border border-sky-100 bg-white p-4 shadow-custom dark:border-sky-800 dark:bg-sky-950/50">
                            <div class="flex items-start gap-3">
                                <span
                                    class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-lg ring-1 ring-sky-100 dark:bg-sky-900/70 dark:ring-sky-800"
                                    :class="card.color">
                                    <i :class="card.icon"></i>
                                </span>
                                <div>
                                    <h3 class="font-bold leading-tight text-slate-950 dark:text-white">{{ card.title }}</h3>
                                    <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{{ card.copy }}</p>
                                </div>
                            </div>
                        </article>
                    </div>
                </article>

                <article
                    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900 xl:col-span-5">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Last Session Snapshot</h2>
                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                                The newest adaptive result becomes your report shortcut.
                            </p>
                        </div>
                        <span class="rounded-full px-3 py-1 text-xs font-bold" :class="latestStatusPillClass">
                            {{ latestStatusLabel }}
                        </span>
                    </div>

                    <div class="mt-5 rounded-xl bg-light-blue-500 p-4 dark:bg-sky-950/60">
                        <div class="flex items-end justify-between gap-4">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    Score
                                </p>
                                <p class="mt-1 text-3xl font-extrabold" :class="latestScoreClass">
                                    {{ hasAttempts ? `${latestScoreRounded}%` : "--" }}
                                </p>
                            </div>
                            <div class="min-w-0 text-right">
                                <p class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                    Completed
                                </p>
                                <p class="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                                    {{ hasAttempts ? formatDate(recentAttempt?.completed_at || recentAttempt?.created_at) : "No run yet" }}
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 h-2 overflow-hidden rounded-full bg-white ring-1 ring-sky-100 dark:bg-slate-800 dark:ring-sky-800">
                            <div class="h-full rounded-full" :class="latestScoreBarClass"
                                :style="{ width: `${hasAttempts ? latestScoreRounded : 0}%` }"></div>
                        </div>
                    </div>

                    <div class="mt-4 flex flex-wrap gap-2">
                        <button type="button" @click="openStartModal"
                            class="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="hasCatPremiumAccess && !canStartCat">
                            <i class="pi pi-play"></i>
                            Start CAT
                        </button>
                        <button type="button" @click="goToLatestReport"
                            class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-800 dark:text-slate-100 dark:hover:bg-sky-900"
                            :disabled="!hasAttempts">
                            <i class="pi pi-chart-bar"></i>
                            Report
                        </button>
                    </div>
                </article>
            </section>

            <section
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
                <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Recent CAT Attempts</h2>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                            Review adaptive runs and compare outcomes over time.
                        </p>
                    </div>
                    <span
                        class="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
                        {{ attemptCount }} logged
                    </span>
                </div>

                <div v-if="attempts.length > 0" class="overflow-x-auto rounded-xl border border-slate-200 dark:border-sky-800">
                    <table class="w-full min-w-[680px] text-left text-sm">
                        <thead class="bg-slate-700 text-white dark:bg-slate-800">
                            <tr>
                                <th class="px-4 py-3 font-semibold">Date</th>
                                <th class="px-4 py-3 font-semibold">Questions</th>
                                <th class="px-4 py-3 font-semibold">Score</th>
                                <th class="px-4 py-3 font-semibold">Status</th>
                                <th class="px-4 py-3 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200 dark:divide-sky-800">
                            <tr v-for="attempt in attempts.slice(0, 5)" :key="attempt.id"
                                class="bg-white transition hover:bg-sky-50 dark:bg-sky-950/40 dark:hover:bg-sky-950">
                                <td class="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                                    {{ formatDate(attempt.completed_at || attempt.created_at) }}
                                </td>
                                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                                    {{ attempt.suspend_index || "0" }}/150
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2">
                                        <div class="h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div class="h-full rounded-full"
                                                :class="attempt.score >= passThreshold ? 'bg-emerald-500' : 'bg-rose-500'"
                                                :style="{ width: `${Math.max(0, Math.min(100, Math.round(attempt.score || 0)))}%` }">
                                            </div>
                                        </div>
                                        <span class="font-bold text-slate-950 dark:text-white">{{ Math.round(attempt.score || 0) }}%</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span :class="[
                                        'rounded-full px-3 py-1 text-xs font-semibold',
                                        attempt.score >= passThreshold
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200'
                                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-200'
                                    ]">
                                        {{ attempt.score >= passThreshold ? 'Passed' : 'Needs review' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <button @click="viewReport(attempt.id)"
                                        class="inline-flex items-center gap-2 rounded-full bg-sky-500 px-3 py-1 text-xs font-bold text-white transition hover:bg-sky-600">
                                        <i class="pi pi-chart-bar"></i>
                                        View Report
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else
                    class="rounded-xl border border-dashed border-slate-300 bg-light-blue-500 p-10 text-center text-slate-500 dark:border-sky-800 dark:bg-sky-950/60 dark:text-slate-300">
                    No CAT attempts yet.
                </div>
            </section>
        </div>

        <dialog id="my_modal_3" class="modal">
            <div class="modal-box bg-white text-slate-900 dark:bg-sky-950 dark:text-slate-100">
                <form method="dialog">
                    <button
                        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-slate-500 dark:text-slate-300">
                        x
                    </button>
                </form>

                <h3 class="mb-2 pr-8 text-lg font-bold">NCLEX CAT Exam Instructions</h3>
                <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Answer each question carefully. The adaptive engine adjusts difficulty as you move, and you cannot
                    return to previous questions during the run.
                </p>

                <div class="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <div v-for="tip in modalTips" :key="tip" class="flex items-start gap-2 rounded-xl bg-light-blue-500 p-3 dark:bg-sky-900/70">
                        <i class="pi pi-check mt-1 text-emerald-500"></i>
                        <span>{{ tip }}</span>
                    </div>
                </div>

                <div class="mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {{ modalLimitSummary }}
                </div>

                <div class="mt-5 flex justify-end">
                    <CommonButton button-text="Start CAT Now" icon="pi pi-play"
                        classes="bg-sky-500 text-white shadow-none hover:bg-sky-600"
                        :action="startExam" :disabled="!canStartCat" />
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import CommonButton from '../../../components/Buttons/CommonButton.vue'
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

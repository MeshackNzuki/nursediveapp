<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh]  2xl:min-h-[94vh] overflow-y-scroll p-6 bg-gray-50">
        <!-- Background Gradient Clouds -->
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-purple-300 via-sky-300 to-teal-200 opacity-30 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-200 opacity-30 blur-[100px] rounded-full">
            </div>
        </div>

        <!-- Page Header -->
        <h3 class="font-bold text-2xl text-gray-800 mb-6">
            Computerized Adaptive Testing (CAT)
        </h3>

        <section
            class="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-50 via-indigo-50 to-cyan-50 p-8 text-slate-900 mb-4 dark:border-white/10 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-950 dark:text-white">
            <div
                class="absolute inset-0 bg-gradient-to-br from-emerald-200/50 via-sky-200/50 to-indigo-200/30 opacity-60 blur-3xl dark:from-emerald-500/40 dark:via-blue-500/20 dark:to-slate-900/40 dark:opacity-70">
            </div>
            <div class="relative grid gap-8 lg:grid-cols-[1.4fr,0.9fr]">
                <div>
                    <div class="flex flex-row justify-between">
                        <div>
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <p class="text-xs uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-200">
                                        Adaptive CAT</p>
                                    <h1 class="mt-2 text-4xl font-bold text-slate-900 dark:text-white">Overview</h1>
                                </div>
                            </div>
                            <p class="mt-4 text-sm text-slate-600 dark:text-white/70">{{ latestAttemptSummary }}</p>
                            <div class="mt-6 flex flex-wrap gap-3">
                                <CommonButton button-text="Start a CAT" icon="pi pi-play"
                                    classes="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 hover:bg-white/90"
                                    :action="openStartModal" :disabled="hasCatPremiumAccess && !canStartCat" />

                                <CommonButton button-text="View Latest Report" icon="pi pi-chart-bar-square pi-square"
                                    classes="border border-slate-300 hover:bg-white/80 dark:border-white/40 dark:text-white dark:hover:bg-white/10"
                                    :action="goToLatestReport" :disabled="!hasAttempts" />
                            </div>
                            <p class="mt-3 text-xs text-slate-600 dark:text-white/70">
                                {{ monthlyAttemptSummary }}
                            </p>
                            <p v-if="!hasCatPremiumAccess" class="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
                                CAT is premium. Starting a CAT will redirect you to pricing.
                            </p>
                        </div>
                        <div v-if="recentAttempt"
                            :class="`bg-gray-200 radial-progress h-32 w-32 mt-6 ${Math.round(averageScore) >= catStore.passThreshold ? 'text-emerald-600' : 'text-rose-400'}`"
                            style="--value:100;">{{ Math.round(averageScore) >= catStore.passThreshold ? 'PASS' :
                                'FAIL' }}
                        </div>
                        <div v-else :class="`bg-gray-200 radial-progress h-32 w-32 mt-6 text-orange-400`"
                            style="--value:100;">No Test
                        </div>
                    </div>

                    <div class="mt-6 grid gap-3 sm:grid-cols-3">
                        <div
                            class="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-800 shadow-md shadow-sky-100/40 dark:border-white/20 dark:bg-white/5 dark:text-white dark:shadow-xl dark:shadow-slate-900/50">
                            <div class="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">Pass rate
                            </div>
                            <div class="mt-2 text-2xl font-bold">{{ passRate }}%</div>
                            <div class="text-xs text-slate-500 dark:text-white/60">across all attempts</div>
                        </div>
                        <div
                            class="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-800 shadow-md shadow-sky-100/40 dark:border-white/20 dark:bg-white/5 dark:text-white dark:shadow-xl dark:shadow-slate-900/50">
                            <div class="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">Attempts
                            </div>
                            <div class="mt-2 text-2xl font-bold">{{ attemptCount }}</div>
                            <div class="text-xs text-slate-500 dark:text-white/60">logged runs</div>
                        </div>
                        <div
                            class="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-800 shadow-md shadow-sky-100/40 dark:border-white/20 dark:bg-white/5 dark:text-white dark:shadow-xl dark:shadow-slate-900/50">
                            <div class="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">Avg. score
                            </div>
                            <div class="mt-2 text-2xl font-bold">{{ Math.round(averageScore) }}%</div>
                            <div class="text-xs text-slate-500 dark:text-white/60">per session</div>
                        </div>
                    </div>
                </div>
                <div
                    class="relative rounded-[28px] border border-slate-200 bg-white/70 p-6 text-slate-800 shadow-xl shadow-sky-100/50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:shadow-2xl dark:shadow-slate-900/60">
                    <p class="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">Precision by design
                    </p>
                    <h3 class="mt-3 text-2xl font-bold text-slate-900 dark:text-white">Adaptive intelligence</h3>
                    <p class="mt-2 text-sm text-slate-600 dark:text-white/80">
                        Every question adapts to your performance so you only spend effort where your knowledge needs
                        reinforcement.
                    </p>
                    <ul class="mt-6 space-y-4 text-sm text-slate-600 dark:text-white/80">
                        <li class="flex items-start gap-3">
                            <span
                                class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">1</span>
                            <div>
                                <p class="font-semibold text-slate-900 dark:text-white">Section precision</p>
                                <p class="text-xs text-slate-500 dark:text-white/70">Track how each domain contributes
                                    to the final score.
                                </p>
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <span
                                class="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300">2</span>
                            <div>
                                <p class="font-semibold text-slate-900 dark:text-white">Dynamic pacing</p>
                                <p class="text-xs text-slate-500 dark:text-white/70">Difficulty shifts keep you
                                    challenged without
                                    overwhelming you.</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-3">
                            <span
                                class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300">3</span>
                            <div>
                                <p class="font-semibold text-slate-900 dark:text-white">Action-ready</p>
                                <p class="text-xs text-slate-500 dark:text-white/70">Reports highlight what to drill
                                    next.</p>
                            </div>
                        </li>
                    </ul>
                    <div
                        class="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
                        <p class="font-semibold text-slate-700 dark:text-white/80">Last session snapshot</p>
                        <p> {{ hasAttempts ? `${Math.round(recentAttempt?.score || 0)}% score` :
                            'Awaiting your first run' }}
                        </p>
                        <p>{{ hasAttempts ? formatDate(recentAttempt?.completed_at) : 'Run a CAT to create a report' }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Why Adaptive Testing Section -->
        <div class="bg-white/80 rounded-2xl p-8 mb-8 border border-gray-100 ">
            <h4 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i class="pi pi-lightbulb text-yellow-500"></i>
                Why Choose Adaptive Testing?
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex gap-4">
                    <span
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-700 dark:text-green-300">
                        &#10004</span>

                    <div>
                        <h5 class="font-semibold text-gray-800 mb-1">Efficient Assessment</h5>
                        <p class="text-sm text-gray-600">
                            CAT adjusts question difficulty based on your responses, giving you an accurate score with
                            fewer questions
                        </p>
                    </div>
                </div>
                <div class="flex gap-4">

                    <span
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300">&#10004</span>
                    <div>
                        <h5 class="font-semibold text-gray-800 mb-1">Real NCLEX Experience</h5>
                        <p class="text-sm text-gray-600">
                            Mimics the actual NCLEX-RN exam format with dynamic difficulty progression
                        </p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <span
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-teal-700 dark:text-sky-300">&#10004</span>
                    <div>
                        <h5 class="font-semibold text-gray-800 mb-1">Personalized Learning</h5>
                        <p class="text-sm text-gray-600">
                            Tests are tailored to your skill level, focusing on areas needing improvement
                        </p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <span
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300">&#10004</span>

                    <div>
                        <h5 class="font-semibold text-gray-800 mb-1">Comprehensive Feedback</h5>
                        <p class="text-sm text-gray-600">
                            Detailed performance analysis shows your strengths and areas for improvement by subject
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Attempts Section -->
        <div v-if="attempts.length > 0" class="bg-white/80 rounded-2xl p-8 border border-gray-100">
            <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <i class="pi pi-history text-blue-500"></i>
                Recent Attempts
            </h4>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                            <th class="text-left py-3 px-4 font-semibold text-gray-700">Questions</th>
                            <th class="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                            <th class="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                            <th class="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="attempt in attempts.slice(0, 5)" :key="attempt.id"
                            class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="py-3 px-4">{{ formatDate(attempt.completed_at) }}</td>
                            <td class="py-3 px-4">{{ attempt.suspend_index || '0' }}/150</td>
                            <td class="py-3 px-4">
                                -
                            </td>
                            <td class="py-3 px-4">
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-semibold',
                                    attempt.score >= 65
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-rose-100  text-rose-700'
                                ]">
                                    {{ attempt.score >= 65 ? 'Passed' : 'Failed' }}
                                </span>
                            </td>
                            <td class="py-3 px-4">
                                <button @click="viewReport(attempt.id)"
                                    class="text-teal-600 hover:text-teal-800 font-semibold">
                                    View Report
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <dialog id="my_modal_3" class="modal">
            <div class="modal-box bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                <form method="dialog">
                    <button
                        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-slate-500 dark:text-slate-300">
                        x
                    </button>
                </form>

                <h3 class="text-lg font-bold mb-2">NCLEX CAT Exam Instructions</h3>

                <div class="space-y-3 text-sm leading-relaxed">
                    <p>
                        You are about to begin a <strong>Computerized Adaptive Test (CAT)</strong>.
                        The difficulty of each question will adjust based on your previous answers.
                    </p>

                    <ul class="list-disc pl-5 space-y-1">
                        <li>Answer each question carefully - you cannot return to previous questions.</li>
                        <li>The exam adapts to your ability level in real time.</li>
                        <li>Do not guess patterns - focus on clinical reasoning.</li>
                        <li>Read all options before selecting your answer.</li>
                        <li>Prioritize patient safety, ABCs, and nursing judgment.</li>
                    </ul>

                    <div class="mt-3">
                        <p class="font-semibold">Tips for Success:</p>
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Eliminate clearly incorrect options first.</li>
                            <li>Look for keywords: <em>priority, first, best, immediate</em>.</li>
                            <li>Apply frameworks like ABCs, Maslow, and Safety.</li>
                            <li>Stay calm - difficulty increasing usually means you're performing well.</li>
                        </ul>
                    </div>
                    <div class="mt-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <p class="text-xs">
                            {{ modalLimitSummary }}
                        </p>
                    </div>
                </div>

                <div class="mt-5">
                    <CommonButton button-text="Start CAT Now" icon="pi pi-play"
                        classes="text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
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
    const passed = attempts.value.filter((a) => a.score >= 65).length
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
        return 'CAT is available for premium NCLEX plans.'
    }

    if (canStartCat.value) {
        const suffix = remainingAttemptsThisMonth.value === 1 ? '' : 's'
        return `${remainingAttemptsThisMonth.value} CAT attempt${suffix} remaining this month.`
    }

    return 'Monthly CAT limit reached (3 attempts). Available again next month.'
})
const modalLimitSummary = computed(() => {
    if (canStartCat.value) {
        return `You can only take the CAT exam ${monthlyLimit} times per month. ${remainingAttemptsThisMonth.value} remaining this month.`
    }

    return `You can only take the CAT exam ${monthlyLimit} times per month. You have reached the monthly limit.`
})

const latestAttemptSummary = computed(() => {
    if (!recentAttempt.value) {
        return 'No CAT attempts yet. Start an adaptive exam to unlock the full report.'
    }

    const score = Math.round(recentAttempt.value.score || 0)
    return `Last attempt on ${formatDate(recentAttempt.value.completed_at)} - ${score}% achieved`
})

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

function isCurrentMonth(date: string) {
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


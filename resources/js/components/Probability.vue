<template>
    <section
        class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div class="pointer-events-none absolute inset-0 -z-10">
            <div
                class="absolute -left-20 -top-16 h-56 w-56 rounded-full bg-gradient-to-r from-cyan-300/35 via-sky-300/35 to-emerald-300/30 blur-3xl dark:from-cyan-500/20 dark:via-sky-500/20 dark:to-emerald-500/15">
            </div>
            <div
                class="absolute -right-12 top-10 h-48 w-48 rounded-full bg-gradient-to-r from-emerald-300/25 via-sky-300/20 to-cyan-300/20 blur-3xl dark:from-emerald-500/15 dark:via-sky-500/10 dark:to-cyan-500/10">
            </div>
        </div>

        <header class="mb-4">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Your Chances of Passing the Real Exam</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">
                Model-based estimate from your recent performance trend.
            </p>
        </header>

        <div class="grid gap-4 lg:grid-cols-[340px,1fr] lg:items-center">
            <div class="mx-auto w-full">
                <Gaunge label="Pass probability" :level="probability" :pass-mark="passMark" />
            </div>

            <div class="space-y-3">
                <div class="rounded-xl border border-slate-200 bg-slate-50/90 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <div class="mb-1 flex items-center justify-between text-sm">
                        <span class="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
                            <i class="pi pi-chart-line text-sky-500"></i>
                            Pass Probability
                        </span>
                        <span class="inline-flex items-center gap-1 font-semibold" :class="probabilityColor">
                            <i :class="['pi', trendIcon]"></i>{{ probability }}%
                        </span>
                    </div>
                    <div class="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700">
                        <div class="h-2.5 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 transition-all duration-700"
                            :style="{ width: `${probability}%` }"></div>
                    </div>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                    <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-700/60 dark:bg-emerald-900/25">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-emerald-800 dark:text-emerald-200">Confidence</span>
                            <span class="text-sm font-semibold text-emerald-700 dark:text-emerald-200">{{ confidenceScore }}%</span>
                        </div>
                        <p class="mt-1 text-xs text-emerald-700/90 dark:text-emerald-200/90">
                            Stability across your most recent attempts.
                        </p>
                    </div>

                    <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-700/60 dark:bg-amber-900/25">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-amber-800 dark:text-amber-200">Adjusted</span>
                            <span class="text-sm font-semibold text-amber-700 dark:text-amber-200">{{ difficultyAdjusted }}%</span>
                        </div>
                        <p class="mt-1 text-xs text-amber-700/90 dark:text-amber-200/90">
                            Weighted blend of probability and confidence.
                        </p>
                    </div>
                </div>

                <div class="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900/60">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-slate-500 dark:text-slate-300">Attempts analyzed: <strong class="text-slate-700 dark:text-slate-100">{{ attemptsCount }}</strong></span>
                        <span class="text-slate-500 dark:text-slate-300">Average score: <strong class="text-slate-700 dark:text-slate-100">{{ averageScore }}%</strong></span>
                        <span class="text-slate-500 dark:text-slate-300">Range: <strong class="text-slate-700 dark:text-slate-100">{{ lowestScore }} - {{ highestScore }}%</strong></span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import Gaunge from './Gaunge.vue'

const attempts = ref<any[]>([])

const props = defineProps<{
    product: string
    passMark: number
}>()

const fetchAttempts = async () => {
    try {
        const response = await axios.get(`${props.product}/previous-attempts`)
        attempts.value = response.data.data || []
    } catch {
        attempts.value = []
    }
}

onMounted(() => {
    fetchAttempts()
})

const attemptsCount = computed(() => attempts.value.length)

const safeScores = computed(() => attempts.value.map((a) => Number(a.score) || 0))

const averageScore = computed(() => {
    const filtered = safeScores.value.filter((s) => s >= 5)
    if (!filtered.length) return 0
    return Math.round(filtered.reduce((a, b) => a + b, 0) / filtered.length)
})

const highestScore = computed(() => {
    if (!safeScores.value.length) return 0
    return Math.max(...safeScores.value)
})

const lowestScore = computed(() => {
    if (!safeScores.value.length) return 0
    return Math.min(...safeScores.value)
})

const probability = computed(() => {
    const score = Number(averageScore.value) || 0
    if (score <= 0) return 0

    const p = 1 / (1 + Math.exp(-(score - props.passMark) / 5))
    if (Number.isNaN(p)) return 0
    return Math.round(p * 100)
})

const confidenceScore = computed(() => {
    const recent = safeScores.value.slice(-10)
    if (recent.length < 2) return 50

    const avg = recent.reduce((a, b) => a + b, 0) / recent.length
    const variance = recent.reduce((sum, x) => sum + Math.pow(x - avg, 2), 0) / recent.length
    const stddev = Math.sqrt(variance)
    if (Number.isNaN(stddev)) return 50

    const confidence = 100 - Math.min(stddev * 2, 60)
    return Math.round(confidence)
})

const difficultyAdjusted = computed(() => {
    const base = Number(probability.value) || 0
    const confidence = Number(confidenceScore.value) || 0
    const adjusted = Math.round(base * 0.7 + confidence * 0.3)
    return Math.min(100, Math.max(0, adjusted))
})

const trendIcon = computed(() => (probability.value < 50 ? 'pi-arrow-down text-rose-500' : 'pi-arrow-up text-emerald-500'))

const probabilityColor = computed(() => {
    if (probability.value < 50) return 'text-rose-600 dark:text-rose-300'
    if (probability.value < 80) return 'text-amber-600 dark:text-amber-300'
    return 'text-emerald-600 dark:text-emerald-300'
})
</script>

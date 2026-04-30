<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-white ">

        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[300px] w-[300px] lg:h-[600px] lg:w-[600px] bg-gradient-to-r from-purple-300 via-sky-300 to-teal-200 opacity-30 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-200 opacity-30 blur-[100px] rounded-full">
            </div>
        </div>

        <h1 class="p-3 text-2xl font-semibold text-gray-800 mb-6">Performance Analysis</h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 bg-white/80 p-3 rounded-2xl">

            <StatCard label="Total Attempts" :quantity="attempts.length" icon="pi pi-file" trend="up"
                description="40 updated / 2026" variant="sky" />

            <StatCard label="Highest Score" :quantity="`${highestScore}%`" icon="pi pi-pencil" description="All time"
                link="/teas/previous-attempts" variant="accent" />

            <StatCard label="Lowest Score" icon="pi pi-percentage" description="Recent attempts"
                :quantity="`${lowestScore}%`" link="/teas/performance-analysis" variant="rose" />
            <StatCard label="Average Score" icon="pi pi-percentage" description="Recent attempts"
                :quantity="`${averageScore}%`" link="/teas/performance-analysis" variant="amber" />

        </div>


        <div class="flex flex-col md:flex-row justify-center items-stretch gap-6 mb-12">

            <!-- Pass Probability Card -->
            <div class="w-full md:w-1/2 bg-white  rounded-2xl p-2 flex flex-col items-center ">
                <div class="flex items-center gap-2">
                    <h3 class="text-lg font-semibold text-gray-800">Your Chances of Passing the Real Exam</h3>
                </div>

                <div class="w-full mb-6 flex justify-center">
                    <Gaunge :pass-mark="75" label="Pass Probability" :level="probability" />
                </div>

                <div
                    class="flex flex-col items-start w-full space-y-3 text-sm bg-blue-50 p-4 rounded-lg border border-blue-100 mt-2">
                    <!-- Pass Probability -->
                    <div class="tooltip tooltip-info w-full"
                        :data-tip="'Estimated chance of passing the real exam based on a logistic probability model.'">
                        <div class="flex justify-between items-center">
                            <span class="flex items-center gap-1"><i class="pi pi-chart-line text-sky-500"></i> Pass
                                Probability is</span>
                            <span :class="probabilityColor">{{ probability }}%</span>
                        </div>
                    </div>

                    <!-- Confidence Level -->
                    <div class="tooltip tooltip-accent w-full"
                        :data-tip="'Consistency score based on variation in your recent attempts. Lower variation = higher confidence.'">
                        <div class="flex justify-between items-center">
                            <span class="flex items-center gap-1"><i class="pi pi-check-circle text-teal-500"></i>
                                Confidence Level</span>
                            <span class="font-semibold">{{ confidenceScore }}%</span>
                        </div>
                    </div>

                    <!-- Difficulty-Adjusted Probability -->
                    <div class="tooltip tooltip-warning w-full"
                        :data-tip="'Weighted blend of pass probability and consistency to estimate true readiness.'">
                        <div class="flex justify-between items-center">
                            <span class="flex items-center gap-1"><i
                                    class="pi pi-exclamation-triangle text-yellow-500"></i> Difficulty-Adjusted</span>
                            <span class="font-semibold">{{ difficultyAdjusted }}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recommendations Card -->
            <div
                class="w-full md:w-1/2  rounded-2xl p-2 border border-success border-dashed flex flex-col justify-between">
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <i class="pi pi-lightbulb text-yellow-500 text-xl"></i>
                        <h3 class="text-lg font-semibold text-gray-800">General Recommendation</h3>
                    </div>
                    <span class="text-gray-600 mb-3">Based on your performance, we recommend focusing on the
                        following:</span>
                    <ul class="list-disc list-inside text-gray-600 space-y-1">
                        <li>Review the topics where you scored below 60%</li>
                        <li>Practice more questions in the areas of weakness</li>
                        <li>Consider taking additional mock tests</li>
                    </ul>
                </div>
                <div class="mt-6 w-full flex justify-center">
                    <CommonButton :action="() => $router.push('/nursing/previous-attempts')" button-text="Go to reports"
                        icon2="pi pi-arrow-right" classes="btn-primary w-full md:w-auto" />
                </div>
                <div class="mt-6 w-full flex justify-center">
                    <CommonButton :action="() => $router.push('/nursing/')" button-text="Take more tests"
                        icon2="pi pi-arrow-right" classes="btn-primary w-full md:w-auto" />
                </div>
            </div>
        </div>
        <!-- <div class="w-full flex flex-col justify-center items-center h-96">
            <LineChart />
        </div> -->
        <div class="bg-gray-50 rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-700 mb-4">Score History</h2>
            <ul class="space-y-3">
                <li v-for="attempt in attempts.slice(0, 4)" :key="attempt.id"
                    class="flex justify-between text-gray-600 border-b pb-2">
                    <span>{{ attempt.sub_topic_name }}</span>
                    <span>{{ formatDate(attempt.created_at) }} — <strong>{{ attempt.score }}%</strong></span>
                </li>
            </ul>
            <CommonButton :action="() => $router.push('/nursing/previous-attempts')" button-text="View all attempts"
                icon2="pi pi-arrow-right" classes="mt-4" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StatCard from "../../components/Stats/NewStat.vue";
import LineChart from '../../components/Charts/LineChart.vue';
import axios from 'axios';
import CommonButton from '../../components/Buttons/CommonButton.vue';
import Gaunge from '../../components/Gaunge.vue';

const attempts = ref([] as any[])

const fetchAttempts = async () => {
    const response = await axios.get('nursing/previous-attempts')
    attempts.value = response.data.data
}

fetchAttempts()

/* ---------------------------------------------------------
|  ALWAYS CLEAN SCORE → number
--------------------------------------------------------- */
const safeScores = computed(() => {
    return attempts.value.map(a => Number(a.score) || 0)
})

/* ---------------------------------------------------------
|  AVERAGE SCORE
--------------------------------------------------------- */
const averageScore = computed(() => {
    const filtered = safeScores.value.filter(s => s >= 20)
    if (!filtered.length) return 0
    return Math.round(filtered.reduce((a, b) => a + b, 0) / filtered.length)
})


/* ---------------------------------------------------------
|  MIN / MAX SCORE (100% SAFE)
--------------------------------------------------------- */
const highestScore = computed(() => {
    if (!safeScores.value.length) return 0
    return Math.max(...safeScores.value)
})

const lowestScore = computed(() => {
    if (!safeScores.value.length) return 0
    return Math.min(...safeScores.value)
})

/* ---------------------------------------------------------
|  PASS PROBABILITY — LOGISTIC MODEL
--------------------------------------------------------- */
const passMark = 75

const probability = computed(() => {
    const score = Number(averageScore.value) || 0

    // score below 20 → probability is very low but not 0
    if (score <= 0) return 0

    const p = 1 / (1 + Math.exp(-(score - passMark) / 5))

    if (isNaN(p)) return 0

    return Math.round(p * 100)
})

/* ---------------------------------------------------------
|  CONFIDENCE SCORE (VARIATION)
--------------------------------------------------------- */
const confidenceScore = computed(() => {
    const recent = safeScores.value.slice(-10)
    if (recent.length < 2) return 50

    const avg = recent.reduce((a, b) => a + b, 0) / recent.length
    const variance = recent.reduce((s, x) => s + Math.pow(x - avg, 2), 0) / recent.length
    const stddev = Math.sqrt(variance)

    if (isNaN(stddev)) return 50

    const confidence = 100 - Math.min(stddev * 2, 60)
    return Math.round(confidence)
})

/* ---------------------------------------------------------
|  DIFFICULTY-ADJUSTED PASS PROBABILITY
--------------------------------------------------------- */
const difficultyAdjusted = computed(() => {
    const base = Number(probability.value) || 0
    const confidence = Number(confidenceScore.value) || 0

    const adjusted = Math.round((base * 0.7) + (confidence * 0.3))
    return Math.min(100, Math.max(0, adjusted))
})

/* ---------------------------------------------------------
|  COLOR CODING
--------------------------------------------------------- */
const probabilityColor = computed(() => {
    if (probability.value < 50) return "text-red-500 font-semibold"
    if (probability.value < 80) return "text-yellow-500 font-semibold"
    return "text-green-600 font-semibold"
})

/* ---------------------------------------------------------
|  DATE FORMATTER
--------------------------------------------------------- */
const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateStr).toLocaleDateString(undefined, options)
}
</script>

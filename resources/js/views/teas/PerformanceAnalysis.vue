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
            <StatCard icon="pi pi-file" label="Total Attempts" :quantity="attempts.length" variant="sky" />

            <StatCard icon="pi pi-chart-line" label="Average Score" :quantity="averageScore" suffix="%"
                variant="amber" />

            <StatCard icon="pi pi-star" label="Highest Score" :quantity="highestScore" suffix="%" variant="accent" />

            <StatCard icon="pi pi-exclamation-triangle" label="Lowest Score" :quantity="lowestScore" suffix="%"
                variant="rose" />
        </div>


        <div class="flex flex-col md:flex-row justify-center items-stretch gap-6 mb-12">

            <!-- Pass Probability Card -->
            <div class="w-full md:w-1/2 bg-white  rounded-2xl p-2 flex flex-col items-center ">
                <Probability :pass-mark="75" product="teas" />
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
                    <CommonButton :action="() => $router.push('/teas/previous-attempts')" button-text="Go to reports"
                        icon2="pi pi-arrow-right" classes="btn-primary w-full md:w-auto" />
                </div>
                <div class="mt-6 w-full flex justify-center">
                    <CommonButton :action="() => $router.push('/teas/')" button-text="Take more tests"
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
            <CommonButton :action="() => $router.push('/teas/previous-attempts')" button-text="View all attempts"
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
import Probability from '../../components/Probability.vue';


const attempts = ref([] as any[])

const fetchAttempts = async () => {
    const response = await axios.get('teas/previous-attempts')
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

const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateStr).toLocaleDateString(undefined, options)
}
</script>

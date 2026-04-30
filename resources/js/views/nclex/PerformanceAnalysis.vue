<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh]  2xl:min-h-[94vh] overflow-y-scroll p-6 bg-white ">
        <div class="absolute inset-0  pointer-events-none -z-10">
            <!-- Purple to Sky to Green Gradient Cloud -->
            <div
                class="absolute -top-20 -left-40 h-[300px] w-[300px] lg:h-[600px] lg:w-[600px] bg-gradient-to-r from-purple-300 via-sky-300 to-teal-200 opacity-30 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-200 opacity-30 blur-[100px] rounded-full">
            </div>
        </div>

        <h1 class="p-3 text-2xl font-semibold text-gray-800 mb-6"> Performance Analysis</h1>


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
        <div class="flex flex-col md:flex-row justify-center items-center mb-12">
            <div class="flex flex-col justify-center items-center w-full md:w-1/2 mb-6 md:mb-0">
                <Gaunge label="Probability" :level="averageScore + 20" />
                <span class="text-center text-sm mt-12">
                    You probability of passing the exam is around {{ averageScore + 20 }}% as per your current
                    performance.
                </span>
            </div>
            <div
                class="w-full md:w-1/2 flex flex-col justify-center items-center mt-6 md:mt-0 border border-success p-2 rounded-2xl">
                <h2 class="text-lg font-semibold text-gray-700 mb-4 custom-underline-red">General recommendation</h2>
                <span class="text-gray-600 mb-2">Based on your performance, we recommend focusing on the following
                    areas:</span>
                <ul class="list-dash list-inside text-gray-600">
                    <li>Review the topics where you scored below 60%</li>
                    <li>Practice more questions in the areas of weakness</li>
                    <li>Consider taking additional mock tests</li>
                </ul>
                <CommonButton :action="() => $router.push('/nclex/')" button-text="Take more tests"
                    icon2="pi pi-arrow-right" classes="mt-4" />
            </div>
        </div>
        <!-- <div class="w-full flex flex-col justify-center items-center h-96">
            <LineChart />
        </div> -->
        <!-- Optional: chart placeholder -->
        <div class="bg-gray-50 rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-700 mb-4">Score History</h2>
            <ul class="space-y-3">
                <li v-for="attempt in attempts.slice(0, 4)" :key="attempt.id"
                    class="flex justify-between text-gray-600 border-b pb-2">
                    <span>{{ attempt.sub_topic_name }}</span>
                    <span>{{ formatDate(attempt.created_at) }} — <strong>{{ attempt.score }}%</strong></span>
                </li>
            </ul>
            <CommonButton :action="() => $router.push('/nclex/previous-attempts')" button-text="View all attempts"
                icon2="pi pi-arrow-right" classes="mt-4" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios';
import CommonButton from '../../components/Buttons/CommonButton.vue';
import Gaunge from '../../components/Gaunge.vue';
import StatCard from '../../components/Stats/NewStat.vue';


const attempts = ref([] as any[])

const fetchAttempts = async () => {
    const response = await axios.get('nclex/previous-attempts')
    attempts.value = response.data.data
}

fetchAttempts()

const averageScore = computed(() => {
    if (attempts.value.length === 0) return 0
    const total = attempts.value.reduce((sum, a) => sum + Number(a.score), 0)
    return Math.round(total / attempts.value.length)
})

const highestScore = computed(() => Math.max(...attempts.value.map(a => a.score)))
const lowestScore = computed(() => Math.min(...attempts.value.map(a => a.score)))

function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}
</script>

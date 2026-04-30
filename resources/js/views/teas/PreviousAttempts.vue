<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh]  2xl:min-h-[94vh] overflow-y-scroll p-6 bg-white ">
        <div class="absolute inset-0  pointer-events-none -z-10">
            <!-- Purple to Sky to Green Gradient Cloud -->
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-purple-300 via-sky-300 to-teal-200 opacity-30 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-200 opacity-30 blur-[100px] rounded-full">
            </div>
        </div>
        <Table :headers="['Exam Title', 'Attempted At', 'Scores', 'ACTIONS']" title="Previous Attempts"
            search_placeholder="Search Attempt" :rows="filteredAttempts.length" v-model:query="searchTerm">
            <template v-slot:content>
                <tr v-for="(attempt, index) in filteredAttempts" :key="index">
                    <td class="p-2 whitespace-nowrap">
                        <div class="font-semibold ps-1">{{ normalizeText(attempt.sub_topic_name) }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div class="font-semibold ps-1">
                            {{ new Date(attempt.created_at).toLocaleDateString() }}
                        </div>
                    </td>
                    <td class="p-2 whitespace-nowrap flex flex-row items-center gap-2">
                        <div class="flex-1 bg-gray-300 rounded-full h-1.5 overflow-hidden">
                            <div class='h-1.5' :style="dynamicProgressStyle(attempt.score)">
                            </div>
                        </div>
                        <div class="font-base">{{ Math.round(attempt.score) }}%</div>
                    </td>
                    <td>
                        <SmallButton icon="pi pi-file" buttonText="View Report"
                            :action="() => viewReport(attempt.id)" />
                    </td>
                    <td>
                        <SmallButton icon="pi pi-refresh" classes="bg-teal-500" buttonText="Review Attempt"
                            :action="() => ReviewAttempt(attempt.id)" />
                    </td>
                </tr>
            </template>
        </Table>
    </div>
</template>

<script setup lang="ts">import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Table from '../../components/Tables/mainTable.vue'
import axios from 'axios'
import SmallButton from '../../components/Buttons/Small.vue'
import { normalizeText } from '../../utils/normalizeText'
import { dynamicProgressStyle } from '../../utils/grader'


const router = useRouter()

const attempts = ref<any[]>([])
const searchTerm = ref('')

// Computed filtered attempts
const filteredAttempts = computed(() => {
    if (!searchTerm.value.trim()) {
        return attempts.value
    }
    return attempts.value.filter(a =>
        a.sub_topic_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        a.score.toString().includes(searchTerm.value) ||
        new Date(a.created_at).toLocaleDateString().includes(searchTerm.value)
    )
})

const fetchAttempts = async () => {
    const response = await axios.get('teas/previous-attempts')
    attempts.value = response.data.data
}

onMounted(() => {
    fetchAttempts()
})

function viewReport(attemptId: number) {
    router.push(`/teas/performance-report/${attemptId}`)
}

function ReviewAttempt(attemptId: number) {
    router.push(`/teas/exam/${attemptId}?mode=review`)
}

</script>

<template>
    <div class="dash-shell">
        <div class="mx-auto max-w-screen-2xl">
            <ProductBreadcrumb product="teas" :items="[{ label: 'Test bank' }]" />

            <ExamSetList :exams="exams" :attempts="attempts" :loading="loading" eyebrow="TEAS test bank"
                :title="subject ? `${subject}` : 'Loading subject...'"
                subtitle="Timed practice sets in exam order. Start fresh, resume, or review a finished set."
                :search-placeholder="`Search in ${subject || 'this section'}...`" name-prefix="TEAS 7 " :sort-default="byTrailingNumber"
                @start="openModal" @resume="resumeExam" @review="reviewAttempt">
                <template #lead>
                    <RouterLink to="/teas" class="mb-3 inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:underline dark:text-slate-300">
                        <i class="pi pi-arrow-left text-[10px]"></i> TEAS dashboard
                    </RouterLink>
                </template>
                <template #actions>
                    <RouterLink to="/teas/guide-topics" class="dash-btn border border-orange-200 bg-orange-50 px-4 py-2 text-orange-700 shadow-none hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-200">
                        <i class="pi pi-map text-[10px]"></i> Study guides
                    </RouterLink>
                    <RouterLink to="/teas/performance-analysis" class="dash-btn-ghost px-4 py-2"><i class="pi pi-chart-line text-[10px]"></i> Performance</RouterLink>
                </template>
            </ExamSetList>
        </div>

        <ExamModeModal ref="modeModal" product="teas" :exam="selectedExam" :modes="['tutor', 'exam']" @select="goToExam" />
    </div>
</template>

<script setup lang="ts">
import ProductBreadcrumb from "../../components/ProductBreadcrumb.vue"
import ExamSetList from "../../components/Exam/ExamSetList.vue"
import type { ExamSetItem } from "../../components/Exam/ExamSetList.vue"
import ExamModeModal from "../../components/Exam/ExamModeModal.vue"
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import axios from 'axios'

const exams = ref<ExamSetItem[]>([])
const subject = ref('')
const attempts = ref<any[]>([])
const loading = ref(true)

const route = useRoute()
const router = useRouter()

const modeModal = ref<InstanceType<typeof ExamModeModal> | null>(null)
const selectedExam = ref<ExamSetItem | null>(null)

const subjectSlug = computed(() =>
    (route.params.examId || route.params.id || route.path.split('/').pop() || '') as string
)

const fetchExams = async (slug: string) => {
    if (!slug) return
    loading.value = true
    try {
        const response = await axios.get(`/teas/exam-topics-per-subject/${slug}`)
        exams.value = response.data.data.topics || []
        subject.value = response.data.data.subject || ''
    } catch (error) {
        console.error('Error fetching exams:', error)
    } finally {
        loading.value = false
    }
}

watch(
    () => subjectSlug.value,
    (newSlug, oldSlug) => {
        if (newSlug && newSlug !== oldSlug) {
            fetchExams(newSlug)
        }
    }
)

onMounted(async () => {
    await fetchExams(subjectSlug.value)
    const res = await axios.get('teas/previous-attempts')
    attempts.value = res.data.data || []
})

/** "Math test 1, Math test 2, ..." keeps its numeric order. */
const byTrailingNumber = (a: ExamSetItem, b: ExamSetItem) => {
    const numA = parseInt(a.name.match(/\d+$/)?.[0] ?? '0', 10)
    const numB = parseInt(b.name.match(/\d+$/)?.[0] ?? '0', 10)
    return numA - numB
}

const openModal = async (exam: ExamSetItem) => {
    selectedExam.value = exam
    await nextTick()
    modeModal.value?.open()
}

const goToExam = (mode: 'tutor' | 'exam' | 'review') => {
    if (selectedExam.value) {
        router.push(`/teas/exam/${selectedExam.value.id}?mode=${mode}`)
        modeModal.value?.close()
    }
}

const resumeExam = (attemptId: number | null) => {
    if (!attemptId) return
    router.push(`/teas/exam/${attemptId}?resume=true`)
}

const reviewAttempt = (attemptId: number | null) => {
    if (!attemptId) return
    router.push(`/teas/exam/${attemptId}?mode=review`)
}
</script>

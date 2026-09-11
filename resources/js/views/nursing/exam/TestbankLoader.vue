<template>
    <div class="dash-shell">
        <div class="mx-auto max-w-screen-2xl">
            <ProductBreadcrumb product="nursing" :items="[{ label: 'Test bank' }]" />

            <ExamSetList :exams="exams" :attempts="attempts" :loading="loading" eyebrow="Nursing test bank"
                :title="subject ? `${subject} exams` : 'Loading subject...'"
                subtitle="Continue where you left off, review completed attempts, or start a fresh set."
                :search-placeholder="`Search in ${subject || 'this bank'}...`" @start="openModal" @resume="resumeExam" @review="reviewAttempt">
                <template #lead>
                    <button type="button" class="mb-3 inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:underline dark:text-slate-300" @click="router.back()">
                        <i class="pi pi-arrow-left text-[10px]"></i> {{ parentLabel }}
                    </button>
                </template>
                <template #actions>
                    <RouterLink to="/nursing/performance-analysis" class="dash-btn-ghost px-4 py-2"><i class="pi pi-chart-line text-[10px]"></i> Performance</RouterLink>
                    <RouterLink to="/nursing/previous-attempts" class="dash-btn-ghost px-4 py-2"><i class="pi pi-history text-[10px]"></i> History</RouterLink>
                </template>
            </ExamSetList>
        </div>

        <ExamModeModal ref="modeModal" product="nursing" :exam="selectedExam" :modes="['tutor', 'exam', 'review']"
            @select="(mode) => goToExam(mode, mode === 'review')" />
    </div>
</template>

<script setup lang="ts">
import ProductBreadcrumb from "../../../components/ProductBreadcrumb.vue"
import ExamSetList from "../../../components/Exam/ExamSetList.vue"
import type { ExamSetItem } from "../../../components/Exam/ExamSetList.vue"
import ExamModeModal from "../../../components/Exam/ExamModeModal.vue"
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import axios from 'axios'

const exams = ref<ExamSetItem[]>([])
const subject = ref('')
const parentsubtopic = ref('')
const attempts = ref<any[]>([])
const loading = ref(true)

const route = useRoute()
const router = useRouter()

const modeModal = ref<InstanceType<typeof ExamModeModal> | null>(null)
const selectedExam = ref<ExamSetItem | null>(null)

const subjectSlug = computed(() =>
    (route.params.examId || route.params.id || route.path.split('/').pop() || '') as string
)

const parentLabel = computed(() => {
    const value = parentsubtopic.value || 'Back'
    return value.endsWith('s') ? value.slice(0, -1) : value
})

const fetchExams = async (slug: string) => {
    if (!slug) return
    loading.value = true
    try {
        const response = await axios.get(`/nursing/exam-subtopics-per-subject/${slug}`)
        exams.value = response.data.data.subtopics || []
        subject.value = response.data.data.name || ''
        parentsubtopic.value = response.data.data.parentsubtopic?.description || ''
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
    const res = await axios.get('nursing/previous-attempts')
    attempts.value = res.data.data || []
})

const openModal = async (exam: ExamSetItem) => {
    selectedExam.value = exam
    await nextTick()
    modeModal.value?.open()
}

const goToExam = (mode: 'review' | 'tutor' | 'exam', examreview = false) => {
    if (selectedExam.value) {
        router.push({
            path: `/nursing/exam/${selectedExam.value.id}`,
            query: {
                mode,
                ...(examreview ? { examreview: 'true' } : {}),
            },
        })
        modeModal.value?.close()
    }
}

const resumeExam = (attemptId: number | null) => {
    if (!attemptId) return
    router.push(`/nursing/exam/${attemptId}?resume=true`)
}

const reviewAttempt = (attemptId: number | null) => {
    if (!attemptId) return
    router.push(`/nursing/exam/${attemptId}?mode=review`)
}
</script>

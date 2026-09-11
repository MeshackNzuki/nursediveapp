<template>
  <Tabs :tabs="['ATI_LPN_EXIT_EXAMS', 'HESI_LPN_EXIT_EXAMS']" product="nursing" :crumbs="[{ label: 'LPN Exit Exams' }]">
    <template #tab-ATI_LPN_EXIT_EXAMS>
      <ExamSetList :exams="atiExams" :attempts="attempts" :loading="loading" eyebrow="LPN exit exams"
        title="ATI LPN exit exams" subtitle="Exit-level ATI sets with resume, review, and retake."
        search-placeholder="Search ATI exams..." :columns="2" @start="openModal" @resume="resumeExam"
        @review="reviewAttempt">
        <template #actions>
          <RouterLink to="/nursing/performance-analysis" class="dash-btn-ghost px-4 py-2"><i
              class="pi pi-chart-line text-[10px]"></i> Performance</RouterLink>
        </template>
      </ExamSetList>
    </template>

    <template #tab-HESI_LPN_EXIT_EXAMS>
      <ExamSetList :exams="hesiExams" :attempts="attempts" :loading="loading" eyebrow="LPN exit exams"
        title="HESI LPN exit exams" subtitle="Exit-level HESI sets with resume, review, and retake."
        search-placeholder="Search HESI exams..." :columns="2" @start="openModal" @resume="resumeExam"
        @review="reviewAttempt">
        <template #actions>
          <RouterLink to="/nursing/performance-analysis" class="dash-btn-ghost px-4 py-2"><i
              class="pi pi-chart-line text-[10px]"></i> Performance</RouterLink>
        </template>
      </ExamSetList>
    </template>
  </Tabs>

  <ExamModeModal ref="modeModal" product="nursing" :exam="selectedExam" :modes="['tutor', 'exam', 'review']"
    @select="(mode) => goToExam(mode, mode === 'review')" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { useNursingExamStore } from '../../../stores/nursingExamStore'
import Tabs from '../../../components/Tabs.vue'
import ExamSetList from '../../../components/Exam/ExamSetList.vue'
import type { ExamSetItem } from '../../../components/Exam/ExamSetList.vue'
import ExamModeModal from '../../../components/Exam/ExamModeModal.vue'

const { ati_examTopics_pn_exit_exams, hesi_examTopics_pn_exit_exams } = storeToRefs(useNursingExamStore())

const router = useRouter()
const attempts = ref<any[]>([])
const loading = ref(true)
const modeModal = ref<InstanceType<typeof ExamModeModal> | null>(null)
const selectedExam = ref<ExamSetItem | null>(null)

const atiExams = computed<ExamSetItem[]>(() => (ati_examTopics_pn_exit_exams.value as ExamSetItem[] | null) ?? [])
const hesiExams = computed<ExamSetItem[]>(() => (hesi_examTopics_pn_exit_exams.value as ExamSetItem[] | null) ?? [])

const openModal = (exam: ExamSetItem) => {
  selectedExam.value = exam
  modeModal.value?.open()
}

const goToExam = (mode: 'tutor' | 'exam' | 'review', examreview = false) => {
  if (!selectedExam.value) return
  router.push({
    path: `/nursing/exam/${selectedExam.value.id}`,
    query: { mode, ...(examreview ? { examreview: 'true' } : {}) },
  })
  modeModal.value?.close()
}

const resumeExam = (attemptId: number | null) => {
  if (!attemptId) return
  router.push(`/nursing/exam/${attemptId}?resume=true`)
}

const reviewAttempt = (attemptId: number | null) => {
  if (!attemptId) return
  router.push(`/nursing/exam/${attemptId}?mode=review`)
}

onMounted(async () => {
  try {
    const res = await axios.get('nursing/previous-attempts')
    attempts.value = res.data.data || []
  } finally {
    loading.value = false
  }
})
</script>

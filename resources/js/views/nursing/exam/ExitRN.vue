<template>
  <Tabs :tabs="['ATI_RN_EXIT_EXAMS', 'HESI_RN_EXIT_EXAMS']">
    <template #tab-ATI_RN_EXIT_EXAMS>
      <section
        class="relative overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-cyan-50 p-5 mb-5 shadow-[0_20px_55px_-34px_rgba(14,116,144,0.55)] dark:border-sky-800 dark:from-slate-900 dark:via-sky-900 dark:to-cyan-950">
        <div
          class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_18%,rgba(56,189,248,0.22),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.14),transparent_42%)] dark:bg-[radial-gradient(circle_at_15%_18%,rgba(34,211,238,0.20),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(52,211,153,0.14),transparent_42%)]">
        </div>
        <div class="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">ATI RN Exit Exams</h2>
            <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">Exit-level ATI sets with resume, review, and retake flow.</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="rounded-2xl border border-sky-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:border-sky-700 dark:bg-slate-900/70 dark:text-sky-200">
                {{ filteredAti.length }} exams
              </span>
              <span class="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
                {{ tabCompletedCount(filteredAti) }} completed
              </span>
              <span class="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200">
                Avg score: {{ tabAverageScore(filteredAti) }}%
              </span>
            </div>
          </div>

          <input v-model="atiSearch" type="search" placeholder="Search ATI exams..."
            class="h-10 px-4 w-full sm:w-72 border border-cyan-300 rounded-full bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-slate-900/80 dark:border-cyan-700" />
        </div>
      </section>

      <div v-if="filteredAti.length === 0" class="text-center text-slate-400 dark:text-slate-500">
        No exams available.
      </div>

      <transition-group v-else name="fade" tag="div" class="grid grid-cols-1 sm:grid-cols-2 gap-4" appear>
        <article v-for="(exam, index) in filteredAti" :key="exam.id"
          class="group relative overflow-hidden rounded-3xl border border-white/75 bg-white/90 p-5 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-32px_rgba(14,116,144,0.65)] dark:border-sky-800/70 dark:bg-slate-900/70 dark:hover:shadow-[0_26px_60px_-35px_rgba(6,182,212,0.75)]">
          <div :class="['absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100', accentGlowClass(index)]"></div>
          <div class="relative flex h-full flex-col">
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">{{ normalizeText(exam.name) }}</h3>
              <span
                class="inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-xs font-semibold text-white">
                {{ exam?.questions_count }}
              </span>
            </div>

            <div class="mt-4">
              <div v-if="examScore(exam)" :class="['rounded-2xl px-3 py-2', gradeColor(examScore(exam))]">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-300/70 rounded-full h-1.5 overflow-hidden">
                    <div class="h-1.5" :style="dynamicProgressStyle(examScore(exam))"></div>
                  </div>
                  <span class="text-xs font-semibold">{{ examScore(exam) }}%</span>
                </div>
                <p class="mt-1 text-xs font-semibold">{{ gradeComment(examScore(exam)) }}</p>
              </div>
              <div v-else
                class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                No attempt yet. Start this set to generate your first score.
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-2">
              <template v-if="completed(exam)">
                <Small button-text="Review"
                  classes="border border-blue-500 bg-white text-slate-900 hover:bg-blue-500 hover:text-white shadow-none"
                  :action="() => goToReview(exam)" />
              </template>
              <template v-if="!completed(exam) && examScore(exam)">
                <Small button-text="Resume"
                  classes="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:bg-orange-500 shadow-none"
                  :action="() => resumeExam(getAttemptId(exam))" />
              </template>
              <Small :button-text="examScore(exam) ? 'Retake' : 'Take Exam'"
                :icon="examScore(exam) ? 'pi pi-refresh' : ''"
                :classes="examScore(exam)
                  ? 'border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:bg-orange-500 shadow-none'
                  : 'border border-cyan-500 bg-white text-slate-900 hover:bg-cyan-500 hover:text-white shadow-none'"
                :action="() => openModal(exam)" />
            </div>
          </div>
        </article>
      </transition-group>
    </template>

    <template #tab-HESI_RN_EXIT_EXAMS>
      <section
        class="relative overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-cyan-50 p-5 mb-5 shadow-[0_20px_55px_-34px_rgba(14,116,144,0.55)] dark:border-sky-800 dark:from-slate-900 dark:via-sky-900 dark:to-cyan-950">
        <div
          class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_18%,rgba(56,189,248,0.22),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.14),transparent_42%)] dark:bg-[radial-gradient(circle_at_15%_18%,rgba(34,211,238,0.20),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(52,211,153,0.14),transparent_42%)]">
        </div>
        <div class="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">HESI RN Exit Exams</h2>
            <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">Exit-level HESI sets with resume, review, and retake flow.</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="rounded-2xl border border-sky-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:border-sky-700 dark:bg-slate-900/70 dark:text-sky-200">
                {{ filteredHesi.length }} exams
              </span>
              <span class="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
                {{ tabCompletedCount(filteredHesi) }} completed
              </span>
              <span class="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200">
                Avg score: {{ tabAverageScore(filteredHesi) }}%
              </span>
            </div>
          </div>

          <input v-model="hesiSearch" type="search" placeholder="Search HESI exams..."
            class="h-10 px-4 w-full sm:w-72 border border-cyan-300 rounded-full bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-slate-900/80 dark:border-cyan-700" />
        </div>
      </section>

      <div v-if="filteredHesi.length === 0" class="text-center text-slate-400 dark:text-slate-500">
        No exams available.
      </div>

      <transition-group v-else name="fade" tag="div" class="grid grid-cols-1 sm:grid-cols-2 gap-4" appear>
        <article v-for="(exam, index) in filteredHesi" :key="exam.id"
          class="group relative overflow-hidden rounded-3xl border border-white/75 bg-white/90 p-5 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-32px_rgba(14,116,144,0.65)] dark:border-sky-800/70 dark:bg-slate-900/70 dark:hover:shadow-[0_26px_60px_-35px_rgba(6,182,212,0.75)]">
          <div :class="['absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100', accentGlowClass(index)]"></div>
          <div class="relative flex h-full flex-col">
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">{{ normalizeText(exam.name) }}</h3>
              <span
                class="inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-xs font-semibold text-white">
                {{ exam?.questions_count }}
              </span>
            </div>

            <div class="mt-4">
              <div v-if="examScore(exam)" :class="['rounded-2xl px-3 py-2', gradeColor(examScore(exam))]">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-300/70 rounded-full h-1.5 overflow-hidden">
                    <div class="h-1.5" :style="dynamicProgressStyle(examScore(exam))"></div>
                  </div>
                  <span class="text-xs font-semibold">{{ examScore(exam) }}%</span>
                </div>
                <p class="mt-1 text-xs font-semibold">{{ gradeComment(examScore(exam)) }}</p>
              </div>
              <div v-else
                class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                No attempt yet. Start this set to generate your first score.
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-2">
              <template v-if="completed(exam)">
                <Small button-text="Review"
                  classes="border border-blue-500 bg-white text-slate-900 hover:bg-blue-500 hover:text-white shadow-none"
                  :action="() => goToReview(exam)" />
              </template>
              <template v-if="!completed(exam) && examScore(exam)">
                <Small button-text="Resume"
                  classes="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:bg-orange-500 shadow-none"
                  :action="() => resumeExam(getAttemptId(exam))" />
              </template>
              <Small :button-text="examScore(exam) ? 'Retake' : 'Take Exam'"
                :icon="examScore(exam) ? 'pi pi-refresh' : ''"
                :classes="examScore(exam)
                  ? 'border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:bg-orange-500 shadow-none'
                  : 'border border-cyan-500 bg-white text-slate-900 hover:bg-cyan-500 hover:text-white shadow-none'"
                :action="() => openModal(exam)" />
            </div>
          </div>
        </article>
      </transition-group>
    </template>
  </Tabs>

  <dialog ref="modalRef" id="examModal" class="modal">
    <div class="modal-box bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button>
      </form>

      <h3 class="text-lg font-semibold mb-2">
        Start <span class="italic font-bold">{{ selectedExam?.name }}</span> in:
      </h3>
      <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Choose tutor mode for guided explanations or exam mode for timed simulation.
      </p>

      <div class="flex justify-end gap-3">
        <CommonButton button-text="Tutor Mode" classes="bg-teal-500 text-white" :action="() => goToExam('tutor')" />
        <CommonButton button-text="Exam Mode" classes="bg-gradient-to-r from-sky-600 to-cyan-500 text-white"
          :action="() => goToExam('exam')" />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNursingExamStore } from '../../../stores/nursingExamStore'
import CommonButton from '../../../components/Buttons/CommonButton.vue'
import Tabs from '../../../components/Tabs.vue'
import Small from '../../../components/Buttons/Small.vue'
import { normalizeText } from '../../../utils/normalizeText'
import axios from 'axios'
import { dynamicProgressStyle, gradeColor, gradeComment } from '../../../utils/grader'

const { ati_examTopics_rn_exit_exams, hesi_examTopics_rn_exit_exams } = useNursingExamStore() as any

const router = useRouter()
const attempts = ref<any[]>([])
const modalRef = ref<HTMLDialogElement | null>(null)
const selectedExam = ref<{ id: number; name: string } | null>(null)

const atiSearch = ref('')
const hesiSearch = ref('')

const filteredAti = computed(() =>
  ati_examTopics_rn_exit_exams?.filter((e: any) =>
    normalizeText(e.name).toLowerCase().includes(atiSearch.value.toLowerCase())
  ) ?? []
)

const filteredHesi = computed(() =>
  hesi_examTopics_rn_exit_exams?.filter((e: any) =>
    normalizeText(e.name).toLowerCase().includes(hesiSearch.value.toLowerCase())
  ) ?? []
)

const accentGlowClass = (index: number) => {
  const glows = [
    'bg-gradient-to-br from-sky-200/40 via-transparent to-transparent dark:from-sky-500/20',
    'bg-gradient-to-br from-emerald-200/35 via-transparent to-transparent dark:from-emerald-500/20',
    'bg-gradient-to-br from-indigo-200/35 via-transparent to-transparent dark:from-indigo-500/20',
  ]

  return glows[index % glows.length]
}

function openModal(exam: { id: number; name: string }) {
  selectedExam.value = exam
  modalRef.value?.showModal()
}

function goToExam(mode: 'tutor' | 'exam' | 'review') {
  if (selectedExam.value) {
    router.push(`/nursing/exam/${selectedExam.value.id}?mode=${mode}`)
    modalRef.value?.close()
  }
}

const resumeExam = (examId: number | null) => {
  if (!examId) return
  router.push(`/nursing/exam/${examId}?resume=true`)
}

const completed = (exam: { id: number }) => {
  const attempt = attempts.value.find(a => a.sub_topic_id === exam.id)
  return attempt?.completed ?? false
}

const getAttemptId = (exam: { id: number }) => {
  const attempt = attempts.value.find(a => a.sub_topic_id === exam.id)
  return attempt?.id ?? null
}

const goToReview = (exam: { id: number }) => {
  const attemptId = getAttemptId(exam)
  if (!attemptId) return
  router.push(`/nursing/exam/${attemptId}?mode=review`)
}

const examScore = (exam: { id: number }) => {
  const attempt = attempts.value.find(a => a.sub_topic_id === exam.id)
  return attempt ? Math.round(attempt.score) : 0
}

const tabCompletedCount = (list: any[]) => list.filter((exam) => completed(exam)).length

const tabAverageScore = (list: any[]) => {
  const scores = list.map((exam) => examScore(exam)).filter((score) => score > 0)
  if (!scores.length) return 0
  const total = scores.reduce((sum, score) => sum + score, 0)
  return Math.round(total / scores.length)
}

onMounted(async () => {
  const res = await axios.get('nursing/previous-attempts')
  attempts.value = res.data.data || []
})
</script>

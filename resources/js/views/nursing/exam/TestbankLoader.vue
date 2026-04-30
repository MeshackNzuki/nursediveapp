<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-slate-50 dark:bg-sky-950 text-slate-800 dark:text-slate-100">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-200 opacity-30 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-32 right-10 h-[420px] w-[420px] bg-gradient-to-r from-indigo-200 via-sky-300 to-emerald-200 opacity-30 blur-[100px] rounded-full">
            </div>
        </div>

        <div class="max-w-screen-2xl mx-auto">
            <section
                class="relative overflow-hidden rounded-[30px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-cyan-50 p-5 lg:p-7 shadow-[0_24px_72px_-36px_rgba(14,116,144,0.55)] dark:border-sky-800 dark:from-slate-900 dark:via-sky-900 dark:to-cyan-950 dark:shadow-[0_24px_72px_-36px_rgba(2,132,199,0.65)]">
                <div
                    class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_18%,rgba(56,189,248,0.22),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.16),transparent_42%)] dark:bg-[radial-gradient(circle_at_15%_18%,rgba(34,211,238,0.22),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(52,211,153,0.14),transparent_42%)]">
                </div>

                <div class="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                    <div>
                        <button
                            class="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
                            @click="router.back()">
                            <i class="pi pi-arrow-left"></i>
                            {{ parentLabel }}
                        </button>
                        <h2 class="mt-3 text-2xl lg:text-2xl font-black text-slate-900 dark:text-white">
                            {{ subject || 'Loading subject...' }} Exams
                        </h2>
                        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Continue from where you left off, review completed attempts, or start fresh sets.
                        </p>
                        <div class="mt-4 flex flex-wrap gap-2">
                            <span
                                class="rounded-2xl border border-sky-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:border-sky-700 dark:bg-slate-900/70 dark:text-sky-200">
                                {{ exams.length }} exam sets
                            </span>
                            <span
                                class="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
                                {{ completedCount }} completed
                            </span>
                            <span
                                class="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200">
                                Avg score: {{ averageScore }}%
                            </span>
                        </div>
                    </div>

                    <input v-model="searchTerm" type="search"
                        :placeholder="`Search in ${subject || '[Please wait]'}...`"
                        class="h-10 px-4 w-full lg:w-80 border border-cyan-300 rounded-full bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-slate-900/80 dark:border-cyan-700" />
                </div>
            </section>

            <div class="mt-7">
                <div v-if="!exams.length && searchTerm === ''"
                    class="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500 shadow-sm dark:border-sky-800 dark:bg-slate-900/70 dark:text-slate-300">
                    Loading exams...
                </div>
                <div v-else-if="filteredExams.length === 0"
                    class="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500 shadow-sm dark:border-sky-800 dark:bg-slate-900/70 dark:text-slate-300">
                    No exams found for that search.
                </div>

                <transition-group v-else name="fade" tag="div"
                    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" appear>
                    <article v-for="(exam, index) in filteredExams" :key="exam.id"
                        class="group relative overflow-hidden rounded-3xl border border-white/75 bg-white/90 p-5 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-32px_rgba(14,116,144,0.65)] dark:border-sky-800/70 dark:bg-slate-900/70 dark:hover:shadow-[0_26px_60px_-35px_rgba(6,182,212,0.75)]">
                        <div
                            :class="['absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100', accentGlowClass(index)]">
                        </div>
                        <div class="relative flex h-full flex-col">
                            <div class="flex items-start justify-between gap-3">
                                <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {{ normalizeText(exam.name) }}
                                </h3>
                                <span
                                    class="inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-xs font-semibold text-white">
                                    {{ exam.questions_count }}
                                </span>
                            </div>

                            <div class="mt-4">
                                <div v-if="examScore(exam)"
                                    :class="['rounded-2xl px-3 py-2', gradeColor(examScore(exam))]">
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
                                        :action="() => router.push(`/nursing/exam/${getAttemptId(exam)}?mode=review`)" />
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
            </div>
        </div>

        <dialog ref="modalRef" id="examModal" class="modal">
            <div class="modal-box bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button>
                </form>
                <h3 class="text-lg font-semibold mb-2">Start {{ selectedExam?.name }} in:</h3>
                <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Choose tutor mode for guided explanations or exam mode for timed simulation.
                </p>
                <div class="flex justify-end gap-3">
                    <CommonButton button-text="Tutor Mode" classes="bg-teal-500 text-white"
                        :action="() => goToExam('tutor')" />
                    <CommonButton button-text="Exam Mode" classes="bg-gradient-to-r from-sky-600 to-cyan-500 text-white"
                        :action="() => goToExam('exam')" />
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import axios from 'axios'
import CommonButton from '../../../components/Buttons/CommonButton.vue'
import Small from '../../../components/Buttons/Small.vue'
import { normalizeText } from '../../../utils/normalizeText'
import { dynamicProgressStyle, gradeColor, gradeComment } from '../../../utils/grader'

const exams = ref<{ id: number; name: string; description?: string; questions_count: number }[]>([])
const searchTerm = ref('')
const subject = ref('')
const parentsubtopic = ref('')
const attempts = ref<any[]>([])

const route = useRoute()
const router = useRouter()

const modalRef = ref<HTMLDialogElement | null>(null)
const selectedExam = ref<{ id: number; name: string } | null>(null)

const subjectSlug = computed(() =>
    (route.params.examId || route.params.id || route.path.split('/').pop() || '') as string
)

const parentLabel = computed(() => {
    const value = parentsubtopic.value || 'Back'
    return value.endsWith('s') ? value.slice(0, -1) : value
})

const accentGlowClass = (index: number) => {
    const glows = [
        'bg-gradient-to-br from-sky-200/40 via-transparent to-transparent dark:from-sky-500/20',
        'bg-gradient-to-br from-emerald-200/35 via-transparent to-transparent dark:from-emerald-500/20',
        'bg-gradient-to-br from-indigo-200/35 via-transparent to-transparent dark:from-indigo-500/20',
    ]

    return glows[index % glows.length]
}

const fetchExams = async (slug: string) => {
    if (!slug) return
    try {
        const response = await axios.get(`/nursing/exam-subtopics-per-subject/${slug}`)
        exams.value = response.data.data.subtopics || []
        subject.value = response.data.data.name || ''
        parentsubtopic.value = response.data.data.parentsubtopic.description || ''
    } catch (error) {
        console.error('Error fetching exams:', error)
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

const filteredExams = computed(() => {
    if (!searchTerm.value.trim()) return exams.value
    return exams.value.filter((exam) => exam.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
})

const examScore = (exam: { id: number }) => {
    const attempt = attempts.value?.find(a => a.sub_topic_id == exam.id)
    if (!attempt) return 0
    return Math.round(attempt.score)
}

const completed = (exam: { id: number }) => {
    const attempt = attempts.value?.find(a => a.sub_topic_id == exam.id)
    if (!attempt) return false
    return Boolean(attempt.completed)
}

const getAttemptId = (exam: { id: number }) => {
    const attempt = attempts.value?.find(a => a.sub_topic_id == exam.id)
    if (!attempt) return null
    return attempt.id
}

const completedCount = computed(() => exams.value.filter((exam) => completed(exam)).length)

const averageScore = computed(() => {
    const scores = exams.value.map((exam) => examScore(exam)).filter((score) => score > 0)
    if (!scores.length) return 0
    const total = scores.reduce((sum, score) => sum + score, 0)
    return Math.round(total / scores.length)
})

const openModal = async (exam: { id: number; name: string }) => {
    selectedExam.value = exam
    await nextTick()
    modalRef.value?.showModal()
}

const goToExam = (mode: 'review' | 'tutor' | 'exam') => {
    if (selectedExam.value) {
        router.push(`/nursing/exam/${selectedExam.value.id}?mode=${mode}`)
        modalRef.value?.close()
    }
}

const resumeExam = (examId: number | null) => {
    if (!examId) return
    router.push(`/nursing/exam/${examId}?resume=true`)
}
</script>

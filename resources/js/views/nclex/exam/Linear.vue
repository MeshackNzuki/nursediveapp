<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-slate-50 dark:bg-sky-950 text-slate-800 dark:text-slate-100">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-200 opacity-30 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-32 right-10 h-[420px] w-[420px] bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-200 opacity-30 blur-[100px] rounded-full">
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
                        <p
                            class="inline-flex items-center rounded-full border border-sky-200 bg-white/85 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-700 dark:bg-slate-900/70 dark:text-sky-300">
                            NCLEX Linear
                        </p>
                        <h2 class="mt-3 text-2xl lg:text-4xl font-black text-slate-900 dark:text-white">
                            Linear Assessment Tests
                        </h2>
                        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Fixed-length assessments with steady difficulty to build rhythm, speed, and confidence.
                        </p>
                        <div class="mt-4 flex flex-wrap gap-2">
                            <span
                                class="rounded-2xl border border-sky-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:border-sky-700 dark:bg-slate-900/70 dark:text-sky-200">
                                {{ exams.length }} exam sets
                            </span>
                            <span
                                class="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
                                {{ attemptedCount }} attempted
                            </span>
                            <span
                                class="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200">
                                Avg score: {{ averageScore }}%
                            </span>
                        </div>
                    </div>

                    <input v-model="searchTerm" type="search" :placeholder="`Search in ${subject || 'Linear assessments'}...`"
                        class="h-10 px-4 w-full lg:w-80 border border-cyan-300 rounded-full bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-slate-900/80 dark:border-cyan-700" />
                </div>
            </section>

            <div class="mt-7">
                <div v-if="filteredExams.length === 0 && searchTerm === ''"
                    class="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500 shadow-sm dark:border-sky-800 dark:bg-slate-900/70 dark:text-slate-300">
                    Loading exams...
                </div>
                <div v-else-if="filteredExams.length === 0"
                    class="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500 shadow-sm dark:border-sky-800 dark:bg-slate-900/70 dark:text-slate-300">
                    No exams found for that search.
                </div>

                <transition-group v-else name="fade" tag="div" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" appear>
                    <article v-for="(exam, index) in filteredExams" :key="exam.id"
                        :class="[
                            'group relative overflow-hidden rounded-3xl border border-white/75 bg-white/90 p-5 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm transition-all duration-300 dark:border-sky-800/70 dark:bg-slate-900/70',
                            isExamLocked(exam)
                                ? 'opacity-85'
                                : 'hover:-translate-y-1 hover:shadow-[0_26px_60px_-32px_rgba(14,116,144,0.65)] dark:hover:shadow-[0_26px_60px_-35px_rgba(6,182,212,0.75)]'
                        ]">
                        <div :class="['absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100', accentGlowClass(index)]"></div>
                        <div class="relative flex h-full flex-col">
                            <div class="flex items-start justify-between gap-3">
                                <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {{ normalizeText(exam.name) }}
                                </h3>
                                <div class="flex items-center gap-2">
                                    <span
                                        class="inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-xs font-semibold text-white">
                                        {{ examQuestionCount(exam) }}
                                    </span>
                                    <span v-if="isExamLocked(exam)"
                                        class="inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white"
                                        title="Locked exam">
                                        <i class="pi pi-lock"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="mt-4">
                                <div v-if="examScore(exam)" class="rounded-2xl px-3 py-2 bg-slate-100 dark:bg-slate-800">
                                    <div class="flex items-center gap-2">
                                        <div class="flex-1 bg-gray-300/70 rounded-full h-1.5 overflow-hidden">
                                            <div class="h-1.5" :style="dynamicProgressStyle(examScore(exam))"></div>
                                        </div>
                                        <span class="text-xs font-semibold">{{ examScore(exam) }}%</span>
                                    </div>
                                    <p class="mt-1 text-xs font-semibold" :class="gradeColor(examScore(exam))">
                                        {{ gradeComment(examScore(exam)) }}
                                    </p>
                                </div>
                                <div v-else
                                    class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    No attempt yet. Start this set to generate your first score.
                                </div>
                            </div>

                            <div class="mt-4 flex items-center justify-between gap-2">
                                <Small :button-text="isExamLocked(exam) ? 'Locked' : examScore(exam) ? 'Retake Exam' : 'Take Exam'"
                                    :icon="isExamLocked(exam) ? 'pi pi-lock' : examScore(exam) ? 'pi pi-refresh' : ''"
                                    :classes="isExamLocked(exam)
                                        ? 'border-0 bg-rose-500 text-white hover:bg-rose-500 cursor-not-allowed shadow-none'
                                        : examScore(exam)
                                            ? 'border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:bg-orange-500 shadow-none'
                                            : 'border border-cyan-500 bg-white text-slate-900 hover:bg-cyan-500 hover:text-white shadow-none'"
                                    :action="() => openModal(exam)" />
                                <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                    {{ isExamLocked(exam) ? 'Locked set' : examScore(exam) ? 'Attempted' : 'New set' }}
                                </span>
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
                    Choose tutor mode for guided rationales or exam mode for timed simulation.
                </p>
                <p v-if="selectedExam && isExamLocked(selectedExam)"
                    class="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                    This exam is locked.
                </p>
                <div class="flex justify-end gap-3">
                    <CommonButton button-text="Tutor Mode" classes="bg-teal-500 text-white"
                        :action="() => goToExam('tutor')" :disabled="!!(selectedExam && isExamLocked(selectedExam))" />
                    <CommonButton button-text="Exam Mode" classes="bg-gradient-to-r from-sky-600 to-cyan-500 text-white"
                        :action="() => goToExam('exam')" :disabled="!!(selectedExam && isExamLocked(selectedExam))" />
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Small from '../../../components/Buttons/Small.vue'
import { normalizeText } from '../../../utils/normalizeText'
import { dynamicProgressStyle, gradeColor, gradeComment } from '../../../utils/grader'
import CommonButton from '../../../components/Buttons/CommonButton.vue'
import { useAuthStore } from '../../../stores/authStore'

const exams = ref<{ id: number; name: string; description?: string; question_count?: number; questions_count?: number; trial_mode?: number | boolean }[]>([])
const searchTerm = ref('')
const subject = ref('Linear assessments')
const modalRef = ref<HTMLDialogElement | null>(null)
const router = useRouter()
const authStore = useAuthStore()
const attempts = ref<any[]>([])
const selectedExam = ref<{ id: number; name: string; trial_mode?: number | boolean } | null>(null)
const hasPremiumAccess = computed(() => authStore.isActive('nclex'))

const accentGlowClass = (index: number) => {
    const glows = [
        'bg-gradient-to-br from-sky-200/40 via-transparent to-transparent dark:from-sky-500/20',
        'bg-gradient-to-br from-emerald-200/35 via-transparent to-transparent dark:from-emerald-500/20',
        'bg-gradient-to-br from-indigo-200/35 via-transparent to-transparent dark:from-indigo-500/20',
    ]

    return glows[index % glows.length]
}

onMounted(async () => {
    try {
        const response = await axios.get('/nclex/mock')
        exams.value = response.data.data.subtopics || []
        subject.value = response.data.data.name || 'Linear assessments'
    } catch (error) {
        console.error('Error fetching exams:', error)
    }

    const res = await axios.get('/nclex/previous-attempts')
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

const examQuestionCount = (exam: { question_count?: number; questions_count?: number }) => {
    return Number(exam.question_count ?? exam.questions_count ?? 85)
}

const attemptedCount = computed(() => exams.value.filter((exam) => examScore(exam) > 0).length)

const averageScore = computed(() => {
    const scores = exams.value.map((exam) => examScore(exam)).filter((score) => score > 0)
    if (!scores.length) return 0
    const total = scores.reduce((sum, score) => sum + score, 0)
    return Math.round(total / scores.length)
})

function isExamLocked(exam: { trial_mode?: number | boolean }) {
    if (hasPremiumAccess.value) return false
    return Number(exam?.trial_mode ?? 0) !== 1
}

function openModal(exam: { id: number; name: string; trial_mode?: number | boolean }) {
    if (isExamLocked(exam)) return
    selectedExam.value = exam
    modalRef.value?.showModal()
}

function goToExam(mode: 'tutor' | 'exam') {
    if (selectedExam.value && !isExamLocked(selectedExam.value)) {
        router.push(`/nclex/exam/${selectedExam.value.id}?mode=${mode}`)
        modalRef.value?.close()
    }
}
</script>

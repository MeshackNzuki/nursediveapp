<template>
    <div class="h-[100dvh] overflow-y-scroll bg-white dark:bg-sky-950 dark:text-slate-300 font-roboto">
        <!-- Topbar -->
        <div class="flex flex-col fixed top-0 left-0 right-0 mb-4 text-white z-50 select-none">
            <!-- Main Header -->
            <div class="p-2 2xl:p-3 bg-sky-700 flex items-center justify-between">
                <div v-if="catStore.questions.length > 0" class="hidden md:flex items-center gap-2 font-semibold">
                    <i class="pi pi-book text-white"></i>
                    <span>{{ catStore.exam?.title }}</span>
                    <span class="font-normal">| Adaptive Mode</span>
                </div>
                <span v-if="catStore.questions.length > 0" class="flex flex-row gap-1">
                    <span class="lg:hidden">Q</span>
                    <span class="hidden lg:block font-bold">Question</span>
                    {{ catStore.questionsAsked + 1 }}
                    <span class="hidden lg:block">of</span>
                    <span class="lg:hidden">/</span>
                    {{ catStore.maxQuestions }}
                </span>

                <!-- Right side: Controls -->
                <div class="flex items-center gap-4">
                    <ExamFeedbackModal source-product="cat" :exam-mode="catStore.testMode"
                        :question-id="catStore.currentQuestion?.id" :exam-id="catStore.exam?.id" />
                    <Calculator />
                    <!-- Timer Display -->
                    <div class="flex items-center gap-1">
                        <i class="pi pi-clock"></i>
                        <span class="text-sm">{{ catStore.timerDisplay || '00:00' }}</span>
                    </div>
                    <!-- Zoom Controls -->
                    <span class="font-bold border rounded-full hidden lg:flex flex-row gap-3 px-1 cursor-pointer">
                        <svg @click="zoomOut" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke="currentColor" class="size-6 hover:scale-105">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
                        </svg>
                        <svg @click="zoomIn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke="currentColor" class="size-6 hover:scale-105">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                        </svg>
                    </span>
                    <!-- Dark mode Toggle -->
                    <span class="cursor-pointer text-lg">
                        <i v-if='isDark' class="pi pi-sun text-lg" @click="toggleDark()"></i>
                        <i v-else class="pi pi-moon" @click="toggleDark()"></i>
                    </span>
                </div>
            </div>
            <!-- Adaptive Progress Bar -->
            <div class="p-1 h-8 w-full bg-blue-300 flex items-center gap-8 px-3 flex-wrap">
                <button @click="showModal('calculator_id')" class="inline-flex items-center gap-1 cursor-pointer">
                    <i class="pi pi-calculator"></i>
                    <span class="block">Calculator</span>
                </button>
                <button v-if="catStore.testMode != 'exam'" @click="catStore.showNotes = !catStore.showNotes"
                    class="inline-flex items-center gap-1">
                    <i class="pi pi-pencil"></i>
                    <span class="block">Notes</span>
                </button>
                <!-- Adaptive Indicators -->
                <div class="flex items-center gap-2 ml-auto">
                    <div class="flex items-center gap-1">
                        <i class="pi pi-sliders-v text-white"></i>
                        <span class="text-sm font-semibold">Difficulty: {{ Math.round(catStore.currentDifficulty)
                        }}/100</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Question area -->
        <div v-if="catStore.questions.length > 0"
            class="flex flex-col lg:flex-row relative justify-between mb-16 w-full">
            <div v-if="catStore.currentQuestion"
                :class="[`mt-32 p-2 mb-4 md:mb-24 w-full min-w-1/2`, store?.currentZoom]">
                <QuestionRenderer :examStore="catStore" :question="catStore.currentQuestion" v-model="currentAnswer"
                    :readonly="catStore.testMode === 'review'" :result="catStore.results[catStore.currentQuestion.id]">
                    <template #solution>
                        <!-- Solution Area -->
                        <div v-if="catStore.testMode != 'exam' && catStore.currentQuestion.tabs != null"
                            :class="[showSolution ? '' : '', 'flex mt-0 md:mt-12 mx-4 mb-2 flex-col gap-5 w-full border-l border-gray-400 border-dashed dark:border-gray-200 px-2', store?.currentZoom]">
                            <div class="flex items flex-col">
                                <h3 class="text-lg font-semibold mb-6 underline underline-offset-2 decoration-teal-500">
                                    Full Question Solution
                                    <button @click="catStore.showNotes = true"
                                        class="ml-auto text-sm text-teal-500 hover:underline">
                                        <i class="pi pi-pencil ms-1"></i>Notes
                                    </button>
                                </h3>
                                <span v-if="!showSolution" class="text-gray-500 mb-1">Answer the question to reveal
                                    solution.</span>
                                <div :class="[!showSolution ? 'blur-sm bg-gray-950/25' : '', store?.currentZoom]"
                                    v-html="catStore.currentQuestion?.solution">
                                </div>
                            </div>
                        </div>
                        <div v-if="['tutor', 'review'].includes(catStore.testMode)"
                            class="px-4 py-1 bg-sky-50 rounded-xl border border-gray-200">
                            <div class="flex items-center gap-1">
                                <span class="mb-2 font-semibold text-sky-500">
                                    <i class="pi pi-wave-pulse text-rose-500 me-2 mt-1"></i>Question Stats
                                </span>
                            </div>
                            <div
                                class="flex mb-2 flex-wrap items-start gap-4 lg:mb-12 text-sm text-gray-700 font-medium">
                                <div class="flex items-center gap-1">
                                    <i class="pi pi-gauge text-yellow-500"></i>
                                    <span>Difficulty: {{ difficulty }}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <i class="pi pi-clock text-teal-500"></i>
                                    <span>Time Taken: {{ localTimer }}s</span>
                                </div>
                                <div v-if="catStore.answers[catStore.currentQuestion.id]"
                                    class="flex items-center gap-1">
                                    <i class="pi pi-user-edit text-teal-500"></i>
                                    <span>Your Answer was {{ catStore.answers[catStore.currentQuestion.id] }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </QuestionRenderer>
            </div>

            <!-- Notes Section -->
            <div v-if="catStore.showNotes && catStore.testMode != 'exam'"
                class="flex mt-0 md:mt-24 mx-4 md:mb-16 flex-col gap-4 w-full md:max-w-1/2 border-l border-gray-400 border-dashed dark:border-gray-200 px-2">
                <div class="flex items">
                    <h3 class="text-lg font-semibold">Revision Notes</h3>
                    <button @click="catStore.showNotes = !catStore.showNotes"
                        class="ml-auto text-sm text-sky-500 hover:underline font-semibold">
                        <i class="pi pi-times"></i> Close
                    </button>
                </div>
                <ExamNotes v-model="notes" />
            </div>
        </div>

        <div v-else class="flex items-center justify-center h-screen">
            <span class="text-gray-500 text-lg select-none">{{ progress }}</span>
        </div>

        <!-- Bottom bar -->
        <div class="flex fixed bottom-0 left-0 right-0 justify-between bg-sky-700 text-white">
            <div class="flex justify-between items-center flex-row border-s border-e mx-2 px-3 h-full p-1 gap-2">
                <button class="px-4 py-2 cursor-pointer rounded flex justify-center items-center gap-1 font-semibold"
                    @click="exitExamConfirm">
                    <i class="pi pi-sign-out"></i>
                    <span class="">End</span>
                </button>

                <button class="px-4 py-2 cursor-pointer rounded flex justify-center items-center gap-1 font-semibold"
                    @click="pauseExam">
                    <i class="pi pi-pause"></i>
                    <span class="flex items-center gap-1 font-semibold">Pause</span>
                </button>
            </div>
            <div class="flex items-center justify-between flex-row border-s border-e mx-2 gap-2 h-full">
                <button v-if="!catStore.isFirstQuestion" @click="catStore.prev" :disabled="catStore.isFirstQuestion"
                    class="px-4 py-2 cursor-pointer rounded flex justify-center items-center gap-1 font-semibold">
                    <i class="pi pi-arrow-left"></i> Previous
                </button>

                <button v-if="catStore.testMode === 'review'" @click="catStore.next" :disabled="catStore.isLastQuestion"
                    class="px-4 py-2 cursor-pointer rounded flex justify-center items-center gap-1 font-semibold">
                    <span v-if="!catStore.isLastQuestion">Next</span>
                    <span v-else>Done</span>
                    <i class="pi pi-arrow-right"></i>
                </button>
                <button v-else @click="handleNextQuestion()"
                    class="px-4 py-2 cursor-pointer rounded flex justify-center items-center gap-1 font-semibold">
                    <span v-if="!catStore.shouldStopExam">Next</span>
                    <span v-else>{{ catStore.questionsAsked >= catStore.maxQuestions ? 'Complete' : 'Stop & Submit'
                    }}</span>
                    <i class="pi pi-arrow-right"></i>
                </button>
            </div>
        </div>

        <!-- Pause Overlay -->
        <div v-if="catStore.timer == null" class="absolute inset-0 z-50 bg-sky-950/35 flex items-center justify-center">
            <CommonButton icon2="pi pi-refresh"
                classes="ml-4 text-white bg-rose-500 hover:bg-teal-600 px-6 py-3 rounded-full shadow-lg transition-all"
                :action="() => catStore.startTimer()" button-text="Resume Exam" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, onBeforeUnmount, watch, provide } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useCatExamStore } from '../stores/catExamStore'
import QuestionRenderer from './QuestionRenderer.vue'
import Calculator from './Calculator.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useDark, useToggle } from "@vueuse/core"
import { useMainStore } from '../stores'
import ExamNotes from './ExamNotes.vue'
import CommonButton from './Buttons/CommonButton.vue'
import { useAuthStore } from '../stores/authStore'
import ExamFeedbackModal from './ExamFeedbackModal.vue'

const isDark = useDark({ disableTransition: false })
const toggleDark = useToggle(isDark)
const progress = ref('Preparing Test...')
const { zoomIn, zoomOut } = useMainStore()
const store = useMainStore()
const router = useRouter()
const catStore = useCatExamStore() as any
const confirm = useConfirm()
const notes = ref('')
const difficulty = ref('')

const currentAnswer = computed({
    get: () => {
        const id = catStore.currentQuestion?.id
        return id ? catStore.answers[id] || '' : ''
    },

    set: (val) => {
        const id = catStore.currentQuestion?.id
        if (id && (catStore.testMode !== 'review' || catStore.testMode !== 'tutor')) {
            catStore.answerQuestion(id, val)
        }
        if (notes.value?.trim()) {
            catStore.answerQuestionNotes(id, notes.value)
        }
    }
})

const showSolution = computed(() => {
    const mode = catStore.testMode
    const current = catStore.currentQuestion
    const manualRevealTypes = ['MMA', 'MMN', 'MTX', 'MMC', 'DRDCLOZE', 'BOW', 'DRD', 'DDC']

    if (mode === 'review') return true
    return (
        ['tutor', 'review'].includes(mode) &&
        current &&
        !!catStore.answers[current.id] &&
        !manualRevealTypes.includes(current.question_type?.code)
    )
})

const localTimer = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

function startTimer() {
    clearTimer()
    localTimer.value = 0
    interval = setInterval(() => {
        localTimer.value++
    }, 1000)
}

function clearTimer() {
    if (interval) {
        clearInterval(interval)
        interval = null
    }
}

async function loadExam() {
    try {
        const { data } = await axios.get('/nclex/adaptive-exam', { showLoader: false })
        const examData = data.data

        // Normalize grouped questions into a flat question pool array
        let questionPool = []

        if (Array.isArray(examData.questions)) {
            // old API format may return array directly
            questionPool = examData.questions
        } else if (examData.questions && typeof examData.questions === 'object') {
            questionPool = Object.values(examData.questions).flatMap((item) => {
                const group = item as any
                return Array.isArray(group.questions) ? group.questions : []
            })
        }

        if (!Array.isArray(questionPool)) {
            throw new Error('Invalid question payload from adaptive-exam: expected array')
        }

        catStore.setExamData({
            exam: {
                id: examData.id,
                title: examData.name,
                description: examData.description
            },
            questions: questionPool
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
            const message = error.response?.data?.error || 'You have reached the CAT monthly limit.'
            window.alert(message)
            router.push('/nclex/cat')
            return
        }

        console.error('Error loading CAT exam:', error)
        progress.value = 'Unable to load CAT exam.'
    }
}

watch(() => catStore.currentQuestion, () => {
    startTimer()
    difficulty.value = ['Easy', 'Medium', 'Difficult'][Math.floor(Math.random() * 3)]
})

// Solution reveal handler for question type components
const handleSolutionReveal = (payload: { flag: boolean; value: boolean }) => {
    // This is called by child question components when they need to signal solution reveal
    // The showSolution computed value will react to changes in catStore.answers
}

// Mark current answer and advance to next question
const handleNextQuestion = () => {
    const currentQuestion = catStore.currentQuestion
    if (currentQuestion) {
        const answer = currentAnswer.value
        if (answer !== undefined && answer !== '') {
            catStore.answerQuestion(currentQuestion.id, answer)
        }
    }

    if (catStore.shouldStopExam) {
        catStore.markAnswers()
        catStore.submitResults()
    } else {
        catStore.next()
    }
}

provide('showSolution', handleSolutionReveal)


onMounted(() => {
    catStore.reset()
    catStore.resetTimer()
    loadExam()
    catStore.startTimer()
    startTimer()
    setTimeout(() => {
        progress.value = 'Test Ready...'
    }, 1000)
})

onBeforeUnmount(() => {
    catStore.reset()
    catStore.resetTimer()
    clearTimer()
})

function exitExamConfirm() {
    confirm.require({
        message: 'Exit the exam and resume later?',
        header: 'Confirm exit exam!',
        icon: 'pi pi-exclamation-triangle text-rose-500',
        acceptLabel: 'Suspend',
        rejectLabel: 'Continue',
        acceptClass: "bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-full",
        rejectClass: "bg-teal-500 hover:bg-gray-400 bg-teal-500 text-white font-bold py-2 px-4 rounded-full",
        accept: () => {
            catStore.exitExam()
        },
        reject: () => {
            //
        }
    })
}

function pauseExam() {
    confirm.require({
        message: 'Are you sure you want to pause the exam? You can resume later.',
        header: 'Pause Exam Confirmation',
        icon: 'pi pi-pause-circle text-yellow-500 text-xl',
        acceptLabel: 'Pause and Exit',
        rejectLabel: 'Just Pause',
        acceptClass: "bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-full",
        rejectClass: "bg-teal-500 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-full",
        accept: () => {
            catStore.pauseTimer()
            catStore.exitExam()
        },
        reject: () => {
            catStore.pauseTimer()
        }
    })
}

const showModal = async (modalId: any) => {
    const modal: any = document.getElementById(modalId)
    if (modal) {
        modal.showModal()
    }
}
</script>

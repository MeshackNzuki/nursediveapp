<template>
    <div class="h-[100dvh] overflow-y-scroll bg-white dark:bg-sky-950 dark:text-slate-300 font-roboto">
        <!-- Topbar -->
        <div class="  flex flex-col  fixed top-0 left-0 right-0  mb-4 text-white z-50 select-none">
            <!-- Left side: Exam title -->
            <div class="p-2 2xl:p-3 bg-sky-700  flex items-center justify-between ">
                <div v-if="examStore.questions.length > 0" class="hidden md:flex items-center gap-2 font-semibold ">
                    <i class="pi pi-book text-white"></i>
                    <span class="">{{ examStore.exam?.title }}</span>
                    <span class="font-normal">| Test Mode: {{ examStore.testMode.toLocaleUpperCase() }}</span>
                </div><span v-if="examStore.questions.length > 0" class="flex flex-row gap-1"><span
                        class="lg:hidden">Q</span> <span class="hidden lg:block font-bold">Question</span> {{
                            Number(examStore.currentIndex) + 1 }} <span class="hidden lg:block">of</span> <span
                        class="lg:hidden">/</span>
                    {{ examStore.questions.length }}</span>
                <!-- Right side: Controls -->
                <div class="flex items-center gap-4"> <!-- Calculator Button -->
                    <ExamFeedbackModal source-product="nclex" :exam-mode="examStore.testMode"
                        :question-id="examStore.currentQuestion?.id" :exam-id="examStore.exam?.id" />
                    <Calculator />
                    <!-- Timer Display (placeholder or reactive) -->
                    <div class="flex items-center gap-1">
                        <i class="pi pi-clock"></i>
                        <span class="text-sm">{{ examStore.timerDisplay || '00:00' }}</span>
                    </div>
                    <span class="font-bold border rounded-full hidden lg:flex flex-row gap-3 px-1 cursor-pointer"><svg
                            @click="zoomOut" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
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
                    <!-- Exit Button -->
                    <span class="cursor-pointer text-lg">
                        <i v-if='isDark' class="pi pi-sun text-lg" @click="toggleDark()"></i>
                        <i v-else class="pi pi-moon" @click="toggleDark()"></i>
                    </span>
                </div>
            </div>
            <div class="p-1 h-8 w-full bg-blue-300 flex items-center  gap-12 px-3"> <button
                    @click="showModal('calculator_id')" class="inline-flex items-center gap-1 cursor-pointer">
                    <i class="pi pi-calculator"></i> <span class="block">Calculator</span>
                </button>
                <button v-if="examStore.testMode != 'exam'" @click="examStore.showNotes = !examStore.showNotes"
                    class="inline-flex items-center gap-1">
                    <i class="pi pi-pencil"></i> <span class="block">Notes</span>
                </button>
            </div>
        </div>
        <!-- Question area -->
        <div v-if="examStore.questions.length > 0"
            class="flex flex-col lg:flex-row  relative justify-between mb-16 w-full">
            <div v-if="examStore.currentQuestion"
                :class="[`mt-24 p-2 mb-4 md:mb-24 w-full min-w-1/2`, store?.currentZoom]">
                <div v-if="caseQuestionCounter > 0" class="font-bold flex flex-col gap-1 ">
                    <span v-if="caseQuestionCounter == 1"
                        class="p-2 bg-gray-100 dark:text-gray-700 font-normal text-sm rounded max-w-md">The
                        following scenario applies
                        to the
                        next 6
                        items.</span> <span> Item {{ caseQuestionCounter }}/{{ block_size }}</span>
                </div>
                <QuestionRenderer :examStore="examStore" :question="examStore.currentQuestion" v-model="currentAnswer"
                    :readonly="examStore.testMode === 'review'"
                    :result="examStore.results[examStore.currentQuestion.id]"><template #solution>
                        <!-- forward to grandchild for proper positioning -->
                        <div v-if="examStore.testMode != 'exam' && examStore.currentQuestion.tabs != null"
                            :class="[showSolution ? ''
                                : '', 'flex mt-0 md:mt-12 mx-4 mb-2 flex-col gap-5 w-full border-l border-gray-400 border-dashed dark:border-gray-200 px-2', store?.currentZoom]">
                            <div class="flex items flex-col ">
                                <h3 class="text-lg font-semibold mb-6 underline underline-offset-2 decoration-teal-500">
                                    Full
                                    Question
                                    Solution <button @click="examStore.showNotes = true"
                                        class="ml-auto text-sm text-teal-500 hover:underline">
                                        <i class="pi pi-pencil ms-1"></i>Notes
                                    </button></h3>
                                <span v-if="!showSolution" class="text-gray-500 mb-1">Answer the question to reveal
                                    solution.</span>
                                <div :class="[!showSolution ? 'blur-sm bg-gray-950/25' : '', store?.currentZoom]"
                                    v-html="examStore.currentQuestion?.solution">
                                </div>
                            </div>
                        </div>
                        <div v-if="['tutor', 'review'].includes(examStore.testMode)"
                            class="px-4 py-1 bg-sky-50 rounded-xl border border-gray-200">
                            <div class="flex items-center gap-1">
                                <span class="mb-2 font-semibold text-sky-500"> <i
                                        class="pi pi-wave-pulse text-rose-500 me-2 mt-1 "></i>Question
                                    Stats</span>
                            </div>
                            <div
                                class="flex mb-2 flex-wrap items-start gap-4 lg:mb-12 text-sm text-gray-700 font-medium">
                                <div class="flex items-center gap-1">
                                    <i class="pi pi-pi-gauge text-yellow-500"></i>
                                    <span>Difficulty: {{ difficulty }}</span>
                                </div>

                                <div class="flex items-center gap-1">
                                    <i class="pi pi-clock text-teal-500"></i>
                                    <span>Time Taken: {{ localTimer }}s</span>
                                </div>

                                <div v-if="examStore.answers[examStore.currentQuestion.id]"
                                    class="flex items-center gap-1">
                                    <i class="pi pi-user-edit text-teal-500"></i>
                                    <span>Your Answer was {{ examStore.answers[examStore.currentQuestion.id]
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </template></QuestionRenderer>
                <div v-if="examStore.testMode === 'tutor'" class="text-center mt-2 text-lg font-semibold text-gray-800">
                </div>

            </div>
            <div v-if="examStore.testMode != 'exam' && !examStore.currentQuestion?.tabs"
                :class="[showSolution ? ''
                    : '', 'flex mt-0 md:mt-24 mx-4 gap-5 flex-col w-full md:max-w-1/2 border-l border-gray-400 border-dashed dark:border-gray-200 px-2', store?.currentZoom]">
                <div class="flex items flex-col ">
                    <h3 class="text-lg font-semibold mb-6 underline underline-offset-2 decoration-teal-500">Full
                        Question
                        Explanation
                        <button @click="examStore.showNotes = true"
                            class="ml-auto text-sm text-sky-600 hover:underline">
                            <i class="pi pi-pencil ms-1"></i>Notes
                        </button>
                    </h3>
                    <span v-if="!showSolution" class="text-gray-500 mb-1">Answer the question to reveal
                        solution.</span>
                    <div :class="[!showSolution ? 'blur-sm bg-gray-950/25' : '', store?.currentZoom]"
                        v-html="examStore.currentQuestion?.solution">
                    </div>
                </div>
                <div v-if="['tutor', 'review'].includes(examStore.testMode)"
                    class="px-4 py-1 bg-sky-50 rounded-xl border border-gray-200">
                    <div class="flex items-center gap-1">
                        <span class="mb-2 font-semibold text-sky-500"> <i
                                class="pi pi-wave-pulse text-rose-500 me-2 mt-1 "></i>Question
                            Stats</span>
                    </div>
                    <div class="flex mb-2 flex-wrap items-start gap-4 lg:mb-12 text-sm text-gray-700 font-medium">
                        <div class="flex items-center gap-1">
                            <i class="pi pi-pi-gauge text-yellow-500"></i>
                            <span>Difficulty: {{ difficulty }}</span>
                        </div>

                        <div class="flex items-center gap-1">
                            <i class="pi pi-clock text-teal-500"></i>
                            <span>Time Taken: {{ localTimer }}s</span>
                        </div>

                        <div v-if="examStore.answers[examStore.currentQuestion.id]" class="flex items-center gap-1">
                            <i class="pi pi-user-edit text-teal-500"></i>
                            <span>Your Answer was {{ examStore.answers[examStore.currentQuestion.id]
                                }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="examStore.showNotes && examStore.testMode != 'exam'"
                class="flex mt-0 md:mt-24 mx-4  md:mb-16 flex-col gap-4 w-full md:max-w-1/2 border-l border-gray-400 border-dashed dark:border-gray-200 px-2 ">
                <div class="flex items">
                    <h3 class="text-lg font-semibold">Revision Notes</h3>
                    <button @click="examStore.showNotes = !examStore.showNotes"
                        class="ml-auto text-sm text-sky-500 hover:underline font-semibold">
                        <i class="pi pi-times "></i> Close
                    </button>
                </div>
                <ExamNotes v-model="notes" />
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-screen">
            <span class="text-gray-500 text-lg select-none">{{ progress }}</span>
        </div>
        <!-- Bottom bar -->
        <div class="flex fixed bottom-0 left-0 right-0 justify-between bg-sky-700  text-white">
            <div class="flex justify-between items-center flex-row  border-s border-e mx-2 px-3 h-full p-1 gap-2">
                <button class="px-4 py-2 cursor-pointer rounded flex justify-center items-center gap-1 font-semibold "
                    @click="exitExamConfirm">
                    <i class="pi pi-sign-out"></i>
                    <span class="">End</span>
                </button>

                <button class="px-4 py-2 cursor-pointer rounded flex justify-center items-center gap-1 font-semibold"
                    @click="pauseExam">
                    <i class="pi pi-pause"></i>
                    <span class="flex items-center gap-1 font-semibold ">Pause</span>
                </button>
            </div>
            <div class="flex items-center justify-between flex-row  border-s border-e mx-2 gap-2 h-full">
                <button v-if="!examStore.isFirstQuestion" @click="examStore.prev" :disabled="examStore.isFirstQuestion"
                    class="px-4 py-2 cursor-pointer rounded flex justify-center items-center gap-1 font-semibold">
                    <i class="pi pi-arrow-left"></i> Previous
                </button>

                <button v-if="examStore.testMode === 'review'" @click="examStore.next"
                    :disabled="examStore.isLastQuestion"
                    class="px-4 py-2 cursor-pointer rounded flex justify-center items-center gap-1 font-semibold">
                    <span v-if="!examStore.isLastQuestion">Next</span>
                    <span v-else>Done</span>
                    <i class="pi pi-arrow-right"></i>
                </button>
                <button v-else @click="examStore.isLastQuestion ? examStore.submitResults() : examStore.next()"
                    class="px-4 py-2  cursor-pointer rounded flex justify-center items-center gap-1 font-semibold">
                    <span v-if="!examStore.isLastQuestion">Next</span>
                    <span v-else>Complete</span>
                    <i class="pi pi-arrow-right"></i>
                </button>

            </div>
        </div>
        <!-- 
        Review Mode: Score
        <div v-if="examStore.testMode === 'review'" class="text-center mt-2 text-lg font-semibold text-gray-800">
            Score: {{ scoreDisplay }}
        </div> -->
        <!-- Pause Overlay -->
        <div v-if="examStore.timer == null"
            class="absolute inset-0 z-50 bg-sky-950/35 flex items-center justify-center">
            <CommonButton icon2="pi pi-refresh"
                classes="ml-4 text-white  bg-rose-500 hover:bg-teal-600 px-6 py-3 rounded-full shadow-lg transition-all"
                :action="() => examStore.startTimer()" button-text="Resume Exam" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, computed, ref, onBeforeUnmount, watch, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useNclexExamStore } from '../stores/nclexExamStore'
import QuestionRenderer from './QuestionRenderer.vue'
import Calculator from './Calculator.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useDark, useToggle } from "@vueuse/core";
import { useMainStore } from '../stores'
import ExamNotes from './ExamNotes.vue'
import CommonButton from './Buttons/CommonButton.vue'
import { useAuthStore } from '../stores/authStore'
import ExamFeedbackModal from './ExamFeedbackModal.vue'


const isDark = useDark({ disableTransition: false });
const toggleDark = useToggle(isDark);
const progress = ref('Preparing Test...')
const provided_payload = ref(false);
const { zoomIn, zoomOut } = useMainStore();
const store = useMainStore();
const route = useRoute()
const router = useRouter()
const examStore = useNclexExamStore() as any
const confirm = useConfirm()
const notes = ref('')
const difficulty = ref('')
const { user } = useAuthStore()


const caseQuestionCounter = ref(0)
const block_size = ref(0)


const currentAnswer = computed({
    get: () => {
        const id = examStore.currentQuestion?.id
        return id ? examStore.answers[id] || '' : ''
    },

    set: (val) => {
        const id = examStore.currentQuestion?.id
        if (id && (examStore.testMode !== 'review' || examStore.testMode !== 'tutor')) {
            examStore.answerQuestion(id, val)
        }
        if (notes.value?.trim()) {
            examStore.answerQuestionNotes(id, notes.value)
        }
    }
})

// const scoreDisplay = computed(() => {
//     const total = examStore.questions.length
//     const correct = Object.values(examStore.results).filter(r => r.correct).length
//     return `${correct} / ${total} correct (${Math.round((correct / total) * 100)}%)`
// })

async function loadExam() {
    try {
        const examId = route.params.id || route.path.split('/').pop()

        const mode = (route.query.mode as string) || 'exam';

        examStore.setMode(mode as | 'exam' | 'review' | 'tutor');

        if (mode == 'review') {
            const { data } = await axios.get(`/nclex/exam-attempts/${examId}`, { showLoader: false })
            const attempt = data.data

            examStore.loadAttempt({
                exam: {
                    id: attempt.sub_topic.id,
                    title: attempt.sub_topic.name,
                    description: attempt.sub_topic.description
                },
                questions: attempt.questions,
                answers: JSON.parse(attempt.answers),
                results: JSON.parse(attempt.results),
                mode: mode
            })

        } else {
            const { data } = await axios.get(`/nclex/exam/${examId}`, { showLoader: false })
            const examData = data.data
            examStore.setExamData({
                exam: {
                    id: examData.id,
                    title: examData.name,
                    description: examData.description
                },
                questions: examData.questions
            })
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            window.alert(error.response?.data?.error || 'This NCLEX exam is locked.')
            route.path.includes('/nclex/exam/')
                ? router.push('/nclex/linear')
                : router.push('/nclex/')
            return
        }

        console.error('Error loading NCLEX exam:', error)
    }
}

function exitExamConfirm() {
    confirm.require({
        message: 'Exit the exam and resume later?',
        header: 'Confirm exit exam!',
        icon: 'pi pi-exclamation-triangle text-rose-500',
        acceptLabel: 'Suspend',
        rejectLabel: 'Continue',
        acceptClass:
            "bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-full",
        rejectClass:
            "bg-teal-500 hover:bg-gray-400 bg-teal-500 text-white font-bold py-2 px-4 rounded-full",
        accept: () => {
            examStore.exitExam()
        },
        reject: () => {
            //
        }
    })
}


const toggleSolution = (payload) => {
    provided_payload.value = payload.value;
};

provide('showSolution', toggleSolution);

const showSolution = computed(() => {

    const mode = examStore.testMode;

    const current = examStore.currentQuestion;
    const manualRevealTypes = ['MMA', 'MMN', 'MTX', 'MMC', 'DRDCLOZE', 'BOW', 'DRD', 'DDC'];

    // Always show if mode is 'review' or 'review'
    if (mode === 'review') return true;
    // Always show if payload is provided from child

    if (provided_payload?.value) return true;
    // Otherwise show if in tutor/review mode AND the current question has an answer 
    //type not [MMA,]

    return (
        ['tutor', 'review'].includes(mode) &&
        current &&
        !!examStore.answers[current.id] &&
        !manualRevealTypes.includes(current.question_type?.code)
    );
});

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


watch(() => examStore.currentQuestion, (newId, oldId) => {
    provided_payload.value = false
    startTimer()
    // check if case study question and get index
    if (examStore.currentQuestion?.has_sub_questions) {
        caseQuestionCounter.value = 1;
        block_size.value = examStore.currentQuestion.block_size;
    }
    else if (examStore.currentQuestion?.is_sub) {
        if (caseQuestionCounter.value < block_size.value) {
            caseQuestionCounter.value++;
        }
    }
    else {
        caseQuestionCounter.value = 0;
        block_size.value = 0;
    }


    difficulty.value = ['Easy',
        'Medium', 'Difficult'][Math.floor(Math.random() * 3)]

})


onMounted(() => {
    examStore.reset()
    examStore.resetTimer()
    loadExam()
    examStore.startTimer()
    startTimer()
    setTimeout(() => {
        progress.value = `Loading Test...`
    }, 1000)

})


onBeforeUnmount(() => {
    examStore.reset()
    examStore.resetTimer()
    clearTimer()
})

function pauseExam() {
    confirm.require({
        message: 'Are you sure you want to pause the exam? You can resume later from where you left off.',
        header: 'Pause Exam Confirmation',
        icon: 'pi pi-pause-circle text-yellow-500 text-xl',
        acceptLabel: 'Pause and Exit',
        rejectLabel: 'Just Pause',
        acceptClass: "bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-full",
        rejectClass: "bg-teal-500 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-full",
        accept: () => {
            examStore.pauseTimer()
            examStore.exitExam()
        },

        reject: () => {
            examStore.pauseTimer()
        }
    })
}

const showModal = async (modalId: any) => {
    const modal: any = document.getElementById(modalId);
    if (modal) {
        modal.showModal();
    }
};

</script>

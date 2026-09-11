<template>
    <div class="exam-shell">
        <!-- ================= TOP BAR ================= -->
        <header class="exam-bar exam-bar--top">
            <div class="hidden min-w-0 flex-1 items-center gap-3 md:flex">
                <span class="exam-bar-logo"><i class="pi pi-book"></i></span>
                <div v-if="examStore.questions.length > 0" class="hidden min-w-0 md:block">
                    <p class="truncate text-sm font-bold leading-tight">{{ examStore.exam?.title }}</p>
                    <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-100/80">Nursing · {{ modeLabel }}</p>
                </div>
            </div>

            <div v-if="examStore.questions.length > 0" class="exam-bar-center">
                <span class="whitespace-nowrap text-sm"><span class="hidden sm:inline">Question </span><span class="sm:hidden">Q</span><strong class="tabular-nums">{{ Number(examStore.currentIndex) + 1 }}</strong><span class="opacity-80"> / {{ examStore.questions.length }}</span></span>
                <span class="exam-bar-progress hidden sm:block" aria-hidden="true"><span :style="{ width: `${progressPercent}%` }"></span></span>
                <span class="text-[9px] font-bold uppercase tracking-wide text-sky-100/80 md:hidden">{{ modeLabel }}</span>
            </div>

            <div class="flex flex-1 items-center justify-end gap-0.5 sm:gap-1">
                <button v-if="examStore.testMode != 'exam'" type="button" class="exam-bar-btn exam-bar-btn--ai" :class="{ 'exam-bar-btn--on': ChatOpenned }" aria-label="Ask AI about this question" @click="ChatOpenned = !ChatOpenned">
                    <i class="pi pi-sparkles"></i><span>Ask AI</span>
                </button>
                <span class="exam-bar-btn">
                    <ExamFeedbackModal source-product="nursing" :exam-mode="examStore.testMode" :question-id="examStore.currentQuestion?.id" :exam-id="examStore.exam?.id" />
                </span>
                <button type="button" class="exam-bar-btn" aria-label="Calculator" @click="showModal('calculator_id')">
                    <i class="pi pi-calculator"></i><span class="hidden xl:inline">Calculator</span>
                </button>
                <button v-if="examStore.testMode != 'exam'" type="button" class="exam-bar-btn" :class="{ 'exam-bar-btn--on': examStore.showNotes }" aria-label="Notes" @click="toggleNotes">
                    <i class="pi pi-pencil"></i><span class="hidden xl:inline">Notes</span>
                </button>
                <Calculator />
                <span class="exam-bar-timer" :title="examStore.timer == null ? 'Paused' : 'Elapsed'">
                    <i :class="examStore.timer == null ? 'pi pi-pause' : 'pi pi-clock'" class="hidden sm:inline"></i>
                    <span class="tabular-nums">{{ examStore.timerDisplay || '00:00' }}</span>
                </span>
                <span class="exam-bar-zoom hidden lg:inline-flex" title="Text size">
                    <button type="button" aria-label="Smaller text" @click="zoomOut"><i class="pi pi-minus"></i></button>
                    <span>Aa</span>
                    <button type="button" aria-label="Larger text" @click="zoomIn"><i class="pi pi-plus"></i></button>
                </span>
                <button type="button" class="exam-bar-btn" :aria-label="isDark ? 'Light mode' : 'Dark mode'" @click="toggleDark()">
                    <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
                </button>
            </div>
        </header>

        <!-- ================= BODY ================= -->
        <div v-if="examStore.questions.length > 0" class="exam-body">
            <main v-if="examStore.currentQuestion" class="exam-main" :class="store?.currentZoom">
                <section class="exam-question-card">
                    <div class="exam-question-head">
                        <span class="exam-question-num">Q{{ Number(examStore.currentIndex) + 1 }}</span>
                        <span v-if="questionTypeLabel" class="exam-question-type">{{ questionTypeLabel }}</span>
                        <span v-if="hasQuestionAnswer(examStore.currentQuestion)" class="exam-question-state exam-question-state--answered"><i class="pi pi-check"></i> Answered</span>
                        <span v-else class="exam-question-state"><i class="pi pi-circle"></i> Not answered</span>
                    </div>
                    <QuestionRenderer :examStore="examStore" :question="examStore.currentQuestion" v-model="currentAnswer"
                        :readonly="examStore.testMode === 'review'" :result="examStore.results[examStore.currentQuestion.id]" />
                </section>

                <section v-if="examStore.testMode != 'exam'" class="exam-solution" :class="{ 'exam-solution--locked': !showSolution }">
                    <div class="exam-solution-head">
                        <span class="exam-solution-title"><i class="pi pi-lightbulb"></i> Full question solution</span>
                        <button type="button" class="exam-link" @click="openNotes"><i class="pi pi-pencil"></i> Notes</button>
                    </div>
                    <p v-if="!showSolution" class="exam-solution-hint"><i class="pi pi-lock"></i> Answer the question to reveal the rationale.</p>
                    <div class="exam-solution-body" :class="store?.currentZoom" v-html="examStore.currentQuestion?.solution"></div>
                    <button v-if="showSolution" type="button" class="exam-ai-btn" @click="ChatOpenned = !ChatOpenned">
                        <i class="pi pi-comments"></i> Dive deeper with AI
                    </button>
                </section>

                <section v-if="examStore.testMode === 'review' && hasCurrentReviewNote" class="exam-note">
                    <p class="exam-note-title"><i class="pi pi-pencil"></i> My notes</p>
                    <div class="text-sm leading-relaxed" v-html="currentReviewNote"></div>
                </section>

                <div v-if="['tutor', 'review'].includes(examStore.testMode)" class="exam-stats">
                    <span class="exam-stat"><i class="pi pi-gauge text-amber-500"></i> Difficulty <strong>{{ difficulty }}</strong></span>
                    <span class="exam-stat"><i class="pi pi-clock text-teal-500"></i> Time on question <strong class="tabular-nums">{{ localTimer }}s</strong></span>
                    <span v-if="examStore.answers[examStore.currentQuestion.id]" class="exam-stat"><i class="pi pi-user-edit text-sky-500"></i> Your answer <strong>{{ examStore.answers[examStore.currentQuestion.id] }}</strong></span>
                </div>
            </main>

            <!-- Navigator -->
            <aside v-if="showQuestionNavigator" class="exam-side" :class="store?.currentZoom">
                <div class="exam-nav">
                    <div class="exam-nav-head">
                        <div>
                            <p class="exam-nav-title">Navigator</p>
                            <p class="exam-nav-sub"><strong class="tabular-nums">{{ answeredCount }}</strong> of {{ examStore.questions.length }} answered</p>
                        </div>
                        <span class="exam-nav-ring" :style="{ '--p': `${answeredPercent}%` }"><span>{{ answeredPercent }}%</span></span>
                    </div>

                    <button v-if="lockedFrom >= 0" type="button" class="exam-nav-preview" @click="examStore.show_paywall = true">
                        <i class="pi pi-lock"></i>
                        <span><strong>Preview:</strong> {{ lockedFrom }} of {{ examStore.questions.length }} questions are open. Tap to unlock the full set.</span>
                        <i class="pi pi-arrow-right"></i>
                    </button>

                    <div class="exam-nav-grid">
                        <button v-for="(question, index) in examStore.questions" :key="question.id" type="button"
                            :aria-current="index === examStore.currentIndex ? 'true' : undefined"
                            :title="questionNavTitle(question, index as any)" :class="questionNavClass(question, index as any)"
                            @click="goToQuestion(index as any)">
                            <span>{{ (index as any) + 1 }}</span>
                            <i v-if="isQuestionLocked(index as any)" class="pi pi-lock exam-nav-lock" aria-hidden="true"></i>
                            <span v-else-if="shouldShowQuestionResult(question)" :class="questionResultBadgeClass(question)" v-html="questionResultMark(question)"></span>
                        </button>
                    </div>

                    <div class="exam-nav-legend">
                        <span><i class="exam-nav-dot exam-nav-dot--current"></i> Current</span>
                        <span v-if="examStore.testMode === 'exam'"><i class="exam-nav-dot exam-nav-dot--answered"></i> Answered</span>
                        <template v-else>
                            <span><i class="exam-nav-dot exam-nav-dot--correct"></i> Correct</span>
                            <span><i class="exam-nav-dot exam-nav-dot--wrong"></i> Incorrect</span>
                        </template>
                        <span v-if="lockedFrom >= 0"><i class="exam-nav-dot exam-nav-dot--locked"></i> Locked</span>
                    </div>
                </div>
            </aside>

            <!-- Notes -->
            <aside v-if="examStore.showNotes && examStore.testMode != 'exam'" class="exam-side exam-side--notes">
                <div class="exam-nav">
                    <div class="exam-nav-head">
                        <div>
                            <p class="exam-nav-title">Revision notes</p>
                            <p class="exam-nav-sub">Saved automatically for this question.</p>
                        </div>
                        <button type="button" class="exam-link" @click="closeNotes"><i class="pi pi-times"></i> Close</button>
                    </div>
                    <ExamNotes v-model="notes" />
                </div>
            </aside>
        </div>
        <div v-else class="exam-loading">
            <span class="dash-icon-tile theme-icon h-12 w-12"><i class="pi pi-spin pi-spinner"></i></span>
            <span class="text-sm font-semibold text-slate-500 select-none dark:text-slate-300">{{ progress }}</span>
        </div>

        <!-- ================= BOTTOM BAR ================= -->
        <footer class="exam-bar exam-bar--bottom">
            <div class="flex items-center gap-1">
                <button type="button" class="exam-bar-btn" @click="exitExamConfirm">
                    <i class="pi pi-sign-out"></i><span>End</span>
                </button>
                <button type="button" class="exam-bar-btn hidden md:inline-flex" @click="pauseExam">
                    <i class="pi pi-pause"></i><span>Pause</span>
                </button>
            </div>
            <div class="flex items-center gap-2">
                <button type="button" class="exam-bar-btn" :disabled="examStore.isFirstQuestion" @click="goToPreviousQuestion">
                    <i class="pi pi-arrow-left"></i><span>Previous</span>
                </button>
                <button v-if="examStore.testMode === 'review'" type="button" class="exam-bar-next" :disabled="examStore.isLastQuestion" @click="goToNextQuestion">
                    <span>{{ examStore.isLastQuestion ? 'Done' : 'Next' }}</span><i class="pi pi-arrow-right"></i>
                </button>
                <button v-else type="button" class="exam-bar-next" @click="submitOrNextQuestion">
                    <span>{{ examStore.isLastQuestion ? 'Complete' : 'Next' }}</span><i :class="examStore.isLastQuestion ? 'pi pi-check' : 'pi pi-arrow-right'"></i>
                </button>
            </div>
        </footer>

        <!-- Pause overlay -->
        <div v-if="examStore.timer == null" class="exam-overlay">
            <div class="exam-overlay-card">
                <span class="dash-icon-tile mx-auto h-14 w-14 bg-sky-700 text-2xl text-white shadow-lg"><i class="pi pi-pause"></i></span>
                <h3 class="mt-4 text-xl font-extrabold text-slate-950 dark:text-white">Exam paused</h3>
                <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Your timer is stopped at {{ examStore.timerDisplay }}. Take a breath, then pick up where you left off.</p>
                <button type="button" class="dash-btn mt-5 bg-sky-700 px-6 py-2.5 text-white" @click="examStore.startTimer()"><i class="pi pi-play text-[10px]"></i> Resume exam</button>
            </div>
        </div>

        <!-- Paywall -->
        <div v-if="examStore.show_paywall" class="exam-overlay exam-overlay--blur">
            <div class="w-full max-w-xl">
                <UpgradePrompt product="nursing" variant="card" feature="the rest of this exam" placement="nursing_preview_modal"
                    :title="`Nice work, ${firstName}. You've finished the preview.`"
                    :message="`The first ${examStore.no_of_qns_before_paywall} questions are open on your current plan. Upgrade to continue this full-length set with rationales, analytics, and saved progress.`"
                    primary-label="Unlock full Nursing access" continue-label="Keep reviewing the open questions" @continue="examStore.show_paywall = false" />
            </div>
        </div>

        <AiChat v-if="ChatOpenned && examStore.testMode != 'exam'" @close="ChatOpenned = false" :question="examStore.currentQuestion" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, onBeforeUnmount, watch, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useNursingExamStore } from '../stores/nursingExamStore'
import QuestionRenderer from './QuestionRenderer.vue'
import Calculator from './Calculator.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useDark, useToggle } from "@vueuse/core";
import { useMainStore } from '../stores'
import ExamNotes from './ExamNotes.vue'
import CommonButton from './Buttons/CommonButton.vue'
import { useAuthStore } from '../stores/authStore'
import ExamFeedbackModal from './ExamFeedbackModal.vue'
import AiChat from './AiChat.vue'
import { trackPaywallEvent } from '../utils/paywallEvents'
import UpgradePrompt from './UpgradePrompt.vue'


const isDark = useDark({ disableTransition: false });
const toggleDark = useToggle(isDark);
const progress = ref('Preparing Test...')

const { zoomIn, zoomOut } = useMainStore();
const store = useMainStore();
const authStore = useAuthStore();
const { active } = authStore;
const route = useRoute()
const router = useRouter()
const examStore = useNursingExamStore() as any
const confirm = useConfirm()
const difficulty = ref('')
const type = ref('')
const provided_payload = ref(false);
const ChatOpenned = ref(false);
const pendingNoteValues = new Map<number, string>();
const noteSaveTimers = new Map<number, ReturnType<typeof setTimeout>>();
const firstName = computed(() => authStore.user?.name?.split(' ')[0] || 'there')

watch(() => examStore.show_paywall, (shown) => {
    if (!shown) return

    trackPaywallEvent('paywall_shown', {
        product: 'nursing',
        placement: 'nursing_exam_renderer',
        reason: 'preview_limit',
        exam_id: examStore.exam?.id,
        questions_previewed: examStore.no_of_qns_before_paywall,
        question_index: examStore.currentIndex,
    })
})


const showModal = async (modalId: any) => {
    const modal: any = document.getElementById(modalId);
    if (modal) {
        modal.showModal();
    }
};

const toggleSolution = (payload) => {
    provided_payload.value = payload.value;
};

provide('showSolution', toggleSolution);

const showQuestionNavigator = computed(() => {
    return examStore.questions.length > 0 && (examStore.testMode === 'exam' || !examStore.showNotes);
})

function openNotes() {
    examStore.showNotes = true;
}

function closeNotes() {
    examStore.showNotes = false;
}

function toggleNotes() {
    examStore.showNotes ? closeNotes() : openNotes();
}

const parseRecordPayload = (value: any, fallback = {}) => {
    if (value == null) return fallback;
    if (typeof value !== 'string') return value;

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

const tryParseAnswerJson = (value: string) => {
    try {
        return JSON.parse(value);
    } catch {
        return undefined;
    }
}

const normalizeComparableObject = (value: any): any => {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeComparableObject(item));
    }

    if (value && typeof value === 'object') {
        return Object.keys(value).sort().reduce((acc, key) => {
            acc[key] = normalizeComparableObject(value[key]);
            return acc;
        }, {} as Record<string, any>);
    }

    return value;
}

const stableAnswerStringify = (value: any) => JSON.stringify(normalizeComparableObject(value));

function answerValueExists(value: any): boolean {
    if (value == null) return false;

    if (Array.isArray(value)) {
        return value.some((item) => answerValueExists(item));
    }

    if (typeof value === 'string') {
        const parsed = tryParseAnswerJson(value);
        if (parsed !== undefined) return answerValueExists(parsed);

        return value.trim().length > 0;
    }

    if (typeof value === 'object') {
        return Object.values(value).some((item) => answerValueExists(item));
    }

    return true;
}

function normalizeAnswerForComparison(answer: any): string[] {
    if (answer == null) return [];

    if (typeof answer === 'string') {
        const parsed = tryParseAnswerJson(answer);
        if (parsed !== undefined) return normalizeAnswerForComparison(parsed);

        const trimmed = answer.trim();
        return trimmed ? [trimmed] : [];
    }

    if (Array.isArray(answer)) {
        return answer
            .flatMap((item) => normalizeAnswerForComparison(item))
            .filter((item) => item.length > 0);
    }

    if (typeof answer === 'object') {
        return [stableAnswerStringify(answer)];
    }

    return [String(answer)];
}

function answersMatch(userAnswer: any, correctAnswer: any) {
    const userValues = normalizeAnswerForComparison(userAnswer);
    const correctValues = normalizeAnswerForComparison(correctAnswer);

    if (userValues.length === 0 || correctValues.length === 0) return false;

    return JSON.stringify([...userValues].sort()) === JSON.stringify([...correctValues].sort());
}

function questionAnswer(question: any) {
    return examStore.answers?.[question.id];
}

function hasQuestionAnswer(question: any) {
    return answerValueExists(questionAnswer(question));
}

function isQuestionCorrect(question: any) {
    const result = examStore.results?.[question.id];

    if (typeof result?.correct === 'boolean') {
        return result.correct;
    }

    if (!hasQuestionAnswer(question)) return false;

    return answersMatch(questionAnswer(question), question.correct_answer);
}

function shouldShowQuestionResult(question: any) {
    return ['tutor', 'review'].includes(examStore.testMode) && hasQuestionAnswer(question);
}

function questionNavClass(question: any, index: any) {
    const classes = ['exam-nav-btn'];
    if (index === examStore.currentIndex) classes.push('exam-nav-btn--current');
    if (isQuestionLocked(index)) classes.push('exam-nav-btn--locked');
    else if (shouldShowQuestionResult(question)) classes.push(isQuestionCorrect(question) ? 'exam-nav-btn--correct' : 'exam-nav-btn--wrong');
    else if (hasQuestionAnswer(question)) classes.push('exam-nav-btn--answered');
    return classes.join(' ');
}

function questionResultBadgeClass(question: any) {
    return isQuestionCorrect(question) ? 'exam-nav-badge exam-nav-badge--ok' : 'exam-nav-badge exam-nav-badge--bad';
}

function questionResultMark(question: any) {
    return isQuestionCorrect(question) ? '&#x2713' : '&#10007;';
}

const MODE_LABELS: Record<string, string> = { exam: 'Exam mode', tutor: 'Tutor mode', review: 'Review mode' };
const modeLabel = computed(() => MODE_LABELS[examStore.testMode] || examStore.testMode);
const TYPE_LABELS: Record<string, string> = {
    MSA: 'Single answer', MMA: 'Multiple answers', FIB: 'Fill in the blank', DRD: 'Dropdown', ORD: 'Ordering', HL: 'Highlight',
    GRP: 'Grouping', GRPCHCKBOX: 'Grouping', MTX: 'Matrix', MMC: 'Matrix single choice', MMN: 'Matrix multiple choice',
    BOW: 'Bow-tie', DDC: 'Drag and drop', DRDCLOZE: 'Cloze dropdown',
};
const questionTypeLabel = computed(() => {
    const type = examStore.currentQuestion?.question_type;
    if (!type) return '';
    return type.name || TYPE_LABELS[String(type.code || '').toUpperCase()] || String(type.code || '');
});
const answeredCount = computed(() => (examStore.questions as any[]).filter((q) => hasQuestionAnswer(q)).length);
const answeredPercent = computed(() => examStore.questions.length ? Math.round((answeredCount.value / examStore.questions.length) * 100) : 0);
const progressPercent = computed(() => examStore.questions.length ? Math.round(((Number(examStore.currentIndex) + 1) / examStore.questions.length) * 100) : 0);

function isQuestionLocked(index: number) {
    if (!examStore.is_current_exam_full_length && index >= examStore.no_of_qns_before_paywall) return true;
    if (!active('nursing') && examStore.questions.length > 100 && index > 50) return true;
    return false;
}

/** Index of the first locked question, or -1 when the whole set is open. */
const lockedFrom = computed(() => {
    const total = examStore.questions.length;
    for (let i = 0; i < total; i++) if (isQuestionLocked(i)) return i;
    return -1;
});

function questionNavTitle(question: any, index: number) {
    const states = [`Question ${index + 1}`];

    if (index === examStore.currentIndex) states.push('current');
    if (isQuestionLocked(index)) states.push('locked - upgrade to open');
    if (examStore.testMode === 'exam' && hasQuestionAnswer(question)) states.push('attempted');
    if (shouldShowQuestionResult(question)) states.push(isQuestionCorrect(question) ? 'correct' : 'incorrect');

    return states.join(' - ');
}


const currentAnswer = computed({
    get: () => {
        const id = examStore.currentQuestion?.id
        return id ? examStore.answers[id] || '' : ''
    },

    set: (val) => {
        const id = examStore.currentQuestion?.id
        if (id && examStore.testMode !== 'review') {
            examStore.answerQuestion(id, val)
        }
    }
})

const notes = computed({
    get: () => {
        const id = examStore.currentQuestion?.id;

        return id ? examStore.notes[id] || '' : '';
    },

    set: (value: string) => {
        const id = examStore.currentQuestion?.id;

        if (!id) return;

        examStore.answerQuestionNotes(id, value);
        queueNoteSave(id, value);
    }
})

const currentReviewNote = computed(() => {
    const id = examStore.currentQuestion?.id;

    return id ? examStore.notes[id] || '' : '';
})

const hasCurrentReviewNote = computed(() => hasVisibleNote(currentReviewNote.value))

function hasVisibleNote(note: string) {
    return note
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim()
        .length > 0;
}

function queueNoteSave(questionId: number, note: string) {
    pendingNoteValues.set(questionId, note);

    const existingTimer = noteSaveTimers.get(questionId);
    if (existingTimer) {
        clearTimeout(existingTimer);
    }

    noteSaveTimers.set(
        questionId,
        setTimeout(() => {
            flushNoteSave(questionId);
        }, 600)
    );
}

async function flushNoteSave(questionId: number) {
    const timer = noteSaveTimers.get(questionId);
    if (timer) {
        clearTimeout(timer);
        noteSaveTimers.delete(questionId);
    }

    if (!pendingNoteValues.has(questionId)) return;

    const note = pendingNoteValues.get(questionId) || '';
    pendingNoteValues.delete(questionId);

    try {
        await examStore.saveQuestionNote(questionId, note);
    } catch (error) {
        pendingNoteValues.set(questionId, note);
        console.error('Error saving question note:', error);
    }
}

async function flushCurrentNoteSave() {
    const id = examStore.currentQuestion?.id;

    if (id) {
        await flushNoteSave(id);
    }
}

async function flushAllNoteSaves() {
    await Promise.all([...pendingNoteValues.keys()].map((questionId) => flushNoteSave(questionId)));
}

async function goToPreviousQuestion() {
    await flushCurrentNoteSave();
    examStore.prev();
}

async function goToNextQuestion() {
    await flushCurrentNoteSave();
    examStore.next();
}

function canNavigateToQuestion(index: number) {
    if (index <= examStore.currentIndex) return true;

    if (
        index >= examStore.no_of_qns_before_paywall &&
        !examStore.is_current_exam_full_length
    ) {
        examStore.show_paywall = true;
        return false;
    }

    if (!active("nursing") && examStore.questions.length > 100 && index > 50) {
        examStore.show_paywall = true;
        return false;
    }

    return true;
}

async function goToQuestion(index: number) {
    if (index === examStore.currentIndex || !canNavigateToQuestion(index)) return;

    await flushCurrentNoteSave();
    examStore.currentIndex = index;
}

async function submitOrNextQuestion() {
    await flushCurrentNoteSave();

    if (examStore.isLastQuestion) {
        await examStore.submitResults();
        return;
    }

    examStore.next();
}

async function finishExam() {
    await flushCurrentNoteSave();
    examStore.exitExam();
}

// const scoreDisplay = computed(() => {
//     const total = examStore.questions.length
//     const correct = Object.values(examStore.results).filter(r => r.correct).length
//     return `${correct} / ${total} correct (${Math.round((correct / total) * 100)}%)`
// })

async function loadExam() {
    const examId = route.params.id || route.path.split('/').pop()
    const queryValue = (value: unknown) => Array.isArray(value) ? value[0] : value;

    const mode = String(queryValue(route.query.mode) || 'exam').trim() as 'exam' | 'review' | 'tutor';
    const isRawExamReview = String(queryValue(route.query.examreview) || '').trim() === 'true';

    examStore.setMode(mode);

    if (mode === 'review') {
        if (isRawExamReview) {
            const { data } = await axios.get(`/nursing/exam/${examId}`, { showLoader: false })
            const examData = data.data;

            examStore.setExamData({
                exam: {
                    id: examData.id,
                    title: examData.name,
                    description: examData.description
                },
                questions: examData.questions,
                notes: parseRecordPayload(examData.notes),
                is_exam_full_length: examData.full_length,
            })
        } else {
            const { data } = await axios.get(`/nursing/exam-attempts/${examId}`, { showLoader: false })

            const attempt = data.data

            examStore.loadAttempt({
                exam: {
                    id: attempt.sub_topic.id,
                    title: attempt.sub_topic.name,
                    description: attempt.sub_topic.description
                },
                questions: attempt.questions,
                answers: parseRecordPayload(attempt.answers),
                results: parseRecordPayload(attempt.results),
                notes: parseRecordPayload(attempt.notes),
                is_exam_full_length: attempt.full_length,
                mode: mode
            })
        }
    } else {
        const resume = (route.query.resume as any) || null;
        if (resume) {
            const { data } = await axios.get(`/nursing/resume-attempt/${examId}`, { showLoader: false })

            const attempt = data.data

            examStore.setMode(attempt.mode as | 'exam' | 'review' | 'tutor');

            examStore.loadAttempt({
                exam: {
                    id: attempt.sub_topic.id,
                    title: attempt.sub_topic.name,
                    description: attempt.sub_topic.description
                },
                questions: attempt.questions,
                answers: parseRecordPayload(attempt.answers),
                results: parseRecordPayload(attempt.results),
                notes: parseRecordPayload(attempt.notes),
                mode: attempt.mode,
                suspend_index: attempt.suspend_index,
                is_exam_full_length: attempt.full_length,
            })
            return;
        }
        else {
            axios.get(`/nursing/exam/${examId}`, { showLoader: false })
                .then((response) => {
                    const examData = response.data.data;
                    examStore.setExamData({
                        exam: {
                            id: examData.id,
                            title: examData.name,
                            description: examData.description
                        },
                        questions: examData.questions,
                        notes: parseRecordPayload(examData.notes),
                        is_exam_full_length: examData.full_length,
                    })
                })
                .catch((error) => {
                    console.error('Error fetching exam data:', error.response?.data?.error?.message);
                });
        }
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
            finishExam()
        },
        reject: () => {
            //
        }
    })
}

const showSolution = computed(() => {

    const mode = examStore.testMode;

    const current = examStore.currentQuestion;

    const manualRevealTypes = ['MMA', 'MMN', 'MTX', 'MMC', 'DRDCLOZE', 'GRP', 'GRPCHCKBOX', 'BOW', 'DRD', 'DDC'];

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
    if (oldId?.id) {
        flushNoteSave(oldId.id);
    }

    provided_payload.value = false
    startTimer()
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

    //disable right click
    // document.addEventListener('contextmenu', (e) => {
    //     e.preventDefault();
    // });

})


onBeforeUnmount(() => {
    flushAllNoteSaves()
    examStore.reset()
    examStore.resetTimer()
    clearTimer()
    //remove right click disable
    document.removeEventListener('contextmenu', (e) => {
        e.preventDefault();
        alert('Right click is disabled during the exam.');
    });
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
            finishExam()
        },

        reject: () => {
            examStore.pauseTimer()
        }
    })
}

</script>

<style>
strong {
    font-weight: 600;
}
</style>

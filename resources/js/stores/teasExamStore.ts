import { defineStore } from "pinia";
import axios from "axios";
import router from "../router";
import { useAuthStore } from "./authStore";

type Question = {
    id: number;
    question: string;
    type: any;
    options: Record<string, { choice: string; reason: string }>;
    correct_answer?: string | string[]; // Add this for clarity
};

const tryParseJson = (value: string) => {
    try {
        return JSON.parse(value);
    } catch {
        return undefined;
    }
};

const normalizeAnswer = (answer: unknown): string[] => {
    if (answer == null) return [];
    if (typeof answer === "string") {
        const parsed = tryParseJson(answer);
        if (parsed !== undefined) return normalizeAnswer(parsed);
        const trimmed = answer.trim();
        return trimmed ? [trimmed] : [];
    }
    if (Array.isArray(answer)) {
        return answer
            .map((item) => String(item).trim())
            .filter((item) => !!item);
    }
    if (typeof answer === "object") {
        return [JSON.stringify(answer)];
    }
    return [String(answer)];
};

const areAnswersEqual = (
    userAnswer: unknown,
    correctAnswer: unknown,
): boolean => {
    const userValues = normalizeAnswer(userAnswer);
    const correctValues = normalizeAnswer(correctAnswer);
    if (userValues.length === 0 && correctValues.length === 0) {
        return false;
    }
    const sortedUser = [...userValues].sort();
    const sortedCorrect = [...correctValues].sort();
    return JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
};

export const useTeasExamStore = defineStore("useTeasExamStore", {
    persist: true,
    state: () => ({
        storeName: "teas",
        // exam: null as null | { id: number; title: string; description: string },
        exam: null as any | { id: number; title: string; description: string },
        questions: [] as Array<Question>,
        testMode: "exam" as "exam" | "review" | "tutor",
        answers: {} as Record<number, string | string[]>,
        notes: {} as Record<number, string | string[]>,

        currentIndex: 0,
        results: {} as Record<
            number,
            { correct: boolean; selected: string | string[] }
        >,
        timeTaken: 0,
        timer: null as ReturnType<typeof setInterval> | null,
        showNotes: false,
        dashdata: null,
        teas_exam_date: null,
        no_of_qns_before_paywall: 4,
        show_paywall: false,
        is_exam_full_length: true,
    }),

    getters: {
        currentQuestion: (state) => state.questions[state.currentIndex] || null,
        isLastQuestion: (state) =>
            state.currentIndex === state.questions.length - 1,
        isFirstQuestion: (state) => state.currentIndex === 0,
        timerDisplay(): string {
            const minutes = Math.floor(this.timeTaken / 60)
                .toString()
                .padStart(2, "0");
            const seconds = (this.timeTaken % 60).toString().padStart(2, "0");
            return `${minutes}:${seconds}`;
        },
    },

    actions: {
        setExamData(payload: {
            exam: object;
            questions: Question[];
            is_exam_full_length: boolean;
        }) {
            this.exam = payload.exam;
            this.questions = payload.questions;
            this.answers = {}; // reset previous answers
            this.currentIndex = 0;
            this.is_exam_full_length = payload.is_exam_full_length;
        },
        loadAttempt(payload: {
            exam: { id: number; title: string; description: string };
            questions: Question[];
            answers: Record<number, string | string[]>;
            results: Record<
                number,
                { correct: boolean; selected: string | string[] }
            >;
            mode: "exam" | "review" | "tutor";
            suspend_index?: number;
            is_exam_full_length: boolean;
        }) {
            this.exam = payload.exam;
            this.questions = payload.questions;
            this.answers = payload.answers;
            this.results = payload.results;
            this.testMode = payload.mode;
            this.currentIndex = payload.suspend_index || 0;
            this.is_exam_full_length = payload.is_exam_full_length;
        },
        setMode(mode: "exam" | "review" | "tutor") {
            this.testMode = mode;
        },

        answerQuestion(questionId: number, answer: string | string[]) {
            this.answers[questionId] = answer;
        },

        answerQuestionNotes(questionId: number, notes: string | string[]) {
            this.notes[questionId] = notes;
        },
        next() {
            if (!this.isLastQuestion) {
                if (
                    !this.is_exam_full_length &&
                    this.currentIndex + 1 >= this.no_of_qns_before_paywall
                ) {
                    this.show_paywall = true;
                    return;
                }
                this.currentIndex++;
            } else {
                this.submitResults();
            }
        },
        prev() {
            if (!this.isFirstQuestion) this.currentIndex--;
        },

        exitExam() {
            this.submitResults();
        },

        reset() {
            this.exam = null;
            this.questions = [];
            this.answers = {};
            this.results = {};
            this.currentIndex = 0;
            this.testMode = "exam";
            this.is_exam_full_length = true;
            this.show_paywall = false;
        },
        markAnswers() {
            this.results = {};

            for (const question of this.questions) {
                const userAnswer = this.answers[question.id];
                const correctAnswer = question.correct_answer;
                const isCorrect = areAnswersEqual(userAnswer, correctAnswer);

                this.results[question.id] = {
                    correct: isCorrect,
                    selected: userAnswer,
                };
            }
        },
        async submitResults() {
            if (
                (this.currentIndex < 1 &&
                    Object.keys(this.results).length === 0) ||
                this.testMode === "review"
            ) {
                this.testMode = "exam";
                this.reset();
                router.push("/teas/");
                return;
            }
            this.markAnswers();
            const total = this.questions.length;
            const correct = Object.values(
                this.results as Record<number, { correct: boolean }>,
            ).filter((r) => r.correct).length;
            const score = (correct / total) * 100;
            const payload = {
                topic_id: this.exam?.id,
                answers: JSON.stringify(this.answers),
                results: JSON.stringify(this.results),
                score,
                mode: this.testMode,
                suspend_index: this.currentIndex + 1,
                completed: this.isLastQuestion,
                completed_at: new Date().toISOString(),
                time_taken: this.timeTaken,
            };
            this.testMode = "exam";
            await axios.post("/teas/exam-attempts", payload).then((res) => {
                this.reset();
                router.push(`/teas/performance-report/${res.data.data.id}`);
            });
        },
        startTimer() {
            if (this.timer) return; // Timer already running
            this.timer = setInterval(() => {
                this.timeTaken++;
            }, 1000);
        },
        pauseTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        resetTimer() {
            this.pauseTimer();
            this.timeTaken = 0;
        },
        async getEssentials() {
            axios.get("teas/dashdata").then((response) => {
                this.dashdata = response.data.data;
            });
            axios.get("/exam-dates?product_code=teas").then((response) => {
                if (response.data.data?.date) {
                    this.teas_exam_date = new Date(response.data.data.date)
                        .toISOString()
                        .split("T")[0];
                }
            });
        },
    },
});

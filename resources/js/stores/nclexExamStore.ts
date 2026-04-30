import { defineStore } from "pinia";
import axios from "axios";
import router from "../router";

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

const toStringArray = (value: unknown): string[] => {
    if (value == null) return [];
    if (Array.isArray(value)) {
        return value
            .map((item) => String(item).trim())
            .filter((item) => !!item);
    }
    if (typeof value === "string") {
        const parsed = tryParseJson(value);
        if (parsed !== undefined) return toStringArray(parsed);
        const trimmed = value.trim();
        return trimmed ? [trimmed] : [];
    }
    const normalized = String(value).trim();
    return normalized ? [normalized] : [];
};

const parseBowTieAnswer = (
    answer: unknown,
): { actions: string[]; potential: string[]; parameters: string[] } | null => {
    if (typeof answer === "string") {
        const parsed = tryParseJson(answer);
        if (parsed === undefined) return null;
        return parseBowTieAnswer(parsed);
    }

    if (!answer || typeof answer !== "object") return null;

    const record = answer as Record<string, unknown>;
    const hasBowTieShape =
        "actionsAnswers" in record ||
        "potentialAnswers" in record ||
        "paramerAnswers" in record ||
        "parameterAnswers" in record;

    if (!hasBowTieShape) return null;

    return {
        actions: toStringArray(record.actionsAnswers),
        potential: toStringArray(record.potentialAnswers),
        parameters: toStringArray(
            record.paramerAnswers ?? record.parameterAnswers,
        ),
    };
};

const arraysEqualAsSets = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false;
    const left = [...a].sort();
    const right = [...b].sort();
    return JSON.stringify(left) === JSON.stringify(right);
};

const compareBowTieAnswers = (
    userAnswer: unknown,
    correctAnswer: unknown,
): boolean | null => {
    const userBowTie = parseBowTieAnswer(userAnswer);
    const correctBowTie = parseBowTieAnswer(correctAnswer);

    if (!userBowTie && !correctBowTie) return null;
    if (!userBowTie || !correctBowTie) return false;

    return (
        arraysEqualAsSets(userBowTie.actions, correctBowTie.actions) &&
        arraysEqualAsSets(userBowTie.potential, correctBowTie.potential) &&
        arraysEqualAsSets(userBowTie.parameters, correctBowTie.parameters)
    );
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
    const bowTieComparison = compareBowTieAnswers(userAnswer, correctAnswer);
    if (bowTieComparison !== null) return bowTieComparison;

    const userValues = normalizeAnswer(userAnswer);
    const correctValues = normalizeAnswer(correctAnswer);
    if (userValues.length === 0 && correctValues.length === 0) {
        return false;
    }
    const sortedUser = [...userValues].sort();
    const sortedCorrect = [...correctValues].sort();
    return JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
};

export const useNclexExamStore = defineStore("useNclexExamStore", {
    persist: true,
    state: () => ({
        // exam: null as null | { id: number; title: string; description: string },
        storeName: "nclex",
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
        NursingExamDate: "" as string | null,
        // Essentials
        exams: null,
        dashdata: null,
        nclex_exam_date: null,
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
        setExamData(payload: { exam: object; questions: Question[] }) {
            this.exam = payload.exam;
            this.questions = payload.questions;
            this.answers = {}; // reset previous answers
            this.currentIndex = 0;
        },
        loadAttempt(payload: {
            exam: { id: number; title: string; description: string };
            questions: Question[];
            answers: Record<number, string | string[]>;
            results: Record<
                number,
                { correct: boolean; selected: string | string[] }
            >;
            mode: "exam" | "review" | "tutor" | "review";
        }) {
            this.exam = payload.exam;
            this.questions = payload.questions;
            this.answers = payload.answers;
            this.results = payload.results;
            this.testMode = payload.mode;
            this.currentIndex = 0;
        },
        setMode(mode: "exam" | "review" | "tutor" | "review") {
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
                ["review"].includes(this.testMode)
            ) {
                this.testMode = "exam";
                this.reset();
                router.push("/nclex/");
                return;
            }

            this.markAnswers();
            const total = this.questions.length;
            const correct = Object.values(
                this.results as Record<number, { correct: boolean }>,
            ).filter((r) => r.correct).length;
            const score = (correct / total) * 100;
            const payload = {
                sub_topic_id: this.exam?.id,
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
            await axios.post("/nclex/exam-attempts", payload).then((res) => {
                this.reset();
                router.push(`/nclex/performance-report/${res.data.data.id}`);
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
            axios.get("nclex/dashdata").then((response) => {
                this.dashdata = response.data.data;
            });
            axios.get("/exam-dates?product_code=nclex").then((response) => {
                if (response.data.data?.date) {
                    this.nclex_exam_date = new Date(response.data.data.date)
                        .toISOString()
                        .split("T")[0];
                }
            });
        },
    },
});

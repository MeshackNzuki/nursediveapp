import { defineStore } from "pinia";
import axios from "axios";
import router from "../router";
import { useAuthStore } from "./authStore";

type Question = {
    id: number;
    question: string;
    type: any;
    options: Record<string, { choice: string; reason: string }>;
    correct_answer?: string | string[];
};

const tryParseJson = (value: string) => {
    try {
        return JSON.parse(value);
    } catch {
        return undefined;
    }
};

const normalizeObject = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeObject(item));
    }

    if (value && typeof value === "object") {
        return Object.keys(value as Record<string, unknown>)
            .sort()
            .reduce(
                (acc, key) => {
                    acc[key] = normalizeObject(
                        (value as Record<string, unknown>)[key],
                    );
                    return acc;
                },
                {} as Record<string, unknown>,
            );
    }

    return value;
};

const stableStringify = (value: unknown): string =>
    JSON.stringify(normalizeObject(value));

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
        return [stableStringify(answer)];
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

export const useNursingExamStore = defineStore("useNursingExamStore", {
    persist: true,
    state: () => ({
        // exam: null as null | { id: number; title: string; description: string },
        storeName: "nursing",
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
        nursing_exam_date: "" as string | null,
        dashdata: null,

        // Essentials
        exams: null,

        no_of_qns_before_paywall: 10,

        show_paywall: false,

        is_current_exam_full_length: true,
        //RN Test Bank subjects
        ati_examsubjects_rn_exams_testbank: null,
        hesi_examsubjects_rn_exams_testbank: null,
        regular_examsubjects_rn_exams_testbank: null,
        certification_examsubjects_rn_exams_testbank: null,

        //PN Test Bank subjects
        ati_examsubjects_pn_exams_testbank: null,
        hesi_examsubjects_pn_exams_testbank: null,
        regular_examsubjects_pn_exams_testbank: null,

        //RN Exit Exams
        ati_examTopics_rn_exit_exams: null,
        hesi_examTopics_rn_exit_exams: null,

        //PN Exit Exams
        ati_examTopics_pn_exit_exams: null,
        hesi_examTopics_pn_exit_exams: null,
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
            this.reset();
            this.exam = payload.exam;
            this.questions = payload.questions;
            this.answers = {}; // reset previous answers
            this.currentIndex = 0;
            this.is_current_exam_full_length = payload.is_exam_full_length;
        },
        loadAttempt(payload: {
            exam: { id: number; title: string; description: string };
            questions: Question[];
            answers: Record<number, string | string[]>;
            results: Record<
                number,
                { correct: boolean; selected: string | string[] }
            >;

            suspend_index?: number;
            is_exam_full_length: boolean;
        }) {
            this.reset();
            this.exam = payload.exam;
            this.questions = payload.questions;
            this.answers = payload.answers;
            this.results = payload.results;
            this.is_current_exam_full_length = payload.is_exam_full_length;
            this.currentIndex = payload.suspend_index || 0;
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
                if (
                    this.currentIndex + 1 >= this.no_of_qns_before_paywall &&
                    !this.is_current_exam_full_length
                ) {
                    this.show_paywall = true;
                    return;
                }
                //not active but exam has more than 180, show just 40
                const { active } = useAuthStore();

                if (!active("nursing")) {
                    if (this.questions.length > 100) {
                        if (this.currentIndex > 50) {
                            this.show_paywall = true;
                        }
                    }
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
            this.show_paywall = false;
            this.is_current_exam_full_length = true;
            this.timeTaken = 0;
            //this.testMode = "exam";
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
                router.push("/nursing/");
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
            await axios.post("/nursing/exam-attempts", payload).then((res) => {
                this.reset();
                router.push(`/nursing/performance-report/${res.data.data.id}`);
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
            axios
                .get("nursing/exam-subjects/ati-1691653441")
                .then((response) => {
                    this.ati_examsubjects_rn_exams_testbank =
                        response.data?.data.exams;
                })
                .catch((error) => {
                    console.error("Error fetching RN exam subjects:", error);
                });
            axios
                .get("nursing/exam-subjects/hesi-1691653451")
                .then((response) => {
                    this.hesi_examsubjects_rn_exams_testbank =
                        response.data?.data.exams;
                })
                .catch((error) => {
                    console.error("Error fetching RN exam subjects:", error);
                });
            axios
                .get("nursing/exam-subjects/regular-1721650690")
                .then((response) => {
                    this.regular_examsubjects_rn_exams_testbank =
                        response.data?.data.exams;
                })
                .catch((error) => {
                    console.error("Error fetching RN exam subjects:", error);
                });

            axios
                .get("nursing/exam-subjects/certification-1721650690")
                .then((response) => {
                    this.certification_examsubjects_rn_exams_testbank =
                        response.data?.data.exams;
                })
                .catch((error) => {
                    console.error("Error fetching RN exam subjects:", error);
                });
            //-----

            axios
                .get("nursing/exam-subjects/ati-1691653469")
                .then((response) => {
                    this.ati_examsubjects_pn_exams_testbank =
                        response.data?.data.exams;
                })
                .catch((error) => {
                    console.error("Error fetching PN exam subjects:", error);
                });
            axios
                .get("nursing/exam-subjects/hesi-1691653482")
                .then((response) => {
                    this.hesi_examsubjects_pn_exams_testbank =
                        response.data?.data.exams;
                })
                .catch((error) => {
                    console.error("Error fetching PN exam subjects:", error);
                });

            axios
                .get("nursing/exam-subjects/regular-1737464378")
                .then((response) => {
                    this.regular_examsubjects_pn_exams_testbank =
                        response.data?.data.exams;
                })
                .catch((error) => {
                    console.error("Error fetching PN exam subjects:", error);
                });
            //-----
            axios
                .get("nursing/exam-subtopics-per-subject/ati-1699951389")
                .then((response) => {
                    this.ati_examTopics_rn_exit_exams =
                        response.data?.data.subtopics;
                })
                .catch((error) => {
                    console.error(
                        "Error fetching RN exit exam subjects:",
                        error,
                    );
                });
            axios
                .get("nursing/exam-subtopics-per-subject/hesi-1699951565")
                .then((response) => {
                    this.hesi_examTopics_rn_exit_exams =
                        response.data?.data.subtopics;
                })
                .catch((error) => {
                    console.error(
                        "Error fetching RN exit exam subjects:",
                        error,
                    );
                });

            //---
            axios
                .get("nursing/exam-subtopics-per-subject/ati-1699951576")
                .then((response) => {
                    this.ati_examTopics_pn_exit_exams =
                        response.data?.data.subtopics;
                })
                .catch((error) => {
                    console.error(
                        "Error fetching PN exit exam subjects:",
                        error,
                    );
                });
            axios
                .get("nursing/exam-subtopics-per-subject/hesi-1699951409")
                .then((response) => {
                    this.hesi_examTopics_pn_exit_exams =
                        response.data?.data.subtopics;
                })
                .catch((error) => {
                    console.error(
                        "Error fetching PN exit exam subjects:",
                        error,
                    );
                });
            axios.get("/exam-dates?product_code=nursing").then((response) => {
                if (response.data.data?.date) {
                    this.nursing_exam_date = new Date(response.data.data.date)
                        .toISOString()
                        .split("T")[0];
                }
            });
            axios.get("nursing/dashdata").then((response) => {
                this.dashdata = response.data.data;
            });
        },
    },
});

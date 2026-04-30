import { defineStore } from "pinia";
import axios from "axios";
import router from "../router";

type Question = {
    id: number;
    question: string;
    subject_id?: number;
    difficulty?: number;
    [key: string]: any;
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
        if (parsed !== undefined) {
            return normalizeAnswer(parsed);
        }
        return [answer];
    }
    if (Array.isArray(answer)) {
        return answer.map((item) => String(item));
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

export const useCatExamStore = defineStore("useCatExamStore", {
    persist: true,
    state: () => ({
        storeName: "cat",
        exam: null as any | { id: number; title: string; description: string },
        questions: [] as Array<Question>,
        questionPool: [] as Array<Question>, // All available questions grouped by subject
        subjectQuestionMap: {} as Record<number, Question[]>,
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

        // CAT-specific state
        theta: 0, // Ability estimate (starts at 0 = neutral difficulty)
        currentLevel: 1, // 1-4 scale (1 easy, 4 advanced)
        currentSubject: 1, // Start with subject 1
        questionsAsked: 0,
        correctAnswers: 0,
        subjectScores: {} as Record<number, { correct: number; total: number }>,
        usedQuestionIds: new Set<number>(), // Track used questions to avoid repetition

        // CAT-specific passing rule
        requiredCorrectPerSubject: 5,

        // Stopping rules
        maxQuestions: 150,
        minQuestionsBeforeStop: 80,
        passThreshold: 65,
        canStopExam: false,
    }),

    getters: {
        currentQuestion: (state) => state.questions[state.currentIndex] || null,
        isLastQuestion: (state) =>
            state.currentIndex === state.questions.length - 1 ||
            state.questionsAsked >= state.maxQuestions,
        isFirstQuestion: (state) => state.currentIndex === 0,
        timerDisplay(): string {
            const minutes = Math.floor(this.timeTaken / 60)
                .toString()
                .padStart(2, "0");
            const seconds = (this.timeTaken % 60).toString().padStart(2, "0");
            return `${minutes}:${seconds}`;
        },
        currentScore(): number {
            if (this.questionsAsked === 0) return 0;
            return (this.correctAnswers / this.questionsAsked) * 100;
        },
        currentDifficulty(): number {
            const level = Math.min(Math.max(this.currentLevel, 1), 4);
            return Math.round(((level - 1) / 3) * 100);
        },
        shouldStopExam(): boolean {
            if (this.questionsAsked < this.minQuestionsBeforeStop) return false;
            if (this.questionsAsked >= this.maxQuestions) return true;
            // Can stop if we have enough confidence in the score
            return this.canStopExam;
        },
    },

    actions: {
        setExamData(payload: { exam: object; questions: Question[] }) {
            this.exam = payload.exam;
            this.questionPool = payload.questions;
            this.buildSubjectMap();
            this.answers = {};
            this.currentIndex = 0;
            this.questionsAsked = 0;
            this.correctAnswers = 0;
            this.theta = 0;
            this.currentLevel = 1;
            this.subjectScores = {};
            this.usedQuestionIds = new Set();

            // start on easiest from the first subject (if available)
            const firstSubject = this.questionPool[0]?.subject_id || 1;
            this.currentSubject = firstSubject;
            this.currentLevel = 1;

            // Start with first adaptive question
            this.selectNextQuestion();
        },

        buildSubjectMap() {
            this.subjectQuestionMap = {};
            for (const question of this.questionPool) {
                const subjectId = question.subject_id || 0;
                if (!this.subjectQuestionMap[subjectId]) {
                    this.subjectQuestionMap[subjectId] = [];
                }
                this.subjectQuestionMap[subjectId].push(question);
            }
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
        }) {
            this.exam = payload.exam;
            this.questions = payload.questions;
            this.answers = payload.answers;
            this.results = payload.results;
            this.testMode = payload.mode;
            this.currentIndex = 0;
        },

        setMode(mode: "exam" | "review" | "tutor") {
            this.testMode = mode;
        },

        /**
         * Select next question based on Item Response Theory
         * Difficulty is adjusted based on previous answer
         */
        selectNextQuestion() {
            // If we have a current question, score the user's answer before picking the next one
            const previousQuestion = this.currentQuestion;
            if (previousQuestion) {
                const userAnswer = this.answers[previousQuestion.id];
                const isCorrect = areAnswersEqual(
                    userAnswer,
                    previousQuestion.correct_answer,
                );

                this.results[previousQuestion.id] = {
                    correct: isCorrect,
                    selected: userAnswer,
                };

                if (isCorrect) {
                    this.correctAnswers++;
                    this.theta += 0.25;
                    this.currentLevel = Math.min(4, this.currentLevel + 1);
                } else {
                    this.theta -= 0.25;
                    this.currentLevel = Math.max(1, this.currentLevel - 1);
                }
                this.questionsAsked++;
                this.updateSubjectScore(previousQuestion);
            }

            // Select subject and level in 1-4 scale (pseudo-IRT style)
            const targetLevel = this.currentLevel;
            const subject = this.currentSubject;

            // Preferred candidates in current subject, close level +/-1
            let candidates = this.questionPool.filter(
                (q) =>
                    !this.usedQuestionIds.has(q.id) &&
                    q.subject_id === subject &&
                    (q.level_id || q.difficulty) !== undefined &&
                    Math.abs(
                        (q.level_id ?? q.difficulty ?? targetLevel) -
                            targetLevel,
                    ) <= 1,
            );

            if (!candidates.length) {
                // Expand to subject same level tolerance +/-2
                candidates = this.questionPool.filter(
                    (q) =>
                        !this.usedQuestionIds.has(q.id) &&
                        q.subject_id === subject &&
                        (q.level_id || q.difficulty) !== undefined &&
                        Math.abs(
                            (q.level_id ?? q.difficulty ?? targetLevel) -
                                targetLevel,
                        ) <= 2,
                );
            }

            let nextQuestion: Question | null = null;
            if (candidates.length > 0) {
                // pick random among top 5
                nextQuestion =
                    candidates[
                        Math.floor(
                            Math.random() * Math.min(5, candidates.length),
                        )
                    ];
            } else {
                // Fallback: any unused question across subjects.
                const unused = this.questionPool.filter(
                    (q) => !this.usedQuestionIds.has(q.id),
                );
                if (unused.length > 0) {
                    // Prefer subject rotation
                    const rotated = unused.find(
                        (q) => q.subject_id === subject,
                    );
                    nextQuestion = rotated || unused[0];
                }
            }

            if (nextQuestion) {
                this.usedQuestionIds.add(nextQuestion.id);
                this.questions.push(nextQuestion);
                this.currentIndex = this.questions.length - 1;

                // rotate subjects to ensure each pool is exercised
                this.currentSubject = this.getNextSubject();
            }

            // Check stopping rule
            this.evaluateStoppingRule();
        },

        updateSubjectScore(question?: Question) {
            const questionToScore = question || this.currentQuestion;
            if (!questionToScore) return;
            const subject = questionToScore.subject_id || 0;
            if (!this.subjectScores[subject]) {
                this.subjectScores[subject] = { correct: 0, total: 0 };
            }
            this.subjectScores[subject].total++;
            if (this.results[questionToScore.id]?.correct) {
                this.subjectScores[subject].correct++;
            }
        },

        getNextSubject() {
            const subjectIds = Object.keys(this.subjectQuestionMap)
                .map(Number)
                .sort((a, b) => a - b);
            if (subjectIds.length === 0) return 1;
            const currentIndex = subjectIds.indexOf(this.currentSubject);
            if (currentIndex === -1) return subjectIds[0];
            return subjectIds[(currentIndex + 1) % subjectIds.length];
        },

        hasPassedAllSubjects() {
            const subjectIds = Object.keys(this.subjectQuestionMap).map(Number);
            if (subjectIds.length === 0) return false;
            return subjectIds.every((subjectId) => {
                const score = this.subjectScores[subjectId];
                return score?.correct >= this.requiredCorrectPerSubject;
            });
        },

        /**
         * CAT Stopping Rules:
         * - After 80 questions: if score >= 65%, can stop
         * - At 150 questions: must stop regardless
         */
        evaluateStoppingRule() {
            // by 85 questions the user must have passed all subject pools with required correct answers
            if (this.questionsAsked >= 85 && this.hasPassedAllSubjects()) {
                this.canStopExam = true;
                return;
            }

            // traditional quick decision after min questions
            if (this.questionsAsked >= this.minQuestionsBeforeStop) {
                const currentScore = this.currentScore;
                if (
                    (currentScore >= this.passThreshold &&
                        this.questionsAsked >= this.minQuestionsBeforeStop) ||
                    (currentScore < this.passThreshold - 10 &&
                        this.questionsAsked >= this.minQuestionsBeforeStop)
                ) {
                    this.canStopExam = true;
                }
            }

            if (this.questionsAsked >= this.maxQuestions) {
                this.canStopExam = true;
            }
        },

        answerQuestion(questionId: number, answer: string | string[]) {
            this.answers[questionId] = answer;
        },

        answerQuestionNotes(questionId: number, notes: string | string[]) {
            this.notes[questionId] = notes;
        },

        next() {
            if (this.testMode === "review") {
                if (this.isLastQuestion || this.shouldStopExam) {
                    this.submitResults();
                    return;
                }

                this.currentIndex++;
                return;
            }

            if (this.shouldStopExam) {
                this.submitResults();
                return;
            }

            this.selectNextQuestion();
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
            this.questionsAsked = 0;
            this.correctAnswers = 0;
            this.theta = 0;
            this.currentLevel = 1;
            this.subjectScores = {};
            this.usedQuestionIds = new Set();
            this.canStopExam = false;
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
            const total = this.questionsAsked || this.questions.length;
            const correct = this.correctAnswers;
            const score = total > 0 ? (correct / total) * 100 : 0;

            const payload = {
                sub_topic_id: this.exam?.id,
                answers: JSON.stringify(this.answers),
                results: JSON.stringify(this.results),
                score,
                mode: this.testMode,
                suspend_index: this.questionsAsked,
                completed: this.questionsAsked > 0,
                completed_at: new Date().toISOString(),
                time_taken: this.timeTaken,
                is_adaptive: true,
                subject_scores: JSON.stringify(this.subjectScores),
                sections: JSON.stringify(this.subjectScores),
                theta: this.theta,
                final_difficulty: this.currentDifficulty,
                final_level: this.currentLevel,
            };

            this.testMode = "exam";
            try {
                const res = await axios.post("/nclex/cat-attempts", payload);
                this.reset();
                router.push(`/nclex/adaptive-report/${res.data.data.id}`);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 429) {
                    const message =
                        error.response?.data?.error ||
                        "You can only take the CAT exam 3 times per month.";
                    window.alert(message);
                    this.reset();
                    router.push("/nclex/cat");
                    return;
                }

                console.error("Failed to submit CAT attempt:", error);
            }
        },

        startTimer() {
            if (this.timer) return;
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
    },
});

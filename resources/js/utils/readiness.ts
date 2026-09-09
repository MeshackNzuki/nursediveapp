/**
 * Shared readiness model used by the Pass Probability card, the Performance
 * Analysis page and the Performance Report, so every surface agrees.
 *
 * All score arrays are expected NEWEST-FIRST unless stated otherwise.
 */

export interface ReadinessEstimate {
    probability: number;
    confidence: number;
    recentAverage: number;
    averageScore: number;
    trendDelta: number;
}

export const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export const average = (values: number[]) =>
    values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;

export const estimateReadiness = (scores: number[], passMark: number): ReadinessEstimate => {
    if (!scores.length) return { probability: 0, confidence: 0, recentAverage: 0, averageScore: 0, trendDelta: 0 };

    const recent = scores.slice(0, 10);
    const averageScore = Math.round(average(scores));
    const recentAverage = Math.round(average(recent));

    const head = recent.slice(0, 3);
    const tail = recent.slice(3, 6);
    // With fewer than 6 attempts, compare the latest to the rest so new learners still get a signal.
    const trendDelta =
        head.length >= 2 && tail.length >= 2
            ? Math.round(average(head) - average(tail))
            : recent.length >= 2
                ? Math.round(recent[0] - average(recent.slice(1)))
                : 0;

    const avg = average(recent);
    const stddev = Math.sqrt(average(recent.map((s) => Math.pow(s - avg, 2))));
    const sampleStrength = Math.min(recent.length / 6, 1) * 35;
    const confidence = Math.round(clamp(45 + sampleStrength - stddev * 1.25, 25, 96));

    const scoreSignal = recentAverage * 0.65 + averageScore * 0.35;
    const readiness = clamp(scoreSignal + clamp(trendDelta, -10, 10) * 0.8 + (confidence - 70) * 0.12);
    const p = 1 / (1 + Math.exp(-(readiness - passMark) / 6));

    return {
        probability: Number.isNaN(p) ? 0 : Math.round(p * 100),
        confidence,
        recentAverage,
        averageScore,
        trendDelta,
    };
};

/** Probability after each of the last `points` attempts, oldest -> newest. */
export const readinessTrajectory = (scoresNewestFirst: number[], passMark: number, points = 8) => {
    const chronological = [...scoresNewestFirst].reverse();
    const out: number[] = [];
    const start = Math.max(1, chronological.length - (points - 1));
    for (let n = start; n <= chronological.length; n += 1) {
        out.push(estimateReadiness(chronological.slice(0, n).reverse(), passMark).probability);
    }
    return out;
};

/** Likely range around the estimate; wider when confidence is low. */
export const likelyRange = (probability: number, confidence: number) => {
    const half = Math.round(clamp((100 - confidence) / 3.2, 3, 22));
    return { low: clamp(probability - half), high: clamp(probability + half), half };
};

export const readinessBand = (probability: number) => {
    if (probability < 45) return "Needs reps";
    if (probability < 70) return "Building";
    if (probability < 86) return "On track";
    return "Exam ready";
};

export const scoreToneClass = (score: number, passMark: number) => {
    if (score >= passMark) return "text-emerald-600 dark:text-emerald-300";
    if (score >= passMark - 15) return "text-amber-600 dark:text-amber-300";
    return "text-rose-600 dark:text-rose-300";
};

export const scoreBarClass = (score: number, passMark: number) => {
    if (score >= passMark) return "bg-emerald-500";
    if (score >= passMark - 15) return "bg-amber-500";
    return "bg-rose-500";
};

export const scorePillClass = (score: number, passMark: number) => {
    if (score >= passMark) return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200";
    if (score >= passMark - 15) return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200";
    return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200";
};

export const relativeTime = (timestamp: number) => {
    if (!timestamp) return "";
    const days = Math.floor((Date.now() - timestamp) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "1d ago";
    if (days < 30) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

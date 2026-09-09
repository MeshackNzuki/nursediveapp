import { computed, reactive, readonly } from "vue";

/**
 * A single app-wide focus session (Pomodoro style). State lives in localStorage
 * so it survives navigation into an exam and back, and a module-level ticker
 * keeps `remainingSeconds` live for every consumer.
 */

export interface FocusSession {
    startedAt: number;
    minutes: number;
    label: string;
    route: string;
    product: string;
    completedAt: number | null;
    dismissed: boolean;
}

const STORAGE_KEY = "nursenex_focus_session";

const state = reactive<{ session: FocusSession | null; now: number }>({
    session: null,
    now: Date.now(),
});

let ticker: ReturnType<typeof setInterval> | null = null;

const load = () => {
    if (typeof window === "undefined") return;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        state.session = raw ? (JSON.parse(raw) as FocusSession) : null;
    } catch {
        state.session = null;
    }
};

const persist = () => {
    if (typeof window === "undefined") return;
    try {
        if (state.session) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.session));
        } else {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    } catch {
        // Storage unavailable; keep the in-memory session.
    }
};

const ensureTicker = () => {
    if (ticker || typeof window === "undefined") return;
    ticker = setInterval(() => {
        state.now = Date.now();
        const s = state.session;
        if (s && !s.completedAt && state.now >= s.startedAt + s.minutes * 60000) {
            s.completedAt = state.now;
            persist();
        }
    }, 1000);
};

load();
ensureTicker();

const toDayKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function useFocusSession() {
    const session = computed(() => state.session);
    const isActive = computed(() => !!state.session && !state.session.completedAt);
    const isCompleted = computed(() => !!state.session?.completedAt);
    const isVisible = computed(() => !!state.session && !state.session.dismissed);

    const totalSeconds = computed(() => (state.session ? state.session.minutes * 60 : 0));
    const remainingSeconds = computed(() => {
        const s = state.session;
        if (!s) return 0;
        const end = s.startedAt + s.minutes * 60000;
        return Math.max(0, Math.ceil((end - state.now) / 1000));
    });
    const progress = computed(() =>
        totalSeconds.value ? Math.min(100, Math.round(((totalSeconds.value - remainingSeconds.value) / totalSeconds.value) * 100)) : 0,
    );
    const remainingLabel = computed(() => {
        const m = Math.floor(remainingSeconds.value / 60);
        const sec = remainingSeconds.value % 60;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    });

    const completedToday = (product?: string) => {
        const s = state.session;
        if (!s?.completedAt) return false;
        if (product && s.product !== product) return false;
        return toDayKey(new Date(s.completedAt)) === toDayKey(new Date());
    };

    const start = (options: { minutes: number; label: string; route: string; product: string }) => {
        state.session = {
            startedAt: Date.now(),
            minutes: Math.max(1, options.minutes),
            label: options.label,
            route: options.route,
            product: options.product,
            completedAt: null,
            dismissed: false,
        };
        state.now = Date.now();
        persist();
        ensureTicker();
    };

    const end = () => {
        state.session = null;
        persist();
    };

    const dismiss = () => {
        if (!state.session) return;
        state.session.dismissed = true;
        persist();
    };

    return {
        session: readonly(session),
        isActive,
        isCompleted,
        isVisible,
        remainingSeconds,
        remainingLabel,
        progress,
        completedToday,
        start,
        end,
        dismiss,
    };
}

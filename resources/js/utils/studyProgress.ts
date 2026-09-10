import { reactive } from "vue";
import { useAuthStore } from "../stores/authStore";

/**
 * Tracks which study lessons a learner has opened, per product, in localStorage.
 * Used by the chapter pages to show "read" ticks and a progress bar.
 */

const state = reactive<{ loaded: Record<string, Set<string>> }>({ loaded: {} });

const storageKey = (product: string) => {
    const user = useAuthStore().user as any;
    const uid = user?.id || user?.email || "guest";
    return `nursenex_study_${uid}_${product}`;
};

const load = (product: string) => {
    if (state.loaded[product]) return state.loaded[product];
    let set = new Set<string>();
    try {
        const raw = window.localStorage.getItem(storageKey(product));
        if (raw) set = new Set(JSON.parse(raw) as string[]);
    } catch {
        set = new Set();
    }
    state.loaded[product] = set;
    return set;
};

const persist = (product: string) => {
    try {
        window.localStorage.setItem(storageKey(product), JSON.stringify([...load(product)]));
    } catch {
        // ignore storage failures
    }
};

export function useStudyProgress(product: string) {
    const readSet = () => load(product);

    const isRead = (key: string | number) => readSet().has(String(key));

    const markRead = (key: string | number) => {
        const set = readSet();
        if (set.has(String(key))) return;
        // replace the Set so reactivity picks up the change
        state.loaded[product] = new Set([...set, String(key)]);
        persist(product);
    };

    const readCount = (keys: Array<string | number>) => keys.filter((k) => isRead(k)).length;

    return { isRead, markRead, readCount };
}

<template>
    <section class="dash-search" :class="{ 'dash-search--active': isActive }" role="search" @keydown="onKeydown">
        <div class="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-60" aria-hidden="true"></div>

        <div class="relative flex items-start justify-between gap-4">
            <div class="min-w-0">
                <p class="dash-eyebrow theme-text">Find practice</p>
                <h2 class="dash-title mt-1">{{ title }}</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">{{ subtitle }}</p>
            </div>
            <span class="dash-icon-tile theme-icon dash-search-badge relative h-11 w-11 shrink-0"><i class="pi pi-search text-base"></i><span v-if="showNudge" class="theme-dot absolute -top-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white dark:ring-sky-900"></span></span>
        </div>

        <!-- One-time nudge: anchored to the search, never a blocking popup -->
        <Transition name="ui-fade-slide">
            <div v-if="showNudge" class="dash-search-nudge ui-pop" role="status">
                <span class="dash-icon-tile h-9 w-9 shrink-0 bg-white/20 text-white"><i class="pi pi-sparkles"></i></span>
                <div class="min-w-0 flex-1">
                    <p class="text-sm font-extrabold leading-tight">Find any exam in seconds</p>
                    <p class="mt-0.5 text-xs opacity-90">Type a topic like “{{ nudgeExample }}” and jump straight into tutor or exam mode. Press <kbd class="dash-search-kbd border-white/30 bg-white/15 text-white">/</kbd> anywhere to search.</p>
                </div>
                <div class="flex shrink-0 items-center gap-1.5">
                    <button type="button" class="dash-btn bg-white px-3 py-1.5 text-[11px] text-slate-900 shadow-none" @click="tryNudge">Try it</button>
                    <button type="button" class="rounded-full p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Dismiss" @click="dismissNudge"><i class="pi pi-times text-[10px]"></i></button>
                </div>
            </div>
        </Transition>

        <!-- Input -->
        <div class="theme-ring-gradient dash-search-ring relative mt-4 rounded-full p-[2px]">
            <div class="relative flex items-center rounded-full bg-white dark:bg-sky-950">
                <i class="pi pi-search pointer-events-none absolute left-4 text-sm theme-text"></i>
                <input ref="inputRef" v-model="query" type="text" enterkeyhint="search" autocomplete="off" spellcheck="false"
                    :placeholder="placeholder" :aria-label="placeholder" aria-autocomplete="list" :aria-expanded="showResults"
                    class="w-full rounded-full bg-transparent py-3 pr-28 pl-11 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base dark:text-slate-100 dark:placeholder:text-slate-500"
                    @focus="isFocused = true" @blur="isFocused = false" />
                <div class="absolute right-2 flex items-center gap-1.5">
                    <i v-if="loading" class="pi pi-spin pi-spinner text-xs text-slate-400"></i>
                    <button v-if="query" type="button" class="dash-btn-ghost h-8 w-8 rounded-full p-0" aria-label="Clear search" @mousedown.prevent @click="clear">
                        <i class="pi pi-times text-[10px]"></i>
                    </button>
                    <kbd v-else class="dash-search-kbd hidden sm:inline-flex">/</kbd>
                </div>
            </div>
        </div>

        <!-- Suggestions (idle) -->
        <div v-if="!showResults && suggestions.length" class="relative mt-3 flex flex-wrap items-center gap-1.5">
            <span class="text-[11px] font-bold uppercase tracking-wide text-slate-400">Try</span>
            <button v-for="s in suggestions" :key="s" type="button" class="dash-chip theme-soft theme-focus px-2.5 py-1 text-[11px]" @click="applySuggestion(s)">
                {{ s }}
            </button>
        </div>
        <p v-else-if="!showResults" class="relative mt-2 text-[11px] text-slate-400">Type at least {{ minLength }} letters to search.</p>

        <!-- Results: rendered in normal flow so nothing clips them -->
        <Transition name="ui-fade-slide">
            <div v-if="showResults" class="relative mt-4" role="listbox" :aria-label="`Results for ${query}`">
                <div v-if="flatResults.length" class="dash-card-white max-h-[26rem] overflow-y-auto p-2">
                    <div v-for="group in groups" :key="group.key" class="mb-2 last:mb-0">
                        <p class="flex items-center justify-between px-2 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            <span><i :class="group.icon" class="mr-1 text-[9px]"></i>{{ group.label }}</span>
                            <span class="tabular-nums">{{ group.items.length }}</span>
                        </p>
                        <button v-for="item in group.items" :key="`${group.key}-${item.id}`" type="button"
                            class="dash-search-row group" :class="{ 'dash-search-row--active': activeIndex === flatIndex(group.key, item) }"
                            role="option" :aria-selected="activeIndex === flatIndex(group.key, item)"
                            @mouseenter="activeIndex = flatIndex(group.key, item)" @click="choose(group.key, item)">
                            <span class="dash-icon-tile h-8 w-8 shrink-0 text-xs" :class="group.tile"><i :class="group.rowIcon"></i></span>
                            <span class="min-w-0 flex-1">
                                <span class="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100" v-html="highlight(item.name)"></span>
                                <span v-if="item.meta" class="block truncate text-[11px] text-slate-500 dark:text-slate-400">{{ item.meta }}</span>
                            </span>
                            <span class="hidden shrink-0 items-center gap-1 text-[11px] font-bold sm:inline-flex" :class="group.ink">
                                {{ group.cta }} <i class="pi pi-arrow-right text-[9px] transition-transform group-hover:translate-x-0.5"></i>
                            </span>
                        </button>
                    </div>
                </div>
                <div v-else-if="loading" class="dash-card-white flex items-center gap-3 p-4 text-sm text-slate-500 dark:text-slate-300">
                    <i class="pi pi-spin pi-spinner"></i> Searching for “{{ query }}”...
                </div>
                <div v-else class="dash-card-white flex flex-col items-start gap-2 p-4">
                    <p class="text-sm font-bold text-slate-800 dark:text-slate-100">No matches for “{{ query }}”</p>
                    <p class="text-xs text-slate-500 dark:text-slate-300">Try a shorter keyword, or jump straight in:</p>
                    <div class="flex flex-wrap gap-1.5">
                        <button v-for="s in suggestions" :key="s" type="button" class="dash-chip theme-soft theme-focus px-2.5 py-1 text-[11px]" @click="applySuggestion(s)">{{ s }}</button>
                    </div>
                </div>
                <p v-if="flatResults.length" class="mt-2 hidden text-[11px] text-slate-400 sm:block">
                    <kbd class="dash-search-kbd">↑</kbd> <kbd class="dash-search-kbd">↓</kbd> to move · <kbd class="dash-search-kbd">Enter</kbd> to open · <kbd class="dash-search-kbd">Esc</kbd> to clear
                </p>
            </div>
        </Transition>
    </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

export type SearchItem = { id: number | string; name: string; meta?: string; slug?: string; [key: string]: unknown };
export type SearchGroupDef = {
    key: string;
    label: string;
    cta: string;
    icon: string;
    rowIcon: string;
    tile: string;
    ink: string;
    /** Local items filtered by name (client side). */
    items?: SearchItem[];
    /** Remote fetcher: called (debounced) with the query. */
    fetch?: (query: string) => Promise<SearchItem[]>;
};

const props = withDefaults(
    defineProps<{
        groups: SearchGroupDef[];
        title?: string;
        subtitle?: string;
        placeholder?: string;
        suggestions?: string[];
        minLength?: number;
        /** When set, shows a one-time coach mark (per browser) keyed by this string. */
        nudgeKey?: string;
    }>(),
    {
        title: "What do you want to practise?",
        subtitle: "Search topics, exam sets, and study material without leaving the dashboard.",
        placeholder: "Search exams or topics...",
        suggestions: () => [],
        minLength: 3,
        nudgeKey: "",
    },
);

const emit = defineEmits<{ (e: "select", payload: { group: string; item: SearchItem }): void }>();

const inputRef = ref<HTMLInputElement | null>(null);
const query = ref("");
const isFocused = ref(false);
const loading = ref(false);
const activeIndex = ref(0);
const remote = ref<Record<string, SearchItem[]>>({});

const term = computed(() => query.value.trim().toLowerCase());
const showResults = computed(() => term.value.length >= props.minLength);
const isActive = computed(() => isFocused.value || showResults.value);

const groups = computed(() =>
    props.groups
        .map((g) => ({
            ...g,
            items: showResults.value
                ? (g.fetch ? remote.value[g.key] || [] : (g.items || []).filter((i) => i.name.toLowerCase().includes(term.value))).slice(0, 12)
                : [],
        }))
        .filter((g) => g.items.length > 0),
);
const flatResults = computed(() => groups.value.flatMap((g) => g.items.map((item) => ({ group: g.key, item }))));
const flatIndex = (group: string, item: SearchItem) => flatResults.value.findIndex((r) => r.group === group && r.item.id === item.id);

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
const highlight = (name: string) => {
    const safe = escapeHtml(name);
    if (!term.value) return safe;
    const re = new RegExp(`(${term.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    return safe.replace(re, '<mark class="dash-search-mark">$1</mark>');
};

let timer: ReturnType<typeof setTimeout> | null = null;
let requestId = 0;
watch(term, (value) => {
    activeIndex.value = 0;
    if (timer) clearTimeout(timer);
    const fetchers = props.groups.filter((g) => g.fetch);
    if (value.length < props.minLength || fetchers.length === 0) {
        remote.value = {};
        loading.value = false;
        return;
    }
    loading.value = true;
    const id = ++requestId;
    timer = setTimeout(async () => {
        const results = await Promise.all(fetchers.map((g) => g.fetch!(value).catch(() => [] as SearchItem[])));
        if (id !== requestId) return;
        remote.value = Object.fromEntries(fetchers.map((g, i) => [g.key, results[i]]));
        loading.value = false;
    }, 220);
});

/* ---- One-time nudge ---- */
const NUDGE_PREFIX = "nx_search_nudge_";
const showNudge = ref(false);
const nudgeExample = computed(() => props.suggestions[0] || "pharmacology");
const readNudge = () => {
    try {
        return props.nudgeKey ? localStorage.getItem(NUDGE_PREFIX + props.nudgeKey) : "1";
    } catch {
        return "1";
    }
};
const dismissNudge = () => {
    showNudge.value = false;
    try {
        if (props.nudgeKey) localStorage.setItem(NUDGE_PREFIX + props.nudgeKey, String(Date.now()));
    } catch {
        /* storage unavailable */
    }
};
const tryNudge = () => {
    dismissNudge();
    inputRef.value?.focus();
};
let nudgeTimer: ReturnType<typeof setTimeout> | null = null;
watch(isFocused, (focused) => {
    if (focused && showNudge.value) dismissNudge();
});

const clear = () => {
    query.value = "";
    remote.value = {};
    inputRef.value?.focus();
};
const applySuggestion = (s: string) => {
    query.value = s;
    inputRef.value?.focus();
};
const choose = (group: string, item: SearchItem) => {
    emit("select", { group, item });
    query.value = "";
    remote.value = {};
};

const onKeydown = (event: KeyboardEvent) => {
    if (!showResults.value) {
        if (event.key === "Escape") clear();
        return;
    }
    const count = flatResults.value.length;
    if (event.key === "ArrowDown" && count) {
        event.preventDefault();
        activeIndex.value = (activeIndex.value + 1) % count;
    } else if (event.key === "ArrowUp" && count) {
        event.preventDefault();
        activeIndex.value = (activeIndex.value - 1 + count) % count;
    } else if (event.key === "Enter" && count) {
        event.preventDefault();
        const hit = flatResults.value[activeIndex.value];
        if (hit) choose(hit.group, hit.item);
    } else if (event.key === "Escape") {
        clear();
    }
};

// "/" anywhere on the page focuses the search (unless typing elsewhere).
const onGlobalKey = (event: KeyboardEvent) => {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable) return;
    event.preventDefault();
    inputRef.value?.focus();
    inputRef.value?.scrollIntoView({ block: "center", behavior: "smooth" });
};
onMounted(() => {
    window.addEventListener("keydown", onGlobalKey);
    if (props.nudgeKey && !readNudge()) nudgeTimer = setTimeout(() => (showNudge.value = !isFocused.value && !query.value), 1400);
});
onBeforeUnmount(() => {
    window.removeEventListener("keydown", onGlobalKey);
    if (nudgeTimer) clearTimeout(nudgeTimer);
});

defineExpose({ focus: () => inputRef.value?.focus() });
</script>

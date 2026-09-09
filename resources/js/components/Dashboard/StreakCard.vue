<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { storeToRefs } from "pinia";

const props = defineProps<{
    productCode: string;
}>();

const { user } = storeToRefs(useAuthStore());
const streakDays = ref(1);

const toDayKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const streakKey = computed(() => {
    const uid = user.value?.id || user.value?.email || "guest";
    return `nursenex_streak_${uid}_${props.productCode}`;
});

const updateStreak = () => {
    if (typeof window === "undefined") return;

    const today = new Date();
    const todayKey = toDayKey(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = toDayKey(yesterday);

    let data: { lastVisit: string; streak: number } = {
        lastVisit: todayKey,
        streak: 1,
    };

    try {
        const cached = window.localStorage.getItem(streakKey.value);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed?.lastVisit === todayKey) {
                data = parsed;
            } else if (parsed?.lastVisit === yesterdayKey) {
                data = {
                    lastVisit: todayKey,
                    streak: Number(parsed?.streak || 0) + 1,
                };
            }
        }
    } catch {
        data = { lastVisit: todayKey, streak: 1 };
    }

    streakDays.value = Math.max(1, Number(data.streak || 1));

    try {
        window.localStorage.setItem(streakKey.value, JSON.stringify(data));
    } catch {
        // Ignore storage failures.
    }
};

const addTenorEmbedScript = () => {
    if (typeof document === "undefined") return;
    const script = document.createElement("script");
    script.src = "https://tenor.com/embed.js";
    script.async = true;
    script.setAttribute("data-tenor-embed", "1");
    document.body.appendChild(script);
};

const streakLabel = computed(() => {
    if (streakDays.value >= 14) return "Elite consistency";
    if (streakDays.value >= 7) return "Strong momentum";
    if (streakDays.value >= 3) return "Great rhythm";
    return "Great start";
});

const lastActivityText = computed(() => {
    const raw = user.value?.last_login || user.value?.updated_at || user.value?.created_at;
    if (!raw) return "No recent activity";

    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return "No recent activity";

    const diffMs = Date.now() - date.getTime();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diffMs < minute) return "Just now";
    if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
    if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
    if (diffMs < day * 7) return `${Math.floor(diffMs / day)}d ago`;
    return date.toLocaleDateString();
});

const weekStrip = computed(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, offset) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - offset));
        return {
            key: toDayKey(date),
            label: date.toLocaleDateString(undefined, { weekday: "narrow" }),
            active: 6 - offset < streakDays.value,
            today: offset === 6,
        };
    });
});

onMounted(() => {
    updateStreak();
    addTenorEmbedScript();
});
</script>

<template>
    <div class="dash-tile relative overflow-hidden border-orange-200 bg-orange-50/80 p-3 dark:border-orange-300/30 dark:bg-sky-900/50">
        <div class="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full bg-orange-300/40 blur-2xl dark:bg-orange-500/20"
            aria-hidden="true"></div>

        <div class="relative flex items-center gap-3">
            <div
                class="streak-gif relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-orange-200 bg-white dark:border-orange-300/30 dark:bg-sky-950">
                <span class="absolute inset-0 z-0 flex items-center justify-center text-lg">🔥</span>
                <div class="tenor-gif-embed relative z-10 h-full w-full" data-postid="23339431" data-share-method="host"
                    data-aspect-ratio="1" data-width="100%"></div>
            </div>
            <div class="min-w-0 flex-1">
                <p class="text-[11px] font-bold uppercase tracking-wide text-orange-700 dark:text-orange-300">
                    Study Streak
                </p>
                <p class="text-sm font-extrabold text-slate-900 dark:text-white">
                    <span class="text-lg tabular-nums">{{ streakDays }}</span> day<span v-if="streakDays > 1">s</span>
                    <span class="mx-1 text-slate-400">•</span>{{ streakLabel }}
                </p>
                <p class="text-xs text-slate-600 dark:text-slate-300">
                    Last activity {{ lastActivityText }}
                </p>
            </div>
        </div>

        <div class="relative mt-3 flex items-center justify-between gap-1" aria-label="Last seven days">
            <span v-for="day in weekStrip" :key="day.key" class="flex flex-1 flex-col items-center gap-1">
                <span class="h-2 w-full rounded-full transition-colors duration-300"
                    :class="day.active
                        ? 'bg-linear-to-r from-orange-500 to-amber-400'
                        : 'bg-orange-200/60 dark:bg-sky-800'"></span>
                <span class="text-[9px] font-bold uppercase"
                    :class="day.today ? 'text-orange-700 dark:text-orange-300' : 'text-slate-400'">
                    {{ day.label }}
                </span>
            </span>
        </div>
    </div>
</template>


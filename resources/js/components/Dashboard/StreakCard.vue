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
    return `nursedive_streak_${uid}_${props.productCode}`;
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

onMounted(() => {
    updateStreak();
    addTenorEmbedScript();
});
</script>

<template>
    <div class="rounded-2xl border border-orange-200 bg-orange-50/80 dark:bg-sky-900/50 dark:border-orange-300/30 p-3">
        <div class="flex items-center gap-3">
            <div class="relative h-12 w-12 rounded-xl overflow-hidden border border-orange-200 bg-white">
                <span class="absolute inset-0 flex items-center justify-center text-lg z-0">🔥</span>
                <div class="tenor-gif-embed relative z-10 h-full w-full" data-postid="23339431" data-share-method="host"
                    data-aspect-ratio="1" data-width="100%"></div>
            </div>
            <div class="min-w-0">
                <p class="text-[11px] uppercase tracking-wide text-orange-700 dark:text-orange-300 font-semibold">
                    Study Streak
                </p>
                <p class="text-sm font-bold text-slate-900 dark:text-white">
                    {{ streakDays }} day<span v-if="streakDays > 1">s</span> • {{ streakLabel }}
                </p>
                <p class="text-xs text-slate-600 dark:text-slate-300">
                    Last activity {{ lastActivityText }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.tenor-gif-embed) {
    pointer-events: none;
}

:deep(.tenor-gif-embed a) {
    display: none !important;
}
</style>

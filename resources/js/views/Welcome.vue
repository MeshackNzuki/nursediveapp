<template>
    <div
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 via-cyan-50/80 to-sky-100/70 p-4 md:p-6">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-24 h-[420px] w-[420px] rounded-full bg-gradient-to-r from-cyan-200/70 to-teal-200/60 blur-[110px]">
            </div>
            <div
                class="absolute top-16 -right-16 h-[360px] w-[360px] rounded-full bg-gradient-to-r from-sky-200/65 to-indigo-200/55 blur-[100px]">
            </div>
        </div>

        <div class="mx-auto flex h-full max-w-4xl items-center justify-center">
            <section
                class="w-full max-w-2xl rounded-3xl border border-white/80 bg-white/90 p-6 text-center backdrop-blur-sm shadow-sm md:p-8">
                <p
                    class="mx-auto mb-3 inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-700">
                    Account Setup
                </p>

                <transition name="fade-up" mode="out-in">
                    <div v-if="!animateIn" key="setup" class="space-y-3">
                        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                            Preparing your workspace
                        </h1>
                        <p class="text-sm text-slate-600">
                            We are loading your personalized dashboard.
                        </p>
                    </div>

                    <div v-else key="welcome" class="space-y-3">
                        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                            Welcome, <span class="text-cyan-700">{{ firstName }}</span>
                        </h1>
                        <p class="text-sm text-slate-600">
                            Thanks for joining Nursedive. Redirecting you to your dashboard now.
                        </p>
                    </div>
                </transition>

                <div class="mx-auto mt-6 w-full max-w-md rounded-full border border-slate-200 bg-slate-100 p-1">
                    <div
                        class="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 transition-all duration-500 ease-out"
                        :style="{ width: `${progressPercent}%` }"></div>
                </div>

                <p class="mt-3 text-xs text-slate-500">
                    <span v-if="countdown > 0">Redirecting in {{ countdown }}s...</span>
                    <span v-else>Redirecting...</span>
                </p>

                <button
                    class="mt-4 inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    @click="goNow">
                    Continue now
                </button>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const animateIn = ref(false);
const countdown = ref(7);
const totalCountdown = 7;

let revealTimer = null;
let redirectTimer = null;
let countdownTimer = null;

const firstName = computed(() => {
    const fullName = authStore.user?.name || "Student";
    return String(fullName).split(" ")[0];
});

const progressPercent = computed(() => {
    const remaining = Math.max(0, countdown.value);
    const completed = totalCountdown - remaining;
    const percent = (completed / totalCountdown) * 100;
    return Math.max(8, Math.min(100, percent));
});

const goNow = () => {
    router.push("/");
};

const clearTimers = () => {
    if (revealTimer) {
        clearTimeout(revealTimer);
        revealTimer = null;
    }

    if (redirectTimer) {
        clearTimeout(redirectTimer);
        redirectTimer = null;
    }

    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
};

onMounted(() => {
    revealTimer = setTimeout(() => {
        animateIn.value = true;
    }, 1200);

    countdownTimer = setInterval(() => {
        countdown.value -= 1;
        if (countdown.value <= 0) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
    }, 1000);

    redirectTimer = setTimeout(() => {
        router.push("/");
    }, 7000);
});

onBeforeUnmount(() => {
    clearTimers();
});
</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
    transition: all 0.35s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
    opacity: 0;
    transform: translateY(8px);
}
</style>

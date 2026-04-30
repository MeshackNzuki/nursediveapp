<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import CommonButton from "../components/Buttons/CommonButton.vue";
import EmailVerification from "../components/EmailVerification.vue";
import Socials from "../components/Socials.vue";

const router = useRouter();
const { user, active, isTrial, wasTrial } = useAuthStore();

const products = [
    {
        code: "teas",
        name: "TEAS 7",
        abb: "ATI",
        subtitle: "Exam-focused prep for reading, math, science, and language",
        tag: "Math, Science, Language, Reading",
        dashboardRoute: "/teas",
        pricingRoute: "/teas-pricing",
        accent: "from-cyan-500 to-sky-600",
        chip: "bg-cyan-100 text-cyan-800",
        surface: "from-cyan-50 via-white to-sky-50",
        features: ["Adaptive practice flow", "Detailed rationales", "Progress tracking"],
    },
    {
        code: "nursing",
        name: "Nursing School",
        abb: "BSN",
        subtitle: "Comprehensive nursing school test bank and targeted remediation",
        tag: "Q-bank, Exit Exams, Rationales",
        dashboardRoute: "/nursing",
        pricingRoute: "/nursing-pricing",
        accent: "from-emerald-500 to-teal-600",
        chip: "bg-emerald-100 text-emerald-800",
        surface: "from-emerald-50 via-white to-teal-50",
        features: ["Weak-area focus", "Performance analytics", "High-yield review"],
    },
    {
        code: "nclex",
        name: "NCLEX RN/PN",
        abb: "RN",
        subtitle: "High-fidelity NCLEX-style practice with readiness intelligence",
        tag: "CATs, Readiness, Simulations",
        dashboardRoute: "/nclex",
        pricingRoute: "/nclex-pricing",
        accent: "from-blue-600 to-indigo-600",
        chip: "bg-blue-100 text-blue-800",
        surface: "from-blue-50 via-white to-indigo-50",
        features: ["NCLEX-style items", "CAT simulation", "Readiness insights"],
    },
];

const streakDays = ref(1);

const firstName = computed(() => {
    const fullName = user?.name || "Student";
    return fullName.split(" ")[0];
});

const isAdmin = computed(() => {
    const role = user?.roles?.[0];
    return role === "super-admin" || role === "admin";
});

const planStatus = (code) => {
    if (active(code)) return "active";
    if (isTrial(code)) return "trial";
    if (wasTrial(code)) return "expired";
    return "expired";
};

const statusLabel = (code) => {
    const status = planStatus(code);
    if (status === "active") return "Active";
    if (status === "trial") return "Trial";
    return "Needs Upgrade";
};

const statusClass = (code) => {
    const status = planStatus(code);
    if (status === "active") return "bg-emerald-100 text-emerald-700 border-emerald-300";
    if (status === "trial") return "bg-amber-100 text-amber-700 border-amber-300";
    return "bg-rose-100 text-rose-700 border-rose-300";
};

const statusMessage = (code) => {
    const status = planStatus(code);
    if (status === "active") return "Subscription active. Continue studying.";
    if (status === "trial") return "Trial active. Upgrade for uninterrupted access.";
    return "Access limited. Upgrade to continue full preparation.";
};

const activeCount = computed(() =>
    products.filter((product) => planStatus(product.code) === "active").length,
);

const trialCount = computed(() =>
    products.filter((product) => planStatus(product.code) === "trial").length,
);

const needsUpgradeCount = computed(() =>
    products.filter((product) => planStatus(product.code) === "expired").length,
);

const initials = computed(() => {
    if (!user?.name) return "U";
    return user.name
        .split(" ")
        .slice(0, 2)
        .map((chunk) => chunk[0])
        .join("")
        .toUpperCase();
});

const streakMessage = computed(() => {
    if (streakDays.value >= 14) return "Outstanding consistency";
    if (streakDays.value >= 7) return "Strong momentum";
    if (streakDays.value >= 3) return "Great study rhythm";
    return "Fresh start, keep going";
});

const userActivityDate = computed(() => {
    const raw = user?.last_login || user?.updated_at || user?.created_at;
    if (!raw) return null;
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
});

const formatRelativeTime = (date) => {
    const diffMs = Date.now() - date.getTime();
    const minuteMs = 60 * 1000;
    const hourMs = 60 * minuteMs;
    const dayMs = 24 * hourMs;

    if (diffMs < minuteMs) return "Just now";
    if (diffMs < hourMs) return `${Math.floor(diffMs / minuteMs)}m ago`;
    if (diffMs < dayMs) return `${Math.floor(diffMs / hourMs)}h ago`;
    if (diffMs < dayMs * 7) return `${Math.floor(diffMs / dayMs)}d ago`;

    return date.toLocaleDateString();
};

const lastActivityText = computed(() => {
    if (!userActivityDate.value) return "No recent activity";
    return formatRelativeTime(userActivityDate.value);
});

const focusTip = computed(() => {
    if (needsUpgradeCount.value > 0) {
        return `Upgrade ${needsUpgradeCount.value} plan${needsUpgradeCount.value > 1 ? "s" : ""} to unlock full access.`;
    }
    if (trialCount.value > 0) {
        return "Convert your trial plan for uninterrupted prep.";
    }
    return "Keep your streak alive with one focused timed quiz today.";
});

const toLocalDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const updateVisitStreak = () => {
    if (typeof window === "undefined") return;

    const uid = user?.id || user?.email || "guest";
    const key = `nursedive_streak_${uid}`;

    const today = new Date();
    const todayKey = toLocalDateKey(today);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = toLocalDateKey(yesterday);

    let data = { lastVisit: todayKey, streak: 1 };

    try {
        const saved = window.localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.lastVisit === todayKey) {
                data = { ...parsed };
            } else if (parsed?.lastVisit === yesterdayKey) {
                data = { lastVisit: todayKey, streak: Number(parsed.streak || 0) + 1 };
            }
        }
    } catch {
        data = { lastVisit: todayKey, streak: 1 };
    }

    streakDays.value = Math.max(1, Number(data.streak || 1));

    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch {
        // Ignore localStorage write failures.
    }
};

const goToSupport = () => {
    window.location.href = "mailto:support@nursedive.com";
};

onMounted(() => {
    updateVisitStreak();
});
</script>

<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-4 md:p-6 bg-white">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-cyan-200 via-sky-200 to-emerald-200 opacity-40 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-28 right-8 h-[420px] w-[420px] bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200 opacity-35 blur-[100px] rounded-full">
            </div>
        </div>

        <div class="max-w-7xl mx-auto space-y-6">
            <section
                class="reveal-up relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95  p-5 md:p-7"
                style="animation-delay: 40ms;">
                <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500">
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                    <div class="lg:col-span-8 flex flex-col gap-5">
                        <div class="flex flex-wrap items-center gap-3">
                            <div v-if="user?.avatar"
                                class="h-14 w-14 rounded-full ring-2 ring-sky-300 border-2 border-white overflow-hidden shadow-sm bg-white">
                                <img :src="'/storage/' + user.avatar" class="w-full h-full object-cover"
                                    alt="User Avatar" />
                            </div>
                            <div v-else
                                class="h-14 w-14 rounded-full bg-gradient-to-br from-sky-600 to-cyan-500 text-white font-bold flex items-center justify-center shadow-md ring-2 ring-sky-300">
                                {{ initials }}
                            </div>

                            <div>
                                <h1 class="text-2xl md:text-3xl font-light tracking-tight text-slate-900">
                                    Welcome back,<span class="font-semibold"> {{ firstName }}</span>
                                </h1>
                                <p class="text-sm text-slate-600 mt-1">
                                    Stay consistent today. Small focused sessions compound into exam success.
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                <p class="text-xs uppercase tracking-wide text-emerald-700 font-semibold">Active Plans
                                </p>
                                <p class="text-2xl font-extrabold text-emerald-800 mt-1">{{ activeCount }}</p>
                            </div>
                            <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                <p class="text-xs uppercase tracking-wide text-amber-700 font-semibold">Trials</p>
                                <p class="text-2xl font-extrabold text-amber-800 mt-1">{{ trialCount }}</p>
                            </div>
                            <div class="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                                <p class="text-xs uppercase tracking-wide text-rose-700 font-semibold">Need Upgrade</p>
                                <p class="text-2xl font-extrabold text-rose-800 mt-1">{{ needsUpgradeCount }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 reveal-fade" style="animation-delay: 160ms;">
                            <div class="rounded-2xl border border-sky-200 bg-sky-50 p-3.5">
                                <p class="text-[11px] uppercase tracking-wide text-sky-700 font-semibold">Study Streak
                                </p>
                                <p class="text-lg font-extrabold text-sky-900 mt-1">&#128293; {{ streakDays }} day<span
                                        v-if="streakDays > 1">s</span></p>
                                <p class="text-xs text-sky-700 mt-1">{{ streakMessage }}</p>
                            </div>
                            <div class="rounded-2xl border border-indigo-200 bg-indigo-50 p-3.5">
                                <p class="text-[11px] uppercase tracking-wide text-indigo-700 font-semibold">Last
                                    Activity</p>
                                <p class="text-lg font-extrabold text-indigo-900 mt-1">{{ lastActivityText }}</p>
                                <p class="text-xs text-indigo-700 mt-1">Based on your latest account activity.</p>
                            </div>
                            <div class="rounded-2xl border border-teal-200 bg-teal-50 p-3.5">
                                <p class="text-[11px] uppercase tracking-wide text-teal-700 font-semibold">Focus Today
                                </p>
                                <p class="text-sm font-semibold text-teal-900 mt-1">{{ focusTip }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-4 flex flex-col gap-3">
                        <EmailVerification v-if="!user?.email_verified" class="relative" />
                        <CommonButton buttonText="View Subscription Plans" icon="pi pi-credit-card me-1"
                            :action="() => router.push('/subscription')"
                            classes="w-full bg-sky-600 text-white hover:bg-sky-700 py-2.5" />
                        <router-link v-if="isAdmin" to="/admin"
                            class="w-full text-center rounded-full border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                            Open Admin Panel
                        </router-link>
                    </div>
                </div>
            </section>
            <section class="space-y-4 reveal-up" style="animation-delay: 100ms;">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">Your Learning Products
                    </h2>
                    <p class="text-xs md:text-sm text-slate-500">Choose a track and continue from where you left off</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    <article v-for="(product, index) in products" :key="product.code"
                        class="reveal-up group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-custom transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_-22px_rgba(15,23,42,0.45)]"
                        :style="{ animationDelay: `${180 + index * 90}ms` }">

                        <div class="absolute inset-0 opacity-80 bg-gradient-to-br" :class="product.surface"></div>
                        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r" :class="product.accent"></div>

                        <div class="relative p-5 md:p-6 space-y-4">
                            <div class="flex items-start justify-between gap-2">
                                <div class="inline-flex items-center gap-2.5">
                                    <div class="min-h-8 min-w-8 rounded-lg p-2 bg-gradient-to-br text-white font-bold flex items-center justify-center shadow-sm"
                                        :class="product.accent">
                                        {{ product.abb }}
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-extrabold tracking-tight text-slate-900">{{ product.name
                                            }}</h3>
                                        <p class="text-xs text-slate-600 mt-0.5">{{ product.subtitle }}</p>
                                    </div>
                                </div>
                                <span class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold"
                                    :class="statusClass(product.code)">
                                    {{ statusLabel(product.code) }}
                                </span>
                            </div>

                            <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                :class="product.chip">
                                {{ product.tag }}
                            </span>

                            <ul class="space-y-2">
                                <li v-for="feature in product.features" :key="feature"
                                    class="flex items-center gap-2 text-sm text-slate-700">
                                    <span
                                        class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-teal-700 border border-teal-200 text-xs font-bold">&#10003;</span>
                                    {{ feature }}
                                </li>
                            </ul>
                            
                            <div class="rounded-2xl border border-slate-200 bg-white/90 p-3">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Access Status
                                </p>
                                <p class="text-sm text-slate-700 mt-1">{{ statusMessage(product.code) }}</p>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <CommonButton buttonText="Open Dashboard" icon2="pi pi-arrow-right"
                                    :action="() => router.push(product.dashboardRoute)"
                                    classes="w-full text-white hover:bg-slate-800 py-2.5" />
                                <CommonButton buttonText="View Plans" icon="pi pi-star"
                                    :action="() => router.push(product.pricingRoute)"
                                    classes="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 py-2.5" />
                            </div>
                        </div>
                    </article>
                </div>
            </section>
            <section class="grid grid-cols-1 xl:grid-cols-3 gap-5 reveal-fade" style="animation-delay: 220ms;">
                <div class="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
                    <h3 class="text-lg font-extrabold text-slate-900">Why Nursedive</h3>
                    <p class="text-sm text-slate-600 mt-1">Designed for high performance, consistency, and measurable
                        outcomes.</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                            <p class="text-sm font-semibold text-slate-800">Realistic Question Quality</p>
                            <p class="text-xs text-slate-600 mt-1">Well-crafted questions aligned with real exam style
                                and difficulty.</p>
                        </div>
                        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                            <p class="text-sm font-semibold text-slate-800">Weak-Area Focus</p>
                            <p class="text-xs text-slate-600 mt-1">Target your gaps and improve with smart feedback
                                loops.</p>
                        </div>
                        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                            <p class="text-sm font-semibold text-slate-800">Comprehensive Analytics</p>
                            <p class="text-xs text-slate-600 mt-1">Track momentum, confidence, and readiness over time.
                            </p>
                        </div>
                        <div class="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                            <p class="text-sm font-semibold text-slate-800">High Pass-Rate Strategy</p>
                            <p class="text-xs text-slate-600 mt-1">Structured routines and guided practice built for
                                exam success.</p>
                        </div>
                    </div>
                </div>

                <div
                    class="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm flex flex-col justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-extrabold text-slate-900">Need Help?</h3>
                        <p class="text-sm text-slate-600 mt-1">
                            We value your feedback and are here to support your preparation journey.
                        </p>
                    </div>

                    <div class="space-y-2.5">
                        <CommonButton buttonText="Contact Support" icon="pi pi-envelope me-1" :action="goToSupport"
                            classes="w-full bg-sky-600 text-white hover:bg-sky-700 py-2.5" />
                        <p class="text-xs text-slate-500">
                            You can also use the live chat at the bottom-right corner.
                        </p>
                    </div>
                </div>
            </section>

            <section class="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm reveal-fade"
                style="animation-delay: 280ms;">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <h3 class="text-lg font-extrabold text-slate-900">Share and Connect</h3>
                    <p class="text-sm text-slate-600">Join our social channels for updates, tips, and success stories.
                    </p>
                </div>
                <Socials />
            </section>
        </div>
    </div>
</template>

<style scoped>
.reveal-up {
    opacity: 0;
    transform: translateY(12px);
    animation: usherFadeUp 560ms ease-out forwards;
}

.reveal-fade {
    opacity: 0;
    animation: usherFade 620ms ease-out forwards;
}

@keyframes usherFadeUp {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes usherFade {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@media (prefers-reduced-motion: reduce) {

    .reveal-up,
    .reveal-fade {
        animation: none;
        opacity: 1;
        transform: none;
    }
}
</style>

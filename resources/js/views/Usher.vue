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

const primaryProduct = computed(() => {
    return (
        products.find((product) => planStatus(product.code) === "active") ||
        products.find((product) => planStatus(product.code) === "trial") ||
        products[0]
    );
});

const primaryActionRoute = computed(() => {
    const product = primaryProduct.value;
    return planStatus(product.code) === "expired" ? product.pricingRoute : product.dashboardRoute;
});

const primaryActionLabel = computed(() => {
    const product = primaryProduct.value;
    return planStatus(product.code) === "expired"
        ? `View ${product.name} Plans`
        : `Continue ${product.name}`;
});

const summaryStats = computed(() => [
    {
        label: "Active Plans",
        value: activeCount.value,
        detail: "Ready to use",
        icon: "pi pi-check-circle",
        tone: "text-emerald-600 dark:text-emerald-300",
    },
    {
        label: "Trials",
        value: trialCount.value,
        detail: "Temporary access",
        icon: "pi pi-clock",
        tone: "text-amber-600 dark:text-amber-300",
    },
    {
        label: "Need Upgrade",
        value: needsUpgradeCount.value,
        detail: "Locked or expired",
        icon: "pi pi-lock",
        tone: "text-rose-600 dark:text-rose-300",
    },
    {
        label: "Study Streak",
        value: `${streakDays.value}d`,
        detail: streakMessage.value,
        icon: "",
        blob: "🔥",
        tone: "text-sky-600 dark:text-sky-300",
    },
]);

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
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-slate-100 p-4 md:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh] dark:bg-slate-950">
        <div class="mx-auto max-w-7xl space-y-6">
            <section
                class="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7 dark:border-slate-800 dark:bg-slate-900">
                <div class="grid gap-6 lg:grid-cols-[1fr_340px]">
                    <div>
                        <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div v-if="user?.avatar"
                                class="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white ring-2 ring-sky-200 dark:border-slate-900 dark:bg-slate-800 dark:ring-sky-900">
                                <img :src="'/storage/' + user.avatar" class="h-full w-full object-cover"
                                    alt="User Avatar" />
                            </div>
                            <div v-else
                                class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-600 to-cyan-500 text-lg font-bold text-white ring-2 ring-sky-200 dark:ring-sky-900">
                                {{ initials }}
                            </div>

                            <div class="min-w-0 flex-1">
                                <p
                                    class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                                    NurseDive Nursing Exam Prep
                                </p>
                                <h1
                                    class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl dark:text-slate-100">
                                    <span class="font-light">Welcome back</span>, {{ firstName }}
                                </h1>
                                <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    Choose a track, review your access, and keep today's study session focused.
                                </p>

                                <dl
                                    class="mt-6 grid gap-y-4 border-y border-slate-200 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-200 dark:border-slate-800 dark:lg:divide-slate-800">
                                    <div v-for="stat in summaryStats" :key="stat.label"
                                        class="lg:px-4 first:lg:pl-0 bg-sky-50/50 rounded-lg p-2 m-0.5">
                                        <dt
                                            class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            <span v-if="stat.blob"
                                                class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[13px] ring-1 ring-orange-200 dark:bg-orange-900/30 dark:ring-orange-800/60">
                                                {{ stat.blob }}
                                            </span>
                                            <i v-else :class="[stat.icon, stat.tone]"></i>
                                            {{ stat.label }}
                                        </dt>
                                        <dd class="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-100">
                                            {{ stat.value }}
                                        </dd>
                                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {{ stat.detail }}
                                        </p>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <aside class="flex flex-col gap-4 border-slate-200 lg:border-l lg:pl-6 dark:border-slate-800">
                        <EmailVerification v-if="!user?.email_verified" class="max-w-none" />

                        <div>
                            <p
                                class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                Focus Today
                            </p>
                            <p class="mt-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                                {{ focusTip }}
                            </p>
                            <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                Last activity: {{ lastActivityText }}
                            </p>
                        </div>

                        <div class="flex flex-col gap-2">
                            <CommonButton :buttonText="primaryActionLabel" icon2="pi pi-arrow-right"
                                :action="() => router.push(primaryActionRoute)"
                                classes="w-full bg-sky-600 py-2.5 text-white shadow-none hover:bg-sky-700" />
                            <CommonButton buttonText="View Subscription Plans" icon="pi pi-credit-card me-1"
                                :action="() => router.push('/subscription')"
                                classes="w-full border border-slate-200 bg-white py-2.5 text-slate-700 shadow-none hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" />
                            <router-link v-if="isAdmin" to="/admin"
                                class="flex w-full items-center justify-center rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
                                <i class="pi pi-cog mr-2 text-xs"></i>
                                Open Admin Panel
                            </router-link>
                        </div>
                    </aside>
                </div>
            </section>

            <section class="space-y-4">
                <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                            Learning Products
                        </p>
                        <h2
                            class="mt-1 text-xl font-semibold tracking-tight text-slate-950 md:text-2xl dark:text-slate-100">
                            Continue Your Prep
                        </h2>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        Choose a track and continue from where you left off.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <article v-for="product in products" :key="product.code"
                        class="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_-28px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900">
                        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r" :class="product.accent"></div>

                        <div class="p-5 md:p-6">
                            <div class="flex items-start justify-between gap-3">
                                <div class="flex min-w-0 items-start gap-3">
                                    <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-white"
                                        :class="product.accent">
                                        {{ product.abb }}
                                    </div>
                                    <div class="min-w-0">
                                        <h3
                                            class="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                                            {{ product.name }}
                                        </h3>
                                        <p class="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                                            {{ product.subtitle }}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    class="inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-bold"
                                    :class="statusClass(product.code)">
                                    {{ statusLabel(product.code) }}
                                </span>
                            </div>

                            <div class="mt-4 flex flex-wrap gap-2">
                                <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="product.chip">
                                    {{ product.tag }}
                                </span>
                            </div>

                            <ul class="mt-5 space-y-2">
                                <li v-for="feature in product.features" :key="feature"
                                    class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <span
                                        class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-xs font-bold text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300">
                                        <i class="pi pi-check text-[10px]"></i>
                                    </span>
                                    {{ feature }}
                                </li>
                            </ul>

                            <div class="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
                                <p
                                    class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Access Status
                                </p>
                                <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                    {{ statusMessage(product.code) }}
                                </p>
                            </div>

                            <div class="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                <CommonButton buttonText="Open Dashboard" icon2="pi pi-arrow-right"
                                    :action="() => router.push(product.dashboardRoute)"
                                    classes="w-full bg-slate-900 py-2.5 text-white shadow-none hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-700" />
                                <CommonButton buttonText="View Plans" icon="pi pi-star"
                                    :action="() => router.push(product.pricingRoute)"
                                    classes="w-full border border-slate-200 bg-white py-2.5 text-slate-700 shadow-none hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" />
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <section class="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <div
                    class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6 xl:col-span-2 dark:border-slate-800 dark:bg-slate-900">
                    <h3 class="text-lg font-semibold text-slate-950 dark:text-slate-100">Why NurseDive</h3>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Designed for consistent practice, measurable progress, and readiness decisions.
                    </p>
                    <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div class="border-l-2 border-sky-500 pl-3">
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Realistic Question
                                Quality</p>
                            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Questions aligned with real exam style and difficulty.
                            </p>
                        </div>
                        <div class="border-l-2 border-emerald-500 pl-3">
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Weak-Area Focus</p>
                            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Target gaps and improve with feedback loops.
                            </p>
                        </div>
                        <div class="border-l-2 border-amber-500 pl-3">
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Comprehensive Analytics
                            </p>
                            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Track momentum, confidence, and readiness over time.
                            </p>
                        </div>
                        <div class="border-l-2 border-rose-500 pl-3">
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">High Pass-Rate Strategy
                            </p>
                            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Structured routines and guided practice built for exam success.
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    class="flex flex-col justify-between gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-950 dark:text-slate-100">Need Help?</h3>
                        <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            We value your feedback and are here to support your preparation journey.
                        </p>
                    </div>

                    <div class="space-y-2.5">
                        <CommonButton buttonText="Contact Support" icon="pi pi-envelope me-1" :action="goToSupport"
                            classes="w-full bg-sky-600 py-2.5 text-white shadow-none hover:bg-sky-700" />
                        <p class="text-xs text-slate-500 dark:text-slate-400">
                            You can also use the live chat at the bottom-right corner.
                        </p>
                    </div>
                </div>
            </section>

            <section
                class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-slate-800 dark:bg-slate-900">
                <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <h3 class="text-lg font-semibold text-slate-950 dark:text-slate-100">Share and Connect</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        Join our social channels for updates, tips, and success stories.
                    </p>
                </div>
                <Socials />
            </section>
        </div>
    </div>
</template>

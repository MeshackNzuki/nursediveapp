<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:min-h-[94vh] 2xl:max-h-[94vh] overflow-y-scroll bg-slate-50 p-4 sm:p-6">
        <div class="max-w-7xl mx-auto space-y-6">
            <Navigation />

            <section
                class="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-custom md:p-6">
                <div class="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-stretch">
                    <div class="min-w-0">
                        <p class="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Profile & Access</p>
                        <h1 class="mt-2 text-2xl md:text-4xl font-black tracking-tight text-slate-950">
                            Account Center
                        </h1>
                        <p class="mt-3 max-w-3xl text-sm md:text-base text-slate-600">
                            Keep your profile, subscriptions, and study access organized from one place.
                        </p>

                        <div class="mt-5 flex flex-wrap gap-2">
                            <router-link v-for="action in heroActions" :key="action.to" :to="action.to"
                                class="inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition"
                                :class="action.primary
                                    ? 'border-cyan-500 bg-cyan-500 text-white hover:bg-cyan-600'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'">
                                <i :class="action.icon"></i>
                                <span>{{ action.label }}</span>
                            </router-link>
                        </div>
                    </div>

                    <aside class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white">
                                {{ initials }}
                            </div>
                            <div class="min-w-0">
                                <p class="truncate text-sm font-extrabold text-slate-950">{{ formData.name || "Learner" }}
                                </p>
                                <p class="truncate text-xs text-slate-500">{{ formData.email || "No email available" }}</p>
                            </div>
                        </div>

                        <div class="mt-4 grid grid-cols-2 gap-2">
                            <div class="rounded-2xl border border-slate-200 bg-white p-3">
                                <p class="text-[11px] font-bold uppercase tracking-wide text-slate-500">Primary</p>
                                <p class="mt-1 truncate text-sm font-extrabold text-slate-900">
                                    {{ primaryProductCard.label }}
                                </p>
                            </div>
                            <div class="rounded-2xl border border-slate-200 bg-white p-3">
                                <p class="text-[11px] font-bold uppercase tracking-wide text-slate-500">Account</p>
                                <p class="mt-1 truncate text-sm font-extrabold" :class="isVerified ? 'text-emerald-700' : 'text-amber-700'">
                                    {{ isVerified ? "Verified" : "Needs Review" }}
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <article v-for="metric in accountMetrics" :key="metric.label"
                    class="rounded-3xl border border-slate-200 bg-white p-4 shadow-custom">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="text-xs font-bold uppercase tracking-wide text-slate-500">{{ metric.label }}</p>
                            <p class="mt-2 text-2xl font-black text-slate-950">{{ metric.value }}</p>
                        </div>
                        <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl" :class="metric.iconClass">
                            <i :class="metric.icon"></i>
                        </span>
                    </div>
                    <p class="mt-2 text-sm text-slate-600">{{ metric.helper }}</p>
                </article>
            </section>

            <p v-if="feedbackText" class="rounded-2xl border px-4 py-3 text-sm font-semibold" :class="feedbackType === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'">
                {{ feedbackText }}
            </p>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div class="xl:col-span-2 space-y-6">
                    <section
                        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-custom md:p-6">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Profile</p>
                                <h2 class="mt-1 text-xl font-black text-slate-950">Personal Information</h2>
                                <p class="mt-1 text-sm text-slate-600">
                                    Update the name and image attached to your learner account.
                                </p>
                            </div>
                            <span
                                class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                <i class="pi pi-lock"></i>
                                Secure update
                            </span>
                        </div>

                        <form @submit.prevent="saveSettings" class="mt-5 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
                            <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                                <div
                                    class="relative mx-auto h-32 w-32 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-custom ring-1 ring-slate-200">
                                    <img :src="avatarPreview" class="h-full w-full object-cover" alt="User avatar" />
                                    <label
                                        class="absolute bottom-2 right-2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-950 text-white shadow-custom transition hover:bg-cyan-600"
                                        title="Change profile photo">
                                        <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
                                        <i class="pi pi-camera text-sm"></i>
                                    </label>
                                </div>
                                <p class="mt-3 text-sm font-extrabold text-slate-900">{{ formData.name || "Learner" }}</p>
                                <p class="mt-1 text-xs text-slate-500">
                                    {{ fileUrl ? "New image ready to save" : "JPG or PNG under 2 MB" }}
                                </p>
                            </div>

                            <div class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label class="block">
                                        <span class="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                                            Name
                                        </span>
                                        <input v-model="formData.name" type="text"
                                            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-custom transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                                            placeholder="Enter your name" />
                                    </label>

                                    <label class="block">
                                        <span class="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                                            Email
                                        </span>
                                        <input v-model="formData.email" type="email" disabled
                                            class="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500"
                                            placeholder="Email address" />
                                    </label>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div v-for="detail in profileDetails" :key="detail.label"
                                        class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                        <p class="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                            {{ detail.label }}
                                        </p>
                                        <p class="mt-1 truncate text-sm font-extrabold text-slate-900">{{ detail.value }}</p>
                                    </div>
                                </div>

                                <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p class="text-sm text-slate-600">
                                        Last saved:
                                        <strong class="text-slate-800">{{ lastSavedAt || "Not saved yet" }}</strong>
                                    </p>
                                    <button type="submit" :disabled="isSaving"
                                        class="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-custom transition hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-60">
                                        <i :class="isSaving ? 'pi pi-spin pi-spinner' : 'pi pi-save'"></i>
                                        <span>{{ isSaving ? "Saving..." : "Save Profile" }}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>

                    <section
                        class="rounded-3xl border border-slate-200 bg-white p-5 shadow-custom md:p-6">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">Access</p>
                                <h2 class="mt-1 text-xl font-black text-slate-950">Subscriptions</h2>
                                <p class="mt-1 text-sm text-slate-600">
                                    See which prep products are active, expiring, or ready to renew.
                                </p>
                            </div>
                            <router-link to="/subscription"
                                class="inline-flex min-h-10 items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800">
                                <i class="pi pi-wallet"></i>
                                <span>Manage Billing</span>
                            </router-link>
                        </div>

                        <div class="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <article v-for="product in subscriptionCards" :key="product.code"
                                class="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-slate-300"
                                :class="product.cardRingClass">
                                <div class="absolute inset-x-0 top-0 h-1" :class="product.accentLineClass"></div>

                                <div class="flex items-start justify-between gap-3">
                                    <div class="flex items-center gap-3">
                                        <span class="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                                            :class="product.iconClass">
                                            <i :class="product.icon"></i>
                                        </span>
                                        <div>
                                            <p class="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                                {{ product.code.toUpperCase() }}
                                            </p>
                                            <h3 class="text-base font-black text-slate-950">{{ product.label }}</h3>
                                        </div>
                                    </div>
                                    <span class="rounded-full px-2.5 py-1 text-xs font-bold" :class="product.badgeClass">
                                        {{ product.statusLabel }}
                                    </span>
                                </div>

                                <p class="mt-4 text-sm font-semibold text-slate-800">{{ product.statusText }}</p>
                                <p class="mt-1 min-h-8 text-xs text-slate-500">{{ product.helperText }}</p>

                                <div class="mt-4">
                                    <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                        <span>Access Runway</span>
                                        <span>{{ product.progressLabel }}</span>
                                    </div>
                                    <div class="mt-2 h-2 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                                        <div class="h-full rounded-full transition-all" :class="product.progressClass"
                                            :style="{ width: product.progressWidth }"></div>
                                    </div>
                                </div>

                                <div class="mt-4 flex flex-wrap gap-2">
                                    <router-link :to="product.dashboardPath"
                                        class="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                                        <i class="pi pi-th-large"></i>
                                        <span>Dashboard</span>
                                    </router-link>
                                    <router-link :to="product.pricingPath"
                                        class="inline-flex min-h-9 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-white transition"
                                        :class="product.ctaClass">
                                        <i class="pi pi-credit-card"></i>
                                        <span>{{ product.primaryCta }}</span>
                                    </router-link>
                                </div>
                            </article>
                        </div>
                    </section>
                </div>

                <aside class="space-y-6">
                    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-custom">
                        <div class="flex items-center justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">Next Actions</p>
                                <h2 class="mt-1 text-lg font-black text-slate-950">Account Shortcuts</h2>
                            </div>
                            <i class="pi pi-compass text-lg text-cyan-600"></i>
                        </div>

                        <div class="mt-4 space-y-2">
                            <router-link v-for="action in accountActions" :key="action.to" :to="action.to"
                                class="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-cyan-200 hover:bg-cyan-50">
                                <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                                    :class="action.iconClass">
                                    <i :class="action.icon"></i>
                                </span>
                                <span class="min-w-0">
                                    <span class="block text-sm font-extrabold text-slate-900">{{ action.label }}</span>
                                    <span class="block truncate text-xs text-slate-500">{{ action.helper }}</span>
                                </span>
                                <i class="pi pi-arrow-right ml-auto text-xs text-slate-400"></i>
                            </router-link>
                        </div>
                    </section>

                    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-custom">
                        <div class="flex items-center justify-between gap-3">
                            <div>
                                <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Readiness</p>
                                <h2 class="mt-1 text-lg font-black text-slate-950">Account Setup</h2>
                            </div>
                            <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                {{ readinessComplete }}/{{ readinessItems.length }}
                            </span>
                        </div>

                        <div class="mt-4 space-y-3">
                            <div v-for="item in readinessItems" :key="item.label"
                                class="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                <span class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                                    :class="item.complete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
                                    <i :class="item.complete ? 'pi pi-check text-xs' : 'pi pi-exclamation-triangle text-xs'"></i>
                                </span>
                                <span>
                                    <span class="block text-sm font-extrabold text-slate-900">{{ item.label }}</span>
                                    <span class="block text-xs text-slate-500">{{ item.helper }}</span>
                                </span>
                            </div>
                        </div>
                    </section>

                    <section
                        class="rounded-3xl border border-sky-400 bg-sky-500 p-5 text-white shadow-custom">
                        <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-100">Primary Workspace</p>
                        <div class="mt-3 flex items-center gap-3">
                            <span class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                <i :class="primaryProductCard.icon"></i>
                            </span>
                            <div class="min-w-0">
                                <h2 class="truncate text-lg font-black">{{ primaryProductCard.label }}</h2>
                                <p class="text-xs text-sky-50">{{ primaryProductCard.statusLabel }} access</p>
                            </div>
                        </div>
                        <p class="mt-4 text-sm text-sky-50">{{ primaryProductCard.helperText }}</p>
                        <router-link :to="primaryProductCard.dashboardPath"
                            class="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-50">
                            <i class="pi pi-arrow-right"></i>
                            <span>Open Dashboard</span>
                        </router-link>
                    </section>
                </aside>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useAuthStore } from "../stores/authStore";
import defaultAvatar from "@/assets/images/avatar.png";
import axios from "axios";
import Navigation from "../components/Navigation.vue";

const authStore = useAuthStore();
const user = computed(() => authStore.user || {});

const fileUrl = ref(null);
const isSaving = ref(false);
const feedbackText = ref("");
const feedbackType = ref("success");
const lastSavedAt = ref("");

const formData = ref({
    name: "",
    email: "",
    avatar: null,
});

const products = [
    {
        code: "teas",
        label: "TEAS 7 Prep",
        icon: "pi pi-file-edit",
        dashboardPath: "/teas",
        iconClass: "bg-cyan-100 text-cyan-700",
        accentLineClass: "bg-gradient-to-r from-cyan-400 to-sky-500",
        progressClass: "bg-cyan-500",
        ctaClass: "bg-cyan-600 hover:bg-cyan-700",
    },
    {
        code: "nursing",
        label: "Nursing Test Bank",
        icon: "pi pi-briefcase",
        dashboardPath: "/nursing",
        iconClass: "bg-emerald-100 text-emerald-700",
        accentLineClass: "bg-gradient-to-r from-emerald-400 to-teal-500",
        progressClass: "bg-emerald-500",
        ctaClass: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
        code: "nclex",
        label: "NCLEX Prep",
        icon: "pi pi-bolt",
        dashboardPath: "/nclex",
        iconClass: "bg-indigo-100 text-indigo-700",
        accentLineClass: "bg-gradient-to-r from-indigo-500 to-blue-500",
        progressClass: "bg-indigo-500",
        ctaClass: "bg-indigo-600 hover:bg-indigo-700",
    },
];

watch(
    user,
    (nextUser) => {
        formData.value.name = nextUser?.name || "";
        formData.value.email = nextUser?.email || "";
    },
    { immediate: true },
);

const avatarPreview = computed(() => {
    if (fileUrl.value) return fileUrl.value;
    if (user.value?.avatar) return "/storage/" + user.value.avatar;
    return defaultAvatar;
});

const initials = computed(() => {
    const source = String(formData.value.name || formData.value.email || "Learner").trim();
    return source
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "L";
});

const isVerified = computed(() => Boolean(user.value?.email_verified_at || user.value?.verified));

const formatDate = (value) => {
    if (!value) return "Not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const parseExpiry = (value) => {
    if (!value) return null;
    const date = new Date(`${value}T23:59:59`);
    return Number.isNaN(date.getTime()) ? null : date;
};

const getPlans = (code) => {
    const plans = user.value?.subscriptions?.[code];
    return Array.isArray(plans) ? plans : [];
};

const getFuturePlans = (code) => {
    const now = new Date();
    return getPlans(code)
        .map((plan) => ({ ...plan, _expiry: parseExpiry(plan.expires) }))
        .filter((plan) => plan._expiry && plan._expiry > now)
        .sort((a, b) => a._expiry - b._expiry);
};

const getLatestPlan = (code) => {
    return getPlans(code)
        .map((plan) => ({ ...plan, _expiry: parseExpiry(plan.expires) }))
        .filter((plan) => plan._expiry)
        .sort((a, b) => b._expiry - a._expiry)[0] || null;
};

const getRunwayProgress = (days) => {
    if (!days) return "0%";
    return `${Math.min(100, Math.max(10, Math.round((days / 30) * 100)))}%`;
};

const subscriptionCards = computed(() => {
    return products.map((product) => {
        const code = product.code;
        const plans = getPlans(code);
        const futurePlans = getFuturePlans(code);
        const latestPlan = getLatestPlan(code);
        const hasPlans = plans.length > 0;
        const isTrial = authStore.isTrial(code);
        const isActive = authStore.isActive(code);
        const wasTrial = authStore.wasTrial(code);
        const days = Number(authStore.daysLeft(code) || 0);
        const nextExpiry = futurePlans[0]?._expiry || null;
        const lastExpiry = latestPlan?._expiry || null;

        let statusLabel = "No Plan";
        let statusText = "No active subscription found.";
        let helperText = "Subscribe to unlock full practice access and analytics.";
        let primaryCta = "Subscribe";
        let badgeClass = "bg-slate-200 text-slate-700";
        let cardRingClass = "";
        let accessState = "none";

        if (isTrial && days > 0) {
            statusLabel = "Trial";
            statusText = `${days} day${days === 1 ? "" : "s"} left on trial.`;
            helperText = nextExpiry ? `Trial ends ${formatDate(nextExpiry)}.` : "Upgrade anytime to keep access.";
            primaryCta = "Upgrade";
            badgeClass = "bg-amber-100 text-amber-700";
            cardRingClass = "ring-1 ring-amber-100";
            accessState = "trial";
        } else if (isActive) {
            statusLabel = "Active";
            statusText = `${days} day${days === 1 ? "" : "s"} remaining.`;
            helperText = nextExpiry ? `Renews or expires ${formatDate(nextExpiry)}.` : "Renew early to extend access.";
            primaryCta = "Extend";
            badgeClass = "bg-emerald-100 text-emerald-700";
            cardRingClass = "ring-1 ring-emerald-100";
            accessState = "active";
        } else if (hasPlans || wasTrial) {
            statusLabel = "Expired";
            statusText = "Access has expired.";
            helperText = lastExpiry ? `Last access ended ${formatDate(lastExpiry)}.` : "Renew to continue practice.";
            primaryCta = "Renew";
            badgeClass = "bg-rose-100 text-rose-700";
            cardRingClass = "ring-1 ring-rose-100";
            accessState = "expired";
        }

        return {
            ...product,
            statusLabel,
            statusText,
            helperText,
            primaryCta,
            badgeClass,
            cardRingClass,
            accessState,
            pricingPath: authStore.pricingRoute(code),
            progressLabel: days > 0 ? `${days}d left` : "Inactive",
            progressWidth: getRunwayProgress(days),
        };
    });
});

const primaryProductCard = computed(() => {
    const activeCard = subscriptionCards.value.find((card) => card.accessState === "active");
    if (activeCard) return activeCard;

    const trialCard = subscriptionCards.value.find((card) => card.accessState === "trial");
    if (trialCard) return trialCard;

    const usedCard = subscriptionCards.value.find((card) => card.accessState === "expired");
    if (usedCard) return usedCard;

    return subscriptionCards.value[0];
});

const heroActions = computed(() => [
    {
        label: "Open Dashboard",
        to: primaryProductCard.value.dashboardPath,
        icon: "pi pi-th-large",
        primary: true,
    },
    {
        label: "Subscriptions",
        to: "/subscription",
        icon: "pi pi-wallet",
        primary: false,
    },
    {
        label: "Settings",
        to: "/settings",
        icon: "pi pi-cog",
        primary: false,
    },
]);

const accountMetrics = computed(() => {
    const activeCount = subscriptionCards.value.filter((card) => card.accessState === "active").length;
    const trialCount = subscriptionCards.value.filter((card) => card.accessState === "trial").length;
    const expiringCount = subscriptionCards.value.filter((card) => {
        const days = Number(authStore.daysLeft(card.code) || 0);
        return ["active", "trial"].includes(card.accessState) && days > 0 && days <= 7;
    }).length;
    const expiredCount = subscriptionCards.value.filter((card) => card.accessState === "expired").length;

    return [
        {
            label: "Active Plans",
            value: activeCount,
            helper: activeCount ? "Paid products ready to use." : "No paid plan is active.",
            icon: "pi pi-check-circle",
            iconClass: "bg-emerald-100 text-emerald-700",
        },
        {
            label: "Trials",
            value: trialCount,
            helper: trialCount ? "Trial access currently running." : "No trial is running.",
            icon: "pi pi-clock",
            iconClass: "bg-amber-100 text-amber-700",
        },
        {
            label: "Expiring Soon",
            value: expiringCount,
            helper: expiringCount ? "Renew soon to avoid interruption." : "No access expires this week.",
            icon: "pi pi-calendar",
            iconClass: "bg-cyan-100 text-cyan-700",
        },
        {
            label: "Needs Renewal",
            value: expiredCount,
            helper: expiredCount ? "Expired product access found." : "No expired product needs action.",
            icon: "pi pi-refresh",
            iconClass: "bg-rose-100 text-rose-700",
        },
    ];
});

const profileDetails = computed(() => [
    {
        label: "Joined",
        value: formatDate(user.value?.created_at),
    },
    {
        label: "Verification",
        value: isVerified.value ? "Verified" : "Pending",
    },
    {
        label: "Role",
        value: user.value?.roles?.[0] || "Learner",
    },
]);

const accountActions = computed(() => [
    {
        label: "Study Settings",
        helper: "Notifications, display, and exam behavior",
        to: "/settings",
        icon: "pi pi-sliders-h",
        iconClass: "bg-cyan-100 text-cyan-700",
    },
    {
        label: "Plans and Billing",
        helper: "Compare plans or renew subscriptions",
        to: "/subscription",
        icon: "pi pi-credit-card",
        iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
        label: "Notifications",
        helper: "Review account and subscription notices",
        to: "/notifications",
        icon: "pi pi-bell",
        iconClass: "bg-amber-100 text-amber-700",
    },
    {
        label: `${primaryProductCard.value.label} Dashboard`,
        helper: "Jump back into your primary workspace",
        to: primaryProductCard.value.dashboardPath,
        icon: primaryProductCard.value.icon,
        iconClass: primaryProductCard.value.iconClass,
    },
]);

const readinessItems = computed(() => [
    {
        label: "Profile name",
        helper: formData.value.name ? "Your account has a display name." : "Add your name for a better account profile.",
        complete: Boolean(formData.value.name),
    },
    {
        label: "Profile photo",
        helper: user.value?.avatar || fileUrl.value ? "Your avatar is ready." : "Add a profile photo when you are ready.",
        complete: Boolean(user.value?.avatar || fileUrl.value),
    },
    {
        label: "Verified email",
        helper: isVerified.value ? "Your email is verified." : "Verify your email to protect account recovery.",
        complete: isVerified.value,
    },
    {
        label: "Learning access",
        helper: subscriptionCards.value.some((card) => ["active", "trial"].includes(card.accessState))
            ? "At least one product has access."
            : "Choose a plan to unlock full practice.",
        complete: subscriptionCards.value.some((card) => ["active", "trial"].includes(card.accessState)),
    },
]);

const readinessComplete = computed(() => readinessItems.value.filter((item) => item.complete).length);

const updatePreviewFromFile = (file) => {
    if (fileUrl.value) {
        URL.revokeObjectURL(fileUrl.value);
    }
    fileUrl.value = URL.createObjectURL(file);
};

const setFeedback = (message, type = "success") => {
    feedbackText.value = message;
    feedbackType.value = type;
};

const handleAvatarUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
        setFeedback("Choose a valid image file.", "error");
        event.target.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        setFeedback("Profile photo must be under 2 MB.", "error");
        event.target.value = "";
        return;
    }

    formData.value.avatar = file;
    updatePreviewFromFile(file);
    setFeedback("");
};

const getErrorMessage = (error) => {
    const validationErrors = error?.response?.data?.errors;
    if (validationErrors && typeof validationErrors === "object") {
        const firstKey = Object.keys(validationErrors)[0];
        if (firstKey && validationErrors[firstKey]?.[0]) {
            return validationErrors[firstKey][0];
        }
    }

    return error?.response?.data?.message || "Profile update failed. Please try again.";
};

const saveSettings = async () => {
    if (isSaving.value) return;

    const name = String(formData.value.name || "").trim();
    if (!name) {
        setFeedback("Enter your name before saving.", "error");
        return;
    }

    setFeedback("");
    isSaving.value = true;

    try {
        const data = new FormData();
        data.append("name", name);

        if (formData.value.avatar instanceof File) {
            data.append("avatar", formData.value.avatar);
        }

        const response = await axios.post("/account", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const updatedUser = response?.data?.data?.data || response?.data?.data || null;
        if (updatedUser && typeof updatedUser === "object") {
            authStore.updateUser({ ...(authStore.user || {}), ...updatedUser });
        }

        formData.value.name = name;
        formData.value.avatar = null;
        if (fileUrl.value) {
            URL.revokeObjectURL(fileUrl.value);
            fileUrl.value = null;
        }

        lastSavedAt.value = new Date().toLocaleString();
        setFeedback("Account updated successfully.");
    } catch (error) {
        setFeedback(getErrorMessage(error), "error");
        console.error("Error updating profile:", error);
    } finally {
        isSaving.value = false;
    }
};

onBeforeUnmount(() => {
    if (fileUrl.value) {
        URL.revokeObjectURL(fileUrl.value);
    }
});
</script>

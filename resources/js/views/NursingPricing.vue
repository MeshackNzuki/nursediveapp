<script setup lang="ts">
import { computed } from 'vue';
import CommonButton from '../components/Buttons/CommonButton.vue';
import { useMainStore } from '../stores';
import { useAuthStore } from '../stores/authStore';
import { useRoute, useRouter } from 'vue-router';
import { trackPaywallEvent } from '../utils/paywallEvents';

const PRODUCT_CODE = 'nursing';
const PRODUCT_TITLE = 'Nursing Test Bank Plans';
const PRODUCT_DESCRIPTION = 'Select a plan that matches your nursing school timeline and keep your practice consistent.';
const PRODUCT_FEATURES = [
    'RN and LPN practice questions',
    'Exit RN/LPN exam review sets',
    'HESI Exit exam practice',
    'Study Guides per topic',
    'Detailed Explanations and rationales',
    'AI study assistant for weak areas',
    'Performance tracking and analytics',
    '24/7 human support for questions and guidance',
];

const router = useRouter();
const route = useRoute();
const { plans } = useMainStore();
const { active, isTrial, wasTrial } = useAuthStore();

const productPlans = computed(() => {
    const sourcePlans = Array.isArray(plans) ? plans : [];

    return sourcePlans
        .filter((plan: any) => plan.product_code === PRODUCT_CODE && plan.name !== 'trial')
        .slice()
        .sort((a: any, b: any) => a.price - b.price);
});

const recommendedPlanId = computed(() => {
    const premium = productPlans.value.find((plan: any) => plan.name === 'premium');
    if (premium) return premium.id;
    const middle = productPlans.value[Math.floor((productPlans.value.length - 1) / 2)];
    return middle?.id;
});

const formatPlanName = (name: string) =>
    `${name.charAt(0).toUpperCase()}${name.slice(1).replace('_', ' ')}`;

const tierMessage = (name: string) => {
    if (name === 'standard') return 'Great for a focused short prep window.';
    if (name === 'premium') return 'Best balance of time, value, and flexibility.';
    if (name === 'premium_plus') return 'Maximum prep runway for mastery and retakes.';
    return 'Built for structured exam preparation.';
};

const buildCheckoutUrl = (plan: any) => {
    const params = new URLSearchParams();
    params.append('plan_id', String(plan.id));
    params.append('amount', String(plan.price));

    if (typeof route.query.redirect === 'string') {
        params.append('redirect', route.query.redirect);
    }

    trackPaywallEvent('checkout_started', {
        product: PRODUCT_CODE,
        plan_id: plan.id,
        plan_name: plan.name,
        amount: plan.price,
        placement: 'nursing_pricing_card',
    });

    router.push('/checkout?' + params.toString());
};

const savingsAmount = (plan: any) => {
    const initial = Number(plan?.initial || 0);
    const price = Number(plan?.price || 0);
    if (initial <= price || price <= 0) return null;
    return (initial - price).toFixed(2);
};

const savingsPercent = (plan: any) => {
    const initial = Number(plan?.initial || 0);
    const price = Number(plan?.price || 0);
    if (initial <= price || price <= 0) return null;
    return (((initial - price) / initial) * 100).toFixed(0);
};

const pricePerDay = (plan: any) => {
    const price = Number(plan?.price || 0);
    const days = Number(plan?.duration_days || 0);
    if (!days || !price) return null;
    return (price / days).toFixed(2);
};

const primaryButtonText = computed(() => {
    if (isTrial(PRODUCT_CODE)) return 'Upgrade Now';
    if (active(PRODUCT_CODE)) return 'Extend Subscription';
    if (wasTrial(PRODUCT_CODE)) return `Subscribe to ${PRODUCT_CODE.toUpperCase()}`;
    return 'Subscribe Now';
});

const isRecommended = (plan: any) => plan.id === recommendedPlanId.value;
</script>

<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll bg-slate-50 p-4 md:p-6 dark:bg-slate-950 dark:text-gray-300">
        <button @click="router.back()"
            class="absolute top-4 right-4 z-30 h-9 w-9 rounded-full border border-slate-300 bg-white/95 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center"
            aria-label="Close pricing page">
            &#10005;
        </button>

        <section class="py-3 px-4 text-center max-w-4xl mx-auto">
            <h1 class="text-2xl md:text-3xl font-extrabold mb-3 text-slate-950 tracking-tight dark:text-white">
                {{ PRODUCT_TITLE }}
            </h1>
            <p class="text-sm md:text-base text-slate-600 max-w-2xl mx-auto dark:text-slate-300">
                {{ PRODUCT_DESCRIPTION }}
            </p>
            <div class="mt-4 flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-700">
                <span class="rounded-full border border-sky-200 bg-sky-50 px-3 py-1">One payment</span>
                <span class="rounded-full border border-sky-200 bg-sky-50 px-3 py-1">No auto-billing</span>
                <span class="rounded-full border border-slate-200 bg-white px-3 py-1">Instant Nursing access</span>
            </div>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pb-10 mt-12">
            <article v-for="plan in productPlans" :key="plan.id"
                class="group relative overflow-hidden rounded-xl bg-white p-6 transition duration-300 dark:bg-slate-900"
                :class="isRecommended(plan)
                    ? 'border border-indigo-300 ring-2 ring-indigo-500 shadow-[0_18px_45px_-20px_rgba(79,70,229,0.45)] hover:-translate-y-1'
                    : 'border border-slate-200 shadow-[0_14px_35px_-20px_rgba(15,23,42,0.45)] hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(15,23,42,0.45)] dark:border-sky-800/70'">

                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500"></div>

                <div class="flex items-start justify-between gap-3">
                    <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold" :class="[
                        plan.name === 'premium_plus' ? 'bg-indigo-100 text-indigo-700' : '',
                        plan.name === 'premium' ? 'bg-sky-100 text-sky-700' : '',
                        plan.name === 'standard' ? 'bg-slate-100 text-slate-700' : '',
                    ]">
                        {{ formatPlanName(plan.name) }}
                    </span>
                    <span v-if="isRecommended(plan)"
                        class="inline-flex items-center rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-bold dark:bg-white dark:text-slate-950">
                        MOST POPULAR
                    </span>
                </div>

                <h3 class="text-2xl font-extrabold mt-4 text-slate-900 dark:text-white tracking-tight">{{ PRODUCT_TITLE
                    }}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">{{ tierMessage(plan.name) }}</p>

                <div
                    class="mt-5 rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:bg-slate-800/60 dark:border-slate-700">
                    <div class="flex items-end flex-wrap gap-2">
                        <span v-if="plan.initial" class="text-sm line-through text-rose-500 font-medium">${{
                            plan.initial }}</span>
                        <span class="text-4xl font-black text-slate-900 dark:text-white">${{ plan.price }}</span>
                        <span class="text-sm text-slate-600 dark:text-slate-300 font-semibold">/{{ plan.duration_days }}
                            days</span>
                    </div>
                    <p v-if="pricePerDay(plan)" class="text-xs text-slate-600 dark:text-slate-300 mt-2">Only ${{
                        pricePerDay(plan) }} / day</p>
                    <p v-if="savingsAmount(plan)" class="text-xs text-amber-700 dark:text-amber-300 mt-1">You save
                        ${{ savingsAmount(plan) }} ({{ savingsPercent(plan) }}%)</p>
                </div>

                <ul class="mt-5 space-y-2.5">
                    <li v-for="feature in PRODUCT_FEATURES" :key="feature"
                        class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <span
                            class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs font-bold">&#10003;</span>
                        <span>{{ feature }}</span>
                    </li>
                </ul>

                <div class="mt-6 space-y-2.5">
                    <CommonButton :buttonText="primaryButtonText"
                        classes="w-full bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                        :action="() => buildCheckoutUrl(plan)" />
                </div>

                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-3 text-center">
                    Secure checkout. Immediate Nursing access. No auto-billing.
                </p>
            </article>

            <div v-if="!productPlans.length"
                class="md:col-span-3 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-2xl p-8 bg-white/80">
                No plans are available right now for this product.
            </div>
        </section>

        <section class="max-w-6xl mx-auto scroll-mt-6 pb-16">
            <div
                class="rounded-xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm dark:bg-slate-900 dark:border-slate-700">
                <p class="text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Compare Features</p>
                <h2 class="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">Every Nursing plan unlocks the full practice toolkit.</h2>
                <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                    <div v-for="feature in PRODUCT_FEATURES" :key="feature"
                        class="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100">
                        <i class="pi pi-check-circle mr-1 text-sky-600"></i>{{ feature }}
                    </div>
                </div>
                <p class="mt-4 text-sm text-slate-600 dark:text-slate-300">
                    The difference between tiers is your access runway. Choose a short focused sprint, a balanced study
                    window, or the longest runway for mastery and retakes.
                </p>
            </div>
        </section>
    </div>
</template>

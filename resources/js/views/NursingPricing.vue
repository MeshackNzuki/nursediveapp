<script setup lang="ts">
import { computed } from 'vue';
import CommonButton from '../components/Buttons/CommonButton.vue';
import { useMainStore } from '../stores';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import Navigation from '../components/Navigation.vue';

const PRODUCT_CODE = 'nursing';
const PRODUCT_TITLE = 'Nursing Test Bank Plans';
const PRODUCT_DESCRIPTION = 'Select a plan that matches your nursing school timeline and keep your practice consistent.';
const PRODUCT_FEATURES = [
    'All Nursing Domains Covered',
    'Diagnostic performance reports',
    'Weak-area focus and review',
    'Comprehensive Study Guides',
];

const router = useRouter();
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
    params.append('amount', String(plan.price));
    params.append('id', String(plan.id));
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
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-white dark:text-gray-300">
        <button @click="router.back()"
            class="absolute top-4 right-4 z-30 h-9 w-9 rounded-full border border-slate-300 bg-white/95 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center"
            aria-label="Close pricing page">
            &#10005;
        </button>
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 opacity-40 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-cyan-200 via-emerald-200 to-teal-200 opacity-35 blur-[100px] rounded-full">
            </div>
        </div>

        <section class="py-3 px-4 text-center max-w-4xl mx-auto">
            <!-- <Navigation /> -->
            <h1 class="text-2xl md:text-3xl font-extrabold mb-3 text-slate-900 custom-underline-teal tracking-tight">
                {{ PRODUCT_TITLE }}
            </h1>
            <p class="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
                {{ PRODUCT_DESCRIPTION }}
            </p>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pb-10 mt-12">
            <article v-for="plan in productPlans" :key="plan.id"
                class="group relative overflow-hidden rounded-3xl bg-white/95 p-6 transition duration-300 dark:bg-sky-950"
                :class="isRecommended(plan)
                    ? 'border border-emerald-300 ring-2 ring-emerald-500 shadow-[0_18px_45px_-20px_rgba(16,185,129,0.45)] hover:-translate-y-1'
                    : 'border border-slate-200 shadow-[0_14px_35px_-20px_rgba(15,23,42,0.45)] hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(15,23,42,0.45)] dark:border-sky-800/70'">

                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                <div class="flex items-start justify-between gap-3">
                    <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold" :class="[
                        plan.name === 'premium_plus' ? 'bg-emerald-100 text-emerald-700' : '',
                        plan.name === 'premium' ? 'bg-teal-100 text-teal-700' : '',
                        plan.name === 'standard' ? 'bg-slate-100 text-slate-700' : '',
                    ]">
                        {{ formatPlanName(plan.name) }}
                    </span>
                    <span v-if="isRecommended(plan)"
                        class="inline-flex items-center rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-bold">
                        MOST POPULAR
                    </span>
                </div>

                <h3 class="text-2xl font-extrabold mt-4 text-slate-900 dark:text-white tracking-tight">{{ PRODUCT_TITLE
                }}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">{{ tierMessage(plan.name) }}</p>

                <div
                    class="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:bg-sky-900/30 dark:border-sky-800/60">
                    <div class="flex items-end flex-wrap gap-2">
                        <span v-if="plan.initial" class="text-sm line-through text-rose-500 font-medium">${{
                            plan.initial }}</span>
                        <span class="text-4xl font-black text-slate-900 dark:text-white">${{ plan.price }}</span>
                        <span class="text-sm text-slate-600 dark:text-slate-300 font-semibold">/{{ plan.duration_days }}
                            days</span>
                    </div>
                    <p v-if="pricePerDay(plan)" class="text-xs text-slate-600 dark:text-slate-300 mt-2">Only ${{
                        pricePerDay(plan) }} / day</p>
                    <p v-if="savingsAmount(plan)" class="text-xs text-emerald-700 dark:text-emerald-300 mt-1">You save
                        ${{ savingsAmount(plan) }} ({{ savingsPercent(plan) }}%)</p>
                </div>

                <ul class="mt-5 space-y-2.5">
                    <li v-for="feature in PRODUCT_FEATURES" :key="feature"
                        class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <span
                            class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">&#10003;</span>
                        <span>{{ feature }}</span>
                    </li>
                </ul>

                <div class="mt-6 space-y-2.5">
                    <CommonButton buttonText="Quick Buy"
                        classes="w-full bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                        :action="() => buildCheckoutUrl(plan)" />
                    <CommonButton :buttonText="primaryButtonText"
                        classes="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                        :action="() => buildCheckoutUrl(plan)" />
                </div>

                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-3 text-center">
                    Secure checkout. Immediate Nursing access.
                </p>
            </article>

            <div v-if="!productPlans.length"
                class="md:col-span-3 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-2xl p-8 bg-white/80">
                No plans are available right now for this product.
            </div>
        </section>

        <section class="max-w-6xl mx-auto pb-16">
            <div
                class="rounded-3xl border border-slate-200 bg-white/90 p-5 md:p-6 text-center shadow-sm dark:bg-sky-950 dark:border-sky-800/70">
                <p class="text-sm text-slate-600 dark:text-slate-300">
                    Nursing students who practice consistently and review weak areas tend to retain more and perform
                    better across exams.
                </p>
            </div>
        </section>
    </div>
</template>

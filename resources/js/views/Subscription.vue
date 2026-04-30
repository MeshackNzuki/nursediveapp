<script setup lang="ts">
import { computed } from 'vue';
import CommonButton from '../components/Buttons/CommonButton.vue';
import { useMainStore } from '../stores';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import Navigation from '../components/Navigation.vue';

type ProductCode = 'teas' | 'nursing' | 'nclex';

const productMeta: Record<ProductCode, { packageName: string; description: string; features: string[] }> = {
    teas: {
        packageName: 'TEAS 7 Questions',
        description: 'Targeted TEAS prep with high-yield practice and performance diagnostics.',
        features: ['Unlimited Access', 'TEAS-specific quizzes', 'Performance reports', 'Comprehensive study guides'],
    },
    nursing: {
        packageName: 'Nursing Test Bank',
        description: 'Course-aligned nursing practice to strengthen accuracy and confidence.',
        features: ['All Nursing Domains', 'Weak-area analysis', 'Performance reports', 'Comprehensive study guides'],
    },
    nclex: {
        packageName: 'NCLEX RN & PN',
        description: 'Exam-style NCLEX practice with simulation-ready preparation tools.',
        features: ['Unlimited Access', 'NCLEX-style quizzes', 'CAT simulations', 'Preparedness mock exams'],
    },
};

const router = useRouter();
const { plans } = useMainStore();
const { active, isTrial, wasTrial } = useAuthStore();

const sortedPlans = computed(() =>
    (Array.isArray(plans) ? plans : []).slice().sort((a: any, b: any) => a.price - b.price)
);

const basePackages = computed(() =>
    sortedPlans.value.filter((plan: any) =>
        plan.name === 'standard' && ['teas', 'nursing', 'nclex'].includes(plan.product_code)
    )
);

const transformedBasePackages = computed(() =>
    basePackages.value.map((plan: any) => {
        const meta = productMeta[plan.product_code as ProductCode];
        return {
            ...plan,
            package_name: meta?.packageName || 'Plan',
            description: meta?.description || '',
            features: meta?.features || [],
        };
    })
);

const buildCheckoutUrl = (plan: any) => {
    const params = new URLSearchParams();
    params.append('amount', String(plan.price));
    params.append('id', String(plan.id));
    router.push('/checkout?' + params.toString());
};

const productPricingRoute = (productCode: string) => `/${productCode}-pricing`;

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

const primaryButtonText = (productCode: string) => {
    if (isTrial(productCode)) return 'Upgrade Now';
    if (active(productCode)) return 'Extend Subscription';
    if (wasTrial(productCode)) return `Subscribe to ${productCode.toUpperCase()}`;
    return 'Subscribe Now';
};
</script>

<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-white dark:text-gray-300">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-sky-200 via-cyan-200 to-emerald-200 opacity-40 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-cyan-200 opacity-30 blur-[100px] rounded-full">
            </div>
        </div>

        <section class="py-3 px-4 text-center max-w-4xl mx-auto">
            <!-- <Navigation /> -->
            <h1 class="text-2xl md:text-3xl font-extrabold mb-3 text-slate-900 custom-underline-teal tracking-tight">
                Choose Your Prep Path
            </h1>
            <p class="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
                Professionally structured plans for TEAS, Nursing School, and NCLEX. Start with a focused package and
                upgrade anytime as your exam date gets closer.
            </p>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pb-10 mt-12">
            <article v-for="plan in transformedBasePackages" :key="plan.id"
                class="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_14px_35px_-20px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(15,23,42,0.45)] dark:bg-sky-950 dark:border-sky-800/70">

                <div class="absolute inset-x-0 top-0 h-1" :class="[
                    plan.product_code === 'teas' ? 'bg-gradient-to-r from-cyan-400 to-sky-500' : '',
                    plan.product_code === 'nursing' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : '',
                    plan.product_code === 'nclex' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : '',
                ]"></div>

                <div class="flex items-start justify-between gap-3">
                    <span
                        class="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-bold tracking-wide">
                        {{ plan.product_code.toUpperCase() }}
                    </span>
                    <span v-if="savingsPercent(plan)"
                        class="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold">
                        SAVE {{ savingsPercent(plan) }}%
                    </span>
                </div>

                <h3 class="text-2xl font-extrabold mt-4 text-slate-900 dark:text-white tracking-tight">{{
                    plan.package_name }}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">{{ plan.description }}</p>

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
                        ${{ savingsAmount(plan) }} today</p>
                </div>

                <ul class="mt-5 space-y-2.5">
                    <li v-for="feature in plan.features" :key="feature"
                        class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <span
                            class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">&#10003;</span>
                        <span>{{ feature }}</span>
                    </li>
                </ul>

                <div class="mt-6 space-y-2.5">
                    <CommonButton buttonText="Quick Buy"
                        classes="w-full bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                        :action="() => buildCheckoutUrl(plan)" />
                    <CommonButton :buttonText="primaryButtonText(plan.product_code)"
                        classes="w-full bg-sky-600 text-white hover:bg-sky-700"
                        :action="() => buildCheckoutUrl(plan)" />
                    <CommonButton buttonText="View All Plan Tiers"
                        classes="w-full bg-emerald-500 text-white hover:bg-emerald-600"
                        :action="() => router.push(productPricingRoute(plan.product_code))" />
                </div>

                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-3 text-center">
                    Secure checkout. Instant access after payment.
                </p>
            </article>
        </section>

        <section class="max-w-6xl mx-auto pb-16">
            <div
                class="rounded-3xl border border-slate-200 bg-white/90 p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm dark:bg-sky-950 dark:border-sky-800/70">
                <div class="rounded-2xl bg-slate-50 dark:bg-sky-900/30 p-4">
                    <p class="text-xs uppercase tracking-wide text-slate-500">Built For Results</p>
                    <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">Practice with exam-style
                        questions and measurable progress tracking.</p>
                </div>
                <div class="rounded-2xl bg-slate-50 dark:bg-sky-900/30 p-4">
                    <p class="text-xs uppercase tracking-wide text-slate-500">Flexible Upgrades</p>
                    <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">Start with a core plan and
                        upgrade anytime without friction.</p>
                </div>
                <div class="rounded-2xl bg-slate-50 dark:bg-sky-900/30 p-4">
                    <p class="text-xs uppercase tracking-wide text-slate-500">Trusted Checkout</p>
                    <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">Fast, secure payment flow
                        with immediate subscription activation.</p>
                </div>
            </div>
        </section>
    </div>
</template>

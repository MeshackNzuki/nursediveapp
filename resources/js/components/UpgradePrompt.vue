<template>
    <section class="upgrade-card" :class="variant === 'inline' ? 'upgrade-card--inline' : ''">
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
            <div class="ui-drift absolute -top-24 -right-16 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl"></div>
            <div class="ui-drift-slow absolute -bottom-28 -left-16 h-64 w-64 rounded-full blur-3xl theme-glow opacity-70"></div>
            <div class="absolute inset-0 opacity-[0.28] [background-image:radial-gradient(circle_at_1px_1px,var(--theme-border)_1px,transparent_0)] [background-size:22px_22px]"></div>
        </div>

        <div class="relative" :class="variant === 'inline' ? 'flex flex-col gap-4 md:flex-row md:items-center' : ''">
            <div class="min-w-0 flex-1">
                <span class="dash-chip border-amber-200 bg-amber-50 py-1 text-[11px] text-amber-700">
                    <i class="pi pi-sparkles text-[10px]"></i> {{ eyebrow }}
                </span>
                <h3 class="mt-3 text-xl font-black tracking-tight text-slate-950" :class="variant === 'inline' ? 'md:text-lg' : 'md:text-2xl'">
                    {{ resolvedTitle }}
                </h3>
                <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600">{{ resolvedMessage }}</p>

                <ul v-if="variant !== 'inline'" class="mt-4 grid gap-2 sm:grid-cols-2">
                    <li v-for="(benefit, index) in resolvedBenefits" :key="benefit.text"
                        class="ui-rise flex items-start gap-2.5 rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-slate-700 backdrop-blur-sm"
                        :style="{ animationDelay: `${120 + index * 60}ms` }">
                        <span class="dash-icon-tile theme-icon mt-0.5 h-6 w-6 shrink-0 text-[11px]"><i :class="benefit.icon"></i></span>
                        <span class="leading-5">{{ benefit.text }}</span>
                    </li>
                </ul>
            </div>

            <div class="relative mt-5 flex flex-col gap-2 sm:flex-row sm:items-center" :class="variant === 'inline' ? 'md:mt-0 md:shrink-0 md:flex-col md:items-stretch' : ''">
                <button type="button" class="dash-btn theme-surface theme-shadow min-h-11 px-5 text-sm" @click="goToPlans">
                    <i class="pi pi-unlock text-xs"></i> {{ primaryLabel }}
                </button>
                <button v-if="showContinue" type="button" class="dash-btn-ghost min-h-11 px-5 text-sm" @click="$emit('continue')">
                    {{ continueLabel }}
                </button>
            </div>
        </div>

        <p v-if="variant !== 'inline'" class="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-500">
            <span class="inline-flex items-center gap-1"><i class="pi pi-shield text-[10px] text-emerald-500"></i> One payment, no auto-billing</span>
            <span class="inline-flex items-center gap-1"><i class="pi pi-bolt text-[10px] text-amber-500"></i> Instant access</span>
            <span v-if="trialDaysLeft !== null" class="inline-flex items-center gap-1"><i class="pi pi-clock text-[10px] text-sky-500"></i> {{ trialCopy }}</span>
        </p>
    </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { trackPaywallEvent } from "../utils/paywallEvents";

/**
 * A welcoming upgrade prompt. Frames premium as "more of what you're already
 * doing" rather than a wall: keeps the learner's context, lists concrete
 * benefits, and always offers a way to continue.
 */
const props = withDefaults(
    defineProps<{
        product: "teas" | "nursing" | "nclex";
        /** 'card' fills a panel or overlay; 'inline' is a slim banner */
        variant?: "card" | "inline";
        /** What the learner was trying to do, e.g. "chapter lessons" */
        feature?: string;
        title?: string;
        message?: string;
        benefits?: { icon: string; text: string }[];
        primaryLabel?: string;
        continueLabel?: string;
        showContinue?: boolean;
        /** Analytics placement tag */
        placement?: string;
    }>(),
    {
        variant: "card",
        feature: "",
        title: "",
        message: "",
        benefits: () => [],
        primaryLabel: "See plans",
        continueLabel: "Keep exploring free",
        showContinue: true,
        placement: "upgrade_prompt",
    },
);

defineEmits<{ (e: "continue"): void }>();

const router = useRouter();
const authStore = useAuthStore();

const LABELS = { teas: "TEAS", nursing: "Nursing", nclex: "NCLEX" } as const;
const DEFAULT_BENEFITS = {
    teas: [
        { icon: "pi pi-book", text: "Every TEAS chapter guide with lesson and quiz" },
        { icon: "pi pi-list", text: "All Math, Science, Language and Reading sets" },
        { icon: "pi pi-chart-line", text: "Saved scores, trends and pass probability" },
        { icon: "pi pi-comments", text: "Rationales on every question" },
    ],
    nursing: [
        { icon: "pi pi-book", text: "Full study chapters and lesson pages" },
        { icon: "pi pi-briefcase", text: "RN, LPN, HESI and exit exam banks" },
        { icon: "pi pi-chart-line", text: "Performance analytics and weak-area tracking" },
        { icon: "pi pi-comments", text: "Rationales on every question" },
    ],
    nclex: [
        { icon: "pi pi-desktop", text: "Adaptive CAT simulator runs" },
        { icon: "pi pi-list", text: "Every linear and readiness set" },
        { icon: "pi pi-chart-line", text: "Readiness intelligence and reports" },
        { icon: "pi pi-comments", text: "Rationales on every question" },
    ],
} as const;

const firstName = computed(() => {
    const name = String((authStore.user as any)?.name || "").trim();
    return name ? name.split(/\s+/)[0] : "";
});

const trialDaysLeft = computed<number | null>(() => {
    try {
        if (!authStore.isTrial(props.product)) return null;
        const days = Number(authStore.daysLeft(props.product));
        return Number.isFinite(days) ? days : null;
    } catch {
        return null;
    }
});

const trialCopy = computed(() => {
    const d = trialDaysLeft.value ?? 0;
    return d > 0 ? `${d} trial ${d === 1 ? "day" : "days"} left` : "Trial ending today";
});

const eyebrow = computed(() => `More ${LABELS[props.product]} for you`);

const resolvedTitle = computed(() => {
    if (props.title) return props.title;
    const who = firstName.value ? `, ${firstName.value}` : "";
    return props.feature ? `You're ready for the full ${props.feature}${who}.` : `Go further with ${LABELS[props.product]} Premium${who}.`;
});

const resolvedMessage = computed(() => {
    if (props.message) return props.message;
    return `You've already started. Premium opens up everything in ${LABELS[props.product]} so your progress, rationales and analytics all stay in one place.`;
});

const resolvedBenefits = computed(() => (props.benefits.length ? props.benefits : DEFAULT_BENEFITS[props.product]));

const goToPlans = () => {
    trackPaywallEvent("pricing_clicked", { product: props.product, placement: props.placement });
    router.push({ path: authStore.pricingRoute(props.product), query: { redirect: router.currentRoute.value.fullPath } });
};
</script>

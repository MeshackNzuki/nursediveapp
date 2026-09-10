<template>
    <div class="auth-shell">
        <!-- ================= BRAND PANEL ================= -->
        <aside class="auth-brand">
            <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                <div class="ui-drift absolute -top-32 -right-24 h-96 w-96 rounded-full blur-3xl theme-glow opacity-60"></div>
                <div class="ui-drift-slow absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-cyan-400/15 blur-3xl"></div>
                <div class="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.9)_1px,transparent_0)] [background-size:26px_26px]"></div>
                <ExamIcon :size="420" class="absolute -bottom-24 -right-20 opacity-[0.07]" />
            </div>

            <div class="relative flex h-full flex-col">
                <router-link to="/" class="inline-flex w-fit items-center gap-3 text-white">
                    <span class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 shadow-lg shadow-sky-950/30">
                        <img src="../../assets/logo.png" class="h-8 w-8 object-contain" alt="Nursenex logo" />
                    </span>
                    <span>
                        <span class="block text-sm font-black uppercase tracking-[0.2em]">Nursenex</span>
                        <span class="block text-[11px] text-sky-200/90">Plan, Study, Excel</span>
                    </span>
                </router-link>

                <div class="my-auto py-10">
                    <span class="dash-chip py-1 text-[11px]" :class="brandChipClass">
                        <span class="relative flex h-1.5 w-1.5">
                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70"></span>
                            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-current"></span>
                        </span>
                        {{ eyebrow }}
                    </span>
                    <h2 class="mt-5 max-w-md text-3xl font-black leading-[1.08] tracking-tight text-white xl:text-4xl">
                        {{ title }}
                    </h2>
                    <p class="mt-4 max-w-md text-sm leading-6 text-sky-100/85">{{ subtitle }}</p>

                    <ul class="mt-8 space-y-3">
                        <li v-for="(feature, index) in features" :key="feature.text"
                            class="ui-rise flex items-start gap-3 text-sm text-sky-50" :style="{ animationDelay: `${200 + index * 80}ms` }">
                            <span class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-xs text-white">
                                <i :class="feature.icon"></i>
                            </span>
                            <span class="leading-6">{{ feature.text }}</span>
                        </li>
                    </ul>
                </div>

                <div class="grid grid-cols-3 gap-2">
                    <div v-for="stat in stats" :key="stat.label" class="rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-sm">
                        <p class="text-lg font-black leading-tight text-white">{{ stat.value }}</p>
                        <p class="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-200/80">{{ stat.label }}</p>
                    </div>
                </div>
            </div>
        </aside>

        <!-- ================= FORM PANEL ================= -->
        <main class="auth-main">
            <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                <div class="ui-drift absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl theme-glow opacity-50"></div>
                <div class="absolute inset-0 opacity-[0.25] [background-image:radial-gradient(circle_at_1px_1px,var(--theme-border)_1px,transparent_0)] [background-size:24px_24px]"></div>
            </div>

            <!-- compact brand for small screens -->
            <router-link to="/" class="relative mb-6 inline-flex items-center gap-2 lg:hidden">
                <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(11_40_69)] shadow">
                    <img src="../../assets/logo.png" class="h-6 w-6 object-contain" alt="Nursenex logo" />
                </span>
                <span class="text-sm font-black uppercase tracking-[0.18em] text-slate-900">Nursenex</span>
            </router-link>

            <div class="auth-card ui-rise">
                <div v-if="steps.length" class="auth-steps" role="list" :aria-label="`${steps.length} steps`">
                    <div v-for="(label, index) in steps" :key="label" class="auth-step" role="listitem"
                        :class="index + 1 < currentStep ? 'is-done' : index + 1 === currentStep ? 'is-current' : ''">
                        <span class="auth-step-dot">
                            <i v-if="index + 1 < currentStep" class="pi pi-check text-[9px]"></i>
                            <span v-else>{{ index + 1 }}</span>
                        </span>
                        <span class="auth-step-label">{{ label }}</span>
                        <span v-if="index < steps.length - 1" class="auth-step-line"></span>
                    </div>
                </div>

                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <h1 class="text-2xl font-black tracking-tight text-slate-950">{{ heading }}</h1>
                        <p v-if="lead" class="mt-1 text-sm text-slate-600">{{ lead }}</p>
                    </div>
                    <slot name="heading-action"></slot>
                </div>

                <div class="mt-6">
                    <slot></slot>
                </div>
            </div>

            <div class="relative mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-500">
                <span class="inline-flex items-center gap-1"><i class="pi pi-lock text-[10px]"></i> Secure sign-in</span>
                <span class="inline-flex items-center gap-1"><i class="pi pi-shield text-[10px]"></i> No auto-billing</span>
                <a href="mailto:support@nursenex.com" class="inline-flex items-center gap-1 hover:text-slate-800"><i class="pi pi-envelope text-[10px]"></i> support@nursenex.com</a>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import ExamIcon from "../ExamIcon.vue";

withDefaults(
    defineProps<{
        /** Small pill above the brand headline */
        eyebrow: string;
        /** Brand panel headline and copy */
        title: string;
        subtitle: string;
        /** Form card heading and lead line */
        heading: string;
        lead?: string;
        features?: { icon: string; text: string }[];
        stats?: { value: string; label: string }[];
        /** Optional step rail above the form */
        steps?: string[];
        currentStep?: number;
        /** Pill colour on the brand panel */
        brandChipClass?: string;
    }>(),
    {
        lead: "",
        features: () => [],
        stats: () => [
            { value: "3", label: "Exam tracks" },
            { value: "Real", label: "Past-exam questions" },
            { value: "24/7", label: "Human support" },
        ],
        steps: () => [],
        currentStep: 1,
        brandChipClass: "border-white/15 bg-white/10 text-cyan-100",
    },
);
</script>

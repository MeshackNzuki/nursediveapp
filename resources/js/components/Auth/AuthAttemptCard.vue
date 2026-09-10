<template>
    <section v-if="show" class="ui-rise relative mb-5 overflow-hidden rounded-2xl border p-4" :class="attempt ? 'border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-white' : 'border-slate-200 bg-light-blue-500'">
        <div class="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full blur-3xl" :class="attempt ? 'bg-emerald-300/40' : 'theme-glow opacity-60'" aria-hidden="true"></div>

        <!-- Saved attempt -->
        <div v-if="attempt" class="relative flex items-start gap-3">
            <div class="relative h-16 w-16 shrink-0">
                <svg class="h-16 w-16 -rotate-90" viewBox="0 0 52 52" aria-hidden="true">
                    <circle cx="26" cy="26" r="22" fill="none" stroke="currentColor" stroke-width="5" class="text-emerald-100" />
                    <circle cx="26" cy="26" r="22" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"
                        :stroke-dasharray="ring" :stroke-dashoffset="ring * (1 - score / 100)" class="text-emerald-500 transition-[stroke-dashoffset] duration-1000 ease-out" />
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-sm font-black tabular-nums text-slate-900">{{ score }}%</span>
            </div>
            <div class="min-w-0 flex-1">
                <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                    <i class="pi pi-check-circle mr-1"></i>Your {{ attempt.productLabel }} result is waiting
                </p>
                <p class="mt-1 text-sm font-extrabold leading-snug text-slate-950">
                    {{ attempt.examTitle ? `${attempt.examTitle}: ` : "" }}{{ mode === "login" ? "log in" : "create your account" }} and we'll file it under your name.
                </p>
                <ul class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-600">
                    <li class="inline-flex items-center gap-1"><i class="pi pi-file text-[10px] text-emerald-500"></i> Full report with rationales</li>
                    <li class="inline-flex items-center gap-1"><i class="pi pi-chart-line text-[10px] text-emerald-500"></i> Counts toward your analytics</li>
                    <li class="inline-flex items-center gap-1"><i class="pi pi-history text-[10px] text-emerald-500"></i> Review it any time</li>
                </ul>
                <p class="mt-2 text-[11px] text-slate-500">Nothing to redo. The attempt saves automatically the moment you're in.</p>
            </div>
        </div>

        <!-- Redirect without a saved attempt -->
        <div v-else class="relative flex items-start gap-3">
            <span class="dash-icon-tile theme-icon h-10 w-10 shrink-0"><i :class="destinationIcon"></i></span>
            <div class="min-w-0 flex-1">
                <p class="text-[10px] font-bold uppercase tracking-[0.14em] theme-text">Pick up where you left off</p>
                <p class="mt-1 text-sm font-extrabold leading-snug text-slate-950">
                    {{ mode === "login" ? "Log in" : "Create a free account" }} and we'll take you straight back to {{ destinationLabel }}.
                </p>
                <p class="mt-1 text-[11px] text-slate-500">Your scores, reports, and streak stay tied to your account.</p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { getPendingAttempt } from "../../utils/pendingAttempt";

const props = withDefaults(defineProps<{ mode?: "login" | "register" }>(), { mode: "login" });

const route = useRoute();
const attempt = computed(() => getPendingAttempt());
const redirect = computed(() => String(route.query.redirect || ""));
const wantsSave = computed(() => String(route.query.saveAttempt || "") === "1");

const show = computed(() => !!attempt.value || wantsSave.value || /^\/(teas|nursing|nclex)/.test(redirect.value));

const score = computed(() => Math.max(0, Math.min(100, Math.round(Number(attempt.value?.score) || 0))));
const ring = 2 * Math.PI * 22;

const destination = computed(() => {
    const path = redirect.value;
    if (/^\/nclex/.test(path)) return { label: "NCLEX prep", icon: "pi pi-bolt" };
    if (/^\/nursing/.test(path)) return { label: "your nursing test bank", icon: "pi pi-briefcase" };
    if (/^\/teas/.test(path)) return { label: "TEAS prep", icon: "pi pi-file-edit" };
    return { label: "where you were", icon: "pi pi-compass" };
});
const destinationLabel = computed(() => {
    const path = redirect.value;
    if (/\/exam\//.test(path)) return `your ${destination.value.label.replace("your ", "")} exam`;
    if (/performance-report/.test(path)) return "your performance report";
    if (/study|guide|lessons/.test(path)) return "your study guide";
    return destination.value.label;
});
const destinationIcon = computed(() => destination.value.icon);
</script>

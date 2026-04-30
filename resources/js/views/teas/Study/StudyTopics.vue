<template>
  <div
    class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-slate-50 dark:bg-sky-950 text-slate-800 dark:text-slate-100">
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div
        class="absolute -top-20 -left-40 h-[500px] w-[500px] bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-200 opacity-35 blur-[120px] rounded-full">
      </div>
      <div
        class="absolute top-28 right-2 h-[380px] w-[380px] bg-gradient-to-r from-teal-300 via-amber-200 to-cyan-200 opacity-30 blur-[100px] rounded-full">
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto">
      <section
        class="relative overflow-hidden rounded-[32px] border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-emerald-50 p-6 lg:p-8 shadow-[0_24px_70px_-36px_rgba(13,148,136,0.55)] dark:border-cyan-800 dark:from-slate-900 dark:via-sky-900 dark:to-emerald-950">
        <div
          class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_22%,rgba(14,165,233,0.20),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.20),transparent_45%)] dark:bg-[radial-gradient(circle_at_18%_22%,rgba(34,211,238,0.22),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(52,211,153,0.18),transparent_45%)]">
        </div>
        <div class="relative">
          <p
            class="inline-flex items-center rounded-full border border-cyan-200 bg-white/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:border-cyan-700 dark:bg-slate-900/70 dark:text-cyan-300">
            TEAS Study Guide
          </p>
          <h1 class="mt-4 text-2xl  font-black text-slate-900 dark:text-white">
            Choose Your Premium Prep Track
          </h1>
          <p class="mt-3 max-w-3xl text-sm lg:text-base text-slate-600 dark:text-slate-300">
            Target the exact TEAS domain you want to improve. Every guide is structured for faster confidence and
            cleaner score gains.
          </p>
          <div class="mt-5 flex flex-wrap gap-3">
            <span
              class="rounded-2xl border border-cyan-200 bg-white/85 px-4 py-2 text-sm font-semibold text-cyan-700 dark:border-cyan-700 dark:bg-slate-900/70 dark:text-cyan-200">
              {{ subjects.length }} focused guides
            </span>
            <span
              class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
              Exam-aligned flow
            </span>
            <span
              class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200">
              Premium learning UI
            </span>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
        <RouterLink v-for="(subject, i) in subjects" :key="i" :to="`/teas/guide-chapters/${subject.id}`"
          class="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-32px_rgba(14,116,144,0.65)] dark:border-sky-800/70 dark:bg-slate-900/70 dark:hover:shadow-[0_26px_60px_-35px_rgba(6,182,212,0.7)]">
          <div
            :class="['absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100', subject.glow]">
          </div>
          <div class="relative flex h-full flex-col">
            <div class="flex items-start justify-between gap-3">
              <span
                :class="['inline-flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ring-white/60', subject.iconBg]">
                <i :class="subject.icon" class="text-lg"></i>
              </span>
              <span
                class="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {{ subject.tag }}
              </span>
            </div>

            <h2 class="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              {{ subject.title }}
            </h2>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ subject.description }}</p>
            <p class="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {{ subject.meta }}
            </p>

            <div class="mt-5">
              <CommonButton button-text="Open Guide" :classes="`w-full border-0 ${subject.button}`" />
            </div>
          </div>
        </RouterLink>
      </div>

      <section
        class="relative mt-8 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 p-5 lg:p-6 shadow-[0_14px_40px_-30px_rgba(15,23,42,0.55)] dark:border-sky-800/70 dark:bg-slate-900/75">
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(56,189,248,0.18),transparent_44%),radial-gradient(circle_at_90%_0,rgba(16,185,129,0.14),transparent_36%)] dark:bg-[radial-gradient(circle_at_10%_15%,rgba(34,211,238,0.16),transparent_44%),radial-gradient(circle_at_90%_0,rgba(52,211,153,0.12),transparent_36%)]">
        </div>

        <div class="relative flex flex-col gap-1">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Quick exam
            access</p>
          <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">Jump straight to TEAS exams</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Launch a targeted test bank in one tap, then monitor your progress from the performance report.
          </p>
        </div>

        <div class="relative mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <RouterLink v-for="exam in quickExams" :key="exam.id" :to="exam.route"
            class="group rounded-2xl border border-white/80 bg-white/95 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-28px_rgba(14,116,144,0.65)] dark:border-sky-800/70 dark:bg-slate-900/80 dark:hover:shadow-[0_18px_40px_-28px_rgba(6,182,212,0.75)]">
            <div class="flex items-start justify-between gap-2">
              <span
                :class="['inline-flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ring-white/60', exam.iconBg]">
                <i :class="exam.icon"></i>
              </span>
              <span
                class="rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {{ exam.badge }}
              </span>
            </div>
            <h4 class="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">{{ exam.label }}</h4>
            <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">{{ exam.helper }}</p>
            <div class="mt-3 flex items-center justify-between">
              <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', exam.countClass]">{{ exam.quantity
                }}</span>
              <span
                class="text-xs font-semibold text-slate-500 group-hover:text-sky-600 dark:text-slate-300 dark:group-hover:text-cyan-300">
                Open <i class="pi pi-arrow-right"></i>
              </span>
            </div>
          </RouterLink>
        </div>

        <div class="relative mt-6 border-t border-dashed border-slate-300 pt-4 dark:border-sky-800">
          <router-link to="/teas/performance-analysis"
            class="mx-auto flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition duration-300 hover:brightness-105 hover:shadow-lg">
            View Performance Report
            <i class="pi pi-chart-line"></i>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import CommonButton from "../../../components/Buttons/CommonButton.vue";

const subjects = ref([
  {
    id: "math_guide",
    title: "Mathematics",
    description: "Master quantitative reasoning, algebra, measurement, and problem solving.",
    icon: "pi pi-calculator",
    tag: "Core",
    meta: "Numbers, formulas, speed",
    iconBg: "bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-700 dark:from-sky-900/70 dark:to-cyan-900/70 dark:text-sky-200",
    glow: "bg-gradient-to-br from-sky-200/45 via-transparent to-transparent dark:from-sky-500/20",
    button: "bg-gradient-to-r from-sky-600 to-cyan-500 text-white hover:from-sky-500 hover:to-cyan-400 dark:from-sky-500 dark:to-cyan-400 dark:text-slate-950",
  },
  {
    id: "english_guide",
    title: "English",
    description: "Improve grammar, punctuation, sentence structure, and language usage.",
    icon: "pi pi-language",
    tag: "Language",
    meta: "Grammar, usage, clarity",
    iconBg: "bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 dark:from-indigo-900/70 dark:to-violet-900/70 dark:text-indigo-200",
    glow: "bg-gradient-to-br from-indigo-200/40 via-transparent to-transparent dark:from-indigo-500/20",
    button: "bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:from-indigo-500 hover:to-violet-400 dark:from-indigo-500 dark:to-violet-400",
  },
  {
    id: "science_guide",
    title: "Science",
    description: "Understand anatomy, chemistry, biology, and physical science essentials.",
    icon: "pi pi-sliders-h",
    tag: "High Yield",
    meta: "Systems, concepts, recall",
    iconBg: "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-900/70 dark:to-teal-900/70 dark:text-emerald-200",
    glow: "bg-gradient-to-br from-emerald-200/40 via-transparent to-transparent dark:from-emerald-500/20",
    button: "bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-400 dark:from-emerald-500 dark:to-teal-400 dark:text-slate-950",
  },
  {
    id: "reading_guide",
    title: "Reading",
    description: "Develop comprehension, inference skills, and analytical reading habits.",
    icon: "pi pi-book",
    tag: "Strategy",
    meta: "Passages, inference, speed",
    iconBg: "bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/70 dark:to-orange-900/70 dark:text-amber-200",
    glow: "bg-gradient-to-br from-amber-200/40 via-transparent to-transparent dark:from-amber-500/20",
    button: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 dark:from-amber-500 dark:to-orange-400 dark:text-slate-950",
  },
]);

const quickExams = ref([
  {
    id: "math_exam",
    route: "/teas/test-bank-loader/2",
    label: "TEAS Math",
    quantity: "80+ questions",
    badge: "Math",
    helper: "Problem solving, algebra, and ratios.",
    icon: "pi pi-calculator text-sky-700 dark:text-sky-200",
    iconBg: "bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-900/60 dark:to-cyan-900/60",
    countClass: "bg-sky-100 text-sky-700 dark:bg-sky-900/70 dark:text-sky-200",
  },
  {
    id: "language_exam",
    route: "/teas/test-bank-loader/8",
    label: "TEAS Language",
    quantity: "70+ questions",
    badge: "English",
    helper: "Grammar, punctuation, and usage.",
    icon: "pi pi-language text-indigo-700 dark:text-indigo-200",
    iconBg: "bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/60 dark:to-violet-900/60",
    countClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/70 dark:text-indigo-200",
  },
  {
    id: "science_exam",
    route: "/teas/test-bank-loader/4",
    label: "TEAS Science",
    quantity: "67+ questions",
    badge: "Science",
    helper: "Anatomy, biology, and chemistry.",
    icon: "pi pi-sliders-h text-emerald-700 dark:text-emerald-200",
    iconBg: "bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/60 dark:to-teal-900/60",
    countClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-200",
  },
  {
    id: "reading_exam",
    route: "/teas/test-bank-loader/6",
    label: "TEAS Reading",
    quantity: "80+ questions",
    badge: "Reading",
    helper: "Comprehension and passage analysis.",
    icon: "pi pi-book text-amber-700 dark:text-amber-200",
    iconBg: "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/60 dark:to-orange-900/60",
    countClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/70 dark:text-amber-200",
  },
]);
</script>

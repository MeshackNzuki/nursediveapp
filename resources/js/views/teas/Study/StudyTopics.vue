<template>
  <div class="dash-shell">
    <div class="mx-auto max-w-screen-2xl space-y-6">
      <ProductBreadcrumb product="teas" :items="[{ label: 'Study guides' }]" />

      <!-- ================= HERO ================= -->
      <section class="ui-rise dash-card p-5 md:p-7">
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <div class="ui-drift absolute -top-28 -right-20 h-80 w-80 rounded-full blur-3xl theme-glow opacity-70"></div>
          <div class="absolute inset-0 opacity-[0.28] [background-image:radial-gradient(circle_at_1px_1px,var(--theme-border)_1px,transparent_0)] [background-size:24px_24px]"></div>
        </div>
        <div class="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div class="min-w-0">
            <p class="dash-eyebrow theme-text inline-flex items-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="theme-dot absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"></span>
                <span class="theme-dot relative inline-flex h-2 w-2 rounded-full"></span>
              </span>
              TEAS Study Guides
            </p>
            <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
              Learn it, then prove it.
            </h1>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Four TEAS domains, each split into short chapters. Read a lesson, take its quiz, and watch the section
              light up on your dashboard.
            </p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="analysis-pill theme-soft border">{{ subjects.length }} guides</span>
              <span class="analysis-pill border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">Lesson + quiz per chapter</span>
              <span v-if="totalRead" class="analysis-pill border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">{{ totalRead }} lessons read</span>
            </div>
          </div>

          <!-- How it works -->
          <ol class="grid grid-cols-3 gap-2 lg:w-[420px]">
            <li v-for="(step, i) in steps" :key="step.label" class="dash-tile-soft flex flex-col items-center gap-1.5 px-2 py-3 text-center">
              <span class="dash-icon-tile theme-icon h-9 w-9 text-sm"><i :class="step.icon"></i></span>
              <span class="text-[10px] font-black uppercase tracking-wide text-slate-400">Step {{ i + 1 }}</span>
              <span class="text-xs font-bold text-slate-800 dark:text-slate-100">{{ step.label }}</span>
            </li>
          </ol>
        </div>
      </section>

      <!-- ================= GUIDES ================= -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RouterLink v-for="(subject, i) in subjects" :key="subject.id" :to="`/teas/guide-chapters/${subject.id}`"
          class="group dash-card-white dash-hover-lift ui-rise relative flex h-full flex-col" :class="subject.borderClass"
          :style="{ animationDelay: `${120 + i * 70}ms` }">
          <div class="pointer-events-none absolute inset-0" aria-hidden="true">
            <div class="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-linear-to-br opacity-70 blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-100" :class="subject.washClass"></div>
            <div class="ui-pan absolute inset-0 opacity-[0.09] transition-opacity duration-500 group-hover:opacity-[0.16]" :class="[subject.patternClass, subject.inkClass]"></div>
            <i class="absolute -bottom-6 -right-4 text-[104px] opacity-[0.07] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" :class="[subject.icon, subject.inkClass]"></i>
          </div>

          <div class="relative flex items-start justify-between gap-3">
            <span class="dash-icon-tile h-12 w-12 text-xl shadow-lg group-hover:scale-110 group-hover:-rotate-3" :class="subject.tileClass">
              <i :class="subject.icon"></i>
            </span>
            <span class="analysis-pill border border-current/20 bg-white/70 text-[10px] uppercase tracking-wide backdrop-blur-sm dark:bg-slate-950/40" :class="subject.inkClass">{{ subject.tag }}</span>
          </div>

          <h2 class="relative mt-4 text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">{{ subject.title }}</h2>
          <p class="relative mt-1.5 text-sm leading-5 text-slate-600 dark:text-slate-300">{{ subject.description }}</p>

          <div class="relative mt-4 flex flex-wrap gap-1.5">
            <span v-for="topic in subject.topics" :key="topic" class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ topic }}</span>
          </div>

          <div class="relative mt-auto flex items-center justify-between gap-2 pt-5">
            <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <i class="pi pi-clock mr-1 text-[10px]"></i>{{ subject.time }}
            </span>
            <span class="dash-btn theme-surface px-3 py-1.5 group-hover:translate-x-0.5">
              Open guide <i class="pi pi-arrow-right text-[10px]"></i>
            </span>
          </div>
        </RouterLink>
      </section>

      <!-- ================= QUICK EXAMS ================= -->
      <section class="ui-rise dash-card" style="animation-delay: 380ms">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="dash-eyebrow theme-text">Practice without reading first</p>
            <h2 class="dash-title mt-1">Jump straight to a test bank</h2>
            <p class="analysis-muted mt-1">Already know the material? Go directly to a timed set and let the report tell you what to revisit.</p>
          </div>
          <RouterLink to="/teas/performance-analysis" class="dash-btn theme-surface theme-shadow">
            <i class="pi pi-chart-line"></i> Performance analysis
          </RouterLink>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <RouterLink v-for="exam in quickExams" :key="exam.id" :to="exam.route" class="group dash-tile dash-hover-lift flex items-center gap-3">
            <span class="dash-icon-tile h-10 w-10 shadow group-hover:scale-110" :class="exam.tileClass"><i :class="exam.icon"></i></span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-extrabold text-slate-950 dark:text-white">{{ exam.label }}</span>
              <span class="block truncate text-[11px] text-slate-500 dark:text-slate-300">{{ exam.helper }}</span>
            </span>
            <span class="analysis-pill theme-soft border text-[10px]">{{ exam.quantity }}</span>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import ProductBreadcrumb from "../../../components/ProductBreadcrumb.vue";
import { useStudyProgress } from "../../../utils/studyProgress";

const { readCount } = useStudyProgress("teas");

const steps = [
  { icon: "pi pi-book", label: "Read a lesson" },
  { icon: "pi pi-pencil", label: "Take its quiz" },
  { icon: "pi pi-chart-line", label: "Track the gain" },
];

const subjects = [
  {
    id: "math_guide",
    title: "Mathematics",
    description: "Quantitative reasoning, algebra, measurement, and problem solving.",
    icon: "pi pi-calculator",
    tag: "Core",
    time: "About 3 hours",
    topics: ["Numbers", "Algebra", "Measurement", "Data"],
    tileClass: "bg-linear-to-br from-sky-500 to-cyan-400 text-white shadow-sky-500/30",
    washClass: "from-sky-400/45 to-cyan-300/25 dark:from-sky-500/30 dark:to-cyan-400/15",
    patternClass: "pattern-grid",
    inkClass: "text-sky-600 dark:text-sky-300",
    borderClass: "border-sky-100 hover:border-sky-300 dark:border-sky-800 dark:hover:border-sky-600",
  },
  {
    id: "english_guide",
    title: "English",
    description: "Grammar, punctuation, sentence structure, and language usage.",
    icon: "pi pi-language",
    tag: "Language",
    time: "About 2 hours",
    topics: ["Grammar", "Punctuation", "Usage", "Vocabulary"],
    tileClass: "bg-linear-to-br from-indigo-500 to-sky-400 text-white shadow-indigo-500/30",
    washClass: "from-indigo-400/45 to-sky-300/25 dark:from-indigo-500/30 dark:to-sky-400/15",
    patternClass: "pattern-lines",
    inkClass: "text-indigo-600 dark:text-indigo-300",
    borderClass: "border-indigo-100 hover:border-indigo-300 dark:border-indigo-900 dark:hover:border-indigo-600",
  },
  {
    id: "science_guide",
    title: "Science",
    description: "Anatomy, chemistry, biology, and physical science essentials.",
    icon: "pi pi-sliders-h",
    tag: "High yield",
    time: "About 4 hours",
    topics: ["Anatomy", "Biology", "Chemistry", "Reasoning"],
    tileClass: "bg-linear-to-br from-emerald-500 to-teal-400 text-white shadow-emerald-500/30",
    washClass: "from-emerald-400/45 to-teal-300/25 dark:from-emerald-500/30 dark:to-teal-400/15",
    patternClass: "pattern-dots",
    inkClass: "text-emerald-600 dark:text-emerald-300",
    borderClass: "border-emerald-100 hover:border-emerald-300 dark:border-emerald-900 dark:hover:border-emerald-600",
  },
  {
    id: "reading_guide",
    title: "Reading",
    description: "Comprehension, inference, and analytical reading habits.",
    icon: "pi pi-book",
    tag: "Strategy",
    time: "About 2 hours",
    topics: ["Passages", "Inference", "Structure", "Speed"],
    tileClass: "bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-orange-500/30",
    washClass: "from-orange-400/45 to-amber-300/25 dark:from-orange-500/30 dark:to-amber-400/15",
    patternClass: "pattern-diagonal",
    inkClass: "text-orange-600 dark:text-orange-300",
    borderClass: "border-orange-100 hover:border-orange-300 dark:border-orange-900 dark:hover:border-orange-600",
  },
];

// Read progress is keyed by chapter id; the guide index can't know chapter ids until a guide is opened,
// so this counts everything read across TEAS as a light motivational signal.
const totalRead = computed(() => {
  try {
    const raw = Object.keys(localStorage).find((k) => k.startsWith("nursenex_study_") && k.endsWith("_teas"));
    return raw ? (JSON.parse(localStorage.getItem(raw) || "[]") || []).length : 0;
  } catch {
    return 0;
  }
});

const quickExams = [
  { id: "math_exam", route: "/teas/test-bank-loader/2", label: "TEAS Math", quantity: "80+ Qs", helper: "Problem solving, algebra, ratios", icon: "pi pi-calculator", tileClass: "bg-linear-to-br from-sky-500 to-cyan-400 text-white" },
  { id: "language_exam", route: "/teas/test-bank-loader/8", label: "TEAS Language", quantity: "70+ Qs", helper: "Grammar, punctuation, usage", icon: "pi pi-language", tileClass: "bg-linear-to-br from-indigo-500 to-sky-400 text-white" },
  { id: "science_exam", route: "/teas/test-bank-loader/4", label: "TEAS Science", quantity: "67+ Qs", helper: "Anatomy, biology, chemistry", icon: "pi pi-sliders-h", tileClass: "bg-linear-to-br from-emerald-500 to-teal-400 text-white" },
  { id: "reading_exam", route: "/teas/test-bank-loader/6", label: "TEAS Reading", quantity: "80+ Qs", helper: "Comprehension and analysis", icon: "pi pi-book", tileClass: "bg-linear-to-br from-orange-500 to-amber-400 text-white" },
];
</script>

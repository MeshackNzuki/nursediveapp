<template>
  <div
    class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-white-500 p-4 text-gray-700 dark:bg-slate-900 dark:text-gray-50 sm:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh]">
    <div class="mx-auto max-w-screen-2xl space-y-6">
      <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
        <article class="rounded-2xl p-5 xl:col-span-8">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0">
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-200">
                NCLEX Dashboard
              </p>
              <h1 class="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {{ welcomeHeading }}
              </h1>
              <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Keep readiness visible: open the right mode, review your latest attempt, and keep your CAT practice
                inside a steady plan.
              </p>
            </div>

            <div class="w-full lg:max-w-sm">
              <StreakCard product-code="nclex" />
            </div>
          </div>

          <article class="mt-5 rounded-2xl border bg-light-blue-500 p-4 dark:border-sky-800 dark:bg-sky-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Find Practice</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Jump into linear tests, readiness checks, adaptive CAT, or a custom NCLEX session.
                </p>
              </div>
              <span
                class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200">
                <i class="pi pi-search"></i>
              </span>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <RouterLink v-for="action in practiceActions" :key="action.route" :to="action.route"
                class="flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-sky-50 dark:border-sky-800 dark:bg-sky-950/60 dark:text-slate-100 dark:hover:bg-sky-900">
                <i :class="[action.icon, action.color]"></i>
                {{ action.label }}
              </RouterLink>
              <button type="button" @click="openCreateTestModal"
                class="flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-3 py-2 text-left text-xs font-bold text-slate-700 transition hover:bg-orange-50 dark:border-orange-800 dark:bg-sky-950/60 dark:text-slate-100 dark:hover:bg-orange-950/30">
                <i class="pi pi-plus-circle text-orange-600 dark:text-orange-300"></i>
                Create
              </button>
            </div>
          </article>

          <div class="mt-5 flex flex-wrap gap-2">
            <RouterLink v-for="action in quickActions" :key="action.route" :to="action.route"
              class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/70 dark:text-sky-100 dark:hover:bg-sky-900">
              <i :class="action.icon"></i>
              {{ action.label }}
            </RouterLink>
            <button type="button"
              class="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-200"
              @click="openCreateTestModal">
              <i class="pi pi-sliders-h"></i>
              Custom Test
            </button>
          </div>
        </article>

        <aside class="hidden xl:col-span-4 xl:block">
          <div class="relative flex min-h-28 items-center gap-4 rounded-2xl border-b bg-sky-800 p-4 shadow-custom">
            <div
              class="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/95 text-sky-700 shadow-custom ring-1 ring-sky-100 dark:bg-slate-950 dark:text-sky-200 dark:ring-slate-800">
              <ExamIcon :size="86" />
            </div>
            <div class="min-w-0">
              <span
                class="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-bright-sun-500 ring-1 ring-white/20">
                {{ nclexAttemptedTotal }} tracked
              </span>
              <p class="mt-2 text-lg font-extrabold leading-tight text-white">
                {{ nclexAttemptedTotal }} NCLEX attempts tracked so far
              </p>
              <RouterLink to="/nclex/performance-analysis"
                class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
                View Details
              </RouterLink>
            </div>
          </div>

          <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div v-for="stat in summaryStats" :key="stat.label"
              class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-sky-800 dark:bg-sky-950/60">
              <div class="flex items-center justify-between gap-3">
                <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  {{ stat.label }}
                </span>
                <i :class="[stat.icon, stat.color, 'text-sm']"></i>
              </div>
              <p class="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{{ stat.value }}</p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">{{ stat.detail }}</p>
            </div>
          </div>
        </aside>
      </section>

      <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <article
          class="rounded-2xl border border-slate-200 bg-light-blue-500 p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900 xl:col-span-7">
          <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="text-lg font-extrabold text-slate-950 dark:text-white">NCLEX Practice Modes</h2>
              <p class="text-xs text-slate-500 dark:text-slate-300">
                Track your practice across fixed, readiness, and adaptive work.
              </p>
            </div>
            <span
              class="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
              {{ nclexAttemptedTotal }} tracked
            </span>
          </div>

          <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
            <RouterLink v-for="mode in modeCards" :key="mode.key" :to="mode.route"
              class="group flex h-full flex-col rounded-xl border border-sky-100 bg-gradient-to-br from-blue-200 via-white to-amber-400 p-4 shadow-custom transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50 dark:border-sky-800 dark:bg-sky-950/50 dark:hover:bg-sky-950">
              <div class="flex items-start justify-between gap-3">
                <div class="flex min-w-0 items-start gap-3">
                  <span
                    class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-lg ring-1 ring-sky-100 dark:bg-sky-900/70 dark:ring-sky-800"
                    :class="mode.color">
                    <i :class="mode.icon"></i>
                  </span>
                  <div class="min-w-0">
                    <h3 class="font-bold leading-tight text-slate-950 dark:text-white">{{ mode.title }}</h3>
                    <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{{ mode.description }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-auto pt-5">
                <div class="mb-2 flex items-center justify-between text-xs">
                  <span class="font-semibold text-slate-500 dark:text-slate-300">{{ mode.progressLabel }}</span>
                  <span class="font-extrabold text-slate-950 dark:text-white">
                    {{ mode.attempted }} / {{ mode.total }}
                  </span>
                </div>
                <div
                  class="h-2.5 overflow-hidden rounded-full bg-light-blue-500 ring-1 ring-sky-100 dark:bg-slate-800 dark:ring-slate-700">
                  <div class="h-full rounded-full transition-all duration-500" :class="mode.barClass"
                    :style="{ width: `${mode.percent}%` }"></div>
                </div>
                <div class="mt-3 flex items-center justify-between gap-2">
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-300">
                    {{ mode.helper }}
                  </span>
                  <span
                    class="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky-800 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition group-hover:translate-x-0.5 group-hover:bg-sky-900 dark:bg-sky-700 dark:group-hover:bg-sky-600">
                    {{ mode.ctaLabel }} <i class="pi pi-arrow-right text-[10px]"></i>
                  </span>
                </div>
              </div>
            </RouterLink>
          </div>

          <section class="mt-4">
            <div
              class="grid gap-3 rounded-xl border border-sky-100 bg-white p-4 shadow-custom dark:border-sky-800 dark:bg-sky-950/60 lg:grid-cols-[1.2fr_0.8fr]">
              <div class="min-w-0">
                <p class="text-xs font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-200">
                  Personal Next Step
                </p>
                <h3 class="mt-1 text-base font-extrabold text-slate-950 dark:text-white">
                  {{ nextPracticeMove.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {{ nextPracticeMove.detail }}
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <RouterLink :to="nextPracticeMove.primaryRoute"
                    class="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-600">
                    <i :class="nextPracticeMove.icon"></i>
                    {{ nextPracticeMove.primaryLabel }}
                  </RouterLink>
                  <RouterLink to="/nclex/performance-analysis"
                    class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-sky-800 dark:text-slate-100 dark:hover:bg-sky-900">
                    <i class="pi pi-chart-line"></i>
                    Analyze
                  </RouterLink>
                  <RouterLink to="/nclex/previous-attempts"
                    class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-sky-800 dark:text-slate-100 dark:hover:bg-sky-900">
                    <i class="pi pi-history"></i>
                    History
                  </RouterLink>
                </div>
              </div>

              <div class="rounded-xl bg-light-blue-500 p-3 dark:bg-sky-900/70">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Last attempt
                  </span>
                  <span class="rounded-full px-2.5 py-1 text-[11px] font-bold" :class="latestAttemptBadgeClass">
                    {{ latestAttemptStatus }}
                  </span>
                </div>
                <template v-if="latestAttempt">
                  <p class="mt-3 truncate text-sm font-bold text-slate-950 dark:text-white">
                    {{ latestAttempt.sub_topic_name || "NCLEX practice set" }}
                  </p>
                  <div class="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p class="text-2xl font-extrabold" :class="scoreToneClass(latestAttemptScore)">
                        {{ latestAttemptScore }}%
                      </p>
                      <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">
                        {{ latestAttemptDateText }}
                      </p>
                    </div>
                    <div
                      class="h-2 w-24 overflow-hidden rounded-full bg-white ring-1 ring-sky-100 dark:bg-slate-800 dark:ring-sky-800">
                      <div class="h-full rounded-full" :class="scoreBarClass(latestAttemptScore)"
                        :style="{ width: `${latestAttemptScore}%` }"></div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <p class="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    No standard attempts yet.
                  </p>
                  <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">
                    Start a linear or readiness set and this panel will become your review shortcut.
                  </p>
                </template>
              </div>
            </div>
          </section>
        </article>

        <div class="min-w-0 xl:col-span-5">
          <Probability :pass-mark="75" product="nclex" />
        </div>
      </section>

      <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <article
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900 xl:col-span-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Today's Focus</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                Two NCLEX starts selected from your least-covered practice modes.
              </p>
            </div>
            <span
              class="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              Smart Sets
            </span>
          </div>

          <div class="mt-4 space-y-3">
            <article v-for="card in focusCards" :key="card.key"
              class="grid grid-cols-12 gap-4 rounded-xl border border-slate-200 bg-light-blue-500 p-3 dark:border-sky-800 dark:bg-sky-950/60">
              <div class="col-span-4 flex flex-col items-center justify-between text-center text-sm">
                <div class="radial-progress bg-white shadow-sm dark:bg-sky-900/70" :class="card.color"
                  :style="{ '--value': card.targetScore }" role="progressbar">
                  <i :class="card.icon"></i>
                </div>
                <span class="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-300">
                  {{ card.targetCopy }}
                </span>
              </div>

              <div class="col-span-8 min-w-0 text-sm">
                <h3 class="truncate font-semibold text-slate-950 dark:text-white">{{ card.title }}</h3>
                <div
                  class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <span><i class="pi pi-arrow-up mr-1 text-teal-500"></i>{{ card.goal }}</span>
                  <span><i class="pi pi-clock mr-1"></i>{{ card.duration }}</span>
                </div>
                <p
                  class="mt-3 rounded-full bg-teal-500/15 px-3 py-1 text-center text-xs font-semibold text-teal-700 dark:text-teal-200">
                  {{ card.helper }}
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                    class="rounded-full border border-dashed border-teal-500 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {{ card.community }}
                  </span>
                  <RouterLink :to="card.route"
                    class="rounded-full bg-sky-500 px-4 py-1 text-xs font-semibold text-white transition hover:bg-sky-600">
                    Start
                  </RouterLink>
                </div>
              </div>
            </article>
          </div>
        </article>

        <div class="min-w-0 xl:col-span-7">
          <PracticeProgressPeersChart product-label="NCLEX" />
        </div>
      </section>

      <StudySchedulePanel product-code="nclex" :initial-exam-date="nclex_exam_date"
        progress-route="/nclex/performance-analysis" study-route="/nclex/linear" title="NCLEX Study Schedule"
        @updated="handleExamDateUpdated" />
    </div>

    <dialog ref="createTestModalRef" class="modal">
      <div class="modal-box bg-white px-0 py-3 text-gray-900 dark:bg-sky-950 dark:text-white">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button>
        </form>
        <CreateTest />
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import axios from "axios";
import Probability from "../../components/Probability.vue";
import CreateTest from "./CreateTest.vue";
import StudySchedulePanel from "../../components/Dashboard/StudySchedulePanel.vue";
import StreakCard from "../../components/Dashboard/StreakCard.vue";
import PracticeProgressPeersChart from "../../components/Dashboard/PracticeProgressPeersChart.vue";
import ExamIcon from "../../components/ExamIcon.vue";
import { useAuthStore } from "../../stores/authStore";
import { useNclexExamStore } from "../../stores/nclexExamStore";

type ModeKey = "linear" | "readiness" | "cat";

interface NclexAttempt {
  id?: number | string | null;
  attempt_id?: number | string | null;
  sub_topic_id?: number | string | null;
  sub_topic_name?: string | null;
  score?: number | string | null;
  mode?: string | null;
  completed?: boolean | number | string | null;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  suspend_index?: number | string | null;
}

interface NclexExamSet {
  id: number | string;
  name: string;
  question_count?: number | string | null;
  questions_count?: number | string | null;
}

interface ModeCatalogItem {
  key: ModeKey;
  title: string;
  description: string;
  ctaLabel: string;
  route: string;
  icon: string;
  fallbackTotal: number;
  progressLabel: string;
  color: string;
  barClass: string;
}

const NCLEX_REVIEW_SCORE = 75;

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const nclexStore = useNclexExamStore();
const nclexStoreRefs = storeToRefs(nclexStore);
const nclex_exam_date = nclexStoreRefs.nclex_exam_date as any;
const dashdata = nclexStoreRefs.dashdata as any;

const createTestModalRef = ref<HTMLDialogElement | null>(null);
const nclexAttempts = ref<NclexAttempt[]>([]);
const catAttempts = ref<NclexAttempt[]>([]);
const linearExams = ref<NclexExamSet[]>([]);
const readinessExams = ref<NclexExamSet[]>([]);

const practiceActions = [
  { label: "Linear", route: "/nclex/linear", icon: "pi pi-book", color: "text-sky-600 dark:text-sky-300" },
  { label: "Readiness", route: "/nclex/readiness", icon: "pi pi-bullseye", color: "text-emerald-600 dark:text-emerald-300" },
  { label: "CAT", route: "/nclex/cat", icon: "pi pi-desktop", color: "text-indigo-600 dark:text-indigo-300" },
  { label: "Analysis", route: "/nclex/performance-analysis", icon: "pi pi-chart-line", color: "text-orange-600 dark:text-orange-300" },
];

const quickActions = [
  { label: "Linear Tests", route: "/nclex/linear", icon: "pi pi-book" },
  { label: "Readiness", route: "/nclex/readiness", icon: "pi pi-bullseye" },
  { label: "CAT Simulator", route: "/nclex/cat", icon: "pi pi-desktop" },
  { label: "Previous Attempts", route: "/nclex/previous-attempts", icon: "pi pi-history" },
  { label: "Performance", route: "/nclex/performance-analysis", icon: "pi pi-chart-line" },
];

const modeCatalog: ModeCatalogItem[] = [
  {
    key: "linear",
    title: "Linear Tests",
    description: "Fixed-difficulty sets for rhythm, recall, and timing.",
    ctaLabel: "Start Linear",
    route: "/nclex/linear",
    icon: "pi pi-book",
    fallbackTotal: 12,
    progressLabel: "Sets attempted",
    color: "text-sky-600 dark:text-sky-300",
    barClass: "bg-gradient-to-r from-sky-500 to-cyan-400",
  },
  {
    key: "readiness",
    title: "Readiness Tests",
    description: "Exam-mode checkpoints for confidence and consistency.",
    ctaLabel: "Check Readiness",
    route: "/nclex/readiness",
    icon: "pi pi-bullseye",
    fallbackTotal: 6,
    progressLabel: "Sets attempted",
    color: "text-emerald-600 dark:text-emerald-300",
    barClass: "bg-gradient-to-r from-emerald-500 to-teal-400",
  },
  {
    key: "cat",
    title: "CAT Simulator",
    description: "Adaptive runs that respond to your answer pattern.",
    ctaLabel: "Start CAT",
    route: "/nclex/cat",
    icon: "pi pi-desktop",
    fallbackTotal: 3,
    progressLabel: "Monthly runs",
    color: "text-indigo-600 dark:text-indigo-300",
    barClass: "bg-gradient-to-r from-indigo-500 to-sky-400",
  },
];

const dash = computed(() => (dashdata.value || {}) as Record<string, any>);

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const firstName = computed(() => {
  const name = user.value?.name?.trim();
  return name ? name.split(/\s+/)[0] : "";
});
const welcomeHeading = computed(() => (firstName.value ? `Welcome back, ${firstName.value}` : "Welcome back"));

const averageScore = computed(() => {
  const rawScore = dash.value?.average_score;
  if (rawScore === null || rawScore === undefined || rawScore === "") {
    return "...";
  }

  const score = Number(rawScore);
  if (!Number.isFinite(score)) return "...";

  return `${Math.max(0, Math.min(100, Math.round(score)))}%`;
});

const uniqueIds = (items: NclexExamSet[]) =>
  new Set(items.map((item) => toNumber(item.id)).filter((id) => id > 0));

const countAttemptsByExam = (examIds: Set<number>) => {
  const attempted = new Set<number>();

  nclexAttempts.value.forEach((attempt) => {
    const examId = toNumber(attempt.sub_topic_id);
    if (examIds.has(examId)) {
      attempted.add(examId);
    }
  });

  return attempted.size;
};

const attemptTimestamp = (attempt: NclexAttempt) => {
  const raw = attempt.completed_at || attempt.updated_at || attempt.created_at;
  if (!raw) return 0;

  const timestamp = new Date(raw).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const isCurrentMonth = (rawDate?: string | null) => {
  if (!rawDate) return false;

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return false;

  const now = new Date();
  return parsed.getFullYear() === now.getFullYear() && parsed.getMonth() === now.getMonth();
};

const sortedAttempts = computed(() =>
  [...nclexAttempts.value].sort((a, b) => attemptTimestamp(b) - attemptTimestamp(a)),
);

const latestAttempt = computed(() => sortedAttempts.value[0] || null);

const latestCompletedAttempt = computed(() =>
  sortedAttempts.value.find((attempt) => attempt.completed === true || attempt.completed === 1 || attempt.completed === "1") || null,
);

const latestAttemptScore = computed(() => {
  const score = toNumber(latestAttempt.value?.score);
  return Math.max(0, Math.min(100, Math.round(score)));
});

const latestAttemptStatus = computed(() => {
  if (!latestAttempt.value) return "Ready";
  return latestAttempt.value.completed === true || latestAttempt.value.completed === 1 || latestAttempt.value.completed === "1"
    ? "Completed"
    : "Paused";
});

const latestAttemptBadgeClass = computed(() => {
  if (!latestAttempt.value) return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200";
  if (latestAttemptStatus.value === "Completed") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200";
  }

  return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200";
});

const latestAttemptDateText = computed(() => {
  const timestamp = latestAttempt.value ? attemptTimestamp(latestAttempt.value) : 0;
  if (!timestamp) return "No date recorded";

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});

const catAttemptsThisMonth = computed(() =>
  catAttempts.value.filter((attempt) => isCurrentMonth(attempt.created_at || attempt.completed_at)).length,
);

const modeCards = computed(() =>
  modeCatalog.map((mode) => {
    const examSets = mode.key === "linear" ? linearExams.value : readinessExams.value;
    const total = mode.key === "cat" ? mode.fallbackTotal : examSets.length || mode.fallbackTotal;
    const attempted = mode.key === "cat"
      ? Math.min(total, catAttemptsThisMonth.value)
      : Math.min(total, countAttemptsByExam(uniqueIds(examSets)));
    const percent = total > 0 ? Math.round((attempted / total) * 100) : 0;

    return {
      ...mode,
      total,
      attempted,
      percent,
      helper: mode.key === "cat"
        ? `${Math.max(0, total - attempted)} monthly run${total - attempted === 1 ? "" : "s"} left`
        : `${percent}% complete`,
    };
  }),
);

const nclexAttemptedTotal = computed(() =>
  new Set(nclexAttempts.value.map((attempt) => toNumber(attempt.sub_topic_id)).filter((id) => id > 0)).size
  + catAttempts.value.length,
);

const summaryStats = computed(() => [
  {
    label: "Attempts",
    value: dash.value?.nclex_attempts ?? nclexAttempts.value.length,
    detail: "Standard sets",
    icon: "pi pi-pencil",
    color: "text-sky-600 dark:text-sky-300",
  },
  {
    label: "Avg. Score",
    value: averageScore.value,
    detail: "Recent attempts",
    icon: "pi pi-percentage",
    color: "text-emerald-600 dark:text-emerald-300",
  },
  {
    label: "Modes",
    value: modeCatalog.length,
    detail: "Linear, readiness, CAT",
    icon: "pi pi-th-large",
    color: "text-orange-600 dark:text-orange-300",
  },
]);

const nextPracticeMove = computed(() => {
  if (latestCompletedAttempt.value) {
    const score = Math.round(toNumber(latestCompletedAttempt.value.score));
    const attemptId = latestCompletedAttempt.value.attempt_id || latestCompletedAttempt.value.id;
    const needsReview = score < NCLEX_REVIEW_SCORE;

    return {
      title: needsReview ? "Review your last NCLEX misses" : "Keep the readiness rhythm",
      detail: needsReview
        ? `Your last completed score was ${score}%. Review rationales, then run a focused readiness check.`
        : `Your last completed score was ${score}%. Stack another set while the reasoning pattern is fresh.`,
      primaryLabel: needsReview ? "Review Attempt" : "Start CAT",
      primaryRoute: needsReview && attemptId
        ? `/nclex/exam/${attemptId}?mode=review`
        : "/nclex/cat",
      icon: needsReview ? "pi pi-eye" : "pi pi-desktop",
    };
  }

  return {
    title: "Start your first tracked NCLEX set",
    detail: "Begin with linear practice to establish a baseline, then use readiness and CAT for pressure checks.",
    primaryLabel: "Start Linear",
    primaryRoute: "/nclex/linear",
    icon: "pi pi-play",
  };
});

const focusCards = computed(() =>
  [...modeCards.value]
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 2)
    .map((mode, index) => ({
      key: `nclex-focus-${mode.key}`,
      title: mode.title,
      icon: mode.icon,
      color: mode.color,
      route: mode.route,
      targetScore: index === 0 ? 70 : 75,
      targetCopy: index === 0 ? "At least 70%" : "At least 75%",
      goal: mode.key === "cat" ? "1 adaptive run" : index === 0 ? "40 questions" : "1 timed set",
      duration: mode.key === "cat" ? "45-75 min" : index === 0 ? "30 min" : "40 min",
      helper: mode.percent > 0 ? `${mode.percent}% covered. Keep building.` : "Start here to build momentum.",
      community: index === 0 ? "12k joined" : "9k joined",
    })),
);

const scoreToneClass = (score: number) => {
  if (score >= NCLEX_REVIEW_SCORE) return "text-emerald-600 dark:text-emerald-300";
  if (score >= 55) return "text-amber-600 dark:text-amber-300";
  return "text-rose-600 dark:text-rose-300";
};

const scoreBarClass = (score: number) => {
  if (score >= NCLEX_REVIEW_SCORE) return "bg-emerald-500";
  if (score >= 55) return "bg-amber-500";
  return "bg-rose-500";
};

const readSubtopics = (response: any): NclexExamSet[] => {
  const subtopics = response?.data?.data?.subtopics;
  return Array.isArray(subtopics) ? subtopics : [];
};

onMounted(async () => {
  nclexStore.getEssentials();

  const [attemptsResult, linearResult, readinessResult, catResult] = await Promise.allSettled([
    axios.get("/nclex/previous-attempts", { showLoader: false }),
    axios.get("/nclex/mock", { showLoader: false }),
    axios.get("/nclex/readiness", { showLoader: false }),
    axios.get("/nclex/cat-attempts", { showLoader: false }),
  ]);

  if (attemptsResult.status === "fulfilled") {
    nclexAttempts.value = Array.isArray(attemptsResult.value.data?.data) ? attemptsResult.value.data.data : [];
  }

  if (linearResult.status === "fulfilled") {
    linearExams.value = readSubtopics(linearResult.value);
  }

  if (readinessResult.status === "fulfilled") {
    readinessExams.value = readSubtopics(readinessResult.value);
  }

  if (catResult.status === "fulfilled") {
    catAttempts.value = Array.isArray(catResult.value.data?.data) ? catResult.value.data.data : [];
  }
});

const openCreateTestModal = () => {
  createTestModalRef.value?.showModal();
};

const handleExamDateUpdated = (date: string) => {
  nclex_exam_date.value = date;
};
</script>

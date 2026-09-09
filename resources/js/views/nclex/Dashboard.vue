<template>
  <div class="dash-shell">
    <div class="mx-auto max-w-screen-2xl space-y-6">
      <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
        <article class="ui-rise rounded-2xl p-5 xl:col-span-8">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0">
              <p class="dash-eyebrow theme-text inline-flex items-center gap-2">
                <span class="relative flex h-2 w-2">
                  <span class="theme-dot absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"></span>
                  <span class="theme-dot relative inline-flex h-2 w-2 rounded-full"></span>
                </span>
                NCLEX Dashboard
              </p>
              <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
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

          <article class="dash-card mt-5 p-4">
            <div class="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-60" aria-hidden="true"></div>
            <div class="relative flex items-start justify-between gap-4">
              <div>
                <h2 class="dash-title">Find Practice</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Jump into linear tests, readiness checks, adaptive CAT, or a custom NCLEX session.
                </p>
              </div>
              <span class="dash-icon-tile theme-icon h-10 w-10">
                <i class="pi pi-search text-base"></i>
              </span>
            </div>

            <div class="relative mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
              <RouterLink v-for="action in practiceActions" :key="action.route" :to="action.route"
                class="group dash-tile flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:text-slate-100">
                <span class="dash-icon-tile theme-icon h-8 w-8 text-sm group-hover:scale-110"><i :class="action.icon"></i></span>
                {{ action.label }}
              </RouterLink>
              <button type="button" @click="openCreateTestModal"
                class="group dash-tile flex items-center gap-2 border-orange-200 bg-orange-50 px-3 py-2.5 text-left text-xs font-bold text-orange-800 transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-200">
                <span class="dash-icon-tile h-8 w-8 bg-linear-to-br from-orange-500 to-amber-400 text-sm text-white shadow group-hover:scale-110"><i class="pi pi-plus"></i></span>
                Create test
              </button>
            </div>
          </article>

          <div class="mt-5 flex flex-wrap gap-2">
            <RouterLink v-for="action in quickActions" :key="action.route" :to="action.route"
              class="dash-chip theme-soft theme-focus">
              <i :class="action.icon"></i>
              {{ action.label }}
            </RouterLink>
            <button type="button"
              class="dash-chip border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-200"
              @click="openCreateTestModal">
              <i class="pi pi-sliders-h"></i>
              Custom Test
            </button>
          </div>
        </article>

        <aside class="ui-rise xl:col-span-4" style="animation-delay: 80ms">
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

          <div class="ui-rise mt-5" style="animation-delay: 140ms">
            <DashboardSnapshot :attempts="snapshotAttempts" :sections="snapshotSections" :pass-mark="NCLEX_REVIEW_SCORE"
              :total-override="dash?.nclex_attempts ?? null" section-noun="mode" />
          </div>
        </aside>
      </section>

      <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 160ms">
          <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="dash-title">NCLEX Practice Modes</h2>
              <p class="text-xs text-slate-500 dark:text-slate-300">
                Track your practice across fixed, readiness, and adaptive work.
              </p>
            </div>
            <span class="analysis-pill theme-soft border">
              {{ nclexAttemptedTotal }} tracked
            </span>
          </div>

          <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
            <RouterLink v-for="(mode, index) in modeCards" :key="mode.key" :to="mode.route"
              class="group dash-card-white dash-hover-lift ui-rise flex h-full flex-col" :class="mode.borderClass"
              :style="{ animationDelay: `${220 + index * 60}ms` }">
              <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                <div class="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-linear-to-br opacity-70 blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-100"
                  :class="mode.washClass"></div>
                <div class="ui-pan absolute inset-0 opacity-[0.09] transition-opacity duration-500 group-hover:opacity-[0.16]"
                  :class="[mode.patternClass, mode.inkClass]"></div>
                <i class="absolute -bottom-5 -right-3 text-[104px] opacity-[0.07] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                  :class="[mode.icon, mode.inkClass]"></i>
              </div>
              <div class="relative flex items-start justify-between gap-3">
                <div class="flex min-w-0 items-start gap-3">
                  <span class="dash-icon-tile h-11 w-11 shadow-lg group-hover:scale-110 group-hover:-rotate-3" :class="mode.tileClass">
                    <i :class="mode.icon"></i>
                  </span>
                  <div class="min-w-0">
                    <h3 class="font-bold leading-tight text-slate-950 dark:text-white">{{ mode.title }}</h3>
                    <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{{ mode.description }}</p>
                  </div>
                </div>
              </div>

              <div class="relative mt-auto pt-5">
                <div class="mb-2 flex items-center justify-between text-xs">
                  <span class="font-semibold text-slate-500 dark:text-slate-300">{{ mode.progressLabel }}</span>
                  <span class="font-extrabold tabular-nums text-slate-950 dark:text-white">
                    {{ mode.attempted }} / {{ mode.total }}
                  </span>
                </div>
                <div class="dash-progress bg-light-blue-500">
                  <div class="relative h-full overflow-hidden rounded-full transition-all duration-700 ease-out" :class="mode.barClass"
                    :style="{ width: `${mode.percent}%` }">
                    <span v-if="mode.percent > 0" class="ui-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent"></span>
                  </div>
                </div>
                <div class="mt-3 flex items-center justify-between gap-2">
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-300">
                    {{ mode.helper }}
                  </span>
                  <span class="dash-btn theme-surface shrink-0 px-3 py-1.5 group-hover:translate-x-0.5">
                    {{ mode.ctaLabel }} <i class="pi pi-arrow-right text-[10px]"></i>
                  </span>
                </div>
              </div>
            </RouterLink>
          </div>

          <section class="mt-4">
            <div class="dash-card-white grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
              <div class="min-w-0">
                <p class="dash-eyebrow theme-text">Personal Next Step</p>
                <h3 class="mt-1 text-base font-extrabold text-slate-950 dark:text-white">
                  {{ nextPracticeMove.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {{ nextPracticeMove.detail }}
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <RouterLink :to="nextPracticeMove.primaryRoute" class="dash-btn theme-surface theme-shadow">
                    <i :class="nextPracticeMove.icon"></i>
                    {{ nextPracticeMove.primaryLabel }}
                  </RouterLink>
                  <RouterLink to="/nclex/performance-analysis" class="dash-btn-ghost">
                    <i class="pi pi-chart-line"></i>
                    Analyze
                  </RouterLink>
                  <RouterLink to="/nclex/previous-attempts" class="dash-btn-ghost">
                    <i class="pi pi-history"></i>
                    History
                  </RouterLink>
                </div>
              </div>

              <div class="dash-tile-soft min-w-0">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Last attempt
                  </span>
                  <span class="analysis-pill text-[11px]" :class="latestAttemptBadgeClass">
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
                    <div class="dash-progress h-2 w-24">
                      <div class="h-full rounded-full transition-all duration-700" :class="scoreBarClass(latestAttemptScore)"
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

        <div class="ui-rise min-w-0 xl:col-span-5" style="animation-delay: 200ms">
          <Probability :pass-mark="NCLEX_REVIEW_SCORE" product="nclex" />
        </div>
      </section>

      <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <article class="ui-rise dash-card xl:col-span-5" style="animation-delay: 260ms">
          <div class="pointer-events-none absolute -top-16 -left-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-50" aria-hidden="true"></div>
          <div class="relative flex items-start justify-between gap-3">
            <div>
              <h2 class="dash-title">Today's Focus</h2>
              <p class="analysis-muted mt-1">Two NCLEX starts ranked from your mode scores, recency, and coverage.</p>
            </div>
            <span class="analysis-pill theme-soft border text-[11px]"><i class="pi pi-bolt mr-1"></i>Smart picks</span>
          </div>

          <div class="relative mt-4 space-y-3">
            <article v-for="card in focusCards" :key="card.key" class="group dash-tile dash-hover-lift relative overflow-hidden">
              <i class="pointer-events-none absolute -bottom-4 -right-2 text-[88px] opacity-[0.06] transition-transform duration-500 group-hover:-rotate-6"
                :class="[card.icon, card.inkClass]" aria-hidden="true"></i>

              <div class="relative flex items-start gap-3">
                <div class="relative h-16 w-16 shrink-0">
                  <svg class="h-16 w-16 -rotate-90" viewBox="0 0 52 52" aria-hidden="true">
                    <circle cx="26" cy="26" r="22" fill="none" stroke="currentColor" stroke-width="5" class="text-slate-200 dark:text-slate-700" />
                    <circle cx="26" cy="26" r="22" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"
                      :stroke-dasharray="focusRingCircumference" :stroke-dashoffset="card.ringOffset" :class="card.scoreTone"
                      class="transition-[stroke-dashoffset] duration-1000 ease-out" />
                    <circle cx="26" cy="26" r="22" fill="none" stroke="currentColor" stroke-width="7"
                      :stroke-dasharray="`1.5 ${focusRingCircumference - 1.5}`" :stroke-dashoffset="focusRingCircumference * (1 - card.target / 100)"
                      class="text-slate-500 dark:text-slate-300" />
                  </svg>
                  <span class="absolute inset-0 flex flex-col items-center justify-center leading-none">
                    <span class="text-sm font-black tabular-nums text-slate-900 dark:text-white">{{ card.hasScore ? `${card.score}%` : "—" }}</span>
                    <span class="mt-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-400">avg</span>
                  </span>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="dash-icon-tile h-7 w-7 text-xs shadow" :class="card.tileClass"><i :class="card.icon"></i></span>
                    <h3 class="truncate text-sm font-extrabold text-slate-950 dark:text-white">{{ card.title }}</h3>
                  </div>
                  <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.14em]" :class="card.inkClass">{{ card.rank }}</p>
                  <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    <i class="pi pi-info-circle mr-1 text-[10px] opacity-70"></i>{{ card.why }}
                  </p>
                  <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <span><i class="pi pi-arrow-up mr-1 text-teal-500"></i>{{ card.goal }}</span>
                    <span><i class="pi pi-clock mr-1"></i>{{ card.duration }}</span>
                  </div>
                </div>
              </div>

              <div class="relative mt-3 flex items-center justify-between gap-2">
                <button type="button" @click.prevent="startFocusSession(card)" :disabled="focusSession.isActive.value"
                  class="theme-focus inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-60 dark:text-slate-300 dark:hover:bg-sky-900">
                  <i class="pi pi-stopwatch text-[10px]"></i>
                  {{ focusSession.isActive.value ? focusSession.remainingLabel.value : `${card.sessionMinutes}-min session` }}
                </button>
                <RouterLink :to="card.route" class="dash-btn theme-surface px-4 py-1.5">
                  Start <i class="pi pi-arrow-right text-[10px]"></i>
                </RouterLink>
              </div>
            </article>
          </div>
        </article>

        <div class="ui-rise min-w-0 xl:col-span-7" style="animation-delay: 300ms">
          <PracticeProgressPeersChart product-label="NCLEX" />
        </div>
      </section>

      <div class="ui-rise" style="animation-delay: 340ms">
        <StudySchedulePanel product-code="nclex" :initial-exam-date="nclex_exam_date"
          progress-route="/nclex/performance-analysis" study-route="/nclex/linear" title="NCLEX Study Schedule"
          @updated="handleExamDateUpdated" />
      </div>
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
import DashboardSnapshot from "../../components/Dashboard/DashboardSnapshot.vue";
import type { SnapshotAttempt, SnapshotSection } from "../../components/Dashboard/DashboardSnapshot.vue";
import { useFocusSession } from "../../utils/focusSession";
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
  tileClass: string;
  washClass: string;
  patternClass: string;
  inkClass: string;
  borderClass: string;
}

const NCLEX_REVIEW_SCORE = 75;
const CAT_PASS_THRESHOLD = 65;

const focusSession = useFocusSession();

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
    tileClass: "bg-linear-to-br from-sky-500 to-cyan-400 text-white shadow-sky-500/30",
    washClass: "from-sky-400/45 to-cyan-300/25 dark:from-sky-500/30 dark:to-cyan-400/15",
    patternClass: "pattern-grid",
    inkClass: "text-sky-600 dark:text-sky-300",
    borderClass: "border-sky-100 hover:border-sky-300 dark:border-sky-800 dark:hover:border-sky-600",
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
    tileClass: "bg-linear-to-br from-emerald-500 to-teal-400 text-white shadow-emerald-500/30",
    washClass: "from-emerald-400/45 to-teal-300/25 dark:from-emerald-500/30 dark:to-teal-400/15",
    patternClass: "pattern-dots",
    inkClass: "text-emerald-600 dark:text-emerald-300",
    borderClass: "border-emerald-100 hover:border-emerald-300 dark:border-emerald-900 dark:hover:border-emerald-600",
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
    tileClass: "bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-indigo-500/30",
    washClass: "from-indigo-400/45 to-violet-300/25 dark:from-indigo-500/30 dark:to-violet-400/15",
    patternClass: "pattern-diagonal",
    inkClass: "text-indigo-600 dark:text-indigo-300",
    borderClass: "border-indigo-100 hover:border-indigo-300 dark:border-indigo-900 dark:hover:border-indigo-600",
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

const isCompleted = (attempt: NclexAttempt) =>
  attempt.completed === true || attempt.completed === 1 || attempt.completed === "1";

const snapshotAttempts = computed<SnapshotAttempt[]>(() => [
  ...nclexAttempts.value.map((a) => ({
    timestamp: attemptTimestamp(a),
    score: a.score === null || a.score === undefined || a.score === "" ? null : toNumber(a.score),
    completed: isCompleted(a),
  })),
  ...catAttempts.value.map((a) => ({
    timestamp: attemptTimestamp(a),
    score: a.score === null || a.score === undefined || a.score === "" ? null : toNumber(a.score),
    completed: isCompleted(a) || Boolean(a.completed_at),
  })),
]);

const snapshotSections = computed<SnapshotSection[]>(() =>
  modeCards.value.map((mode) => ({
    id: mode.key,
    label: mode.title.replace(" Tests", "").replace(" Simulator", ""),
    attempted: mode.attempted,
    total: mode.total,
    barClass: mode.barClass,
  })),
);

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

/* ---------- Today's Focus: NCLEX modes ranked from real signals ---------- */
const modeOf = (attempt: NclexAttempt): ModeKey | null => {
  const examId = toNumber(attempt.sub_topic_id);
  if (uniqueIds(linearExams.value).has(examId)) return "linear";
  if (uniqueIds(readinessExams.value).has(examId)) return "readiness";
  return null;
};

const modeSignals = computed(() =>
  modeCards.value.map((mode) => {
    const own = mode.key === "cat"
      ? catAttempts.value
      : nclexAttempts.value.filter((a) => modeOf(a) === mode.key);
    const scores = own
      .filter((a) => (mode.key === "cat" ? Boolean(a.completed_at) || isCompleted(a) : isCompleted(a)) && a.score !== null && a.score !== undefined)
      .map((a) => Math.max(0, Math.min(100, toNumber(a.score))));
    const average = scores.length ? Math.round(scores.reduce((sum, v) => sum + v, 0) / scores.length) : null;
    const last = own.reduce((max, a) => Math.max(max, attemptTimestamp(a)), 0);
    const daysSince = last ? Math.floor((Date.now() - last) / 86400000) : null;
    const target = mode.key === "cat" ? CAT_PASS_THRESHOLD : NCLEX_REVIEW_SCORE;
    const gap = average === null ? null : target - average;
    const priority =
      (average === null ? 18 : Math.max(0, gap ?? 0) * 1.4) +
      (daysSince === null ? 16 : Math.min(daysSince, 14) * 1.2) +
      (100 - mode.percent) * 0.12;
    return { ...mode, average, daysSince, gap, target, priority: Math.round(priority), attemptsCount: scores.length };
  }),
);

const focusRingCircumference = 2 * Math.PI * 22;

const focusCards = computed(() =>
  [...modeSignals.value]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 2)
    .map((mode, index) => {
      const parts: string[] = [];
      if (mode.average === null) parts.push("no scored attempts yet");
      else if (mode.gap !== null && mode.gap > 0) parts.push(`${mode.gap} pts under the ${mode.target}% mark`);
      else parts.push("above the mark, keep it warm");
      if (mode.daysSince === null) parts.push("never practiced");
      else if (mode.daysSince >= 3) parts.push(`untouched for ${mode.daysSince} days`);
      if (mode.key === "cat") parts.push(`${Math.max(0, mode.total - mode.attempted)} monthly runs left`);
      else if (mode.percent < 25) parts.push(`${mode.percent}% of sets covered`);
      const why = parts.slice(0, 2).join(", ");
      const score = mode.average ?? 0;
      return {
        key: `nclex-focus-${mode.key}`,
        title: mode.title,
        icon: mode.icon,
        tileClass: mode.tileClass,
        inkClass: mode.inkClass,
        route: mode.route,
        rank: index === 0 ? "Top priority" : "Next up",
        score,
        hasScore: mode.average !== null,
        target: mode.target,
        ringOffset: focusRingCircumference * (1 - score / 100),
        scoreTone: mode.average === null ? "text-slate-400" : score >= mode.target ? "text-emerald-600 dark:text-emerald-300" : score >= 50 ? "text-amber-600 dark:text-amber-300" : "text-rose-600 dark:text-rose-300",
        why: why.charAt(0).toUpperCase() + why.slice(1) + ".",
        goal: mode.key === "cat" ? "1 adaptive run" : index === 0 ? "40 questions" : "1 timed set",
        duration: mode.key === "cat" ? "45–75 min" : index === 0 ? "30 min" : "40 min",
        sessionMinutes: mode.key === "cat" ? 60 : index === 0 ? 30 : 40,
        shortTitle: mode.title.replace(" Tests", "").replace(" Simulator", ""),
      };
    }),
);

const startFocusSession = (card: { sessionMinutes: number; shortTitle: string; route: string }) => {
  focusSession.start({ minutes: card.sessionMinutes, label: card.shortTitle, route: card.route, product: "nclex" });
};

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

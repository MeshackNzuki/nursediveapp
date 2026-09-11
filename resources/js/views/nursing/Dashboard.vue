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
                Nursing Dashboard
              </p>
              <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                {{ welcomeHeading }}
              </h1>
              <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Keep your exam prep centered: open the right bank, check readiness, and follow a weekly study rhythm.
              </p>
            </div>

            <div class="w-full lg:max-w-sm">
              <StreakCard product-code="nursing" />
            </div>
          </div>
          <DashboardSearch nudge-key="nursing" class="mt-5" :groups="searchGroups" :suggestions="searchSuggestions"
            placeholder="Search exam sets or topics, e.g. pharmacology" @select="onSearchSelect" />


          <div class="mt-5 flex flex-wrap gap-2">
            <RouterLink v-for="action in quickActions" :key="action.route" :to="action.route"
              class="dash-chip theme-soft theme-focus">
              <i :class="action.icon"></i>
              {{ action.label }}
            </RouterLink>
            <button type="button"
              class="dash-chip border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-200"
              @click="openStudyModal">
              <i class="pi pi-bookmark"></i>
              Study Lessons
            </button>
          </div>
        </article>

        <aside class="ui-rise hidden xl:col-span-4 xl:block" style="animation-delay: 80ms">

          <div class="relative flex min-h-28 items-center gap-4 border-b bg-sky-800 rounded-2xl p-4 shadow-custom">
            <div
              class="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/95 shadow-custom ring-1 ring-sky-100 dark:!bg-slate-950 dark:ring-slate-800">
              <ExamIcon size="78" class="drop-shadow-sm" />
            </div>
            <div class="min-w-0">
              <span
                class="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-bright-sun-500 ring-1 ring-white/20">
                {{ nursingAttemptedTotal }} attempted
              </span>
              <p class="mt-2 text-lg font-extrabold leading-tight text-white">
                {{ nursingAttemptedTotal }} exams attempted so far
              </p>
              <router-link to="/nursing/performance-analysis"
                class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
                View Details
              </router-link>
            </div>
          </div>
          <div class="ui-rise mt-5" style="animation-delay: 140ms">
            <DashboardSnapshot :attempts="focusAttempts" :sections="snapshotSections" :pass-mark="PASS_MARK"
              :total-override="dashdata?.nursing_attempts ?? null" section-noun="bank" />
          </div>

        </aside>
      </section>

      <!-- ================= CATEGORIES + PROBABILITY ================= -->
      <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <article class="ui-rise dash-card xl:col-span-7" style="animation-delay: 160ms">
          <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="dash-title">Exam Bank Categories</h2>
              <p class="text-xs text-slate-500 dark:text-slate-300">Track attempted exams against each bank.</p>
            </div>
            <span class="analysis-pill theme-soft border">
              {{ nursingAttemptedTotal }} attempted
            </span>
          </div>

          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <RouterLink v-for="(link, index) in nursingQuickLinksWithProgress" :key="link.route" :to="link.route"
              class="group dash-card-white dash-hover-lift ui-rise flex h-full flex-col" :class="link.borderClass"
              :style="{ animationDelay: `${220 + index * 60}ms` }">
              <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                <div class="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-linear-to-br opacity-70 blur-3xl transition duration-500 group-hover:scale-125 group-hover:opacity-100"
                  :class="link.washClass"></div>
                <div class="ui-pan absolute inset-0 opacity-[0.09] transition-opacity duration-500 group-hover:opacity-[0.16]"
                  :class="[link.patternClass, link.inkClass]"></div>
                <i class="absolute -bottom-5 -right-3 text-[104px] opacity-[0.07] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                  :class="[link.icon, link.inkClass]"></i>
              </div>

              <div class="relative flex items-start justify-between gap-3">
                <div class="flex min-w-0 items-start gap-3">
                  <span class="dash-icon-tile h-11 w-11 shadow-lg group-hover:scale-110 group-hover:-rotate-3" :class="link.tileClass">
                    <i :class="link.icon"></i>
                  </span>
                  <div class="min-w-0">
                    <h3 class="font-bold leading-tight text-slate-950 dark:text-white">{{ link.title }}</h3>
                    <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{{ link.description }}</p>
                  </div>
                </div>
                <span class="analysis-pill shrink-0 border border-current/20 bg-white/70 text-[11px] font-bold backdrop-blur-sm dark:bg-slate-950/40"
                  :class="link.inkClass">
                  {{ link.total }} sets
                </span>
              </div>

              <div class="relative mt-auto pt-5">
                <div class="mb-2 flex items-center justify-between text-xs">
                  <span class="font-semibold text-slate-500 dark:text-slate-300">Exam attempted</span>
                  <span class="font-extrabold tabular-nums text-slate-950 dark:text-white">
                    {{ link.attempted }} / {{ link.total }}
                  </span>
                </div>
                <div class="dash-progress bg-light-blue-500">
                  <div class="relative h-full overflow-hidden rounded-full transition-all duration-700 ease-out" :class="link.barClass"
                    :style="{ width: `${link.percent}%` }">
                    <span v-if="link.percent > 0"
                      class="ui-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent"></span>
                  </div>
                </div>
                <div class="mt-3 flex items-center justify-between gap-2">
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-300">
                    {{ link.percent }}% complete
                  </span>
                  <span class="dash-btn theme-surface shrink-0 px-3 py-1.5 group-hover:translate-x-0.5">
                    Open {{ link.title }} <i class="pi pi-arrow-right text-[10px]"></i>
                  </span>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- Next step -->
          <section class="mt-4">
            <div class="dash-card-white grid gap-3 md:grid-cols-2">
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
                  <RouterLink to="/nursing/performance-analysis" class="dash-btn-ghost">
                    <i class="pi pi-chart-line"></i>
                    Analyze
                  </RouterLink>
                  <RouterLink to="/nursing/previous-attempts" class="dash-btn-ghost">
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
                    {{ latestAttempt.sub_topic_name || "Nursing practice set" }}
                  </p>
                  <div class="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p class="text-2xl font-extrabold tabular-nums" :class="scoreToneClass(latestAttemptScore)">
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
                    No attempts yet.
                  </p>
                  <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">
                    Start any exam bank and this panel will turn into a progress shortcut.
                  </p>
                </template>
              </div>
            </div>
          </section>

          <!-- Referral nudge -->
          <RouterLink to="/referral"
            class="group dash-card-white dash-hover-lift mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div class="pointer-events-none absolute -top-12 -left-10 h-36 w-36 rounded-full bg-rose-200/50 blur-3xl dark:bg-rose-500/15"
              aria-hidden="true"></div>
            <div class="relative flex -space-x-2 shrink-0">
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-rose-500 to-pink-600 text-white shadow dark:border-sky-950">
                <i class="pi pi-user text-sm"></i>
              </span>
              <span class="theme-surface inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-white shadow dark:border-sky-950">
                <i class="pi pi-heart-fill text-sm"></i>
              </span>
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-amber-400 to-orange-500 text-white shadow dark:border-sky-950">
                <i class="pi pi-gift text-sm"></i>
              </span>
            </div>
            <div class="relative min-w-0 flex-1">
              <p class="dash-eyebrow text-rose-600 dark:text-rose-300">Need more free days of full access?</p>
              <p class="mt-1 text-sm font-extrabold text-slate-950 dark:text-white">
                Refer a friend and you both get {{ REFERRAL_REWARD_DAYS }} days free.
              </p>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-300">
                Rewards unlock once their first payment clears.
              </p>
            </div>
            <span class="dash-btn relative shrink-0 bg-linear-to-r from-rose-600 to-orange-500 text-white group-hover:translate-x-0.5">
              Refer now <i class="pi pi-arrow-right text-[10px]"></i>
            </span>
          </RouterLink>
        </article>

        <div class="ui-rise min-w-0 xl:col-span-5" style="animation-delay: 200ms">
          <Probability :pass-mark="PASS_MARK" product="nursing" section-field="question_subject_id" :section-labels="subjectLabels" />
        </div>
      </section>

      <!-- ================= FOCUS + PEERS ================= -->
      <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div class="ui-rise min-w-0 xl:col-span-5" style="animation-delay: 260ms">
          <TodayFocusPanel product="nursing" :pass-mark="PASS_MARK" :sections="focusSections" :attempts="focusAttempts"
            :days-to-exam="daysToExam" :review-task="focusReviewTask"
            :study-link="{ label: 'Browse study lessons', route: '/nursing/study-chapters?chapter_id=7' }"
            subtitle="Ranked per subject from your scores, recency, and coverage." />
        </div>

        <div class="ui-rise min-w-0 xl:col-span-7" style="animation-delay: 300ms">
          <PracticeProgressPeersChart />
        </div>
      </section>

      <div class="ui-rise" style="animation-delay: 340ms">
        <StudySchedulePanel product-code="nursing" :initial-exam-date="nursing_exam_date"
          progress-route="/nursing/performance-analysis" study-route="/nursing/study-chapters?chapter_id=7"
          title="Nursing Study Schedule" @updated="handleExamDateUpdated" />
      </div>
    </div>

    <dialog ref="studyModalRef" class="modal">
      <div class="modal-box bg-white text-gray-900 dark:bg-sky-950 dark:text-white">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button>
        </form>
        <h3 class="text-lg font-bold custom-underline-red">Nursing Study Areas</h3>
        <div class="mt-5 grid gap-2">
          <RouterLink v-for="(chapter, index) in chapters" :key="index" :to="chapter.route" :class="[
            'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition',
            chapter.route.includes('null')
              ? 'pointer-events-none cursor-not-allowed bg-slate-100 text-gray-400 dark:bg-sky-900/40'
              : 'bg-light-blue-500 text-gray-700 hover:bg-sky-100 hover:text-sky-700 dark:bg-sky-900/60 dark:text-slate-100 dark:hover:bg-sky-800',
          ]" active-class="bg-indigo-50 text-indigo-700 font-medium" @click="closeStudyModal">
            <span>{{ chapter.label }}</span>
            <i class="pi pi-arrow-right text-xs"></i>
          </RouterLink>
        </div>
      </div>
    </dialog>

    <dialog ref="modalRef" id="examModal" class="modal">
      <div class="modal-box bg-white text-gray-900 dark:bg-sky-950 dark:text-white">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button>
        </form>
        <h3 class="mb-4 pr-8 text-lg">
          Start <span class="font-bold italic">{{ selectedExam?.name }}</span> in:
        </h3>
        <div class="flex flex-wrap justify-end gap-3">
          <button type="button"
            class="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
            @click="goToExam('tutor')">
            Tutor Mode
          </button>
          <button type="button"
            class="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
            @click="goToExam('exam')">
            Exam Mode
          </button>
          <button type="button"
            class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-sky-800 dark:text-slate-100 dark:hover:bg-sky-900"
            @click="goToExam('review', true)">
            Review Mode
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import axios from "axios";
import PracticeProgressPeersChart from "../../components/Dashboard/PracticeProgressPeersChart.vue";
import { useAuthStore } from "../../stores/authStore";
import { useNursingExamStore } from "../../stores/nursingExamStore";
import Probability from "../../components/Probability.vue";
import router from "../../router";
import StudySchedulePanel from "../../components/Dashboard/StudySchedulePanel.vue";
import StreakCard from "../../components/Dashboard/StreakCard.vue";
import ExamIcon from "../../components/ExamIcon.vue";
import TodayFocusPanel from "../../components/Dashboard/TodayFocusPanel.vue";
import DashboardSnapshot from "../../components/Dashboard/DashboardSnapshot.vue";
import DashboardSearch from "../../components/Dashboard/DashboardSearch.vue";
import type { SearchGroupDef, SearchItem } from "../../components/Dashboard/DashboardSearch.vue";
import type { SnapshotSection } from "../../components/Dashboard/DashboardSnapshot.vue";
import type { FocusAttempt, FocusReviewTask, FocusSection } from "../../components/Dashboard/TodayFocusPanel.vue";

type NursingProgressGroup = "rn" | "lpn" | "rnExit" | "lpnExit";

type NursingAttempt = {
  id?: number | string | null;
  attempt_id?: number | string | null;
  sub_topic_id?: number | string | null;
  sub_topic_name?: string | null;
  question_subject_id?: number | string | null;
  score?: number | string | null;
  mode?: string | null;
  completed?: boolean | number | string | null;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  suspend_index?: number | string | null;
};

type NursingSubject = {
  id?: number | string;
  name: string;
  slug?: string;
  emoji?: string;
  examsCount?: number | string | null;
};

type ExamSearchResult = {
  id: number | string;
  name: string;
};

const PASS_MARK = 75;
const REFERRAL_REWARD_DAYS = 15;

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const nursingStore = useNursingExamStore();
const {
  nursing_exam_date,
  dashdata,
  ati_examsubjects_rn_exams_testbank,
  hesi_examsubjects_rn_exams_testbank,
  regular_examsubjects_rn_exams_testbank,
  certification_examsubjects_rn_exams_testbank,
  ati_examsubjects_pn_exams_testbank,
  hesi_examsubjects_pn_exams_testbank,
  regular_examsubjects_pn_exams_testbank,
  ati_examTopics_rn_exit_exams,
  hesi_examTopics_rn_exit_exams,
  ati_examTopics_pn_exit_exams,
  hesi_examTopics_pn_exit_exams,
} = storeToRefs(nursingStore);

const subjects = ref<NursingSubject[]>([]);
const nursingAttempts = ref<NursingAttempt[]>([]);
const modalRef = ref<HTMLDialogElement | null>(null);
const studyModalRef = ref<HTMLDialogElement | null>(null);
const selectedExam = ref<ExamSearchResult | null>(null);

const firstName = computed(() => {
  const name = user.value?.name?.trim();
  return name ? name.split(/\s+/)[0] : "";
});
const welcomeHeading = computed(() => (firstName.value ? `Welcome back, ${firstName.value}` : "Welcome back"));

const averageScore = computed(() => {
  const rawScore = dashdata.value?.average_score;
  if (rawScore === null || rawScore === undefined || rawScore === "") {
    return "...";
  }

  const score = Number(rawScore);
  if (!Number.isFinite(score)) return "...";

  return `${Math.max(0, Math.min(100, Math.round(score)))}%`;
});

const quickActions = [
  { label: "RN Exams", route: "/nursing/rn-t-exams", icon: "pi pi-book" },
  { label: "LPN Exams", route: "/nursing/lpn-t-exams", icon: "pi pi-file" },
  { label: "Exit RN", route: "/nursing/exit-rn-exams", icon: "pi pi-graduation-cap" },
  { label: "Exit LPN", route: "/nursing/exit-pn-exams", icon: "pi pi-graduation-cap" },
  { label: "Performance", route: "/nursing/performance-analysis", icon: "pi pi-chart-line" },
];

const searchSuggestions = ["Pharmacology", "Fundamentals", "Med-Surg", "Pediatrics", "Mental Health"];

const searchGroups = computed<SearchGroupDef[]>(() => [
  {
    key: "topic",
    label: "Topics",
    cta: "Open bank",
    icon: "pi pi-folder",
    rowIcon: "pi pi-folder-open",
    tile: "theme-icon",
    ink: "theme-text",
    items: subjects.value.map((subject) => ({
      id: subject.id,
      name: subject.name,
      slug: subject.slug,
      meta: subject.examsCount ? `${subject.examsCount} exam sets` : undefined,
    })),
  },
  {
    key: "exam",
    label: "Exam sets",
    cta: "Start",
    icon: "pi pi-file-edit",
    rowIcon: "pi pi-play",
    tile: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
    ink: "text-emerald-600 dark:text-emerald-300",
    fetch: async (query: string) => {
      const response = await axios.get(`/nursing/search/subtopics?query=${encodeURIComponent(query)}`, { showLoader: false });
      const rows = Array.isArray(response.data?.data) ? response.data.data : [];
      return rows.map((row: ExamSearchResult) => ({ id: row.id, name: row.name }));
    },
  },
]);

const onSearchSelect = ({ group, item }: { group: string; item: SearchItem }) => {
  if (group === "topic") {
    goToSubject({ id: Number(item.id), name: item.name, slug: item.slug });
  } else {
    openModal({ id: item.id, name: item.name });
  }
};

const openModal = async (exam: ExamSearchResult) => {
  selectedExam.value = exam;
  await nextTick();
  modalRef.value?.showModal();
};

const openStudyModal = () => {
  studyModalRef.value?.showModal();
};

const closeStudyModal = () => {
  studyModalRef.value?.close();
};

const goToSubject = (subject: NursingSubject) => {
  if (!subject.slug) return;

  router.push(`/nursing/test-bank-loader/${subject.slug}`);
};

const goToExam = (mode: "review" | "tutor" | "exam", examreview = false) => {
  if (selectedExam.value) {
    router.push({
      path: `/nursing/exam/${selectedExam.value.id}`,
      query: {
        mode,
        ...(examreview ? { examreview: "true" } : {}),
      },
    });
    modalRef.value?.close();
  }
};

onMounted(async () => {
  nursingStore.getEssentials();

  try {
    const response = await axios.get("/nursing/subjects", { showLoader: false });
    subjects.value = Array.isArray(response.data?.data) ? response.data.data : [];
  } catch {
    subjects.value = [];
  }

  try {
    const attemptsResponse = await axios.get("/nursing/previous-attempts", { showLoader: false });
    nursingAttempts.value = attemptsResponse.data.data || [];
  } catch {
    nursingAttempts.value = [];
  }
});

const handleExamDateUpdated = (date: string) => {
  nursing_exam_date.value = date;
};

const chapters = [
  { route: "/nursing/study-chapters?chapter_id=7", label: "Fundamentals of Nursing" },
  { route: "/nursing/study-chapters?chapter_id=4", label: "Maternal and Newborn" },
  { route: "/nursing/study-chapters?chapter_id=15", label: "Pediatric" },
  { route: "/nursing/study-chapters?chapter_id=12", label: "Medical Surgical" },
  { route: "/nursing/study-chapters?chapter_id=null", label: "Adult Health" },
  { route: "/nursing/study-chapters?chapter_id=13", label: "Psychiatric / Mental Health" },
  { route: "/nursing/study-chapters?chapter_id=8", label: "Pharmacology" },
  { route: "/nursing/study-chapters?chapter_id=14", label: "Pathophysiology" },
  { route: "/nursing/study-chapters?chapter_id=null", label: "Community Health" },
  { route: "/nursing/study-chapters?chapter_id=null", label: "Leadership and Management" },
];

const nursingQuickLinks = [
  {
    title: "RN Test Bank",
    description: "Core RN drills with tutor and exam modes.",
    route: "/nursing/rn-t-exams",
    icon: "pi pi-book",
    fallbackTotal: 67,
    group: "rn" as NursingProgressGroup,
    color: "text-sky-600 dark:text-sky-300",
    barClass: "bg-gradient-to-r from-sky-500 to-cyan-400",
    tileClass: "bg-linear-to-br from-sky-500 to-cyan-400 text-white shadow-sky-500/30",
    washClass: "from-sky-400/45 to-cyan-300/25 dark:from-sky-500/30 dark:to-cyan-400/15",
    patternClass: "pattern-grid",
    inkClass: "text-sky-600 dark:text-sky-300",
    borderClass: "border-sky-100 hover:border-sky-300 dark:border-sky-800 dark:hover:border-sky-600",
  },
  {
    title: "LPN Test Bank",
    description: "Foundational LPN-focused question banks.",
    route: "/nursing/lpn-t-exams",
    icon: "pi pi-file",
    fallbackTotal: 7,
    group: "lpn" as NursingProgressGroup,
    color: "text-indigo-600 dark:text-indigo-300",
    barClass: "bg-gradient-to-r from-indigo-500 to-sky-400",
    tileClass: "bg-linear-to-br from-indigo-500 to-sky-400 text-white shadow-indigo-500/30",
    washClass: "from-indigo-400/45 to-sky-300/25 dark:from-indigo-500/30 dark:to-sky-400/15",
    patternClass: "pattern-lines",
    inkClass: "text-indigo-600 dark:text-indigo-300",
    borderClass: "border-indigo-100 hover:border-indigo-300 dark:border-indigo-900 dark:hover:border-indigo-600",
  },
  {
    title: "RN EXIT Exams",
    description: "Final-readiness RN exam practice sets.",
    route: "/nursing/exit-rn-exams",
    icon: "pi pi-graduation-cap",
    fallbackTotal: 567,
    group: "rnExit" as NursingProgressGroup,
    color: "text-emerald-600 dark:text-emerald-300",
    barClass: "bg-gradient-to-r from-emerald-500 to-teal-400",
    tileClass: "bg-linear-to-br from-emerald-500 to-teal-400 text-white shadow-emerald-500/30",
    washClass: "from-emerald-400/45 to-teal-300/25 dark:from-emerald-500/30 dark:to-teal-400/15",
    patternClass: "pattern-dots",
    inkClass: "text-emerald-600 dark:text-emerald-300",
    borderClass: "border-emerald-100 hover:border-emerald-300 dark:border-emerald-900 dark:hover:border-emerald-600",
  },
  {
    title: "LPN EXIT Exams",
    description: "LPN graduation-focused exit exam prep.",
    route: "/nursing/exit-pn-exams",
    icon: "pi pi-graduation-cap",
    fallbackTotal: 7,
    group: "lpnExit" as NursingProgressGroup,
    color: "text-orange-600 dark:text-orange-300",
    barClass: "bg-gradient-to-r from-orange-500 to-amber-400",
    tileClass: "bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-orange-500/30",
    washClass: "from-orange-400/45 to-amber-300/25 dark:from-orange-500/30 dark:to-amber-400/15",
    patternClass: "pattern-diagonal",
    inkClass: "text-orange-600 dark:text-orange-300",
    borderClass: "border-orange-100 hover:border-orange-300 dark:border-orange-900 dark:hover:border-orange-600",
  },
];

/* ---------- Today's Focus (shared panel), ranked per subject ---------- */
const subjectPalette = [
  { tileClass: "bg-linear-to-br from-sky-500 to-cyan-400 text-white shadow-sky-500/30", inkClass: "text-sky-600 dark:text-sky-300" },
  { tileClass: "bg-linear-to-br from-indigo-500 to-sky-400 text-white shadow-indigo-500/30", inkClass: "text-indigo-600 dark:text-indigo-300" },
  { tileClass: "bg-linear-to-br from-emerald-500 to-teal-400 text-white shadow-emerald-500/30", inkClass: "text-emerald-600 dark:text-emerald-300" },
  { tileClass: "bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-orange-500/30", inkClass: "text-orange-600 dark:text-orange-300" },
  { tileClass: "bg-linear-to-br from-rose-500 to-pink-500 text-white shadow-rose-500/30", inkClass: "text-rose-600 dark:text-rose-300" },
  { tileClass: "bg-linear-to-br from-violet-500 to-purple-500 text-white shadow-violet-500/30", inkClass: "text-violet-600 dark:text-violet-300" },
];

const attemptedExamsBySubject = computed(() => {
  const map = new Map<number, Set<number>>();
  nursingAttempts.value.forEach((attempt) => {
    const subjectId = toNumber(attempt.question_subject_id);
    const examId = toNumber(attempt.sub_topic_id);
    if (subjectId > 0 && examId > 0) {
      if (!map.has(subjectId)) map.set(subjectId, new Set());
      map.get(subjectId)!.add(examId);
    }
  });
  return map;
});

const focusSections = computed<FocusSection[]>(() =>
  subjects.value
    .filter((subject) => subject.slug && subject.id !== undefined && subject.id !== null)
    .map((subject, index) => {
      const id = toNumber(subject.id);
      const total = Math.max(0, toNumber(subject.examsCount));
      const attempted = attemptedExamsBySubject.value.get(id)?.size || 0;
      const palette = subjectPalette[index % subjectPalette.length];
      return {
        id,
        title: subject.name,
        shortTitle: subject.name,
        icon: "pi pi-book",
        emoji: subject.emoji || null,
        route: `/nursing/test-bank-loader/${subject.slug}`,
        tileClass: palette.tileClass,
        inkClass: palette.inkClass,
        percent: total > 0 ? Math.min(100, Math.round((attempted / total) * 100)) : 0,
      };
    }),
);

const focusAttempts = computed<FocusAttempt[]>(() =>
  nursingAttempts.value.map((attempt) => ({
    sectionId: toNumber(attempt.question_subject_id) || null,
    score: attempt.score === null || attempt.score === undefined || attempt.score === "" ? null : toNumber(attempt.score),
    completed: isCompletedAttempt(attempt),
    timestamp: attemptTimestamp(attempt),
  })),
);

const snapshotSections = computed<SnapshotSection[]>(() =>
  nursingQuickLinksWithProgress.value.map((link) => ({
    id: link.group,
    label: link.title.replace(" Test Bank", "").replace(" Exams", ""),
    attempted: link.attempted,
    total: link.total,
    barClass: link.barClass,
  })),
);

const subjectLabels = computed<Record<string, string>>(() =>
  Object.fromEntries(subjects.value.filter((s) => s.id !== undefined && s.id !== null).map((s) => [String(s.id), s.name])),
);

const focusReviewTask = computed<FocusReviewTask | null>(() => {
  const last = latestCompletedAttempt.value;
  if (!last) return null;
  const score = Math.round(toNumber(last.score));
  const attemptId = last.attempt_id || last.id;
  if (score >= PASS_MARK || !attemptId) return null;
  return {
    label: `Review your misses in ${last.sub_topic_name || "your last set"}`,
    helper: `Scored ${score}%. Read the rationales while they are fresh.`,
    route: `/nursing/exam/${attemptId}?mode=review`,
  };
});

const daysToExam = computed<number | null>(() => {
  const raw = nursing_exam_date.value as unknown;
  if (!raw) return null;
  const exam = raw instanceof Date ? new Date(raw) : new Date(/^\d{4}-\d{2}-\d{2}$/.test(String(raw)) ? `${raw}T00:00:00` : String(raw));
  if (Number.isNaN(exam.getTime())) return null;
  exam.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((exam.getTime() - today.getTime()) / 86400000);
});

const attemptTimestamp = (attempt: NursingAttempt) => {
  const raw = attempt.completed_at || attempt.updated_at || attempt.created_at;
  if (!raw) return 0;

  const timestamp = new Date(raw).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const isCompletedAttempt = (attempt: NursingAttempt) =>
  attempt.completed === true || attempt.completed === 1 || attempt.completed === "1";

const sortedAttempts = computed(() =>
  [...nursingAttempts.value].sort((a, b) => attemptTimestamp(b) - attemptTimestamp(a)),
);

const latestAttempt = computed(() => sortedAttempts.value[0] || null);

const latestCompletedAttempt = computed(() =>
  sortedAttempts.value.find((attempt) => isCompletedAttempt(attempt)) || null,
);

const pausedAttempt = computed(() =>
  sortedAttempts.value.find((attempt) => !isCompletedAttempt(attempt) && toNumber(attempt.id || attempt.attempt_id) > 0) || null,
);

const latestAttemptScore = computed(() => {
  const score = toNumber(latestAttempt.value?.score);
  return Math.max(0, Math.min(100, Math.round(score)));
});

const latestAttemptStatus = computed(() => {
  if (!latestAttempt.value) return "Ready";
  return isCompletedAttempt(latestAttempt.value) ? "Completed" : "Paused";
});

const latestAttemptBadgeClass = computed(() => {
  if (!latestAttempt.value) return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200";
  if (isCompletedAttempt(latestAttempt.value)) {
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

const nextPracticeMove = computed(() => {
  if (pausedAttempt.value) {
    const attemptId = pausedAttempt.value.attempt_id || pausedAttempt.value.id;

    return {
      title: `Resume ${pausedAttempt.value.sub_topic_name || "your paused exam"}`,
      detail: "Pick up exactly where you stopped and keep the attempt history clean.",
      primaryLabel: "Resume Exam",
      primaryRoute: `/nursing/exam/${attemptId}?resume=true`,
      icon: "pi pi-play",
    };
  }

  if (latestCompletedAttempt.value) {
    const score = Math.round(toNumber(latestCompletedAttempt.value.score));
    const attemptId = latestCompletedAttempt.value.attempt_id || latestCompletedAttempt.value.id;
    const needsReview = score < 75;

    return {
      title: needsReview ? "Review your last misses" : "Keep the streak moving",
      detail: needsReview
        ? `Your last completed score was ${score}%. Review the rationale, then retake a focused set.`
        : `Your last completed score was ${score}%. Good time to stack another timed set.`,
      primaryLabel: needsReview ? "Review Attempt" : "Take Another Set",
      primaryRoute: needsReview && attemptId
        ? `/nursing/exam/${attemptId}?mode=review`
        : "/nursing/rn-t-exams",
      icon: needsReview ? "pi pi-eye" : "pi pi-arrow-right",
    };
  }

  return {
    title: "Start your first tracked attempt",
    detail: "Begin with RN or LPN practice to unlock score trends, readiness, and smarter recommendations.",
    primaryLabel: "Start RN Bank",
    primaryRoute: "/nursing/rn-t-exams",
    icon: "pi pi-play",
  };
});

const scoreToneClass = (score: number) => {
  if (score >= 75) return "text-emerald-600 dark:text-emerald-300";
  if (score >= 55) return "text-amber-600 dark:text-amber-300";
  return "text-rose-600 dark:text-rose-300";
};

const scoreBarClass = (score: number) => {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 55) return "bg-amber-500";
  return "bg-rose-500";
};

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const asList = <T = any>(value: T[] | null | undefined) => Array.isArray(value) ? value : [];

const sumExamCounts = (items: any[]) =>
  items.reduce((sum, item) => sum + toNumber(item?.examsCount), 0);

const uniqueIds = (items: any[], key = "id") =>
  new Set(items.map((item) => toNumber(item?.[key])).filter((id) => id > 0));

const countAttemptsByQuestionSubject = (subjectIds: Set<number>) => {
  const attempted = new Set<number>();

  nursingAttempts.value.forEach((attempt) => {
    const subjectId = toNumber(attempt.question_subject_id);
    const examId = toNumber(attempt.sub_topic_id);

    if (subjectIds.has(subjectId) && examId > 0) {
      attempted.add(examId);
    }
  });

  return attempted.size;
};

const countAttemptsByExam = (examIds: Set<number>) => {
  const attempted = new Set<number>();

  nursingAttempts.value.forEach((attempt) => {
    const examId = toNumber(attempt.sub_topic_id);

    if (examIds.has(examId)) {
      attempted.add(examId);
    }
  });

  return attempted.size;
};

const rnSubjects = computed(() => [
  ...asList(ati_examsubjects_rn_exams_testbank.value),
  ...asList(hesi_examsubjects_rn_exams_testbank.value),
  ...asList(regular_examsubjects_rn_exams_testbank.value),
  ...asList(certification_examsubjects_rn_exams_testbank.value),
]);

const lpnSubjects = computed(() => [
  ...asList(ati_examsubjects_pn_exams_testbank.value),
  ...asList(hesi_examsubjects_pn_exams_testbank.value),
  ...asList(regular_examsubjects_pn_exams_testbank.value),
]);

const rnExitExams = computed(() => [
  ...asList(ati_examTopics_rn_exit_exams.value),
  ...asList(hesi_examTopics_rn_exit_exams.value),
]);

const lpnExitExams = computed(() => [
  ...asList(ati_examTopics_pn_exit_exams.value),
  ...asList(hesi_examTopics_pn_exit_exams.value),
]);

const nursingGroupTotals = computed<Record<NursingProgressGroup, number>>(() => ({
  rn: sumExamCounts(rnSubjects.value),
  lpn: sumExamCounts(lpnSubjects.value),
  rnExit: rnExitExams.value.length,
  lpnExit: lpnExitExams.value.length,
}));

const nursingGroupAttempts = computed<Record<NursingProgressGroup, number>>(() => ({
  rn: countAttemptsByQuestionSubject(uniqueIds(rnSubjects.value)),
  lpn: countAttemptsByQuestionSubject(uniqueIds(lpnSubjects.value)),
  rnExit: countAttemptsByExam(uniqueIds(rnExitExams.value)),
  lpnExit: countAttemptsByExam(uniqueIds(lpnExitExams.value)),
}));

const nursingQuickLinksWithProgress = computed(() =>
  nursingQuickLinks.map((link) => {
    const total = nursingGroupTotals.value[link.group] || link.fallbackTotal;
    const attempted = Math.min(total, nursingGroupAttempts.value[link.group] || 0);
    const percent = total > 0 ? Math.round((attempted / total) * 100) : 0;

    return {
      ...link,
      total,
      attempted,
      percent,
    };
  }),
);

const nursingAttemptedTotal = computed(() =>
  new Set(nursingAttempts.value.map((attempt) => toNumber(attempt.sub_topic_id)).filter((id) => id > 0)).size,
);
</script>

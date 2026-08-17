<template>
  <div
    class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-white-500 p-4 text-gray-700 dark:bg-slate-900 dark:text-gray-50 sm:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh]">
    <div class="mx-auto max-w-screen-2xl space-y-6">
      <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
        <article class="rounded-2xl  p-5  xl:col-span-8">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0">
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-200">
                Nursing Dashboard
              </p>
              <h1 class="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                Welcome back, {{ firstName }}
              </h1>
              <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Keep your exam prep centered: open the right bank, check readiness, and follow a weekly study rhythm.
              </p>
            </div>

            <div class="w-full lg:max-w-sm">
              <StreakCard product-code="nursing" />
            </div>
          </div>
          <article class="rounded-2xl border bg-light-blue-500 p-2 dark:border-sky-800 dark:bg-sky-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Find Practice</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  Search topics or exam sets without leaving the dashboard.
                </p>
              </div>
              <span
                class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200">
                <i class="pi pi-search"></i>
              </span>
            </div>

            <div class="relative mt-4">
              <input v-model="universal_search" type="text" placeholder="Search exams or topics..."
                class="input input-bordered w-full rounded-full border-sky-200 bg-slate-50 text-sm dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100" />

              <div v-if="showSearchResults"
                class="absolute left-0 right-0 top-full z-40 mt-2 max-h-[28rem] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-sky-800 dark:bg-sky-950">
                <div v-if="filteredSubjects.length || examTopicsSearchResult.length" class="space-y-4">
                  <div v-if="filteredSubjects.length">
                    <p class="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Topics</p>
                    <div class="space-y-2">
                      <button v-for="subject in filteredSubjects" :key="subject.id" type="button"
                        class="flex w-full items-center justify-between gap-3 rounded-xl bg-sky-50 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-sky-100 dark:bg-sky-900/70 dark:text-slate-100 dark:hover:bg-sky-800"
                        @click="goToSubject(subject)">
                        <span>{{ subject.name }}</span>
                        <i class="pi pi-arrow-right text-xs text-sky-600 dark:text-sky-200"></i>
                      </button>
                    </div>
                  </div>

                  <div v-if="examTopicsSearchResult.length">
                    <p class="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Exams</p>
                    <div class="space-y-2">
                      <button v-for="exam in examTopicsSearchResult" :key="exam.id" type="button"
                        class="flex w-full items-center justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-slate-100 dark:hover:bg-emerald-900/60"
                        @click="openModal(exam)">
                        <span>{{ exam.name }}</span>
                        <i class="pi pi-play text-xs text-emerald-600 dark:text-emerald-200"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <p v-else class="text-sm text-slate-500 dark:text-slate-300">
                  No matches yet. Try a broader keyword.
                </p>
              </div>
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
              @click="openStudyModal">
              <i class="pi pi-bookmark"></i>
              Study Lessons
            </button>
          </div>
        </article>

        <aside class="hidden xl:col-span-4 xl:block">

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
          class="rounded-2xl border border-slate-200 bg-light-blue-500 p-5  dark:border-sky-800 dark:bg-sky-900 xl:col-span-7">
          <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="text-lg font-extrabold text-slate-950 dark:text-white">Exam Bank Categories</h2>
              <p class="text-xs text-slate-500 dark:text-slate-300">Track attempted exams against each bank.</p>
            </div>
            <span
              class="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
              {{ nursingAttemptedTotal }} attempted
            </span>
          </div>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <RouterLink v-for="link in nursingQuickLinksWithProgress" :key="link.route" :to="link.route"
              class="group flex h-full flex-col rounded-xl border border-sky-100 bg-white p-4 shadow-custom transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50 dark:border-sky-800 dark:bg-sky-950/50 dark:hover:bg-sky-950">
              <div class="flex items-start justify-between gap-3">
                <div class="flex min-w-0 items-start gap-3">
                  <span
                    class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-lg ring-1 ring-sky-100 dark:bg-sky-900/70 dark:ring-sky-800"
                    :class="link.color">
                    <i :class="link.icon"></i>
                  </span>
                  <div class="min-w-0">
                    <h3 class="font-bold leading-tight text-slate-950 dark:text-white">{{ link.title }}</h3>
                    <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{{ link.description }}</p>
                  </div>
                </div>
                <span
                  class="shrink-0 rounded-full border border-sky-100 bg-light-blue-500 px-2.5 py-1 text-[11px] font-bold text-sky-800 dark:border-sky-800 dark:bg-sky-900 dark:text-sky-100">
                  {{ link.total }} sets
                </span>
              </div>

              <div class="mt-auto pt-5">
                <div class="mb-2 flex items-center justify-between text-xs">
                  <span class="font-semibold text-slate-500 dark:text-slate-300">Exam attempted</span>
                  <span class="font-extrabold text-slate-950 dark:text-white">
                    {{ link.attempted }} / {{ link.total }}
                  </span>
                </div>
                <div
                  class="h-2.5 overflow-hidden rounded-full bg-light-blue-500 ring-1 ring-sky-100 dark:bg-slate-800 dark:ring-slate-700">
                  <div class="h-full rounded-full transition-all duration-500" :class="link.barClass"
                    :style="{ width: `${link.percent}%` }"></div>
                </div>
                <div class="mt-3 flex items-center justify-between gap-2">
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-300">
                    {{ link.percent }}% complete
                  </span>
                  <span
                    class="inline-flex items-center gap-1 text-xs font-bold text-sky-700 transition group-hover:translate-x-0.5 dark:text-sky-200">
                    Open <i class="pi pi-arrow-right text-[10px]"></i>
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
                  <RouterLink to="/nursing/performance-analysis"
                    class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-sky-800 dark:text-slate-100 dark:hover:bg-sky-900">
                    <i class="pi pi-chart-line"></i>
                    Analyze
                  </RouterLink>
                  <RouterLink to="/nursing/previous-attempts"
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
                    {{ latestAttempt.sub_topic_name || "Nursing practice set" }}
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
                    No attempts yet.
                  </p>
                  <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">
                    Start any exam bank and this panel will turn into a progress shortcut.
                  </p>
                </template>
              </div>
            </div>
          </section>
        </article>

        <div class="min-w-0 xl:col-span-5">
          <Probability :pass-mark="75" product="nursing" />
        </div>
      </section>

      <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <article
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900 xl:col-span-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Today's Focus</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">
                Two focused starts for a productive practice session.
              </p>
            </div>
            <span
              class="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              Random Sets
            </span>
          </div>

          <div class="mt-4 space-y-3">
            <article v-for="card in todayFocusCards" :key="card.key"
              class="grid grid-cols-12 gap-4 rounded-xl border border-slate-200 bg-light-blue-500 p-3 dark:border-sky-800 dark:bg-sky-950/60">
              <div class="col-span-4 flex flex-col items-center justify-between text-center text-sm">
                <div class="radial-progress bg-white shadow-sm dark:bg-sky-900/70" :class="card.color"
                  :style="{ '--value': card.targetScore }" role="progressbar">
                  {{ card.badge }}
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
                  <RouterLink v-if="card.route" :to="card.route"
                    class="rounded-full bg-sky-500 px-4 py-1 text-xs font-semibold text-white transition hover:bg-sky-600">
                    Start
                  </RouterLink>
                  <span v-else
                    class="rounded-full bg-slate-200 px-4 py-1 text-xs font-semibold text-slate-500 dark:bg-sky-800 dark:text-slate-300">
                    Loading
                  </span>
                </div>
              </div>
            </article>
          </div>
        </article>

        <div class="min-w-0 xl:col-span-7">
          <PracticeProgressPeersChart />
        </div>
      </section>

      <StudySchedulePanel product-code="nursing" :initial-exam-date="nursing_exam_date"
        progress-route="/nursing/performance-analysis" study-route="/nursing/study-chapters?chapter_id=7"
        title="Nursing Study Schedule" @updated="handleExamDateUpdated" />
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
import { computed, nextTick, onMounted, ref, watch } from "vue";
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

const RandSubject1 = ref<NursingSubject | null>(null);
const RandSubject2 = ref<NursingSubject | null>(null);
const subjects = ref<NursingSubject[]>([]);
const nursingAttempts = ref<NursingAttempt[]>([]);
const universal_search = ref("");
const examTopicsSearchResult = ref<ExamSearchResult[]>([]);
const modalRef = ref<HTMLDialogElement | null>(null);
const studyModalRef = ref<HTMLDialogElement | null>(null);
const selectedExam = ref<ExamSearchResult | null>(null);

const firstName = computed(() => user.value?.name?.split(" ")[0] || "Student");

const averageScore = computed(() => {
  const rawScore = dashdata.value?.average_score;
  if (rawScore === null || rawScore === undefined || rawScore === "") {
    return "...";
  }

  const score = Number(rawScore);
  if (!Number.isFinite(score)) return "...";

  return `${Math.max(0, Math.min(100, Math.round(score)))}%`;
});

const summaryStats = computed(() => [
  {
    label: "Attempts",
    value: dashdata.value?.nursing_attempts ?? nursingAttempts.value.length,
    detail: "All time practice",
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
    label: "Banks",
    value: nursingQuickLinks.length,
    detail: "RN, LPN, and exit prep",
    icon: "pi pi-th-large",
    color: "text-orange-600 dark:text-orange-300",
  },
]);

const quickActions = [
  { label: "RN Exams", route: "/nursing/rn-t-exams", icon: "pi pi-book" },
  { label: "LPN Exams", route: "/nursing/lpn-t-exams", icon: "pi pi-file" },
  { label: "Exit RN", route: "/nursing/exit-rn-exams", icon: "pi pi-graduation-cap" },
  { label: "Exit LPN", route: "/nursing/exit-pn-exams", icon: "pi pi-graduation-cap" },
  { label: "Performance", route: "/nursing/performance-analysis", icon: "pi pi-chart-line" },
];

const searchTerm = computed(() => universal_search.value.trim().toLowerCase());

const showSearchResults = computed(() => searchTerm.value.length >= 3);

const filteredSubjects = computed(() => {
  if (!showSearchResults.value) {
    return [];
  }

  return subjects.value.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.value),
  );
});

const openModal = async (exam: ExamSearchResult) => {
  selectedExam.value = exam;
  universal_search.value = "";
  examTopicsSearchResult.value = [];
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

  universal_search.value = "";
  examTopicsSearchResult.value = [];
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
    const subjectData = Array.isArray(response.data?.data) ? response.data.data : [];
    const shuffledSubjects = [...subjectData].sort(() => Math.random() - 0.5);

    subjects.value = subjectData;
    RandSubject1.value = shuffledSubjects[0] || null;
    RandSubject2.value = shuffledSubjects[1] || shuffledSubjects[0] || null;
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
  },
];

const focusCardPresets = [
  {
    targetScore: 60,
    color: "text-sky-600 dark:text-sky-300",
    targetCopy: "At least 60%",
    duration: "40 min",
    helper: "Warm up with one focused set.",
    community: "12k joined",
  },
  {
    targetScore: 70,
    color: "text-emerald-500 dark:text-emerald-300",
    targetCopy: "At least 65%",
    duration: "50 min",
    helper: "Accept a mixed review challenge.",
    community: "19k joined",
  },
];

const todayFocusCards = computed(() =>
  [RandSubject1.value, RandSubject2.value].map((subject, index) => {
    const preset = focusCardPresets[index];
    const examCount = toNumber(subject?.examsCount) || 10;

    return {
      key: `focus-${index}-${subject?.slug || "loading"}`,
      title: subject?.name || "Analysing subject...",
      badge: subject?.emoji || `${preset.targetScore}%`,
      route: subject?.slug ? `/nursing/test-bank-loader/${subject.slug}` : "",
      goal: `${examCount} exams`,
      ...preset,
    };
  }),
);

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

watch(universal_search, (newVal) => {
  const query = newVal.trim();

  if (query.length < 3) {
    examTopicsSearchResult.value = [];
    return;
  }

  axios
    .get(`/nursing/search/subtopics?query=${encodeURIComponent(query)}`, { showLoader: false })
    .then((response) => {
      examTopicsSearchResult.value = Array.isArray(response.data?.data) ? response.data.data : [];
    })
    .catch((error) => {
      console.error("Error fetching search results:", error);
      examTopicsSearchResult.value = [];
    });
});
</script>

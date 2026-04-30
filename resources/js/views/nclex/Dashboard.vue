<template>
  <div
    class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-gray-50 dark:bg-sky-950 text-gray-700 dark:text-gray-50">
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div
        class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-purple-300 via-sky-300 to-teal-200 opacity-30 blur-[120px] rounded-full">
      </div>
      <div
        class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-200 opacity-30 blur-[100px] rounded-full">
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto">
      <div class="w-full flex justify-between flex-row gap-2">
        <div class="text-start mx-2 pt-4 dark:text-slate-200">
          <h5 class="text-2xl font-semibold">
            Hello, <span class="font-light text-base">{{ user?.name.split(" ")[0] }}</span>
          </h5>
          <small class="font-light text-xs">
            Glad you are here. Keep showing up and your NCLEX confidence will grow.
          </small>
          <div class="mt-3 max-w-md">
            <StreakCard product-code="nclex" />
          </div>
          <div class="flex flex-wrap items-center gap-1 mt-2">
            <RouterLink to="/nclex/linear" class="badge badge-info text-white">#Linear</RouterLink>
            <RouterLink to="/nclex/readiness" class="badge badge-success text-white">#Readiness</RouterLink>
            <RouterLink to="/nclex/cat" class="badge badge-warning text-white">#CAT</RouterLink>
            <button class="badge bg-orange-500 border-0 text-white cursor-pointer" @click="openCreateTestModal">
              #Create Test
            </button>
          </div>
        </div>
        <DaysLeft product_code="nclex" />
      </div>

      <div class="flex flex-wrap justify-around my-2 py-6 w-full gap-4 mb-6">
        <StatCard label="All Questions" quantity="5000+" icon="pi pi-file" description="Updated regularly" />
        <StatCard label="My Attempts" :quantity="dashdata?.nclex_attempts ?? 0" icon="pi pi-pencil"
          description="All time" link="/nclex/previous-attempts" />
        <StatCard label="Practice Modes" quantity="3" link="/nclex/" icon="pi pi-sparkles"
          description="Linear, Readiness, CAT" />
        <StatCard label="My Avg. Score" icon="pi pi-percentage" description="Recent attempts"
          :quantity="`${dashdata?.average_score ?? `...`} %`" link="/nclex/performance-analysis" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto">
        <div class="flex justify-between flex-col items-center text-black dark:text-gray-50  rounded-2xl  ">
          <div class="w-full flex flex-col justify-center items-center">

            <div
              class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full bg-white dark:bg-sky-900 p-4 rounded-3xl shadow-xs">
              <RouterLink v-for="link in nclexQuickLinks" :key="link.route" :to="link.route"
                class="rounded-2xl border border-slate-200 bg-slate-50/80 dark:bg-sky-950/40 dark:border-sky-800 p-4 hover:shadow-md hover:-translate-y-[1px] transition">
                <div class="flex items-start justify-between gap-2">

                  <div>
                    <h4 class="font-bold text-sky-600 dark:text-white">{{ link.title }}</h4>
                    <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">{{ link.description }}</p>
                  </div>
                  <i :class="`${link.icon} ${link.color}`"></i>
                </div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-300 mt-3">{{ link.count }}</p>
              </RouterLink>

              <button @click="openCreateTestModal"
                class="rounded-2xl border border-slate-200 bg-slate-50/80 dark:bg-sky-950/40 dark:border-sky-800 p-4 hover:shadow-md hover:-translate-y-[1px] transition text-left">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h4 class="font-bold text-amber-600 dark:text-white">Create Test</h4>
                    <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">Build a custom NCLEX test by topic and
                      difficulty.</p>
                  </div>
                  <i class="pi pi-plus-circle text-orange-600"></i>
                </div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-300 mt-3">+ Create now</p>
              </button>
            </div>
            <div class="mt-6 text-center">
              <h2 class="text-2xl font-semibold mb-4">Why Nursedive is the Best Choice for NCLEX Prep</h2>

              <p class="text-sm text-gray-600 dark:text-slate-300 mb-6 max-w-xl mx-auto">
                With our comprehensive question bank, realistic practice modes, and personalized insights, we provide
                everything you need to build confidence and achieve your best score on the NCLEX.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div
                  class="p-4 border rounded-lg hover:shadow-lg  transition bg-gradient-to-br from bg-green-50/50 to-green-100/70 border-green-200 border-0.5">
                  <h3 class="font-semibold mb-2">Comprehensive Question Bank</h3>
                  <p class="text-xs text-gray-600 dark:text-slate-300">
                    Thousands of up-to-date NCLEX questions covering all topics, with explanations for every answer.
                  </p>
                </div>
                <div
                  class="p-4 border rounded-lg  hover:shadow-lg transition bg-gradient-to-br from bg-sky-50/50 to-sky-100/70 border-sky-200 border-0.5">
                  <h3 class="font-semibold mb-2">Realistic Practice Modes</h3>
                  <p class="text-xs text-gray-600 dark:text-slate-300">
                    Experience timed, adaptive, and full-length exams that simulate the actual NCLEX environment.
                  </p>
                </div>
                <div
                  class="p-4 border rounded-lg  hover:shadow-lg transition bg-gradient-to-br from bg-amber-50/50 to-amber-100/70 border-amber-200 border-0.5">
                  <h3 class="font-semibold mb-2">Personalized Insights</h3>
                  <p class="text-xs text-gray-600 dark:text-slate-300">
                    Track your progress, identify weak areas, and get actionable tips to maximize your score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col justify-center items-center gap-4 rounded-2xl bg-gradient-to-b from-indigo-50 to-transparent dark:from-sky-900 p-6">
          <div class="mb-4">
            <Probability :pass-mark="75" product="nclex" />
          </div>
        </div>
      </div>

      <div class="flex mt-4">
        <div class="w-full flex flex-col md:flex-row justify-between items-stretch gap-4">
          <div
            class="w-full md:w-1/2 flex flex-col justify-start  gap-4 border-gray-200 dark:border-sky-700 border rounded-2xl p-4 items-center">
            <h5 class="text-lg font-semibold text-start w-full">Today's Focus</h5>
            <div v-for="track in focusTracks" :key="track.label"
              class="w-full max-w-md bg-indigo-50 dark:bg-sky-900 rounded-3xl p-3 my- grid grid-cols-12 gap-4">
              <div class="col-span-4 text-sm text-start flex flex-col justify-between">
                <div class="radial-progress shadow-lg opacity-90 bg-white text-sky-600"
                  :style="{ '--value': track.targetScore }" role="progressbar">
                  {{ track.targetScore }}%
                </div>
                <span class="mt-4 text-xs">Target score</span>
              </div>
              <div class="col-span-8 text-sm text-start flex flex-col justify-between">
                <h6 class="font-medium">{{ track.label }}</h6>
                <div class="flex items-center justify-between gap-2">
                  <span><i class="pi pi-arrow-up text-teal-500 mr-2"></i>{{ track.goal }}</span>
                  <span><i class="pi pi-clock mr-2"></i>{{ track.duration }}</span>
                </div>
                <p class="mt-2 p-1 rounded-3xl bg-teal-500/20 text-center text-xs">{{ track.helper }}</p>
                <div class="mt-4 flex gap-2">
                  <span
                    class="bg-transparent border border-dashed border-teal-500 text-gray-900 lg:min-w-24 hover:text-white dark:text-slate-200 rounded-full px-3 py-1 text-xs text-center">
                    {{ track.community }}
                  </span>
                  <RouterLink :to="track.route"
                    class="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-4 py-1 text-xs text-center">
                    Start
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/2 flex flex-col justify-center items-center gap-1">
            <div class="w-full bg-white dark:bg-sky-900 rounded-2xl shadow-sm p-2">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="text-lg font-semibold">Confidence Booster</h3>
                  <p class="text-sm text-gray-600 dark:text-slate-300">
                    A focused micro-plan to increase speed and accuracy before your next attempt.
                  </p>
                </div>
                <span class="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                  +12% target
                </span>
              </div>

              <div class="mt-4 space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-medium">Daily NCLEX mini-goal</span>
                  <span class="text-sky-600 dark:text-sky-300 font-semibold">25 questions</span>
                </div>
                <div class="w-full h-2 rounded-full bg-gray-200 dark:bg-sky-800 overflow-hidden">
                  <div class="h-full w-3/5 bg-gradient-to-r from-sky-500 to-emerald-500"></div>
                </div>
                <p class="text-xs text-gray-600 dark:text-slate-300">
                  Complete one timed set, review rationales, then retake weak areas within 24 hours.
                </p>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-2">
                <RouterLink to="/nclex/readiness"
                  class="text-center rounded-full px-3 py-2 text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition">
                  Start Readiness
                </RouterLink>
                <RouterLink to="/nclex/performance-analysis"
                  class="text-center rounded-full px-3 py-2 text-sm font-semibold border border-gray-300 dark:border-sky-700 hover:bg-gray-100 dark:hover:bg-sky-800 transition">
                  View Analysis
                </RouterLink>
              </div>
            </div>
            <div class="mt-6 space-y-4 max-w-xl mx-auto">
              <h5 class="text-lg font-semibold text-center mb-2">NCLEX Prep Tips from Nursedive</h5>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div class="w-full bg-white dark:bg-sky-900 rounded-2xl shadow-sm p-4 transition hover:shadow-md">
                  <p class="text-gray-600 dark:text-slate-300 text-sm">
                    <span class="h-10 w-8 p-0.5  rounded-full border bg-green-100 border-green-200 ">1</span> Practice
                    <b>smarter</b> ,
                    not just
                    <b> harder</b>.
                    Focus on your weak
                    areas to maximize score gains.
                  </p>
                </div>

                <div class="w-full bg-white dark:bg-sky-900 rounded-2xl shadow-sm p-4 transition hover:shadow-md">
                  <p class="text-gray-600 dark:text-slate-300 text-sm">
                    <span class="h-10 w-8 p-0.5  rounded-full border bg-green-100 border-green-200 ">2</span> <b>Review
                      explanations </b> carefully. Understanding why an answer is correct is<b> more valuable than
                      memorizing.</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <StudySchedulePanel product-code="nclex" :initial-exam-date="nclex_exam_date"
          progress-route="/nclex/performance-analysis" study-route="/nclex/study-chapters?chapter_id=7"
          title="NCLEX Study Schedule" @updated="handleExamDateUpdated" />
      </div>
    </div>

    <dialog ref="createTestModalRef" class="modal">
      <div class="modal-box bg-white modal-2xl py-3 px-0">
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
import StatCard from "../../components/Stats/Primary.vue";
import DaysLeft from "../../components/DaysLeft.vue";
import Probability from "../../components/Probability.vue";
import CreateTest from "./CreateTest.vue";
import StudySchedulePanel from "../../components/Dashboard/StudySchedulePanel.vue";
import StreakCard from "../../components/Dashboard/StreakCard.vue";
import { useAuthStore } from "../../stores/authStore";
import { useNclexExamStore } from "../../stores/nclexExamStore";

interface FocusTrack {
  label: string;
  route: string;
  goal: string;
  duration: string;
  helper: string;
  community: string;
  targetScore: number;
}

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const nclexStore = useNclexExamStore();
const { nclex_exam_date, dashdata } = storeToRefs(nclexStore);

const createTestModalRef = ref<HTMLDialogElement | null>(null);

const focusCatalog: FocusTrack[] = [
  {
    label: "Adaptive CAT Sprint",
    route: "/nclex/cat",
    goal: "1 adaptive exam",
    duration: "45-75 min",
    helper: "Build decision speed with mixed-difficulty items.",
    community: "12k joined",
    targetScore: 70,
  },
  {
    label: "Readiness Confidence Set",
    route: "/nclex/readiness",
    goal: "2 readiness sets",
    duration: "35-50 min",
    helper: "Confirm consistency before exam week.",
    community: "9k joined",
    targetScore: 75,
  },
  {
    label: "Linear Fundamentals Drill",
    route: "/nclex/linear",
    goal: "40 focused questions",
    duration: "30-45 min",
    helper: "Reinforce core concepts and rationale review.",
    community: "15k joined",
    targetScore: 68,
  },
];

const nclexQuickLinks = [
  {
    title: "Linear Assessment",
    description: "Structured, exam-style linear practice sessions.",
    route: "/nclex/linear",
    icon: "pi pi-file",
    count: "Open exams",
    color: "text-sky-600",
  },
  {
    title: "Readiness Tests",
    description: "Measure readiness with focused confidence checks.",
    route: "/nclex/readiness",
    icon: "pi pi-bullseye",
    count: "Open exams",
    color: "text-indigo-600",
  },
  {
    title: "CAT Simulation",
    description: "Adaptive exam simulation that mirrors real pressure.",
    route: "/nclex/cat",
    icon: "pi pi-desktop",
    count: "Start now",
    color: "text-emerald-600",
  },
];

const focusTracks = ref<FocusTrack[]>([]);

const averageScoreValue = computed(() => {
  const score = Number(dashdata.value?.average_score ?? 0);
  if (!Number.isFinite(score)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(score)));
});

onMounted(() => {
  nclexStore.getEssentials();
  const shuffled = [...focusCatalog].sort(() => Math.random() - 0.5);
  focusTracks.value = shuffled.slice(0, 2);
});

const openCreateTestModal = () => {
  createTestModalRef.value?.showModal();
};

const handleExamDateUpdated = (date: string) => {
  nclex_exam_date.value = date;
};
</script>

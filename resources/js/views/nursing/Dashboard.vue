<template>
  <div
    class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh]  2xl:min-h-[94vh] overflow-y-scroll p-6 bg-gray-50 dark:bg-sky-950 text-gray-700 dark:text-gray-50">
    <div class="absolute inset-0  pointer-events-none -z-10">
      <!-- Purple to Sky to Green Gradient Cloud -->
      <div
        class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-purple-300 via-sky-300 to-teal-200 opacity-30 blur-[120px] rounded-full">
      </div>
      <div
        class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-200 opacity-30 blur-[100px] rounded-full">
      </div>
    </div>
    <div class="max-w-screen-2xl m-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6  mx-auto">
        <div class="flex justify-between flex-col items-center text-black dark:text-gray-50 ">
          <div class="mb-4  w-full text-start ">
            <h5 class="text-2xl font-semibold">Hello, <span class="font-light text-base">
                {{ user?.name.split(' ')[0] }}</span>
            </h5>
            <small class="font-light text-xs">Glad you are here!🤗<br />
              Steady, focused practice leads to mastery. Continue building your nursing knowledge with confidence.
            </small>
            <div class="mt-3 max-w-md">
              <StreakCard product-code="nursing" />
            </div>
            <div class="flex flex-wrap justify-center items-center gap-0.5 w-full">
              <router-link to="/nursing/rn-t-exams" class="mt-2 ml-2">
                <span class="p-1 text-xs text-white badge badge-info rounded-full">#RN Exams</span> </router-link>
              <router-link to="/nursing/lpn-t-exams" class="mt-2 ml-2">
                <small class="p-1 text-xs text-white badge badge-success rounded-full">#LPN Exams</small> </router-link>
              <router-link to="/nursing/exit-rn-exams" class="mt-2 ml-2">
                <small class="p-1 text-xs text-white badge badge-warning rounded-full">#Exit RN </small> </router-link>
              <router-link to="/nursing/exit-pn-exams" class="mt-2 ml-2">
                <small class="p-1 text-xs text-white badge badge-accent rounded-full">#Exit LPN</small> </router-link>
              <span onclick="my_modal_9.showModal()" class="mt-2 ml-2"><span
                  class="p-1 text-xs text-white badge bg-orange-500 border-0 cursor-pointer rounded-full">Study
                  Lessons</span>
              </span>
              <dialog id="my_modal_9" class="modal">
                <div class="modal-box bg-gray-50 dark:bg-sky-950 text-gray-900 dark:text-white">
                  <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                  <h3 class="text-lg font-bold mx-2 custom-underline-red">Nursing Study Areas</h3>
                  <div class="max-w-md mx-auto bg-blue-50/50 rounded-xl  border border-gray-100">
                    <ul class="divide-y divide-accent">
                      <li v-for="(chapter, index) in chapters" :key="index">
                        <router-link :to="chapter.route" :class="[
                          'flex items-center px-4 py-3 text-sm transition font-medium rounded-lg hover:shadow-lg',
                          chapter.route.includes('null')
                            ? 'text-gray-400 cursor-not-allowed pointer-events-none'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-sky-600'
                        ]" active-class="bg-indigo-50 text-indigo-700 font-medium">
                          {{ chapter.label }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
          <div class="w-full flex flex-col justify-center items-center">
            <h5 class="text-lg font-semibold text-start w-full">
              Search for Exams/Topics
            </h5>
            <!-- wrapper for positioning -->
            <div class="relative w-full max-w-md mt-2">

              <input type="text" placeholder="Search for exams, questions, topics..." v-model="universal_search"
                class="input border-orange-500 input-bordered w-full dark:bg-gray-200 dark:text-gray-500 bg-gray-50 rounded-full" />

              <!-- dropdown -->
              <div v-if="universal_search.length >= 3"
                class="absolute left-0 right-0 top-full z-40 bg-white dark:bg-sky-900 rounded-2xl mt-2 p-4 shadow-lg">
                <h6 class="font-semibold mb-2">Search Results:</h6>
                <ul class="max-h-48 overflow-y-auto">
                  <div class="text-gray-400 mb-1">Topics</div>
                  <li v-for="subject in filteredSubjects" :key="subject.id"
                    class="border-b border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between items-center gap-1">
                      <span @click="$router.push(`/nursing/test-bank-loader/${subject.slug}`)"
                        class="bg-teal-200 px-2 rounded-full text-xs m-0.5 cursor-pointer hover:bg-teal-300 hover:shadow">{{
                          subject.name }}</span>
                    </div>
                  </li>
                </ul>
                <ul class="max-h-48 overflow-y-auto">
                  <div class="text-gray-400 mb-1">Exams</div>
                  <li v-for="exam in examTopicsSearchResult" :key="exam.id"
                    class="border-b border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between items-center gap-1">
                      <span @click="() => openModal(exam)"
                        class="bg-teal-200 px-2 rounded-full text-xs m-0.5 cursor-pointer hover:bg-teal-300 hover:shadow">{{
                          exam.name }}</span>
                    </div>
                  </li>
                </ul>
              </div>
              <dialog ref="modalRef" id="examModal" class="modal">
                <div class="modal-box bg-gray-50 dark:bg-sky-950 text-gray-900 dark:text-white">
                  <div class="modal-action mt-4">
                    <form method="dialog">
                      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                  </div>
                  <h3 class="text-lg mb-4">
                    Start <span class="italic font-bold">{{ selectedExam?.name }}</span> in:
                  </h3>
                  <div class="flex justify-end gap-4">
                    <div class="flex justify-end gap-4">
                      <CommonButton button-text="Tutor Mode"
                        classes="bg-teal-500  rounded-lg text-white hover:bg-teal-600"
                        :action="() => goToExam('tutor')" />
                      <CommonButton button-text="Exam Mode" classes=" rounded-lg" :action="() => goToExam('exam')" />
                    </div>
                  </div>
                </div>
              </dialog>
            </div>
          </div>

          <h5 class="text-lg font-semibold text-start w-full">Today's pick</h5>
          <div class="w-full max-w-md bg-indigo-50 dark:bg-sky-900  rounded-3xl p-3 my-2 grid grid-cols-12 gap-4">
            <div class=" col-span-4 text-sm  text-start flex flex-col justify-between">
              <div class="radial-progress shadow-lg opacity-90 bg-white text-sky-600" style="--value: 40"
                role="progressbar">
                {{ RandSubject1 ? RandSubject1.emoji : '...' }}
              </div>
              <span class=" mt-4">Alteast 60%</span>
            </div>
            <div class=" col-span-8 text-sm  text-start flex flex-col justify-between ">
              <h6>{{ RandSubject1 ? RandSubject1.name : 'Analysing...' }}</h6>

              <div class="flex items-center justify-between gap-2  ">
                <div class="  flex flex-col justify-between">
                  <span class=""><i class="pi pi-arrow-up text-teal-500 mr-2"></i>10
                    Exams</span>
                </div>
                <div class="flex flex-col justify-between">
                  <span><i class="pi pi-clock  mr-2"></i>&asymp;{{ [40, 50, 60, 70][Math.floor(Math.random() * 4)] }}
                    mins</span>
                </div>
              </div>
              <span>
                <small>
                  <p class=" mt-2 p-1 rounded-3xl bg-teal-500/20 text-center">
                    Aleast 65%
                    Accept challenge!</p>
                </small>
              </span>
              <span class=" mt-4 flex gap-2">
                <CommonButton buttonText="12k+ Joined"
                  classes="bg-transparent border border-dashed border-teal-500 text-gray-900  lg:min-w-24 hover:text-white dark:text-slate-200" />
                <CommonButton classes="lg:min-w-24" buttonText="Start"
                  :action="() => RandSubject1 ? $router.push(`/nursing/test-bank-loader/${RandSubject1?.slug}`) : null" />
              </span>
            </div>
          </div>
          <div class="w-full max-w-md bg-indigo-50 dark:bg-sky-900 rounded-3xl p-3 my-2 grid grid-cols-12 gap-4">
            <div class=" col-span-4 text-sm  text-start flex flex-col justify-between">
              <div class="radial-progress shadow-lg opacity-90 bg-white text-emerald-500" style="--value: 70"
                role="progressbar">
                {{ RandSubject1 ? RandSubject2.emoji : '...' }}
              </div>
              <span class="mt-4">Atleast 65%</span>
            </div>
            <div class=" col-span-8 text-sm  text-start flex flex-col justify-between ">
              <h6>{{ RandSubject2 ? RandSubject2.name : 'Analysing...' }}</h6>

              <div class="flex items-center justify-between gap-2  ">
                <div class="  flex flex-col justify-between">
                  <span class=""><i class="pi pi-arrow-up text-teal-500 mr-2"></i>10
                    Exams</span>
                </div>
                <div class="flex flex-col justify-between">
                  <span><i class="pi pi-clock  mr-2"></i>&asymp;{{ [40, 50, 60, 70][Math.floor(Math.random() * 4)] }}
                    mins</span>
                </div>
              </div>
              <span>
                <small>
                  <p class="mt-2 p-1 rounded-3xl bg-teal-500/20 text-center">
                    Atleast 65%
                    Accept challenge!</p>
                </small>
              </span>
              <span class=" mt-4 flex gap-2">
                <CommonButton buttonText="19k+ Joined"
                  classes="bg-transparent border border-dashed border-teal-500 text-gray-900 lg:min-w-24 hover:text-white dark:text-slate-200" />
                <CommonButton classes="lg:min-w-24" buttonText="Start"
                  :action="() => RandSubject2 ? $router.push(`/nursing/test-bank-loader/${RandSubject2?.slug}`) : null" />
              </span>
            </div>
          </div>
        </div>
        <!-- <div class="border-l border w-0 hidden md:block mt-24 border-dashed h-96"></div> -->
        <!-- Stats Section -->
        <div
          class="flex flex-col justify-center items-center gap-4 rounded-2xl bg-gradient-to-b from-indigo-50 to-transparent dark:from-sky-900 p-6">
          <div class="mb-6">
            <Probability :pass-mark="75" product="nursing" />
          </div>
          <div class="flex w-full justify-center items-center gap-4 flex-row px-8">
            <div class="w-1/2 flex flex-col justify-center items-center">
              <div class="text-center font-semibold">
                Your Avg. Score
              </div>
              <div class="radial-progress shadow-lg opacity-90 bg-white text-sky-600 mt-4"
                :style="{ '--value': dashdata?.average_score }" role="progressbar">{{ dashdata?.average_score }}%</div>
            </div>
            <div class="w-1/2">
              <div class="text-center font-semibold">
                Subscription Info
              </div>
              <DaysLeft product_code="nursing" class="w-full" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex mt-4">
        <div class="w-full flex flex-col md:flex-row justify-between items-stretch gap-4">
          <!-- Stat Cards Column -->
          <div class="w-full md:w-1/2 flex flex-col justify-center items-center">
            <h5 class="text-lg font-semibold text-start w-full">Exam Categories</h5>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full bg-white dark:bg-sky-900 p-4 rounded-3xl shadow-xs">
              <RouterLink v-for="link in nursingQuickLinks" :key="link.route" :to="link.route"
                class="rounded-2xl border border-slate-200 bg-slate-50/80 dark:bg-sky-950/40 dark:border-sky-800 p-4 hover:shadow-md hover:-translate-y-[1px] transition">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white">{{ link.title }}</h4>
                    <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">{{ link.description }}</p>
                  </div>
                  <i :class="`${link.icon} ${link.color}`"></i>
                </div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-300 mt-3">{{ link.count }}</p>
              </RouterLink>
            </div>
          </div>
          <!-- Chart Column -->
          <div class="w-full md:w-1/2 flex justify-center items-center">
            <PracticeProgressPeersChart />
          </div>
        </div>
      </div>
      <div class="mt-6">
        <StudySchedulePanel product-code="nursing" :initial-exam-date="nursing_exam_date"
          progress-route="/nursing/performance-analysis" study-route="/nursing/study-chapters?chapter_id=7"
          title="Nursing Study Schedule" @updated="handleExamDateUpdated" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PracticeProgressPeersChart from "../../components/Dashboard/PracticeProgressPeersChart.vue";
import CommonButton from "../../components/Buttons/CommonButton.vue";

import { useAuthStore } from "../../stores/authStore";
import { computed, onMounted, ref, watch, nextTick } from "vue";
import axios from "axios";
import { useNursingExamStore } from "../../stores/nursingExamStore";
import DaysLeft from "../../components/DaysLeft.vue";
import Probability from "../../components/Probability.vue";
import router from "../../router";
import { storeToRefs } from "pinia";
import StudySchedulePanel from "../../components/Dashboard/StudySchedulePanel.vue";
import StreakCard from "../../components/Dashboard/StreakCard.vue";


const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const nursingStore = useNursingExamStore();
const { nursing_exam_date, dashdata } = storeToRefs(nursingStore);

const RandSubject1 = ref()

const RandSubject2 = ref()

const subjects = ref([]);

const universal_search = ref('');

const examTopicsSearchResult = ref([]);

const modalRef = ref<HTMLDialogElement | null>(null);

const selectedExam = ref<{ id: number; name: string } | null>(null);

const filteredSubjects = computed(() => {
  if (universal_search.value.length < 3) {
    return [];
  }

  return subjects.value.filter(subject =>
    subject.name.toLowerCase().includes(universal_search.value.toLowerCase())
  );
});


const openModal = async (exam: { id: number; name: string }) => {
  selectedExam.value = exam
  await nextTick()
  modalRef.value?.showModal()
}

const goToExam = (mode: 'review' | 'tutor' | 'exam') => {
  if (selectedExam.value) {
    router.push(`/nursing/exam/${selectedExam.value.id}?mode=${mode}`)
    modalRef.value?.close()
  }
}

onMounted(async () => {
  const response = await axios.get('/nursing/subjects');
  subjects.value = response.data.data;
  RandSubject1.value = response.data.data[Math.floor(Math.random() * response.data.data.length)]
  RandSubject2.value = response.data.data[Math.floor(Math.random() * response.data.data.length)]
  nursingStore.getEssentials();
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
    count: "67 sets",
    color: "text-sky-600",
  },
  {
    title: "LPN Test Bank",
    description: "Foundational LPN-focused question banks.",
    route: "/nursing/lpn-t-exams",
    icon: "pi pi-file",
    count: "7 sets",
    color: "text-indigo-600",
  },
  {
    title: "RN EXIT Exams",
    description: "Final-readiness RN exam practice sets.",
    route: "/nursing/exit-rn-exams",
    icon: "pi pi-graduation-cap",
    count: "567 sets",
    color: "text-emerald-600",
  },
  {
    title: "LPN EXIT Exams",
    description: "LPN graduation-focused exit exam prep.",
    route: "/nursing/exit-pn-exams",
    icon: "pi pi-graduation-cap",
    count: "7 sets",
    color: "text-orange-600",
  },
];

watch(universal_search, (newVal) => {
  if (newVal.length >= 1) {
    axios.get(`/nursing/search/subtopics?query=${newVal}`, { showLoader: false }).then(response => {
      examTopicsSearchResult.value = response.data.data;
      // You can handle the search results here, e.g., display them in the UI
    }).catch(error => {
      console.error('Error fetching search results:', error);
    });
  }
});

</script>

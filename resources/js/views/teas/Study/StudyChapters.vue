<template>
  <div
    class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-slate-50 dark:bg-sky-950 text-slate-800 dark:text-slate-100">
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div
        class="absolute -top-20 -left-40 h-[300px] w-[300px] lg:h-[620px] lg:w-[620px] bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-200 opacity-30 blur-[120px] rounded-full">
      </div>
      <div
        class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-200 opacity-30 blur-[100px] rounded-full">
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto">
      <section
        class="relative overflow-hidden rounded-[30px] border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-emerald-50 p-6 lg:p-8 shadow-[0_24px_72px_-36px_rgba(13,148,136,0.55)] dark:border-cyan-800 dark:from-slate-900 dark:via-sky-900 dark:to-emerald-950 dark:shadow-[0_24px_72px_-36px_rgba(6,182,212,0.65)]">
        <div
          class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_18%,rgba(14,165,233,0.20),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.18),transparent_45%)] dark:bg-[radial-gradient(circle_at_15%_18%,rgba(34,211,238,0.20),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(52,211,153,0.18),transparent_45%)]">
        </div>
        <div class="relative">
          <p
            class="inline-flex items-center rounded-full border border-cyan-200 bg-white/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:border-cyan-700 dark:bg-slate-900/70 dark:text-cyan-300">
            TEAS Chapter Guide
          </p>
          <h1 class="mt-4 text-2xl lg:text-4xl font-black text-slate-900 dark:text-white">
            {{ normalizeText(chapter_name_backend || 'TEAS Study Guide') }} Chapters
          </h1>
          <p class="mt-3 max-w-3xl text-sm lg:text-base text-slate-600 dark:text-slate-300">
            Read concise lessons, then test yourself instantly with topical quizzes built for TEAS confidence.
          </p>
          <div class="mt-5 flex flex-wrap gap-3">
            <span
              class="rounded-2xl border border-cyan-200 bg-white/85 px-4 py-2 text-sm font-semibold text-cyan-700 dark:border-cyan-700 dark:bg-slate-900/70 dark:text-cyan-200">
              {{ topicCount }} chapters available
            </span>
            <span
              class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
              Lesson + quiz workflow
            </span>
          </div>
        </div>
      </section>

      <div v-if="subChapters.length === 0"
        class="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500 shadow-sm dark:border-sky-800 dark:bg-slate-900/70 dark:text-slate-300">
        <p class="font-semibold">Searching chapters...</p>
      </div>

      <div v-else class="relative mt-8 w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 transition-all" :class="{ 'blur-sm': !active('teas') }">
          <article v-for="(sub, index) in subChapters" :key="sub.id"
            class="group relative overflow-hidden rounded-3xl border border-white/75 bg-white/90 p-5 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-32px_rgba(14,116,144,0.65)] dark:border-sky-800/70 dark:bg-slate-900/70 dark:hover:shadow-[0_26px_60px_-35px_rgba(6,182,212,0.75)]">
            <div :class="['absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100', accentGlowClass(index)]"></div>
            <div class="relative flex h-full flex-col">
              <div class="flex items-start justify-between gap-3">
                <span :class="['inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold', accentBadgeClass(index)]">
                  {{ index + 1 }}
                </span>
                <span
                  class="rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Chapter
                </span>
              </div>

              <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                {{ normalizeText(sub.name) }}
              </h3>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Read core concepts, then lock in retention with targeted questions.
              </p>

              <div class="mt-5 flex flex-wrap gap-2">
                <CommonButton v-if="active('teas')" :action="() => showModal(sub)" button-text="Read Lesson"
                  classes="bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-0 hover:from-sky-500 hover:to-cyan-400" />
                <CommonButton v-if="active('teas')" :action="() => goToExam(sub.id)" button-text="Take Quiz"
                  classes="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 hover:from-amber-400 hover:to-orange-400" />
              </div>
            </div>
          </article>
        </div>

        <div v-if="!active('teas')" class="absolute inset-0 flex items-center justify-center z-40 p-4">
          <div
            class="max-w-2xl rounded-3xl border border-white/40 bg-gradient-to-r from-blue-900 via-teal-700 to-emerald-600 p-6 text-white shadow-xl">
            <h2 class="text-xl font-semibold">Hi, {{ user.name.split(' ')[0] }}</h2>
            <p class="mt-2 text-sm text-white/90">
              Unlock premium TEAS chapter lessons and assessment quizzes for targeted prep.
            </p>
            <ul class="mt-3 list-disc list-inside text-sm text-white/90 space-y-1">
              <li>Focused TEAS chapter guides</li>
              <li>Assessment questions after each chapter</li>
              <li>Concise explanations built for quick revision</li>
            </ul>
            <div class="mt-4">
              <CommonButton :action="() => router.push(pricingRoute('teas'))" button-text="Subscribe to Unlock"
                icon2="pi pi-arrow-right" classes="bg-white text-slate-900 border-0 hover:bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog id="lesson" class="modal">
      <div class="modal-box w-11/12 max-w-5xl bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <div class="flex items-center gap-2 mb-4">
          <h3 class="text-lg font-bold">{{ normalizeText(selectedSub?.name) }}</h3>
          <button
            class="p-1 rounded-full size-8 bg-slate-200 dark:bg-slate-700 active:bg-rose-500 cursor-pointer flex items-center justify-center"
            :class="speaking ? 'bg-rose-500 animate-pulse text-white' : ''" @click="controlSpeech">
            <i :class="['pi', speaking ? 'pi-pause-circle text-lg' : 'pi-volume-up text-lg']"></i>
          </button>
        </div>

        <div class="max-h-[55vh] overflow-y-auto pr-1">
          <div class="flex flex-col gap-4 prose prose-sm max-w-none dark:prose-invert" v-html="selectedSub?.description"></div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <CommonButton button-text="Close" classes="bg-rose-500 border-0 text-white" :action="closeLessonModal" />
          </form>
          <CommonButton button-text="Take Exercise Questions" classes="bg-teal-500 border-0 text-white"
            :action="() => goToExam(selectedSub.id)" />
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import CommonButton from "../../../components/Buttons/CommonButton.vue";
import { useAuthStore } from "../../../stores/authStore";
import { normalizeText } from "../../../utils/normalizeText";
import speak from "../../../utils/speech";

const route = useRoute();
const router = useRouter();

const { active, user, pricingRoute } = useAuthStore();

const subChapters = ref([] as any[]);
const selectedSub = ref<any>(null);
const chapter_name_backend = ref("");
const topicId = computed(() => (route.params.topicId as string) || "");
const topicCount = computed(() => subChapters.value.length);

const speaking = ref(false);

const accentGlowClass = (index: number) => {
  const glows = [
    "bg-gradient-to-br from-sky-200/40 via-transparent to-transparent dark:from-sky-500/20",
    "bg-gradient-to-br from-emerald-200/35 via-transparent to-transparent dark:from-emerald-500/20",
    "bg-gradient-to-br from-indigo-200/35 via-transparent to-transparent dark:from-indigo-500/20",
  ];

  return glows[index % glows.length];
};

const accentBadgeClass = (index: number) => {
  const badges = [
    "bg-sky-100 text-sky-700 dark:bg-sky-900/70 dark:text-sky-200",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-200",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/70 dark:text-indigo-200",
  ];

  return badges[index % badges.length];
};

const controlSpeech = () => {
  if (!selectedSub.value) return;

  if (!speaking.value) {
    speaking.value = true;
    speak(selectedSub.value.name || "");

    setTimeout(() => {
      speak(selectedSub.value.description || "");
    }, (selectedSub.value.name?.length || 0) * 155);
  } else {
    speak.stop();
    speaking.value = false;
  }
};

const closeLessonModal = () => {
  speak.stop();
  speaking.value = false;
};

const fetchSubChapters = async () => {
  try {
    const response = await axios.get("/teas/study-chapters", {
      params: { slug: topicId.value },
    });
    subChapters.value = response.data.data.topics;
    chapter_name_backend.value = response.data.data.subject;
  } catch (error) {
    console.error("Failed to fetch sub-chapters:", error);
  }
};

onMounted(() => {
  fetchSubChapters();
});

watch(
  () => topicId.value,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      fetchSubChapters();
    }
  }
);

const showModal = (sub: any) => {
  selectedSub.value = sub;
  const modal: any = document.getElementById("lesson");
  if (modal) {
    modal.showModal();
  }
};

const goToExam = (id: number) => {
  router.push(`/teas/exam/${id}?mode=exam`);
};
</script>

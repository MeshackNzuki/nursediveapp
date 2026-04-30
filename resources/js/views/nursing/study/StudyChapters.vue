<template>
  <div
    class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-slate-50 dark:bg-sky-950 text-slate-800 dark:text-slate-100">
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div
        class="absolute -top-20 -left-40 h-[320px] w-[320px] lg:h-[620px] lg:w-[620px] bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-200 opacity-30 blur-[120px] rounded-full">
      </div>
      <div
        class="absolute top-32 right-10 h-[420px] w-[420px] bg-gradient-to-r from-indigo-200 via-sky-300 to-emerald-200 opacity-30 blur-[100px] rounded-full">
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto">
      <section
        class="relative overflow-hidden rounded-[30px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-cyan-50 p-6 lg:p-8 shadow-[0_24px_72px_-36px_rgba(14,116,144,0.55)] dark:border-sky-800 dark:from-slate-900 dark:via-sky-900 dark:to-cyan-950 dark:shadow-[0_24px_72px_-36px_rgba(2,132,199,0.65)]">
        <div
          class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_16%_18%,rgba(56,189,248,0.22),transparent_50%),radial-gradient(circle_at_88%_0%,rgba(34,197,94,0.16),transparent_42%)] dark:bg-[radial-gradient(circle_at_16%_18%,rgba(34,211,238,0.22),transparent_50%),radial-gradient(circle_at_88%_0%,rgba(52,211,153,0.14),transparent_42%)]">
        </div>
        <div class="relative">
          <p
            class="inline-flex items-center rounded-full border border-sky-200 bg-white/85 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-700 dark:bg-slate-900/70 dark:text-sky-300">
            Nursing Study Chapters
          </p>
          <h1 class="mt-4 text-2xl lg:text-4xl font-black text-slate-900 dark:text-white">
            {{ chapter_name || 'Nursing' }} Chapters
          </h1>
          <p class="mt-3 max-w-3xl text-sm lg:text-base text-slate-600 dark:text-slate-300">
            Study by topic, then jump straight into focused lesson pages to strengthen clinical reasoning faster.
          </p>
          <div class="mt-5 flex flex-wrap gap-3">
            <span
              class="rounded-2xl border border-sky-200 bg-white/85 px-4 py-2 text-sm font-semibold text-sky-700 dark:border-sky-700 dark:bg-slate-900/70 dark:text-sky-200">
              {{ subChapters.length }} chapter topics
            </span>
            <span :class="[
              'rounded-2xl px-4 py-2 text-sm font-semibold border',
              active('nursing')
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'
                : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200'
            ]">
              {{ active('nursing') ? 'Premium active' : 'Free mode' }}
            </span>
          </div>
        </div>
      </section>

      <dialog id="lockModal" class="modal" :open="showLock">
        <div class="modal-box text-center bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
          <i class="pi pi-lock text-rose-500 text-3xl mb-3"></i>
          <h3 class="font-bold text-lg mb-2">Locked Content</h3>
          <p class="text-slate-600 dark:text-slate-300 mb-4">Please subscribe to access Study Lessons.</p>
          <div class="modal-action flex justify-center gap-2">
            <button
              class="rounded-full px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold"
              @click="goToNursingPricing">
              View Nursing Plans
            </button>
            <form method="dialog">
              <button class="rounded-full px-4 py-2 bg-rose-500 text-white font-semibold" @click="showLock = false">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <div v-if="subChapters.length === 0"
        class="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500 shadow-sm dark:border-sky-800 dark:bg-slate-900/70 dark:text-slate-300">
        Loading chapters...
      </div>

      <div v-else class="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
        <article v-for="(sub, index) in subChapters" :key="sub.id"
          class="group relative overflow-hidden rounded-3xl border border-white/75 bg-white/90 p-5 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-32px_rgba(14,116,144,0.65)] dark:border-sky-800/70 dark:bg-slate-900/70 dark:hover:shadow-[0_26px_60px_-35px_rgba(6,182,212,0.75)] cursor-pointer"
          @click="goToLesson(sub.id)">
          <div :class="['absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100', accentGlowClass(index)]"></div>
          <div class="relative flex h-full flex-col">
            <div class="flex items-start justify-between gap-3">
              <span :class="['inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold', accentBadgeClass(index)]">
                {{ index + 1 }}
              </span>
              <span
                class="rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Lesson
              </span>
            </div>

            <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              {{ sub.name }}
            </h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Open this chapter lesson and continue your guided nursing study flow.
            </p>

            <div class="mt-5 flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Tap to open
              </span>
              <span
                class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-2 text-white shadow-sm">
                <i class="pi pi-arrow-right"></i>
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../../../stores/authStore";
import router from "../../../router";

const route = useRoute();
const chapter_id = ref(route.query.chapter_id as string | undefined);
const { active, pricingRoute } = useAuthStore();

const chapter_name = ref("");
const subChapters = ref([] as any[]);
const showLock = ref(false);

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

const fetchSubChapters = async () => {
  if (!chapter_id.value) return;
  try {
    const response = await axios.get(`/nursing/chapters/${chapter_id.value}`);
    chapter_name.value = response.data.data.chapter_name;
    subChapters.value = response.data.data.topics;
  } catch (error) {
    console.error("Failed to fetch sub-chapters:", error);
  }
};

onMounted(fetchSubChapters);

watch(
  () => route.query.chapter_id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      chapter_id.value = newId as string;
      fetchSubChapters();
    }
  }
);

const goToLesson = (id: number) => {
  router.push(`/nursing/lessons/${id}?chapter=${chapter_name.value}&&chapter_id=${chapter_id.value}`);
};

const goToNursingPricing = () => {
  showLock.value = false;
  router.push(pricingRoute("nursing"));
};
</script>

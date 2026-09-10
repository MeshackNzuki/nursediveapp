<template>
  <div class="dash-shell">
    <div class="mx-auto max-w-screen-2xl space-y-6">
      <ProductBreadcrumb product="nursing" :items="[{ label: 'Study lessons' }, { label: chapter_name || 'Chapter' }]" />

      <!-- ================= HEADER ================= -->
      <section class="ui-rise dash-card p-5 md:p-7">
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <div class="ui-drift absolute -top-28 -right-20 h-80 w-80 rounded-full blur-3xl theme-glow opacity-70"></div>
          <div class="absolute inset-0 opacity-[0.28] [background-image:radial-gradient(circle_at_1px_1px,var(--theme-border)_1px,transparent_0)] [background-size:24px_24px]"></div>
        </div>

        <div class="relative grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div class="min-w-0">
            <p class="dash-eyebrow theme-text inline-flex items-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="theme-dot absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"></span>
                <span class="theme-dot relative inline-flex h-2 w-2 rounded-full"></span>
              </span>
              Nursing study lessons
            </p>
            <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
              {{ chapter_name || "Nursing" }}
            </h1>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Study by topic, then open the lesson pages to strengthen clinical reasoning. Each topic ends with practice questions.
            </p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="analysis-pill theme-soft border">{{ subChapters.length }} topics</span>
              <span class="analysis-pill border" :class="active('nursing')
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200'">
                {{ active('nursing') ? 'Premium active' : 'Free preview' }}
              </span>
            </div>
          </div>

          <div class="dash-card-white">
            <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
              <span>Your progress</span>
              <span class="tabular-nums">{{ readCountValue }}/{{ subChapters.length }} opened</span>
            </div>
            <div class="dash-progress mt-2 h-2.5 bg-light-blue-500">
              <div class="relative h-full overflow-hidden rounded-full theme-bar transition-all duration-700" :style="{ width: `${progressPercent}%` }">
                <span v-if="progressPercent > 0" class="ui-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent"></span>
              </div>
            </div>
            <p class="mt-2 text-xs text-slate-600 dark:text-slate-300">{{ progressCopy }}</p>
            <button v-if="nextUnread" type="button" class="dash-btn theme-surface theme-shadow mt-3 w-full text-xs" @click="goToLesson(nextUnread.id)">
              <i class="pi pi-play text-[10px]"></i> {{ readCountValue ? "Continue" : "Start" }}: {{ nextUnread.name }}
            </button>
          </div>
        </div>
      </section>

      <!-- ================= CHAPTER SWITCHER ================= -->
      <section class="ui-rise" style="animation-delay: 80ms">
        <div class="flex items-center justify-between gap-3">
          <p class="dash-eyebrow theme-text">Switch chapter</p>
          <span class="text-[11px] text-slate-400">Scroll for more</span>
        </div>
        <div class="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
          <RouterLink v-for="ch in chapterCatalog" :key="ch.label" :to="ch.route"
            class="dash-chip shrink-0 whitespace-nowrap" :class="String(ch.id) === String(chapter_id) ? 'theme-surface border-transparent shadow-md' : ch.available ? 'theme-soft theme-focus' : 'border-slate-200 bg-slate-50 text-slate-400 pointer-events-none'"
            :aria-disabled="!ch.available">
            <i :class="ch.available ? 'pi pi-book' : 'pi pi-clock'" class="text-[10px]"></i>
            {{ ch.label }}
            <span v-if="!ch.available" class="text-[9px] uppercase">soon</span>
          </RouterLink>
        </div>
      </section>

      <!-- ================= TOPICS ================= -->
      <section>
        <div v-if="subChapters.length === 0" class="dash-card-white border-dashed p-10 text-center">
          <div class="dash-icon-tile theme-icon mx-auto h-12 w-12 rounded-2xl"><i :class="emptyMessage.startsWith('Loading') ? 'pi pi-spin pi-spinner' : 'pi pi-clock'"></i></div>
          <p class="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">{{ emptyMessage }}</p>
          <RouterLink v-if="!emptyMessage.startsWith('Loading')" to="/nursing/study-chapters?chapter_id=7" class="dash-btn theme-surface theme-shadow mt-4 text-xs">
            Open Fundamentals instead <i class="pi pi-arrow-right text-[10px]"></i>
          </RouterLink>
        </div>

        <template v-else>
          <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="dash-title">Topics</h2>
              <p class="analysis-muted">{{ filteredChapters.length }} of {{ subChapters.length }} shown</p>
            </div>
            <div class="relative sm:w-72">
              <i class="pi pi-search pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
              <input v-model="search" type="search" placeholder="Find a topic"
                class="theme-focus w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 focus:outline-none dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100" />
            </div>
          </div>

          <ol class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <li v-for="(sub, index) in filteredChapters" :key="sub.id">
              <button type="button" class="group dash-card-white dash-hover-lift ui-rise flex h-full w-full flex-col text-left"
                :style="{ animationDelay: `${120 + index * 40}ms` }" @click="goToLesson(sub.id)">
                <div class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 theme-glow group-hover:opacity-100" aria-hidden="true"></div>
                <div class="relative flex items-start justify-between gap-3">
                  <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow transition-transform group-hover:scale-110"
                    :class="isRead(sub.id) ? 'bg-emerald-500 text-white' : 'theme-surface'">
                    <i v-if="isRead(sub.id)" class="pi pi-check"></i>
                    <span v-else>{{ topicNumber(sub) }}</span>
                  </span>
                  <span v-if="isRead(sub.id)" class="analysis-pill border border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">Opened</span>
                  <span v-else-if="nextUnread && nextUnread.id === sub.id" class="analysis-pill theme-soft border text-[10px]">Up next</span>
                  <span v-else class="analysis-pill border border-slate-200 bg-white text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Lesson</span>
                </div>
                <h3 class="relative mt-4 text-base font-extrabold leading-snug text-slate-950 dark:text-white">{{ sub.name }}</h3>
                <p class="relative mt-1.5 text-sm text-slate-600 dark:text-slate-300">Lesson pages with practice questions at the end.</p>
                <div class="relative mt-auto flex items-center justify-between pt-4">
                  <span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">{{ active('nursing') ? 'Tap to open' : 'Preview' }}</span>
                  <span class="dash-btn theme-surface px-3 py-1.5 text-xs group-hover:translate-x-0.5">Open <i class="pi pi-arrow-right text-[10px]"></i></span>
                </div>
              </button>
            </li>
          </ol>
        </template>
      </section>

      <UpgradePrompt v-if="!active('nursing')" product="nursing" feature="lesson library" variant="inline" placement="nursing_study_chapters"
        :show-continue="false" class="ui-rise" style="animation-delay: 300ms" />
    </div>

    <dialog id="lockModal" class="modal" :open="showLock">
      <div class="modal-box max-w-2xl bg-transparent p-0 shadow-none">
        <UpgradePrompt product="nursing" feature="lesson pages" placement="nursing_lesson_lock" continue-label="Not now" @continue="showLock = false" />
      </div>
      <form method="dialog" class="modal-backdrop"><button aria-label="Close" @click="showLock = false">close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import ProductBreadcrumb from "../../../components/ProductBreadcrumb.vue";
import UpgradePrompt from "../../../components/UpgradePrompt.vue";
import { useAuthStore } from "../../../stores/authStore";
import { useStudyProgress } from "../../../utils/studyProgress";
import router from "../../../router";

const route = useRoute();
const chapter_id = ref(route.query.chapter_id as string | undefined);
const { active } = useAuthStore();
const { isRead, readCount } = useStudyProgress("nursing");

const chapter_name = ref("");
const subChapters = ref([] as any[]);
const showLock = ref(false);
const emptyMessage = ref("Loading chapters...");
const search = ref("");

/* Mirrors the chapter list on the nursing dashboard so learners can move between chapters here. */
const chapterCatalog = [
  { id: 7, label: "Fundamentals" },
  { id: 4, label: "Maternal & Newborn" },
  { id: 15, label: "Pediatric" },
  { id: 12, label: "Medical Surgical" },
  { id: 13, label: "Psychiatric" },
  { id: 8, label: "Pharmacology" },
  { id: 14, label: "Pathophysiology" },
  { id: null, label: "Adult Health" },
  { id: null, label: "Community Health" },
  { id: null, label: "Leadership" },
].map((c) => ({ ...c, available: c.id !== null, route: c.id !== null ? `/nursing/study-chapters?chapter_id=${c.id}` : "#" }));

const topicNumber = (sub: any) => subChapters.value.findIndex((s) => s.id === sub.id) + 1;
const filteredChapters = computed(() => {
  const q = search.value.trim().toLowerCase();
  return q ? subChapters.value.filter((s) => String(s.name).toLowerCase().includes(q)) : subChapters.value;
});
const readCountValue = computed(() => readCount(subChapters.value.map((s) => s.id)));
const progressPercent = computed(() => (subChapters.value.length ? Math.round((readCountValue.value / subChapters.value.length) * 100) : 0));
const nextUnread = computed(() => subChapters.value.find((s) => !isRead(s.id)) || null);
const progressCopy = computed(() => {
  if (!subChapters.value.length) return "";
  if (progressPercent.value === 100) return "Every topic opened. Revisit the ones you found hardest.";
  if (!readCountValue.value) return "Nothing opened yet. Start with the first topic.";
  return `${subChapters.value.length - readCountValue.value} topics to go.`;
});

const fetchSubChapters = async () => {
  if (!isValidChapterId(chapter_id.value)) {
    setUnavailableChapter();
    return;
  }
  emptyMessage.value = "Loading chapters...";
  try {
    const response = await axios.get(`/nursing/chapters/${chapter_id.value}`);
    chapter_name.value = response.data.data.chapter_name;
    subChapters.value = response.data.data.topics;
  } catch (error) {
    setUnavailableChapter();
    console.error("Failed to fetch sub-chapters:", error);
  }
};

onMounted(fetchSubChapters);

watch(
  () => route.query.chapter_id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      chapter_id.value = newId as string;
      subChapters.value = [];
      fetchSubChapters();
    }
  },
);

const isValidChapterId = (value: unknown) => typeof value === "string" && /^\d+$/.test(value) && Number(value) > 0;

const setUnavailableChapter = () => {
  chapter_name.value = "Nursing";
  subChapters.value = [];
  emptyMessage.value = "This study chapter is being prepared. Please check back later.";
};

const goToLesson = (id: number) => {
  router.push(`/nursing/lessons/${id}?chapter=${chapter_name.value}&&chapter_id=${chapter_id.value}`);
};
</script>

<template>
  <div class="dash-shell">
    <div class="mx-auto max-w-screen-2xl space-y-6">
      <ProductBreadcrumb product="teas" :items="[{ label: 'Study guides', to: '/teas/guide-topics' }, { label: subjectLabel }]" />

      <!-- ================= HEADER ================= -->
      <section class="ui-rise dash-card p-5 md:p-7">
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <div class="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-linear-to-br opacity-70 blur-3xl" :class="identity.washClass"></div>
          <div class="ui-pan absolute inset-0 opacity-[0.08]" :class="[identity.patternClass, identity.inkClass]"></div>
        </div>

        <div class="relative grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div class="flex min-w-0 items-start gap-4">
            <span class="dash-icon-tile h-14 w-14 shrink-0 text-2xl shadow-lg" :class="identity.tileClass"><i :class="identity.icon"></i></span>
            <div class="min-w-0">
              <p class="dash-eyebrow" :class="identity.inkClass">TEAS chapter guide</p>
              <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                {{ subjectLabel }}
              </h1>
              <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Short lessons in exam order. Read one, take its quiz, and the chapter gets a tick.
              </p>
            </div>
          </div>

          <!-- Progress -->
          <div class="dash-card-white">
            <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
              <span>Your progress</span>
              <span class="tabular-nums">{{ readCountValue }}/{{ subChapters.length }} read</span>
            </div>
            <div class="dash-progress mt-2 h-2.5 bg-light-blue-500">
              <div class="relative h-full overflow-hidden rounded-full transition-all duration-700" :class="identity.barClass" :style="{ width: `${progressPercent}%` }">
                <span v-if="progressPercent > 0" class="ui-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent"></span>
              </div>
            </div>
            <p class="mt-2 text-xs text-slate-600 dark:text-slate-300">{{ progressCopy }}</p>
            <button v-if="nextUnread && active('teas')" type="button" class="dash-btn theme-surface theme-shadow mt-3 w-full text-xs" @click="showModal(nextUnread)">
              <i class="pi pi-play text-[10px]"></i> {{ readCountValue ? "Continue" : "Start" }}: {{ normalizeText(nextUnread.name) }}
            </button>
          </div>
        </div>
      </section>

      <!-- ================= CHAPTERS ================= -->
      <section class="relative">
        <div v-if="subChapters.length === 0" class="dash-card-white border-dashed p-10 text-center">
          <div class="dash-icon-tile theme-icon mx-auto h-12 w-12 rounded-2xl"><i class="pi pi-spin pi-spinner"></i></div>
          <p class="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">Loading chapters</p>
        </div>

        <template v-else>
          <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="dash-title">Chapters</h2>
              <p class="analysis-muted">{{ filteredChapters.length }} of {{ subChapters.length }} shown</p>
            </div>
            <div class="relative sm:w-72">
              <i class="pi pi-search pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
              <input v-model="search" type="search" placeholder="Find a chapter"
                class="theme-focus w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 focus:outline-none dark:border-sky-800 dark:bg-sky-950 dark:text-slate-100" />
            </div>
          </div>

          <ol class="relative space-y-3 transition-all" :class="{ 'pointer-events-none select-none blur-sm': !active('teas') }">
            <li v-for="(sub, index) in filteredChapters" :key="sub.id"
              class="group dash-card-white dash-hover-lift ui-rise flex flex-col gap-4 sm:flex-row sm:items-center"
              :style="{ animationDelay: `${80 + index * 40}ms` }">
              <div class="flex items-center gap-3 sm:w-14 sm:shrink-0 sm:flex-col sm:items-start">
                <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow transition-transform group-hover:scale-110"
                  :class="isRead(sub.id) ? 'bg-emerald-500 text-white' : identity.tileClass">
                  <i v-if="isRead(sub.id)" class="pi pi-check"></i>
                  <span v-else>{{ chapterNumber(sub) }}</span>
                </span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-base font-extrabold text-slate-950 dark:text-white">{{ normalizeText(sub.name) }}</h3>
                  <span v-if="isRead(sub.id)" class="analysis-pill border border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">Read</span>
                  <span v-else-if="nextUnread && nextUnread.id === sub.id" class="analysis-pill theme-soft border text-[10px]">Up next</span>
                </div>
                <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ excerpt(sub.description) }}</p>
                <p class="mt-1.5 text-[11px] font-semibold text-slate-400"><i class="pi pi-clock mr-1 text-[10px]"></i>{{ readingTime(sub.description) }} read</p>
              </div>
              <div class="flex shrink-0 gap-2 sm:flex-col">
                <button type="button" class="dash-btn theme-surface flex-1 px-4 py-2 text-xs" @click="showModal(sub)">
                  <i class="pi pi-book text-[10px]"></i> {{ isRead(sub.id) ? "Read again" : "Read lesson" }}
                </button>
                <button type="button" class="dash-btn-ghost flex-1 px-4 py-2 text-xs" @click="goToExam(sub.id)">
                  <i class="pi pi-pencil text-[10px]"></i> Take quiz
                </button>
              </div>
            </li>
          </ol>

          <div v-if="!active('teas')" class="absolute inset-0 z-40 p-2">
            <UpgradePrompt product="teas" feature="chapter guides" placement="teas_study_chapters" class="sticky top-4 mx-auto w-full max-w-2xl"
              :benefits="[
                { icon: 'pi pi-book', text: `Every ${subjectLabel} chapter lesson` },
                { icon: 'pi pi-pencil', text: 'A quiz after each chapter' },
                { icon: 'pi pi-check-circle', text: 'Read progress and ticks saved' },
                { icon: 'pi pi-chart-line', text: 'Scores feed your analytics' },
              ]" continue-label="Browse the other guides" @continue="router.push('/teas/guide-topics')" />
          </div>
        </template>
      </section>
    </div>

    <!-- ================= READER ================= -->
    <dialog id="lesson" class="modal" @close="closeLessonModal">
      <div class="modal-box w-11/12 max-w-5xl overflow-hidden bg-white p-0 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <!-- toolbar -->
        <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 px-5 py-3 dark:border-slate-700">
          <span class="dash-icon-tile h-9 w-9 shrink-0 text-sm shadow" :class="identity.tileClass"><i :class="identity.icon"></i></span>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ subjectLabel }} · chapter {{ selectedSub ? chapterNumber(selectedSub) : "" }} of {{ subChapters.length }}</p>
            <h3 class="truncate text-base font-extrabold">{{ normalizeText(selectedSub?.name) }}</h3>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" class="dash-btn-ghost px-2.5 py-1.5 text-xs" :class="fontSize === 'sm' ? 'theme-soft' : ''" @click="fontSize = 'sm'" title="Smaller text">A-</button>
            <button type="button" class="dash-btn-ghost px-2.5 py-1.5 text-xs" :class="fontSize === 'lg' ? 'theme-soft' : ''" @click="fontSize = fontSize === 'lg' ? 'md' : 'lg'" title="Larger text">A+</button>
            <button type="button" class="dash-btn-ghost px-2.5 py-1.5 text-xs" :class="speaking ? 'border-rose-300 bg-rose-50 text-rose-700' : ''" @click="controlSpeech" :title="speaking ? 'Stop reading aloud' : 'Read aloud'">
              <i :class="['pi', speaking ? 'pi-pause-circle animate-pulse' : 'pi-volume-up']"></i>
            </button>
            <form method="dialog">
              <button class="dash-btn-ghost px-2.5 py-1.5 text-xs" aria-label="Close" @click="closeLessonModal"><i class="pi pi-times"></i></button>
            </form>
          </div>
        </div>

        <!-- reading progress -->
        <div class="h-1 w-full bg-slate-100 dark:bg-slate-800">
          <div class="h-full theme-bar transition-[width] duration-150" :style="{ width: `${readerProgress}%` }"></div>
        </div>

        <div ref="readerEl" class="max-h-[62vh] overflow-y-auto px-5 py-5 sm:px-8" @scroll="onReaderScroll">
          <div class="study-reader mx-auto max-w-3xl" :class="fontSize === 'lg' ? 'study-reader--lg' : fontSize === 'sm' ? 'study-reader--sm' : ''" v-html="selectedSub?.description"></div>
        </div>

        <!-- footer -->
        <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-5 py-3 dark:border-slate-700">
          <div class="flex gap-2">
            <button type="button" class="dash-btn-ghost px-3 py-1.5 text-xs" :disabled="!prevChapter" @click="prevChapter && showModal(prevChapter)">
              <i class="pi pi-arrow-left text-[10px]"></i> Previous
            </button>
            <button type="button" class="dash-btn-ghost px-3 py-1.5 text-xs" :disabled="!nextChapter" @click="nextChapter && showModal(nextChapter)">
              Next <i class="pi pi-arrow-right text-[10px]"></i>
            </button>
          </div>
          <div class="flex gap-2">
            <button type="button" class="dash-btn-ghost px-3 py-1.5 text-xs" :class="selectedSub && isRead(selectedSub.id) ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''" @click="selectedSub && markRead(selectedSub.id)">
              <i class="pi pi-check text-[10px]"></i> {{ selectedSub && isRead(selectedSub.id) ? "Marked read" : "Mark as read" }}
            </button>
            <button type="button" class="dash-btn theme-surface theme-shadow px-4 py-1.5 text-xs" @click="selectedSub && goToExam(selectedSub.id)">
              <i class="pi pi-pencil text-[10px]"></i> Take the quiz
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button aria-label="Close">close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import ProductBreadcrumb from "../../../components/ProductBreadcrumb.vue";
import UpgradePrompt from "../../../components/UpgradePrompt.vue";
import { useAuthStore } from "../../../stores/authStore";
import { normalizeText } from "../../../utils/normalizeText";
import { useStudyProgress } from "../../../utils/studyProgress";
import speak from "../../../utils/speech";

const route = useRoute();
const router = useRouter();
const { active } = useAuthStore();
const { isRead, markRead, readCount } = useStudyProgress("teas");

const subChapters = ref([] as any[]);
const selectedSub = ref<any>(null);
const chapter_name_backend = ref("");
const topicId = computed(() => (route.params.topicId as string) || "");
const search = ref("");
const fontSize = ref<"sm" | "md" | "lg">("md");
const readerEl = ref<HTMLElement | null>(null);
const readerProgress = ref(0);
const speaking = ref(false);

const IDENTITY: Record<string, any> = {
  math_guide: { icon: "pi pi-calculator", tileClass: "bg-linear-to-br from-sky-500 to-cyan-400 text-white shadow-sky-500/30", washClass: "from-sky-400/45 to-cyan-300/25 dark:from-sky-500/30 dark:to-cyan-400/15", patternClass: "pattern-grid", inkClass: "text-sky-600 dark:text-sky-300", barClass: "bg-linear-to-r from-sky-500 to-cyan-400" },
  english_guide: { icon: "pi pi-language", tileClass: "bg-linear-to-br from-indigo-500 to-sky-400 text-white shadow-indigo-500/30", washClass: "from-indigo-400/45 to-sky-300/25 dark:from-indigo-500/30 dark:to-sky-400/15", patternClass: "pattern-lines", inkClass: "text-indigo-600 dark:text-indigo-300", barClass: "bg-linear-to-r from-indigo-500 to-sky-400" },
  science_guide: { icon: "pi pi-sliders-h", tileClass: "bg-linear-to-br from-emerald-500 to-teal-400 text-white shadow-emerald-500/30", washClass: "from-emerald-400/45 to-teal-300/25 dark:from-emerald-500/30 dark:to-teal-400/15", patternClass: "pattern-dots", inkClass: "text-emerald-600 dark:text-emerald-300", barClass: "bg-linear-to-r from-emerald-500 to-teal-400" },
  reading_guide: { icon: "pi pi-book", tileClass: "bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-orange-500/30", washClass: "from-orange-400/45 to-amber-300/25 dark:from-orange-500/30 dark:to-amber-400/15", patternClass: "pattern-diagonal", inkClass: "text-orange-600 dark:text-orange-300", barClass: "bg-linear-to-r from-orange-500 to-amber-400" },
};
const identity = computed(() => IDENTITY[topicId.value] || IDENTITY.math_guide);
const subjectLabel = computed(() => normalizeText(chapter_name_backend.value || "TEAS Study Guide"));

const chapterNumber = (sub: any) => subChapters.value.findIndex((s) => s.id === sub.id) + 1;
const filteredChapters = computed(() => {
  const q = search.value.trim().toLowerCase();
  return q ? subChapters.value.filter((s) => normalizeText(s.name).toLowerCase().includes(q)) : subChapters.value;
});
const readCountValue = computed(() => readCount(subChapters.value.map((s) => s.id)));
const progressPercent = computed(() => (subChapters.value.length ? Math.round((readCountValue.value / subChapters.value.length) * 100) : 0));
const nextUnread = computed(() => subChapters.value.find((s) => !isRead(s.id)) || null);
const progressCopy = computed(() => {
  if (!subChapters.value.length) return "";
  if (progressPercent.value === 100) return "Every chapter read. Retake the quizzes to lock it in.";
  if (!readCountValue.value) return "Nothing read yet. The first chapter takes a few minutes.";
  return `${subChapters.value.length - readCountValue.value} chapters to go.`;
});

const stripHtml = (html: string) => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const excerpt = (html: string) => {
  const text = stripHtml(html);
  return text.length > 140 ? text.slice(0, 137) + "..." : text || "Read core concepts, then lock in retention with targeted questions.";
};
const readingTime = (html: string) => `${Math.max(1, Math.round(stripHtml(html).split(/\s+/).length / 200))} min`;

const currentIndex = computed(() => (selectedSub.value ? subChapters.value.findIndex((s) => s.id === selectedSub.value.id) : -1));
const prevChapter = computed(() => (currentIndex.value > 0 ? subChapters.value[currentIndex.value - 1] : null));
const nextChapter = computed(() => (currentIndex.value >= 0 && currentIndex.value < subChapters.value.length - 1 ? subChapters.value[currentIndex.value + 1] : null));

const onReaderScroll = () => {
  const el = readerEl.value;
  if (!el) return;
  const max = el.scrollHeight - el.clientHeight;
  readerProgress.value = max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 100;
  if (readerProgress.value >= 90 && selectedSub.value) markRead(selectedSub.value.id);
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
    const response = await axios.get("/teas/study-chapters", { params: { slug: topicId.value } });
    subChapters.value = response.data.data.topics;
    chapter_name_backend.value = response.data.data.subject;
  } catch (error) {
    console.error("Failed to fetch sub-chapters:", error);
  }
};

onMounted(fetchSubChapters);
watch(() => topicId.value, (newId, oldId) => { if (newId && newId !== oldId) fetchSubChapters(); });

const showModal = async (sub: any) => {
  speak.stop();
  speaking.value = false;
  selectedSub.value = sub;
  readerProgress.value = 0;
  await nextTick();
  if (readerEl.value) readerEl.value.scrollTop = 0;
  const modal: any = document.getElementById("lesson");
  if (modal && !modal.open) modal.showModal();
  // short lessons have no scroll; count opening them as read
  nextTick(() => {
    const el = readerEl.value;
    if (el && el.scrollHeight <= el.clientHeight + 4) { readerProgress.value = 100; markRead(sub.id); }
  });
};

const goToExam = (id: number) => {
  closeLessonModal();
  router.push(`/teas/exam/${id}?mode=exam`);
};
</script>

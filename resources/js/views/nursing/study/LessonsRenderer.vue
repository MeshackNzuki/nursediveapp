<template>
    <div class="dash-shell">
        <div class="mx-auto max-w-screen-2xl space-y-5">
            <ProductBreadcrumb product="nursing" :items="crumbs" :show-actions="false" />

            <div class="grid grid-cols-1 gap-5 xl:grid-cols-12 xl:items-start">
                <!-- ================= READER ================= -->
                <article class="ui-rise dash-card-white overflow-hidden p-0 xl:col-span-8 2xl:col-span-9">
                    <!-- toolbar -->
                    <div class="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-sky-900">
                        <span class="dash-icon-tile theme-icon hidden h-10 w-10 shrink-0 sm:inline-flex"><i class="pi pi-book"></i></span>
                        <div class="min-w-0 basis-full sm:flex-1 sm:basis-auto">
                            <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                {{ parent_subtopic_data?.name || "Lesson" }} · lesson {{ currentIndex + 1 }} of {{ chapterLessons.length }}
                            </p>
                            <h1 class="text-lg font-extrabold leading-snug tracking-tight text-slate-950 dark:text-white sm:truncate">
                                {{ currentLesson?.title || "Loading lesson..." }}
                            </h1>
                        </div>
                        <div class="flex basis-full items-center justify-end gap-1 sm:basis-auto">
                            <button type="button" class="dash-btn-ghost px-2.5 py-1.5 text-xs" :class="fontSize === 'sm' ? 'theme-soft' : ''" @click="fontSize = fontSize === 'sm' ? 'md' : 'sm'" title="Smaller text">A-</button>
                            <button type="button" class="dash-btn-ghost px-2.5 py-1.5 text-xs" :class="fontSize === 'lg' ? 'theme-soft' : ''" @click="fontSize = fontSize === 'lg' ? 'md' : 'lg'" title="Larger text">A+</button>
                            <button type="button" class="dash-btn-ghost px-2.5 py-1.5 text-xs" :class="speaking ? 'border-rose-300 bg-rose-50 text-rose-700' : ''" @click="controlSpeech" :title="speaking ? 'Stop reading aloud' : 'Read aloud'">
                                <i :class="['pi', speaking ? 'pi-pause-circle animate-pulse' : 'pi-volume-up']"></i>
                            </button>
                            <button type="button" class="dash-btn-ghost px-2.5 py-1.5 text-xs xl:hidden" @click="listOpen = !listOpen" title="Lesson list">
                                <i class="pi pi-list"></i>
                            </button>
                        </div>
                    </div>

                    <!-- mobile lesson list -->
                    <div v-if="listOpen" class="border-b border-slate-100 bg-light-blue-500 px-4 py-3 xl:hidden dark:border-sky-900 dark:bg-sky-950/60">
                        <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Lessons in this topic</p>
                        <ol class="mt-2 space-y-1">
                            <li v-for="(lesson, i) in chapterLessons" :key="lesson.id">
                                <button type="button" class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition"
                                    :class="currentLesson?.id === lesson.id ? 'theme-surface' : 'text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-sky-900'"
                                    @click="selectLesson(lesson); listOpen = false">
                                    <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black" :class="currentLesson?.id === lesson.id ? 'bg-white/20' : isLessonRead(lesson) ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200'">
                                        <i v-if="currentLesson?.id !== lesson.id && isLessonRead(lesson)" class="pi pi-check text-[8px]"></i><span v-else>{{ i + 1 }}</span>
                                    </span>
                                    <span class="truncate">{{ lesson.title }}</span>
                                </button>
                            </li>
                        </ol>
                    </div>

                    <!-- reading progress -->
                    <div class="h-1 w-full bg-slate-100 dark:bg-slate-800">
                        <div class="h-full theme-bar transition-[width] duration-150" :style="{ width: `${readerProgress}%` }"></div>
                    </div>

                    <div ref="readerEl" class="max-h-[68vh] overflow-y-auto px-5 py-6 sm:px-8" @scroll="onReaderScroll">
                        <div v-if="currentLesson" class="study-reader mx-auto max-w-3xl" :class="fontSize === 'lg' ? 'study-reader--lg' : fontSize === 'sm' ? 'study-reader--sm' : ''" v-html="currentLesson.body"></div>
                        <div v-else class="flex flex-col items-center justify-center py-16 text-center">
                            <div class="dash-icon-tile theme-icon h-12 w-12 rounded-2xl"><i class="pi pi-spin pi-spinner"></i></div>
                            <p class="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">Loading lesson</p>
                        </div>
                    </div>

                    <!-- footer nav -->
                    <div v-if="currentLesson" class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 dark:border-sky-900">
                        <div class="flex gap-2">
                            <button type="button" class="dash-btn-ghost px-3 py-1.5 text-xs" :disabled="currentIndex <= 0" @click="previousLesson">
                                <i class="pi pi-arrow-left text-[10px]"></i> Previous
                            </button>
                            <button v-if="!is_last_lesson" type="button" class="dash-btn-ghost px-3 py-1.5 text-xs" @click="nextLesson">
                                Next <i class="pi pi-arrow-right text-[10px]"></i>
                            </button>
                            <button v-else type="button" class="dash-btn-ghost px-3 py-1.5 text-xs" @click="router.push(`/nursing/study-chapters?chapter_id=${route.query.chapter_id}`)">
                                <i class="pi pi-book text-[10px]"></i> Back to topics
                            </button>
                        </div>
                        <div class="flex gap-2">
                            <button type="button" class="dash-btn-ghost px-3 py-1.5 text-xs" :class="isLessonRead(currentLesson) ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''" @click="markLessonRead(currentLesson)">
                                <i class="pi pi-check text-[10px]"></i> {{ isLessonRead(currentLesson) ? "Marked read" : "Mark as read" }}
                            </button>
                            <button v-if="currentLesson?.questions_count > 0" type="button" class="dash-btn theme-surface theme-shadow px-4 py-1.5 text-xs"
                                @click="router.push(`/nursing/exam/${currentLesson.sub_topic_id}?mode=exam`)">
                                <i class="pi pi-pencil text-[10px]"></i> Quiz on this lesson
                                <span class="rounded-full bg-white/20 px-1.5 text-[10px] tabular-nums">{{ currentLesson.questions_count }}</span>
                            </button>
                        </div>
                    </div>
                </article>

                <!-- ================= LESSON LIST (desktop) ================= -->
                <aside class="ui-rise hidden xl:col-span-4 xl:block 2xl:col-span-3" style="animation-delay: 80ms">
                    <div class="dash-card sticky top-0">
                        <div class="flex items-center justify-between gap-3">
                            <div>
                                <p class="dash-eyebrow theme-text">This topic</p>
                                <h2 class="dash-title text-base">{{ parent_subtopic_data?.name || "Lessons" }}</h2>
                            </div>
                            <span class="analysis-pill theme-soft border tabular-nums">{{ readLessonCount }}/{{ chapterLessons.length }}</span>
                        </div>
                        <div class="dash-progress mt-3 h-1.5 bg-white">
                            <div class="h-full rounded-full theme-bar transition-all duration-700" :style="{ width: `${chapterLessons.length ? Math.round((readLessonCount / chapterLessons.length) * 100) : 0}%` }"></div>
                        </div>

                        <ol class="mt-4 max-h-[60vh] space-y-1.5 overflow-y-auto pr-1">
                            <li v-for="(lesson, i) in chapterLessons" :key="lesson.id">
                                <button type="button" class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition"
                                    :class="currentLesson?.id === lesson.id ? 'theme-surface shadow-md' : 'dash-tile text-slate-700 hover:-translate-y-0.5 hover:shadow-md dark:text-slate-200'"
                                    @click="selectLesson(lesson)">
                                    <span class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black"
                                        :class="currentLesson?.id === lesson.id ? 'bg-white/20' : isLessonRead(lesson) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'">
                                        <i v-if="currentLesson?.id !== lesson.id && isLessonRead(lesson)" class="pi pi-check text-[9px]"></i><span v-else>{{ i + 1 }}</span>
                                    </span>
                                    <span class="min-w-0 flex-1 truncate">{{ lesson.title }}</span>
                                    <span v-if="lesson.questions_count > 0" class="shrink-0 text-[10px] font-bold opacity-70"><i class="pi pi-pencil mr-0.5"></i>{{ lesson.questions_count }}</span>
                                </button>
                            </li>
                        </ol>

                        <RouterLink v-if="whole_topic_questions?.id" :to="`/nursing/exam/${whole_topic_questions.id}?mode=exam`" class="dash-btn-ghost mt-4 w-full text-xs">
                            <i class="pi pi-list"></i> Practice the whole topic
                        </RouterLink>
                        <RouterLink :to="`/nursing/study-chapters?chapter_id=${route.query.chapter_id}`" class="mt-2 block text-center text-xs font-bold theme-text hover:underline">
                            <i class="pi pi-arrow-left mr-1 text-[10px]"></i> All topics in {{ route.query.chapter || "this chapter" }}
                        </RouterLink>
                    </div>
                </aside>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import ProductBreadcrumb from "../../../components/ProductBreadcrumb.vue";
import speak from "../../../utils/speech";
import { useStudyProgress } from "../../../utils/studyProgress";

const route = useRoute();
const router = useRouter();
const { isRead, markRead } = useStudyProgress("nursing");

const currentLesson = ref<any>(null);
const chapterLessons = ref<any[]>([]);
const parent_subtopic_data = ref<any>(null);
const whole_topic_questions = ref<any>(null);
const speaking = ref(false);
const listOpen = ref(false);
const fontSize = ref<"sm" | "md" | "lg">("md");
const readerEl = ref<HTMLElement | null>(null);
const readerProgress = ref(0);

const crumbs = computed(() => [
    { label: "Study lessons", to: `/nursing/study-chapters?chapter_id=${route.query.chapter_id || 7}` },
    { label: String(route.query.chapter || "Chapter"), to: `/nursing/study-chapters?chapter_id=${route.query.chapter_id || 7}` },
    { label: parent_subtopic_data.value?.name || "Lesson" },
]);

const lessonKey = (lesson: any) => `lesson-${lesson?.id}`;
const isLessonRead = (lesson: any) => !!lesson && isRead(lessonKey(lesson));
const markLessonRead = (lesson: any) => { if (lesson) markRead(lessonKey(lesson)); };
const readLessonCount = computed(() => chapterLessons.value.filter((l) => isLessonRead(l)).length);

const currentIndex = computed(() => (currentLesson.value ? chapterLessons.value.findIndex((l) => l.id === currentLesson.value.id) : -1));
const is_last_lesson = computed(() => currentIndex.value >= 0 && currentIndex.value === chapterLessons.value.length - 1);

const controlSpeech = () => {
    if (!currentLesson.value) return;
    if (!speaking.value) {
        speaking.value = true;
        speak(`${currentLesson.value.title}.`);
        setTimeout(() => {
            speak(currentLesson.value.body);
        }, currentLesson.value.title.length * 155);
    } else {
        speaking.value = false;
        speak.stop();
    }
};

const stopSpeech = () => {
    speak.stop();
    speaking.value = false;
};

const onReaderScroll = () => {
    const el = readerEl.value;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    readerProgress.value = max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 100;
    if (readerProgress.value >= 90) markLessonRead(currentLesson.value);
};

const selectLesson = async (lesson: any) => {
    stopSpeech();
    currentLesson.value = lesson;
    readerProgress.value = 0;
    await nextTick();
    if (readerEl.value) readerEl.value.scrollTop = 0;
    nextTick(() => {
        const el = readerEl.value;
        if (el && el.scrollHeight <= el.clientHeight + 4) { readerProgress.value = 100; markLessonRead(lesson); }
    });
};

const nextLesson = () => {
    if (currentIndex.value < chapterLessons.value.length - 1) selectLesson(chapterLessons.value[currentIndex.value + 1]);
};
const previousLesson = () => {
    if (currentIndex.value > 0) selectLesson(chapterLessons.value[currentIndex.value - 1]);
};

watch(() => route.fullPath, stopSpeech);

onMounted(async () => {
    // opening a topic counts it as opened on the chapters page
    if (route.params.chapter_id) markRead(String(route.params.chapter_id));
    try {
        const response = await axios.get(`/nursing/lessons/${route.params.chapter_id}`);
        const data = response.data.data;

        whole_topic_questions.value = data.subtopics.find((i: any) => i.name == "More questions") || null;
        chapterLessons.value = data.subtopics
            .filter((subTopic: any) => subTopic.lesson)
            .map((subTopic: any) => ({ ...subTopic.lesson, questions_count: subTopic.questions_count }));

        parent_subtopic_data.value = data.parent_subtopic;

        if (chapterLessons.value.length > 0) selectLesson(chapterLessons.value[0]);
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
    }
});
</script>

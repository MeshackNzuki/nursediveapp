<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-slate-50 dark:bg-sky-950 text-slate-800 dark:text-slate-100">
        <!-- Background Gradient -->
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[300px] w-[300px] lg:h-[600px] lg:w-[600px] bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-200 opacity-30 blur-[120px] rounded-full" />
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-indigo-200 opacity-30 blur-[100px] rounded-full" />
        </div>

        <div class="max-w-screen-2xl mx-auto">
            <section
                class="relative overflow-hidden rounded-[30px] border border-sky-100/90 bg-gradient-to-br from-white via-sky-50 to-cyan-50 p-6 lg:p-8 shadow-[0_20px_60px_-30px_rgba(14,116,144,0.45)] dark:border-sky-800/80 dark:from-sky-900 dark:via-slate-900 dark:to-sky-950 dark:shadow-[0_24px_72px_-36px_rgba(2,132,199,0.6)]">
                <div
                    class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_52%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.2),transparent_42%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.28),transparent_52%),radial-gradient(circle_at_85%_0%,rgba(45,212,191,0.22),transparent_42%)]">
                </div>
                <div class="relative">
                    <p
                        class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-1 text-[11px] font-semibold tracking-[0.18em] text-sky-700 uppercase dark:border-sky-700 dark:bg-slate-900/70 dark:text-sky-300">
                        NCLEX Study Topics
                    </p>
                    <h1 class="mt-4 text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                        {{ chapterName }} Mastery Path
                    </h1>
                    <p class="mt-3 max-w-3xl text-sm lg:text-base text-slate-600 dark:text-slate-300">
                        Build momentum with focused topic sprints. Choose a topic below and move through your chapter
                        with a premium guided flow.
                    </p>

                    <div class="mt-6 flex flex-wrap gap-3">
                        <div
                            class="rounded-2xl border border-sky-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-700 dark:border-sky-700/70 dark:bg-slate-900/70 dark:text-sky-200">
                            {{ topicCount }} topics ready
                        </div>
                        <div
                            class="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-700/70 dark:bg-emerald-950/50 dark:text-emerald-200">
                            Smart sequence enabled
                        </div>
                        <div
                            class="rounded-2xl border border-indigo-200/80 bg-indigo-50/80 px-4 py-2 text-sm font-semibold text-indigo-700 dark:border-indigo-700/70 dark:bg-indigo-950/50 dark:text-indigo-200">
                            Spotlight: {{ spotlightTopic }}
                        </div>
                    </div>
                </div>
            </section>

            <!-- Empty State -->
            <div v-if="subChapters.length === 0"
                class="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500 shadow-sm dark:border-sky-800 dark:bg-sky-900/40 dark:text-slate-300">
                No sub-chapters available for this topic.
            </div>

            <!-- Sub Chapters List -->
            <div v-else class="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <article v-for="(sub, index) in subChapters" :key="sub.id"
                    class="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.55)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(14,116,144,0.65)] dark:border-sky-800/80 dark:bg-slate-900/70 dark:hover:shadow-[0_24px_60px_-36px_rgba(2,132,199,0.8)]">
                    <div :class="[
                        'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                        accentGlowClass(index)
                    ]"></div>
                    <div class="relative">
                        <div class="flex items-start justify-between gap-3">
                            <span :class="[
                                'inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold',
                                accentBadgeClass(index)
                            ]">
                                {{ index + 1 }}
                            </span>
                            <span
                                class="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-300">
                                Study Topic
                            </span>
                        </div>

                        <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                            {{ sub.name }}
                        </h3>
                        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Focused rationale review, high-yield concepts, and targeted practice.
                        </p>

                        <div class="mt-5">
                            <CommonButton :action="() => $router.push(`/nursing/sub-chapter/${sub.id}`)"
                                button-text="Open Topic" icon2="pi pi-arrow-right"
                                classes="w-full bg-gradient-to-r from-sky-600 to-cyan-500 text-white hover:from-sky-500 hover:to-cyan-400 border-0 dark:from-sky-500 dark:to-teal-400 dark:text-slate-950 dark:hover:from-sky-400 dark:hover:to-teal-300" />
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import CommonButton from "../../../components/Buttons/CommonButton.vue";

const route = useRoute();
const topicId = route.params.id; // get main topic ID from URL

const chapterName = ref("");
const subChapters = ref([] as any[]);

const topicCount = computed(() => subChapters.value.length);
const spotlightTopic = computed(() => subChapters.value[0]?.name ?? "Your first topic");

const accentGlowClass = (index: number) => {
    const glows = [
        "bg-gradient-to-br from-sky-200/45 via-transparent to-transparent dark:from-sky-500/25",
        "bg-gradient-to-br from-emerald-200/40 via-transparent to-transparent dark:from-emerald-500/25",
        "bg-gradient-to-br from-indigo-200/40 via-transparent to-transparent dark:from-indigo-500/25",
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
    try {
        const response = await axios.get(`/nursing/topics/${topicId}/sub-chapters`);
        chapterName.value = response.data.topic_name;
        subChapters.value = response.data.sub_chapters;
    } catch (error) {
        console.error("Failed to fetch sub-chapters:", error);
    }
};

onMounted(fetchSubChapters);
</script>

<template>
    <div
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-white-500 p-4 text-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh]">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
                <article class="rounded-2xl p-5 xl:col-span-8">
                    <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-200">
                        NCLEX Review
                    </p>
                    <h1 class="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                        {{ chapterName || "Review Topic Path" }}
                    </h1>
                    <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Topic-level lesson content is being prepared. Use these prompts to move into focused NCLEX
                        practice and report review.
                    </p>

                    <div class="mt-5 flex flex-wrap gap-2">
                        <RouterLink to="/nclex/linear"
                            class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                            <i class="pi pi-book"></i>
                            Linear Practice
                        </RouterLink>
                        <RouterLink to="/nclex/readiness"
                            class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                            <i class="pi pi-bullseye"></i>
                            Readiness
                        </RouterLink>
                    </div>
                </article>

                <aside class="xl:col-span-4">
                    <div class="flex h-full items-center justify-between gap-4 rounded-2xl border-b bg-sky-800 p-5 shadow-custom">
                        <div>
                            <span
                                class="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-bright-sun-500 ring-1 ring-white/20">
                                Topic prompts
                            </span>
                            <p class="mt-3 text-lg font-extrabold leading-tight text-white">
                                {{ topicCount }} topic {{ topicCount === 1 ? "prompt" : "prompts" }} ready
                            </p>
                        </div>
                        <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/95 text-sky-700">
                            <i class="pi pi-list text-xl"></i>
                        </span>
                    </div>
                </aside>
            </section>

            <section
                class="rounded-2xl border border-slate-200 bg-light-blue-500 p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
                <div v-if="isLoading"
                    class="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-sky-800 dark:bg-sky-950/60 dark:text-slate-300">
                    Loading review topics...
                </div>

                <div v-else-if="subChapters.length === 0"
                    class="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-sky-800 dark:bg-sky-950/60">
                    <h2 class="font-semibold text-slate-950 dark:text-white">Topic lessons are coming soon.</h2>
                    <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-300">
                        Start with linear practice or readiness checks, then use performance analysis to decide what to
                        revisit.
                    </p>
                    <div class="mt-5 flex flex-wrap justify-center gap-2">
                        <RouterLink to="/nclex/linear"
                            class="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-600">
                            <i class="pi pi-play"></i>
                            Start Linear
                        </RouterLink>
                        <RouterLink to="/nclex/performance-analysis"
                            class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-sky-800 dark:text-slate-100 dark:hover:bg-sky-900">
                            <i class="pi pi-chart-line"></i>
                            View Analysis
                        </RouterLink>
                    </div>
                </div>

                <div v-else class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <article v-for="(sub, index) in subChapters" :key="sub.id"
                        class="group flex h-full flex-col rounded-xl border border-sky-100 bg-white p-4 shadow-custom transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50 dark:border-sky-800 dark:bg-sky-950/50 dark:hover:bg-sky-950">
                        <span
                            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sm font-bold text-sky-700 ring-1 ring-sky-100 dark:bg-sky-900/70 dark:text-sky-200 dark:ring-sky-800">
                            {{ index + 1 }}
                        </span>
                        <h3 class="mt-4 font-bold leading-tight text-slate-950 dark:text-white">{{ sub.name }}</h3>
                        <p class="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                            Use this prompt to choose a focused NCLEX set and review rationales afterward.
                        </p>
                        <button type="button" @click="openPractice"
                            class="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-600">
                            Practice
                            <i class="pi pi-arrow-right text-[10px]"></i>
                        </button>
                    </article>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const topicId = route.params.id;
const chapterName = ref("Review Topic Path");
const subChapters = ref([] as any[]);
const isLoading = ref(false);

const reviewPrompts = [
    { id: "management-care", name: "Management of Care" },
    { id: "safety-infection-control", name: "Safety and Infection Control" },
    { id: "basic-care-comfort", name: "Basic Care and Comfort" },
    { id: "pharmacology", name: "Pharmacological Therapies" },
    { id: "physiological-adaptation", name: "Physiological Adaptation" },
];

const topicCount = computed(() => subChapters.value.length);

const fetchSubChapters = async () => {
    isLoading.value = true;
    window.setTimeout(() => {
        chapterName.value = topicId ? "Review Topic Path" : "Review Topic Path";
        subChapters.value = reviewPrompts;
        isLoading.value = false;
    }, 0);
};

onMounted(fetchSubChapters);

function openPractice() {
    router.push("/nclex/linear");
}
</script>

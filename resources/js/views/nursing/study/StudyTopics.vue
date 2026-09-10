<template>
    <div class="dash-shell">
        <div class="mx-auto max-w-screen-2xl space-y-6">
            <ProductBreadcrumb product="nursing" :items="[{ label: 'Study lessons', to: '/nursing/study-chapters?chapter_id=7' }, { label: chapterName || 'Topics' }]" />

            <section class="ui-rise dash-card-white border-dashed p-10 text-center">
                <div class="dash-icon-tile theme-icon mx-auto h-14 w-14 rounded-2xl text-xl"><i class="pi pi-clock"></i></div>
                <h1 class="mt-4 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                    {{ chapterName ? `${chapterName} topics are being prepared` : "This content is being prepared" }}
                </h1>
                <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                    We're still writing these lessons. In the meantime the chapters below are ready to study.
                </p>
                <div class="mt-5 flex flex-wrap justify-center gap-2">
                    <RouterLink v-for="ch in ready" :key="ch.id" :to="`/nursing/study-chapters?chapter_id=${ch.id}`" class="dash-chip theme-soft theme-focus">
                        <i class="pi pi-book text-[10px]"></i> {{ ch.label }}
                    </RouterLink>
                </div>
                <RouterLink to="/nursing" class="dash-btn theme-surface theme-shadow mt-6 text-xs">
                    <i class="pi pi-gauge text-[10px]"></i> Back to the nursing dashboard
                </RouterLink>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import ProductBreadcrumb from "../../../components/ProductBreadcrumb.vue";

const route = useRoute();
const topicId = route.params.id;
const chapterName = ref("");
const subChapters = ref([] as any[]);

const ready = [
    { id: 7, label: "Fundamentals" },
    { id: 4, label: "Maternal & Newborn" },
    { id: 15, label: "Pediatric" },
    { id: 12, label: "Medical Surgical" },
    { id: 13, label: "Psychiatric" },
    { id: 8, label: "Pharmacology" },
    { id: 14, label: "Pathophysiology" },
];

const fetchSubChapters = async () => {
    if (!topicId) return;
    try {
        const response = await axios.get(`/nursing/study-topic/${topicId}/sub-chapters`);
        chapterName.value = response.data.topic_name;
        subChapters.value = response.data.sub_chapters;
    } catch (error) {
        console.error("Failed to fetch sub-chapters:", error);
    }
};

onMounted(fetchSubChapters);
</script>

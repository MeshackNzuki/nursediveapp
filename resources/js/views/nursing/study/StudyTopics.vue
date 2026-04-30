<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-white">
        <!-- Background Gradient -->
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[300px] w-[300px] lg:h-[600px] lg:w-[600px] bg-gradient-to-r from-purple-300 via-sky-300 to-teal-200 opacity-30 blur-[120px] rounded-full" />
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-200 opacity-30 blur-[100px] rounded-full" />
        </div>

        <!-- Title -->
        <h1 class="p-3 text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
            {{ chapterName }} Topics
        </h1>

        <!-- Empty State -->
        <!-- <div v-if="subChapters?.length === 0" class="text-center text-gray-500 mt-20">
            No sub-chapters available for this topic.
        </div> -->
        <div class="flex items-center w-full justify-center mt-20 text-gray-600 text-lg p-6">
            This Content is being prepared. Please check back later.
        </div>

        <!-- Sub Chapters List -->
        <!-- <ul v-else class="space-y-3">
            <li v-for="sub in subChapters" :key="sub.id" class="flex justify-between items-center border-b pb-2">
                <span class="text-gray-700">{{ sub.name }}</span>
                <CommonButton :action="() => $router.push(`/nursing/sub-chapter/${sub.id}`)" button-text="Open"
                    icon2="pi pi-arrow-right" />
            </li>
        </ul> -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import CommonButton from "../../../components/Buttons/CommonButton.vue";

const route = useRoute();
const topicId = route.params.id; // get main topic ID from URL

const chapterName = ref("");
const subChapters = ref([] as any[]);

const fetchSubChapters = async () => {
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

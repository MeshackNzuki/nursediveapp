<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-white">
        <div class="flex-1 transition-all duration-300 ease-in-out" :class="sidebarOpen ? 'mr-72' : 'mr-6'">
            <div class="h-full overflow-y-auto p-8">
                <div class="px-4 rounded-lg bg-blue-100/80 font-semibold text-md mb-4 flex flex-wrap space-x-1">
                    <span class="text-sky-500 cursor-pointer hover:underline">
                        <span @click="router.back()"> {{ route.query.chapter }} </span>
                    </span>
                    <span class="text-rose-500 px-1 "> / </span>
                    <span class="font-semibold  text-gray-800">
                        {{ parent_subtopic_data?.name || '...' }}
                    </span>
                </div>
                <div v-if="currentLesson" class="prose prose-lg max-w-none">
                    <div class="flex flex-row">
                        <h1 class="text-lg text-sky-500 font-bold mb-4 custom-underline-red">{{ currentLesson.title }}
                        </h1> <button
                            class="p-1 ms-2 rounded-full size-8 bg-gray-200 active:bg-rose-500 cursor-pointer flex items-center justify-center"
                            :class="speaking ? 'bg-rose-500 animate-pulse text-white' : ''" @click="controlSpeech()">
                            <i :class="['pi', speaking ? 'pi-pause-circle text-lg' : 'pi-volume-up text-lg']"></i>

                        </button>
                    </div>
                    <div v-html="currentLesson.body" class="font-light"></div>
                </div>
                <div v-else class="h-full flex items-center justify-center text-gray-400">
                    <span>Loading lesson...</span>
                </div>
            </div>
            <div v-if="currentLesson" class="w-full flex justify-center gap-4 content-center items-center">
                <button class=" bg-sky-500 text-white rounded-full px-4 py-1 mb-6 mr-4 cursor-pointer"
                    @click="previousLesson()">
                    <i class="pi pi-arrow-left "></i> Previous Lesson
                </button>
                <button v-if="currentLesson?.questions_count > 0"
                    class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full px-4 py-1 btn-primary mb-6 cursor-pointer"
                    @click="router.push(`/nursing/exam/${currentLesson.sub_topic_id}?mode=exam`)">
                    Take Quiz on Lesson <i class="pi pi-file"></i>
                </button>
                <button v-if="!is_last_lesson"
                    class=" bg-sky-500 text-white rounded-full px-4 py-1 btn-primary mb-6 cursor-pointer"
                    @click="nextLesson()">
                    Next Lesson <i class="pi pi-arrow-right"></i>
                </button>
                <button v-else class=" bg-teal-500 text-white rounded-full px-4 py-1 btn-primary mb-6 cursor-pointer"
                    @click="router.push(`/nursing/study-chapters?chapter_id=${route.query.chapter_id}`)">
                    Back to Chapters <i class="pi pi-book"></i>
                </button>
            </div>

        </div>

        <!-- Sidebar -->
        <aside
            class="fixed right-0 top-12 h-full bg-white border-l border-gray-200 shadow-xl transition-all duration-300 ease-in-out flex flex-col"
            :class="sidebarOpen ? 'w-50' : 'w-6'">
            <!-- Toggle Handle (Always Visible) -->
            <button @click="toggleSidebar"
                class="absolute cursor-pointer left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-blue-950 text-white w-6 h-20 rounded-l-lg flex items-center justify-center hover:bg-sky-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform transition-transform duration-300"
                    :class="sidebarOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <!-- Sidebar Content -->
            <div v-if="sidebarOpen" class="flex-1 flex flex-col overflow-hidden">
                <div class="p-4 border-b font-semibold text-gray-800">
                    Chapter Lessons
                </div>

                <div class="flex-1 overflow-y-auto">
                    <ul class="divide-y pb-6">
                        <li v-for="lesson in chapterLessons" :key="lesson.id"
                            @click="() => { selectLesson(lesson); toggleSidebar() }"
                            class="px-2 py-2 cursor-pointer hover:bg-indigo-50 transition"
                            :class="currentLesson?.id === lesson.id ? 'bg-blue-100/80 text-sky-600 font-medium' : 'text-gray-700'">
                            {{ lesson.title }}
                        </li>
                        <!-- <li v-if="whole_topic_questions" class=" px-2 py-2 text-gray-500 mt-2 text-center">
                            <span @click="router.push(`/nursing/exam/${whole_topic_questions?.id}?mode=exam`)"
                                class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full px-4 py-1 btn-primary mb-6 cursor-pointer">Practice
                                Exam</span>
                        </li> -->
                    </ul>
                </div>
            </div>
        </aside>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import speak from "../../../utils/speech";
import { set } from '@vueuse/core';

const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(true)
const currentLesson = ref<any>(null)

const chapterLessons = ref<any[]>([])
const parent_subtopic_data = ref<any>(null)
const whole_topic_questions = ref<any[]>([])

const speaking = ref(false);


const controlSpeech = () => {
    if (!speaking.value) {
        speaking.value = true;
        speak(`${currentLesson.value.title}.`);
        setTimeout(() => {
            speak(currentLesson.value.body);
        }, (currentLesson.value.title.length * 155));

    } else {

        speaking.value = false;
        speak.stop();

    }
};


const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}

const selectLesson = (lesson: any) => {
    currentLesson.value = lesson
}

const is_last_lesson = computed(() => {
    if (!currentLesson.value) return false
    const currentIndex = chapterLessons.value.findIndex(lesson => lesson.id === currentLesson.value.id)
    return currentIndex === chapterLessons.value.length - 1
})

const nextLesson = () => {
    if (!currentLesson.value) return
    const currentIndex = chapterLessons.value.findIndex(lesson => lesson.id === currentLesson.value.id)
    if (currentIndex < chapterLessons.value.length - 1) {
        currentLesson.value = chapterLessons.value[currentIndex + 1]
        speak.stop();
        speaking.value = false;
    }
}
const previousLesson = () => {
    if (!currentLesson.value) return
    const currentIndex = chapterLessons.value.findIndex(lesson => lesson.id === currentLesson.value.id)
    if (currentIndex > 0) {
        currentLesson.value = chapterLessons.value[currentIndex - 1]
        speak.stop();
        speaking.value = false;
    }
}

onMounted(async () => {
    try {
        const response = await axios.get(`/nursing/lessons/${route.params.chapter_id}`)
        const data = response.data.data

        whole_topic_questions.value = data.subtopics.find(i => i.name == "More questions")
        // Flatten all lessons from each sub-topic

        chapterLessons.value = data.subtopics
            .filter((subTopic: any) => subTopic.lesson) // skip subtopics without lessons
            .map((subTopic: any) => ({
                ...subTopic.lesson,
                questions_count: subTopic.questions_count,
            }));


        parent_subtopic_data.value = data.parent_subtopic

        // Auto-load first lesson if available
        if (chapterLessons.value.length > 0) {
            currentLesson.value = chapterLessons.value[0]
        }
    } catch (error) {
        console.error('Failed to fetch lessons:', error)
    }
})
</script>


<style scoped>
/* Optional: smooth scrollbar for content-heavy lessons */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(99, 102, 241, 0.4);
    border-radius: 4px;
}
</style>

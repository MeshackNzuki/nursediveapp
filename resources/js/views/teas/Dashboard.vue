<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/authStore";
import { useTeasExamStore } from "../../stores/teasExamStore";
import StatCard from "../../components/Stats/Primary.vue";
import DaysLeft from "../../components/DaysLeft.vue";
import StudySchedulePanel from "../../components/Dashboard/StudySchedulePanel.vue";
import StreakCard from "../../components/Dashboard/StreakCard.vue";

interface TeasModule {
    id: number;
    title: string;
    description: string;
    icon: string;
    count: string;
    color: string;
}

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const teasStore = useTeasExamStore();
const { teas_exam_date, dashdata } = storeToRefs(teasStore);

const teasModules: TeasModule[] = [
    {
        id: 2,
        title: "TEAS Math",
        description: "Arithmetic, algebra, and data interpretation drills.",
        icon: "pi pi-calculator",
        count: "67 sets",
        color: "text-sky-600",
    },
    {
        id: 8,
        title: "TEAS Language",
        description: "Grammar, punctuation, and language usage mastery.",
        icon: "pi pi-language",
        count: "77 sets",
        color: "text-indigo-600",
    },
    {
        id: 4,
        title: "TEAS Science",
        description: "Biology, chemistry, and scientific reasoning prep.",
        icon: "pi pi-sliders-h",
        count: "80 sets",
        color: "text-emerald-600",
    },
    {
        id: 6,
        title: "TEAS Reading",
        description: "Comprehension, inference, and text analysis training.",
        icon: "pi pi-book",
        count: "49 sets",
        color: "text-orange-600",
    },
];

const benchmarkStats = [
    { label: "Highest", value: "99.5%", ring: 90, color: "text-emerald-500" },
    { label: "Most Common", value: "80%", ring: 72, color: "text-lime-500" },
    { label: "Below Avg", value: "40%", ring: 40, color: "text-orange-500" },
];

const firstName = computed(() => user.value?.name?.split(" ")[0] || "Student");

const averageScore = computed(() => {
    const score = Number(dashdata.value?.average_score ?? 0);
    if (!Number.isFinite(score)) return "...";
    return `${Math.max(0, Math.min(100, Math.round(score)))} %`;
});

onMounted(() => {
    teasStore.getEssentials();
});

const handleExamDateUpdated = (date: string) => {
    teas_exam_date.value = date;
};
</script>

<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-gray-50 dark:bg-sky-950 text-gray-700 dark:text-gray-50">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-cyan-200 via-sky-200 to-emerald-200 opacity-35 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-200 via-sky-200 to-indigo-200 opacity-30 blur-[100px] rounded-full">
            </div>
        </div>

        <div class="max-w-screen-2xl mx-auto space-y-6">
            <section class="rounded-3xl border border-slate-200 bg-white/95 dark:bg-sky-900/70 p-5 md:p-6">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    <div class="lg:col-span-8">
                        <h5 class="text-2xl font-semibold"> ATI TEAS <span class="font-light">(99% Guaranteed
                                <span class="text-accent">pass</span>)</span>
                        </h5>
                        <p class="text-sm text-slate-600 dark:text-slate-200 mt-2 max-w-2xl">
                            Welcome back, {{ firstName }}. Build confidence with focused TEAS drills, benchmark your
                            performance, and stay on track with your study schedule.
                        </p>

                        <div class="mt-4 max-w-md">
                            <StreakCard product-code="teas" />
                        </div>
                    </div>

                    <div class="lg:col-span-4 flex flex-col items-center gap-3">
                        <DaysLeft product_code="teas" />
                        <router-link to="/teas/guide-topics"
                            class="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition">
                            Open Study Guides
                        </router-link>
                        <router-link to="/teas/performance-analysis"
                            class="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold border border-slate-300 text-slate-700 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-sky-800 transition">
                            Review Performance
                        </router-link>
                    </div>
                </div>
            </section>

            <section class="flex flex-wrap justify-around py-2 w-full gap-4">
                <StatCard label="All Exams" quantity="100+" icon="pi pi-file" up="up" description="Updated quarterly" />
                <StatCard label="My Attempts" :quantity="dashdata?.teas_attempts" icon="pi pi-pencil"
                    description="All time" link="/teas/previous-attempts" />
                <StatCard label="New Exams" description="Every 2 weeks" quantity="4" icon="pi pi-sparkles" />
                <StatCard label="My Avg. Score" icon="pi pi-percentage" description="Recent attempts"
                    :quantity="averageScore" link="/teas/performance-analysis" />
            </section>

            <section class="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <article
                    class="xl:col-span-7 rounded-3xl border border-slate-200 bg-white dark:bg-sky-900 p-5 shadow-sm">
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">TEAS Practice Areas</h3>
                        <span class="text-xs rounded-full px-3 py-1 bg-sky-100 text-sky-700 font-semibold">Exam-aligned
                            question bank</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <router-link v-for="module in teasModules" :key="module.id"
                            :to="`/teas/test-bank-loader/${module.id}`"
                            class="rounded-2xl border border-slate-200 bg-slate-50/80 dark:bg-sky-950/40 dark:border-sky-800 p-4 hover:shadow-md hover:-translate-y-[1px] transition">
                            <div class="flex items-start justify-between gap-2">
                                <div>
                                    <h4 class="font-bold text-slate-900 dark:text-white">{{ module.title }}</h4>
                                    <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">{{ module.description }}
                                    </p>
                                </div>
                                <i :class="`${module.icon} ${module.color}`"></i>
                            </div>
                            <p class="text-xs font-semibold text-slate-500 dark:text-slate-300 mt-3">{{ module.count }}
                            </p>
                        </router-link>
                    </div>
                </article>

                <article
                    class="xl:col-span-5 rounded-3xl border border-slate-200 bg-white dark:bg-sky-900 p-5 shadow-sm">
                    <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Peer Benchmark Snapshot</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">
                        Students practicing consistently with these banks report stronger real-exam confidence.
                    </p>

                    <div class="flex flex-wrap gap-6 mt-5 justify-center text-center">
                        <div v-for="item in benchmarkStats" :key="item.label" class="flex flex-col items-center">
                            <div class="radial-progress shadow-lg opacity-90 bg-white" :class="item.color"
                                :style="{ '--value': item.ring }" role="progressbar">
                                {{ item.value }}
                            </div>
                            <span class="mt-2 text-xs font-medium">{{ item.label }}</span>
                        </div>
                    </div>

                    <div
                        class="mt-6 rounded-2xl bg-slate-50 dark:bg-sky-950/50 border border-slate-200 dark:border-sky-800 p-4">
                        <p class="text-sm text-slate-700 dark:text-slate-200">
                            Smart strategy: complete one timed test, review rationales immediately, then retake targeted
                            weak areas within 24 hours.
                        </p>
                    </div>
                </article>
            </section>

            <section class="mt-2">
                <StudySchedulePanel product-code="teas" :initial-exam-date="teas_exam_date"
                    progress-route="/teas/performance-analysis" study-route="/teas/guide-topics"
                    title="TEAS Study Schedule" @updated="handleExamDateUpdated" />
            </section>
        </div>
    </div>
</template>

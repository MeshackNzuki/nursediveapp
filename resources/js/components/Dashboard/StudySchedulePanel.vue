<template>
    <section class="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-sky-900">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-300">Study Schedule</p>
                <h3 class="mt-1 text-xl font-semibold text-slate-800 dark:text-slate-100">{{ title }}</h3>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">
                    Set your exam date once, and your weekly focus updates automatically.
                </p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-sky-800 dark:bg-sky-950/70">
                <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Target Exam Date</p>
                <p class="mt-1 text-base font-semibold text-slate-800 dark:text-slate-100">
                    {{ formattedExamDate || "Not set yet" }}
                </p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-300">{{ countdownText }}</p>
            </div>
        </div>

        <div class="mt-4 grid gap-2 sm:grid-cols-3">
            <button class="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-sky-700 dark:text-slate-100 dark:hover:bg-sky-800/70"
                @click="setPresetDate(30)">
                In 30 days
            </button>
            <button class="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-sky-700 dark:text-slate-100 dark:hover:bg-sky-800/70"
                @click="setPresetDate(60)">
                In 60 days
            </button>
            <button class="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-sky-700 dark:text-slate-100 dark:hover:bg-sky-800/70"
                @click="setPresetDate(90)">
                In 90 days
            </button>
        </div>

        <div class="mt-3 flex flex-col gap-3 md:flex-row">
            <input v-model="examDateInput" type="date"
                class="input input-bordered w-full bg-white dark:border-sky-700 dark:bg-sky-950 dark:text-slate-100" />
            <button class="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="saving" @click="saveExamDate">
                {{ saving ? "Saving..." : "Save Exam Date" }}
            </button>
        </div>

        <div class="mt-5 grid gap-3 lg:grid-cols-3">
            <article v-for="phase in schedulePhases" :key="phase.name"
                class="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-sky-800 dark:bg-sky-950/70">
                <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ phase.rangeLabel }}</p>
                <h4 class="mt-1 font-semibold text-slate-800 dark:text-slate-100">{{ phase.name }}</h4>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ phase.focus }}</p>
            </article>
        </div>

        <div class="mt-5 flex flex-col gap-2 sm:flex-row">
            <RouterLink :to="progressRoute"
                class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500">
                Check Progress
            </RouterLink>
            <RouterLink :to="studyRoute"
                class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-sky-700 dark:text-slate-100 dark:hover:bg-sky-800/60">
                Open Study Resources
            </RouterLink>
        </div>
    </section>
</template>

<script setup lang="ts">
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue3-toastify";

interface SchedulePhase {
    name: string;
    rangeLabel: string;
    focus: string;
}

const props = withDefaults(
    defineProps<{
        productCode: string;
        progressRoute: string;
        studyRoute: string;
        title?: string;
        initialExamDate?: string | null;
    }>(),
    {
        title: "Exam Prep Plan",
        initialExamDate: null,
    },
);

const emit = defineEmits<{
    (event: "updated", value: string): void;
}>();

const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const saving = ref(false);
const currentExamDate = ref<string | null>(normalizeDate(props.initialExamDate));
const examDateInput = ref(currentExamDate.value ?? "");

watch(
    () => props.initialExamDate,
    (value) => {
        const normalized = normalizeDate(value);
        if (!normalized) {
            return;
        }
        currentExamDate.value = normalized;
        examDateInput.value = normalized;
    },
);

onMounted(() => {
    if (!currentExamDate.value) {
        void fetchExamDate();
    }
});

const formattedExamDate = computed(() => {
    const date = parseDate(currentExamDate.value);
    return date ? formatDate(date) : "";
});

const daysUntilExam = computed(() => {
    const examDate = parseDate(currentExamDate.value);
    if (!examDate) {
        return null;
    }
    const today = getToday();
    return Math.ceil((examDate.getTime() - today.getTime()) / ONE_DAY_MS);
});

const countdownText = computed(() => {
    if (daysUntilExam.value === null) {
        return "Pick a date to generate your schedule.";
    }
    if (daysUntilExam.value > 0) {
        return `${daysUntilExam.value} day(s) remaining`;
    }
    if (daysUntilExam.value === 0) {
        return "Exam day is today";
    }
    return `Exam date passed ${Math.abs(daysUntilExam.value)} day(s) ago`;
});

const schedulePhases = computed<SchedulePhase[]>(() => {
    const today = getToday();
    const examDate = parseDate(currentExamDate.value);

    if (!examDate || examDate.getTime() <= today.getTime()) {
        return [
            {
                name: "Foundation",
                rangeLabel: "Week 1",
                focus: "Review weak subjects and set daily study targets.",
            },
            {
                name: "Practice",
                rangeLabel: "Week 2",
                focus: "Take timed quizzes and track score by section.",
            },
            {
                name: "Final Review",
                rangeLabel: "Week 3",
                focus: "Run mixed exams, revise notes, and rest before test day.",
            },
        ];
    }

    const totalDays = Math.max(1, Math.ceil((examDate.getTime() - today.getTime()) / ONE_DAY_MS));
    let phaseOneDays = Math.max(3, Math.round(totalDays * 0.4));
    let phaseTwoDays = Math.max(3, Math.round(totalDays * 0.4));
    let phaseThreeDays = totalDays - phaseOneDays - phaseTwoDays;

    if (phaseThreeDays < 2) {
        const deficit = 2 - phaseThreeDays;
        const reduciblePhaseOne = Math.max(0, phaseOneDays - 3);
        const reduceFromPhaseOne = Math.min(deficit, reduciblePhaseOne);
        phaseOneDays -= reduceFromPhaseOne;
        phaseThreeDays += reduceFromPhaseOne;

        const remainingDeficit = 2 - phaseThreeDays;
        if (remainingDeficit > 0) {
            const reduciblePhaseTwo = Math.max(0, phaseTwoDays - 3);
            const reduceFromPhaseTwo = Math.min(remainingDeficit, reduciblePhaseTwo);
            phaseTwoDays -= reduceFromPhaseTwo;
            phaseThreeDays += reduceFromPhaseTwo;
        }
    }

    const phaseOneStart = today;
    const phaseOneEnd = addDays(phaseOneStart, phaseOneDays - 1);
    const phaseTwoStart = addDays(phaseOneEnd, 1);
    const phaseTwoEnd = addDays(phaseTwoStart, phaseTwoDays - 1);
    const phaseThreeStart = addDays(phaseTwoEnd, 1);

    return [
        {
            name: "Foundation",
            rangeLabel: `${formatDate(phaseOneStart)} - ${formatDate(phaseOneEnd)}`,
            focus: "Prioritize weak sections and rebuild core concepts.",
        },
        {
            name: "Practice",
            rangeLabel: `${formatDate(phaseTwoStart)} - ${formatDate(phaseTwoEnd)}`,
            focus: "Take mixed timed exams and review misses by topic.",
        },
        {
            name: "Final Review",
            rangeLabel: `${formatDate(phaseThreeStart)} - ${formatDate(examDate)}`,
            focus: "Simulate exam conditions, then taper with light review.",
        },
    ];
});

function setPresetDate(days: number) {
    const targetDate = addDays(getToday(), days);
    examDateInput.value = toInputDate(targetDate);
}

async function saveExamDate() {
    const selectedDate = parseDate(examDateInput.value);
    if (!selectedDate) {
        toast.error("Please choose a valid exam date.");
        return;
    }

    const today = getToday();
    if (selectedDate.getTime() < today.getTime()) {
        toast.error("Please choose today or a future date.");
        return;
    }

    try {
        saving.value = true;
        await axios.post("/exam-dates", {
            date: toInputDate(selectedDate),
            product_code: props.productCode,
        });

        currentExamDate.value = toInputDate(selectedDate);
        emit("updated", currentExamDate.value);
        toast.success("Exam date saved. Schedule updated.");
    } catch (error: any) {
        const message = error?.response?.data?.message || "Could not save exam date.";
        toast.error(message);
    } finally {
        saving.value = false;
    }
}

async function fetchExamDate() {
    try {
        const response = await axios.get("/exam-dates", {
            params: { product_code: props.productCode },
        });
        const normalized = normalizeDate(response?.data?.data?.date);
        if (!normalized) {
            return;
        }
        currentExamDate.value = normalized;
        examDateInput.value = normalized;
    } catch (error) {
        // Silent fetch fallback; users can still set date manually.
    }
}

function normalizeDate(value: string | null | undefined): string | null {
    if (!value || typeof value !== "string") {
        return null;
    }
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
        return null;
    }
    return `${match[1]}-${match[2]}-${match[3]}`;
}

function parseDate(value: string | null | undefined): Date | null {
    const normalized = normalizeDate(value);
    if (!normalized) {
        return null;
    }

    const [year, month, day] = normalized.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

function addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

function toInputDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
</script>

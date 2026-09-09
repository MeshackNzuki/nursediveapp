<template>
    <section id="schedule" class="dash-card scroll-mt-6">
        <div class="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl theme-glow opacity-60"
            aria-hidden="true"></div>

        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0">
                <p class="dash-eyebrow theme-text">Study Schedule</p>
                <h3 class="dash-title mt-1 text-xl">{{ title }}</h3>
                <p class="analysis-muted mt-2">
                    Set your exam date once, and your weekly focus updates automatically.
                </p>
            </div>

            <div class="dash-tile flex items-center gap-3 px-4 py-3">
                <span class="dash-icon-tile theme-icon h-11 w-11">
                    <i class="pi pi-calendar"></i>
                </span>
                <div class="min-w-0">
                    <p class="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Target Exam Date</p>
                    <p class="mt-0.5 text-base font-extrabold text-slate-900 dark:text-white">
                        {{ formattedExamDate || "Not set yet" }}
                    </p>
                    <p class="text-xs font-semibold theme-text">{{ countdownText }}</p>
                </div>
            </div>
        </div>

        <div class="relative mt-4 flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-300">Quick set:</span>
            <button v-for="days in [30, 60, 90]" :key="days" type="button" class="dash-chip theme-soft theme-focus"
                @click="setPresetDate(days)">
                <i class="pi pi-bolt text-[10px]"></i>
                In {{ days }} days
            </button>
        </div>

        <div class="relative mt-3 flex flex-col gap-3 md:flex-row">
            <input v-model="examDateInput" type="date"
                class="theme-focus w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 focus:outline-none dark:border-sky-700 dark:bg-sky-950 dark:text-slate-100" />
            <button type="button" class="dash-btn theme-surface theme-shadow shrink-0 px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="saving" @click="saveExamDate">
                <i :class="saving ? 'pi pi-spin pi-spinner' : 'pi pi-save'"></i>
                {{ saving ? "Saving..." : "Save Exam Date" }}
            </button>
        </div>

        <ol class="relative mt-5 grid gap-3 lg:grid-cols-3">
            <li v-for="(phase, index) in schedulePhases" :key="phase.name"
                class="dash-tile dash-hover-lift relative overflow-hidden">
                <div class="mb-3 flex items-center gap-2">
                    <span class="theme-surface inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black">
                        {{ index + 1 }}
                    </span>
                    <span class="h-1 flex-1 rounded-full theme-bar opacity-70"></span>
                </div>
                <p class="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ phase.rangeLabel }}</p>
                <h4 class="mt-1 font-extrabold text-slate-900 dark:text-white">{{ phase.name }}</h4>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ phase.focus }}</p>
            </li>
        </ol>

        <div class="relative mt-5 flex flex-col gap-2 sm:flex-row">
            <RouterLink :to="progressRoute" class="dash-btn theme-surface theme-shadow px-5 py-2.5">
                <i class="pi pi-chart-line"></i>
                Check Progress
            </RouterLink>
            <RouterLink :to="studyRoute" class="dash-btn-ghost px-5 py-2.5">
                <i class="pi pi-book"></i>
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

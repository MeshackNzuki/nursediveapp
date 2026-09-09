<template>
    <div class="w-full px-3 mx-auto">
        <section class="dash-card p-5">
            <div class="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-60" aria-hidden="true"></div>
            <div class="relative flex items-start justify-between gap-3">
                <div>
                    <p class="dash-eyebrow theme-text">NCLEX Builder</p>
                    <h2 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Create Custom Test</h2>
                    <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Build a focused session by mode, topic areas, and target question count.
                    </p>
                </div>
                <span class="dash-icon-tile theme-icon h-11 w-11"><i class="pi pi-sliders-h"></i></span>
            </div>
        </section>

        <form @submit.prevent="submitForm" class="mt-4 space-y-4 w-full">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <section class="dash-card-white">
                    <h3 class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Mode</h3>
                    <div class="mt-3 grid grid-cols-2 gap-2">
                        <label class="cursor-pointer">
                            <input v-model="form.mode" type="radio" class="sr-only" value="exam" />
                            <span :class="[
                                'flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition duration-200',
                                form.mode === 'exam' ? 'theme-soft shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-sky-700 dark:bg-slate-900 dark:text-slate-300'
                            ]">
                                <i class="pi pi-stopwatch text-xs"></i> Exam
                            </span>
                        </label>
                        <label class="cursor-pointer">
                            <input v-model="form.mode" type="radio" class="sr-only" value="tutor" />
                            <span :class="[
                                'flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition duration-200',
                                form.mode === 'tutor' ? 'theme-soft shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-sky-700 dark:bg-slate-900 dark:text-slate-300'
                            ]">
                                <i class="pi pi-book text-xs"></i> Tutor
                            </span>
                        </label>
                    </div>
                    <p class="mt-2 text-[11px] text-slate-500 dark:text-slate-300">
                        {{ form.mode === 'tutor' ? 'Rationales show after every question.' : 'Timed, with results at the end.' }}
                    </p>
                </section>

                <section class="dash-card-white">
                    <h3 class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Number of Questions</h3>
                    <div class="mt-3 flex items-center gap-3">
                        <input type="number" v-model.number="form.numQuestions" :min="MIN_QUESTIONS" :max="MAX_QUESTIONS"
                            @blur="normalizeQuestionCount"
                            class="theme-focus w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold tabular-nums text-slate-800 shadow-sm focus:outline-none dark:border-sky-700 dark:bg-slate-900 dark:text-slate-100" />
                        <p class="text-xs text-slate-500 dark:text-slate-300">{{ MIN_QUESTIONS }} - {{ MAX_QUESTIONS }} questions</p>
                    </div>
                    <div class="mt-3 flex flex-wrap gap-2">
                        <button v-for="preset in QUESTION_PRESETS" :key="preset" type="button" @click="setQuestionPreset(preset)"
                            class="dash-chip py-1.5"
                            :class="form.numQuestions === preset ? 'theme-soft' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-sky-700 dark:bg-slate-900 dark:text-slate-300'">
                            {{ preset }} Qs
                        </button>
                    </div>
                </section>
            </div>

            <section class="dash-card-white">
                <div class="flex items-center justify-between">
                    <h3 class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Client Need Areas</h3>
                    <span class="analysis-pill theme-soft border text-[11px]">{{ form.clientNeeds.length }} selected</span>
                </div>
                <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label v-for="area in clientNeedAreas" :key="area" class="cursor-pointer">
                        <input type="checkbox" class="sr-only" v-model="form.clientNeeds" :value="area" />
                        <span :class="[
                            'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition duration-200',
                            form.clientNeeds.includes(area) ? 'theme-soft shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-sky-700 dark:bg-slate-900 dark:text-slate-300'
                        ]">
                            <span class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition"
                                :class="form.clientNeeds.includes(area) ? 'theme-dot border-transparent text-white' : 'border-slate-300 dark:border-slate-600'">
                                <i v-if="form.clientNeeds.includes(area)" class="pi pi-check text-[8px]"></i>
                            </span>
                            {{ area }}
                        </span>
                    </label>
                </div>
            </section>

            <section class="dash-card-white">
                <div class="flex items-center justify-between">
                    <h3 class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Subjects</h3>
                    <span class="analysis-pill theme-soft border text-[11px]">{{ form.subjects.length }} selected</span>
                </div>
                <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <label v-for="subject in subjects" :key="subject" class="cursor-pointer">
                        <input type="checkbox" class="sr-only" v-model="form.subjects" :value="subject" />
                        <span :class="[
                            'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition duration-200',
                            form.subjects.includes(subject) ? 'theme-soft shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-sky-700 dark:bg-slate-900 dark:text-slate-300'
                        ]">
                            <span class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition"
                                :class="form.subjects.includes(subject) ? 'theme-dot border-transparent text-white' : 'border-slate-300 dark:border-slate-600'">
                                <i v-if="form.subjects.includes(subject)" class="pi pi-check text-[8px]"></i>
                            </span>
                            {{ subject }}
                        </span>
                    </label>
                </div>
            </section>

            <section class="dash-card-white border-dashed">
                <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <div class="flex items-center gap-3">
                        <span class="dash-icon-tile theme-icon h-10 w-10"><i class="pi pi-list-check"></i></span>
                        <div>
                            <p class="font-extrabold text-slate-900 dark:text-white">Session summary</p>
                            <p class="text-xs text-slate-600 dark:text-slate-300">
                                {{ form.numQuestions }} questions in {{ form.mode === 'tutor' ? 'Tutor' : 'Exam' }} mode.
                                Estimated {{ estimatedMinutes }} minutes.
                            </p>
                        </div>
                    </div>
                    <span class="analysis-pill theme-soft border">{{ selectedFiltersCount }} filters selected</span>
                </div>
            </section>

            <div class="pt-1 flex items-center justify-between gap-3">
                <p class="text-xs text-slate-500 dark:text-slate-300">
                    Pick at least one client need area or subject to continue.
                </p>
                <button type="submit" :disabled="!canSubmit" class="dash-btn theme-surface theme-shadow px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50">
                    <i class="pi pi-play"></i> Create test
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const MIN_QUESTIONS = 10
const MAX_QUESTIONS = 85
const QUESTION_PRESETS = [25, 50, 85]

const clientNeedAreas = [
    'Safe & Effective Care',
    'Health Promotion',
    'Psychosocial Integrity',
    'Physiological Integrity',
]

const subjects = [
    'Pharmacology',
    'Maternity',
    'Pediatrics',
    'Medical-Surgical',
    'Mental Health',
]

const form = reactive({
    mode: 'exam',
    clientNeeds: [],
    subjects: [],
    numQuestions: 25,
})

const selectedFiltersCount = computed(() => form.clientNeeds.length + form.subjects.length)

const canSubmit = computed(() => {
    return Number.isFinite(form.numQuestions)
        && form.numQuestions >= MIN_QUESTIONS
        && form.numQuestions <= MAX_QUESTIONS
        && selectedFiltersCount.value > 0
})

const estimatedMinutes = computed(() => Math.max(10, Math.round(form.numQuestions * 1.3)))

function setQuestionPreset(value) {
    form.numQuestions = value
}

function normalizeQuestionCount() {
    const nextValue = Number(form.numQuestions)

    if (!Number.isFinite(nextValue)) {
        form.numQuestions = MIN_QUESTIONS
        return
    }

    form.numQuestions = Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, Math.round(nextValue)))
}

function submitForm() {
    normalizeQuestionCount()

    if (!canSubmit.value) return

    const draftPayload = {
        ...form,
        created_at: new Date().toISOString(),
    }

    localStorage.setItem('nclex_create_test_draft', JSON.stringify(draftPayload))

    if (!authStore.isActive('nclex')) {
        router.push(authStore.pricingRoute('nclex'))
        return
    }

    router.push({
        path: '/nclex/linear',
        query: {
            source: 'create-test',
            mode: form.mode,
        },
    })
}
</script>

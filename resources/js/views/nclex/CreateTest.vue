<template>
    <div class="w-full px-3 mx-auto">
        <section
            class="relative overflow-hidden rounded-[26px] border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-emerald-50 p-5 shadow-[0_22px_50px_-32px_rgba(14,116,144,0.5)] dark:border-cyan-800 dark:from-slate-900 dark:via-sky-900 dark:to-emerald-950">
            <div
                class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(56,189,248,0.2),transparent_48%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.15),transparent_45%)]">
            </div>
            <div class="relative">
                <p
                    class="inline-flex items-center rounded-full border border-cyan-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:border-cyan-700 dark:bg-slate-900/70 dark:text-cyan-200">
                    NCLEX Builder
                </p>
                <h2 class="mt-3 text-2xl font-black text-slate-900 dark:text-white">Create Custom Test</h2>
                <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Build a focused session by mode, topic areas, and target question count.
                </p>
            </div>
        </section>

        <form @submit.prevent="submitForm" class="mt-4 space-y-4 w-full">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <section class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-sky-800 dark:bg-slate-900/70">
                    <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Mode</h3>
                    <div class="mt-3 grid grid-cols-2 gap-2">
                        <label class="cursor-pointer">
                            <input v-model="form.mode" type="radio" class="sr-only" value="exam" />
                            <span :class="[
                                'block rounded-xl border px-3 py-2 text-sm font-semibold text-center transition',
                                form.mode === 'exam'
                                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-200 dark:border-cyan-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-sky-700 dark:bg-slate-900 dark:text-slate-300'
                            ]">
                                Exam
                            </span>
                        </label>
                        <label class="cursor-pointer">
                            <input v-model="form.mode" type="radio" class="sr-only" value="tutor" />
                            <span :class="[
                                'block rounded-xl border px-3 py-2 text-sm font-semibold text-center transition',
                                form.mode === 'tutor'
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 dark:border-sky-700 dark:bg-slate-900 dark:text-slate-300'
                            ]">
                                Tutor
                            </span>
                        </label>
                    </div>
                </section>

                <section class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-sky-800 dark:bg-slate-900/70">
                    <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Number of Questions</h3>
                    <div class="mt-3 flex items-center gap-3">
                        <input type="number" v-model.number="form.numQuestions" :min="MIN_QUESTIONS" :max="MAX_QUESTIONS"
                            @blur="normalizeQuestionCount"
                            class="w-24 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none dark:border-sky-700 dark:bg-slate-900 dark:text-slate-100" />
                        <p class="text-xs text-slate-500 dark:text-slate-300">
                            {{ MIN_QUESTIONS }} - {{ MAX_QUESTIONS }} questions
                        </p>
                    </div>
                    <div class="mt-3 flex flex-wrap gap-2">
                        <button v-for="preset in QUESTION_PRESETS" :key="preset" type="button" @click="setQuestionPreset(preset)"
                            :class="[
                                'rounded-full border px-3 py-1 text-xs font-semibold transition',
                                form.numQuestions === preset
                                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-200'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-sky-700 dark:bg-slate-900 dark:text-slate-300'
                            ]">
                            {{ preset }} Qs
                        </button>
                    </div>
                </section>
            </div>

            <section class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-sky-800 dark:bg-slate-900/70">
                <div class="flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Client Need Areas</h3>
                    <span class="text-xs font-semibold text-slate-500 dark:text-slate-300">{{ form.clientNeeds.length }} selected</span>
                </div>
                <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label v-for="area in clientNeedAreas" :key="area" class="cursor-pointer">
                        <input type="checkbox" class="sr-only" v-model="form.clientNeeds" :value="area" />
                        <span :class="[
                            'block rounded-xl border px-3 py-2 text-sm transition',
                            form.clientNeeds.includes(area)
                                ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-200'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-sky-700 dark:bg-slate-900 dark:text-slate-300'
                        ]">
                            {{ area }}
                        </span>
                    </label>
                </div>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-sky-800 dark:bg-slate-900/70">
                <div class="flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Subjects</h3>
                    <span class="text-xs font-semibold text-slate-500 dark:text-slate-300">{{ form.subjects.length }} selected</span>
                </div>
                <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <label v-for="subject in subjects" :key="subject" class="cursor-pointer">
                        <input type="checkbox" class="sr-only" v-model="form.subjects" :value="subject" />
                        <span :class="[
                            'block rounded-xl border px-3 py-2 text-sm transition',
                            form.subjects.includes(subject)
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 dark:border-sky-700 dark:bg-slate-900 dark:text-slate-300'
                        ]">
                            {{ subject }}
                        </span>
                    </label>
                </div>
            </section>

            <section
                class="rounded-2xl border border-dashed border-cyan-300/70 bg-cyan-50/60 p-4 dark:border-cyan-700 dark:bg-cyan-950/20">
                <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <div>
                        <p class="font-semibold text-slate-700 dark:text-slate-200">Session summary</p>
                        <p class="text-xs text-slate-600 dark:text-slate-300">
                            {{ form.numQuestions }} questions in {{ form.mode === 'tutor' ? 'Tutor' : 'Exam' }} mode.
                            Estimated {{ estimatedMinutes }} minutes.
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-slate-600 dark:text-slate-300">
                            {{ selectedFiltersCount }} filters selected
                        </p>
                    </div>
                </div>
            </section>

            <div class="pt-1 flex items-center justify-between gap-3">
                <p class="text-xs text-slate-500 dark:text-slate-300">
                    Pick at least one client need area or subject to continue.
                </p>
                <CommonButton button-text="Create Test" :disabled="!canSubmit" />
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import CommonButton from '../../components/Buttons/CommonButton.vue'
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

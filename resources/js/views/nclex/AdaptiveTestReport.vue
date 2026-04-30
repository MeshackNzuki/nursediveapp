<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-gray-50">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-purple-300 via-sky-300 to-teal-200 opacity-30 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-200 opacity-30 blur-[100px] rounded-full">
            </div>
        </div>

        <div class="space-y-10">
            <section class="grid gap-6 lg:grid-cols-3">
                <div class="lg:col-span-1 bg-white/90 rounded-2xl p-8 border border-gray-100 shadow-xl shadow-custom">
                    <div class="flex flex-col items-center">
                        <div class="relative w-32 h-32 flex items-center justify-center mb-4">
                            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="6"></circle>
                                <circle cx="50" cy="50" r="45" fill="none"
                                    :stroke="displayAttempt.score >= 65 ? '#10b981' : '#ef4444'" stroke-width="6"
                                    stroke-dasharray="282.7"
                                    :style="{ strokeDashoffset: 282.7 * (1 - displayAttempt.score / 100) }"
                                    stroke-linecap="round">
                                </circle>
                            </svg>
                            <div class="absolute flex flex-col items-center justify-center">
                                <div class="text-3xl font-bold"
                                    :class="displayAttempt.score >= 65 ? 'text-green-600' : 'text-rose-600'">
                                    {{ Math.round(displayAttempt.score) }}%
                                </div>
                                <div class="text-xs text-gray-500">Score</div>
                            </div>
                        </div>
                        <div class="text-center mb-6">
                            <span :class="[
                                'inline-block px-6 py-2 rounded-full font-bold text-lg',
                                displayAttempt.score >= 65
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-rose-100 text-rose-700'
                            ]">
                                {{ displayAttempt.score >= 65 ? '✓ PASSED' : '✗ FAILED' }}
                            </span>
                        </div>
                        <div class="space-y-3 text-sm text-gray-600 w-full">
                            <div class="flex justify-between items-center">
                                <span class="font-semibold">Questions:</span>
                                <span class="font-bold text-gray-800">{{ displayAttempt.suspend_index }}/150</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-semibold">Date:</span>
                                <span class="font-bold text-gray-800">{{ formatDate(displayAttempt.completed_at)
                                    }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-semibold">Time:</span>
                                <span class="font-bold text-gray-800">{{ formatTime(displayAttempt.time_taken) }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-semibold">Mode:</span>
                                <span class="font-bold text-gray-800 uppercase">{{ displayAttempt.mode }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-2 bg-white/90 rounded-2xl p-8 border border-gray-100 shadow-custom">
                    <h4 class="text-xl font-bold text-gray-800 mb-6">Performance Analysis</h4>

                    <div class="space-y-6">
                        <div>
                            <h5 class="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <i class="pi pi-comment text-blue-500"></i>
                                Remarks
                            </h5>
                            <p class="text-gray-600 leading-relaxed">
                                <span v-if="displayAttempt.score >= 80">
                                    <strong>Excellent Performance!</strong> You demonstrated exceptional knowledge and
                                    preparation. Your adaptive exam performance indicates readiness for the NCLEX-RN
                                    examination. Continue maintaining this level of excellence.
                                </span>
                                <span v-else-if="displayAttempt.score >= 65">
                                    <strong>Good Performance!</strong> You have passed the adaptive exam and
                                    demonstrated
                                    adequate knowledge. Consider targeting weak areas identified in the subject analysis
                                    below for continued improvement.
                                </span>
                                <span v-else-if="displayAttempt.score >= 50">
                                    <strong>Fair Performance.</strong> While you did not meet the passing threshold, you
                                    have shown some understanding. Focus on the subjects with lower scores and consider
                                    additional study and practice.
                                </span>
                                <span v-else>
                                    <strong>Needs Improvement.</strong> The exam results indicate significant knowledge
                                    gaps. It's recommended to review all subject areas thoroughly and attempt more
                                    practice
                                    questions before retaking the exam.
                                </span>
                            </p>
                        </div>

                        <div>
                            <h5 class="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <i class="pi pi-sliders-v text-teal-500"></i>
                                Adaptive Metrics
                            </h5>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-gray-50 p-3 rounded-lg">
                                    <div class="text-sm text-gray-600">Final Difficulty</div>
                                    <div class="text-2xl font-bold text-gray-800">{{ displayAttempt.final_difficulty
                                        }}/100</div>
                                </div>
                                <div class="bg-gray-50 p-3 rounded-lg">
                                    <div class="text-sm text-gray-600">Ability (θ)</div>
                                    <div class="text-2xl font-bold text-gray-800">{{
                                        parseFloat(displayAttempt.theta).toFixed(2) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div class="bg-white/80 rounded-2xl p-8 border border-gray-100 shadow-custom">
                <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <i class="pi pi-chart-bar text-emerald-500"></i>
                    Subject-wise Performance
                </h4>

                <div v-if="subjectScores.length > 0" class="space-y-6">
                    <div v-for="subject in subjectScores" :key="subject.id" class="space-y-2">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-gray-800">{{ subject.name }}</span>
                                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                                    {{ subject.correct }}/{{ subject.total }}
                                </span>
                            </div>
                            <span :class="[
                                'font-bold text-sm',
                                subject.percentage >= 80 ? 'text-green-600' :
                                    subject.percentage >= 65 ? 'text-blue-600' :
                                        subject.percentage >= 50 ? 'text-yellow-600' : 'text-rose-600'
                            ]">
                                {{ Math.round(subject.percentage) }}%
                            </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div :style="{ width: subject.percentage + '%', backgroundColor: subject.barColor }"
                                class="h-3 transition-all duration-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                    No subject-specific data available for this attempt.
                </div>
            </div>
            <div class="flex gap-4 mb-8">
                <CommonButton button-text="Review Exam" classes="bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    :action="() => reviewExam()" />
                <CommonButton button-text="Back to Dashboard"
                    classes="border border-teal-500 text-gray-100 rounded-lg hover:bg-teal-50"
                    :action="() => router.push('/nclex/')" />
                <CommonButton button-text="Retake Exam" icon="pi pi-refresh"
                    classes="border border-sky-500 text-gray-100 rounded-lg hover:bg-sky-50"
                    :action="() => router.push('/nclex/cat')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import CommonButton from '../../components/Buttons/CommonButton.vue';

const route = useRoute()
const router = useRouter()
const attempt = ref<any>(null)
const attempts = ref<any[]>([])

const displayAttempt = computed(() => {
    if (attempt.value) {
        return attempt.value
    }

    return {
        score: 0,
        suspend_index: 0,
        completed_at: new Date().toISOString(),
        time_taken: 0,
        mode: 'exam',
        final_difficulty: 0,
        theta: 0,
    }
})

onMounted(async () => {
    try {
        const attemptId = route.params.id
        const { data } = await axios.get(`/nclex/cat-attempts/${attemptId}`)
        attempt.value = data.data
    } catch (error) {
        console.error('Error loading report:', error)
    }

    try {
        const { data } = await axios.get('/nclex/cat-attempts')
        attempts.value = data.data || []
    } catch (error) {
        console.error('Error loading attempt history:', error)
    }
})

const safeJsonParse = (value: unknown) => {
    if (!value) return null
    if (typeof value === 'string') {
        try {
            return JSON.parse(value)
        } catch {
            return null
        }
    }
    return value
}

const subjectNameMap = computed<Record<string, string>>(() => {
    const parsed = safeJsonParse(attempt.value?.subject_name_map)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return {}
    }

    return Object.entries(parsed as Record<string, unknown>).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && String(value).trim().length > 0) {
            acc[String(key)] = String(value)
        }
        return acc
    }, {} as Record<string, string>)
})

const resolveSubjectName = (
    idCandidate: string | number | undefined,
    fallbackKey: string | number | undefined,
) => {
    const candidates = [idCandidate, fallbackKey]
        .map((candidate) => (candidate === null || candidate === undefined ? null : String(candidate)))
        .filter((candidate): candidate is string => !!candidate)

    for (const key of candidates) {
        const matched = subjectNameMap.value[key]
        if (matched) {
            return matched
        }
    }

    return null
}

const deriveDefaultSectionName = (fallbackKey: string | number | undefined) => {
    const mappedName = resolveSubjectName(fallbackKey, fallbackKey)
    if (mappedName) {
        return mappedName
    }

    if (fallbackKey === null || fallbackKey === undefined) {
        return 'Section'
    }

    const label = String(fallbackKey)
    return /^\d+$/.test(label) ? `Subject ${label}` : `Section ${label}`
}

const normalizeSectionEntry = (section: any, fallbackKey: string | number | undefined) => {
    const correct = Number(section?.correct ?? section?.correct_answers ?? section?.correct_count ?? 0) || 0
    let total = Number(section?.total ?? section?.total_questions ?? section?.questions ?? 1) || 1
    if (total <= 0) total = 1
    const sectionId = section?.subject_id ?? section?.id ?? fallbackKey
    const name = section?.name
        ?? section?.title
        ?? section?.label
        ?? resolveSubjectName(sectionId, fallbackKey)
        ?? deriveDefaultSectionName(fallbackKey)
    const id = sectionId ?? name
    const percentage = (correct / total) * 100

    const barColor = percentage >= 80 ? '#10b981' :
        percentage >= 65 ? '#3b82f6' :
            percentage >= 50 ? '#eab308' : '#ef4444'

    return { id, name, correct, total, percentage, barColor }
}

const parseSectionsPayload = (payload: unknown) => {
    const parsed = safeJsonParse(payload)
    if (!parsed) return []

    if (Array.isArray(parsed)) {
        return parsed.map((section, index) => normalizeSectionEntry(section ?? {}, index + 1))
    }

    if (typeof parsed === 'object') {
        return Object.entries(parsed).map(([key, section]) => normalizeSectionEntry(section ?? {}, key))
    }

    return []
}

const subjectScores = computed(() => {
    if (!attempt.value) return []

    const sectionsPayload = attempt.value.sections
    const fallbackPayload = attempt.value.subject_scores

    const primaryEntries = parseSectionsPayload(sectionsPayload ?? fallbackPayload)
    if (primaryEntries.length) {
        return primaryEntries.sort((a, b) => b.percentage - a.percentage)
    }

    if (sectionsPayload && fallbackPayload && fallbackPayload !== sectionsPayload) {
        const fallbackEntries = parseSectionsPayload(fallbackPayload)
        if (fallbackEntries.length) {
            return fallbackEntries.sort((a, b) => b.percentage - a.percentage)
        }
    }

    return []
})


function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
        return `${hours}h ${minutes}m`
    }
    return `${minutes}m ${secs}s`
}

function reviewExam() {
    router.push(`/nclex/exam/${85}?mode=tutor`)
}


</script>

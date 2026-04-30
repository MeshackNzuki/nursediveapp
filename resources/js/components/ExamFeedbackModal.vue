<template>
    <button type="button" class="inline-flex items-center gap-1 cursor-pointer" @click="open = true">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002" />
        </svg>
        <span class="hidden 2xl:block">Report</span>
    </button>

    <div v-if="open" class="fixed inset-0 z-[80] bg-slate-950/55 backdrop-blur-[1px] flex items-center justify-center p-4">
        <div class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl">
            <div class="flex items-start justify-between gap-2">
                <div>
                    <h3 class="text-lg font-semibold">Report Question or Issue</h3>
                    <p class="mt-1 text-xs text-slate-500">
                        {{ contextLabel }}
                    </p>
                </div>
                <button type="button" class="text-slate-400 hover:text-slate-600" @click="closeModal">
                    <i class="pi pi-times"></i>
                </button>
            </div>

            <div class="mt-4 space-y-3">
                <label class="block text-sm">
                    <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Issue Type</span>
                    <select v-model="issueType"
                        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500">
                        <option value="technical_issue">Technical issue</option>
                        <option value="content_error">Question/content error</option>
                        <option value="answer_issue">Answer/rationale concern</option>
                        <option value="other">Other</option>
                    </select>
                </label>

                <label class="block text-sm">
                    <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Details</span>
                    <textarea v-model="message" rows="5" maxlength="3000"
                        placeholder="Tell us what happened, what looked wrong, and what you expected."
                        class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"></textarea>
                </label>

                <p v-if="feedbackMessage" :class="[
                    'text-xs rounded-lg px-3 py-2',
                    feedbackType === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                ]">
                    {{ feedbackMessage }}
                </p>
            </div>

            <div class="mt-4 flex items-center justify-end gap-2">
                <button type="button" class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                    @click="closeModal">
                    Cancel
                </button>
                <button type="button"
                    class="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="submitting || message.trim().length < 5" @click="submitFeedback">
                    {{ submitting ? 'Sending...' : 'Send Report' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
    sourceProduct: 'nursing' | 'teas' | 'nclex' | 'cat'
    examMode?: 'exam' | 'review' | 'tutor' | string | null
    questionId?: number | string | null
    examId?: number | string | null
}>()

const route = useRoute()
const open = ref(false)
const submitting = ref(false)
const issueType = ref<'content_error' | 'answer_issue' | 'technical_issue' | 'other'>('technical_issue')
const message = ref('')
const feedbackMessage = ref('')
const feedbackType = ref<'success' | 'error'>('success')

const normalizedQuestionId = computed(() => {
    const value = Number(props.questionId)
    return Number.isFinite(value) && value > 0 ? value : null
})

const normalizedExamId = computed(() => {
    const value = Number(props.examId)
    return Number.isFinite(value) && value > 0 ? value : null
})

const contextLabel = computed(() => {
    const parts = [
        `Product: ${props.sourceProduct.toUpperCase()}`,
        props.examMode ? `Mode: ${String(props.examMode).toUpperCase()}` : null,
        normalizedExamId.value ? `Exam ID: ${normalizedExamId.value}` : null,
        normalizedQuestionId.value ? `Question ID: ${normalizedQuestionId.value}` : 'Question ID: n/a',
    ].filter(Boolean)

    return parts.join(' | ')
})

const closeModal = () => {
    open.value = false
}

const submitFeedback = async () => {
    if (message.value.trim().length < 5 || submitting.value) {
        return
    }

    submitting.value = true
    feedbackMessage.value = ''

    try {
        await axios.post('/exam-feedback', {
            source_product: props.sourceProduct,
            exam_mode: props.examMode ?? null,
            exam_id: normalizedExamId.value,
            question_id: normalizedQuestionId.value,
            issue_type: issueType.value,
            message: message.value.trim(),
            route: route.fullPath,
            metadata: {
                current_path: route.fullPath,
                user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
            },
        })

        feedbackType.value = 'success'
        feedbackMessage.value = 'Thanks. Your report was sent to our team.'
        message.value = ''

        setTimeout(() => {
            closeModal()
            feedbackMessage.value = ''
        }, 900)
    } catch (error: any) {
        feedbackType.value = 'error'
        feedbackMessage.value = error?.response?.data?.message || 'Unable to send report. Please try again.'
    } finally {
        submitting.value = false
    }
}
</script>

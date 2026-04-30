<template>
    <div :class="[question.tabs && ['nclex', 'cat'].includes(examStore.storeName) ? 'grid gap-4 md:grid-cols-2' : '']">
        <div>
            <div v-if="question.intro" class="mb-2 font-bold" v-html="question.intro"></div>
            <TabRenderer v-if="question.tabs && ['nclex', 'cat'].includes(examStore.storeName)" :tabs="question.tabs" />
        </div>
        <div class="flex items-start gap-2">
            <img v-if="['nclex', 'cat'].includes(examStore.storeName)" :src="qn_arrow" class="h-8 shrink-0" />
            <div class="mb-2 font-base leading-relaxed" v-html="question.question"></div>
        </div>

        <div>
            <label class="flex items-center gap-2">
                <span>Answer:</span>

                <input type="text" v-model="localValue"
                    class="border-b border-black dark:border-slate-300 dark:bg-sky-950 px-2 py-1 w-32"
                    :disabled="testMode === 'review'" />

                <span v-if="question.units">{{ question.units }}</span>

                <i v-if="shouldShowExplanation" :class="`ms-2 pi text-lg ${isCorrect
                    ? 'pi-check-circle text-teal-500'
                    : isIncorrect
                        ? 'pi-times-circle text-rose-600'
                        : ''
                    }`"></i>
            </label>

            <div v-if="shouldShowExplanation && question.solution" class="mt-2 bg-teal-50 text-teal-800 p-2 rounded"
                v-html="question.solution"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, createApp, onMounted, ref } from 'vue'
import TabRenderer from '../TabRenderer.vue'
import type { Question } from '../../types/question'
import qn_arrow from '../../assets/images/qn_arrow.png'


const props = defineProps<{
    question: Question
    modelValue: string
    examStore: any
}>()

const { testMode, answers } = props.examStore

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
    get: () => props.modelValue,
    set: (val: string) => emit('update:modelValue', val)
})

// Configurable tolerance for numeric comparisons
const numericTolerance = 0.01

const correctAnswers = computed(() => {
    if (Array.isArray(props.question.correct_answer)) return props.question.correct_answer
    try {
        return JSON.parse(props.question.correct_answer || '[]')
    } catch {
        return []
    }
})

const shouldShowExplanation = computed(() => {
    switch (testMode) {
        case 'review':
            return true;
        case 'exam':
            return false;
        case 'tutor':
            return !!props.examStore.answers[props.question.id];
        default:
            return false;
    }
});

const normalizeString = (str: string) => str.trim().toLowerCase()

const isNumeric = (val: string) => !isNaN(parseFloat(val)) && isFinite(Number(val))

const isCorrect = computed(() => {
    if (!shouldShowExplanation.value) return false

    const userAnswer = localValue.value.trim()
    if (!userAnswer) return false

    for (const correct of correctAnswers.value) {
        const correctTrimmed = String(correct).trim()

        // Check numeric comparison with tolerance
        if (isNumeric(correctTrimmed) && isNumeric(userAnswer)) {
            const a = parseFloat(correctTrimmed)
            const b = parseFloat(userAnswer)
            if (Math.abs(a - b) <= numericTolerance) return true
        }

        // Fallback to string comparison
        if (normalizeString(correctTrimmed) === normalizeString(userAnswer)) return true
    }

    return false
})

const isIncorrect = computed(() => {
    return shouldShowExplanation.value && localValue.value.trim() !== '' && !isCorrect.value
})

const tabApp = ref<ReturnType<typeof createApp> | null>(null)

onMounted(() => {
    const container = document.getElementById('exhibits')
    if (!container) return
    container.innerHTML = ''
    tabApp.value = createApp(TabRenderer, { tabs: props.question.tabs })
    tabApp.value.mount(container)
})

onUnmounted(() => {

    if (tabApp.value) {
        tabApp.value.unmount()
        tabApp.value = null
    }
})

</script>

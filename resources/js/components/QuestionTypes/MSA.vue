<template>
    <div :class="[question.tabs && ['nclex', 'cat'].includes(examStore.storeName) ? 'grid gap-4 md:grid-cols-2' : '']">
        <div>
            <div v-if="question.intro" class="mb-2 font-bold" v-html="question.intro"></div>
            <TabRenderer v-if="question.tabs && ['nclex', 'cat'].includes(examStore.storeName)" :tabs="question.tabs" />
        </div>
        <div>
            <div class="flex items-start gap-2">
                <img v-if="['nclex', 'cat'].includes(examStore.storeName)" :src="qn_arrow" class="h-8 shrink-0" />
                <div class="mb-2 font-base leading-relaxed" v-html="question.question"></div>
            </div>
            <div v-for="(option, label) in question.options" :key="label" class="mb-2 ms-4">
                <label v-if="option.choice != null && option.choice != '' && option.choice != 'None'"
                    class="flex items-start gap-2" :class="{
                        'text-teal-500 font-semibold': isCorrectAnswer(String(label)) && shouldShowExplanation,
                        'text-rose-600 font-semibold': isUserSelectedWrong(String(label)) && shouldShowExplanation
                    }">
                    <i :class="`pi mt-1.5 text-lg ${isCorrectAnswer(String(label)) && shouldShowExplanation
                        ? 'pi-check-circle'
                        : isUserSelectedWrong(String(label)) && shouldShowExplanation
                            ? 'pi-times-circle'
                            : ''
                        }`"></i>
                    <input type="radio"
                        class="radio radio-neutral radio-sm mt-1 cursor-pointer border-gray-600  dark:text-slate-100 dark:border-white"
                        :value="label" v-model="localValue" :name="`question-${question.id}`"
                        :disabled="testMode === 'review'" />
                    <div>
                        <span v-html="label" class="font-semibold"></span>.
                        <span v-html="option.choice"></span>
                        <div v-if="shouldShowExplanation && option.reason" :class="{
                            'bg-teal-100 text-teal-800 p-0.5 rounded': isCorrectAnswer(String(label)), 'bg-rose-100 text-rose-700 p-0.5 rounded': isUserSelectedWrong(String(label))
                        }" v-html="option.reason"></div>
                    </div>
                </label>
            </div>
            <slot name="solution"></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onUnmounted, createApp, onMounted, ref } from 'vue'
import qn_arrow from '../../assets/images/qn_arrow.png'
import type { Question } from '../../types/question'
import TabRenderer from '../TabRenderer.vue'

const props = defineProps<{
    question: Question
    modelValue: string | string[]
    examStore: any
}>()

const { testMode, results, answers } = props.examStore



const emit = defineEmits(['update:modelValue', 'update:showSolution'])

const localValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const shouldShowExplanation = computed(() => {
    switch (testMode) {
        case 'review':
            return true;
        case 'tutor':
            return !!props.examStore.answers[props.question.id];
        default:
            return false;
    }
});

const isCorrectAnswer = (label: string) => {
    const correct = props.question.correct_answer
    return Array.isArray(correct) ? correct.includes(label) : correct === label
}

const isUserSelectedWrong = (label: string) => {
    const selected = props.examStore.answers[props.question.id]
    if (testMode === 'review') {
        const result = results[props.question.id]
        return result?.correct === false && selected === label
    }
    if (testMode === 'tutor') {
        return selected === label && !isCorrectAnswer(label)
    }
    return false
}

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

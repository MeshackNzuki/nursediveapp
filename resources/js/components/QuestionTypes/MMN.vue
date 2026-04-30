<template>
    <div :class="[question.tabs && ['nclex', 'cat'].includes(examStore.storeName) ? 'grid gap-4 md:grid-cols-2' : '']">

        <!-- LEFT PANEL -->

        <div>
            <div v-if="question.intro" class="mb-2 font-bold" v-html="question.intro"></div>
            <TabRenderer v-if="question.tabs && ['nclex', 'cat'].includes(examStore.storeName)" :tabs="question.tabs" />
        </div>


        <!-- RIGHT PANEL -->

        <div>

            <div class="flex items-start gap-2">
                <img v-if="['nclex', 'cat'].includes(examStore.storeName)" :src="qn_arrow" class="h-8 shrink-0" />
                <div class="mb-2 font-base leading-relaxed" v-html="question.question"></div>
            </div>

            <!-- instruction -->

            <div class="text-sm text-gray-500 mb-3 italic">
                Select {{ selectN }} option<span v-if="selectN > 1">s</span>.
            </div>


            <!-- OPTIONS -->

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

                    <input type="checkbox"
                        class="checkbox checkbox-sm mt-1 cursor-pointer border-gray-600 text-gray-700 dark:text-slate-100 dark:border-white"
                        :value="String(label)" :checked="localValue.includes(String(label))"
                        @change="toggleSelection(String(label))" :disabled="isDisabled(String(label))" />

                    <div>
                        <span v-html="label" class="font-semibold"></span>.
                        <span v-html="option.choice"></span>

                        <div v-if="shouldShowExplanation && option.reason" :class="{
                            'bg-teal-100 text-teal-800 p-0.5 rounded': isCorrectAnswer(String(label)),
                            'bg-rose-100 text-rose-700 p-0.5 rounded': isUserSelectedWrong(String(label))
                        }" v-html="option.reason"></div>
                    </div>

                </label>

            </div>


            <!-- SUBMIT BUTTON -->

            <div v-if="showRevealButton" class="mt-4 p-4 text-center">
                <button class="px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer"
                    @click="revealAnswersAndExplanation">
                    Submit
                </button>
            </div>


            <slot name="solution"></slot>

        </div>

    </div>
</template>



<script setup lang="ts">

import { computed, ref, watchEffect, inject, onUnmounted, createApp, onMounted } from 'vue'
import type { Question } from '../../types/question'
import TabRenderer from '../TabRenderer.vue'
import qn_arrow from '../../assets/images/qn_arrow.png'


const props = defineProps<{
    question: Question
    modelValue: string[]
    examStore: any
}>()

const { testMode, answers, results } = props.examStore

const emit = defineEmits(['update:modelValue', 'update:showSolution'])



/* --------------------------------------------------
MODEL SYNC
-------------------------------------------------- */

const localValue = computed({
    get: () => props.modelValue,
    set: (val: string[]) => emit('update:modelValue', val)
})



/* --------------------------------------------------
SELECT N LIMIT
-------------------------------------------------- */

const selectN = computed(() => props.question.total_points)

const toggleSelection = (label: string) => {

    const selected = [...localValue.value]
    const index = selected.indexOf(label)

    if (index !== -1) {

        selected.splice(index, 1)

    } else {

        if (selected.length >= selectN.value)
            return

        selected.push(label)

    }

    localValue.value = selected
}



const isDisabled = (label: string) => {

    if (testMode === 'review')
        return true

    if (localValue.value.includes(label))
        return false

    return localValue.value.length >= selectN.value
}



/* --------------------------------------------------
EXPLANATION VISIBILITY
-------------------------------------------------- */

const shouldShowExplanation = ref(false)
const showRevealButton = ref(false)


/* --------------------------------------------------
CORRECT ANSWERS
-------------------------------------------------- */

const correctAnswers = computed(() => {

    if (Array.isArray(props.question.correct_answer))
        return props.question.correct_answer

    try {
        return JSON.parse(props.question.correct_answer || '[]')
    } catch {
        return []
    }

})

watchEffect(() => {

    switch (testMode) {

        case "review":
            shouldShowExplanation.value = true
            break

        case "exam":
            shouldShowExplanation.value = false
            break

        case "tutor":
            shouldShowExplanation.value = false
            showRevealButton.value = true

            if (!!props.examStore.answers[props.question.id]) {

                setTimeout(() => {

                    shouldShowExplanation.value = true

                    emitUp({
                        flag: true,
                        value: true
                    })

                }, correctAnswers.value.length * 10000)

            }

            break

        default:
            shouldShowExplanation.value = false
    }

})

const isCorrectAnswer = (label: string) => {
    return correctAnswers.value.includes(label)
}



const isUserSelectedWrong = (label: string) => {

    const selected = answers[props.question.id] ?? []

    if (testMode === 'review') {
        return selected.includes(label) && !correctAnswers.value.includes(label)
    }

    if (testMode === 'tutor') {
        return selected.includes(label) && !isCorrectAnswer(label)
    }

    return false

}



/* --------------------------------------------------
SOLUTION
-------------------------------------------------- */

const emitUp: any = inject('showSolution')

const revealAnswersAndExplanation = () => {

    shouldShowExplanation.value = true

    emitUp({
        flag: true,
        value: true
    })

    showRevealButton.value = false

}



/* --------------------------------------------------
TAB RENDERING
-------------------------------------------------- */

const tabApp = ref<ReturnType<typeof createApp> | null>(null)

onMounted(() => {

    const container = document.getElementById('exhibits')

    if (!container) return

    container.innerHTML = ''

    tabApp.value = createApp(TabRenderer, { tabs: props.question.tabs })

    tabApp.value.mount(container)

})



onUnmounted(() => {

    emitUp({
        flag: true,
        value: false
    })

    if (tabApp.value) {

        tabApp.value.unmount()
        tabApp.value = null

    }

})

</script>
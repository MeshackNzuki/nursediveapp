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

            <!-- MATRIX TABLE -->

            <table class="matrix-table border border-gray-200 w-full">

                <thead class="bg-gray-100">
                    <tr>
                        <th class="p-2 text-left" v-html="question.table_header"></th>

                        <th v-for="(category, colKey) in categories" :key="colKey" class="p-2 text-center">
                            {{ category }}
                        </th>
                    </tr>
                </thead>


                <tbody>

                    <tr v-for="(option, rowKey) in question.options" :key="rowKey" class="hover:bg-gray-50">

                        <td class="p-2">
                            {{ option.choice.choice }}
                        </td>


                        <td v-for="(category, colKey) in categories" :key="colKey" class="p-2 text-center">

                            <input type="checkbox" :checked="isChecked(String(rowKey), String(colKey))"
                                :disabled="testMode === 'review'" @change="toggle(String(rowKey), String(colKey))"
                                :class="checkboxClass(String(rowKey), String(colKey))" />

                        </td>

                    </tr>

                </tbody>

            </table>



            <!-- ACTION BUTTON -->

            <div v-if="showRevealButton" class="mt-4 text-center">

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

import { ref, reactive, computed, watchEffect, inject, onUnmounted, toRaw } from "vue"
import TabRenderer from '../TabRenderer.vue'
import type { Question } from '../../types/question'
import qn_arrow from '../../assets/images/qn_arrow.png'



/* --------------------------------------------------
PROPS
-------------------------------------------------- */

const props = defineProps<{
    question: Question
    modelValue: Record<string, any>
    examStore: any
}>()

const emit = defineEmits([
    "update:modelValue",
    "submitted",
    "update:showSolution"
])



const { testMode, answers, results } = props.examStore



/* --------------------------------------------------
CORRECT ANSWERS
-------------------------------------------------- */

const correctAnswer = computed(() => {

    if (Array.isArray(props.question.correct_answer))
        return props.question.correct_answer

    try {
        return JSON.parse(props.question.correct_answer || "{}")
    }
    catch {
        return {}
    }

})



/* --------------------------------------------------
CATEGORIES
-------------------------------------------------- */

const mtxOptionRaw: any = props.question.mtx_option || "{}"
const mtxOption = JSON.parse(mtxOptionRaw)

const categories: Record<string, string> = {}

Object.keys(correctAnswer.value).forEach(rowKey => {

    const row = correctAnswer.value[rowKey]

    const colKeys = Array.isArray(row.answers) ? row.answers : []

    colKeys.forEach(colKey => {

        if (!categories[colKey]) {
            categories[colKey] = mtxOption[colKey]?.option || `Category ${colKey}`
        }

    })

})



/* --------------------------------------------------
STATE
-------------------------------------------------- */

const selected = reactive({} as Record<string, { answers: string[] }>)

Object.keys(categories).forEach(colKey => {
    selected[colKey] = { answers: [] }
})



/* --------------------------------------------------
MATRIX LOGIC
-------------------------------------------------- */

function isChecked(rowKey: string, colKey: string) {

    return selected[colKey]?.answers.includes(rowKey)

}



function toggle(rowKey: string, colKey: string) {

    const arr = selected[colKey].answers
    const idx = arr.indexOf(rowKey)

    if (idx > -1)
        arr.splice(idx, 1)
    else
        arr.push(rowKey)

    emit("update:modelValue", cloneSelected())

}

function cloneSelected() {
    const raw = toRaw(selected)

    try {
        // eslint-disable-next-line no-undef
        if (typeof structuredClone === "function") return structuredClone(raw)
    } catch {
        // fall through
    }

    return JSON.parse(JSON.stringify(raw))
}



/* --------------------------------------------------
STYLING FOR REVIEW/TUTOR
-------------------------------------------------- */

function isCorrect(rowKey: string, colKey: string) {

    return correctAnswer.value[rowKey]?.answers?.includes(colKey)

}



function checkboxClass(rowKey: string, colKey: string) {

    if (!shouldShowExplanation.value)
        return ""

    const correct = isCorrect(rowKey, colKey)
    const picked = isChecked(rowKey, colKey)

    if (correct && picked)
        return "accent-teal-500"

    if (!correct && picked)
        return "accent-rose-600"

    if (correct && !picked)
        return "ring-2 ring-teal-500"

    return ""

}



/* --------------------------------------------------
EXPLANATION VISIBILITY
-------------------------------------------------- */

const shouldShowExplanation = ref(false)
const showRevealButton = ref(false)

watchEffect(() => {

    switch (testMode) {

        case "review":
            shouldShowExplanation.value = true
            showRevealButton.value = false
            break

        case "exam":
            shouldShowExplanation.value = false
            showRevealButton.value = false
            break

        case "tutor":

            shouldShowExplanation.value = false
            showRevealButton.value = true

            break

        default:
            shouldShowExplanation.value = false
            showRevealButton.value = false
    }

})



/* --------------------------------------------------
SOLUTION
-------------------------------------------------- */

const emitUp: any = inject('showSolution')

function revealAnswersAndExplanation() {

    shouldShowExplanation.value = true

    emitUp({
        flag: true,
        value: true
    })

    showRevealButton.value = false

}

onUnmounted(() => {

    if (!emitUp) return

    emitUp({
        flag: true,
        value: false
    })

})

</script>

<template>
    <div :class="[question.tabs && ['nclex', 'cat'].includes(examStore.storeName) ? 'grid gap-4 md:grid-cols-2' : '']">
        <!-- Question Prompt -->
        <div>
            <div v-if="question.intro" class="mb-2 font-bold" v-html="question.intro"></div>
            <TabRenderer v-if="question.tabs && ['nclex', 'cat'].includes(examStore.storeName)" :tabs="question.tabs" />
        </div>
        <div class="flex items-start gap-2">
            <img v-if="['nclex', 'cat'].includes(examStore.storeName)" :src="qn_arrow" class="h-8 shrink-0" />
            <div class="mb-2 font-base leading-relaxed" v-html="question.question"></div>
        </div>
        <!-- Draggable Choices -->
        <Draggable v-model="ordering" item-key="id" :disabled="testMode !== 'exam'" class="space-y-3">
            <template #item="{ element, index }">
                <div class="p-3 bg-white border rounded-xl shadow-sm flex items-center gap-3 transition-colors"
                    :class="getChoiceClass(element.id, index)">
                    <div
                        class="w-8 h-8 rounded-full bg-sky-100 text-sky-600 font-bold flex items-center justify-center">
                        {{ String.fromCharCode(65 + index) }}
                    </div>
                    <div class="flex-1 text-gray-800" v-html="element.choice" />
                </div>
            </template>
        </Draggable>
        <!-- Explanation (Review/Tutor Mode) -->
        <div v-if="showExplanation" class="mt-5 p-4 text-sm text-gray-600 border-t border-gray-200">
            <div class="font-semibold mb-2">Explanation:</div>
            <div v-html="question.solution"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VueDraggable as Draggable } from 'vue-draggable-plus'
import { ref, computed, watch, onUnmounted, createApp, onMounted } from 'vue'
import type { Question } from '../../types/question'
import TabRenderer from '../TabRenderer.vue'
import qn_arrow from '../../assets/images/qn_arrow.png'

const props = defineProps<{
    question: Question
    modelValue: string | string[]
    examStore: any
}>()

const { testMode, answers } = props.examStore


const correctOrder = Array.isArray(props.question.correct_answer)
    ? props.question.correct_answer
    : (props.question.correct_answer || '').split(',')


const ordering = ref(
    Object.entries(props.question.options).map(([id, obj]) => ({
        id,
        choice: (obj as { choice: string }).choice
    }))
)

watch(
    ordering,
    (newVal) => {
        if (testMode.value === 'exam') {
            answers[props.question.id] = newVal.map(o => o.id).join(',')
        }
    },
    { deep: true }
)

const userAnswer = computed(() => {
    const raw = answers[props.question.id]
    return raw ? raw.split(',') : []
})

const showExplanation = computed(() => {
    if (testMode.value === 'review') return true
    if (testMode.value === 'tutor') return !!userAnswer.value.length
    return false
})

// Feedback styling
const getChoiceClass = (id: string, index: number) => {
    if (testMode.value === 'exam') return ''

    const correctIndex = correctOrder.indexOf(id)
    const userIndex = userAnswer.value.indexOf(id)

    if (userIndex === -1) return 'bg-red-50 border-red-200'
    if (userIndex === correctIndex) return 'bg-green-50 border-green-200'
    return 'bg-yellow-50 border-yellow-200'
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

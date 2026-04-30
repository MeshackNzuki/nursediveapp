<template>
    <div :class="[question.tabs && ['nclex', 'cat'].includes(examStore.storeName) ? 'grid gap-4 md:grid-cols-2' : '']">

        <div>
            <div v-if="question.intro" class="mb-2 font-bold" v-html="question.intro"></div>
            <TabRenderer v-if="question.tabs && ['nclex', 'cat'].includes(examStore.storeName)" :tabs="question.tabs" />
        </div>

        <div class="rounded-xl bg-gray-50 p-4 md:p-6">
            <div class="flex items-start gap-2">
                <img v-if="['nclex', 'cat'].includes(examStore.storeName)" :src="qn_arrow" class="h-8 shrink-0" />
                <div class="mb-2 font-base leading-relaxed" v-html="question.question"></div>
            </div>

            <div class="mb-4">
                <h4 class="mb-2 text-sm font-semibold text-gray-700">Select priority finding</h4>
                <VueDraggable v-model="answerSlot.items" group="ddc" item-key="id" @add="onDrop"
                    :disabled="testMode === 'review'" :class="['slot-box min-h-[56px] bg-gray-100', slotStateClass]">
                    <div v-for="item in answerSlot.items" :key="item.id" :class="['drag-item', itemStateClass]">
                        {{ item.text }}
                    </div>
                    <template v-if="!answerSlot.items.length">
                        <span class="placeholder">Drop answer here</span>
                    </template>
                </VueDraggable>
            </div>

            <div class="mt-4 rounded-xl border border-gray-200 bg-white p-3">
                <VueDraggable v-model="optionPool" group="ddc" item-key="id" :disabled="testMode === 'review'"
                    class="pool-box min-h-[80px]">
                    <div v-for="item in optionPool" :key="item.id" class="pool-item">
                        {{ item.text }}
                    </div>
                </VueDraggable>
            </div>

            <div v-if="shouldShowExplanation" class="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                <div class="flex items-center gap-2">
                    <i :class="`pi ${feedbackIcon}`"></i>
                    <span :class="feedbackTextClass">{{ feedbackLabel }}</span>
                </div>
            </div>

            <div v-if="showRevealButton" class="mt-4 text-center">
                <button class="px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer"
                    :disabled="!answerSlot.items.length" :class="!answerSlot.items.length ? 'opacity-50 cursor-not-allowed' : ''"
                    @click="revealAnswersAndExplanation">
                    Submit
                </button>
            </div>

            <div v-if="shouldShowExplanation && question.solution" class="mt-4 p-3 rounded bg-teal-50 text-sm prose"
                v-html="question.solution"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, inject, onUnmounted } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import TabRenderer from '../TabRenderer.vue'
import type { Question } from '../../types/question'
import qn_arrow from '../../assets/images/qn_arrow.png'

type Item = {
    id: string
    text: string
    mark: string
    group: 'ddc'
}

type Slot = {
    correctId: string | null
    items: Item[]
}

type DDCAnswer = {
    answer: string | null
}

const props = defineProps<{
    question: Question
    modelValue: DDCAnswer | string | Record<string, unknown>
    examStore: any
}>()

const emit = defineEmits(['update:modelValue'])

const { testMode } = props.examStore
const emitUp: any = inject('showSolution', null)
const shouldShowExplanation = ref(false)
const showRevealButton = ref(false)

function parseJson<T>(value: unknown, fallback: T): T {
    if (value == null) return fallback
    if (typeof value !== 'string') return value as T

    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}

const optionPool = ref<Item[]>([])
const answerSlot = ref<Slot>({
    correctId: null,
    items: []
})

function initFromQuestion() {
    optionPool.value = []

    const opts = props.question.options || []
    optionPool.value = opts
        .filter((o: any) => o?.choice?.text && o?.choice?.markKey)
        .map((o: any) => ({
            id: o.choice.id || `opt-${o.choice.markKey}`,
            text: o.choice.text,
            mark: o.choice.markKey,
            group: 'ddc'
        }))

    const parsed = parseJson<any[]>(props.question.correct_answer, [])
    const correct = parsed?.[0]?.answer ?? null

    answerSlot.value = {
        correctId: correct ? `opt-${correct}` : null,
        items: []
    }
}

function parseModel() {
    if (!props.modelValue) return null
    if (typeof props.modelValue === 'string') return parseJson<Partial<DDCAnswer>>(props.modelValue, {})
    if (typeof props.modelValue === 'object') return props.modelValue as Partial<DDCAnswer>
    return null
}

function hydrateFromModel() {
    const model = parseModel()
    if (!model?.answer) return

    const id = `opt-${model.answer}`
    const found = optionPool.value.find(i => `opt-${i.mark}` === id)
    if (!found) return

    answerSlot.value.items = [found]
    optionPool.value = optionPool.value.filter(i => i.id !== found.id)
}

function onDrop() {
    answerSlot.value.items = answerSlot.value.items.slice(0, 1)
}

const answerPayload = computed<DDCAnswer>(() => ({
    answer: answerSlot.value.items[0]?.mark || null
}))

type SlotStatus = 'correct' | 'incorrect' | 'missed' | 'none'

const slotStatus = computed<SlotStatus>(() => {
    if (!shouldShowExplanation.value) return 'none'

    const selected = answerSlot.value.items[0]?.id || null
    if (!selected && answerSlot.value.correctId) return 'missed'
    if (!selected && !answerSlot.value.correctId) return 'none'
    if (selected === answerSlot.value.correctId) return 'correct'
    return 'incorrect'
})

const slotStateClass = computed(() => {
    if (slotStatus.value === 'correct') return 'border-emerald-500 bg-emerald-50'
    if (slotStatus.value === 'incorrect') return 'border-rose-500 bg-rose-50'
    if (slotStatus.value === 'missed') return 'border-amber-500 bg-amber-50'
    return ''
})

const itemStateClass = computed(() => {
    if (slotStatus.value === 'correct') return 'border-emerald-400 bg-emerald-100'
    if (slotStatus.value === 'incorrect') return 'border-rose-400 bg-rose-100'
    return ''
})

const feedbackLabel = computed(() => {
    if (slotStatus.value === 'correct') return 'Correct'
    if (slotStatus.value === 'incorrect') {
        const selected = answerSlot.value.items[0]?.mark || 'none'
        const correct = answerSlot.value.correctId?.replace('opt-', '') || 'none'
        return `Incorrect (selected "${selected}", correct is "${correct}")`
    }
    if (slotStatus.value === 'missed') {
        const correct = answerSlot.value.correctId?.replace('opt-', '') || 'none'
        return `Not answered (correct is "${correct}")`
    }
    return 'Not answered'
})

const feedbackIcon = computed(() => {
    if (slotStatus.value === 'correct') return 'pi-check-circle text-emerald-600'
    if (slotStatus.value === 'incorrect') return 'pi-times-circle text-rose-600'
    if (slotStatus.value === 'missed') return 'pi-exclamation-triangle text-amber-600'
    return 'pi-circle text-gray-400'
})

const feedbackTextClass = computed(() => {
    if (slotStatus.value === 'correct') return 'text-emerald-700 font-semibold'
    if (slotStatus.value === 'incorrect') return 'text-rose-700 font-semibold'
    if (slotStatus.value === 'missed') return 'text-amber-700 font-semibold'
    return 'text-gray-500'
})

function revealAnswersAndExplanation() {
    if (!answerSlot.value.items.length) return

    shouldShowExplanation.value = true
    showRevealButton.value = false

    if (emitUp) {
        emitUp({
            flag: true,
            value: true
        })
    }
}

watchEffect(() => {
    const questionId = props.question.id

    switch (testMode) {
        case 'review':
            shouldShowExplanation.value = true
            showRevealButton.value = false
            break
        case 'exam':
            shouldShowExplanation.value = false
            showRevealButton.value = false
            break
        case 'tutor':
            shouldShowExplanation.value = false
            showRevealButton.value = true
            break
        default:
            shouldShowExplanation.value = false
            showRevealButton.value = false
    }

    void questionId
})

watch(
    () => [props.question.id, props.question.options, props.question.correct_answer],
    () => {
        initFromQuestion()
        hydrateFromModel()
    },
    { immediate: true, deep: true }
)

watch(
    answerPayload,
    (val) => emit('update:modelValue', val),
    { deep: true }
)

onUnmounted(() => {
    if (!emitUp) return
    emitUp({
        flag: true,
        value: false
    })
})
</script>

<style scoped>
.pool-box {
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #f9fafb;
    padding: 8px;
}

.pool-item {
    display: inline-block;
    margin: 0 8px 8px 0;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid #9ca3af;
    background: #fef3c7;
    cursor: move;
}

.slot-box {
    border: 2px dashed #9ca3af;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    position: relative;
}

.drag-item {
    padding: 8px 12px;
    border-radius: 8px;
    background: #bfdbfe;
    border: 1px solid #60a5fa;
}

.placeholder {
    font-size: 12px;
    color: #6b7280;
}
</style>

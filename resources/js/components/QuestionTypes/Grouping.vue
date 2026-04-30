<template>
    <div>
        <div v-if="question.intro" class="mb-2 font-bold" v-html="question.intro"></div>
        <TabRenderer v-if="showInlineTabs" :tabs="question.tabs" />
        <div v-html="question.question" class="question-text" />

        <table class="grouping-table border border-gray-200 w-full mt-2">
            <thead class="bg-gray-100">
                <tr>
                    <th class="p-2 text-left" v-html="question.table_header || 'Option'"></th>
                    <th v-for="(label, key) in categories" :key="key" class="p-2 text-center">
                        {{ label }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(option, rowKey) in normalizedOptions" :key="rowKey" class="hover:bg-gray-50">
                    <td class="p-2">
                        <span class="font-semibold">{{ rowKey }}.</span>
                        <span v-html="optionLabel(option)"></span>
                    </td>
                    <td v-for="(_, colKey) in categories" :key="colKey" class="p-2 text-center">
                        <input type="radio" :name="String(rowKey)" :value="String(colKey)"
                            :checked="selected[String(rowKey)] === String(colKey)" :disabled="testMode === 'review'"
                            :class="radioClass(String(rowKey), String(colKey))"
                            @change="select(String(rowKey), String(colKey))" />
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="validationError" class="text-red-600 mt-2">
            {{ validationError }}
        </div>

        <div v-if="showRevealButton" class="mt-4 text-center">
            <button class="px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer" @click="submitAnswer">
                Submit
            </button>
        </div>

        <slot name="solution"></slot>
    </div>
</template>

<script setup lang="ts">
import { computed, createApp, inject, nextTick, onUnmounted, reactive, ref, toRaw, watch, watchEffect } from 'vue'
import TabRenderer from '../TabRenderer.vue'
import type { Question } from '../../types/question'

type GroupingSelection = Record<string, string | null>
type GroupingPayload = Record<string, { answers: string }>
type GenericRecord = Record<string, any>

const props = defineProps<{
    question: Question
    modelValue?: Record<string, any>
    examStore: any
}>()

const emit = defineEmits(['update:modelValue', 'submitted'])
const { testMode } = props.examStore

const parseJson = <T>(value: unknown, fallback: T): T => {
    if (value == null) return fallback
    if (typeof value !== 'string') return value as T

    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}

const correctAnswer = computed<GenericRecord>(() => {
    return parseJson<GenericRecord>(props.question.correct_answer, {})
})

const matchOptions = computed<GenericRecord>(() => {
    const candidate =
        (props.question as any)?.match_options ??
        props.question?.match_option ??
        {}

    return parseJson<GenericRecord>(candidate, {})
})

const categories = computed<Record<string, string>>(() => {
    const output: Record<string, string> = {}
    const optionKeys = Object.keys(matchOptions.value || {}).sort()

    optionKeys.forEach((colKey) => {
        const raw = matchOptions.value[colKey]
        if (typeof raw === 'string') {
            output[colKey] = raw
            return
        }

        output[colKey] = raw?.option || `Category ${colKey}`
    })

    if (Object.keys(output).length) return output

    const fallbackKeys = new Set<string>()

    Object.keys(correctAnswer.value || {}).forEach((rowKey) => {
        const row = correctAnswer.value?.[rowKey]
        const col = Array.isArray(row?.answers) ? row.answers[0] : row?.answers
        if (col != null) fallbackKeys.add(String(col))
    })

    Array.from(fallbackKeys)
        .sort()
        .forEach((key) => {
            output[key] = `Category ${key}`
        })

    return output
})

const normalizedOptions = computed<GenericRecord>(() => {
    const options = props.question?.options
    if (!options || typeof options !== 'object') return {}
    return options as GenericRecord
})

const rowKeys = computed(() => Object.keys(normalizedOptions.value))
const selected = reactive<GroupingSelection>({})
const tabApp = ref<ReturnType<typeof createApp> | null>(null)

const hasExhibitsAnchor = computed(
    () => typeof props.question?.question === 'string' && props.question.question.includes('id="exhibits"'),
)

const showInlineTabs = computed(
    () => Boolean(props.question?.tabs) && !hasExhibitsAnchor.value,
)

const optionLabel = (option: any) => {
    if (typeof option === 'string') return option
    if (typeof option?.choice === 'string') return option.choice
    return option?.choice?.choice || ''
}

const getCorrectCol = (rowKey: string): string | null => {
    const row = correctAnswer.value?.[rowKey]
    const value = Array.isArray(row?.answers) ? row.answers[0] : row?.answers
    if (value == null) return null
    return String(value)
}

const buildPayload = (): GroupingPayload => {
    const payload: GroupingPayload = {}

    rowKeys.value.forEach((rowKey) => {
        const col = selected[rowKey]
        if (!col) return
        payload[rowKey] = { answers: String(col) }
    })

    return payload
}

const hydrateFromModel = (model: unknown) => {
    if (!model || typeof model !== 'object') return

    rowKeys.value.forEach((rowKey) => {
        const rowValue: any = (model as GenericRecord)?.[rowKey]
        if (rowValue == null) return

        if (typeof rowValue === 'object' && rowValue !== null && 'answers' in rowValue) {
            const candidate = (rowValue as any).answers
            if (Array.isArray(candidate)) {
                selected[rowKey] = candidate.length ? String(candidate[0]) : null
                return
            }

            selected[rowKey] = candidate == null ? null : String(candidate)
            return
        }

        selected[rowKey] = String(rowValue)
    })
}

const resetSelection = () => {
    Object.keys(selected).forEach((key) => delete selected[key])
    rowKeys.value.forEach((key) => {
        selected[key] = null
    })

    hydrateFromModel(props.modelValue)
}

watch(
    () => [
        props.question?.id,
        props.question?.options,
        props.question?.correct_answer,
        props.question?.match_option,
        (props.question as any)?.match_options,
    ],
    resetSelection,
    { immediate: true, deep: true },
)

watch(
    () => props.modelValue,
    (newValue) => {
        if (!newValue) return
        hydrateFromModel(newValue)
    },
    { deep: true },
)

const unmountTabs = () => {
    if (!tabApp.value) return
    tabApp.value.unmount()
    tabApp.value = null
}

const mountTabsInExhibits = async () => {
    unmountTabs()

    if (!props.question?.tabs || !hasExhibitsAnchor.value) return

    await nextTick()
    const container = document.getElementById('exhibits')
    if (!container) return

    container.innerHTML = ''
    tabApp.value = createApp(TabRenderer, { tabs: props.question.tabs })
    tabApp.value.mount(container)
}

watch(
    () => [props.question?.id, props.question?.tabs, props.question?.question],
    () => {
        mountTabsInExhibits()
    },
    { immediate: true },
)

function select(rowKey: string, colKey: string) {
    validationError.value = ''
    selected[rowKey] = colKey
    emit('update:modelValue', buildPayload())
}

const validationError = ref('')
const shouldShowExplanation = ref(false)
const showRevealButton = ref(false)

function isCorrect(rowKey: string, colKey: string) {
    return getCorrectCol(rowKey) === colKey
}

function radioClass(rowKey: string, colKey: string) {
    if (!shouldShowExplanation.value) return ''

    const correct = isCorrect(rowKey, colKey)
    const picked = selected[rowKey] === colKey

    if (correct && picked) return 'accent-teal-500'
    if (!correct && picked) return 'accent-rose-600'
    if (correct && !picked) return 'ring-2 ring-teal-500'
    return ''
}

const emitUp: any = inject('showSolution')

function cloneSelected() {
    const raw = toRaw(buildPayload())

    try {
        // eslint-disable-next-line no-undef
        if (typeof structuredClone === 'function') return structuredClone(raw)
    } catch {
        // fall through
    }

    return JSON.parse(JSON.stringify(raw))
}

function submitAnswer() {
    const unanswered = rowKeys.value.filter((rowKey) => !selected[rowKey])
    if (unanswered.length) {
        validationError.value = 'Select one category for every row before submitting.'
        return
    }

    validationError.value = ''
    shouldShowExplanation.value = true
    showRevealButton.value = false

    if (emitUp) {
        emitUp({
            flag: true,
            value: true,
        })
    }

    emit('submitted', { answer: cloneSelected() })
}

watchEffect(() => {
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
})

onUnmounted(() => {
    unmountTabs()

    if (!emitUp) return

    emitUp({
        flag: true,
        value: false,
    })
})
</script>

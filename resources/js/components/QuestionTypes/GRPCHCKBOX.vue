<template>
    <div>
        <div v-if="question.intro" class="mb-2 font-bold" v-html="question.intro"></div>
        <TabRenderer v-if="showInlineTabs" :tabs="question.tabs" />
        <div v-html="question.question" class="question-text" />

        <table class="grouping-table border border-gray-200 w-full mt-2">
            <thead class="bg-gray-100">
                <tr>
                    <th class="p-2 text-left" v-html="question.table_header || 'Finding'"></th>
                    <th v-for="(label, colKey) in categories" :key="colKey" class="p-2 text-center">
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
                        <input type="checkbox" :checked="isChecked(String(rowKey), String(colKey))"
                            :disabled="testMode === 'review'" :class="checkboxClass(String(rowKey), String(colKey))"
                            @change="toggle(String(rowKey), String(colKey))" />
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

type GenericRecord = Record<string, any>
type CheckboxSelection = Record<string, string[]>
type CheckboxPayload = Record<string, { answers: string }>

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

const normalizeOptions = (value: unknown): GenericRecord =>
    value && typeof value === 'object' ? (value as GenericRecord) : {}

const splitAnswerValues = (answer: unknown): string[] => {
    if (answer == null) return []

    if (Array.isArray(answer)) {
        return answer
            .map((item) => String(item).trim())
            .filter(Boolean)
    }

    if (typeof answer === 'string') {
        return answer
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
    }

    return [String(answer)]
}

const correctAnswer = computed<GenericRecord>(() =>
    parseJson<GenericRecord>(props.question.correct_answer, {}),
)

const normalizedOptions = computed<GenericRecord>(() =>
    normalizeOptions(props.question.options),
)

const rowKeys = computed(() => Object.keys(normalizedOptions.value))
const tabApp = ref<ReturnType<typeof createApp> | null>(null)

const hasExhibitsAnchor = computed(
    () => typeof props.question?.question === 'string' && props.question.question.includes('id="exhibits"'),
)

const showInlineTabs = computed(
    () => Boolean(props.question?.tabs) && !hasExhibitsAnchor.value,
)

const matchOptions = computed<GenericRecord>(() => {
    const candidate =
        (props.question as any)?.match_options ??
        props.question?.match_option ??
        props.question?.mtx_option ??
        {}

    return parseJson<GenericRecord>(candidate, {})
})

const categories = computed<Record<string, string>>(() => {
    const output: Record<string, string> = {}

    Object.keys(matchOptions.value || {})
        .sort()
        .forEach((key) => {
            const raw = matchOptions.value[key]
            if (typeof raw === 'string') {
                output[key] = raw
                return
            }
            output[key] = raw?.option || key
        })

    if (Object.keys(output).length) return output

    const fallback = new Set<string>()
    Object.keys(correctAnswer.value || {}).forEach((rowKey) => {
        const rawAnswers = correctAnswer.value?.[rowKey]?.answers
        splitAnswerValues(rawAnswers).forEach((key) => fallback.add(key))
    })

    Array.from(fallback)
        .sort()
        .forEach((key) => {
            output[key] = key
        })

    return output
})

const selected = reactive<CheckboxSelection>({})

const optionLabel = (option: any) => {
    if (typeof option === 'string') return option
    if (typeof option?.choice === 'string') return option.choice
    return option?.choice?.choice || ''
}

const getCorrectColumns = (rowKey: string): string[] => {
    const row = correctAnswer.value?.[rowKey]
    return splitAnswerValues(row?.answers)
}

const buildPayload = (): CheckboxPayload => {
    const payload: CheckboxPayload = {}

    rowKeys.value.forEach((rowKey) => {
        const current = selected[rowKey] || []
        payload[rowKey] = {
            answers: current.slice().sort().join(','),
        }
    })

    return payload
}

const hydrateFromModel = (model: unknown) => {
    if (!model || typeof model !== 'object') return

    rowKeys.value.forEach((rowKey) => {
        const rowValue = (model as GenericRecord)?.[rowKey]
        if (rowValue == null) return

        if (typeof rowValue === 'object' && rowValue !== null && 'answers' in rowValue) {
            selected[rowKey] = splitAnswerValues((rowValue as any).answers)
            return
        }

        selected[rowKey] = splitAnswerValues(rowValue)
    })
}

const resetSelection = () => {
    Object.keys(selected).forEach((key) => delete selected[key])
    rowKeys.value.forEach((key) => {
        selected[key] = []
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
        props.question?.mtx_option,
    ],
    resetSelection,
    { immediate: true, deep: true },
)

watch(
    () => props.modelValue,
    (value) => {
        if (!value) return
        hydrateFromModel(value)
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

const validationError = ref('')

const emitModel = () => {
    emit('update:modelValue', buildPayload())
}

const isChecked = (rowKey: string, colKey: string) =>
    (selected[rowKey] || []).includes(colKey)

function toggle(rowKey: string, colKey: string) {
    validationError.value = ''
    const current = selected[rowKey] || []
    const idx = current.indexOf(colKey)

    if (idx > -1) {
        current.splice(idx, 1)
    } else {
        current.push(colKey)
    }

    selected[rowKey] = current.slice()
    emitModel()
}

const shouldShowExplanation = ref(false)
const showRevealButton = ref(false)

const isCorrect = (rowKey: string, colKey: string) =>
    getCorrectColumns(rowKey).includes(colKey)

const checkboxClass = (rowKey: string, colKey: string) => {
    if (!shouldShowExplanation.value) return ''

    const correct = isCorrect(rowKey, colKey)
    const picked = isChecked(rowKey, colKey)

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
    const unanswered = rowKeys.value.filter((rowKey) => !(selected[rowKey] || []).length)
    if (unanswered.length) {
        validationError.value = 'Select at least one category for every row before submitting.'
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

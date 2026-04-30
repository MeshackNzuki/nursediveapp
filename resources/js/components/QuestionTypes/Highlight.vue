<template>
    <div>
        <div v-if="question.intro" class="mb-2 font-bold" v-html="question.intro"></div>

        <div class="flex items-start gap-2">
            <img v-if="['nclex', 'cat'].includes(examStore.storeName)" :src="qn_arrow" class="h-8 shrink-0" />
            <div class="hl-content mb-2 font-base leading-relaxed" @click="handleQuestionClick"
                @keydown="handleQuestionKeydown" v-html="interactiveQuestionHtml"></div>
        </div>

        <div v-if="examMode === 'tutor' && !tutorSubmitted" class="mt-3 flex justify-end">
            <button type="button" class="rounded-full bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60
                " :disabled="selectedKeys.length === 0" @click="submitTutorHighlights">
                Submit Highlight
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Question } from '../../types/question'
import qn_arrow from '../../assets/images/qn_arrow.png'

const props = defineProps<{
    question: Question
    modelValue: string | string[]
    examStore: any
}>()

const emit = defineEmits(['update:modelValue'])

type HighlightOption = { key: string; text: string; textLower: string }

const examMode = computed(() => props.examStore.testMode)
const tutorSubmitted = ref(false)

const parseAnswerArray = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.map((item) => String(item))
    if (typeof value === 'string') {
        if (!value.trim()) return []
        try {
            const parsed = JSON.parse(value)
            return parseAnswerArray(parsed)
        } catch {
            return [value]
        }
    }
    if (value == null) return []
    return [String(value)]
}

const unique = (values: string[]) => Array.from(new Set(values))

const selectedKeysModel = computed<string[]>({
    get: () => unique(parseAnswerArray(props.modelValue)),
    set: (val) => emit('update:modelValue', unique(val))
})

const selectedKeys = computed(() => selectedKeysModel.value)
const correctAnswers = computed(() => unique(parseAnswerArray(props.question.correct_answer)))

const shouldShowExplanation = computed(() => {
    if (examMode.value === 'review') return true
    if (examMode.value === 'tutor') return tutorSubmitted.value
    return false
})

const highlightChoices = computed<HighlightOption[]>(() => {
    return Object.entries(props.question.options || {})
        .map(([key, option]: [string, any]) => {
            const text = String(option?.choice ?? '').trim()
            return { key, text, textLower: text.toLowerCase() }
        })
        .filter((choice) => !!choice.text)
        .sort((a, b) => b.text.length - a.text.length)
})

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

const tokenClass = (key: string) => {
    const isSelected = selectedKeys.value.includes(key)
    if (!shouldShowExplanation.value) {
        return isSelected ? 'hl-token-selected' : 'hl-token-idle'
    }

    const isCorrect = correctAnswers.value.includes(key)
    if (isCorrect && isSelected) return 'hl-token-correct'
    if (isCorrect && !isSelected) return 'hl-token-missed'
    if (!isCorrect && isSelected) return 'hl-token-wrong'
    return 'hl-token-idle'
}

const decorateTextNode = (text: string, matchedKeys: Set<string>) => {
    if (!text || !highlightChoices.value.length) {
        return { changed: false, html: escapeHtml(text || '') }
    }

    const lower = text.toLowerCase()
    let cursor = 0
    let changed = false
    let output = ''

    while (cursor < text.length) {
        let bestIndex = -1
        let bestOption: HighlightOption | null = null

        for (const option of highlightChoices.value) {
            const found = lower.indexOf(option.textLower, cursor)
            if (found === -1) continue
            if (
                bestOption === null ||
                found < bestIndex ||
                (found === bestIndex && option.text.length > bestOption.text.length)
            ) {
                bestIndex = found
                bestOption = option
            }
        }

        if (!bestOption || bestIndex === -1) {
            output += escapeHtml(text.slice(cursor))
            break
        }

        if (bestIndex > cursor) {
            output += escapeHtml(text.slice(cursor, bestIndex))
        }

        const matchText = text.slice(bestIndex, bestIndex + bestOption.text.length)
        matchedKeys.add(bestOption.key)
        output += `<span class="hl-token ${tokenClass(bestOption.key)}" role="button" tabindex="0" data-hl-key="${escapeHtml(bestOption.key)}" aria-pressed="${selectedKeys.value.includes(bestOption.key)}">${escapeHtml(matchText)}</span>`
        cursor = bestIndex + bestOption.text.length
        changed = true
    }

    return { changed, html: output || escapeHtml(text) }
}

const cleanQuestionDom = (holder: HTMLDivElement) => {
    holder.querySelectorAll('#exhibits').forEach((node) => node.remove())

    const nodes = holder.querySelectorAll('p,div,span,strong')
    nodes.forEach((node) => {
        const text = (node.textContent || '').trim().toLowerCase()
        if (text === 'exhibits') {
            node.remove()
        }
    })
}

const renderData = computed(() => {
    const raw = String(props.question.question || '')
    if (!raw) return { html: '', matchedKeys: [] as string[] }
    if (typeof document === 'undefined') return { html: raw, matchedKeys: [] as string[] }

    const holder = document.createElement('div')
    holder.innerHTML = raw
    cleanQuestionDom(holder)

    const matchedKeys = new Set<string>()
    const walker = document.createTreeWalker(holder, NodeFilter.SHOW_TEXT)
    const textNodes: Text[] = []
    let node: Node | null

    while ((node = walker.nextNode())) {
        textNodes.push(node as Text)
    }

    for (const textNode of textNodes) {
        const originalText = textNode.nodeValue || ''
        if (!originalText.trim()) continue
        const decorated = decorateTextNode(originalText, matchedKeys)
        if (!decorated.changed) continue
        const wrapper = document.createElement('span')
        wrapper.innerHTML = decorated.html
        textNode.parentNode?.replaceChild(wrapper, textNode)
    }

    return { html: holder.innerHTML, matchedKeys: Array.from(matchedKeys) }
})

const interactiveQuestionHtml = computed(() => renderData.value.html)

const toggleSelection = (key: string) => {
    if (examMode.value === 'review') return
    if (examMode.value === 'tutor' && tutorSubmitted.value) return
    const selected = [...selectedKeysModel.value]
    const index = selected.indexOf(key)
    if (index === -1) selected.push(key)
    else selected.splice(index, 1)
    selectedKeysModel.value = selected
}

const submitTutorHighlights = () => {
    if (examMode.value !== 'tutor') return
    if (selectedKeys.value.length === 0) return
    tutorSubmitted.value = true
}

const handleQuestionClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null
    const token = target?.closest('[data-hl-key]') as HTMLElement | null
    const key = token?.dataset.hlKey
    if (!key) return
    toggleSelection(key)
}

const handleQuestionKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const target = event.target as HTMLElement | null
    const token = target?.closest('[data-hl-key]') as HTMLElement | null
    const key = token?.dataset.hlKey
    if (!key) return
    event.preventDefault()
    toggleSelection(key)
}

watch(
    () => [props.question?.id, examMode.value],
    () => {
        tutorSubmitted.value = false
    },
    { immediate: true },
)
</script>

<style scoped>
.hl-content :deep(.hl-token) {
    border-radius: 0.45rem;
    cursor: pointer;
    padding: 0.05rem 0.24rem;
    transition: all 0.15s ease;
}

.hl-content :deep(.hl-token:hover) {
    background: #fef08a;
    box-shadow: inset 0 0 0 1px rgba(217, 119, 6, 0.22);
}

.hl-content :deep(.hl-token-idle) {
    background: #fefce8;
    box-shadow: inset 0 0 0 1px rgba(217, 119, 6, 0.12);
}

.hl-content :deep(.hl-token-selected) {
    background: #fde68a;
    box-shadow: inset 0 0 0 1px rgba(217, 119, 6, 0.4);
}

.hl-content :deep(.hl-token-correct) {
    background: rgba(16, 185, 129, 0.24);
    box-shadow: inset 0 0 0 1px rgba(5, 150, 105, 0.55);
}

.hl-content :deep(.hl-token-correct::after) {
    content: ' \2713';
    color: #059669;
    font-weight: 700;
}

.hl-content :deep(.hl-token-missed) {
    background: rgba(16, 185, 129, 0.12);
    box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.35);
}

.hl-content :deep(.hl-token-wrong) {
    background: rgba(244, 63, 94, 0.22);
    box-shadow: inset 0 0 0 1px rgba(225, 29, 72, 0.5);
}

.hl-content :deep(.hl-token-wrong::after) {
    content: ' \2715';
    color: #e11d48;
    font-weight: 700;
}

.dark .hl-content :deep(.hl-token:hover) {
    background: rgba(251, 191, 36, 0.22);
}

.dark .hl-content :deep(.hl-token-selected) {
    background: rgba(245, 158, 11, 0.45);
    box-shadow: inset 0 0 0 1px rgba(251, 191, 36, 0.45);
}

.dark .hl-content :deep(.hl-token-correct) {
    background: rgba(16, 185, 129, 0.34);
}

.dark .hl-content :deep(.hl-token-missed) {
    background: rgba(16, 185, 129, 0.2);
}

.dark .hl-content :deep(.hl-token-wrong) {
    background: rgba(244, 63, 94, 0.34);
}
</style>

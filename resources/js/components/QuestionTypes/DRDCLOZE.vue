<template>

    <div :class="[question.tabs && ['nclex', 'cat'].includes(examStore.storeName) ? 'grid gap-4 md:grid-cols-2' : '']">

        <!-- LEFT PANEL -->

        <div>

            <div v-if="question.intro" class="mb-2 font-bold" v-html="question.intro">
            </div>

            <TabRenderer v-if="question.tabs && ['nclex', 'cat'].includes(examStore.storeName)" :tabs="question.tabs" />

        </div>


        <!-- RIGHT PANEL -->

        <div class="rounded-xl bg-gray-50 p-4 md:p-6">



            <div class="flex items-start gap-2">
                <img v-if="['nclex', 'cat'].includes(examStore.storeName)" :src="qn_arrow" class="h-8 shrink-0" />
                <div ref="questionContainer" class="prose max-w-none text-base" v-html="question.question">
                </div>
            </div>

            <div v-if="shouldShowExplanation" class="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                <h5 class="font-semibold text-slate-700 mb-2">Feedback</h5>
                <div class="space-y-1">
                    <div v-for="row in feedbackRows" :key="row.id" class="flex items-center gap-2">
                        <i :class="`pi ${feedbackIcon(row.status)}`"></i>
                        <span :class="feedbackTextClass(row.status)">{{ row.label }}</span>
                    </div>
                </div>
            </div>

            <!-- ACTION BUTTON -->

            <div v-if="showRevealButton" class="mt-4 text-center">

                <button class="px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer"
                    :disabled="!canSubmit" @click="revealSolution">
                    Submit
                </button>

                <div v-if="!canSubmit" class="mt-2 text-xs text-gray-500">
                    Complete all blanks to submit.
                </div>

            </div>


            <!-- SOLUTION -->

            <slot name="solution"></slot>


            <!-- DEBUG -->

            <!-- <div v-if="testMode === 'tutor'" class="mt-4 text-center text-xs text-gray-500">

                {{ answerPayload }}

            </div> -->

        </div>

    </div>

</template>



<script setup lang="ts">

import { ref, watch, nextTick, computed, inject, watchEffect, onUnmounted } from 'vue'
import TabRenderer from '../TabRenderer.vue'
import type { Question } from '../../types/question'
import qn_arrow from '../../assets/images/qn_arrow.png'

type ClozeAnswer = Record<string, string | null>
type ClozeStatus = 'correct' | 'incorrect' | 'missed' | 'none'

const props = defineProps<{
    question: Question
    modelValue: ClozeAnswer | string | Record<string, unknown>
    examStore: any
}>()

const emit = defineEmits(['update:modelValue'])

const { testMode } = props.examStore



/* -----------------------------------------------------
STATE
----------------------------------------------------- */

const questionContainer = ref<HTMLElement | null>(null)

const answers = ref<ClozeAnswer>({})
const hasRevealed = ref(false)



/* -----------------------------------------------------
JSON HELPERS
----------------------------------------------------- */

function parseJson<T>(value: unknown, fallback: T): T {

    if (value == null) return fallback

    if (typeof value !== 'string') return value as T

    try {
        return JSON.parse(value) as T
    }
    catch {
        return fallback
    }

}



/* -----------------------------------------------------
INITIALIZE ANSWERS
----------------------------------------------------- */

function initAnswers() {

    answers.value = {}

    props.question.options?.forEach((opt: any) => {

        answers.value[opt.choice.id] = null

    })

}

const blankOrder = computed(() =>
    (props.question.options || []).map((opt: any) => String(opt?.choice?.id || '')).filter(Boolean)
)

function stripHtml(value: string) {
    return value.replace(/<[^>]*>/g, '').trim()
}

function parseCorrectAnswersMap(): Record<string, string> {
    const result: Record<string, string> = {}
    const raw = props.question.correct_answer
    const parsed = parseJson<any>(raw, raw as any)

    if (Array.isArray(parsed)) {
        parsed.forEach((entry, index) => {
            if (entry && typeof entry === 'object') {
                const id = String(entry.id ?? entry.choice_id ?? blankOrder.value[index] ?? '')
                const answer = String(entry.answer ?? entry.value ?? '').trim()
                if (id && answer) result[id] = answer
                return
            }

            const id = blankOrder.value[index]
            const answer = String(entry ?? '').trim()
            if (id && answer) result[id] = answer
        })

        return result
    }

    if (parsed && typeof parsed === 'object') {
        Object.entries(parsed).forEach(([key, value]) => {
            if (value && typeof value === 'object') {
                const id = String((value as any).id ?? key ?? '')
                const answer = String((value as any).answer ?? (value as any).value ?? '').trim()
                if (id && answer) result[id] = answer
                return
            }

            const answer = String(value ?? '').trim()
            if (key && answer) result[String(key)] = answer
        })

        return result
    }

    return result
}

const correctAnswersMap = computed(() => parseCorrectAnswersMap())

function optionText(blankId: string, value: string | null | undefined) {
    if (!value) return 'none'
    const slot = (props.question.options || []).find((opt: any) => String(opt?.choice?.id) === blankId)
    const text = slot?.choice?.options?.[value]
    if (!text) return value
    return stripHtml(String(text)) || value
}

function statusForBlank(blankId: string): ClozeStatus {
    const selected = answers.value[blankId]
    const correct = correctAnswersMap.value[blankId]

    if (!selected && correct) return 'missed'
    if (!selected && !correct) return 'none'
    if (selected === correct) return 'correct'
    return 'incorrect'
}

const shouldShowExplanation = computed(() => {
    if (testMode === 'review') return true
    if (testMode === 'tutor') return hasRevealed.value
    return false
})

const feedbackRows = computed(() =>
    blankOrder.value.map((id, index) => {
        const status = statusForBlank(id)
        const selected = optionText(id, answers.value[id])
        const correct = optionText(id, correctAnswersMap.value[id])

        let label = `Blank ${index + 1}: Not answered`
        if (status === 'correct') {
            label = `Blank ${index + 1}: Correct`
        } else if (status === 'incorrect') {
            label = `Blank ${index + 1}: Incorrect (selected "${selected}", correct is "${correct}")`
        } else if (status === 'missed') {
            label = `Blank ${index + 1}: Not answered (correct is "${correct}")`
        }

        return { id, status, label }
    })
)



/* -----------------------------------------------------
HYDRATE FROM SAVED MODEL
----------------------------------------------------- */

function hydrateFromModel() {

    if (!props.modelValue) return

    let model: any = props.modelValue

    if (typeof model === 'string')
        model = parseJson(model, {})

    Object.keys(model || {}).forEach(k => {

        if (k in answers.value)
            answers.value[k] = model[k]

    })

}



/* -----------------------------------------------------
RENDER DROPDOWNS INTO HTML
----------------------------------------------------- */

async function mountDropdowns() {

    await nextTick()

    if (!questionContainer.value) return

    const container = questionContainer.value

    props.question.options?.forEach((opt: any) => {

        const id = opt.choice.id

        const el = container.querySelector(`#${id}`)

        if (!el) return

        const select = document.createElement('select')

        select.className =
            'inline-block border border-gray-300 p-1 rounded mx-1 text-sm align-middle'

        select.disabled = testMode === 'review' || (testMode === 'tutor' && hasRevealed.value)

        const placeholder = document.createElement('option')
        placeholder.value = ''
        placeholder.textContent = '-- Select --'
        placeholder.disabled = true
        placeholder.selected = !answers.value[id]

        select.appendChild(placeholder)

        Object.entries(opt.choice.options).forEach(([key, text]) => {

            const option = document.createElement('option')
            option.value = key
            option.textContent = text as string

            if (answers.value[id] === key)
                option.selected = true

            select.appendChild(option)

        })

        select.addEventListener('change', (e: any) => {

            answers.value[id] = e.target.value
            setDropdownVisualState()

        })

        el.replaceWith(select)

    })

}

function setDropdownDisabledState() {

    if (!questionContainer.value) return

    const disabled = testMode === 'review' || (testMode === 'tutor' && hasRevealed.value)

    questionContainer.value
        .querySelectorAll('select')
        .forEach((el) => {
            (el as HTMLSelectElement).disabled = disabled
        })

}

function setDropdownVisualState() {

    if (!questionContainer.value) return

    questionContainer.value.querySelectorAll('select').forEach((node) => {
        const select = node as HTMLSelectElement
        const id = select.name
        const status = statusForBlank(id)
        const correct = correctAnswersMap.value[id]
        const selected = answers.value[id]

        const baseClass = 'inline-block border p-1 rounded mx-1 text-sm align-middle'

        // Force visual state on the closed select box even when disabled.
        select.style.opacity = '1'
        select.style.fontWeight = '500'
        select.style.color = '#111827'
        select.style.backgroundColor = '#ffffff'
        select.style.borderColor = '#d1d5db'
        ; (select.style as any).webkitTextFillColor = '#111827'

        // Reset per-option styling first, then apply feedback coloring.
        Array.from(select.options).forEach((opt, index) => {
            const option = opt as HTMLOptionElement
            option.style.fontWeight = '400'
            option.style.color = '#111827'
            option.style.backgroundColor = '#ffffff'

            if (index === 0) {
                option.style.color = '#6b7280'
            }

            if (!shouldShowExplanation.value) return
            if (!option.value) return

            if (correct && option.value === correct) {
                option.style.color = '#047857'
                option.style.backgroundColor = '#ecfdf5'
                option.style.fontWeight = '600'
            }

            if (selected && option.value === selected && selected !== correct) {
                option.style.color = '#be123c'
                option.style.backgroundColor = '#fff1f2'
                option.style.fontWeight = '600'
            }
        })

        if (!shouldShowExplanation.value) {
            select.className = `${baseClass} border-gray-300`
            return
        }

        if (status === 'correct') {
            select.className = `${baseClass} border-emerald-500 bg-emerald-50 text-emerald-800`
            select.style.color = '#047857'
            select.style.backgroundColor = '#ecfdf5'
            select.style.borderColor = '#10b981'
            ; (select.style as any).webkitTextFillColor = '#047857'
            return
        }

        if (status === 'incorrect') {
            select.className = `${baseClass} border-rose-500 bg-rose-50 text-rose-800`
            select.style.color = '#be123c'
            select.style.backgroundColor = '#fff1f2'
            select.style.borderColor = '#f43f5e'
            ; (select.style as any).webkitTextFillColor = '#be123c'
            return
        }

        if (status === 'missed') {
            select.className = `${baseClass} border-amber-500 bg-amber-50 text-amber-800`
            select.style.color = '#b45309'
            select.style.backgroundColor = '#fffbeb'
            select.style.borderColor = '#f59e0b'
            ; (select.style as any).webkitTextFillColor = '#b45309'
            return
        }

        select.className = `${baseClass} border-gray-300`
    })
}



/* -----------------------------------------------------
ANSWER PAYLOAD
----------------------------------------------------- */

const answerPayload = computed(() => answers.value)



/* -----------------------------------------------------
SOLUTION LOGIC
----------------------------------------------------- */

const canSubmit = computed(() => {
    const vals = Object.values(answers.value || {})
    if (!vals.length) return false
    return vals.every(v => !!v)
})

const showRevealButton = computed(() => {
    return testMode === 'tutor' && !hasRevealed.value
})

const emitUp: any = inject('showSolution', null)

function revealSolution() {

    if (!canSubmit.value) return

    hasRevealed.value = true
    setDropdownDisabledState()
    setDropdownVisualState()

    if (!emitUp) return

    emitUp({
        flag: true,
        value: true
    })

}



/* -----------------------------------------------------
WATCHERS
----------------------------------------------------- */

watch(
    () => [props.question.id, props.question.options],
    async () => {
        hasRevealed.value = false
        initAnswers()
        hydrateFromModel()
        await mountDropdowns()
        setDropdownDisabledState()
        setDropdownVisualState()
    },
    { immediate: true, deep: true }
)

watch(
    answers,
    (val) => emit('update:modelValue', val),
    { deep: true }
)

watchEffect(() => {
    if (testMode !== 'tutor') hasRevealed.value = false
    setDropdownDisabledState()
    setDropdownVisualState()
})

watch(
    () => [answers.value, shouldShowExplanation.value],
    () => setDropdownVisualState(),
    { deep: true }
)

function feedbackIcon(status: ClozeStatus) {
    if (status === 'correct') return 'pi-check-circle text-emerald-600'
    if (status === 'incorrect') return 'pi-times-circle text-rose-600'
    if (status === 'missed') return 'pi-exclamation-triangle text-amber-600'
    return 'pi-circle text-gray-400'
}

function feedbackTextClass(status: ClozeStatus) {
    if (status === 'correct') return 'text-emerald-700 font-semibold'
    if (status === 'incorrect') return 'text-rose-700 font-semibold'
    if (status === 'missed') return 'text-amber-700 font-semibold'
    return 'text-gray-500'
}

onUnmounted(() => {
    if (!emitUp) return
    emitUp({
        flag: true,
        value: false
    })
})

</script>



<style scoped>
select {
    min-width: 140px;
    max-width: 240px;
    background: white;
    cursor: pointer;
}

select:disabled {
    opacity: 1;
    color: inherit;
    -webkit-text-fill-color: currentColor;
}
</style>

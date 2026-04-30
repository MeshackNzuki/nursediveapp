<template>
  <div :class="[question.tabs && ['nclex', 'cat'].includes(examStore.storeName) ? 'grid gap-4 md:grid-cols-2' : '']">
    <div>
      <div v-if="question.intro" class="mb-2 font-bold" v-html="question.intro"></div>
      <TabRenderer v-if="question.tabs && ['nclex', 'cat'].includes(examStore.storeName)" :tabs="question.tabs" />
    </div>
    <div>

      <div class="flex items-start gap-2">
        <img v-if="['nclex', 'cat'].includes(examStore.storeName)" :src="qn_arrow" class="h-8 shrink-0" />
        <div ref="questionContainer" class="prose max-w-none text-base" v-html="question.question">
        </div>
      </div>

      <div v-if="shouldShowExplanation" class="mt-3 space-y-2 text-sm">
        <div v-for="groupId in optionGroupIds" :key="`fb-${groupId}`" class="flex items-center gap-2">
          <i :class="`pi ${feedbackIcon(groupId)}`"></i>
          <span :class="feedbackTextClass(groupId)">
            {{ feedbackLabel(groupId) }}
          </span>
        </div>
      </div>

      <div v-if="showRevealButton" class="mt-4 p-4 text-center">
        <button class="px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer"
          :disabled="!allInputsFilled" :class="!allInputsFilled ? 'opacity-50 cursor-not-allowed' : ''"
          @click="revealAnswersAndExplanation">
          Submit
        </button>
      </div>

      <!-- Optional solution -->
      <slot name="solution"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, createApp, onUnmounted, watchEffect, inject } from 'vue'
import TabRenderer from '../TabRenderer.vue'
import type { Question } from '../../types/question'
import qn_arrow from '../../assets/images/qn_arrow.png'

const props = defineProps<{
  question: Question
  modelValue: Record<string, string>
  examStore: any
}>()

const { testMode } = props.examStore
const emit = defineEmits(['update:modelValue'])
const emitUp: any = inject('showSolution', null)
const shouldShowExplanation = ref(false)
const showRevealButton = ref(false)

const localValue = computed({
  get: () => props.modelValue || {},
  set: (val) => emit('update:modelValue', val)
})

/*
|--------------------------------------------------------------------------
| Correct Answers Parser
|--------------------------------------------------------------------------
*/
const correctAnswers = computed<Record<string, string>>(() => {
  const val = props.question.correct_answer

  if (!val) return {}

  if (typeof val === 'object') return val

  if (typeof val === 'string') {
    try {
      return JSON.parse(val)
    } catch {
      return {}
    }
  }

  return {}
})

/*
|--------------------------------------------------------------------------
| Completion Check
|--------------------------------------------------------------------------
*/
const allInputsFilled = computed(() => {
  const options = props.question.options || {}
  return Object.keys(options).every(
    (groupId) => !!localValue.value[groupId]
  )
})

const optionGroupIds = computed(() => Object.keys(props.question.options || {}))

const isCorrectAnswer = (groupId: string) =>
  correctAnswers.value[groupId] === localValue.value[groupId]

const isUserSelectedWrong = (groupId: string) =>
  !!localValue.value[groupId] && correctAnswers.value[groupId] !== localValue.value[groupId]

const isMissedCorrect = (groupId: string) =>
  !localValue.value[groupId] && !!correctAnswers.value[groupId]

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, '').trim()

const optionLabel = (groupId: string, key?: string) => {
  if (!key) return 'none'
  const groupOptions = props.question.options?.[groupId] as Record<string, string> | undefined
  const raw = groupOptions?.[key]
  if (!raw) return key
  return stripHtml(String(raw)) || key
}

const feedbackLabel = (groupId: string) => {
  const selected = localValue.value[groupId]
  const correct = correctAnswers.value[groupId]
  const selectedText = optionLabel(groupId, selected)
  const correctText = optionLabel(groupId, correct)

  if (isCorrectAnswer(groupId)) {
    return `${groupId}: Correct`
  }

  if (isUserSelectedWrong(groupId)) {
    return `${groupId}: Incorrect (selected "${selectedText}", correct is "${correctText}")`
  }

  if (isMissedCorrect(groupId)) {
    return `${groupId}: Not answered (correct is "${correctText}")`
  }

  return `${groupId}: No answer`
}

const feedbackIcon = (groupId: string) => {
  if (isCorrectAnswer(groupId)) return 'pi-check-circle text-teal-600'
  if (isUserSelectedWrong(groupId)) return 'pi-times-circle text-rose-600'
  if (isMissedCorrect(groupId)) return 'pi-exclamation-triangle text-amber-600'
  return 'pi-circle text-gray-400'
}

const feedbackTextClass = (groupId: string) => {
  if (isCorrectAnswer(groupId)) return 'text-teal-700 font-semibold'
  if (isUserSelectedWrong(groupId)) return 'text-rose-700 font-semibold'
  if (isMissedCorrect(groupId)) return 'text-amber-700 font-semibold'
  return 'text-gray-500'
}

/*
|--------------------------------------------------------------------------
| DOM Rendering
|--------------------------------------------------------------------------
*/
const questionContainer = ref<HTMLElement | null>(null)

/*
|--------------------------------------------------------------------------
| Mount Dropdowns
|--------------------------------------------------------------------------
*/
function mountDropdowns() {

  const container = questionContainer.value
  if (!container) return

  const options = props.question.options || {}

  Object.entries(options).forEach(([groupId, groupOptions]) => {

    let el = container.querySelector(`#${groupId}`) as HTMLElement | null
    if (!el) return

    let select: HTMLSelectElement

    // CASE 1: Placeholder already a SELECT (NCLEX)
    if (el.tagName === 'SELECT') {
      select = el as HTMLSelectElement
      select.innerHTML = ''
    }

    // CASE 2: Placeholder is DIV/SPAN (Nursing style)
    else {
      el.innerHTML = ''
      select = document.createElement('select')
      el.appendChild(select)
    }

    select.name = groupId
    select.disabled = testMode === 'review'

    select.className =
      `inline-block border p-1 rounded mx-1 text-sm align-middle transition-opacity duration-300 ease-in opacity-0 ${selectStateClass(groupId)}`

    select.style.minWidth = '6rem'
    select.style.maxWidth = '220px'

    requestAnimationFrame(() => {
      select.style.opacity = '1'
    })

    const defaultOption = new Option('-- Select --', '')
    defaultOption.disabled = true
    defaultOption.selected = !localValue.value[groupId]
    select.appendChild(defaultOption)

    Object.entries(groupOptions as Record<string, string>).forEach(([key, label]) => {

      if (!label) return

      const opt = new Option(
        label,
        key,
        false,
        localValue.value[groupId] === key
      )

      select.appendChild(opt)

    })

    select.addEventListener('change', (e) => {

      const target = e.target as HTMLSelectElement

      emit('update:modelValue', {
        ...localValue.value,
        [groupId]: target.value
      })

    })

  })
}

function selectStateClass(groupId: string): string {
  if (!shouldShowExplanation.value) return 'border-gray-300'
  if (isCorrectAnswer(groupId)) return 'border-teal-500 bg-teal-50 text-teal-800'
  if (isUserSelectedWrong(groupId)) return 'border-rose-500 bg-rose-50 text-rose-800'
  if (isMissedCorrect(groupId)) return 'border-amber-500 bg-amber-50 text-amber-800'
  return 'border-gray-300'
}

function revealAnswersAndExplanation() {
  if (!allInputsFilled.value) return

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

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => nextTick(mountDropdowns))

watch(
  () => [props.question, props.modelValue, testMode, shouldShowExplanation.value],
  () => nextTick(mountDropdowns),
  { deep: true }
)

/*
|--------------------------------------------------------------------------
| Exhibits Tab Mount
|--------------------------------------------------------------------------
*/

const tabApp = ref<ReturnType<typeof createApp> | null>(null)

onMounted(() => {

  const container = document.getElementById('exhibits')
  if (!container) return

  container.innerHTML = ''

  tabApp.value = createApp(TabRenderer, {
    tabs: props.question.tabs
  })

  tabApp.value.mount(container)
})

onUnmounted(() => {

  if (emitUp) {
    emitUp({
      flag: true,
      value: false
    })
  }

  if (tabApp.value) {
    tabApp.value.unmount()
    tabApp.value = null
  }

})
</script>

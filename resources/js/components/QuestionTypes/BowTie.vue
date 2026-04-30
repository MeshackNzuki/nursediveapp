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

            <div class="bowtie-board">
                <svg class="bowtie-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                        <marker id="bowtieDot" markerWidth="4" markerHeight="4" refX="2" refY="2">
                            <circle cx="2" cy="2" r="1.6" fill="#94a3b8" />
                        </marker>
                    </defs>
                    <path d="M 22 28 C 35 28, 42 40, 50 50" />
                    <path d="M 22 72 C 35 72, 42 60, 50 50" />
                    <path d="M 50 50 C 58 40, 65 28, 78 28" />
                    <path d="M 50 50 C 58 60, 65 72, 78 72" />
                    <circle cx="50" cy="50" r="1.8" class="center-dot" />
                    <circle cx="22" cy="28" r="1.4" class="edge-dot" />
                    <circle cx="22" cy="72" r="1.4" class="edge-dot" />
                    <circle cx="78" cy="28" r="1.4" class="edge-dot" />
                    <circle cx="78" cy="72" r="1.4" class="edge-dot" />
                </svg>

                <div class="bowtie-layout flex justify-between items-center">
                    <div class="bow-column">
                        <h4 class="slot-title">{{ labels.actions }}</h4>
                        <div class="slot-stack">
                            <div v-for="(slot, i) in actionSlots" :key="'a-' + i" class="slot-wrap">
                                <VueDraggable v-model="slot.items" group="bow-action" item-key="id"
                                    @add="onDropAction(i)" :disabled="testMode === 'review'"
                                    :class="['slot-box action-slot', slotStateClass('action', i)]">
                                    <div v-for="item in slot.items" :key="item.id"
                                        :class="['drag-item', itemStateClass('action', i)]">{{ item.text }}
                                    </div>
                                </VueDraggable>
                            </div>
                        </div>
                    </div>

                    <div class="bow-column center-column">
                        <h4 class="slot-title">{{ labels.potential }}</h4>
                        <VueDraggable v-model="conditionSlot.items" group="bow-potential" item-key="id"
                            @add="onDropPotential" :disabled="testMode === 'review'"
                            :class="['hazard-box min-w-[150px]', slotStateClass('potential', 0)]">
                            <div v-for="item in conditionSlot.items" :key="item.id"
                                :class="['drag-item', itemStateClass('potential', 0)]">{{ item.text }}
                            </div>
                        </VueDraggable>
                    </div>

                    <div class="bow-column">
                        <h4 class="slot-title">{{ labels.parameters }}</h4>
                        <div class="slot-stack">
                            <div v-for="(slot, i) in parameterSlots" :key="'p-' + i" class="slot-wrap">
                                <VueDraggable v-model="slot.items" group="bow-parameter" item-key="id"
                                    @add="onDropParameter(i)" :disabled="testMode === 'review'"
                                    :class="['slot-box parameter-slot', slotStateClass('parameter', i)]">
                                    <div v-for="item in slot.items" :key="item.id"
                                        :class="['drag-item', itemStateClass('parameter', i)]">{{ item.text }}
                                    </div>
                                </VueDraggable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-5 grid gap-4 md:grid-cols-3">
                <section class="pool-panel">
                    <h5 class="pool-title">{{ labels.actions }}</h5>
                    <VueDraggable v-model="actionPool" group="bow-action" item-key="id" :disabled="testMode === 'review'"
                        class="pool-box min-h-[84px]">
                        <div v-for="item in actionPool" :key="item.id" class="pool-item">{{ item.text }}</div>
                    </VueDraggable>
                </section>

                <section class="pool-panel">
                    <h5 class="pool-title">{{ labels.potential }}</h5>
                    <VueDraggable v-model="potentialPool" group="bow-potential" item-key="id"
                        :disabled="testMode === 'review'"
                        class="pool-box min-h-[84px]">
                        <div v-for="item in potentialPool" :key="item.id" class="pool-item">{{ item.text }}</div>
                    </VueDraggable>
                </section>

                <section class="pool-panel">
                    <h5 class="pool-title">{{ labels.parameters }}</h5>
                    <VueDraggable v-model="parameterPool" group="bow-parameter" item-key="id"
                        :disabled="testMode === 'review'"
                        class="pool-box min-h-[84px]">
                        <div v-for="item in parameterPool" :key="item.id" class="pool-item">{{ item.text }}</div>
                    </VueDraggable>
                </section>
            </div>

            <div v-if="shouldShowExplanation" class="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                <h5 class="font-semibold text-slate-700 mb-2">Feedback</h5>
                <div class="space-y-1">
                    <div v-for="entry in feedbackRows" :key="entry.key" class="flex items-center gap-2">
                        <i :class="`pi ${feedbackIcon(entry.status)}`"></i>
                        <span :class="feedbackTextClass(entry.status)">{{ entry.label }}</span>
                    </div>
                </div>
            </div>

            <div v-if="showRevealButton" class="mt-4 p-4 text-center">
                <button class="px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer"
                    @click="revealAnswersAndExplanation">
                    Submit
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect, inject, onUnmounted } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import TabRenderer from '../TabRenderer.vue'
import type { Question } from '../../types/question'
import qn_arrow from '../../assets/images/qn_arrow.png'

type Group = 'action' | 'potential' | 'parameter'
type Item = { id: string; text: string; mark: string; group: Group }
type Slot = { correctId: string | null; items: Item[] }
type BowTieAnswer = {
    actionsAnswers: Array<string | null>
    potentialAnswers: Array<string | null>
    paramerAnswers: Array<string | null>
}

const props = defineProps<{
    question: Question
    modelValue: BowTieAnswer | string | Record<string, unknown>
    examStore: any
}>()

const emit = defineEmits(['update:modelValue'])

const { testMode } = props.examStore
const emitUp: any = inject('showSolution', null)
const shouldShowExplanation = ref(false)
const showRevealButton = ref(false)

const actionPool = ref<Item[]>([])
const potentialPool = ref<Item[]>([])
const parameterPool = ref<Item[]>([])

const actionSlots = ref<Slot[]>([])
const conditionSlot = ref<Slot>({ correctId: null, items: [] })
const parameterSlots = ref<Slot[]>([])

function parseJson<T>(value: unknown, fallback: T): T {
    if (value == null) return fallback
    if (typeof value !== 'string') return value as T
    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}

function toArray(value: unknown): string[] {
    if (Array.isArray(value)) return value.map(v => String(v))
    if (typeof value === 'string') {
        const parsed = parseJson<unknown>(value, value)
        if (Array.isArray(parsed)) return parsed.map(v => String(v))
        return value ? [value] : []
    }
    return []
}

const labels = computed(() => {
    const parsed = parseJson<any>(props.question.options?.dynamicColumns?.choice, [])
    const map = Array.isArray(parsed)
        ? parsed.reduce((acc: Record<string, string>, row: Record<string, string>) => ({ ...acc, ...row }), {})
        : {}

    return {
        actions: map.column1 || 'Action to take',
        potential: map.column2 || 'Potential condition',
        parameters: map.column3 || 'Parameter to monitor'
    }
})

function parseCollection(choiceKey: string, listKey: string, group: Group, prefix: string): Item[] {
    const parsed = parseJson<Record<string, Array<{ text: string; markAs: string }>>>(
        props.question.options?.[choiceKey]?.choice,
        {}
    )
    const list = Array.isArray(parsed?.[listKey]) ? parsed[listKey] : []
    return list
        .filter(i => i?.markAs && i?.text)
        .map(i => ({ id: `${prefix}:${i.markAs}`, text: i.text, mark: i.markAs, group }))
}

function initFromQuestion() {
    actionPool.value = parseCollection('finalActionsToTake', 'actionsToTake', 'action', 'action')
    potentialPool.value = parseCollection('finalPotentialConditionsData', 'potentialConditions', 'potential', 'potential')
    parameterPool.value = parseCollection('finalParametersToMonitorData', 'parametersToMonitor', 'parameter', 'parameter')

    const parsedCorrect = parseJson<Record<string, unknown>>(props.question.correct_answer, {})
    const cA = toArray(parsedCorrect.actionsAnswers)
    const cP = toArray(parsedCorrect.potentialAnswers)
    const cR = toArray(parsedCorrect.paramerAnswers ?? parsedCorrect.parameterAnswers)

    actionSlots.value = Array.from({ length: Math.max(2, cA.length || 2) }, (_, i) => ({
        correctId: cA[i] ? `action:${cA[i]}` : null,
        items: []
    }))

    conditionSlot.value = {
        correctId: cP[0] ? `potential:${cP[0]}` : null,
        items: []
    }

    parameterSlots.value = Array.from({ length: Math.max(2, cR.length || 2) }, (_, i) => ({
        correctId: cR[i] ? `parameter:${cR[i]}` : null,
        items: []
    }))
}

function parseModel() {
    if (!props.modelValue) return null
    if (typeof props.modelValue === 'string') return parseJson<Partial<BowTieAnswer>>(props.modelValue, {})
    if (typeof props.modelValue === 'object') return props.modelValue as Partial<BowTieAnswer>
    return null
}

function hydrateFromModel() {
    const model = parseModel()
    if (!model) return

    const a = toArray((model as any).actionsAnswers).map(v => `action:${v}`)
    const p = toArray((model as any).potentialAnswers).map(v => `potential:${v}`)
    const r = toArray((model as any).paramerAnswers ?? (model as any).parameterAnswers).map(v => `parameter:${v}`)

    const aMap = new Map(actionPool.value.map(i => [i.id, i]))
    const pMap = new Map(potentialPool.value.map(i => [i.id, i]))
    const rMap = new Map(parameterPool.value.map(i => [i.id, i]))

    a.forEach((id, i) => {
        if (actionSlots.value[i] && aMap.has(id)) actionSlots.value[i].items = [aMap.get(id)!]
    })
    if (p[0] && pMap.has(p[0])) conditionSlot.value.items = [pMap.get(p[0])!]
    r.forEach((id, i) => {
        if (parameterSlots.value[i] && rMap.has(id)) parameterSlots.value[i].items = [rMap.get(id)!]
    })

    actionPool.value = actionPool.value.filter(i => !a.includes(i.id))
    potentialPool.value = potentialPool.value.filter(i => !p.includes(i.id))
    parameterPool.value = parameterPool.value.filter(i => !r.includes(i.id))
}

function enforce(slot: Slot, type: Group) {
    slot.items = slot.items.filter(i => i.group === type).slice(0, 1)
}

function onDropAction(i: number) {
    enforce(actionSlots.value[i], 'action')
}
function onDropPotential() {
    enforce(conditionSlot.value, 'potential')
}
function onDropParameter(i: number) {
    enforce(parameterSlots.value[i], 'parameter')
}

type SlotStatus = 'correct' | 'incorrect' | 'missed' | 'none'

function groupSlots(group: Group): Slot[] {
    if (group === 'action') return actionSlots.value
    if (group === 'parameter') return parameterSlots.value
    return [conditionSlot.value]
}

function groupCorrectIds(group: Group): string[] {
    return groupSlots(group)
        .map((slot) => slot.correctId)
        .filter((id): id is string => !!id)
}

function groupSelectedIds(group: Group): string[] {
    return groupSlots(group)
        .map((slot) => slot.items[0]?.id || null)
        .filter((id): id is string => !!id)
}

function slotStatus(slot: Slot, group: Group): SlotStatus {
    if (!shouldShowExplanation.value) return 'none'

    const selected = slot.items[0]?.id || null

    // Center potential condition remains strict single-slot matching.
    if (group === 'potential') {
        if (!selected && slot.correctId) return 'missed'
        if (!selected && !slot.correctId) return 'none'
        if (selected === slot.correctId) return 'correct'
        return 'incorrect'
    }

    // Action/parameter columns are order-independent (set matching).
    const correctIds = groupCorrectIds(group)
    const selectedIds = groupSelectedIds(group)

    if (selected) {
        return correctIds.includes(selected) ? 'correct' : 'incorrect'
    }

    const selectedCorrectCount = selectedIds.filter((id) =>
        correctIds.includes(id)
    ).length

    if (selectedCorrectCount < correctIds.length) {
        return 'missed'
    }

    return 'none'
}

function slotStateClass(group: Group, index: number): string {
    const slot =
        group === 'action'
            ? actionSlots.value[index]
            : group === 'potential'
                ? conditionSlot.value
                : parameterSlots.value[index]

    if (!slot) return ''

    switch (slotStatus(slot, group)) {
        case 'correct':
            return 'border-emerald-500 bg-emerald-50'
        case 'incorrect':
            return 'border-rose-500 bg-rose-50'
        case 'missed':
            return 'border-amber-500 bg-amber-50'
        default:
            return ''
    }
}

function itemStateClass(group: Group, index: number): string {
    const slot =
        group === 'action'
            ? actionSlots.value[index]
            : group === 'potential'
                ? conditionSlot.value
                : parameterSlots.value[index]

    if (!slot) return ''

    const status = slotStatus(slot, group)
    if (status === 'correct') return 'border-emerald-400 bg-emerald-100'
    if (status === 'incorrect') return 'border-rose-400 bg-rose-100'
    return ''
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, '').trim()

const allKnownItems = computed<Item[]>(() => {
    const merged = [
        ...actionPool.value,
        ...potentialPool.value,
        ...parameterPool.value,
        ...actionSlots.value.flatMap((slot) => slot.items),
        ...conditionSlot.value.items,
        ...parameterSlots.value.flatMap((slot) => slot.items)
    ]

    const byId = new Map<string, Item>()
    merged.forEach((item) => {
        if (!byId.has(item.id)) byId.set(item.id, item)
    })

    return Array.from(byId.values())
})

function optionTextById(id: string | null): string {
    if (!id) return 'none'

    const found = allKnownItems.value.find((item) => item.id === id)
    if (found) return stripHtml(found.text) || found.mark || id

    return id.split(':')[1] || id
}

const feedbackRows = computed(() => {
    const rows: Array<{ key: string; status: SlotStatus; label: string }> = []

    actionSlots.value.forEach((slot, index) => {
        rows.push({
            key: `action-${index}`,
            status: slotStatus(slot, 'action'),
            label: `${labels.value.actions} ${index + 1}: ${statusLabel(slotStatus(slot, 'action'), slot, 'action')}`
        })
    })

    rows.push({
        key: 'potential-0',
        status: slotStatus(conditionSlot.value, 'potential'),
        label: `${labels.value.potential}: ${statusLabel(slotStatus(conditionSlot.value, 'potential'), conditionSlot.value, 'potential')}`
    })

    parameterSlots.value.forEach((slot, index) => {
        rows.push({
            key: `parameter-${index}`,
            status: slotStatus(slot, 'parameter'),
            label: `${labels.value.parameters} ${index + 1}: ${statusLabel(slotStatus(slot, 'parameter'), slot, 'parameter')}`
        })
    })

    return rows
})

function statusLabel(status: SlotStatus, slot: Slot, group: Group): string {
    if (status === 'correct') return 'Correct'
    if (status === 'incorrect') {
        const selected = stripHtml(slot.items[0]?.text || '') || slot.items[0]?.mark || 'none'
        const correct = group === 'potential'
            ? optionTextById(slot.correctId)
            : groupCorrectIds(group).map((id) => optionTextById(id)).join(', ')
        return `Incorrect (selected "${selected}", correct is "${correct}")`
    }
    if (status === 'missed') {
        const correct = group === 'potential'
            ? optionTextById(slot.correctId)
            : groupCorrectIds(group).map((id) => optionTextById(id)).join(', ')
        return `Not answered (correct is "${correct}")`
    }
    return 'Not answered'
}

function feedbackIcon(status: SlotStatus): string {
    if (status === 'correct') return 'pi-check-circle text-emerald-600'
    if (status === 'incorrect') return 'pi-times-circle text-rose-600'
    if (status === 'missed') return 'pi-exclamation-triangle text-amber-600'
    return 'pi-circle text-gray-400'
}

function feedbackTextClass(status: SlotStatus): string {
    if (status === 'correct') return 'text-emerald-700 font-semibold'
    if (status === 'incorrect') return 'text-rose-700 font-semibold'
    if (status === 'missed') return 'text-amber-700 font-semibold'
    return 'text-gray-500'
}

function revealAnswersAndExplanation() {
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

const answerPayload = computed<BowTieAnswer>(() => ({
    actionsAnswers: actionSlots.value.map(s => s.items[0]?.mark || null),
    potentialAnswers: [conditionSlot.value.items[0]?.mark || null],
    paramerAnswers: parameterSlots.value.map(s => s.items[0]?.mark || null)
}))

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
.bowtie-board {
    position: relative;
    margin-top: 8px;
    padding-top: 4px;
}

.bowtie-layout {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 14px;
}

.bow-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.slot-title,
.pool-title {
    margin: 0;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #475569;
}

.slot-stack {
    display: grid;
    gap: 10px;
    grid-template-rows: repeat(2, minmax(64px, auto));
    min-width: 200px;
}

.slot-box,
.hazard-box {
    min-height: 64px;
    border-radius: 12px;
    border: 1.5px dashed #94a3b8;
    background: #ffffff;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-slot {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.parameter-slot {
    background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%);
}

.hazard-box {
    min-height: 124px;
    border-color: #f87171;
    background: linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%);
}

.drag-item {
    width: 100%;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    padding: 8px 10px;
    font-size: 0.85rem;
    line-height: 1.2rem;
    color: #1e293b;
    text-align: left;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
    cursor: move;
}

.pool-panel {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #ffffff;
    padding: 10px;
}

.pool-box {
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #f9fafb;
    padding: 8px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 8px;
}

.pool-item {
    display: inline-flex;
    align-items: center;
    margin: 0;
    padding: 7px 10px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background: #fef9c3;
    cursor: move;
    font-size: 0.82rem;
    line-height: 1.15rem;
    color: #334155;
}

.bowtie-lines {
    display: none;
}

@media (min-width: 768px) {
    .bowtie-layout {
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 18px;
        align-items: stretch;
        min-height: 254px;
    }

    .center-column {
        justify-content: center;
    }

    .bowtie-lines {
        display: block;
        position: absolute;
        inset: 40px 8% 8px 8%;
        width: 84%;
        height: calc(100% - 48px);
        pointer-events: none;
        z-index: 0;
    }

    .bowtie-lines path {
        stroke: #9ca3af;
        stroke-width: 1.35;
        fill: none;
        stroke-linecap: round;
    }

    .edge-dot {
        fill: #94a3b8;
    }

    .center-dot {
        fill: #64748b;
    }
}
</style>

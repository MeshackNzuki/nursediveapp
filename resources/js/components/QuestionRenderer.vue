<template>
  <component :is="componentName" :question="question" :examStore="examStore" v-model="modelValue">
    <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </component>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Question } from '../types/question'
import MMA from './QuestionTypes/MMA.vue'
import Dropdown from './QuestionTypes/Dropdown.vue'
import FIB from './QuestionTypes/FIB.vue'
import MSA from './QuestionTypes/MSA.vue'
import Unknown from './QuestionTypes/Unknown.vue'
import Grouping from './QuestionTypes/Grouping.vue'
import Highlight from './QuestionTypes/Highlight.vue'
import Ordering from './QuestionTypes/Ordering.vue'
import BowTie from './QuestionTypes/BowTie.vue'
import MTX from './QuestionTypes/MTX.vue'
import MMC from './QuestionTypes/MMC.vue'
import DDC from './QuestionTypes/DDC.vue'
import DRDCLOZE from './QuestionTypes/DRDCLOZE.vue'
import MMN from './QuestionTypes/MMN.vue'
import GRPCHCKBOX from './QuestionTypes/GRPCHCKBOX.vue'

const props = defineProps<{
  question: Question
  modelValue: string | string[]
  examStore: any
}>()

const emit = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const componentName = computed(() => {
  switch (props.question?.question_type?.code) {
    case 'MMA': return MMA
    case 'DRD': return Dropdown
    case 'MSA': return MSA
    case 'FIB': return FIB
    case 'GRP': return Grouping
    case 'GRPCHCKBOX': return GRPCHCKBOX
    case 'HL': return Highlight
    case 'ORD': return Ordering
    case 'BOW': return BowTie
    case 'MTX': return MTX
    case 'MMC': return MMC
    case 'DDC': return DDC
    case 'DRDCLOZE': return DRDCLOZE
    case 'MMN': return MMN
    default: return Unknown
  }
})
</script>
<style scoped>
/* For qn type tables */
/* =========================
   NCLEX TABLE SYSTEM
========================= */

/* Base table */
:deep(table) {
  display: block;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  border-collapse: collapse;
  font-family: "Segoe UI", Roboto, Arial, sans-serif;
  font-size: 14px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* Header (NCLEX blue) */
:deep(thead) {
  background-color: #63cdd4;
  /* deeper clinical blue */
  color: #ffffff;
}

/* Header cells */
:deep(th) {
  padding: 12px 10px;
  text-align: left;
  font-weight: 600;
  border: 1px solid #d1d5db;
  white-space: nowrap;
}

/* Body cells */
:deep(td) {
  padding: 8px 6px;
  border: 1px solid #e5e7eb;
  white-space: nowrap;
}

/* First column = readable content */
:deep(td:first-child),
:deep(th:first-child) {
  white-space: normal;
  font-weight: 500;
}

/* Zebra striping (soft clinical tone) */
:deep(tbody tr:nth-child(even)) {
  background-color: #f8fafc;
}

/* Hover (subtle, not distracting) */
:deep(tbody tr:hover) {
  background-color: #eef6ff;
}

/* Focus row (for selected answers if you apply class later) */
:deep(tr.active-row) {
  background-color: #dbeafe !important;
}

/* Correct / Incorrect states (for review mode) */
:deep(.correct) {
  background-color: #e6f9f0 !important;
}

:deep(.incorrect) {
  background-color: #fde8e8 !important;
}

:deep(.missed) {
  background-color: #fff4e5 !important;
}

/* Inputs (radio/checkbox) */
:deep(input[type="radio"]),
:deep(input[type="checkbox"]) {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
}

/* Matrix / grouping tables need more space */
:deep(.matrix-table),
:deep(.grouping-table) {
  min-width: 700px;
}

/* Better alignment for matrix */
:deep(.matrix-table th),
:deep(.matrix-table td) {
  text-align: center;
}

:deep(.matrix-table th:first-child),
:deep(.matrix-table td:first-child) {
  text-align: left;
}

/* Optional: subtle scroll hint */
:deep(table)::after {
  content: '';
  position: sticky;
  right: 0;
  top: 0;
  width: 20px;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(to left, rgba(0, 0, 0, 0.05), transparent);
}

/* =========================
   DARK MODE (CRITICAL)
========================= */

:deep(.dark table) {
  background-color: #0f172a;
  border-color: #334155;
}

:deep(.dark thead) {
  background-color: #1e3a5f;
}

:deep(.dark th),
:deep(.dark td) {
  border-color: #334155;
}

:deep(.dark tbody tr:nth-child(even)) {
  background-color: #111827;
}

:deep(.dark tbody tr:hover) {
  background-color: #1e293b;
}

/* Review states (dark) */
:deep(.dark .correct) {
  background-color: rgba(34, 197, 94, 0.15) !important;
}

:deep(.dark .incorrect) {
  background-color: rgba(239, 68, 68, 0.15) !important;
}

:deep(.dark .missed) {
  background-color: rgba(245, 158, 11, 0.15) !important;
}
</style>

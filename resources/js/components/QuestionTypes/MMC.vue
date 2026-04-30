<template>
    <div :class="[question.tabs && ['nclex', 'cat'].includes(examStore.storeName) ? 'grid gap-4 md:grid-cols-2' : '']">
        <!-- Intro & Tabs -->
        <div>
            <div v-if="question.intro" class="mb-2 font-bold" v-html="question.intro"></div>
            <TabRenderer v-if="question.tabs && ['nclex', 'cat'].includes(examStore.storeName)" :tabs="question.tabs" />
        </div>
        <div>
            <div v-html="question.question" class="question-text" />
            <!-- Table -->
            <table class="grouping-table border border-gray-200 w-full mt-2">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="p-2 text-left" v-html="question.table_header"></th>
                        <th v-for="(label, key) in categories" :key="key" class="p-2 text-center">
                            {{ label }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(option, rowKey) in question.options" :key="rowKey" class="hover:bg-gray-50">
                        <td class="p-2">{{ option.choice.choice }}</td>
                        <td v-for="(label, colKey) in categories" :key="colKey" class="p-2 text-center">
                            <input type="radio" :name="String(rowKey)" :value="String(colKey)"
                                :checked="selected[String(rowKey)] === String(colKey)" :disabled="testMode === 'review'"
                                :class="radioClass(String(rowKey), String(colKey))"
                                @change="select(String(rowKey), String(colKey))" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Validation Error -->
            <div v-if="validationError" class="text-red-600 mt-2">
                {{ validationError }}
            </div>

            <!-- ACTION BUTTON -->
            <div v-if="showRevealButton" class="mt-4 text-center">
                <button class="px-6 py-2 text-white rounded-sm bg-sky-600 border-0 cursor-pointer"
                    @click="submitAnswer">
                    Submit
                </button>
            </div>
            <slot name="solution"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect, inject, onUnmounted, toRaw } from "vue";
import TabRenderer from '../TabRenderer.vue';
import type { Question } from '../../types/question';

/* ======================
   Props & Emits
====================== */
const props = defineProps<{
    question: Question
    modelValue?: Record<string, string>
    examStore: any
}>();
const emit = defineEmits(["update:modelValue", "submitted"]);

const { testMode } = props.examStore;

/* ======================
   Parse Categories
====================== */
const correctAnswer = computed<Record<string, any>>(() => {
    if (!props.question.correct_answer) return {}
    if (typeof props.question.correct_answer === "string") {
        try {
            return JSON.parse(props.question.correct_answer)
        } catch {
            return {}
        }
    }
    return props.question.correct_answer as any
})

// Parse MTX option to human-readable labels
const mtxOptionRaw: any = props.question.mtx_option || "{}";
let mtxOption: any = {};
try {
    mtxOption = JSON.parse(mtxOptionRaw);
} catch {
    mtxOption = {};
}

const categories: Record<string, string> = {};

Object.keys(correctAnswer.value).forEach(rowKey => {
    const row = correctAnswer.value?.[rowKey]; // { answers: ["A"] }
    const colKeys = Array.isArray(row?.answers) ? row.answers : [];
    colKeys.forEach(colKey => {
        if (!categories[colKey]) {
            categories[colKey] = mtxOption[colKey]?.option || `Category ${colKey}`;
        }
    });
});

if (!Object.keys(categories).length) {
    Object.keys(mtxOption || {}).forEach((colKey) => {
        categories[colKey] = mtxOption[colKey]?.option || `Category ${colKey}`;
    });
}

/* ======================
   Selected (row → column)
====================== */
const selected = reactive<Record<string, string | null>>({});
Object.keys(props.question.options).forEach(rowKey => selected[rowKey] = null);

// preload v-model
if (props.modelValue) Object.assign(selected, props.modelValue);

function select(rowKey: string, colKey: string) {
    selected[rowKey] = colKey;
    emit("update:modelValue", cloneSelected());
}

/* ======================
   Review / Tutor Styling
====================== */
const validationError = ref("");

const shouldShowExplanation = ref(false)
const showRevealButton = ref(false)

function isCorrect(rowKey: string, colKey: string) {
    return correctAnswer.value?.[rowKey]?.answers?.includes(colKey)
}

function radioClass(rowKey: string, colKey: string) {
    if (!shouldShowExplanation.value) return ""

    const correct = isCorrect(rowKey, colKey)
    const picked = selected[rowKey] === colKey

    if (correct && picked) return "accent-teal-500"
    if (!correct && picked) return "accent-rose-600"
    if (correct && !picked) return "ring-2 ring-teal-500"
    return ""
}

/* ======================
   Actions
====================== */
const emitUp: any = inject('showSolution')

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

function submitAnswer() {
    shouldShowExplanation.value = true
    showRevealButton.value = false

    if (emitUp) {
        emitUp({
            flag: true,
            value: true
        })
    }

    emit("submitted", { answer: cloneSelected() })
}

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

onUnmounted(() => {
    if (!emitUp) return
    emitUp({
        flag: true,
        value: false
    })
})
</script>

<style scoped></style>

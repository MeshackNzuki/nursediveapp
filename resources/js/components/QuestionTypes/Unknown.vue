<template>
    <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 max-w-md m-auto mt-12 text-center">
        <p class="font-medium text-gray-700 mb-12">
            This question is currently under review for accuracy.
        </p>

        <p class="mt-1  text-gray-500">
            Please click <span class="font-semibold">Next</span> to continue with rest of the exam.
            You may return later.
        </p>
        <p>Code {{ question?.question_type?.code }}</p>
    </div>
</template>

<script setup lang="ts">
import type { Question } from '../../types/question'

defineProps<{
    question: Question
    modelValue: string | string[]
    examStore: any
}>()
</script>

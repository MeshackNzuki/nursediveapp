<template>
    <div class="card">
        <Editor :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)"
            editorStyle="height: 320px" class="w-full" />
    </div>
</template>

<script setup lang="ts">
import Editor from 'primevue/editor'

const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])
</script>

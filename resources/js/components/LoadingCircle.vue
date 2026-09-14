<template>
    <div v-if="block" class="loading-circle-block" role="status" :aria-label="label || 'Loading'">
        <span class="loading-circle" :style="{ '--s': size }"><span class="loader"></span></span>
        <p v-if="label" class="text-sm font-semibold text-slate-500 select-none dark:text-slate-300">{{ label }}</p>
    </div>
    <span v-else class="loading-circle" :style="{ '--s': size }" role="status" :aria-label="label || 'Loading'"><span class="loader"></span></span>
</template>

<script setup lang="ts">
/** The app's own spinning ring (main.css `.loader`), scalable via `size` (1 = 54px). */
withDefaults(defineProps<{ size?: number; label?: string; block?: boolean }>(), { size: 1, label: "", block: false });
</script>

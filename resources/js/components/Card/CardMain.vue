<template>
    <div
        class="card w-96 bg-white dark:bg-slate-900 dark:text-slate-300 shadow-lg"
    >
        <div class="card-body">
            <h2 class="card-title">{{ title }}</h2>
            <div class="card-actions justify-end">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from "vue"; // Import only the necessary function

const props = defineProps({
    title: {
        type: String,
        default: "Default Title", // Set default value directly
    },
});
</script>

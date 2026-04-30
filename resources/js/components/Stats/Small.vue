<template>
    <div class="relative flex items-center justify-between gap-2 px-2 py-2 w-34 md:w-48 bg-white rounded-md border-s-2 border-sky-500 cursor-pointer select-none transition-transform duration-200 hover:scale-105 overflow-hidden"
        :class="cardTheme">
        <!-- Light overlay -->


        <!-- Icon -->
        <div class="flex items-center justify-center rounded-full bg-gray-200/60 p-1 ring-1 ring-gray-200">
            <i :class="['text-2xl', 'dark:text-slate-100', icon]"></i>
        </div>

        <!-- Label & Quantity -->
        <div class="flex flex-col items-start">
            <span class="text-sm text-slate-600 dark:text-slate-300">{{ label }}</span>
            <span class="px-2 py-0.5 text-xs font-medium text-white bg-accent rounded-full shadow">{{ quantity }}</span>
        </div>
        <!-- Arrow -->
        <span class="text-base font-light text-sky-500 dark:text-emerald-300">→</span>
    </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import { computed } from "vue";

const props = defineProps({
    label: { type: String, default: "Title" },
    quantity: { type: [Number, String], default: "..." },
    icon: { type: String, default: "pi pi-bolt" },
    bgSrc: { type: String, default: new URL("../assets/images/bg.jpg", import.meta.url).href },
});

const isDark = useDark({ disableTransition: false });

const cardTheme = computed(() =>
    isDark.value
        ? "bg-gradient-to-r from-slate-800 via-sky-950 to-sky-900 shadow-sky-700 border-blue-950"
        : `bg-cover bg-center shadow-sm border-blue-950`
);
</script>

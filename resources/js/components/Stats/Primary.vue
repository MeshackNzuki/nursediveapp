<template>
    <div :class="[
        'relative flex flex-col justify-between px-4 py-1 w-52 2xl:w-[15em] rounded-2xl cursor-pointer select-none transition-all duration-200 hover:scale-105',
        baseTheme,
    ]">    
        <!-- Top Label -->
        <div class="relative flex items-center text-sm text-slate-600 dark:text-slate-300">
            <span>{{ label }}</span>
        </div>

        <!-- Quantity + Icon -->
        <div class="relative flex justify-between items-center gap-1">
            <span></span>
            <div class="text-2xl font-semibold text-sky-900 dark:text-slate-100 px-2">
                {{ quantity }}
            </div>
            <i :class="[
                'text-2xl p-2 rounded-full text-white shadow ring-0.5 ring-offset-2',
                icon,
                'bg-accent dark:text-slate-100',
            ]"></i>
        </div>

        <!-- Footer -->
        <div class="relative flex items-center justify-between text-sm text-gray-900 dark:text-emerald-300">
            <!-- Trend / Status -->
            <span class="text-xs font-medium flex items-center gap-1 text-orange-600 p-1 rounded-lg bg-orange-100/50 dark:bg-yellow-900/30 dark:text-yellow-400 bottom-0">
                {{ description }}
                <component :is="trendIcon" class="w-4 h-4" />
            </span>      

            <!-- Link -->
            <router-link :to="link"
                class="ml-6 flex items-center gap-1 text-xs font-bold text-sky-500 transition-all duration-150 hover:scale-105 underline">
                View
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { useDark } from '@vueuse/core';
import { computed } from 'vue';

const props = defineProps({
    label: { type: String, default: 'Title' },
    description: { type: String, default: '32k increase' },
    quantity: { type: [Number, String], default: '...' },
    up: { type: String, default: 'none' }, // 'up' | 'down' | 'none'
    icon: { type: String, default: '...' },
    link: { type: String, default: '/' },
});

const isDark = useDark({ disableTransition: false });

const baseTheme = computed(() =>
    isDark.value
        ? 'bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900 border-teal-500 shadow-sky-700'
        : 'bg-white border-teal-500'
);

const trendIcon = computed(() => {
    if (props.up === 'up')
        return {
            template: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="text-emerald-500" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"/></svg>`,
        };
    if (props.up === 'down')
        return {
            template: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="text-red-500" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 13a1 1 0 100 2H3a1 1 0 01-1-1v-5a1 1 0 112 0v3.586l4.293-4.293a1 1 0 011.414 0L12 9.414l4.293-4.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0L9 11.414l-4.293 4.293V13z"/></svg>`,
        };
    return {
        template: `<i class='pi pi-check-circle text-sky-500'></i>`,
    };
});
</script>

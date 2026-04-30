<template>
    <button :class="[
        'py-1 px-2 rounded-full shadow-lg dark:shadow-slate-300 dark:shadow-sm',
        'hover:translate-x-0.5 hover:scale-05 transition duration-200 ease-out text-sm cursor-pointer hover:bg-sky-600',
        // Conditionally apply bg-sky-500 if the theme is Light, else use the current theme's background
        theme?.currentTheme === 'Light'
            ? 'bg-sky-600'
            : theme?.themes[theme.currentTheme]?.bg,
        // Conditionally apply text-gray-50 if the theme is Light, else use the current theme's text color
        theme?.currentTheme === 'Light'
            ? 'text-gray-50'
            : theme?.themes[theme.currentTheme]?.text,
        buttonText === 'Del' || buttonText === 'Delete' ? 'bg-red-500' : '', // Special condition, overrides theme
        classes, // User-defined classes override everything else
    ]" @click="handleClick">
        <i :class="`${icon} text-xs`"></i>
        <i v-if="!icon && buttonText === 'Edit'" class="text-xs"></i>
        {{ buttonText }}
    </button>
</template>

<script setup>
import { useThemeStore } from "../../stores/Theme";

const theme = useThemeStore();
// Props
const props = defineProps({
    buttonText: { type: String, default: "" },
    action: { type: Function, default: () => { } },
    classes: { type: String, default: "" },
    icon: { type: String, default: null },
});

const handleClick = () => {
    props.action();
};
</script>
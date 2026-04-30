<template>
    <div :class="[
        'shadow-lg  w-full max-h-10 flex items-center mt-4 mx-12 justify-around rounded-md select-none  gap-4 z-10 py-4  px-6 transition-all ease-in-out duration-300',
        theme?.themes[theme.currentTheme]?.bg,
        theme?.themes[theme.currentTheme]?.text,
    ]">
        <slot><template> </template></slot>
    </div>
</template>
<script setup="">
import { useThemeStore } from "../../stores/Theme";

const theme = useThemeStore();
</script>

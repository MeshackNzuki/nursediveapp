<template>
    <button type="submit" :disabled="props.disabled" :class="`flex items-center justify-center ${computedClasses}`" @click="handleClick">
        <i :class="`${icon} font-extralight text-sm`"></i>
        {{ buttonText }}
        <i :class="`${icon2} font-extralight text-sm ms-0.5`"></i>
    </button>

</template>
<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/Theme'

const theme = useThemeStore()

// Props
const props = defineProps({
    attrib: { type: String, default: '' },
    buttonText: { type: String, default: 'Button Comp' },
    action: { type: Function, default: () => { } },
    classes: { type: String, default: '' },
    icon: { type: String, default: null },
    icon2: { type: String, default: null },
    disabled: { type: Boolean, default: false }
})

const handleClick = () => {
    if (props.disabled) return
    props.action()
}

const computedClasses = computed(() => {
    const base = 'px-4 py-1 rounded-full transition delay-50 ease-in-out cursor-pointer hover:scale-105 whitespace-nowrap shadow-md select-none text-sm hover:bg-sky-600 dark:shadow-slate-300 dark:shadow-sm'

    const themeClass = theme?.currentTheme === 'Light'
        ? 'bg-sky-600 text-gray-100' //works when i remove the bg-sky-500
        : `${theme?.themes[theme.currentTheme]?.bg} ${theme?.themes[theme.currentTheme]?.text}`

    const attribClass = props.attrib !== '' ? 'bg-gray-300' : ''

    // Class priority: props.classes > attribClass > themeClass > base
    const disabledClass = props.disabled
        ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:bg-inherit'
        : ''

    return [
        base,
        themeClass,
        attribClass,
        props.classes,
        disabledClass
    ].join(' ')
})
</script>

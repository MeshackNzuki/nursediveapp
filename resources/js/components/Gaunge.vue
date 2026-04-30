<template>
    <div class="relative mx-auto w-full max-w-[340px] select-none">
        <svg viewBox="0 0 260 160" class="h-auto w-full overflow-visible">
            <defs>
                <linearGradient :id="gradientId" x1="30" y1="130" x2="230" y2="130" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#fb7185" />
                    <stop offset="40%" stop-color="#f59e0b" />
                    <stop offset="72%" stop-color="#22c55e" />
                    <stop offset="100%" stop-color="#06b6d4" />
                </linearGradient>
                <filter :id="glowId" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="#0ea5e9" flood-opacity="0.35" />
                </filter>
            </defs>

            <path :d="arcPath" fill="none" stroke="rgba(148,163,184,0.24)" stroke-width="13" stroke-linecap="round" />
            <path :d="arcPath" fill="none" :stroke="`url(#${gradientId})`" stroke-width="13" stroke-linecap="round"
                :stroke-dasharray="arcLength" :stroke-dashoffset="dashOffset" class="transition-all duration-700 ease-out"
                :filter="`url(#${glowId})`" />

            <g v-for="tick in ticks" :key="tick" opacity="0.7">
                <line :x1="tickCoord(tick).x1" :y1="tickCoord(tick).y1" :x2="tickCoord(tick).x2" :y2="tickCoord(tick).y2"
                    stroke="rgba(100,116,139,0.5)" stroke-width="1.4" />
            </g>

            <line :x1="cx" :y1="cy" :x2="needleX" :y2="needleY" :stroke="needleColor" stroke-width="3.2"
                stroke-linecap="round" class="transition-all duration-700 ease-out" />

            <circle :cx="needleX" :cy="needleY" r="5.2" fill="white" :stroke="needleColor" stroke-width="2.3"
                class="transition-all duration-700 ease-out" />
            <circle :cx="cx" :cy="cy" r="6.5" fill="#0f172a" />
            <circle :cx="cx" :cy="cy" r="3.2" fill="#f8fafc" />
        </svg>

        <div class="-mt-1 text-center">
            <div class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                {{ label }}
            </div>
            <div class="mt-1 text-3xl font-bold leading-none text-slate-900 dark:text-slate-100">
                {{ Math.round(animatedLevel) }}%
            </div>
            <div class="mt-1 text-xs font-medium" :class="bandClass">
                {{ bandText }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
    level: {
        type: Number,
        default: 0,
    },
    label: {
        type: String,
        default: 'Probability',
    },
    passMark: {
        type: Number,
        default: 75,
    },
})

const uid = Math.random().toString(36).slice(2, 9)
const gradientId = `gauge-gradient-${uid}`
const glowId = `gauge-glow-${uid}`

const clamp = (value) => Math.max(0, Math.min(100, Number(value) || 0))

const animatedLevel = ref(0)
let animationFrameId = null

const animateTo = (target) => {
    const to = clamp(target)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)

    const from = animatedLevel.value
    const diff = to - from
    const duration = 700
    const start = performance.now()

    const tick = (now) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        animatedLevel.value = from + diff * eased
        if (t < 1) {
            animationFrameId = requestAnimationFrame(tick)
        }
    }

    animationFrameId = requestAnimationFrame(tick)
}

watch(
    () => props.level,
    (value) => animateTo(value),
    { immediate: true },
)

onBeforeUnmount(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
})

const cx = 130
const cy = 130
const radius = 98
const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`
const arcLength = Math.PI * radius

const dashOffset = computed(() => arcLength * (1 - animatedLevel.value / 100))

const angle = computed(() => Math.PI * (1 - animatedLevel.value / 100))
const needleX = computed(() => cx + Math.cos(angle.value) * (radius - 12))
const needleY = computed(() => cy - Math.sin(angle.value) * (radius - 12))

const ticks = [0, 20, 40, 60, 80, 100]
const tickCoord = (value) => {
    const theta = Math.PI * (1 - value / 100)
    const outerR = radius + 9
    const innerR = radius - 2
    return {
        x1: cx + Math.cos(theta) * innerR,
        y1: cy - Math.sin(theta) * innerR,
        x2: cx + Math.cos(theta) * outerR,
        y2: cy - Math.sin(theta) * outerR,
    }
}

const needleColor = computed(() => {
    if (animatedLevel.value < 50) return '#e11d48'
    if (animatedLevel.value < 75) return '#d97706'
    return '#059669'
})

const bandText = computed(() => {
    if (animatedLevel.value < 50) return 'Low readiness'
    if (animatedLevel.value < 75) return 'Moderate readiness'
    if (animatedLevel.value < 90) return 'High readiness'
    return 'Excellent readiness'
})

const bandClass = computed(() => {
    if (animatedLevel.value < 50) return 'text-rose-600 dark:text-rose-300'
    if (animatedLevel.value < 75) return 'text-amber-600 dark:text-amber-300'
    if (animatedLevel.value < 90) return 'text-emerald-600 dark:text-emerald-300'
    return 'text-cyan-600 dark:text-cyan-300'
})
</script>

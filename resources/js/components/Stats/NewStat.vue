<template>
    <div :class="[
        'relative overflow-hidden rounded-2xl border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md',
        tone.container
    ]">
        <!-- Ambient glow -->
        <div :class="['pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl opacity-60', tone.glow]">
        </div>

        <!-- Pattern overlay -->
        <div class="absolute inset-0 opacity-30 pointer-events-none" :style="{ backgroundImage: patternMap[pattern] }">
        </div>

        <!-- Icon -->
        <div :class="[
            'relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border',
            tone.iconWrap
        ]">
            <i :class="[icon, 'text-lg', tone.iconText]"></i>
        </div>

        <!-- Content -->
        <div class="relative z-10 flex min-w-0 flex-1 flex-col">
            <!-- Label -->
            <p class="text-xs font-medium uppercase tracking-[0.16em]" :class="tone.labelText">{{ label }}</p>

            <!-- Main Value -->
            <p class="mt-1 text-2xl font-semibold leading-tight text-slate-800">
                {{ quantity }}
                <span v-if="suffix" class="text-base font-medium text-slate-500">{{ suffix }}</span>
            </p>

            <!-- Subtitle -->
            <p v-if="subtitle" class="mt-1 text-xs text-slate-500">{{ subtitle }}</p>

            <!-- Description -->
            <p v-if="description" class="mt-1 text-xs text-slate-400">{{ description }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    icon: string
    label: string
    quantity: string | number
    suffix?: string
    subtitle?: string
    description?: string
    variant?: "sky" | "amber" | "accent" | "rose" | "violet"
    pattern?: "diagonal" | "dots" | "grid" | "stripes"
}

const props = withDefaults(defineProps<Props>(), {
    variant: "sky",
    pattern: "diagonal"
})

type VariantTone = {
    container: string
    glow: string
    iconWrap: string
    iconText: string
    labelText: string
}

const toneMap: Record<string, VariantTone> = {
    sky: {
        container: "border-sky-100 bg-sky-50/70",
        glow: "bg-sky-200/70",
        iconWrap: "border-sky-200 bg-sky-100/80",
        iconText: "text-sky-700",
        labelText: "text-sky-700/80",
    },
    amber: {
        container: "border-amber-100 bg-amber-50/70",
        glow: "bg-amber-200/70",
        iconWrap: "border-amber-200 bg-amber-100/80",
        iconText: "text-amber-700",
        labelText: "text-amber-700/80",
    },
    accent: {
        container: "border-teal-100 bg-teal-50/70",
        glow: "bg-teal-200/70",
        iconWrap: "border-teal-200 bg-teal-100/80",
        iconText: "text-teal-700",
        labelText: "text-teal-700/80",
    },
    rose: {
        container: "border-rose-100 bg-rose-50/70",
        glow: "bg-rose-200/70",
        iconWrap: "border-rose-200 bg-rose-100/80",
        iconText: "text-rose-700",
        labelText: "text-rose-700/80",
    },
    violet: {
        container: "border-violet-100 bg-violet-50/70",
        glow: "bg-violet-200/70",
        iconWrap: "border-violet-200 bg-violet-100/80",
        iconText: "text-violet-700",
        labelText: "text-violet-700/80",
    },
}

const tone = computed(() => toneMap[props.variant] ?? toneMap.sky)

const patternMap: Record<string, string> = {
    diagonal:
        "repeating-linear-gradient(45deg, rgba(15,23,42,0.03) 0, rgba(15,23,42,0.03) 1px, transparent 1px, transparent 8px)",
    dots:
        "radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px) 0 0 / 14px 14px",
    grid:
        "linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)",
    stripes:
        "repeating-linear-gradient(135deg, rgba(15,23,42,0.03) 0, rgba(15,23,42,0.03) 2px, transparent 2px, transparent 9px)"
}

const pattern = computed(() => props.pattern)
</script>

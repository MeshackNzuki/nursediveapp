<template>
    <nav class="mx-auto mb-4 flex max-w-screen-2xl flex-wrap items-center justify-between gap-2" aria-label="Breadcrumb">
        <ol class="flex min-w-0 flex-wrap items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-300">
            <li>
                <router-link :to="meta.base" class="dash-chip theme-soft theme-focus py-1 text-[11px]">
                    <i :class="meta.icon"></i> {{ meta.label }} dashboard
                </router-link>
            </li>
            <li v-for="item in items" :key="item.label" class="flex min-w-0 items-center gap-1.5">
                <i class="pi pi-angle-right text-[10px] text-slate-400"></i>
                <router-link v-if="item.to" :to="item.to" class="truncate hover:underline">{{ item.label }}</router-link>
                <span v-else class="truncate text-slate-800 dark:text-white">{{ item.label }}</span>
            </li>
        </ol>

        <div v-if="showActions" class="flex flex-wrap gap-1.5">
            <router-link :to="`${meta.base}/performance-analysis`" class="dash-btn-ghost px-3 py-1 text-[11px]">
                <i class="pi pi-chart-line text-[10px]"></i> Analysis
            </router-link>
            <router-link :to="`${meta.base}/previous-attempts`" class="dash-btn-ghost px-3 py-1 text-[11px]">
                <i class="pi pi-history text-[10px]"></i> History
            </router-link>
            <router-link v-if="meta.study" :to="meta.study" class="dash-btn-ghost px-3 py-1 text-[11px]">
                <i class="pi pi-book text-[10px]"></i> Study
            </router-link>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";

/**
 * Compact product context bar: "TEAS dashboard › Test bank › Math", plus
 * quick links to analysis, history and study for the current product.
 * Keeps inner pages connected to their product without relying on the sidebar.
 */
const props = withDefaults(
    defineProps<{
        product: "teas" | "nursing" | "nclex";
        items?: { label: string; to?: string }[];
        showActions?: boolean;
    }>(),
    { items: () => [], showActions: true },
);

const META = {
    teas: { base: "/teas", label: "TEAS", icon: "pi pi-file-edit", study: "/teas/guide-topics" },
    nursing: { base: "/nursing", label: "Nursing", icon: "pi pi-briefcase", study: "/nursing/study-chapters?chapter_id=7" },
    nclex: { base: "/nclex", label: "NCLEX", icon: "pi pi-bolt", study: "/nclex/study-chapters" },
} as const;

const meta = computed(() => META[props.product]);
</script>

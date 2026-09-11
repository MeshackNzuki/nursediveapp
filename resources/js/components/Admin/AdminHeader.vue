<template>
    <header class="ui-rise mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="min-w-0">
            <p class="dash-eyebrow theme-text inline-flex items-center gap-2">
                <span class="relative flex h-2 w-2">
                    <span class="theme-dot absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"></span>
                    <span class="theme-dot relative inline-flex h-2 w-2 rounded-full"></span>
                </span>
                Admin console
            </p>
            <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">{{ title }}</h1>
            <p v-if="subtitle" class="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{{ subtitle }}</p>
        </div>
        <nav class="no-scrollbar flex gap-1.5 overflow-x-auto pb-1" aria-label="Admin sections">
            <router-link v-for="link in links" :key="link.to" :to="link.to" class="dash-chip shrink-0 whitespace-nowrap text-[11px]"
                :class="isCurrent(link.to) ? 'theme-surface border-transparent shadow-md' : 'theme-soft theme-focus'">
                <i :class="link.icon" class="text-[10px]"></i> {{ link.label }}
            </router-link>
            <slot name="actions"></slot>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

withDefaults(defineProps<{ title: string; subtitle?: string }>(), { subtitle: "" });

const route = useRoute();
const links = [
    { to: "/admin", label: "Overview", icon: "pi pi-gauge" },
    { to: "/admin/users?all=1", label: "Users", icon: "pi pi-users" },
    { to: "/admin/all-payments", label: "Payments", icon: "pi pi-wallet" },
    { to: "/admin/exam-feedback", label: "Feedback", icon: "pi pi-comments" },
    { to: "/admin/settings", label: "Settings", icon: "pi pi-cog" },
];
const isCurrent = (to: string) => {
    const path = to.split("?")[0];
    if (path === "/admin") return route.path === "/admin" || route.path === "/admin/";
    if (path === "/admin/all-payments") return route.path.includes("payments");
    return route.path.startsWith(path);
};
</script>

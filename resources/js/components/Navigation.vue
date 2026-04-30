<template>
    <nav
        class="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-3.5 md:p-4 shadow-[0_14px_35px_-20px_rgba(15,23,42,0.45)] mb-3"
        aria-label="Product navigation">
        <div class="absolute inset-0 pointer-events-none opacity-80">
            <div
                class="absolute -top-20 -left-14 h-44 w-44 rounded-full bg-gradient-to-r from-sky-100 via-cyan-100 to-emerald-100 blur-3xl">
            </div>
            <div
                class="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 blur-3xl">
            </div>
        </div>

        <div class="relative z-10">
            <div class="flex items-center justify-between gap-3 mb-3 px-1">
                <p class="text-xs md:text-sm font-semibold tracking-wide text-slate-500 uppercase">Switch Workspace</p>
                <span class="text-[11px] md:text-xs text-slate-500">Pick a prep product</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <router-link v-for="item in navItems" :key="item.to" :to="item.to"
                    class="group rounded-2xl border p-3 transition duration-200"
                    :class="isActive(item.to)
                        ? `${item.activeClass} border-transparent shadow-[0_14px_28px_-18px_rgba(15,23,42,0.55)]`
                        : 'border-slate-200 bg-white/90 hover:border-slate-300 hover:-translate-y-0.5'">
                    <div class="flex items-center gap-2.5">
                        <span
                            class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                            :class="isActive(item.to) ? item.iconActiveClass : item.iconClass">
                            <i :class="item.icon"></i>
                        </span>
                        <div class="min-w-0">
                            <p class="text-sm font-extrabold tracking-tight" :class="isActive(item.to) ? 'text-white' : 'text-slate-800'">
                                {{ item.label }}
                            </p>
                            <p class="text-[11px]" :class="isActive(item.to) ? 'text-white/90' : 'text-slate-500'">
                                {{ item.subtitle }}
                            </p>
                        </div>
                        <i class="pi pi-arrow-right ml-auto text-xs transition-transform duration-200"
                            :class="isActive(item.to)
                                ? 'text-white'
                                : 'text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5'"></i>
                    </div>
                </router-link>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const navItems = [
    {
        to: "/teas",
        label: "TEAS",
        subtitle: "ATI TEAS practice",
        icon: "pi pi-file-edit",
        activeClass: "bg-gradient-to-r from-cyan-500 to-sky-500",
        iconClass: "bg-cyan-100 text-cyan-700",
        iconActiveClass: "bg-white/20 text-white",
    },
    {
        to: "/nursing",
        label: "Nursing School",
        subtitle: "Course test bank",
        icon: "pi pi-briefcase",
        activeClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
        iconClass: "bg-emerald-100 text-emerald-700",
        iconActiveClass: "bg-white/20 text-white",
    },
    {
        to: "/nclex",
        label: "NCLEX",
        subtitle: "RN and PN prep",
        icon: "pi pi-bolt",
        activeClass: "bg-gradient-to-r from-blue-500 to-indigo-500",
        iconClass: "bg-blue-100 text-blue-700",
        iconActiveClass: "bg-white/20 text-white",
    },
];

const isActive = (targetPath) => {
    const currentPath = route.path || "";
    return (
        currentPath === targetPath ||
        currentPath.startsWith(`${targetPath}/`) ||
        currentPath.startsWith(`${targetPath}-`)
    );
};
</script>

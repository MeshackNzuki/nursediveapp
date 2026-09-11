<template>
    <div class="mx-auto mt-10 max-w-xl">
        <div class="dash-card-white border-amber-200 p-8 text-center dark:border-amber-800">
            <span class="dash-icon-tile mx-auto h-12 w-12 bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg"><i class="pi pi-lock"></i></span>
            <h2 class="mt-4 text-xl font-extrabold text-slate-950 dark:text-white">{{ title }}</h2>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ message }}</p>
            <router-link to="/" class="dash-btn-ghost mt-5 px-4 py-2 text-xs"><i class="pi pi-home text-[10px]"></i> Back to the hub</router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string; message?: string }>(), {
    title: "Admin access required",
    message: "Your account does not have permission to view this page.",
});
</script>

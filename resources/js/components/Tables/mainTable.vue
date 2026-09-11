<template>
    <div :class="['dash-card-white p-0 transition-all duration-300 select-none', store.currentZoom]">
        <!-- Toolbar -->
        <div class="flex flex-col gap-3 border-b border-sky-100 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:border-sky-800">
            <div class="flex min-w-0 items-center gap-3">
                <span class="dash-icon-tile theme-icon h-9 w-9 text-sm"><i :class="icon"></i></span>
                <div class="min-w-0">
                    <p class="truncate text-sm font-extrabold text-slate-950 dark:text-white">{{ title }}</p>
                    <p class="text-[11px] font-semibold text-slate-500 dark:text-slate-300">{{ rows > 0 ? `${rows.toLocaleString()} records` : "Nothing to show yet" }}</p>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <label class="relative block w-full sm:w-64">
                    <i class="pi pi-search pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-slate-400"></i>
                    <input :value="query" :type="search_type" @input="updateValue" :placeholder="search_placeholder"
                        class="theme-focus w-full rounded-full border border-slate-200 bg-white py-1.5 pr-3 pl-8 text-sm font-medium text-slate-800 focus:outline-none dark:border-sky-700 dark:bg-sky-950 dark:text-slate-100" />
                </label>

                <span class="inline-flex items-center overflow-hidden rounded-full border border-slate-200 text-xs dark:border-sky-700" title="Table zoom">
                    <button type="button" class="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-sky-900" aria-label="Zoom out" @click="zoomOut"><i class="pi pi-minus text-[10px]"></i></button>
                    <span class="border-x border-slate-200 px-2 py-1.5 font-bold text-slate-500 dark:border-sky-700 dark:text-slate-300">Aa</span>
                    <button type="button" class="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-sky-900" aria-label="Zoom in" @click="zoomIn"><i class="pi pi-plus text-[10px]"></i></button>
                </span>

                <span class="flex flex-row gap-2">
                    <slot name="actions"></slot>
                </span>
            </div>
        </div>

        <!-- Table -->
        <div class="no-scrollbar overflow-x-auto">
            <table :class="['w-full table-auto text-sm text-slate-700 dark:text-slate-200', fs]">
                <thead class="bg-light-blue-500 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:bg-sky-900/60 dark:text-slate-300">
                    <tr>
                        <th v-for="(header, index) in headers" :key="index" class="p-2 whitespace-nowrap">
                            <div :class="`ps-1` + (index === headers.length - 1 && header == 'ACTION' ? ' text-center' : ' text-start')">
                                {{ header }}
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody class="admin-tbody divide-y divide-sky-100 dark:divide-sky-800">
                    <slot name="content"></slot>
                </tbody>
            </table>
        </div>

        <div v-if="rows === 0" class="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <span class="dash-icon-tile theme-icon h-12 w-12"><i class="pi pi-inbox"></i></span>
            <p class="text-sm font-bold text-slate-800 dark:text-slate-100">No data yet</p>
            <p class="text-xs text-slate-500 dark:text-slate-300">{{ emptyHint }}</p>
        </div>
    </div>
</template>

<script setup>
import { useMainStore } from "../../stores/index";

const store = useMainStore();
const { zoomIn, zoomOut } = store;

defineProps({
    tableTitle: { type: String, required: false },
    headers: { type: Array, required: true },
    title: { type: String, required: false },
    icon: { type: String, default: "pi pi-table" },
    query: { type: String, default: "" },
    search_type: { type: String, default: "text" },
    search_placeholder: { type: String, default: "Search this table" },
    rows: { type: Number, default: 0 },
    emptyHint: { type: String, default: "Records will appear here as soon as there is something to show." },
    // preserve original `fs` usage (class suffix), default empty
    fs: { type: String, default: "" },
});

const emit = defineEmits(["update:query"]);

const updateValue = (event) => {
    emit("update:query", event.target.value);
};
</script>

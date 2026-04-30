<template>
    <div :class="['p-3 text-3xl transition-all duration-300 select-none', store.currentZoom]">
        <div :class="['overflow-x-auto rounded-md', store.currentZoom]">

            <!-- Toolbar (responsive, preserves original layout & slots) -->
            <div :class="[
                'h-auto sm:h-10 p-2 flex flex-col sm:flex-row flex-wrap justify-between items-center gap-2 sm:gap-3 px-4',
                theme?.themes[theme.currentTheme]?.bg,
                theme?.themes[theme.currentTheme]?.text
            ]">
                <span class="font-bold">{{ title }}</span>

                <span class="font-light">{{ rows > 0 ? `${rows} records` : "" }}</span>

                <span class="font-bold flex items-center gap-2">
                    <i @click="zoomOut"
                        class="pi pi-minus cursor-pointer bg-sky-500 border-0 badge p-1 text-white hover:scale-105"></i>
                    <span class="mx-1 font-light">Zoom</span>
                    <i @click="zoomIn"
                        class="pi pi-plus cursor-pointer bg-sky-500 badge border-0 p-1 text-white hover:scale-105"></i>
                </span>

                <!-- Search (keeps same emit behavior) -->
                <div class="form-control w-full sm:w-auto mx-1">
                    <input :value="query" :type="search_type" @input="updateValue" :placeholder="search_placeholder"
                        class="border border-teal-500 focus:outline-none w-full sm:w-64 rounded-full px-2 font-light" />
                </div>

                <span class="flex flex-row gap-2">
                    <slot name="actions"></slot>
                </span>

                <span class="relative"><i class="pi pi-spin pi-sync"></i></span>
            </div>

            <!-- Table (preserve slot content: you still render <tr> inside slot "content") -->
            <table :class="['table-auto w-full bg-slate-50 dark:bg-sky-950 text-sm', fs]">
                <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                        <th v-for="(header, index) in headers" :key="index" class="p-2 whitespace-nowrap">
                            <div
                                :class="`font-semibold ps-1` + (index === headers.length - 1 && header == 'ACTION' ? ' text-center' : ' text-start')">
                                {{ header }}
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 dark:divide-slate-400 dark:text-slate-300">
                    <!-- PRESERVED: your app still supplies rows through this slot -->
                    <slot name="content"></slot>
                </tbody>
            </table>

            <div v-if="rows === 0" class="flex justify-center my-4 text sm">
                <span class="px-3 py-1 bg-sky-200 rounded-badge">No data yet!</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useThemeStore } from "../../stores/Theme";
import { useMainStore } from "../../stores/index";

const store = useMainStore();
const { zoomIn, zoomOut } = store;
const theme = useThemeStore();

const props = defineProps({
    tableTitle: { type: String, required: false },
    headers: { type: Array, required: true },
    title: { type: String, required: false },
    query: { type: String, default: "" },
    search_type: { type: String, default: "text" },
    search_placeholder: { type: String, default: "Search this table" },
    rows: { type: Number, default: 0 },
    // preserve original `fs` usage (class suffix), default empty
    fs: { type: String, default: "" },
});

const emit = defineEmits(["update:query"]);

const updateValue = (event) => {
    emit("update:query", event.target.value);
};
</script>

<style>
.td {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 8px;
}
</style>

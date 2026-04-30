<template>
    <div v-if="tabEntries.length" class="mb-4">
        <div class="flex gap-2  mb-2">
            <button v-for="([title], index) in tabEntries" :key="index"
                class="text-sm px-3 py-1 rounded-t border-b-1 font-bold cursor-pointer" :class="{
                    'border-sky-600 border-b-3 dark:text-gray-700 bg-gray-200 rounded-t-md': activeTab === index,
                    'text-gray-700 dark:text-gray-100': activeTab !== index
                }" @click="activeTab = index">
                {{ title }}
            </button>
        </div>
        <div class="pt-2 prose max-w-none border border-gray-200 p-2 rounded" v-html="tabEntries[activeTab][1]" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
    tabs?: any
}>()

const activeTab = ref(0)

const tabEntries = computed<[string, string][]>(() => {
    if (!props.tabs) return []

    try {
        const parsed =
            typeof props.tabs === 'string'
                ? JSON.parse(props.tabs || '{}')
                : props.tabs

        if (!parsed || typeof parsed !== 'object') return []

        return Object.entries(parsed)
    } catch {
        return []
    }
})

// Reset tab when question changes
watch(
    () => props.tabs,
    () => {
        activeTab.value = 0
    }
)
</script>

<template>
    <div class="max-w-4xl mx-auto p-6 space-y-4">
        <h2 class="text-2xl font-semibold text-gray-800">General App settings </h2>
        <hr>
        <h2 class="text-2xl font-semibold text-red-500">Danger zone <i
                class="pi pi-exclamation-triangle text-red-500 animate-pulse"></i></h2>
        <h2 class="text-2xl font-semibold text-gray-800">App constants <i
                class="pi pi-exclamation-triangle text-red-500 animate-pulse"></i></h2>
        <div class="alert alert-error bg-opacity-25"> Avoid editting these constants as they may cause app failure if
            not handled
            correctly!</div>
        <!-- List of settings -->
        <div v-if="settings.length > 0" class="space-y-2">
            <ul class="space-y-2">
                <li v-for="setting in settings" :key="setting.key"
                    class="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                    <div>
                        <strong class="text-gray-700">{{ setting.key }}:</strong>
                        <span class="text-gray-600">{{ setting.value }}</span>
                    </div>
                    <button @click="editSetting(setting)" class="bg-sky-500 text-white p-2 rounded-md hover:bg-sky-600">
                        Edit
                    </button>
                </li>
            </ul>
        </div>

        <!-- Add new setting form -->
        <div v-if="isAdding" class="bg-white p-6 rounded-md shadow-md">
            <h3 class="text-xl font-semibold text-gray-800">Add New Setting</h3>
            <form @submit.prevent="createSetting" class="space-y-4">
                <div>
                    <label for="key" class="block text-gray-700">Key</label>
                    <input type="text" v-model="newSetting.key" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label for="value" class="block text-gray-700">Value</label>
                    <input type="text" v-model="newSetting.value" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="flex space-x-4">
                    <button type="submit" class="bg-emerald-500 text-white p-2 rounded-md hover:bg-green-600 w-full">
                        Add Setting
                    </button>
                    <button @click="isAdding = false" type="button"
                        class="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 w-full">
                        Cancel
                    </button>
                </div>
            </form>
        </div>

        <!-- Edit existing setting -->
        <div v-if="isEditing" class="bg-white p-6 rounded-md shadow-md">
            <h3 class="text-xl font-semibold text-gray-800">Edit Setting</h3>
            <form @submit.prevent="updateSetting" class="space-y-4">
                <div>
                    <label for="key" class="block text-gray-700">Key</label>
                    <input type="text" v-model="currentSetting.key" disabled
                        class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-200" />
                </div>
                <div>
                    <label for="value" class="block text-gray-700">Value</label>
                    <input type="text" v-model="currentSetting.value" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="flex space-x-4">
                    <button type="submit" class="bg-sky-500 text-white p-2 rounded-md hover:bg-sky-600 w-full">
                        Update Setting
                    </button>
                    <button @click="cancelEdit" type="button"
                        class="bg-sky-800 text-white p-2 rounded-md hover:bg-aky-950 w-full">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const settings = ref([]);
const isAdding = ref(false);
const isEditing = ref(false);
const currentSetting = ref({ key: '', value: '' });
const newSetting = ref({ key: '', value: '' });

// Fetch settings from API
const fetchSettings = async () => {
    try {
        const response = await axios.get('/admin/settings');
        settings.value = response.data.data
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
};

// Create a new setting
const createSetting = async () => {
    try {
        await axios.post('/admin/settings', newSetting.value);
        newSetting.value = { key: '', value: '' }; // Reset form
        isAdding.value = false;
        fetchSettings(); // Refresh settings list
    } catch (error) {
        console.error('Error creating setting:', error);
    }
};

// Edit a setting
const editSetting = (setting) => {
    isEditing.value = true;
    currentSetting.value = { ...setting };
};

// Update a setting
const updateSetting = async () => {
    try {
        await axios.post(`/admin/settings/${currentSetting.value.key}`, {
            value: currentSetting.value.value,
        });
        isEditing.value = false;
        fetchSettings(); // Refresh settings list
    } catch (error) {
        console.error('Error updating setting:', error);
    }
};

// Cancel edit
const cancelEdit = () => {
    isEditing.value = false;
    currentSetting.value = { key: '', value: '' };
};

onMounted(fetchSettings);
</script>

<style scoped>
/* Custom Styles for this component */
</style>

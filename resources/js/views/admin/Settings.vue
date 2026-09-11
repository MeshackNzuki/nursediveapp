<template>
    <div class="dash-shell">
        <div v-if="isSuperAdmin" class="mx-auto max-w-5xl space-y-5">
            <AdminHeader title="App settings" subtitle="Key/value constants the platform reads at runtime. Change with care.">
                <template #actions>
                    <button type="button" class="dash-btn theme-surface theme-shadow shrink-0 px-3 py-1.5 text-[11px]" @click="startAdd">
                        <i class="pi pi-plus text-[10px]"></i> New constant
                    </button>
                </template>
            </AdminHeader>

            <section class="ui-rise relative overflow-hidden rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/30" style="animation-delay: 80ms">
                <div class="flex items-start gap-3">
                    <span class="dash-icon-tile h-10 w-10 shrink-0 bg-linear-to-br from-rose-500 to-orange-500 text-white shadow"><i class="pi pi-exclamation-triangle"></i></span>
                    <div>
                        <p class="dash-eyebrow text-rose-700 dark:text-rose-200">Danger zone</p>
                        <p class="mt-1 text-sm font-semibold text-rose-900 dark:text-rose-100">These constants drive app behaviour.</p>
                        <p class="text-xs text-rose-800/80 dark:text-rose-200/80">A wrong value can break flows for every learner. Double-check the key you are editing and keep the value type the app expects.</p>
                    </div>
                </div>
            </section>

            <Transition name="ui-fade-slide">
                <section v-if="feedback.text" class="rounded-2xl border px-4 py-3 text-sm font-semibold" :class="feedback.tone === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'">
                    {{ feedback.text }}
                </section>
            </Transition>

            <section class="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <article class="ui-rise dash-card" style="animation-delay: 140ms">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <h2 class="dash-title">Constants</h2>
                            <p class="analysis-muted mt-1">{{ settings.length }} stored. Click a row to edit it.</p>
                        </div>
                        <span class="dash-icon-tile theme-icon h-10 w-10"><i class="pi pi-sliders-h"></i></span>
                    </div>

                    <div v-if="loading" class="mt-4 space-y-2">
                        <div v-for="n in 4" :key="n" class="h-12 animate-pulse rounded-xl bg-white/80 dark:bg-sky-950/60"></div>
                    </div>
                    <div v-else-if="settings.length === 0" class="dash-card-white mt-4 flex flex-col items-center gap-2 py-8 text-center">
                        <span class="dash-icon-tile theme-icon h-12 w-12"><i class="pi pi-inbox"></i></span>
                        <p class="text-sm font-bold text-slate-800 dark:text-slate-100">No constants yet</p>
                        <p class="text-xs text-slate-500 dark:text-slate-300">Add the first one from the button above.</p>
                    </div>
                    <ul v-else class="mt-4 space-y-2">
                        <li v-for="setting in settings" :key="setting.key">
                            <button type="button" class="dash-card-white dash-hover-lift flex w-full items-center gap-3 p-3 text-left"
                                :class="currentSetting.key === setting.key && mode === 'edit' ? 'theme-border ring-2 ring-offset-0' : ''" @click="editSetting(setting)">
                                <span class="dash-icon-tile theme-icon h-9 w-9 text-sm"><i class="pi pi-key"></i></span>
                                <span class="min-w-0 flex-1">
                                    <span class="block truncate font-mono text-xs font-bold text-slate-900 dark:text-white">{{ setting.key }}</span>
                                    <span class="block truncate text-sm text-slate-600 dark:text-slate-300">{{ setting.value }}</span>
                                </span>
                                <i class="pi pi-pencil text-xs text-slate-400"></i>
                            </button>
                        </li>
                    </ul>
                </article>

                <article class="ui-rise dash-card self-start" style="animation-delay: 200ms">
                    <template v-if="mode">
                        <p class="dash-eyebrow theme-text">{{ mode === "add" ? "New constant" : "Edit constant" }}</p>
                        <h2 class="dash-title mt-1">{{ mode === "add" ? "Add a key/value pair" : currentSetting.key }}</h2>
                        <form class="mt-4 space-y-4" @submit.prevent="save">
                            <label class="block text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                Key
                                <input v-model.trim="currentSetting.key" type="text" required :disabled="mode === 'edit'" placeholder="e.g. term_start_date"
                                    class="theme-focus mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm normal-case tracking-normal text-slate-800 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 dark:border-sky-700 dark:bg-sky-950 dark:text-slate-100 dark:disabled:bg-sky-900" />
                            </label>
                            <label class="block text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                                Value
                                <textarea v-model="currentSetting.value" rows="3" required placeholder="Value the app should read"
                                    class="theme-focus mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-800 focus:outline-none dark:border-sky-700 dark:bg-sky-950 dark:text-slate-100"></textarea>
                            </label>
                            <div class="flex flex-wrap gap-2">
                                <button type="submit" class="dash-btn theme-surface theme-shadow px-5 py-2" :disabled="saving">
                                    <i :class="saving ? 'pi pi-spin pi-spinner' : 'pi pi-check'" class="text-[10px]"></i> {{ mode === "add" ? "Add constant" : "Save changes" }}
                                </button>
                                <button type="button" class="dash-btn-ghost px-4 py-2" @click="cancel">Cancel</button>
                                <button v-if="mode === 'edit'" type="button" class="dash-btn-ghost ml-auto border-rose-200 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40" :disabled="saving" @click="remove">
                                    <i class="pi pi-trash text-[10px]"></i> Delete
                                </button>
                            </div>
                        </form>
                    </template>
                    <template v-else>
                        <span class="dash-icon-tile theme-icon h-12 w-12"><i class="pi pi-pencil"></i></span>
                        <h2 class="dash-title mt-3">Nothing selected</h2>
                        <p class="analysis-muted mt-1">Pick a constant on the left to edit it, or add a new one.</p>
                        <button type="button" class="dash-btn-ghost mt-4 px-4 py-2" @click="startAdd"><i class="pi pi-plus text-[10px]"></i> New constant</button>
                    </template>
                </article>
            </section>
        </div>
        <AdminDenied v-else />
    </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import AdminHeader from "../../components/Admin/AdminHeader.vue";
import AdminDenied from "../../components/Admin/AdminDenied.vue";
import { useAuthStore } from "../../stores/authStore";

const { user } = useAuthStore();
const isSuperAdmin = computed(() => user?.roles?.[0] === "super-admin");

const settings = ref([]);
const loading = ref(false);
const saving = ref(false);
const mode = ref(null); // null | 'add' | 'edit'
const currentSetting = ref({ key: "", value: "" });
const feedback = ref({ text: "", tone: "success" });

let feedbackTimer = null;
const flash = (text, tone = "success") => {
    feedback.value = { text, tone };
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => (feedback.value = { text: "", tone }), 4000);
};

const fetchSettings = async () => {
    loading.value = true;
    try {
        const response = await axios.get("/admin/settings");
        settings.value = response.data.data || [];
    } catch (error) {
        console.error("Error fetching settings:", error);
        flash("Could not load settings.", "error");
    } finally {
        loading.value = false;
    }
};

const startAdd = () => {
    mode.value = "add";
    currentSetting.value = { key: "", value: "" };
};
const editSetting = (setting) => {
    mode.value = "edit";
    currentSetting.value = { key: setting.key, value: String(setting.value ?? "") };
};
const cancel = () => {
    mode.value = null;
    currentSetting.value = { key: "", value: "" };
};

const save = async () => {
    if (!currentSetting.value.key) return;
    saving.value = true;
    try {
        await axios.post(`/admin/settings/${encodeURIComponent(currentSetting.value.key)}`, { value: String(currentSetting.value.value) });
        flash(mode.value === "add" ? "Constant added." : "Constant updated.");
        cancel();
        fetchSettings();
    } catch (error) {
        console.error("Error saving setting:", error);
        flash(error?.response?.data?.message || "Could not save this constant.", "error");
    } finally {
        saving.value = false;
    }
};

const remove = async () => {
    if (!window.confirm(`Delete "${currentSetting.value.key}"? The app will stop reading it immediately.`)) return;
    saving.value = true;
    try {
        await axios.delete(`/admin/settings/${encodeURIComponent(currentSetting.value.key)}`);
        flash("Constant deleted.");
        cancel();
        fetchSettings();
    } catch (error) {
        console.error("Error deleting setting:", error);
        flash("Could not delete this constant.", "error");
    } finally {
        saving.value = false;
    }
};

onMounted(fetchSettings);
</script>

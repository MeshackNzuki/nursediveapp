<template>
    <div class="dash-shell">
        <div class="mx-auto max-w-screen-2xl space-y-5">
            <AdminHeader title="Users" :subtitle="`${scopeLabel} · ${formatNumber(userData.length)} accounts`" />

            <!-- Summary -->
            <section class="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div v-for="(stat, index) in summary" :key="stat.label" class="ui-rise dash-card-white flex items-center gap-3 p-3" :style="{ animationDelay: `${40 + index * 40}ms` }">
                    <span class="dash-icon-tile theme-icon h-10 w-10 shrink-0"><i :class="stat.icon"></i></span>
                    <div class="min-w-0">
                        <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ stat.label }}</p>
                        <p class="text-lg font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ stat.value }}</p>
                        <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">{{ stat.detail }}</p>
                    </div>
                </div>
            </section>

            <!-- Scope + quick filters -->
            <section class="ui-rise flex flex-wrap items-center gap-2" style="animation-delay: 200ms">
                <router-link v-for="scope in scopes" :key="scope.key" :to="`/admin/users?${scope.key}=1`" class="dash-chip text-[11px]"
                    :class="currentScope === scope.key ? 'theme-surface border-transparent shadow-md' : 'theme-soft theme-focus'">
                    <i :class="scope.icon" class="text-[10px]"></i> {{ scope.label }}
                </router-link>
                <span class="mx-1 hidden h-5 w-px bg-slate-200 sm:block dark:bg-sky-800"></span>
                <button v-for="quick in quickFilters" :key="quick.key" type="button" class="dash-chip text-[11px]"
                    :class="quickFilter === quick.key ? 'border-slate-800 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' : 'border-slate-200 bg-white text-slate-600 dark:border-sky-800 dark:bg-transparent dark:text-slate-200'"
                    @click="quickFilter = quick.key">
                    {{ quick.label }} <span class="rounded-full bg-white/25 px-1.5 text-[10px] tabular-nums dark:bg-black/10">{{ quick.count }}</span>
                </button>
            </section>

            <Table :headers="['NAME', 'EMAIL', 'JOINED', 'LAST ACTIVE', 'SUBSCRIPTION', 'ROLE', 'ACTION']" title="User management" icon="pi pi-users"
                search_placeholder="Search name, email, role" :rows="filteredUsers.length" v-model:query="query" empty-hint="No users match this scope and search.">
                <template #actions>
                    <button type="button" class="dash-btn-ghost px-3 py-1.5 text-[11px]" :disabled="loading" @click="fetchUsers">
                        <i :class="loading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'" class="text-[10px]"></i> Refresh
                    </button>
                </template>
                <template #content>
                    <tr v-for="user in filteredUsers" :key="user.id" class="transition hover:bg-light-blue-500/60 dark:hover:bg-sky-900/40">
                        <td class="p-2 whitespace-nowrap">
                            <div class="flex items-center gap-2">
                                <span class="dash-icon-tile theme-icon h-8 w-8 text-xs font-bold">{{ initials(user.name) }}</span>
                                <div>
                                    <div class="font-semibold text-slate-800 dark:text-slate-100">{{ user.name }}</div>
                                    <div class="text-[11px] text-slate-500 dark:text-slate-400">#{{ user.id }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="p-2 whitespace-nowrap text-slate-700 dark:text-slate-200">{{ user.email }}</td>
                        <td class="p-2 whitespace-nowrap text-xs">
                            <div class="font-semibold text-slate-800 dark:text-slate-100">{{ new Date(user.created_at).toLocaleDateString() }}</div>
                            <div class="text-[11px] text-slate-500 dark:text-slate-400">{{ timeAgo(user.created_at) }}</div>
                        </td>
                        <td class="p-2 whitespace-nowrap">
                            <span class="inline-flex items-center gap-1.5 text-xs font-semibold" :class="activityTone(user.last_active).text">
                                <span class="h-2 w-2 rounded-full" :class="activityTone(user.last_active).dot"></span>
                                {{ user.last_active ? timeAgo(user.last_active) : "Never" }}
                            </span>
                        </td>
                        <td class="p-2 whitespace-nowrap">
                            <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                                :class="user.subscribed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'">
                                <i :class="user.subscribed ? 'pi pi-verified' : 'pi pi-minus-circle'" class="text-[9px]"></i>
                                {{ user.subscribed ? "Active" : "None" }}
                            </span>
                        </td>
                        <td class="p-2 whitespace-nowrap">
                            <span class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold capitalize" :class="roleName(user) === 'student' ? 'theme-soft' : 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200'">
                                {{ roleName(user) }}
                            </span>
                        </td>
                        <td class="p-2 whitespace-nowrap text-center">
                            <button v-if="isSuperAdmin" type="button" class="dash-btn-ghost px-3 py-1 text-[11px]" @click="showModal('permissions' + user.id)">
                                <i class="pi pi-key text-[10px]"></i> Permissions
                            </button>
                        </td>

                        <dialog :id="'permissions' + user.id" class="modal modal-bottom sm:modal-middle">
                            <div class="modal-box w-11/12 max-w-3xl rounded-2xl dark:bg-sky-950 dark:text-slate-200">
                                <Success :msg="flashMessage" />
                                <form method="dialog">
                                    <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
                                </form>
                                <p class="dash-eyebrow theme-text">Permissions</p>
                                <h3 class="mt-1 text-lg font-extrabold text-slate-950 dark:text-white">{{ user.name }}</h3>
                                <p class="text-xs text-slate-500 dark:text-slate-300">Role: <strong class="capitalize">{{ roleName(user) }}</strong></p>
                                <form class="mt-4" @submit.prevent="updatePermissions(user.id)">
                                    <div class="dash-tile-soft grid grid-cols-2 gap-3 md:grid-cols-3">
                                        <label v-for="permission in permissions" :key="permission.id" class="flex cursor-pointer items-center gap-2 text-sm">
                                            <input type="checkbox" :value="permission.name" v-model="editedUser.permissions" class="checkbox checkbox-sm dark:checkbox-success" />
                                            <span>{{ permission.name }}</span>
                                        </label>
                                        <p v-if="permissions.length === 0" class="col-span-full text-xs text-slate-500">No permissions have been defined yet.</p>
                                    </div>
                                    <div class="mt-4 flex justify-end">
                                        <button type="submit" class="dash-btn theme-surface theme-shadow px-5 py-2"><i class="pi pi-check text-[10px]"></i> Update permissions</button>
                                    </div>
                                </form>
                            </div>
                        </dialog>
                    </tr>
                </template>
            </Table>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import Table from "../../components/Tables/mainTable.vue";
import AdminHeader from "../../components/Admin/AdminHeader.vue";
import Success from "../../components/Flash/Success.vue";
import { timeAgo } from "../../utils/timeAgo";
import { useAuthStore } from "../../stores/authStore";

const toastPrime = useToast();
const route = useRoute();
const { user: me } = useAuthStore();

const isSuperAdmin = computed(() => me?.roles?.[0] === "super-admin");

const permissions = ref([]);
const userData = ref([]);
const loading = ref(false);
const query = ref("");
const flashMessage = ref("");
const quickFilter = ref("all");
const editedUser = ref({ permissions: [] });

const scopes = [
    { key: "all", label: "All users", icon: "pi pi-th-large" },
    { key: "teas", label: "TEAS", icon: "pi pi-file-edit" },
    { key: "nursing", label: "Nursing", icon: "pi pi-briefcase" },
    { key: "nclex", label: "NCLEX", icon: "pi pi-bolt" },
];
const currentScope = computed(() => scopes.find((s) => s.key !== "all" && route.query[s.key])?.key || "all");
const scopeLabel = computed(() => (currentScope.value === "all" ? "Every account" : `${scopes.find((s) => s.key === currentScope.value).label} learners`));

const DAY = 86_400_000;
const numberFormatter = new Intl.NumberFormat("en-US");
const formatNumber = (v) => numberFormatter.format(Number(v) || 0);
const sinceDays = (value, days) => Boolean(value) && Date.now() - new Date(value).getTime() <= days * DAY;
const roleName = (user) => (user.roles?.length > 0 ? user.roles.map((r) => r.name).join(", ") : "student");
const initials = (name) =>
    String(name || "?")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join("");
const activityTone = (lastActive) => {
    if (sinceDays(lastActive, 1)) return { dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300" };
    if (sinceDays(lastActive, 7)) return { dot: "bg-amber-400", text: "text-amber-700 dark:text-amber-300" };
    return { dot: "bg-slate-300 dark:bg-slate-600", text: "text-slate-500 dark:text-slate-400" };
};

const counts = computed(() => ({
    all: userData.value.length,
    subscribed: userData.value.filter((u) => u.subscribed).length,
    active7: userData.value.filter((u) => sinceDays(u.last_active, 7)).length,
    new30: userData.value.filter((u) => sinceDays(u.created_at, 30)).length,
    admins: userData.value.filter((u) => roleName(u) !== "student").length,
}));

const quickFilters = computed(() => [
    { key: "all", label: "Everyone", count: counts.value.all },
    { key: "subscribed", label: "Subscribed", count: counts.value.subscribed },
    { key: "active7", label: "Active 7d", count: counts.value.active7 },
    { key: "new30", label: "Joined 30d", count: counts.value.new30 },
    { key: "admins", label: "Staff", count: counts.value.admins },
]);

const summary = computed(() => [
    { label: "Accounts", value: formatNumber(counts.value.all), detail: scopeLabel.value, icon: "pi pi-users" },
    { label: "Subscribed", value: formatNumber(counts.value.subscribed), detail: counts.value.all ? `${((counts.value.subscribed / counts.value.all) * 100).toFixed(1)}% of scope` : "No accounts yet", icon: "pi pi-verified" },
    { label: "Active 7 days", value: formatNumber(counts.value.active7), detail: `${formatNumber(userData.value.filter((u) => sinceDays(u.last_active, 1)).length)} seen today`, icon: "pi pi-wave-pulse" },
    { label: "Joined 30 days", value: formatNumber(counts.value.new30), detail: `${formatNumber(userData.value.filter((u) => sinceDays(u.created_at, 7)).length)} this week`, icon: "pi pi-user-plus" },
]);

const filteredUsers = computed(() => {
    let rows = userData.value;
    if (quickFilter.value === "subscribed") rows = rows.filter((u) => u.subscribed);
    else if (quickFilter.value === "active7") rows = rows.filter((u) => sinceDays(u.last_active, 7));
    else if (quickFilter.value === "new30") rows = rows.filter((u) => sinceDays(u.created_at, 30));
    else if (quickFilter.value === "admins") rows = rows.filter((u) => roleName(u) !== "student");

    const q = (query.value || "").trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.roles?.some((r) => r.name.toLowerCase().includes(q)) || u.phone?.toLowerCase().includes(q));
});

const showModal = (modalId) => {
    if (modalId.startsWith("permissions")) {
        flashMessage.value = "";
        const target = userData.value.find((u) => u.id === parseInt(modalId.replace("permissions", ""), 10));
        editedUser.value.permissions = target ? target.permissions.map((p) => p.name) : [];
    }
    document.getElementById(modalId)?.showModal();
};

const fetchUsers = async () => {
    loading.value = true;
    try {
        const response = await axios.post("admin/users", route.query);
        userData.value = response.data.data.users;
    } catch (error) {
        console.error("Error fetching users:", error);
    } finally {
        loading.value = false;
    }
};

const fetchPermissions = async () => {
    try {
        const response = await axios.get("admin/user/permissions/");
        permissions.value = response.data.data.permissions;
    } catch (error) {
        console.error("Error fetching permissions:", error);
    }
};

const updatePermissions = async (userId) => {
    try {
        const response = await axios.put(`/admin/users/${userId}/permissions`, { permissions: editedUser.value.permissions });
        flashMessage.value = "Permissions updated successfully";
        fetchUsers();
        if (response.data.success) {
            toastPrime.add({ severity: "success", summary: "Permissions updated", detail: "User permissions updated successfully", life: 3000 });
        }
    } catch (error) {
        console.error("Error updating permissions:", error);
        toastPrime.add({ severity: "error", summary: "Update error", detail: "Error updating permissions", life: 3000 });
    }
};

onMounted(() => {
    fetchUsers();
    fetchPermissions();
});

watch(() => route.query, fetchUsers);
</script>

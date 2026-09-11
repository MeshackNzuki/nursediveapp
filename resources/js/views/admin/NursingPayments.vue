<template>
    <div class="dash-shell">
        <div v-if="isSuperAdmin" class="mx-auto max-w-screen-2xl space-y-5">
            <AdminHeader title="Nursing payments" subtitle="Completed payments for Nursing plans, newest first." />
            <AdminPaymentsTable product="nursing" title="Nursing payments" />
        </div>
        <AdminDenied v-else />
    </div>
</template>

<script setup>
import { computed } from "vue";
import AdminHeader from "../../components/Admin/AdminHeader.vue";
import AdminDenied from "../../components/Admin/AdminDenied.vue";
import AdminPaymentsTable from "../../components/Admin/AdminPaymentsTable.vue";
import { useAuthStore } from "../../stores/authStore";

const { user } = useAuthStore();
const isSuperAdmin = computed(() => user?.roles?.[0] === "super-admin");
</script>

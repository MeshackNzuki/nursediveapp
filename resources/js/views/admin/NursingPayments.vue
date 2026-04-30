<template>
    <div v-if="user.roles[0] == 'super-admin'">
        <Table :headers="[
            'EMAIL',
            'PRODUCT',
            'AMOUNT',
            'STATUS',
            'TRANSACTION ID',
            'RECEIPT NUMBER',
            'PAID AT'
        ]" title="Nursing Payments" search_placeholder="Search Payments" :rows="filteredPayments.length"
            v-model:search="search">
            <template v-slot:content>
                <tr v-for="(payment, index) in filteredPayments" :key="index">
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ payment.email }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ payment.product_code }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>${{ payment.amount }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div :class="payment.status == 'completed' ? 'text-teal-600' : 'text-red-600'">
                            {{ payment.status }}
                        </div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ payment.transaction_id }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ payment.receipt_number }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ formatDate(payment.paid_at) }}</div>
                    </td>
                </tr>
            </template>
        </Table>
    </div>
    <div v-else>
        <p>Error fetching page</p>
    </div>
</template>

<script setup>
import Table from "../../components/Tables/mainTable.vue";
import { ref, computed, onMounted } from "vue";
import axios from "axios";

import { useAuthStore } from "../../stores/authStore";


const { user } = useAuthStore()

const payments = ref([]);
const search = ref("");

// fetch payments
const fetchPayments = async () => {
    try {
        const { data } = await axios.get("/admin/nursing-payments");
        payments.value = data?.data || [];
    } catch (error) {
        console.error("Error fetching payments:", error);
    }
};

// frontend search
const filteredPayments = computed(() => {
    if (!search.value) return payments.value;
    return payments.value.filter((p) =>
        [p.email, p.product_code, p.transaction_id, p.receipt_number, p.status]
            .filter(Boolean)
            .some((field) =>
                field.toLowerCase().includes(search.value.toLowerCase())
            )
    );
});

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
};

onMounted(fetchPayments);
</script>

<template>
    <div class="space-y-5">
        <!-- Summary -->
        <section class="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div v-for="(stat, index) in summary" :key="stat.label" class="ui-rise dash-card-white flex items-center gap-3 p-3" :style="{ animationDelay: `${40 + index * 40}ms` }">
                <span class="dash-icon-tile theme-icon h-10 w-10 shrink-0"><i :class="stat.icon"></i></span>
                <div class="min-w-0">
                    <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ stat.label }}</p>
                    <p class="truncate text-lg font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ stat.value }}</p>
                    <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">{{ stat.detail }}</p>
                </div>
            </div>
        </section>

        <!-- Filters -->
        <section class="ui-rise flex flex-wrap items-center gap-2" style="animation-delay: 200ms">
            <template v-if="product === 'all'">
                <button v-for="chip in productChips" :key="chip.code" type="button" class="dash-chip text-[11px]"
                    :class="productFilter === chip.code ? 'theme-surface border-transparent shadow-md' : 'theme-soft theme-focus'"
                    @click="productFilter = chip.code">
                    <i :class="chip.icon" class="text-[10px]"></i> {{ chip.label }}
                    <span class="rounded-full bg-white/25 px-1.5 text-[10px] tabular-nums dark:bg-white/10">{{ countFor(chip.code) }}</span>
                </button>
                <span class="mx-1 hidden h-5 w-px bg-slate-200 sm:block dark:bg-sky-800"></span>
            </template>
            <button v-for="chip in rangeChips" :key="chip.days" type="button" class="dash-chip text-[11px]"
                :class="rangeDays === chip.days ? 'border-slate-800 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' : 'border-slate-200 bg-white text-slate-600 dark:border-sky-800 dark:bg-transparent dark:text-slate-200'"
                @click="rangeDays = chip.days">
                {{ chip.label }}
            </button>
        </section>

        <div v-if="error" class="analysis-state-error flex flex-wrap items-center justify-between gap-3">
            <span>{{ error }}</span>
            <button type="button" class="dash-btn bg-rose-600 px-4 py-1.5 text-xs text-white" @click="fetchPayments">Retry</button>
        </div>

        <Table v-else :headers="['EMAIL', 'PRODUCT', 'AMOUNT', 'STATUS', 'TRANSACTION ID', 'RECEIPT NUMBER', 'PAID AT']" :title="title" icon="pi pi-wallet"
            search_placeholder="Search email, receipt, transaction" :rows="filteredPayments.length" v-model:query="search"
            empty-hint="Completed payments will show up here the moment they land.">
            <template #actions>
                <button type="button" class="dash-btn-ghost px-3 py-1.5 text-[11px]" :disabled="loading" @click="fetchPayments">
                    <i :class="loading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'" class="text-[10px]"></i> Refresh
                </button>
                <button type="button" class="dash-btn-ghost px-3 py-1.5 text-[11px]" :disabled="filteredPayments.length === 0" @click="exportCsv">
                    <i class="pi pi-download text-[10px]"></i> CSV
                </button>
            </template>
            <template #content>
                <tr v-for="(payment, index) in filteredPayments" :key="`${payment.transaction_id}-${index}`" class="transition hover:bg-light-blue-500/60 dark:hover:bg-sky-900/40">
                    <td class="p-2 whitespace-nowrap">
                        <div class="flex items-center gap-2">
                            <span class="dash-icon-tile h-7 w-7 text-[11px] font-bold theme-icon">{{ initial(payment.email) }}</span>
                            <span class="font-semibold text-slate-800 dark:text-slate-100">{{ payment.email || "-" }}</span>
                        </div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <span class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold" :class="productStyle(payment.product_code).badge">
                            <i :class="productStyle(payment.product_code).icon" class="text-[9px]"></i> {{ productStyle(payment.product_code).label }}
                        </span>
                    </td>
                    <td class="p-2 whitespace-nowrap font-extrabold tabular-nums text-slate-900 dark:text-white">{{ formatCurrency(payment.amount) }}</td>
                    <td class="p-2 whitespace-nowrap">
                        <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                            :class="payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'">
                            <i :class="payment.status === 'completed' ? 'pi pi-check-circle' : 'pi pi-times-circle'" class="text-[9px]"></i> {{ payment.status }}
                        </span>
                    </td>
                    <td class="p-2 whitespace-nowrap font-mono text-xs text-slate-600 dark:text-slate-300">{{ payment.transaction_id || "-" }}</td>
                    <td class="p-2 whitespace-nowrap font-mono text-xs text-slate-600 dark:text-slate-300">{{ payment.receipt_number || "-" }}</td>
                    <td class="p-2 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
                        <div class="font-semibold text-slate-800 dark:text-slate-100">{{ formatDate(payment.paid_at) }}</div>
                        <div class="text-[11px] text-slate-500 dark:text-slate-400">{{ timeAgo(payment.paid_at) }}</div>
                    </td>
                </tr>
            </template>
        </Table>
    </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import Table from "../Tables/mainTable.vue";
import { timeAgo } from "../../utils/timeAgo";

type ProductCode = "teas" | "nursing" | "nclex";
type PaymentRow = {
    email: string | null;
    product_code: ProductCode | string | null;
    amount: number | string | null;
    status: string;
    transaction_id: string | null;
    receipt_number: string | null;
    paid_at: string | null;
};

const props = withDefaults(defineProps<{ product?: ProductCode | "all"; title?: string }>(), { product: "all", title: "Payments" });

const ENDPOINTS: Record<ProductCode, string> = { teas: "/admin/teas-payments", nursing: "/admin/nursing-payments", nclex: "/admin/nclex-payments" };
const PRODUCT_STYLE: Record<ProductCode, { label: string; icon: string; badge: string }> = {
    teas: { label: "TEAS", icon: "pi pi-file-edit", badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200" },
    nursing: { label: "Nursing", icon: "pi pi-briefcase", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200" },
    nclex: { label: "NCLEX", icon: "pi pi-bolt", badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" },
};
const productStyle = (code: string | null | undefined) => PRODUCT_STYLE[(code || "teas") as ProductCode] || { label: String(code || "-"), icon: "pi pi-tag", badge: "bg-slate-100 text-slate-700" };

const payments = ref<PaymentRow[]>([]);
const loading = ref(false);
const error = ref("");
const search = ref("");
const productFilter = ref<ProductCode | "all">("all");
const rangeDays = ref<number>(0);

const productChips = [
    { code: "all" as const, label: "All products", icon: "pi pi-th-large" },
    { code: "teas" as const, label: "TEAS", icon: "pi pi-file-edit" },
    { code: "nursing" as const, label: "Nursing", icon: "pi pi-briefcase" },
    { code: "nclex" as const, label: "NCLEX", icon: "pi pi-bolt" },
];
const rangeChips = [
    { days: 0, label: "All time" },
    { days: 7, label: "7 days" },
    { days: 30, label: "30 days" },
    { days: 90, label: "90 days" },
];

const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const formatCurrency = (value: unknown) => currencyFormatter.format(Number(value) || 0);
const formatDate = (value: string | null) => (value ? new Date(value).toLocaleString() : "-");
const initial = (email: string | null) => (email ? email.trim().charAt(0).toUpperCase() : "?");
const countFor = (code: ProductCode | "all") => (code === "all" ? payments.value.length : payments.value.filter((p) => p.product_code === code).length);

const fetchPayments = async () => {
    loading.value = true;
    error.value = "";
    try {
        const codes: ProductCode[] = props.product === "all" ? ["teas", "nursing", "nclex"] : [props.product];
        const responses = await Promise.all(codes.map((code) => axios.get(ENDPOINTS[code])));
        payments.value = responses
            .flatMap((res) => (res.data?.data || []) as PaymentRow[])
            .sort((a, b) => new Date(b.paid_at || 0).getTime() - new Date(a.paid_at || 0).getTime());
    } catch (err) {
        console.error("Error fetching payments:", err);
        error.value = "Could not load payments. Please retry.";
    } finally {
        loading.value = false;
    }
};

const rangeFiltered = computed(() => {
    let rows = payments.value;
    if (productFilter.value !== "all") rows = rows.filter((p) => p.product_code === productFilter.value);
    if (rangeDays.value > 0) {
        const cutoff = Date.now() - rangeDays.value * 86_400_000;
        rows = rows.filter((p) => p.paid_at && new Date(p.paid_at).getTime() >= cutoff);
    }
    return rows;
});

const filteredPayments = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return rangeFiltered.value;
    return rangeFiltered.value.filter((p) =>
        [p.email, p.product_code, p.transaction_id, p.receipt_number, p.status].filter(Boolean).some((field) => String(field).toLowerCase().includes(q)),
    );
});

const summary = computed(() => {
    const rows = rangeFiltered.value;
    const completed = rows.filter((p) => p.status === "completed");
    const revenue = completed.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const payers = new Set(completed.map((p) => p.email).filter(Boolean)).size;
    const latest = rows[0]?.paid_at;
    const scope = rangeDays.value > 0 ? `last ${rangeDays.value} days` : "all time";
    return [
        { label: "Revenue", value: formatCurrency(revenue), detail: scope, icon: "pi pi-wallet" },
        { label: "Payments", value: completed.length.toLocaleString(), detail: `${rows.length - completed.length} not completed`, icon: "pi pi-receipt" },
        { label: "Unique payers", value: payers.toLocaleString(), detail: payers ? `${formatCurrency(revenue / payers)} per payer` : "No payers yet", icon: "pi pi-users" },
        { label: "Latest payment", value: latest ? timeAgo(latest) : "-", detail: latest ? formatDate(latest) : "Waiting for the first one", icon: "pi pi-clock" },
    ];
});

const exportCsv = () => {
    const header = ["email", "product", "amount", "status", "transaction_id", "receipt_number", "paid_at"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = filteredPayments.value.map((p) => [p.email, p.product_code, p.amount, p.status, p.transaction_id, p.receipt_number, p.paid_at].map(escape).join(","));
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.product}-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

onMounted(fetchPayments);
</script>

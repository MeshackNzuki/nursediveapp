<template>
    <div class="dash-shell">
        <div v-if="canView" class="mx-auto max-w-screen-2xl space-y-5">
            <AdminHeader title="Exam feedback" subtitle="Issues learners flagged on questions while practising. Triage new reports first." />

            <section class="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div v-for="(stat, index) in summary" :key="stat.label" class="ui-rise dash-card-white flex items-center gap-3 p-3" :style="{ animationDelay: `${40 + index * 40}ms` }">
                    <span class="dash-icon-tile h-10 w-10 shrink-0" :class="stat.tile || 'theme-icon'"><i :class="stat.icon"></i></span>
                    <div class="min-w-0">
                        <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ stat.label }}</p>
                        <p class="truncate text-lg font-extrabold leading-tight tabular-nums text-slate-950 dark:text-white">{{ stat.value }}</p>
                        <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">{{ stat.detail }}</p>
                    </div>
                </div>
            </section>

            <section class="ui-rise flex flex-wrap items-center gap-2" style="animation-delay: 200ms">
                <button v-for="chip in statusChips" :key="chip.key" type="button" class="dash-chip text-[11px]"
                    :class="statusFilter === chip.key ? 'theme-surface border-transparent shadow-md' : 'theme-soft theme-focus'" @click="statusFilter = chip.key">
                    {{ chip.label }} <span class="rounded-full bg-white/25 px-1.5 text-[10px] tabular-nums dark:bg-white/10">{{ chip.count }}</span>
                </button>
                <span class="mx-1 hidden h-5 w-px bg-slate-200 sm:block dark:bg-sky-800"></span>
                <button v-for="chip in productChips" :key="chip.key" type="button" class="dash-chip text-[11px]"
                    :class="productFilter === chip.key ? 'border-slate-800 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' : 'border-slate-200 bg-white text-slate-600 dark:border-sky-800 dark:bg-transparent dark:text-slate-200'"
                    @click="productFilter = chip.key">
                    {{ chip.label }}
                </button>
            </section>

            <Table :headers="['DATE', 'USER', 'PRODUCT', 'MODE', 'QUESTION', 'TYPE', 'MESSAGE', 'STATUS', 'ACTION']" title="Feedback inbox" icon="pi pi-comments"
                search_placeholder="Search feedback" :rows="filteredFeedback.length" v-model:query="query" empty-hint="No feedback matches these filters. That is usually good news.">
                <template #actions>
                    <button type="button" class="dash-btn-ghost px-3 py-1.5 text-[11px]" :disabled="loading" @click="fetchFeedback">
                        <i :class="loading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'" class="text-[10px]"></i> Refresh
                    </button>
                </template>
                <template #content>
                    <tr v-for="item in filteredFeedback" :key="item.id" class="cursor-pointer transition hover:bg-light-blue-500/60 dark:hover:bg-sky-900/40" @click="openIssueModal(item)">
                        <td class="p-2 whitespace-nowrap text-xs">
                            <div class="font-semibold text-slate-800 dark:text-slate-100">{{ formatDate(item.created_at) }}</div>
                            <div class="text-[11px] text-slate-500 dark:text-slate-400">{{ timeAgo(item.created_at) }}</div>
                        </td>
                        <td class="p-2 whitespace-nowrap">
                            <div class="font-semibold text-slate-800 dark:text-slate-100">{{ item.user_name || "Anonymous" }}</div>
                            <div class="text-[11px] text-slate-500 dark:text-slate-400">{{ item.user_email || "-" }}</div>
                        </td>
                        <td class="p-2 whitespace-nowrap">
                            <span class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold uppercase" :class="productBadge(item.source_product)">{{ item.source_product || "-" }}</span>
                        </td>
                        <td class="p-2 whitespace-nowrap text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">{{ item.exam_mode || "-" }}</td>
                        <td class="p-2 whitespace-nowrap font-mono text-xs text-slate-600 dark:text-slate-300">{{ item.question_id || "-" }}</td>
                        <td class="p-2 whitespace-nowrap">
                            <span class="analysis-pill theme-soft border text-[11px] capitalize">{{ humanizeIssueType(item.issue_type) }}</span>
                        </td>
                        <td class="min-w-[320px] p-2 text-xs text-slate-700 dark:text-slate-200">{{ truncate(item.message, 120) }}</td>
                        <td class="p-2 whitespace-nowrap">
                            <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold" :class="item.status === 'new' || !item.status ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'">
                                <i :class="item.status === 'new' || !item.status ? 'pi pi-circle-fill' : 'pi pi-check'" class="text-[8px]"></i> {{ item.status || "new" }}
                            </span>
                        </td>
                        <td class="p-2 text-center whitespace-nowrap">
                            <button type="button" class="dash-btn-ghost px-3 py-1 text-[11px]" @click.stop="openIssueModal(item)"><i class="pi pi-eye text-[10px]"></i> View</button>
                        </td>
                    </tr>
                </template>
            </Table>

            <dialog id="feedback_issue_modal" class="modal modal-bottom sm:modal-middle">
                <div class="modal-box w-11/12 max-w-3xl rounded-2xl dark:bg-sky-950 dark:text-slate-200">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
                    </form>

                    <template v-if="selectedIssue">
                        <p class="dash-eyebrow theme-text">Feedback issue</p>
                        <h3 class="mt-1 text-lg font-extrabold text-slate-950 capitalize dark:text-white">{{ humanizeIssueType(selectedIssue.issue_type) }}</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-300">Reported {{ formatDate(selectedIssue.created_at) }} · {{ selectedIssue.status || "new" }}</p>

                        <dl class="mt-4 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                            <div v-for="cell in issueCells" :key="cell.label" class="dash-tile-soft px-3 py-2">
                                <dt class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ cell.label }}</dt>
                                <dd class="mt-0.5 truncate font-semibold text-slate-900 dark:text-white" :title="cell.value">{{ cell.value }}</dd>
                            </div>
                        </dl>

                        <div class="mt-4">
                            <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Message</p>
                            <pre class="mt-1 whitespace-pre-wrap rounded-xl bg-light-blue-500 p-3 text-xs text-slate-700 dark:bg-sky-900/70 dark:text-slate-200">{{ selectedIssue.message || "-" }}</pre>
                        </div>
                        <div class="mt-3">
                            <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Route</p>
                            <p class="mt-1 truncate font-mono text-xs text-slate-600 dark:text-slate-300">{{ selectedIssue.route || "-" }}</p>
                        </div>
                        <details class="mt-3">
                            <summary class="cursor-pointer text-[11px] font-bold text-slate-600 dark:text-slate-300">Metadata</summary>
                            <pre class="mt-1 whitespace-pre-wrap rounded-xl bg-slate-100 p-3 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-200">{{ formatMetadata(selectedIssue.metadata) }}</pre>
                        </details>

                        <div class="mt-4 flex flex-wrap items-center gap-2">
                            <button type="button" class="dash-btn-ghost px-3 py-1.5 text-xs opacity-60" disabled title="Coming soon"><i class="pi pi-search text-[10px]"></i> Pull question</button>
                            <button type="button" class="dash-btn-ghost px-3 py-1.5 text-xs opacity-60" disabled title="Coming soon"><i class="pi pi-pencil text-[10px]"></i> Edit question</button>
                            <span class="text-[11px] text-slate-500 dark:text-slate-400">Question tools stay admin-only and arrive in a later release.</span>
                        </div>
                    </template>
                </div>
            </dialog>
        </div>
        <AdminDenied v-else message="Only admins can review exam feedback." />
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import Table from "../../components/Tables/mainTable.vue";
import AdminHeader from "../../components/Admin/AdminHeader.vue";
import AdminDenied from "../../components/Admin/AdminDenied.vue";
import { useAuthStore } from "../../stores/authStore";
import { timeAgo } from "../../utils/timeAgo";

const { user } = useAuthStore();
const query = ref("");
const feedback = ref([]);
const loading = ref(false);
const selectedIssue = ref(null);
const statusFilter = ref("all");
const productFilter = ref("all");

const activeRole = computed(() => {
    const role = user?.roles?.[0];
    if (typeof role === "string") return role;
    return role?.name || "";
});
const canView = computed(() => ["super-admin", "admin"].includes(activeRole.value));

const isNew = (item) => !item.status || item.status === "new";
const DAY = 86_400_000;

const statusChips = computed(() => [
    { key: "all", label: "All", count: feedback.value.length },
    { key: "new", label: "New", count: feedback.value.filter(isNew).length },
    { key: "resolved", label: "Resolved", count: feedback.value.filter((i) => !isNew(i)).length },
]);
const productChips = [
    { key: "all", label: "All products" },
    { key: "teas", label: "TEAS" },
    { key: "nursing", label: "Nursing" },
    { key: "nclex", label: "NCLEX" },
];
const productBadge = (code) =>
    ({
        teas: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200",
        nursing: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
        nclex: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
    })[String(code || "").toLowerCase()] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

const summary = computed(() => {
    const total = feedback.value.length;
    const fresh = feedback.value.filter(isNew).length;
    const week = feedback.value.filter((i) => i.created_at && Date.now() - new Date(i.created_at).getTime() <= 7 * DAY).length;
    const typeCounts = feedback.value.reduce((acc, i) => {
        const key = i.issue_type || "other";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    return [
        { label: "Reports", value: total.toLocaleString(), detail: `${week} in the last 7 days`, icon: "pi pi-inbox" },
        { label: "Awaiting triage", value: fresh.toLocaleString(), detail: fresh ? "Start with these" : "Inbox zero", icon: "pi pi-exclamation-circle", tile: fresh ? "bg-linear-to-br from-amber-400 to-orange-500 text-white shadow" : "theme-icon" },
        { label: "Resolved", value: (total - fresh).toLocaleString(), detail: total ? `${(((total - fresh) / total) * 100).toFixed(0)}% of all reports` : "-", icon: "pi pi-check-circle" },
        { label: "Most common", value: topType ? humanizeIssueType(topType[0]) : "-", detail: topType ? `${topType[1]} reports` : "No pattern yet", icon: "pi pi-tag" },
    ];
});

const filteredFeedback = computed(() => {
    let rows = feedback.value;
    if (statusFilter.value === "new") rows = rows.filter(isNew);
    else if (statusFilter.value === "resolved") rows = rows.filter((i) => !isNew(i));
    if (productFilter.value !== "all") rows = rows.filter((i) => String(i.source_product || "").toLowerCase() === productFilter.value);

    const q = query.value.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((item) =>
        [item.user_name, item.user_email, item.source_product, item.exam_mode, item.question_id ? String(item.question_id) : "", item.issue_type, item.message, item.status]
            .filter(Boolean)
            .some((field) => String(field).toLowerCase().includes(q)),
    );
});

const issueCells = computed(() => {
    const i = selectedIssue.value;
    if (!i) return [];
    return [
        { label: "Reporter", value: i.user_name || "-" },
        { label: "Email", value: i.user_email || "-" },
        { label: "Product", value: (i.source_product || "-").toUpperCase() },
        { label: "Mode", value: (i.exam_mode || "-").toUpperCase() },
        { label: "Exam ID", value: i.exam_id || "-" },
        { label: "Question ID", value: i.question_id || "-" },
        { label: "Status", value: i.status || "new" },
        { label: "Date", value: formatDate(i.created_at) },
    ];
});

const fetchFeedback = async () => {
    if (!canView.value) return;
    loading.value = true;
    try {
        const { data } = await axios.get("/admin/exam-feedback");
        feedback.value = data?.data || [];
    } catch (error) {
        console.error("Error fetching exam feedback:", error);
    } finally {
        loading.value = false;
    }
};

const openIssueModal = (item) => {
    selectedIssue.value = item;
    document.getElementById("feedback_issue_modal")?.showModal();
};

const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");
function humanizeIssueType(type) {
    if (!type) return "-";
    return String(type).replaceAll("_", " ");
}
const truncate = (value, max = 120) => {
    const text = String(value || "");
    return text.length <= max ? text : `${text.slice(0, max)}...`;
};
const formatMetadata = (metadata) => {
    if (!metadata) return "-";
    try {
        return JSON.stringify(metadata, null, 2);
    } catch {
        return String(metadata);
    }
};

onMounted(fetchFeedback);
</script>

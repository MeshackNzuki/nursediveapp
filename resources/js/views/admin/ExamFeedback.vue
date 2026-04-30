<template>
    <div v-if="canView">
        <Table :headers="[
            'DATE',
            'USER',
            'PRODUCT',
            'MODE',
            'QUESTION ID',
            'TYPE',
            'MESSAGE',
            'STATUS',
            'ACTION'
        ]" title="Exam Feedback" search_placeholder="Search feedback" :rows="filteredFeedback.length"
            v-model:query="query">
            <template v-slot:content>
                <tr v-for="item in filteredFeedback" :key="item.id">
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ formatDate(item.created_at) }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div class="font-semibold">{{ item.user_name || '-' }}</div>
                        <div class="text-xs text-slate-500">{{ item.user_email || '-' }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div class="uppercase">{{ item.source_product }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div class="uppercase">{{ item.exam_mode || '-' }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ item.question_id || '-' }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <div>{{ humanizeIssueType(item.issue_type) }}</div>
                    </td>
                    <td class="p-2 min-w-[360px]">
                        <div>{{ truncate(item.message, 120) }}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <span :class="[
                            'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
                            item.status === 'new'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                        ]">
                            {{ item.status || 'new' }}
                        </span>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                        <button type="button"
                            class="rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
                            @click="openIssueModal(item)">
                            View
                        </button>
                    </td>
                </tr>
            </template>
        </Table>

        <dialog id="feedback_issue_modal" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box w-11/12 max-w-3xl dark:bg-sky-950 dark:text-slate-200">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button>
                </form>

                <h3 class="text-lg font-semibold">Feedback Issue Details</h3>

                <div v-if="selectedIssue" class="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    <div><span class="font-semibold">Date:</span> {{ formatDate(selectedIssue.created_at) }}</div>
                    <div><span class="font-semibold">Status:</span> {{ selectedIssue.status || 'new' }}</div>
                    <div><span class="font-semibold">Reporter:</span> {{ selectedIssue.user_name || '-' }}</div>
                    <div><span class="font-semibold">Email:</span> {{ selectedIssue.user_email || '-' }}</div>
                    <div><span class="font-semibold">Product:</span> {{ selectedIssue.source_product || '-' }}</div>
                    <div><span class="font-semibold">Mode:</span> {{ selectedIssue.exam_mode || '-' }}</div>
                    <div><span class="font-semibold">Exam ID:</span> {{ selectedIssue.exam_id || '-' }}</div>
                    <div><span class="font-semibold">Question ID:</span> {{ selectedIssue.question_id || '-' }}</div>
                    <div class="md:col-span-2"><span class="font-semibold">Type:</span> {{
                        humanizeIssueType(selectedIssue.issue_type) }}</div>
                    <div class="md:col-span-2"><span class="font-semibold">Route:</span> {{ selectedIssue.route || '-' }}
                    </div>
                    <div class="md:col-span-2">
                        <span class="font-semibold">Issue Message:</span>
                        <pre
                            class="mt-1 whitespace-pre-wrap rounded-xl bg-slate-100 p-3 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-200">{{
                                selectedIssue.message || '-'
                            }}</pre>
                    </div>
                    <div class="md:col-span-2">
                        <span class="font-semibold">Metadata:</span>
                        <pre
                            class="mt-1 whitespace-pre-wrap rounded-xl bg-slate-100 p-3 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-200">{{
                                formatMetadata(selectedIssue.metadata)
                            }}</pre>
                    </div>
                </div>

                <div class="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    Future workflow placeholder: question pull and editing will remain on the admin side only.
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                    <button type="button"
                        class="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500"
                        disabled>
                        Pull Question (Coming Soon)
                    </button>
                    <button type="button"
                        class="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500"
                        disabled>
                        Edit Question (Admin Only, Coming Soon)
                    </button>
                </div>
            </div>
        </dialog>
    </div>
    <div v-else>
        <p>Access denied.</p>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import Table from '../../components/Tables/mainTable.vue'
import { useAuthStore } from '../../stores/authStore'

const { user } = useAuthStore()
const query = ref('')
const feedback = ref([])
const selectedIssue = ref(null)

const activeRole = computed(() => {
    const role = user?.roles?.[0]
    if (typeof role === 'string') return role
    return role?.name || ''
})

const canView = computed(() => ['super-admin', 'admin'].includes(activeRole.value))

const filteredFeedback = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return feedback.value

    return feedback.value.filter((item) => {
        return [
            item.user_name,
            item.user_email,
            item.source_product,
            item.exam_mode,
            item.question_id ? String(item.question_id) : '',
            item.issue_type,
            item.message,
            item.status,
        ]
            .filter(Boolean)
            .some((field) => String(field).toLowerCase().includes(q))
    })
})

const fetchFeedback = async () => {
    if (!canView.value) return

    try {
        const { data } = await axios.get('/admin/exam-feedback')
        feedback.value = data?.data || []
    } catch (error) {
        console.error('Error fetching exam feedback:', error)
    }
}

const openIssueModal = (item) => {
    selectedIssue.value = item
    const modal = document.getElementById('feedback_issue_modal')
    if (modal) modal.showModal()
}

const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleString()
}

const humanizeIssueType = (type) => {
    if (!type) return '-'
    return String(type).replaceAll('_', ' ')
}

const truncate = (value, max = 120) => {
    const text = String(value || '')
    if (text.length <= max) return text
    return `${text.slice(0, max)}...`
}

const formatMetadata = (metadata) => {
    if (!metadata) return '-'
    try {
        return JSON.stringify(metadata, null, 2)
    } catch {
        return String(metadata)
    }
}

onMounted(fetchFeedback)
</script>

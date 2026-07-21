<template>
    <section v-if="!authStore.is_authenticated" :class="['guest-save-card', compact ? 'guest-save-card--compact' : '']">
        <div class="guest-save-icon">
            <i class="pi pi-save"></i>
        </div>

        <div class="guest-save-body">
            <p class="guest-save-eyebrow">{{ eyebrow }}</p>
            <h2 class="guest-save-title">{{ resolvedTitle }}</h2>
            <p class="guest-save-copy">{{ resolvedMessage }}</p>

            <ul v-if="showBenefits" class="guest-save-benefits">
                <li v-for="benefit in benefits" :key="benefit">
                    <i class="pi pi-check"></i>
                    <span>{{ benefit }}</span>
                </li>
            </ul>
        </div>

        <div v-if="showActions" class="guest-save-actions">
            <button class="guest-save-primary" type="button" @click="goToRegister">
                <i class="pi pi-user-plus"></i>
                {{ primaryText }}
            </button>
            <button class="guest-save-secondary" type="button" @click="goToLogin">
                Log in
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { getPendingAttempt } from '../utils/pendingAttempt'

const props = withDefaults(defineProps<{
    product?: 'nursing' | 'teas'
    productLabel?: string
    title?: string
    message?: string
    redirect?: string
    eyebrow?: string
    primaryText?: string
    compact?: boolean
    showActions?: boolean
    showBenefits?: boolean
    benefits?: string[]
}>(), {
    productLabel: 'your exam',
    eyebrow: 'Save your progress',
    primaryText: 'Create account',
    compact: false,
    showActions: true,
    showBenefits: true,
    benefits: () => [
        'Keep score history',
        'Unlock performance analytics',
        'Review attempts later',
    ],
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const pendingAttempt = computed(() => getPendingAttempt())
const hasPendingAttempt = computed(() => {
    if (!props.product) return !!pendingAttempt.value
    return pendingAttempt.value?.product === props.product
})

const resolvedTitle = computed(() => {
    if (props.title) return props.title

    if (hasPendingAttempt.value && pendingAttempt.value) {
        return `Create an account to save your ${Math.round(pendingAttempt.value.score)}% score`
    }

    return `Create an account to save your ${props.productLabel} progress`
})

const resolvedMessage = computed(() => {
    if (props.message) return props.message

    if (hasPendingAttempt.value && pendingAttempt.value) {
        const examName = pendingAttempt.value.examTitle
            ? ` from ${pendingAttempt.value.examTitle}`
            : ''

        return `Your ${pendingAttempt.value.productLabel} result${examName} is ready. Sign up or log in to save it to your reports.`
    }

    return 'Sign up to keep attempt history, reports, and performance trends tied to your account.'
})

const redirectTarget = computed(() => props.redirect || route.fullPath)

const authQuery = computed(() => {
    const query: Record<string, string> = {
        redirect: redirectTarget.value,
    }

    if (hasPendingAttempt.value) {
        query.saveAttempt = '1'
    }

    return query
})

const goToRegister = () => {
    router.push({
        path: '/register',
        query: authQuery.value,
    })
}

const goToLogin = () => {
    router.push({
        path: '/login',
        query: authQuery.value,
    })
}
</script>

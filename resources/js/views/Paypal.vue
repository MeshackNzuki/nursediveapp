<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '../stores'
import { useAuthStore } from '../stores/authStore'
import paypalIcon from '../assets/images/paypal-icon.svg'
import { trackPaywallEvent } from '../utils/paywallEvents'

const paypalDiv = ref(null)
const statusMessage = ref('')
const checkoutError = ref('')
const paypalReady = ref(false)
const isPreparing = ref(false)
const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const authStore = useAuthStore()
const paymentId = ref('')

const PAYPAL_CLIENT_ID = "AVi9KDLo5yyswt5MW-tWRpSHTx2Zv5UJZ9-BofXGd6KBEH5PlKR7jGqMiIf3vll6MRt6UGUvjmiEMZuL"

const planId = computed(() => (typeof route.query.id === 'string' ? route.query.id : ''))

const selectedPlan = computed(() => {
    const sourcePlans = Array.isArray(mainStore.plans) ? mainStore.plans : []
    return sourcePlans.find((plan) => String(plan.id) === planId.value)
})

const productLabels = {
    teas: 'TEAS',
    nursing: 'Nursing',
    nclex: 'NCLEX',
}

const formatPlanName = (name) => {
    if (!name) return 'Selected'
    const spaced = name.replace(/_/g, ' ')
    return `${spaced.charAt(0).toUpperCase()}${spaced.slice(1)}`
}

const routeAmount = () => {
    if (Array.isArray(route.query.amount)) return null
    const parsed = Number.parseFloat(String(route.query.amount || ''))
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const displayAmount = computed(() => {
    const planPrice = Number(selectedPlan.value?.price)
    if (Number.isFinite(planPrice) && planPrice > 0) return planPrice
    return routeAmount() || 0
})

const formattedAmount = computed(() => `$${displayAmount.value.toFixed(2)}`)
const productLabel = computed(() => productLabels[selectedPlan.value?.product_code] || 'Nursedive')
const planName = computed(() => formatPlanName(selectedPlan.value?.name))
const durationLabel = computed(() => {
    const days = Number(selectedPlan.value?.duration_days || 0)
    return days > 0 ? `${days} days` : 'Access period'
})

const formattedSavings = computed(() => {
    const initial = Number(selectedPlan.value?.initial || 0)
    const savings = initial - displayAmount.value
    return savings > 0 ? `$${savings.toFixed(2)}` : ''
})

const redirectTarget = () => {
    return typeof route.query.redirect === 'string' ? route.query.redirect : ''
}

const orderCompleteQuery = () => ({
    payment_id: paymentId.value,
    ...(redirectTarget() ? { redirect: redirectTarget() } : {}),
})

const loadPayPalSdk = () =>
    new Promise((resolve, reject) => {
        if (window.paypal) return resolve(window.paypal)

        const script = document.createElement('script')
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
        script.async = true
        script.onload = () => resolve(window.paypal)
        script.onerror = reject
        document.head.appendChild(script)
    })

const initializePaypal = async () => {
    checkoutError.value = ''
    statusMessage.value = ''
    paypalReady.value = false
    isPreparing.value = true

    if (paypalDiv.value) {
        paypalDiv.value.innerHTML = ''
    }

    if (!authStore.is_authenticated) {
        router.push({
            path: '/register',
            query: { redirect: route.fullPath },
        })
        return
    }

    if (!planId.value) {
        checkoutError.value = 'Choose a plan before opening PayPal checkout.'
        isPreparing.value = false
        return
    }

    try {
        if (!Array.isArray(mainStore.plans)) {
            await mainStore.getEssentials().catch(() => undefined)
        }

        const paypal = await loadPayPalSdk()

        const { data } = await axios.post(
            '/payments/paypal/create-payment-intent',
            { plan_id: planId.value }
        )

        const orderId = data.data?.orderId
        paymentId.value = data.data?.paymentId

        if (!orderId || !paymentId.value || !paypalDiv.value) {
            throw new Error('PayPal order could not be prepared')
        }

        paypal.Buttons({
            createOrder: () => orderId,

            onApprove: async (approvalData) => {
                statusMessage.value = 'Capturing payment...'

                try {
                    const response = await axios.post(
                        '/payments/paypal/capture-payment',
                        {
                            payment_id: paymentId.value,
                            order_id: approvalData.orderID,
                        }
                    )

                    const captureStatus = response.data?.data?.status

                    if (['completed', 'already_processed'].includes(captureStatus)) {
                        statusMessage.value = 'Payment successful. Unlocking access...'
                        router.push({
                            path: '/order-complete',
                            query: orderCompleteQuery(),
                        })
                    } else {
                        statusMessage.value = 'Payment failed'
                        trackPaywallEvent('payment_abandoned', {
                            provider: 'paypal',
                            payment_id: paymentId.value,
                            plan_id: planId.value,
                            reason: captureStatus || 'capture_failed',
                        })
                    }
                } catch (e) {
                    statusMessage.value = 'Server error capturing payment'
                    trackPaywallEvent('payment_abandoned', {
                        provider: 'paypal',
                        payment_id: paymentId.value,
                        plan_id: planId.value,
                        reason: 'server_error',
                    })
                }
            },

            onCancel: () => {
                statusMessage.value = 'Payment cancelled'
                trackPaywallEvent('payment_abandoned', {
                    provider: 'paypal',
                    payment_id: paymentId.value,
                    plan_id: planId.value,
                    reason: 'cancelled',
                })
            },

            onError: () => {
                statusMessage.value = 'PayPal error occurred'
                trackPaywallEvent('payment_abandoned', {
                    provider: 'paypal',
                    payment_id: paymentId.value,
                    plan_id: planId.value,
                    reason: 'paypal_error',
                })
            },
        }).render(paypalDiv.value)

        paypalReady.value = true
        trackPaywallEvent('checkout_started', {
            provider: 'paypal',
            payment_id: paymentId.value,
            plan_id: planId.value,
            amount: displayAmount.value,
        })
    } catch (e) {
        checkoutError.value = "We couldn't load PayPal checkout. Please try again or use Stripe."
    } finally {
        isPreparing.value = false
    }
}

onMounted(initializePaypal)
</script>

<template>
    <div
        class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh]">
        <main class="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section
                class="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900 md:p-6">
                <button
                    class="mb-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                    type="button" @click="router.back()">
                    <i class="pi pi-arrow-left text-xs"></i>
                    Back
                </button>

                <div class="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p class="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                            PayPal Checkout
                        </p>
                        <h1 class="mt-2 text-2xl font-black text-slate-950 dark:text-white md:text-3xl">
                            Finish your {{ productLabel }} order
                        </h1>
                        <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                            Continue with PayPal to approve the payment and unlock your access.
                        </p>
                    </div>
                    <img :src="paypalIcon" alt="PayPal" class="h-8 w-auto">
                </div>

                <div class="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                    <div v-if="isPreparing" class="flex min-h-32 items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <i class="pi pi-spin pi-spinner text-blue-600 dark:text-blue-300"></i>
                        Preparing PayPal buttons...
                    </div>

                    <div v-if="checkoutError" class="space-y-4">
                        <div
                            class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                            {{ checkoutError }}
                        </div>
                        <button
                            class="inline-flex items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                            type="button" @click="initializePaypal">
                            Try Again
                        </button>
                    </div>

                    <div ref="paypalDiv" :class="{ 'opacity-0': !paypalReady }"></div>
                </div>

                <p v-if="statusMessage"
                    class="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200">
                    {{ statusMessage }}
                </p>
            </section>

            <aside
                class="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900">
                <p class="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Order Summary</p>
                <h2 class="mt-2 text-xl font-black text-slate-950 dark:text-white">{{ productLabel }}</h2>
                <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ planName }} access</p>

                <div class="mt-5 space-y-3 border-y border-slate-200 py-4 text-sm dark:border-slate-700">
                    <div class="flex items-center justify-between gap-3">
                        <span class="text-slate-500 dark:text-slate-400">Plan</span>
                        <span class="font-bold text-slate-900 dark:text-white">{{ planName }}</span>
                    </div>
                    <div class="flex items-center justify-between gap-3">
                        <span class="text-slate-500 dark:text-slate-400">Access</span>
                        <span class="font-bold text-slate-900 dark:text-white">{{ durationLabel }}</span>
                    </div>
                    <div v-if="formattedSavings" class="flex items-center justify-between gap-3">
                        <span class="text-slate-500 dark:text-slate-400">Savings</span>
                        <span class="font-bold text-amber-700 dark:text-amber-300">{{ formattedSavings }}</span>
                    </div>
                </div>

                <div class="mt-4 flex items-end justify-between gap-3">
                    <span class="text-sm font-semibold text-slate-500 dark:text-slate-400">Total due today</span>
                    <span class="text-3xl font-black text-slate-950 dark:text-white">{{ formattedAmount }}</span>
                </div>

                <button
                    class="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    type="button" @click="router.push({ path: '/checkout', query: route.query })">
                    <i class="pi pi-credit-card text-xs"></i>
                    Use Stripe Instead
                </button>
            </aside>
        </main>
    </div>
</template>

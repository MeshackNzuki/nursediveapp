<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { trackPaywallEvent } from '../utils/paywallEvents'

const paypalDiv = ref(null)
const statusMessage = ref('')
const route = useRoute()
const router = useRouter()

const PAYPAL_CLIENT_ID = "AVi9KDLo5yyswt5MW-tWRpSHTx2Zv5UJZ9-BofXGd6KBEH5PlKR7jGqMiIf3vll6MRt6UGUvjmiEMZuL"

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

onMounted(async () => {

    const paypal = await loadPayPalSdk()

    const { data } = await axios.post(
        '/payments/paypal/create-payment-intent',
        { plan_id: route.query.id }
    )

    const { orderId, paymentId } = data.data

    paypal.Buttons({
        createOrder: () => orderId,

        onApprove: async (data) => {
            statusMessage.value = 'Capturing payment...'

            try {
                const response = await axios.post(
                    '/payments/paypal/capture-payment',
                    {
                        payment_id: paymentId,
                        order_id: data.orderID,
                    }
                )

                const captureStatus = response.data?.data?.status

                if (['completed', 'already_processed'].includes(captureStatus)) {
                    statusMessage.value = 'Payment successful. Unlocking access...'
                    router.push({
                        path: '/order-complete',
                        query: {
                            payment_id: paymentId,
                            ...(typeof route.query.redirect === 'string' ? { redirect: route.query.redirect } : {}),
                        },
                    })
                } else {
                    statusMessage.value = 'Payment failed'
                    trackPaywallEvent('payment_abandoned', {
                        provider: 'paypal',
                        payment_id: paymentId,
                        plan_id: route.query.id,
                        reason: captureStatus || 'capture_failed',
                    })
                }
            } catch (e) {
                statusMessage.value = 'Server error capturing payment'
                trackPaywallEvent('payment_abandoned', {
                    provider: 'paypal',
                    payment_id: paymentId,
                    plan_id: route.query.id,
                    reason: 'server_error',
                })
            }
        },

        onCancel: () => {
            statusMessage.value = 'Payment cancelled'
            trackPaywallEvent('payment_abandoned', {
                provider: 'paypal',
                payment_id: paymentId,
                plan_id: route.query.id,
                reason: 'cancelled',
            })
        },

        onError: () => {
            statusMessage.value = 'PayPal error occurred'
            trackPaywallEvent('payment_abandoned', {
                provider: 'paypal',
                payment_id: paymentId,
                plan_id: route.query.id,
                reason: 'paypal_error',
            })
        },
    }).render(paypalDiv.value)

})
</script>

<template>
    <div class="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-32">
        <h2 class="text-2xl font-bold mb-4">Pay with PayPal</h2>

        <div ref="paypalDiv"></div>

        <p v-if="statusMessage" class="mt-4 text-sm font-semibold">
            {{ statusMessage }}
        </p>
    </div>
</template>

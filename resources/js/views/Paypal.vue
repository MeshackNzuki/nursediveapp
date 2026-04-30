<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const paypalDiv = ref(null)
const statusMessage = ref('')
const route = useRoute()

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

                if (response.data.status === 'completed') {
                    statusMessage.value = 'Payment successful'
                } else {
                    statusMessage.value = 'Payment failed'
                }
            } catch (e) {
                statusMessage.value = 'Server error capturing payment'
            }
        },

        onCancel: () => {
            statusMessage.value = 'Payment cancelled'
        },

        onError: () => {
            statusMessage.value = 'PayPal error occurred'
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

<template>
  <div class="w-full bg-transparent flex items-center justify-center h-screen">
    <div class="m-auto bg-white rounded-2xl p-2 md:p-6 min-h-72 w-full md:w-md  md:min-w-md text-center">
      <h2 class="text-lg font-bold">Processing Payment</h2>

      <!-- Pending -->
      <p v-if="payment_status === 'pending'">Verifying your payment...</p>

      <!-- Completed -->
      <div v-if="payment_status === 'completed'" class="flex flex-col items-center space-y-3">

        <img :src="check" alt="Success" class="w-24 h-24" />

        <p class="font-semibold text-green-600">Payment Success!</p>

        <p class="font-base text-green-600">Your subscription has been activated.</p>

        <p class="text-xs text-green-600">Thank you for choosing us. Happy studies</p>
      </div>

      <!-- Failed -->
      <p v-if="payment_status === 'failed'" class="text-red-600">
        ❌ Payment failed. Please try again.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from "vue-router"
import check from '../assets/gifs/check.gif'
import Subscription from './Subscription.vue'
import { useAuthStore } from '../stores/authStore'


const payment_status = ref('pending')
const payment_id = ref()
let interval = null
const route = useRoute()
const router = useRouter()
const { user, updateUser } = useAuthStore()


const fetchStatus = async () => {
  try {
    const { data } = await axios.get(
      `/payments/check-access?payment_id=${payment_id.value}`,
      { showLoader: false }
    )

    payment_status.value = data.data.payment_status

    // If resolved, stop polling
    if (payment_status.value !== 'pending') {
      clearInterval(interval)
      if (payment_status.value == 'completed') {
        updateUser({ ...user, subscriptions: data.data.subscriptions })
        setTimeout(() => {
          router.push('/')
        }, 6000)
      }
    }
  } catch (e) {
    console.error('Error fetching payment_status', e)
  }
}

onMounted(() => {
  payment_id.value = route.query.payment_id
  interval = setInterval(fetchStatus, 1000)
  fetchStatus()
})
// clear interval on unmount
onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll
    p-6 bg-white flex flex-col items-center justify-center ">
    <div class="absolute inset-0  pointer-events-none -z-10">
      <!-- Purple to Sky to Green Gradient Cloud -->
      <div
        class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-purple-300 via-sky-300 to-teal-200 opacity-30 blur-[120px] rounded-full">
      </div>
      <div
        class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-200 opacity-30 blur-[100px] rounded-full">
      </div>
    </div>
    <h2 class="text-lg font-bold custom-underline-teal"><span><i class="pi pi-lock me-1 text-teal-500"></i></span>Secure
      Nursedive Checkout
    </h2>
    <p class="text-xs my-2 text-cyan-900  max-w-md bg-cyan-500/30 rounded-2xl p-1 flex items-center gap-1">
      <i class="pi pi-info-circle "></i>Important: We do not auto-bill our clients, instead they renew their
      subscriptions with us
    </p>
    <form class="p-4 bg-blue-950 rounded-2xl md:w-md" v-if="stripeLoaded" @submit.prevent="handleSubmit">
      <div class="mb-4 text-white font-semibold">
        Payment Options
      </div>
      <span @click="redirectToPaypal"
        class="w-full cursor-pointer flex mb-4 bg-gray-50 text-gray-500 p-3 px-4 font-semibold text-sm rounded-2xl">
        <img :src="paypalIcon" alt="PayPal" class="w-16  mr-2">
        <span>Pay with PayPal</span>
      </span>
      <StripeElements :stripe-key="stripeKey" :instance-options="stripeOptions" :elements-options="elementsOptions"
        ref="elementsComponent">
        <StripeElement type="payment" :options="paymentElementOptions" ref="paymentComponent" />
      </StripeElements>
      <div class="flex justify-between my-4 bg-blue-100 p-2 rounded-2xl">
        Total Amount: <span>----------</span><span class="font-bold text-lg">${{ (amount) }}</span>
      </div>
      <div class="flex justify-center my-2">
        <CommonButton class="bg-gradient-to-r w-full py-2 from-yellow-500 to to-orange-600" button-text="Pay Now"
          :action="() => handleSubmit" />
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
import { loadStripe } from "@stripe/stripe-js"
import { StripeElements, StripeElement } from "vue-stripe-js"
import CommonButton from "../components/Buttons/CommonButton.vue"
import axios from "axios"
import { useMainStore, } from "../stores"
import { useRoute } from "vue-router"
import paypalIcon from '../assets/images/paypal-icon.svg'
import router from "../router"

const stripeKey = "pk_live_51QrMHdGoaQAS8lwkRA9eBoYkAzAv5h9RxwX3R7837iYEHXglHmRFFOxQ5AiuNKGRRRxZuSXTJQYzuFayFNrzA4GV00eWr6EowA"
const stripeLoaded = ref(false)
const clientSecret = ref("")
const paymentId = ref('')
const amount = ref(79)
const route = useRoute()

const mainStore = useMainStore()


const stripeOptions = ref({})

const elementsOptions = ref({
  mode: "payment",
  currency: "usd",
  amount: amount.value,
  appearance: {
    theme: "flat",
  },
}) as any

const paymentElementOptions = ref({})
const elementsComponent = ref()

onMounted(async () => {

  await loadStripe(stripeKey)

  stripeLoaded.value = true

  amount.value = route.query.amount ? parseInt(route.query.amount as string) : null
  const plan_id = (route.query.id as string) || null

  await axios.post("/payments/create-payment-intent", {
    plan_id: plan_id
  }).then((res) => {
    clientSecret.value = res.data.data.clientSecret;
    paymentId.value = res.data.data.paymentId;
    mainStore.payment_event = true;
    mainStore.payment_id = paymentId.value;

  })
})

async function handleSubmit() {
  const stripeInstance = elementsComponent.value?.instance
  const elements = elementsComponent.value?.elements

  if (!stripeInstance || !elements) return

  // 1. First submit the elements (collect/validate customer input)
  const { error: submitError } = await elements.submit()
  if (submitError) {
    console.error(submitError.message)
    return
  }

  // 2. Then confirm the payment
  const { error } = await stripeInstance.confirmPayment({
    elements,
    clientSecret: clientSecret.value,
    confirmParams: {
      return_url: `https://app.nursedive.com/order-complete?payment_id=${paymentId.value}`,
    },
  })
  if (error) {
    console.error(error.message)
  }
}

const redirectToPaypal = () => {
  router.push(`/paypal-checkout?amount=${amount.value}&id=${route.query.id}`)
}

</script>
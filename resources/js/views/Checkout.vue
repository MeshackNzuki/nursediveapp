<template>
  <div class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll
    p-6 bg-white flex flex-col items-center justify-center ">
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div
        class="absolute -top-24 -left-40 h-[620px] w-[620px] rounded-full bg-gradient-to-r from-sky-50 via-cyan-50 to-emerald-50 opacity-45 blur-[125px]">
      </div>
      <div
        class="absolute top-28 right-8 h-[420px] w-[420px] rounded-full bg-gradient-to-r from-emerald-50 via-teal-200 to-sky-50 opacity-35 blur-[110px]">
      </div>
    </div>
    <h2 class="text-lg font-bold custom-underline-teal"><span><i class="pi pi-lock me-1 text-teal-500"></i></span>Secure
      Nursedive Checkout
    </h2>
    <p class="text-xs my-2 text-cyan-900  max-w-md bg-cyan-500/30 rounded-2xl p-1 flex items-center gap-1">
      <i class="pi pi-info-circle "></i>Important: We do not auto-bill our clients, instead they renew their
      subscriptions with us
    </p>
    <form class="p-4 bg-sky-950/95 rounded-2xl md:w-md" v-if="stripeLoaded" @submit.prevent="handleSubmit">
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
import { useAuthStore } from "../stores/authStore.js"
import { useRoute } from "vue-router"
import paypalIcon from '../assets/images/paypal-icon.svg'
import router from "../router"
import { trackPaywallEvent } from "../utils/paywallEvents"

const stripeKey = "pk_live_51QrMHdGoaQAS8lwkRA9eBoYkAzAv5h9RxwX3R7837iYEHXglHmRFFOxQ5AiuNKGRRRxZuSXTJQYzuFayFNrzA4GV00eWr6EowA"
const stripeLoaded = ref(false)
const clientSecret = ref("")
const paymentId = ref('')
const amount = ref(79)
const route = useRoute()

const mainStore = useMainStore()
const { is_authenticated } = useAuthStore()


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

const redirectTarget = () => {
  return typeof route.query.redirect === "string" ? route.query.redirect : ""
}

const orderCompleteUrl = () => {
  const url = new URL("/order-complete", window.location.origin)
  url.searchParams.set("payment_id", paymentId.value)

  const redirect = redirectTarget()
  if (redirect) {
    url.searchParams.set("redirect", redirect)
  }

  return url.toString()
}

onMounted(async () => {

  if (!is_authenticated) {

    router.push("/register");

  }

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
    trackPaywallEvent("checkout_started", {
      provider: "stripe",
      payment_id: paymentId.value,
      plan_id: plan_id,
      amount: amount.value,
    })

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
    trackPaywallEvent("payment_abandoned", {
      provider: "stripe",
      payment_id: paymentId.value,
      reason: submitError.message,
    })
    return
  }

  // 2. Then confirm the payment
  const { error } = await stripeInstance.confirmPayment({
    elements,
    clientSecret: clientSecret.value,
    confirmParams: {
      return_url: orderCompleteUrl(),
    },
  })
  if (error) {
    console.error(error.message)
    trackPaywallEvent("payment_abandoned", {
      provider: "stripe",
      payment_id: paymentId.value,
      reason: error.message,
    })
  }
}

const redirectToPaypal = () => {
  trackPaywallEvent("checkout_started", {
    provider: "paypal",
    plan_id: route.query.id,
    amount: amount.value,
  })

  router.push({
    path: "/paypal-checkout",
    query: {
      amount: amount.value,
      id: route.query.id,
      ...(redirectTarget() ? { redirect: redirectTarget() } : {}),
    },
  })
}

</script>

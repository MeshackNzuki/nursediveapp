<template>
  <div
    class="relative z-10 min-h-[93.5vh] max-h-[93.5vh] overflow-y-scroll rounded-2xl bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:p-6 2xl:max-h-[94vh] 2xl:min-h-[94vh]">
    <main class="mx-auto flex max-w-6xl flex-col gap-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <button
            class="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
            type="button" @click="router.back()">
            <i class="pi pi-arrow-left text-xs"></i>
            Back
          </button>
          <p class="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            Secure Checkout
          </p>
          <h1 class="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
            Complete your {{ productLabel }} access
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
            Use card, bank, or wallet options through Stripe, or switch to PayPal before placing your order.
          </p>
        </div>

        <div
          class="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <i class="pi pi-lock text-blue-600 dark:text-blue-300"></i>
          Encrypted payment
        </div>
      </div>

      <section class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div class="space-y-4">
          <div class="grid gap-3 sm:grid-cols-2">
            <button
              class="flex min-h-24 items-center justify-between rounded-lg border border-blue-300 bg-blue-50 p-4 text-left shadow-sm ring-2 ring-blue-500/20 transition dark:border-blue-500/50 dark:bg-blue-500/10"
              type="button" aria-pressed="true">
              <span>
                <span class="block text-sm font-black text-slate-950 dark:text-white">Stripe</span>
                <span class="mt-1 block text-xs text-slate-600 dark:text-slate-300">Card, Apple Pay, Google Pay</span>
              </span>
              <i class="pi pi-credit-card text-xl text-blue-600 dark:text-blue-300"></i>
            </button>

            <button
              class="flex min-h-24 items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50/70 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500/60 dark:hover:bg-blue-500/10"
              type="button" @click="redirectToPaypal">
              <span>
                <span class="block text-sm font-black text-slate-950 dark:text-white">PayPal</span>
                <span class="mt-1 block text-xs text-slate-600 dark:text-slate-300">Pay with your PayPal wallet</span>
              </span>
              <img :src="paypalIcon" alt="PayPal" class="h-6 w-auto">
            </button>
          </div>

          <form v-if="stripeLoaded"
            class="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900 md:p-6"
            @submit.prevent="handleSubmit">
            <div class="mb-5 flex flex-col gap-2 border-b border-slate-200 pb-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-lg font-black text-slate-950 dark:text-white">Payment Details</h2>
                <p class="text-sm text-slate-600 dark:text-slate-300">{{ planName }} plan</p>
              </div>
              <div class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-black text-slate-900 dark:bg-slate-800 dark:text-white">
                {{ formattedAmount }}
              </div>
            </div>

            <StripeElements :stripe-key="stripeKey" :instance-options="stripeOptions" :elements-options="elementsOptions"
              ref="elementsComponent">
              <StripeElement type="payment" :options="paymentElementOptions" />
            </StripeElements>

            <p v-if="checkoutError"
              class="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
              {{ checkoutError }}
            </p>

            <button
              class="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-[0_16px_35px_-24px_rgba(15,23,42,0.8)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              type="submit" :disabled="isSubmitting || !clientSecret">
              <i :class="isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-lock'" class="text-xs"></i>
              {{ isSubmitting ? 'Processing payment...' : `Pay ${formattedAmount}` }}
            </button>
          </form>

          <div v-else
            class="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900">
            <div v-if="checkoutError" class="space-y-4">
              <div
                class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                {{ checkoutError }}
              </div>
              <button
                class="inline-flex items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                type="button" @click="initializeCheckout">
                Try Again
              </button>
            </div>

            <div v-else class="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <i class="pi pi-spin pi-spinner text-blue-600 dark:text-blue-300"></i>
              Preparing secure payment form...
            </div>
          </div>
        </div>

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

          <div class="mt-5 rounded-lg bg-slate-100 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            No recurring billing. Your selected access period starts after payment is confirmed.
          </div>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { loadStripe } from "@stripe/stripe-js"
import { StripeElements, StripeElement } from "vue-stripe-js"
import axios from "axios"
import { useMainStore } from "../stores"
import { useAuthStore } from "../stores/authStore.js"
import { useRoute } from "vue-router"
import paypalIcon from "../assets/images/paypal-icon.svg"
import router from "../router"
import { trackPaywallEvent } from "../utils/paywallEvents"

const stripeKey = "pk_live_51QrMHdGoaQAS8lwkRA9eBoYkAzAv5h9RxwX3R7837iYEHXglHmRFFOxQ5AiuNKGRRRxZuSXTJQYzuFayFNrzA4GV00eWr6EowA"
const stripeLoaded = ref(false)
const clientSecret = ref("")
const paymentId = ref("")
const amount = ref<number | null>(null)
const isSubmitting = ref(false)
const checkoutError = ref("")
const route = useRoute()

const mainStore = useMainStore()
const authStore = useAuthStore()

const stripeOptions = ref({})

const planId = computed(() => (typeof route.query.id === "string" ? route.query.id : ""))

const selectedPlan = computed(() => {
  const sourcePlans = Array.isArray((mainStore as any).plans) ? (mainStore as any).plans : []
  return sourcePlans.find((plan: any) => String(plan.id) === planId.value)
})

const productLabels: Record<string, string> = {
  teas: "TEAS",
  nursing: "Nursing",
  nclex: "NCLEX",
}

const formatPlanName = (name?: string) => {
  if (!name) return "Selected"
  const spaced = name.replace(/_/g, " ")
  return `${spaced.charAt(0).toUpperCase()}${spaced.slice(1)}`
}

const routeAmount = () => {
  if (Array.isArray(route.query.amount)) return null
  const parsed = Number.parseFloat(String(route.query.amount ?? ""))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const displayAmount = computed(() => {
  const planPrice = Number(selectedPlan.value?.price)
  if (Number.isFinite(planPrice) && planPrice > 0) return planPrice
  return amount.value || routeAmount() || 0
})

const formattedAmount = computed(() => `$${displayAmount.value.toFixed(2)}`)

const productLabel = computed(() => {
  const productCode = selectedPlan.value?.product_code
  return productLabels[productCode] || "Nursedive"
})

const planName = computed(() => formatPlanName(selectedPlan.value?.name))

const durationLabel = computed(() => {
  const days = Number(selectedPlan.value?.duration_days || 0)
  return days > 0 ? `${days} days` : "Access period"
})

const formattedSavings = computed(() => {
  const initial = Number(selectedPlan.value?.initial || 0)
  const savings = initial - displayAmount.value
  return savings > 0 ? `$${savings.toFixed(2)}` : ""
})

const elementsOptions = computed(() => ({
  clientSecret: clientSecret.value,
  appearance: {
    theme: "flat" as const,
    variables: {
      colorPrimary: "#2563eb",
      colorBackground: "#ffffff",
      colorText: "#0f172a",
      colorDanger: "#e11d48",
      borderRadius: "8px",
      fontFamily: "Inter, system-ui, sans-serif",
    },
    rules: {
      ".Input": {
        border: "1px solid #cbd5e1",
        boxShadow: "none",
      },
      ".Input:focus": {
        border: "1px solid #2563eb",
        boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.12)",
      },
    },
  },
}))

const paymentElementOptions = ref({
  layout: {
    type: "tabs" as const,
    defaultCollapsed: false,
  },
})
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

const initializeCheckout = async () => {
  checkoutError.value = ""
  stripeLoaded.value = false
  amount.value = routeAmount()

  if (!authStore.is_authenticated) {
    router.push({
      path: "/register",
      query: { redirect: route.fullPath },
    })
    return
  }

  if (!planId.value) {
    checkoutError.value = "Choose a plan before opening checkout."
    return
  }

  try {
    if (!Array.isArray((mainStore as any).plans)) {
      await mainStore.getEssentials().catch(() => undefined)
    }

    await loadStripe(stripeKey)

    const res = await axios.post("/payments/create-payment-intent", {
      plan_id: planId.value,
    })

    clientSecret.value = res.data.data.clientSecret
    paymentId.value = res.data.data.paymentId
    mainStore.payment_event = true
    mainStore.payment_id = paymentId.value
    stripeLoaded.value = true

    trackPaywallEvent("checkout_started", {
      provider: "stripe",
      payment_id: paymentId.value,
      plan_id: planId.value,
      amount: displayAmount.value,
    })
  } catch (error) {
    checkoutError.value = "We couldn't prepare checkout. Please refresh or try PayPal."
  }
}

onMounted(initializeCheckout)

async function handleSubmit() {
  const stripeInstance = elementsComponent.value?.instance
  const elements = elementsComponent.value?.elements

  if (!stripeInstance || !elements || !clientSecret.value || isSubmitting.value) return

  checkoutError.value = ""
  isSubmitting.value = true

  const { error: submitError } = await elements.submit()
  if (submitError) {
    checkoutError.value = submitError.message || "Please check your payment details."
    isSubmitting.value = false
    trackPaywallEvent("payment_abandoned", {
      provider: "stripe",
      payment_id: paymentId.value,
      reason: checkoutError.value,
    })
    return
  }

  const { error } = await stripeInstance.confirmPayment({
    elements,
    clientSecret: clientSecret.value,
    confirmParams: {
      return_url: orderCompleteUrl(),
    },
  })

  if (error) {
    checkoutError.value = error.message || "Payment could not be completed."
    isSubmitting.value = false
    trackPaywallEvent("payment_abandoned", {
      provider: "stripe",
      payment_id: paymentId.value,
      reason: checkoutError.value,
    })
  }
}

const redirectToPaypal = () => {
  if (!planId.value) {
    checkoutError.value = "Choose a plan before opening PayPal checkout."
    return
  }

  trackPaywallEvent("checkout_started", {
    provider: "paypal",
    plan_id: planId.value,
    amount: displayAmount.value,
  })

  router.push({
    path: "/paypal-checkout",
    query: {
      amount: displayAmount.value,
      id: planId.value,
      ...(redirectTarget() ? { redirect: redirectTarget() } : {}),
    },
  })
}
</script>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const checkoutQuery = computed(() => ({ ...route.query }))

const goToCheckout = () => {
    router.replace({
        path: '/checkout',
        query: checkoutQuery.value,
    })
}

onMounted(goToCheckout)
</script>

<template>
    <div
        class="relative z-10 min-h-[93.5vh] rounded-2xl bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:p-6">
        <main class="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900 md:p-6">
            <p class="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Checkout</p>
            <h1 class="mt-2 text-2xl font-black text-slate-950 dark:text-white md:text-3xl">
                PayPal checkout is unavailable
            </h1>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Stripe checkout will open instead.
            </p>
            <button
                class="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                type="button"
                @click="goToCheckout">
                <i class="pi pi-credit-card text-xs"></i>
                Continue to checkout
            </button>
        </main>
    </div>
</template>

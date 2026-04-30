<template>
    <div class="bg-gradient-to-r from-blue-900 via-blue-950 to-sky-900 text-white 
           rounded-xl px-2 py-3 shadow-sm flex flex-col items-center space-y-1 w-32">
        <h5 class="text-xs font-semibold">Subscription</h5>
        <span class="text-[11px] opacity-90 text-yellow-400 px-2 border border-yellow-300 rounded-full
        ">{{ daysLeft(product_code) }}d left</span>
        <CommonButton :button-text="subscriptionLabel(product_code)" :action="() => $router.push(pricingRoute(product_code))"
            classes="px-2 py-0.5 text-[11px] shadow-0  bg-gradient-to-r from-orange-500 to-yellow-400  text-white font-semibold   hover:bg-teal-50 rounded-xs" />
    </div>
</template>
<script setup lang="ts">

import { useAuthStore } from "../stores/authStore";
import CommonButton from "./Buttons/CommonButton.vue";

const props: any = defineProps({
    product_code: {
        type: String,
        required: true,
    },
})


const { daysLeft, active, isTrial, pricingRoute } = useAuthStore();

const subscriptionLabel = (product) => {
    if (active(product)) return 'Extend Now'
    if (isTrial(product)) return 'Upgrade Now'
    return 'Subscribe Now'
}
</script>

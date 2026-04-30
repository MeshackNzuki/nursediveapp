<template>
    <div class="text-red-700 nod bg-red-100 text-sm rounded-full px-4 mt-4 transition-all duration-250ms text-center">
        <i v-if="msg" class="pi pi-check-circle mt-1 mx-2"></i> {{ msg ? msg + "!" : null }}
    </div>
</template>
<script setup>
defineProps({
    msg: String,
});
</script>
<style scoped>
.nod {
    animation: horizontal-shaking 0.4s infinite;
}

@keyframes horizontal-shaking {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(5px);
    }

    50% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }

    100% {
        transform: translateX(0);
    }
}
</style>

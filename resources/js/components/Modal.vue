<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const props = defineProps({
    isOpen: Boolean,
});

const emit = defineEmits(["modal-close"]);

const target = ref(null);
onClickOutside(target, () => {
    emit("modal-close");
});
</script>

<template>
    <Transition name="modal">
        <div
            v-if="isOpen"
            class="fixed flex justify-center items-center w-full top-0 left-0 p-4 h-screen z-30 bg-gray-950 bg-opacity-25 transition-all duration-700"
        >
            <div class="modal-wrapper">
                <div
                    ref="target"
                    class="bg-white max-w-(--breakpoint-lg) rounded-lg shadow-2xl flex-wrap transition-all duration-700"
                >
                    <slot></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

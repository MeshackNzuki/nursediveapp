import { RouterLink } from 'vue-router';
<template>
    <header
        :class="[
            'bg-sky-800',
            'fixed top-0 z-40 w-full flex items-center justify-between transition-all duration-700',
        ]"
    >
        <nav class="container mx-auto px-6 py-3">
            <div class="flex items-center justify-between">
                <div
                    class="text-white font-bold text-xl hover:translate-x-0.5 hover:scale-105 transition duration-200 ease-out"
                >
                    <RouterLink to="/shop" class="text-white">
                        <img class="h-10 w-10 mr-2" :src="Logo" alt="Logo" />
                    </RouterLink>
                    <!--  <img class="h-10 w-10 mr-2" :src="logo" alt="Logo"  />  -->
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { useMainStore } from "../stores";
import { ref, onMounted } from "vue";
import { onClickOutside } from "@vueuse/core";
import Logo from "../assets/logo.png";
import { useRouter } from "vue-router";

const logo = Logo;
const router = useRouter();

const data = useMainStore();

const target = ref(null);

const { toggleSidebar, toggleCatOpen } = useMainStore(); // Destructure

const scrollPosition = ref(0);

const updateScroll = () => {
    scrollPosition.value = window.scrollY;
};

onMounted(() => {
    window.addEventListener("scroll", updateScroll);
});

const navColor = ref("");

onClickOutside(target, (event) => {
    if (data.sidebarState == true) {
        toggleSidebar();
    }
});
</script>

<template>
    <div :class="[
        'fixed top-0 right-0 select-none z-40 transition-all duration-300 ease-in-out',
        sidebarPosition
    ]">
        <div
            class="flex flex-row justify-between items-center mb-1 mt-2 rounded-lg py-1 h-10 px-2 mx-2 bg-transparent text-gray-50">
            <!-- Sidebar Toggle -->
            <span @click="mainStore.toggleSidebar" class="cursor-pointer flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" :class="[
                        mainStore.isMobile ? 'size-6' : 'size-10 p-2'
                    ]">
                    <!-- Hamburger -->
                    <path v-if="!mainStore.sidebarOpen" stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />

                    <!-- Close -->
                    <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </span>
            <!-- Greeting -->
            <div
                class="hidden relative md:flex  bg-sky-900 rounded-full px-4 shadow-md text-white text-sm font-semibold">
                <span class="font-light" v-if="user?.name">
                    {{ greetingText }}, {{ user?.name.split(" ")[0] }}! </span>
            </div>

            <!-- Mobile Back -->
            <div class="flex md:hidden bg-sky-900 rounded-full px-4 shadow-md text-white text-sm font-semibold">
                <span @click="$router.back()">
                    <i class="pi pi-arrow-left font-light mt-1"></i>
                </span>
            </div>

            <!-- Right Icons -->
            <div class="flex justify-center items-center gap-4 h-full">
                <!-- Notifications -->
                <router-link to="/notifications" class="p-1 flex items-center justify-center">
                    <div class="indicator">
                        <i class="pi pi-bell"></i>
                        <span class="badge badge-xs border-0 bg-rose-400 indicator-item"></span>
                    </div>
                </router-link>

                <!-- Theme Toggle -->
                <svg v-if="!isDark" @click="toggleDark()" class="cursor-pointer stroke-cyan-500 fill-sky-500"
                    xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <svg v-else @click="toggleDark()" class="cursor-pointer stroke-cyan-500 fill-sky-500"
                    xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <path
                        d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>

                <!-- Logout -->
                <div @click="logout" class="flex items-center justify-center">
                    <div class="cursor-pointer text-gray-50 dark:text-amber-400">
                        <i class="pi pi-power-off"></i>
                    </div>
                </div>

                <!-- Settings -->
                <router-link to="/settings" class="p-1 flex items-center justify-center" @click="toggleRightPanel">
                    <i class="pi pi-cog"></i>
                </router-link>

                <!-- Profile -->
                <router-link to="/account" class="cursor-pointer">
                    <div
                        class="w-7 h-7 rounded-full ring-2 ring-yellow-500 ring-offset-base-100 flex items-center justify-center">
                        <span class="text-center">
                            {{ user?.name?.charAt(0) }}
                        </span>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useDark, useToggle } from "@vueuse/core";
import { useMainStore } from "../../stores";
import { useAuthStore } from "../../stores/authStore";


const mainStore = useMainStore();
const { user, logout } = useAuthStore();
const route = useRoute();

const isDark = useDark({ disableTransition: false });

const toggleDark = useToggle(isDark);

const show = ref(false);
const login = ref(false);
const location = ref("");
const greetingText = ref("");

/* 🔹 Compute sidebar position cleanly */
const sidebarPosition = computed(() => {
    if (mainStore.isMobile) {
        return mainStore.sidebarOpen ? "left-52" : "left-0";
    }
    return mainStore.sidebarOpen ? "left-64" : "left-24";
});

/* 🔹 Dynamic greeting every minute */
const updateGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
};
greetingText.value = updateGreeting();
setInterval(() => {
    greetingText.value = updateGreeting();
}, 60000);

/* 🔹 Toggle right panel */
const toggleRightPanel = () => {
    show.value = !show.value;
};

/* 🔹 Track route changes */
onMounted(() => {
    login.value = route.path === "/login";
    location.value = route.path.split("/")[1];
});

watch(
    () => route.path,
    (path) => {
        login.value = path === "/login";
        location.value = path.split("/")[1];
    }
);
</script>

<template>
    <nav v-if="!login" ref="sidebar_id" :class="'rounded-2xl border border-white/40 dark:border-sky-800/70 text-gray-950 font-sans fixed left-1 top-1 overflow-scroll bottom-1 dark:text-slate-200 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-[0_24px_60px_-30px_rgba(15,23,42,0.65)] flex-wrap items-center justify-between z-10 py-4 px-4 transition-all ease-in-out duration-300 select-none backdrop-blur-xl ' +
        (isDark
            ? ' bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 '
            : ' bg-gradient-to-b from-white/95 via-slate-50/95 to-sky-50/95 ') +
        (mainStore.isMobile ? (mainStore.sidebarOpen ? 'w-52  ' : 'w-1 opacity-0 ') : mainStore.sidebarOpen ? 'w-64' : 'w-24')
        ">
        <div v-if="!isDark" class="absolute inset-0  pointer-events-none -z-10">
            <!-- Purple to Sky to Green Gradient Cloud -->
            <div
                class="absolute -top-20 -left-40 h-[600px] w-[600px] bg-gradient-to-r from-purple-300 via-sky-200 to-teal-200 opacity-30 blur-[120px] rounded-full">
            </div>
            <div
                class="absolute bottom-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-200 to-purple-200 opacity-30 blur-[100px] rounded-full">
            </div>
        </div>
        <div v-else class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-24 -left-24 h-[440px] w-[440px] bg-gradient-to-r from-cyan-500/20 via-sky-400/10 to-transparent blur-[110px] rounded-full">
            </div>
            <div
                class="absolute bottom-10 right-0 h-[360px] w-[360px] bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-transparent blur-[100px] rounded-full">
            </div>
        </div>
        <div
            class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center w-full mx-auto">
            <div
                class="flex mb-3 items-center w-full justify-center rounded-xl bg-white/50 dark:bg-slate-900/40 border border-white/50 dark:border-sky-800/60 p-2">
                <span>
                    <img class="w-9 h-9 drop-shadow-sm" src="../../assets/logo.png" alt="logo" /></span>
                <span><router-link v-if="mainStore.sidebarOpen"
                        class="md:block text-sky-950 dark:text-gray-50 text-base uppercase tracking-wide font-bold p-4 px-0 ms-0.5 "
                        to="/">
                        Nurse<span class="text-sky-600">dive</span>
                    </router-link></span>
            </div>
            <div class="flex flex-col justify-center items-center w-full">
                <!-- User -->
                <ul class="items-center flex flex-wrap list-none">
                    <li class="inline-block relative">
                        <div v-if="user?.avatar != null"
                            :class="`avatar rounded-full  ${theme?.themes[theme.currentTheme]?.bg} p-2`">
                            <div :class="`w-12 rounded-full text-yellow-500 ring-offset-2 ring-2`">
                                <img :src="'/storage/' + user.avatar" class="w-full h-full object-cover"
                                    alt="User Avatar" />
                            </div>
                        </div>
                        <router-link v-else to="/account"
                            class="tooltip w-12 h-12 bg-blue-950 text-yellow-500 text-2xl rounded-full ring-2 ring-yellow-500 ring-offset-base-100 flex items-center justify-center shadow-2xl cursor-pointer">
                            <span class="text-center">{{ user?.name.split('')[0] }}</span>
                            <div class="tooltip-content">
                                <div class="text-yellow-400 text-xs font-base ">
                                    Upload profile
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
            <!-- Admin -->
            <span v-if="route.path.startsWith('/nursing')"
                class="w-full flex justify-center text-center text-xs mt-2 font-semibold rounded-full bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-sky-800/60 py-1 px-2">
                Nursing school
            </span>
            <span v-if="route.path.startsWith('/teas')"
                class="w-full flex justify-center text-center text-xs mt-2 font-semibold rounded-full bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-sky-800/60 py-1 px-2">
                Teas Prep
            </span>
            <span v-if="route.path.startsWith('/nclex')"
                class="w-full flex justify-center text-center text-xs mt-2 font-semibold rounded-full bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-sky-800/60 py-1 px-2">
                NCLEX Prep
            </span>
            <div v-if="route.path.startsWith('/admin')" class="mt-0">
                <span class="w-full flex justify-center text-center text-xs font-bold">
                    Administration
                </span>
                <div class="relative flex flex-col rounded-x w-full">
                    <nav class="flex flex-col gap-1   dark:text-slate-200">
                        <div v-for="(item, index) in adminMenuItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-4">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    {{
                                        mainStore.sidebarOpen
                                            ? item.label
                                            : null
                                    }}
                                </div>
                            </router-link>
                        </div>
                        <hr class="border-blue-900 border-dashed px-4 my-1" />
                        <div v-for="(item, index) in adminAllAreMenuItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-4">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    {{
                                        mainStore.sidebarOpen
                                            ? item.label
                                            : null
                                    }}
                                </div>
                            </router-link>
                        </div>
                    </nav>
                </div>
            </div>
            <!-- Nclex Menu items -->
            <!-- Nursing -->
            <div v-if="route.path.startsWith('/nclex')" class="mt-0 py-1">
                <div class="relative flex flex-col rounded-x w-full">
                    <nav class="flex flex-col gap-1   dark:text-slate-200">
                        <div v-for="(item, index) in nclexMenuItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full text-sm md:text-base p-0.5 2xl:p-1 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-1">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    <span v-if="mainStore.sidebarOpen">{{
                                        item.label
                                        }}</span>
                                </div>
                            </router-link>
                        </div>
                    </nav>
                </div>
            </div>
            <!-- Nursing -->
            <div v-if="route.path.startsWith('/nursing')" class="mt-0 py-1">
                <div class="relative flex flex-col rounded-x w-full">
                    <nav class="flex flex-col gap-1  dark:text-slate-200">
                        <div v-for="(item, index) in nursingMenuItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full text-sm md:text-base p-0.5 2xl:p-1 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-1">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    <span v-if="mainStore.sidebarOpen">{{
                                        item.label
                                        }}</span>
                                </div>
                            </router-link>
                        </div>

                        <div v-for="(dropdown, index) in dropdownMenuItemsStudyNursing" :key="'dropdown-' + index"
                            class="dropdown relative dropdown-bottom leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none rounded-lg">
                            <div role="button" tabindex="0"
                                class="flex items-center  w-full p-1 rounded-lg text-start leading-tight transition-all">
                                <div class="grid place-items-center">
                                    <i :class="[
                                        dropdown.icon,
                                        theme?.themes[theme.currentTheme]
                                            ?.bg,
                                        theme?.themes[theme.currentTheme]
                                            ?.text,
                                    ]"></i>
                                    <span
                                        class="px-1 bg-error rounded-lg text-xs absolute right-6 -top-1 text-white">New</span>
                                </div>
                                <span class="flex items-center  w-full justify-between ms-1">
                                    <span v-if="mainStore.sidebarOpen">
                                        {{ dropdown.label }}</span>
                                    <i class="pi pi-angle-down mt-1 p-5"></i>
                                </span>
                            </div>
                            <ul tabindex="0"
                                class="dropdown-content z-1 menu shadow text-blue-950 bg-white rounded-box w-52 py-2">
                                <li v-for="(link, linkIndex) in dropdown.links" :key="'link-' + linkIndex"
                                    class="border-b border-gray-200 last:border-0">
                                    <router-link :to="link.route">{{
                                        link.label
                                        }}</router-link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
            <div v-if="route.path.startsWith('/teas')" class="mt-0 py-4">
                <div class="relative flex flex-col rounded-x w-full">
                    <nav class="flex flex-col gap-1   dark:text-slate-200">
                        <div v-for="(item, index) in teasMenuItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full text-sm md:text-base p-0.5 2xl:p-1 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-1">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    <span v-if="mainStore.sidebarOpen">{{
                                        item.label
                                        }}</span>
                                </div>
                            </router-link>
                        </div>
                        <div v-for="(dropdown, index) in dropdownMenuItemsStudyTeas" :key="'dropdown-' + index"
                            class="dropdown dropdown-bottom leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                            <div role="button" tabindex="0"
                                class="flex items-center  w-full p-1 rounded-lg text-start leading-tight transition-all">
                                <div class="grid place-items-center ">
                                    <i :class="[
                                        dropdown.icon,
                                        theme?.themes[theme.currentTheme]
                                            ?.bg,
                                        theme?.themes[theme.currentTheme]
                                            ?.text,
                                    ]"></i>
                                </div>
                                <span class="flex items-center  w-full justify-between ms-0.5">
                                    <span v-if="mainStore.sidebarOpen">
                                        {{ dropdown.label }}</span>
                                    <i class="pi pi-angle-down mt-1"></i>
                                </span>
                            </div>
                            <ul tabindex="0"
                                class="dropdown-content z-1 menu shadow text-blue-950 bg-white rounded-box w-52 py-2">
                                <li v-for="(link, linkIndex) in dropdown.links" :key="'link-' + linkIndex"
                                    class="border-b border-gray-200 last:border-0">
                                    <router-link :to="link.route">{{
                                        link.label
                                        }}</router-link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
            <hr class="border-blue-900 border-dashed px-4 my-1" />
            <!-- Switch Area -->
            <div v-if="!route.path.startsWith('/nursing') && !route.path.startsWith('/teas') && !route.path.startsWith('/nclex') && !route.path.startsWith(' ')"
                @click="router.back()">
                <span class=" w-full bg-blue-900 mb-4  rounded-sm cursor-pointer text-white mt-3 flex justify-center
                text-center text-xs font-bold">
                    <i class="pi pi-arrow-left"></i> <span v-if="mainStore.sidebarOpen" class="ml-2 mt-2">Go
                        Back</span>
                </span>
            </div>
            <div v-if="!route.path.startsWith('/admin')" v-for="(item, index) in welcomeMenu" :key="index">
                <router-link :to="item.route">
                    <div role="button" tabindex="0"
                        class="flex items-center w-full text-sm md:text-base p-0.5 2xl:p-1 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                        <div class="grid place-items-center mr-1">
                            <i :class="[
                                item.icon,
                                theme?.themes[
                                    theme.currentTheme
                                ]?.bg,
                                theme?.themes[
                                    theme.currentTheme
                                ]?.text,
                            ]"></i>
                        </div>
                        <span v-if="mainStore.sidebarOpen">{{
                            item.label
                            }}</span>
                    </div>
                </router-link>
            </div>
            <div v-if="!route.path.startsWith('/admin')"
                class="bg-gradient-to-br from-sky-900 via-blue-900 to-cyan-800 text-white rounded-2xl border border-cyan-700/60 shadow-lg my-2">
                <router-link to="/nursing" v-if="!route.path.startsWith('/nursing') && !route.path.startsWith(' ')">
                    <div role="button" tabindex="0"
                        class="flex items-center w-full text-sm md:text-base p-0.5 2xl:p-1 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                        <div class="grid place-items-center mr-1">
                            <i class="text-xl">&#8651;</i>
                        </div>
                        <span v-if="mainStore.sidebarOpen">Switch To Nursing</span>
                    </div>
                    <hr class="mx-4 my-1 border-sky-300 border-dashed " />
                </router-link>
                <router-link to="/teas" v-if="!route.path.startsWith('/teas') && !route.path.startsWith(' ')">
                    <div role="button" tabindex="0"
                        class="flex items-center w-full text-sm md:text-base p-0.5 2xl:p-1 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                        <div class="grid place-items-center mr-1">
                            <i class="text-xl">&#8651;</i>
                        </div>
                        <span v-if="mainStore.sidebarOpen">Switch To TEAS</span>
                    </div>
                    <hr class="mx-4 my-1 border-sky-300 border-dashed " />
                </router-link>
                <router-link to="/nclex" v-if="!route.path.startsWith('/nclex') && !route.path.startsWith(' ')">
                    <div role="button" tabindex="0"
                        class="flex items-center w-full text-sm md:text-base p-0.5 2xl:p-1 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                        <div class="grid place-items-center mr-1">
                            <i class="text-xl">&#8651;</i>
                        </div>
                        <span v-if="mainStore.sidebarOpen">Switch To NCLEX</span>
                    </div>
                </router-link>
            </div>
            <router-link to="/settings">
                <div role="button" tabindex="0"
                    class="flex items-center w-full text-sm md:text-base p-0.5 2xl:p-1 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                    <div class="grid place-items-center mr-1">
                        <i class="pi pi-cog"></i>
                    </div>
                    <span v-if="mainStore.sidebarOpen">Settings</span>
                </div>
            </router-link>
            <hr class="border-blue-900 border-dashed px-4 my-1" />
            <span @click="logout()">
                <div role="button" tabindex="0"
                    class="flex items-center w-full text-sm md:text-base p-0.5 2xl:p-1 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                    <div class="grid place-items-center mr-1">
                        <i class="pi pi-power-off"></i>
                    </div>
                    <span v-if="mainStore.sidebarOpen">Log out</span>
                </div>
            </span>
            <!-- <span @click="logout()">
                <div role="button" tabindex="0"
                    class="flex  text-sm md:text-base p-0.5 2xl:p-1 ms-1.5 text-yellow-500 font-bold items-center w-full  rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                    <div class="grid place-items-center mr-4">
                        <i class="pi pi-power-off "></i>
                    </div>
                    {{ mainStore.sidebarOpen ? "Log out" : null }}
                </div>
            </span> -->
        </div>
    </nav>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useDark } from "@vueuse/core";
import { onClickOutside, useMediaQuery } from "@vueuse/core";
import { useAuthStore } from "../../stores/authStore";
import { useMainStore } from "../../stores";
import { useThemeStore } from "../../stores/Theme";
import router from "../../router";

const collapseShow = ref("hidden");
const toggleCollapseShow = (classes) => {
    collapseShow.value = classes;
};

const { user, logout } = useAuthStore();
const mainStore = useMainStore();
const theme = useThemeStore();
const isDark = useDark({ disableTransition: false });
const route = useRoute();
const location = ref(null);
const sidebar_id = ref(null);
const login = ref(false);


const adminMenuItems = ref([
    {
        route: "/admin/",
        label: "Dashboard",
        icon: "pi pi-gauge  ",
    },
    {
        route: "/admin/users?all=1",
        label: "All Users",
        icon: "pi pi-users",
    },
    {
        route: "/admin/settings",
        label: "Settings",
        icon: "pi pi-cog",
    },
    {
        route: "/admin/exam-feedback",
        label: "Exam Feedback",
        icon: "pi pi-comments",
    },
]);

const dropdownMenuItemsStudyNursing = ref([
    {
        label: "Nursing Study",
        icon: "pi pi-book",
        links: [
            { route: "/nursing/study-chapters?chapter_id=7", label: "Fundamentals of Nursing" },
            { route: "/nursing/study-chapters?chapter_id=4", label: "Maternal and Newborn " },
            { route: "/nursing/study-chapters?chapter_id=15", label: "Pediatric" },
            { route: "/nursing/study-chapters?chapter_id=12", label: "Medical Surgical" },
            { route: "/nursing/study-chapters?chapter_id=null", label: "Adult Health " },
            { route: "/nursing/study-chapters?chapter_id=13", label: "Psychiatric/Mental Health " },
            { route: "/nursing/study-chapters?chapter_id=8", label: "Pharmacology" },
            { route: "/nursing/study-chapters?chapter_id=14", label: "Pathophysiology" },
            { route: "/nursing/study-chapters?chapter_id=null", label: "Community Health " },
            { route: "/nursing/study-chapters?chapter_id=null", label: "Leadership and Management" },
        ],
    },
]);

const nursingMenuItems = ref([
    {
        route: "/nursing/",
        label: "Dashboard",
        icon: "pi pi-gauge",
    },
    {
        route: "/nursing/rn-t-exams",
        label: "RN Exams",
        icon: "pi pi-book",
    },
    {
        route: "/nursing/lpn-t-exams",
        label: "PN Exams",
        icon: "pi pi-pencil",
    },
    {
        route: "/nursing/exit-rn-exams",
        label: "Exit RN Exams",
        icon: "pi pi-graduation-cap",
    },
    {
        route: "/nursing/exit-pn-exams",
        label: "Exit LPN Exams",
        icon: "pi pi-graduation-cap",
    },
    {
        route: "/nursing/previous-attempts",
        label: "Previous Attempts",
        icon: "pi pi-history",
    },
    {
        route: "/nursing/performance-analysis",
        label: " Performance",
        icon: "pi pi-wave-pulse ",
    },
])
const nclexMenuItems = ref([
    {
        route: "/nclex/",
        label: "Dashboard",
        icon: "pi pi-gauge",
    },
    {
        route: "/nclex/cat",
        label: "CATs Simulator",
        icon: "pi pi-desktop",
    },
    {
        route: "/nclex/linear",
        label: "Linear Tests",
        icon: "pi pi-book",
    },
    {
        route: "/nclex/readiness",
        label: "Readiness Tests",
        icon: "pi pi-clock",
    },
    {
        route: "/nclex/performance-analysis",
        label: " Performance",
        icon: "pi pi-wave-pulse ",
    },
    {
        route: "/nclex/study-pdfs",
        label: "Study Pdfs",
        icon: "pi pi-file-pdf ",
    },
    {
        route: "/nclex/study-flashcards",
        label: "Study Flashcards",
        icon: "pi pi-receipt ",
    },
])


const teasMenuItems = ref([
    {
        route: "/teas/",
        label: "Dashboard",
        icon: "pi pi-gauge",
    },
    // Subjects
    {
        route: "/teas/test-bank-loader/2",
        label: "Math",
        icon: "pi pi-calculator",
    },
    {
        route: "/teas/test-bank-loader/4",
        label: "Science",
        icon: "pi pi-sliders-h",
    },
    {
        route: "/teas/test-bank-loader/8",
        label: "Language",
        icon: "pi pi-language",
    },
    {
        route: "/teas/test-bank-loader/6",
        label: "Reading",
        icon: "pi pi-book",
    },

    // Performance
    {
        route: "/teas/previous-attempts",
        label: " Previous Attempts",
        icon: "pi pi-history",
    },

    {
        route: "/teas/performance-analysis",
        label: "Performance",
        icon: "pi pi-wave-pulse",
    },
    {
        route: "/teas/guide-topics",
        label: "Teas Study",
        icon: "pi pi-book",
    },
]);


const welcomeMenu = ref(
    [
        {
            route: "/subscription",
            label: "Subscription",
            icon: "pi pi-wallet",
        },
        {
            route: "/account",
            label: "Account",
            icon: "pi pi-id-card",
        },
        {
            route: "/referral",
            label: "Referral Program",
            icon: "pi pi-share-alt",
        },
    ])

//handle clink out
const isMobile = useMediaQuery(
    "(min-width: 100px) and (max-width: 1024px)",
);

mainStore.isMobile = isMobile

if (isMobile.value) {
    onClickOutside(sidebar_id, (event) => {
        mainStore.closeSidebar();
    });
}

onMounted(() => {
    // Access current route properties directly on route object
    if (route.path === "/login") {

        login.value = true;
    }
    location.value = route.path;
});

// Watch for changes in the current route path
watch(
    () => route.path,
    (newPath) => {
        login.value = newPath === "/login";
        location.value = route.path.split("/")[1];
    },
);
</script>
<style scoped>
[role="button"] {
    border: 1px solid transparent;
    background: transparent;
    backdrop-filter: none;
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

[role="button"]:hover,
[role="button"]:focus {
    border-color: rgba(14, 165, 233, 0.35);
    background: linear-gradient(90deg, rgba(14, 165, 233, 0.1), rgba(6, 182, 212, 0.06)) !important;
    transform: translateY(-1px);
    box-shadow: 0 14px 30px -22px rgba(14, 116, 144, 0.7);
}

[role="button"]:active {
    border-color: rgba(14, 165, 233, 0.45);
    background: linear-gradient(90deg, rgba(14, 165, 233, 0.14), rgba(6, 182, 212, 0.1)) !important;
    transform: translateY(0);
    box-shadow: 0 10px 24px -20px rgba(14, 116, 144, 0.6);
}

:global(.border-indigo-500) [role="button"] {
    border-color: transparent !important;
    background: transparent !important;
    box-shadow: none !important;
}

:global(.border-indigo-700) [role="button"] {
    border-color: rgba(14, 165, 233, 0.45);
    background: linear-gradient(90deg, rgba(14, 165, 233, 0.12), rgba(6, 182, 212, 0.08)) !important;
    color: #0c4a6e;
    font-weight: 600;
}

:global(.dark) [role="button"] {
    background: transparent;
    border-color: transparent;
}

:global(.dark) [role="button"]:hover,
:global(.dark) [role="button"]:focus {
    border-color: rgba(56, 189, 248, 0.35);
    background: linear-gradient(90deg, rgba(14, 165, 233, 0.2), rgba(16, 185, 129, 0.08)) !important;
    box-shadow: 0 16px 30px -24px rgba(2, 132, 199, 0.65);
}

:global(.dark) [role="button"]:active {
    border-color: rgba(56, 189, 248, 0.45);
    background: linear-gradient(90deg, rgba(14, 165, 233, 0.24), rgba(16, 185, 129, 0.1)) !important;
}

:global(.dark .border-indigo-700) [role="button"] {
    border-color: rgba(56, 189, 248, 0.45);
    background: linear-gradient(90deg, rgba(14, 165, 233, 0.2), rgba(16, 185, 129, 0.1)) !important;
    color: #dbeafe;
}

[role="button"]:hover i,
[role="button"]:focus i,
[role="button"]:active i {
    transform: scale(1.03);
}

input[type="search"] {
    border-color: rgba(14, 165, 233, 0.45);
    box-shadow: 0 6px 20px -18px rgba(14, 116, 144, 0.7);
}

:deep(.dropdown-content) {
    border: 1px solid rgba(148, 163, 184, 0.3);
    box-shadow: 0 22px 45px -24px rgba(15, 23, 42, 0.5);
}

:deep(.dropdown-content li > a) {
    border-radius: 0.5rem;
}

i {
    padding: 5px;
    color: #f8fafc;
    background: linear-gradient(135deg, #1d4ed8, #0891b2);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow:
        0 6px 14px rgba(15, 23, 42, 0.25),
        0 2px 4px rgba(15, 23, 42, 0.15);
    width: 30px;
    height: 30px;
    line-height: 30px;
    transition: all 0.3s ease;
    border-radius: 50%;
}

i:hover {
    background: linear-gradient(135deg, #0ea5e9, #22d3ee);
    box-shadow:
        0 14px 26px rgba(14, 116, 144, 0.28),
        0 6px 10px rgba(15, 23, 42, 0.16);
    transform: scale(1.06);
}

i.pi-angle-down,
i.pi-angle-right,
i.pi-arrow-left {
    background: transparent;
    color: inherit;
    box-shadow: none;
    width: auto;
    height: auto;
    padding: 0;
    border-radius: 0;
}
</style>

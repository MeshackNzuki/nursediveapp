<template>
    <nav v-if="!login" ref="sidebar_id" :class="sidebarShellClass" aria-label="Primary navigation">
        <div class="relative z-10 flex h-full min-h-0 flex-col">
            <router-link to="/" :class="brandClass" :title="isSidebarOpen ? undefined : 'Nursedive'">
                <span
                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/95 shadow-lg shadow-sky-950/20">
                    <img src="../../assets/logo.png" class="h-8 w-8 object-contain" alt="Nursedive logo" />
                </span>
                <span v-if="isSidebarOpen" class="min-w-0">
                    <span class="block text-xs font-bold uppercase tracking-widest text-white">
                        Nursedive
                    </span>
                    <span class="block text-xs text-bright-sun-500">
                        Plan, Study, Excel
                    </span>
                </span>
            </router-link>

            <router-link to="/account" :class="profileClass" :title="isSidebarOpen ? undefined : 'Account'">
                <span v-if="user?.avatar" :class="[profileAvatarClass, 'overflow-hidden']">
                    <img :src="'/storage/' + user.avatar" class="h-full w-full object-cover" alt="User avatar" />
                </span>
                <span v-else :class="profileAvatarClass">
                    {{ userInitial }}
                </span>

                <span v-if="isSidebarOpen" class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-bold text-white">
                        {{ userName }}
                    </span>
                    <span class="block truncate text-xs text-cyan-50/90">
                        {{ workspaceLabel }}
                    </span>
                </span>
            </router-link>
            <div class="sidebar-scroll mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4">
                <p v-if="isSidebarOpen"
                    class="mb-2 pl-1 text-xs font-extrabold uppercase tracking-wides text-bright-sun-500">
                    <i class="pi pi-briefcase "></i> {{ menuSectionTitle }}
                </p>

                <button v-if="showBackButton" type="button" :class="navItemClass(false)" title="Go back"
                    @click="router.back()">
                    <span :class="sidebarIconClass(false)">
                        <i class="pi pi-arrow-left"></i>
                    </span>
                    <span v-if="isSidebarOpen" class="truncate">Go Back</span>
                </button>

                <div class="space-y-1.5">
                    <router-link v-for="item in activeMenuItems" :key="item.route" :to="item.route" custom
                        v-slot="{ href, navigate, isActive, isExactActive }">
                        <a :href="href" :class="navItemClass(isActive || isExactActive, item)"
                            :title="isSidebarOpen ? undefined : item.label" @click="navigate">
                            <span :class="sidebarIconClass(isActive || isExactActive, item)">
                                <i :class="item.icon"></i>
                            </span>
                            <span v-if="isSidebarOpen" class="min-w-0 flex-1 truncate">
                                {{ item.label }}
                            </span>
                            <span v-if="isSidebarOpen && item.badge"
                                class="rounded-full bg-white/10 px-2 py-0.5 text-xs font-black uppercase text-sky-100/90">
                                {{ item.badge }}
                            </span>
                        </a>
                    </router-link>
                </div>
                <div v-if="activeDropdownItems.length" class="mt-2 space-y-1.5">
                    <div v-for="dropdown in activeDropdownItems" :key="dropdown.label" :class="dropdownShellClass">
                        <button type="button" tabindex="0" :class="navItemClass(false, dropdown)"
                            :title="isSidebarOpen ? undefined : dropdown.label">
                            <span :class="sidebarIconClass(false, dropdown)">
                                <i :class="dropdown.icon"></i>
                            </span>
                            <span v-if="isSidebarOpen" class="min-w-0 flex-1 truncate">
                                {{ dropdown.label }}
                            </span>
                            <span v-if="isSidebarOpen && dropdown.badge"
                                class="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-black uppercase text-amber-200">
                                {{ dropdown.badge }}
                            </span>
                            <i v-if="isSidebarOpen" class="pi pi-angle-down text-xs text-cyan-100/60"></i>
                        </button>

                        <ul tabindex="0"
                            class="dropdown-content z-50 w-64 rounded-2xl border border-sky-950/10 bg-white/95 p-2 shadow-2xl shadow-slate-950/20">
                            <li v-for="link in dropdown.links" :key="link.route">
                                <router-link :to="link.route"
                                    class="block rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-sky-100 hover:text-sky-800 focus-visible:bg-sky-100 focus-visible:text-sky-800">
                                    {{ link.label }}
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-if="activeSecondaryMenuItems.length" class="mt-5">
                    <p v-if="isSidebarOpen"
                        class="mb-2 pl-1 text-xs font-extrabold uppercase tracking-widest text-sky-200/70">
                        Manage
                    </p>
                    <div class="space-y-1.5">
                        <router-link v-for="item in activeSecondaryMenuItems" :key="item.route" :to="item.route" custom
                            v-slot="{ href, navigate, isActive, isExactActive }">
                            <a :href="href" :class="navItemClass(isActive || isExactActive, item)"
                                :title="isSidebarOpen ? undefined : item.label" @click="navigate">
                                <span :class="sidebarIconClass(isActive || isExactActive, item)">
                                    <i :class="item.icon"></i>
                                </span>
                                <span v-if="isSidebarOpen" class="min-w-0 flex-1 truncate">
                                    {{ item.label }}
                                </span>
                            </a>
                        </router-link>
                    </div>
                </div>

                <div v-if="!isAdminArea" :class="switcherClass">
                    <p v-if="isSidebarOpen"
                        class="mb-2 pl-1 text-xs font-extrabold uppercase tracking-widest text-sky-100/70">
                        Switch Prep Area
                    </p>
                    <div :class="isSidebarOpen ? 'space-y-2' : 'space-y-1.5'">
                        <router-link v-for="area in switchAreas" :key="area.route" :to="area.route" custom
                            v-slot="{ href, navigate, isActive, isExactActive }">
                            <a :href="href" :class="switchItemClass(isActive || isExactActive)"
                                :title="isSidebarOpen ? undefined : area.label" @click="navigate">
                                <span :class="switchIconClass">
                                    <i :class="area.icon + ' text-[#75DDFF]'"></i>
                                </span>
                                <span v-if="isSidebarOpen" class="min-w-0 flex-1">
                                    <span class="block truncate text-sm font-bold text-white">{{ area.short }}</span>
                                    <span class="block truncate text-xs text-bright-sun-500 font-semibold">{{ area.label
                                        }}</span>
                                </span>
                                <i v-if="isSidebarOpen" class="pi pi-arrow-right text-xs text-cyan-100/50"></i>
                            </a>
                        </router-link>
                    </div>
                </div>

                <div v-if="!isAdminArea" class="mt-5">
                    <p v-if="isSidebarOpen"
                        class="mb-2 pl-1 text-xs font-extrabold uppercase tracking-widest text-sky-200/70">
                        Utilities
                    </p>
                    <div class="space-y-1.5">
                        <router-link v-for="item in welcomeMenu" :key="item.route" :to="item.route" custom
                            v-slot="{ href, navigate, isActive, isExactActive }">
                            <a :href="href" :class="navItemClass(isActive || isExactActive, item)"
                                :title="isSidebarOpen ? undefined : item.label" @click="navigate">
                                <span :class="sidebarIconClass(isActive || isExactActive, item)">
                                    <i :class="item.icon"></i>
                                </span>
                                <span v-if="isSidebarOpen" class="min-w-0 flex-1 truncate">
                                    {{ item.label }}
                                </span>
                            </a>
                        </router-link>
                    </div>
                </div>
            </div>

            <div class="border-t border-cyan-200/10 px-3 py-3">
                <router-link v-if="isSidebarOpen && !isAdminArea" to="/referral"
                    class="flex items-center gap-3 rounded-2xl border border-amber-300/20 bg-gradient-to-br from-sky-900/90 to-sky-600/10 p-3 transition hover:-translate-y-px hover:border-amber-300/40 hover:from-amber-300/25 hover:to-sky-500/20">
                    <span :class="promoIconClass">
                        <i class="pi pi-bolt text-bright-sun-500 "></i>
                    </span>
                    <span class="min-w-0">
                        <span class="block text-xs font-extrabold uppercase tracking-wide text-bright-sun-500">
                            Get 14 days free
                        </span>
                        <span class="block truncate text-xs text-white/90 font-bold italic">
                            Refer a friend to earn
                        </span>
                    </span>
                </router-link>
                <div class="mt-2 space-y-1.5">
                    <router-link to="/settings" custom v-slot="{ href, navigate, isActive, isExactActive }">
                        <a :href="href" :class="navItemClass(isActive || isExactActive, { icon: 'pi pi-cog' })"
                            :title="isSidebarOpen ? undefined : 'Settings'" @click="navigate">
                            <span :class="sidebarIconClass(isActive || isExactActive)">
                                <i class="pi pi-cog"></i>
                            </span>
                            <span v-if="isSidebarOpen" class="truncate">Settings</span>
                        </a>
                    </router-link>

                    <button type="button" :class="logoutClass" :title="isSidebarOpen ? undefined : 'Log out'"
                        @click="logout()">
                        <span :class="sidebarIconClass(false, { danger: true })">
                            <i class="pi pi-power-off"></i>
                        </span>
                        <span v-if="isSidebarOpen" class="truncate">Log out</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { onClickOutside, useMediaQuery } from "@vueuse/core";
import { useAuthStore } from "../../stores/authStore";
import { useMainStore } from "../../stores";
import router from "../../router";

const { user, logout } = useAuthStore();
const mainStore = useMainStore();
const route = useRoute();
const sidebar_id = ref(null);

const productAreas = [
    {
        prefix: "/nursing",
        route: "/nursing",
        label: "Nursing School",
        short: "Nursing",
        icon: "pi pi-graduation-cap",
    },
    {
        prefix: "/teas",
        route: "/teas",
        label: "TEAS Prep",
        short: "TEAS",
        icon: "pi pi-sparkles",
    },
    {
        prefix: "/nclex",
        route: "/nclex",
        label: "NCLEX Prep",
        short: "NCLEX",
        icon: "pi pi-shield",
    },
];

const adminMenuItems = ref([
    {
        route: "/admin/",
        label: "Dashboard",
        icon: "pi pi-gauge",
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

const adminSecondaryMenuItems = ref([
    {
        route: "/admin/all-payments",
        label: "All Payments",
        icon: "pi pi-wallet",
    },
    {
        route: "/admin/teas-payments",
        label: "TEAS Payments",
        icon: "pi pi-credit-card",
    },
    {
        route: "/admin/nursing-payments",
        label: "Nursing Payments",
        icon: "pi pi-receipt",
    },
    {
        route: "/admin/nclex-payments",
        label: "NCLEX Payments",
        icon: "pi pi-verified",
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
        label: "Performance",
        icon: "pi pi-wave-pulse",
    },
]);

const nclexMenuItems = ref([
    {
        route: "/nclex/",
        label: "Dashboard",
        icon: "pi pi-gauge",
    },
    {
        route: "/nclex/cat",
        label: "CAT Simulator",
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
        route: "/nclex/previous-attempts",
        label: "Previous Attempts",
        icon: "pi pi-history",
    },
    {
        route: "/nclex/performance-analysis",
        label: "Performance",
        icon: "pi pi-wave-pulse",
    },
]);

const teasMenuItems = ref([
    {
        route: "/teas/",
        label: "Dashboard",
        icon: "pi pi-gauge",
    },
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
    {
        route: "/teas/previous-attempts",
        label: "Previous Attempts",
        icon: "pi pi-history",
    },
    {
        route: "/teas/performance-analysis",
        label: "Performance",
        icon: "pi pi-wave-pulse",
    },
    {
        route: "/teas/guide-topics",
        label: "Study Guide",
        icon: "pi pi-map",
    },
]);

const dropdownMenuItemsStudyNursing = ref([
    {
        label: "Nursing Study",
        icon: "pi pi-book",
        badge: "New",
        links: [
            { route: "/nursing/study-chapters?chapter_id=7", label: "Fundamentals of Nursing" },
            { route: "/nursing/study-chapters?chapter_id=4", label: "Maternal and Newborn" },
            { route: "/nursing/study-chapters?chapter_id=15", label: "Pediatric" },
            { route: "/nursing/study-chapters?chapter_id=12", label: "Medical Surgical" },
            { route: "/nursing/study-chapters?chapter_id=null", label: "Adult Health" },
            { route: "/nursing/study-chapters?chapter_id=13", label: "Psychiatric/Mental Health" },
            { route: "/nursing/study-chapters?chapter_id=8", label: "Pharmacology" },
            { route: "/nursing/study-chapters?chapter_id=14", label: "Pathophysiology" },
            { route: "/nursing/study-chapters?chapter_id=null", label: "Community Health" },
            { route: "/nursing/study-chapters?chapter_id=null", label: "Leadership and Management" },
        ],
    },
]);

const welcomeMenu = ref([
    {
        route: "/subscription",
        label: "Plans & Billing",
        icon: "pi pi-wallet",
    },
    {
        route: "/account",
        label: "Account",
        icon: "pi pi-id-card",
    },
    {
        route: "/notifications",
        label: "Notifications",
        icon: "pi pi-bell",
    },
    {
        route: "/referral",
        label: "Referral Program",
        icon: "pi pi-share-alt",
    },
]);

const isMobile = useMediaQuery("(min-width: 100px) and (max-width: 1024px)");

watch(
    isMobile,
    (value) => {
        mainStore.isMobile = value;
    },
    { immediate: true },
);

onClickOutside(sidebar_id, () => {
    if (isMobile.value) {
        mainStore.closeSidebar();
    }
});

const login = computed(() => route.path === "/login");
const isSidebarOpen = computed(() => mainStore.sidebarOpen);
const isAdminArea = computed(() => route.path.startsWith("/admin"));

const isAreaPath = (prefix) => route.path === prefix || route.path.startsWith(`${prefix}/`);

const currentProductArea = computed(() =>
    productAreas.find((area) => isAreaPath(area.prefix)) || null,
);

const userName = computed(() => user?.name || "Student");

const userInitial = computed(() => {
    const name = userName.value.trim();
    return name ? name.charAt(0).toUpperCase() : "U";
});

const workspaceLabel = computed(() => {
    if (isAdminArea.value) return "Administration";
    return currentProductArea.value?.label || "";
});

const menuSectionTitle = computed(() => {
    if (isAdminArea.value) return "Admin Suite";
    return currentProductArea.value?.label || "Learning Products";
});

const activeMenuItems = computed(() => {
    if (isAdminArea.value) return adminMenuItems.value;
    if (isAreaPath("/nursing")) return nursingMenuItems.value;
    if (isAreaPath("/teas")) return teasMenuItems.value;
    if (isAreaPath("/nclex")) return nclexMenuItems.value;
    return [];
});

const activeSecondaryMenuItems = computed(() =>
    isAdminArea.value ? adminSecondaryMenuItems.value : [],
);

const activeDropdownItems = computed(() => {
    if (isAreaPath("/nursing")) return dropdownMenuItemsStudyNursing.value;
    return [];
});

const switchAreas = computed(() =>
    productAreas.filter((area) => !isAreaPath(area.prefix)),
);

const showBackButton = computed(() =>
    !isAdminArea.value &&
    !currentProductArea.value &&
    route.path !== "/",
);

const sidebarShellClass = computed(() => [
    "fixed bottom-2 left-2 top-2 z-10 flex flex-col overflow-hidden rounded-3xl bg-[rgb(11_40_69)] text-slate-100 shadow-2xl shadow-slate-950/40 transition-all duration-300 ease-out",
    mainStore.isMobile
        ? mainStore.sidebarOpen
            ? "w-52 translate-x-0 opacity-100"
            : "pointer-events-none w-0 -translate-x-3 opacity-0"
        : mainStore.sidebarOpen
            ? "w-64"
            : "w-24",
]);

const brandClass = computed(() => [
    "mx-3 mt-3 flex min-h-14 items-center gap-3 rounded-2xl   text-white  ",
    isSidebarOpen.value ? "justify-start px-3" : "justify-center px-2",
]);

const profileClass = computed(() => [
    "mx-3 mt-3 flex items-center gap-3 rounded-2xl border border-sky-300/20 bg-white/5 text-white transition hover:-translate-y-px hover:border-sky-300/30 hover:bg-white/10",
    isSidebarOpen.value ? "justify-start px-3 py-3" : "justify-center px-2 py-2.5",
]);

const profileAvatarClass =
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-800 text-sm font-extrabold text-bright-sun-500 shadow-lg shadow-cyan-950/20";

const sidebarIconBaseClass =
    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-950/70 text-sm text-cyan-300 transition";

const switchIconClass = [
    sidebarIconBaseClass,
    "border-cyan-300/30 bg-sky-500/20 text-white",
];

const promoIconClass = [
    sidebarIconBaseClass,
    "border-cyan-300/30 bg-sky-500/20 text-white",
];

const switcherClass = computed(() => [
    "mt-5",
    isSidebarOpen.value ? "rounded-2xl border border-cyan-200/10 bg-white/5 p-3" : "",
]);

const dropdownShellClass = computed(() => [
    "dropdown w-full",
    isSidebarOpen.value ? "dropdown-bottom" : "dropdown-right",
]);

const navItemClass = (active = false, item = {}) => [
    "flex min-h-11 w-full items-center gap-3 rounded-2xl border border-transparent text-sm font-bold leading-tight text-slate-100/90 outline-none transition hover:-translate-y-px hover:bg-white/10 hover:text-white focus-visible:-translate-y-px focus-visible:bg-white/10 focus-visible:text-white",
    isSidebarOpen.value ? "justify-start px-3" : "justify-center px-2",
    active
        ? "border-cyan-300/30 bg-gradient-to-r from-sky-500/25 to-teal-500/10 text-white shadow-lg shadow-sky-950/20"
        : "",
    item.featured ? "text-amber-100" : "",
];

const sidebarIconClass = (active = false, item = {}) => [
    sidebarIconBaseClass,
    active ? "border-cyan-300/30 bg-sky-500/20 text-white" : "",
    item.danger ? "text-rose-200" : "",
    item.featured ? "border-amber-300/30 bg-amber-300/20 text-amber-100" : "",
];

const switchItemClass = (active = false) => [
    "flex min-h-11 w-full items-center gap-3 rounded-2xl border border-transparent text-sm font-bold leading-tight text-slate-100/90 outline-none transition hover:-translate-y-px hover:bg-white/10 hover:text-white focus-visible:-translate-y-px focus-visible:bg-white/10 focus-visible:text-white",
    isSidebarOpen.value ? "justify-start px-2.5 py-2" : "justify-center px-2 py-2",
    active
        ? "border-cyan-300/30 bg-gradient-to-r from-sky-500/25 to-teal-500/10 text-white shadow-lg shadow-sky-950/20"
        : "",
];

const logoutClass = computed(() => [
    "flex min-h-11 w-full items-center gap-3 rounded-2xl border border-transparent text-sm font-bold leading-tight text-slate-100/90 outline-none transition hover:-translate-y-px hover:bg-white/10 hover:text-white focus-visible:-translate-y-px focus-visible:bg-white/10 focus-visible:text-white",
    isSidebarOpen.value ? "justify-start px-3" : "justify-center px-2",
]);
</script>

<style scoped>
.sidebar-scroll {
    scrollbar-color: rgba(103, 232, 249, 0.32) transparent;
    scrollbar-width: thin;
}

.sidebar-scroll::-webkit-scrollbar {
    width: 5px;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
    background: rgba(103, 232, 249, 0.28);
    border-radius: 999px;
}
</style>

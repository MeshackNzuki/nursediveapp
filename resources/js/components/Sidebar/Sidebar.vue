<template>
    <nav v-if="!login" ref="sidebar_id" :class="sidebarShellClass" aria-label="Primary navigation">
        <div class="sidebar-surface"></div>

        <div class="relative z-10 flex h-full min-h-0 flex-col">
            <router-link to="/" :class="brandClass" :title="isSidebarOpen ? undefined : 'NurseDive'">
                <span class="brand-mark">
                    <img src="../../assets/logo.png" alt="NurseDive logo" />
                </span>
                <span v-if="isSidebarOpen" class="min-w-0">
                    <span class="block text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                        NurseDive
                    </span>
                    <span class="block text-base font-bold leading-5 text-white">
                        Prep Studio
                    </span>
                </span>
            </router-link>

            <router-link to="/account" :class="profileClass" :title="isSidebarOpen ? undefined : 'Account'">
                <span v-if="user?.avatar" class="profile-avatar overflow-hidden">
                    <img :src="'/storage/' + user.avatar" class="h-full w-full object-cover" alt="User avatar" />
                </span>
                <span v-else class="profile-avatar">
                    {{ userInitial }}
                </span>

                <span v-if="isSidebarOpen" class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-bold text-white">
                        {{ userName }}
                    </span>
                    <span class="block truncate text-xs text-cyan-100/70">
                        {{ workspaceLabel }}
                    </span>
                </span>
            </router-link>

            <router-link :to="scheduleRoute" :class="scheduleClass" :title="isSidebarOpen ? undefined : scheduleLabel">
                <span class="schedule-illustration">
                    <i class="pi pi-calendar-clock"></i>
                </span>
                <span v-if="isSidebarOpen" class="min-w-0">
                    <span class="block text-sm font-bold text-white">
                        {{ scheduleLabel }}
                    </span>
                    <span class="block truncate text-xs text-cyan-100/70">
                        {{ scheduleDetail }}
                    </span>
                </span>
            </router-link>

            <div class="sidebar-scroll mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4">
                <p v-if="isSidebarOpen" class="sidebar-kicker">
                    {{ menuSectionTitle }}
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
                            <span v-if="isSidebarOpen && item.badge" class="sidebar-badge">
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
                            <span v-if="isSidebarOpen && dropdown.badge" class="sidebar-badge sidebar-badge-hot">
                                {{ dropdown.badge }}
                            </span>
                            <i v-if="isSidebarOpen" class="pi pi-angle-down text-xs text-cyan-100/60"></i>
                        </button>

                        <ul tabindex="0" class="dropdown-content sidebar-dropdown-menu z-50 w-64 rounded-2xl p-2">
                            <li v-for="link in dropdown.links" :key="link.route">
                                <router-link :to="link.route" class="sidebar-dropdown-link">
                                    {{ link.label }}
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-if="activeSecondaryMenuItems.length" class="mt-5">
                    <p v-if="isSidebarOpen" class="sidebar-kicker">
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

                <div v-if="!isAdminArea" class="mt-5">
                    <p v-if="isSidebarOpen" class="sidebar-kicker">
                        Workspace
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

                <div v-if="!isAdminArea" :class="switcherClass">
                    <p v-if="isSidebarOpen" class="sidebar-kicker mb-2">
                        Switch Prep Area
                    </p>
                    <div :class="isSidebarOpen ? 'space-y-2' : 'space-y-1.5'">
                        <router-link v-for="area in switchAreas" :key="area.route" :to="area.route" custom
                            v-slot="{ href, navigate, isActive, isExactActive }">
                            <a :href="href" :class="switchItemClass(isActive || isExactActive)"
                                :title="isSidebarOpen ? undefined : area.label" @click="navigate">
                                <span class="switch-icon">
                                    <i :class="area.icon"></i>
                                </span>
                                <span v-if="isSidebarOpen" class="min-w-0 flex-1">
                                    <span class="block truncate text-sm font-bold">{{ area.short }}</span>
                                    <span class="block truncate text-[11px] text-cyan-100/60">{{ area.label }}</span>
                                </span>
                                <i v-if="isSidebarOpen" class="pi pi-arrow-right text-[10px] text-cyan-100/50"></i>
                            </a>
                        </router-link>
                    </div>
                </div>
            </div>

            <div class="border-t border-cyan-200/10 px-3 py-3">
                <router-link v-if="isSidebarOpen && !isAdminArea" to="/subscription" class="sidebar-promo">
                    <span class="promo-icon">
                        <i class="pi pi-bolt"></i>
                    </span>
                    <span class="min-w-0">
                        <span class="block text-xs font-extrabold uppercase tracking-wide text-amber-200">
                            Explore more products
                        </span>
                        <span class="block truncate text-[11px] text-cyan-100/70">
                            Build your full prep stack
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
    return currentProductArea.value?.label || "Learning Hub";
});

const menuSectionTitle = computed(() => {
    if (isAdminArea.value) return "Admin Suite";
    return currentProductArea.value?.label || "Learning Products";
});

const scheduleRoute = computed(() => currentProductArea.value?.route || "/");

const scheduleLabel = computed(() =>
    currentProductArea.value ? "Select Exam Date" : "Choose Your Path",
);

const scheduleDetail = computed(() =>
    currentProductArea.value ? currentProductArea.value.label : "Open your learning hub",
);

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
    "sidebar-shell fixed bottom-2 left-2 top-2 z-10 flex flex-col overflow-hidden rounded-[1.35rem] border border-cyan-300/15 text-slate-100 transition-all duration-300 ease-out",
    mainStore.isMobile
        ? mainStore.sidebarOpen
            ? "w-52 translate-x-0 opacity-100"
            : "pointer-events-none w-0 -translate-x-3 opacity-0"
        : mainStore.sidebarOpen
            ? "w-64"
            : "w-24",
]);

const brandClass = computed(() => [
    "sidebar-brand mx-3 mt-3 flex min-h-14 items-center gap-3 rounded-2xl",
    isSidebarOpen.value ? "justify-start px-3" : "justify-center px-2",
]);

const profileClass = computed(() => [
    "sidebar-profile mx-3 mt-3 flex items-center gap-3 rounded-2xl",
    isSidebarOpen.value ? "justify-start px-3 py-3" : "justify-center px-2 py-2.5",
]);

const scheduleClass = computed(() => [
    "sidebar-schedule mx-3 mt-3 flex items-center gap-3 rounded-[1.25rem]",
    isSidebarOpen.value ? "justify-start px-3 py-3.5" : "justify-center px-2 py-3",
]);

const switcherClass = computed(() => [
    "mt-5",
    isSidebarOpen.value ? "rounded-2xl border border-cyan-200/10 bg-white/[0.04] p-3" : "",
]);

const dropdownShellClass = computed(() => [
    "dropdown w-full",
    isSidebarOpen.value ? "dropdown-bottom" : "dropdown-right",
]);

const navItemClass = (active = false, item = {}) => [
    "sidebar-nav-item",
    isSidebarOpen.value ? "justify-start px-3" : "justify-center px-2",
    active ? "is-active" : "",
    item.featured ? "is-featured" : "",
];

const sidebarIconClass = (active = false, item = {}) => [
    "sidebar-icon",
    active ? "is-active" : "",
    item.danger ? "is-danger" : "",
    item.featured ? "is-featured" : "",
];

const switchItemClass = (active = false) => [
    "sidebar-switch-item",
    isSidebarOpen.value ? "justify-start px-2.5 py-2" : "justify-center px-2 py-2",
    active ? "is-active" : "",
];

const logoutClass = computed(() => [
    "sidebar-nav-item w-full",
    isSidebarOpen.value ? "justify-start px-3" : "justify-center px-2",
]);
</script>

<style scoped>
.sidebar-shell {
    background:
        linear-gradient(180deg, rgba(7, 47, 75, 0.98) 0%, rgba(5, 35, 60, 0.98) 48%, rgba(4, 28, 48, 0.98) 100%);
    box-shadow:
        0 24px 55px -34px rgba(2, 6, 23, 0.95),
        inset 0 1px 0 rgba(255, 255, 255, 0.07);
}

.sidebar-surface {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(135deg, rgba(56, 189, 248, 0.12), transparent 38%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 24%),
        linear-gradient(0deg, rgba(20, 184, 166, 0.08), transparent 42%);
}

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

.sidebar-brand {
    color: white;
    background: rgba(255, 255, 255, 0.045);
    border: 1px solid rgba(125, 211, 252, 0.13);
    transition: background 0.2s ease, border-color 0.2s ease;
}

.sidebar-brand:hover {
    background: rgba(255, 255, 255, 0.075);
    border-color: rgba(125, 211, 252, 0.24);
}

.brand-mark {
    display: inline-flex;
    height: 2.5rem;
    width: 2.5rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 12px 24px -18px rgba(8, 145, 178, 0.8);
}

.brand-mark img {
    height: 1.9rem;
    width: 1.9rem;
    object-fit: contain;
}

.sidebar-profile,
.sidebar-schedule {
    color: white;
    border: 1px solid rgba(125, 211, 252, 0.12);
    background: rgba(255, 255, 255, 0.055);
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.sidebar-profile:hover,
.sidebar-schedule:hover {
    border-color: rgba(125, 211, 252, 0.25);
    background: rgba(255, 255, 255, 0.085);
    transform: translateY(-1px);
}

.profile-avatar {
    display: inline-flex;
    height: 2.35rem;
    width: 2.35rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: linear-gradient(135deg, #0ea5e9, #14b8a6);
    color: white;
    font-size: 0.9rem;
    font-weight: 800;
    box-shadow: 0 10px 18px -14px rgba(34, 211, 238, 0.9);
}

.schedule-illustration {
    display: inline-flex;
    height: 2.55rem;
    width: 2.55rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.26), rgba(20, 184, 166, 0.18));
    color: #a5f3fc;
}

.sidebar-kicker {
    margin-bottom: 0.55rem;
    padding-left: 0.4rem;
    color: rgba(186, 230, 253, 0.66);
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.sidebar-nav-item,
.sidebar-switch-item {
    display: flex;
    min-height: 2.7rem;
    width: 100%;
    align-items: center;
    gap: 0.7rem;
    border-radius: 1rem;
    color: rgba(241, 245, 249, 0.86);
    font-size: 0.9rem;
    font-weight: 700;
    line-height: 1.2;
    outline: none;
    transition:
        background 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease,
        box-shadow 0.18s ease;
}

.sidebar-nav-item:hover,
.sidebar-nav-item:focus-visible,
.sidebar-switch-item:hover,
.sidebar-switch-item:focus-visible {
    background: rgba(255, 255, 255, 0.075);
    color: #ffffff;
    transform: translateY(-1px);
}

.sidebar-nav-item.is-active,
.sidebar-switch-item.is-active {
    background: linear-gradient(90deg, rgba(14, 165, 233, 0.26), rgba(20, 184, 166, 0.12));
    color: #ffffff;
    box-shadow:
        inset 3px 0 0 rgba(103, 232, 249, 0.95),
        0 16px 30px -26px rgba(14, 165, 233, 0.7);
}

.sidebar-icon,
.switch-icon,
.promo-icon {
    display: inline-flex;
    height: 1.95rem;
    width: 1.95rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 0.8rem;
    border: 1px solid rgba(125, 211, 252, 0.16);
    background: rgba(8, 47, 73, 0.72);
    color: #67e8f9;
    transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.sidebar-icon i,
.switch-icon i,
.promo-icon i {
    font-size: 0.88rem;
}

.sidebar-icon.is-active,
.switch-icon,
.promo-icon {
    border-color: rgba(103, 232, 249, 0.3);
    background: rgba(14, 165, 233, 0.2);
    color: #ffffff;
}

.sidebar-icon.is-danger {
    color: #fecdd3;
}

.sidebar-badge {
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.18rem 0.45rem;
    color: rgba(224, 242, 254, 0.9);
    font-size: 0.62rem;
    font-weight: 900;
    text-transform: uppercase;
}

.sidebar-badge-hot {
    background: rgba(251, 191, 36, 0.2);
    color: #fde68a;
}

.sidebar-dropdown-menu {
    border: 1px solid rgba(8, 47, 73, 0.12);
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 26px 55px -28px rgba(2, 6, 23, 0.55);
}

.sidebar-dropdown-link {
    display: block;
    border-radius: 0.8rem;
    padding: 0.65rem 0.75rem;
    color: #0f2742;
    font-size: 0.84rem;
    font-weight: 700;
}

.sidebar-dropdown-link:hover,
.sidebar-dropdown-link:focus-visible {
    background: #e0f2fe;
    color: #075985;
}

.sidebar-switch-item {
    color: rgba(241, 245, 249, 0.9);
}

.sidebar-promo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-radius: 1.1rem;
    border: 1px solid rgba(251, 191, 36, 0.2);
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.14), rgba(14, 165, 233, 0.1));
    padding: 0.75rem;
    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.sidebar-promo:hover {
    border-color: rgba(251, 191, 36, 0.34);
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.19), rgba(14, 165, 233, 0.14));
    transform: translateY(-1px);
}
</style>

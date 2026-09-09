<template>
    <nav v-if="!login" id="app-sidebar" ref="sidebar_id" :class="sidebarShellClass" aria-label="Primary navigation">
        <button v-if="isMobile && isSidebarOpen" type="button"
            class="absolute right-2.5 top-2.5 z-20 inline-flex h-6 w-6 items-center justify-center rounded-full border border-cyan-200/20 bg-white/10 text-cyan-50 shadow-lg shadow-sky-950/20 transition hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            aria-label="Close sidebar" @pointerdown.stop @click.stop="mainStore.closeSidebar()">
            <i class="pi pi-times text-xs"></i>
        </button>

        <div class="relative z-10 flex h-full min-h-0 flex-col">
            <router-link to="/" :class="brandClass" :title="isSidebarOpen ? undefined : 'Nursenex'">
                <span
                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/95 shadow-lg shadow-sky-950/20">
                    <img src="../../assets/logo.png" class="h-8 w-8 object-contain" alt="Nursenex logo" />
                </span>
                <span v-if="isSidebarOpen" class="min-w-0">
                    <span class="block text-xs font-bold uppercase tracking-widest text-white">
                        Nursenex
                    </span>
                    <span class="block text-xs text-sky-300">
                        Plan, Study, Excel
                    </span>
                </span>
            </router-link>
            <router-link to="/account" :class="profileClass" @mouseenter="showTip($event, 'Account')" @mouseleave="hideTip">
                <span class="relative shrink-0">
                    <span v-if="user?.avatar" :class="[profileAvatarClass, 'overflow-hidden']">
                        <img :src="'/storage/' + user.avatar" class="h-full w-full object-cover" alt="User avatar" />
                    </span>
                    <span v-else :class="profileAvatarClass">
                        {{ userInitial }}
                    </span>
                    <span v-if="!isAdminArea" class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[rgb(11_40_69)]"
                        :class="subscriptionSummary.dotClass" :title="subscriptionSummary.statusLabel"></span>
                </span>

                <span v-if="isSidebarOpen" class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-bold text-white">
                        {{ userName }}
                    </span>
                    <span class="block truncate text-xs text-cyan-50/90">
                        {{ workspaceLabel }}
                    </span>
                </span>
                <span v-if="isSidebarOpen && !isAdminArea" class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                    :class="subscriptionSummary.pillClass">
                    {{ subscriptionSummary.statusLabel }}
                </span>
            </router-link>
            <div class="sidebar-scroll mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4">
                <p v-if="isSidebarOpen"
                    class="mb-2 pl-1 text-xs font-extrabold uppercase tracking-widest text-bright-sun-500">
                    <i class="pi pi-briefcase "></i> {{ menuSectionTitle }}
                </p>

                <button v-if="showBackButton" type="button" :class="navItemClass(false)"
                    @mouseenter="showTip($event, 'Go back')" @mouseleave="hideTip" @click="router.back()">
                    <span :class="sidebarIconClass(false)">
                        <i class="pi pi-arrow-left"></i>
                    </span>
                    <span v-if="isSidebarOpen" class="truncate">Go Back</span>
                </button>

                <div class="space-y-1.5">
                    <router-link v-for="(item, index) in activeMenuItems" :key="item.route" :to="item.route" custom
                        v-slot="{ href, navigate, isActive, isExactActive }">
                        <a :href="href" :class="[navItemClass(isActive || isExactActive, item), 'ui-rise']"
                            :style="{ animationDelay: `${index * 30}ms` }"
                            @mouseenter="showTip($event, item.label)" @mouseleave="hideTip" @click="navigate">
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
                            @mouseenter="showTip($event, dropdown.label)" @mouseleave="hideTip">
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
                                @mouseenter="showTip($event, item.label)" @mouseleave="hideTip" @click="navigate">
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

                <div v-if="!isSidebarOpen && !isAdminArea" class="side-divider"></div>

                <div v-if="!isAdminArea" :class="switcherClass">
                    <p v-if="isSidebarOpen"
                        class="mb-2 pl-1 text-xs font-extrabold uppercase tracking-widest text-sky-100/70">
                        Switch Prep Area
                    </p>
                    <div :class="isSidebarOpen ? 'space-y-2' : 'space-y-1.5'">
                        <router-link v-for="area in switchAreas" :key="area.route" :to="area.route" custom
                            v-slot="{ href, navigate, isActive, isExactActive }">
                            <a :href="href" :class="switchItemClass(isActive || isExactActive)"
                                @mouseenter="showTip($event, area.label)" @mouseleave="hideTip" @click="navigate">
                                <span class="relative shrink-0">
                                    <span :class="switchIconClass">
                                        <i :class="area.icon" class="text-white"></i>
                                    </span>
                                    <span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[rgb(11_40_69)]" :class="area.dotClass"></span>
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

                <div v-if="!isSidebarOpen && !isAdminArea" class="side-divider"></div>

                <div v-if="!isAdminArea" class="mt-5">
                    <p v-if="isSidebarOpen"
                        class="mb-2 pl-1 text-xs font-extrabold uppercase tracking-widest text-sky-200/70">
                        Utilities
                    </p>
                    <div class="space-y-1.5">
                        <router-link v-for="item in welcomeMenu" :key="item.route" :to="item.route" custom
                            v-slot="{ href, navigate, isActive, isExactActive }">
                            <a :href="href" :class="navItemClass(isActive || isExactActive, item)"
                                @mouseenter="showTip($event, item.label)" @mouseleave="hideTip" @click="navigate">
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
                <div v-if="!isAdminArea" class="mb-2">
                    <div v-if="isSidebarOpen"
                        class="rounded-2xl border border-cyan-300/20 bg-sky-950/60 p-3 shadow-lg shadow-sky-950/20">
                        <div class="flex items-start justify-between gap-3">
                            <div class="flex min-w-0 items-center gap-3">
                                <span :class="promoIconClass">
                                    <i class="pi pi-wallet text-bright-sun-500"></i>
                                </span>
                                <span class="min-w-0">
                                    <span
                                        class="block text-xs font-extrabold uppercase tracking-wide text-bright-sun-500">
                                        Subscription
                                    </span>
                                    <span class="block truncate text-sm font-bold text-white">
                                        {{ subscriptionSummary.title }}
                                    </span>
                                </span>
                            </div>
                            <!-- <span class="shrink-0 rounded-full px-2 py-0.5 text-[8px] font-light"
                                :class="subscriptionSummary.badgeClass">
                                {{ subscriptionSummary.statusLabel }}
                            </span> -->
                        </div>
                        <p class="mt-3 text-xs font-semibold text-cyan-50/90">
                            {{ subscriptionSummary.detail }}
                        </p>

                        <div class="mt-3 grid grid-cols-2 gap-2">
                            <router-link to="/account"
                                class="inline-flex items-center justify-center rounded-xl border border-cyan-200/20 px-2 py-2 text-xs font-bold text-white transition hover:bg-white/10">
                                Account
                            </router-link>
                            <router-link :to="subscriptionSummary.pricingRoute"
                                class="inline-flex items-center justify-center rounded-xl bg-[#FFD731] px-2 py-2 text-xs font-black text-sky-950 transition hover:bg-[#ffe16a]">
                                {{ subscriptionSummary.cta }}
                            </router-link>
                        </div>
                    </div>
                    <router-link v-else to="/account" :class="navItemClass(false, { icon: 'pi pi-wallet' })"
                        @mouseenter="showTip($event, `${subscriptionSummary.title}: ${subscriptionSummary.statusLabel}`)" @mouseleave="hideTip">
                        <span :class="sidebarIconClass(false, { featured: true })">
                            <i class="pi pi-wallet"></i>
                        </span>
                    </router-link>
                </div>
                <router-link v-if="isSidebarOpen && !isAdminArea" to="/referral"
                    class="flex items-center gap-3 rounded-2xl border border-amber-300/20 bg-gradient-to-br from-sky-900/90 to-sky-600/10 p-3 transition hover:-translate-y-px hover:border-amber-300/40 hover:from-amber-300/25 hover:to-sky-500/20">
                    <span :class="promoIconClass">
                        <i class="pi pi-bolt text-bright-sun-500 "></i>
                    </span>
                    <span class="min-w-0">
                        <span class="block text-xs font-extrabold uppercase tracking-wide text-bright-sun-500">
                            Get 15 days free
                        </span>
                        <span class="block truncate text-xs text-white/90 font-bold italic">
                            Refer a friend to earn
                        </span>
                    </span>
                </router-link>
                <div class="mt-2 space-y-1.5">
                    <router-link to="/settings" custom v-slot="{ href, navigate, isActive, isExactActive }">
                        <a :href="href" :class="navItemClass(isActive || isExactActive, { icon: 'pi pi-cog' })"
                            @mouseenter="showTip($event, 'Settings')" @mouseleave="hideTip" @click="navigate">
                            <span :class="sidebarIconClass(isActive || isExactActive)">
                                <i class="pi pi-cog"></i>
                            </span>
                            <span v-if="isSidebarOpen" class="truncate">Settings</span>
                        </a>
                    </router-link>

                    <button type="button" :class="logoutClass"
                        @mouseenter="showTip($event, 'Log out')" @mouseleave="hideTip" @click="logout()">
                        <span :class="sidebarIconClass(false, { danger: true })">
                            <i class="pi pi-power-off text-rose-400"></i>
                        </span>
                        <span v-if="isSidebarOpen" class="truncate">Log out</span>
                    </button>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <Transition name="ui-fade-slide">
                <div v-if="tip.visible" class="side-tooltip" :style="{ top: `${tip.y}px`, left: `${tip.x}px` }" role="tooltip">
                    {{ tip.label }}
                </div>
            </Transition>
        </Teleport>
    </nav>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { onClickOutside, useMediaQuery } from "@vueuse/core";
import { useAuthStore } from "../../stores/authStore";
import { useMainStore } from "../../stores";
import router from "../../router";

const authStore = useAuthStore();
const { user, logout } = authStore;
const mainStore = useMainStore();
const route = useRoute();
const sidebar_id = ref(null);

const productAreas = [
    {
        prefix: "/nursing",
        route: "/nursing",
        label: "Nursing School",
        short: "Nursing",
        icon: "pi pi-briefcase",
        dotClass: "bg-emerald-400",
    },
    {
        prefix: "/teas",
        route: "/teas",
        label: "TEAS Prep",
        short: "TEAS",
        icon: "pi pi-file-edit",
        dotClass: "bg-cyan-400",
    },
    {
        prefix: "/nclex",
        route: "/nclex",
        label: "NCLEX Prep",
        short: "NCLEX",
        icon: "pi pi-bolt",
        dotClass: "bg-indigo-400",
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

/* Collapsed-mode tooltip: rendered in <body> so the sidebar's overflow clipping can't hide it. */
const tip = ref({ visible: false, label: "", x: 0, y: 0 });

const showTip = (event, label) => {
    if (isSidebarOpen.value || mainStore.isMobile || !label) return;
    const rect = event.currentTarget?.getBoundingClientRect?.();
    if (!rect) return;
    tip.value = { visible: true, label, x: rect.right + 12, y: rect.top + rect.height / 2 };
};

const hideTip = () => {
    tip.value.visible = false;
};

watch(isSidebarOpen, hideTip);
watch(() => route.path, hideTip);

const subscriptionSummary = computed(() => {
    const area = currentProductArea.value;

    if (!area) {
        return {
            title: "All Plans",
            statusLabel: "Account",
            detail: "Review billing and subscription status in your account.",
            cta: "Plans",
            pricingRoute: "/subscription",
            badgeClass: "bg-sky-100 text-sky-800",
            pillClass: "bg-white/10 text-sky-100",
            dotClass: "bg-sky-400",
        };
    }

    const productCode = area.prefix.replace("/", "");
    const subscriptions = authStore.user?.subscriptions?.[productCode];
    const hasPlans = Array.isArray(subscriptions) && subscriptions.length > 0;
    const days = authStore.daysLeft(productCode);
    const isTrial = authStore.isTrial(productCode);
    const isActive = authStore.active(productCode);
    const wasTrial = authStore.wasTrial(productCode);

    if (isTrial && days > 0) {
        return {
            title: area.short,
            statusLabel: "Trial",
            detail: `${days} day${days === 1 ? "" : "s"} left in your trial.`,
            cta: "Upgrade",
            pricingRoute: authStore.pricingRoute(productCode),
            badgeClass: "bg-amber-100 text-amber-800",
            pillClass: "bg-amber-400/20 text-amber-200",
            dotClass: "bg-amber-400",
        };
    }

    if (isActive) {
        return {
            title: area.short,
            statusLabel: "Active",
            detail: `${days} day${days === 1 ? "" : "s"} left on your plan.`,
            cta: "Extend",
            pricingRoute: authStore.pricingRoute(productCode),
            badgeClass: "bg-emerald-100 text-emerald-800",
            pillClass: "bg-emerald-400/20 text-emerald-200",
            dotClass: "bg-emerald-400",
        };
    }

    if (hasPlans || wasTrial) {
        return {
            title: area.short,
            statusLabel: "Expired",
            detail: "Renew to keep full access to practice and analytics.",
            cta: "Renew",
            pricingRoute: authStore.pricingRoute(productCode),
            badgeClass: "bg-rose-100 text-rose-800",
            pillClass: "bg-rose-400/20 text-rose-200",
            dotClass: "bg-rose-400",
        };
    }

    return {
        title: area.short,
        statusLabel: "No Plan",
        detail: "Subscribe to unlock full product access.",
        cta: "Subscribe",
        pricingRoute: authStore.pricingRoute(productCode),
        badgeClass: "bg-slate-100 text-slate-700",
        pillClass: "bg-white/10 text-slate-200",
        dotClass: "bg-slate-400",
    };
});

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
    "side-focus mx-3 mt-3 flex items-center gap-3 rounded-2xl border border-sky-300/20 bg-white/5 text-white transition hover:-translate-y-px hover:border-sky-300/30 hover:bg-white/10",
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
    "side-item side-focus flex min-h-11 w-full items-center gap-3 rounded-2xl border border-transparent text-sm font-bold leading-tight text-slate-100/90 outline-none transition hover:-translate-y-px hover:bg-white/10 hover:text-white focus-visible:-translate-y-px focus-visible:bg-white/10 focus-visible:text-white",
    isSidebarOpen.value ? "justify-start px-3" : "justify-center px-2",
    active
        ? "side-item-active border-white/10 bg-white/10 text-white shadow-lg shadow-sky-950/20"
        : "",
    item.featured ? "text-amber-100" : "",
];

const sidebarIconClass = (active = false, item = {}) => [
    sidebarIconBaseClass,
    active ? "side-icon-active text-white" : "",
    item.danger ? "text-rose-200" : "",
    item.featured ? "border-amber-300/30 bg-amber-300/20 text-amber-100" : "",
];

const switchItemClass = (active = false) => [
    "side-item side-focus flex min-h-11 w-full items-center gap-3 rounded-2xl border border-transparent text-sm font-bold leading-tight text-slate-100/90 outline-none transition hover:-translate-y-px hover:bg-white/10 hover:text-white focus-visible:-translate-y-px focus-visible:bg-white/10 focus-visible:text-white",
    isSidebarOpen.value ? "justify-start px-2.5 py-2" : "justify-center px-2 py-2",
    active
        ? "side-item-active border-white/10 bg-white/10 text-white shadow-lg shadow-sky-950/20"
        : "",
];

const logoutClass = computed(() => [
    "side-item side-focus flex min-h-11 w-full items-center gap-3 rounded-2xl border border-transparent text-sm font-bold leading-tight text-slate-100/90 outline-none transition hover:-translate-y-px hover:bg-white/10 hover:text-white focus-visible:-translate-y-px focus-visible:bg-white/10 focus-visible:text-white",
    isSidebarOpen.value ? "justify-start px-3" : "justify-center px-2",
]);
</script>


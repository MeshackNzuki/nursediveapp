<script setup lang="ts">
import { RouterView, useRoute, useRouter } from "vue-router";
import { useMainStore } from "./stores";
import Toast from "primevue/toast";
import "../../node_modules/vue3-marquee-slider/dist/style.css";
import "vue3-toastify/dist/index.css";
import { useAuthStore } from "./stores/authStore";
import Sidebar from "./components/Sidebar/Sidebar.vue";
import TopBar from "./components/TopBar/TopBar.vue";
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import axios from "axios";
import "./AxiosConfig";
import { useThemeStore } from "./stores/Theme";
import { useDark } from "@vueuse/core";
import TawkService from "./services/livechat";

const route = useRoute();
const router = useRouter();
const authPages = ref(false);
const showLoader = ref(false);
const mainStore = useMainStore();
const themeStore = useThemeStore();
const confirm = useConfirm();
const testMode = ref(false);
const dark = useDark();




onMounted(async () => {
    TawkService.init();
    mainStore.initializeStoreServices();
    checkExcludedPages();
    manageChat();
    scheduleModalOpen();
});


const confirm1 = () => {
    return new Promise((resolve, reject) => {
        confirm.require({
            message: "Are you sure to delete this item?",
            header: "Confirm Delete?",
            icon: "pi pi-exclamation-triangle text-red-500",

            acceptLabel: "Delete",
            rejectLabel: "Cancel",
            acceptClass:
                "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full",
            rejectClass:
                "bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-full",
            accept: () => resolve(true),
            reject: () => reject(false),
        });
    });
};

const checkExcludedPages = () => {
    authPages.value = ["/login", "/register", "/reset-password"].includes(route.path);
    testMode.value = ["/teas/exam/", "/nursing/exam/", "/nclex/exam"].some((prefix) =>
        route.path.startsWith(prefix),
    );
};

const manageChat = () => {

    let attempts = 0;
    const maxAttempts = 30;

    const interval = setInterval(() => {

        const api = (window as any).Tawk_API;

        console.log('api', api)

        if (api && typeof api.hideWidget === "function") {

            if (testMode.value) {
                api.hideWidget();
            } else {
                api.showWidget();
            }

            clearInterval(interval);
        }

        attempts++;

        if (attempts >= maxAttempts) {
            clearInterval(interval);
        }
    }, 500);
};

watch(
    () => route.path,
    () => {
        checkExcludedPages();
        manageChat();
    },
);

axios.interceptors.request.use(
    async function async(config: any) {
        if (config.method === "delete") {
            const confirmed = await confirm1();
            if (!confirmed) {
                return Promise.reject({ canceled: true });
            }
        }
        const { user } = useAuthStore();
        const token = (user as any)?.token;

        if (config.showLoader !== false) {
            showLoader.value = true;
        }

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },

    function (error) {
        showLoader.value = false;
        return Promise.reject(error);
    },
);

declare module "axios" {
    export interface AxiosRequestConfig {
        showLoader?: boolean;
    }
}

axios.interceptors.response.use(
    function (response) {
        if (response.config?.showLoader !== false) {
            showLoader.value = false;
        }
        return response;
    },
    function (error) {
        if (error.response?.status === 401) {
            const { logout } = useAuthStore();
            logout(true);
        }
        if (error.config?.showLoader !== false) {
            showLoader.value = false;
        }
        return Promise.reject(error);
    },
);

const authStore = useAuthStore();
const { active, isTrial, wasTrial, daysLeft, pricingRoute } = authStore;

const showModal = ref(false);
const dialogRef = ref<HTMLDialogElement | null>(null);
const modalTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const suppressDismissPersist = ref(false);

const user = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.is_authenticated);
const userFirstName = computed(() => user.value?.name?.split(" ")?.[0] || "there");

const MODAL_DELAY_MS = 30000;
const MODAL_COOLDOWN_MS = 6 * 60 * 60 * 1000;

type ProductCode = "teas" | "nursing" | "nclex";

const resolveProductFromPath = (path: string): ProductCode | "" => {
    if (/^\/teas(\/|$)/.test(path)) return "teas";
    if (/^\/nursing(\/|$)/.test(path)) return "nursing";
    if (/^\/nclex(\/|$)/.test(path)) return "nclex";
    return "";
};

const currentProduct = computed<ProductCode | "">(() =>
    resolveProductFromPath(route.path),
);

const paywallBenefits = [
    "Unlimited exam attempts",
    "Detailed rationales and tutor mode",
    "Performance analytics and weak-area tracking",
    "Unlimited exam reviews",
];

const modalBlockedExactPaths = new Set([
    "/login",
    "/register",
    "/reset-password",
    "/email-verification",
    "/welcome",
    "/checkout",
    "/paypal-checkout",
    "/order-complete",
    "/subscription",
    "/account",
    "/settings",
    "/referral",
    "/notifications",
    "/unauthorized",
    "/404",
]);

const modalBlockedPrefixes = [
    "/admin",
    "/teas-pricing",
    "/nursing-pricing",
    "/nclex-pricing",
];

const isBlockedModalPath = (path: string) =>
    modalBlockedExactPaths.has(path) ||
    modalBlockedPrefixes.some((prefix) => path.startsWith(prefix));

const dismissStorageKey = computed(() =>
    currentProduct.value ? `paywall_modal_dismissed_${currentProduct.value}` : "",
);

const getDismissedAt = () => {
    if (typeof window === "undefined" || !dismissStorageKey.value) return 0;
    const raw = window.localStorage.getItem(dismissStorageKey.value);
    const parsed = raw ? Number(raw) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
};

const isDismissedRecently = computed(() => {
    const dismissedAt = getDismissedAt();
    if (!dismissedAt) return false;
    return Date.now() - dismissedAt < MODAL_COOLDOWN_MS;
});

const canShowPaywallModal = computed(() => {
    if (!isAuthenticated.value) return false;
    if (authPages.value || testMode.value) return false;
    if (isBlockedModalPath(route.path)) return false;
    if (!currentProduct.value) return false;
    if (active(currentProduct.value)) return false;
    if (isDismissedRecently.value) return false;
    return true;
});

const persistDismiss = () => {
    if (typeof window === "undefined" || !dismissStorageKey.value) return;
    window.localStorage.setItem(dismissStorageKey.value, String(Date.now()));
};

const closeModal = (options: { suppressCooldown?: boolean } = {}) => {
    suppressDismissPersist.value = !!options.suppressCooldown;
    if (dialogRef.value?.open) {
        dialogRef.value.close();
        return;
    }

    if (!suppressDismissPersist.value) {
        persistDismiss();
    }
    suppressDismissPersist.value = false;
    showModal.value = false;
};

const handleDialogClose = () => {
    if (!suppressDismissPersist.value) {
        persistDismiss();
    }
    suppressDismissPersist.value = false;
    showModal.value = false;
};

const clearModalTimer = () => {
    if (modalTimer.value) {
        clearTimeout(modalTimer.value);
        modalTimer.value = null;
    }
};

const openModal = async () => {
    if (!canShowPaywallModal.value) return false;
    showModal.value = true;
    await nextTick();
    if (dialogRef.value && !dialogRef.value.open) {
        dialogRef.value.showModal();
    }
};

const scheduleModalOpen = () => {
    clearModalTimer();
    if (!canShowPaywallModal.value) return;

    modalTimer.value = setTimeout(() => {
        openModal();
    }, MODAL_DELAY_MS);
};

const paywallPricingRoute = computed(() =>
    currentProduct.value ? pricingRoute(currentProduct.value) : "/subscription",
);

const isCurrentProductTrial = computed(() =>
    currentProduct.value ? isTrial(currentProduct.value) : false,
);

const isCurrentProductTrialOrWasTrial = computed(() =>
    currentProduct.value
        ? isTrial(currentProduct.value) || wasTrial(currentProduct.value)
        : false,
);

const subscriptionKindLabel = computed(() =>
    isCurrentProductTrial.value ? "trial" : "subscription",
);

const daysLeftSummary = computed(() => {
    if (!currentProduct.value) return "";
    return `${daysLeft(currentProduct.value)} days left in your ${currentProduct.value} ${subscriptionKindLabel.value}`;
});

const paywallCtaLabel = computed(() =>
    isCurrentProductTrialOrWasTrial.value
        ? "Upgrade to Premium"
        : "Renew your subscription",
);

const handleDismissClick = () => {
    closeModal();
};

const handleUpgradeClick = () => {
    closeModal();
    router.push(paywallPricingRoute.value);
};

watch(
    () => route.path,
    () => {
        closeModal({ suppressCooldown: true });
        scheduleModalOpen();
    },
);

watch(canShowPaywallModal, (allowed) => {
    if (!allowed) {
        closeModal({ suppressCooldown: true });
    }
    scheduleModalOpen();
});

onBeforeUnmount(() => {
    clearModalTimer();
});
</script>

<template>
    <div v-if="showLoader" id="loader" :class="[
        'fixed select-none inset-0 flex justify-center items-center z-999',
        mainStore.sidebarOpen ? 'ms-52' : 'ms-0',
    ]">
        <div class="loader"></div>
    </div>
    <div :class="[dark ? 'bg-sky-950' : 'bg-nursedive-primary']">
        <div :class="[
            `min-h-screen select-none relative antialiased overflow-hidden ${(themeStore as any).fonts[themeStore.currentFont].font}`,
            authPages || testMode
                ? ''
                : mainStore.isMobile
                    ? (mainStore.sidebarOpen ? 'ms-52' : 'ms-0')
                    : (mainStore.sidebarOpen ? 'ms-64' : 'ms-24'),
            testMode || authPages ? '' : 'p-2',
        ]">
            <Toast />
            <ConfirmDialog />
            <Sidebar v-if="!authPages && !testMode" />

            <dialog v-if="showModal" ref="dialogRef" class="modal modal-middle" @close="handleDialogClose"
                @cancel="handleDialogClose">
                <div
                    class="modal-box animation relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 dark:bg-slate-900/95 dark:border-slate-700 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.55)] dark:shadow-[0_24px_70px_-25px_rgba(2,6,23,0.9)] p-0">
                    <div class="absolute inset-0 pointer-events-none">
                        <div
                            class="absolute -top-16 -left-12 h-40 w-40 rounded-full bg-gradient-to-r from-amber-200/70 via-orange-200/70 to-yellow-200/70 blur-3xl dark:from-amber-500/20 dark:via-orange-500/20 dark:to-yellow-500/20">
                        </div>
                        <div
                            class="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-gradient-to-r from-cyan-200/60 via-sky-200/60 to-emerald-200/60 blur-3xl dark:from-cyan-500/15 dark:via-sky-500/15 dark:to-emerald-500/15">
                        </div>
                    </div>
                    <div
                        class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400">
                    </div>

                    <div class="relative z-10 p-6 md:p-7 text-center space-y-4">
                        <form method="dialog">
                            <button @click="handleDismissClick"
                                class="absolute right-3 top-3 h-8 w-8 rounded-full border border-slate-200/90 bg-white/90 dark:bg-slate-800 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                aria-label="Close paywall modal">
                                x
                            </button>
                        </form>

                        <p
                            class="inline-flex items-center rounded-full border border-amber-200/80 dark:border-amber-400/30 bg-amber-50/90 dark:bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                            Premium Access
                        </p>
                        <h3 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                            Avoid interruptions, {{ userFirstName }}
                        </h3>

                        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            You're on the right path. Students who practice consistently with
                            <span class="font-semibold">full-length exams, rationales, and analytics</span>
                            perform significantly better in licensing exams.
                        </p>
                        <p
                            class="text-sm leading-relaxed rounded-xl border border-rose-200/70 dark:border-rose-400/30 bg-rose-50/90 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 px-3 py-2">
                            To avoid interruptions and the risk of losing your performance tracking data, consider
                            upgrading to Premium.
                        </p>

                        <div
                            class="rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/70 p-4 text-left text-sm space-y-2">
                            <div v-for="benefit in paywallBenefits" :key="benefit" class="flex items-center gap-2">
                                <span
                                    class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">&#10003;</span>
                                <span class="text-slate-700 dark:text-slate-200">{{ benefit }}</span>
                            </div>
                        </div>
                        <form method="dialog">
                            <button @click="handleUpgradeClick"
                                class="w-full mt-2 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-400 hover:brightness-110 transition cursor-pointer shadow-[0_12px_25px_-10px_rgba(251,146,60,0.65)]">
                                {{ paywallCtaLabel }}
                            </button>
                        </form>

                        <div class="flex justify-center">
                            <div v-if="currentProduct"
                                class="inline-flex items-center rounded-full border border-slate-200/80 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300">
                                {{ daysLeftSummary }}
                            </div>
                        </div>

                        <form method="dialog">
                            <button @click="handleDismissClick"
                                class="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:underline cursor-pointer">
                                Continue with limited access
                            </button>
                        </form>
                    </div>
                </div>

                <form method="dialog" class="modal-backdrop">
                    <button aria-label="Close modal"></button>
                </form>
            </dialog>

            <TopBar v-if="!authPages && !testMode" />
            <router-view v-slot="{ Component }">
                <div :class="'min-h-screen w-full text-gray-700 overflow-hidden' +
                    (!authPages && !testMode ? ' mt-10' : '')
                    ">
                    <transition name="page">
                        <component :is="Component" />
                    </transition>
                </div>
            </router-view>
        </div>
    </div>
</template>

<style scoped>
.animation {
    animation: fadeSlideIn 2s ease-out forwards;
}

@keyframes fadeSlideIn {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from "vue-router";
import { useMainStore } from "./stores";
import Toast from "primevue/toast";
import "../../node_modules/vue3-marquee-slider/dist/style.css";
import "vue3-toastify/dist/index.css";
import { useAuthStore } from "./stores/authStore";
import Sidebar from "./components/Sidebar/Sidebar.vue";
import TopBar from "./components/TopBar/TopBar.vue";
import FocusSessionChip from "./components/FocusSessionChip.vue";
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
    trackCurrentProductActivity();
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
            // const { logout } = useAuthStore();
            // logout(true);  was openned due to partial auth nature on v2
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

const trackCurrentProductActivity = () => {
    if (currentProduct.value) {
        mainStore.setLastProductActivity(currentProduct.value);
    }
};

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
    const labels: Record<ProductCode, string> = { teas: "TEAS", nursing: "Nursing", nclex: "NCLEX" };
    const days = daysLeft(currentProduct.value);
    return `${days} ${days === 1 ? "day" : "days"} left in your ${labels[currentProduct.value]} ${subscriptionKindLabel.value}`;
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
        trackCurrentProductActivity();
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
    <div :class="[dark ? 'bg-sky-950' : 'bg-sky-800']" :style="themeStore.cssVars">
        <div :class="[
            `min-h-screen select-none relative antialiased overflow-hidden ${(themeStore as any).fonts[themeStore.currentFont].font}`,
            authPages || testMode
                ? ''
                : mainStore.isMobile
                    ? (mainStore.sidebarOpen ? 'ms-52' : 'ms-0')
                    : (mainStore.sidebarOpen ? 'ms-64' : 'ms-24'),
            testMode || authPages || mainStore.isMobile !== false ? '' : 'ps-5 ',
        ]">
            <Toast />
            <ConfirmDialog />
            <Sidebar v-if="!authPages && !testMode" />

            <dialog v-if="showModal" ref="dialogRef" class="modal modal-middle" @close="handleDialogClose"
                @cancel="handleDialogClose">
                <div class="modal-box relative max-w-2xl overflow-hidden rounded-[28px] bg-white p-0 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.55)] dark:bg-slate-900">
                    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                        <div class="ui-drift absolute -top-24 -right-16 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl"></div>
                        <div class="ui-drift-slow absolute -bottom-28 -left-16 h-64 w-64 rounded-full blur-3xl theme-glow opacity-70"></div>
                        <div class="absolute inset-0 opacity-[0.28] [background-image:radial-gradient(circle_at_1px_1px,var(--theme-border)_1px,transparent_0)] [background-size:22px_22px]"></div>
                    </div>

                    <form method="dialog" class="absolute right-3 top-3 z-10">
                        <button @click="handleDismissClick" class="dash-btn-ghost h-9 w-9 rounded-full p-0" aria-label="Close">
                            <i class="pi pi-times text-xs"></i>
                        </button>
                    </form>

                    <div class="relative p-6 md:p-8">
                        <span class="dash-chip border-amber-200 bg-amber-50 py-1 text-[11px] text-amber-700">
                            <i class="pi pi-sparkles text-[10px]"></i> You're on a roll, {{ userFirstName }}
                        </span>
                        <h3 class="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">
                            Keep every score, rationale and trend you've earned.
                        </h3>
                        <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                            Learners who practise with full-length exams, rationales and analytics perform noticeably better on exam day.
                            Premium keeps all of that in one place, with no interruptions to your streak.
                        </p>

                        <ul class="mt-5 grid gap-2 sm:grid-cols-2">
                            <li v-for="(benefit, index) in paywallBenefits" :key="benefit"
                                class="ui-rise flex items-start gap-2.5 rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-slate-700 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                                :style="{ animationDelay: `${120 + index * 60}ms` }">
                                <span class="dash-icon-tile theme-icon mt-0.5 h-6 w-6 shrink-0 text-[11px]"><i class="pi pi-check"></i></span>
                                <span class="leading-5">{{ benefit }}</span>
                            </li>
                        </ul>

                        <div v-if="currentProduct" class="dash-tile-soft mt-5 flex items-center gap-3">
                            <span class="dash-icon-tile theme-icon h-9 w-9 shrink-0"><i class="pi pi-clock"></i></span>
                            <div class="min-w-0">
                                <p class="text-sm font-extrabold text-slate-900 dark:text-white">{{ daysLeftSummary }}</p>
                                <p class="text-xs text-slate-600 dark:text-slate-300">Upgrade before it ends and nothing resets.</p>
                            </div>
                        </div>

                        <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                            <form method="dialog" class="flex-1">
                                <button @click="handleUpgradeClick" class="dash-btn theme-surface theme-shadow min-h-11 w-full text-sm">
                                    <i class="pi pi-unlock text-xs"></i> {{ paywallCtaLabel }}
                                </button>
                            </form>
                            <form method="dialog">
                                <button @click="handleDismissClick" class="dash-btn-ghost min-h-11 w-full px-5 text-sm sm:w-auto">
                                    Continue with limited access
                                </button>
                            </form>
                        </div>

                        <p class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-500">
                            <span class="inline-flex items-center gap-1"><i class="pi pi-shield text-[10px] text-emerald-500"></i> One payment, no auto-billing</span>
                            <span class="inline-flex items-center gap-1"><i class="pi pi-bolt text-[10px] text-amber-500"></i> Instant access</span>
                        </p>
                    </div>
                </div>

                <form method="dialog" class="modal-backdrop">
                    <button aria-label="Close modal"></button>
                </form>
            </dialog>

            <TopBar v-if="!authPages && !testMode" />
            <FocusSessionChip v-if="!authPages" />
            <router-view v-slot="{ Component }">
                <div :class="'min-h-screen w-full text-gray-800 overflow-scroll' +
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

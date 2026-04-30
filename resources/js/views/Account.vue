<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:min-h-[94vh] 2xl:max-h-[94vh] overflow-y-scroll p-4 sm:p-6 bg-white">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-24 -left-40 h-[620px] w-[620px] rounded-full bg-gradient-to-r from-sky-200 via-cyan-200 to-emerald-200 opacity-45 blur-[125px]">
            </div>
            <div
                class="absolute top-28 right-8 h-[420px] w-[420px] rounded-full bg-gradient-to-r from-emerald-200 via-teal-200 to-sky-200 opacity-35 blur-[110px]">
            </div>
        </div>

        <div class="max-w-6xl mx-auto space-y-6">
            <Navigation />

            <section class="text-center px-2">
                <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 custom-underline-teal tracking-tight">
                    Account Center
                </h1>
                <p class="mt-3 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
                    Manage your profile details and keep your account information up to date.
                </p>
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <article
                    class="lg:col-span-2 relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_14px_35px_-20px_rgba(15,23,42,0.45)]">
                    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                    <div class="flex flex-col items-center text-center">
                        <div
                            class="relative h-28 w-28 rounded-full overflow-hidden ring-4 ring-sky-200 border-2 border-white shadow-md">
                            <img :src="avatarPreview" class="h-full w-full object-cover" alt="User avatar" />
                            <label
                                class="absolute bottom-1 right-1 inline-flex items-center rounded-full bg-teal-500 px-2 py-1 text-[10px] font-bold text-white shadow hover:bg-sky-600 transition cursor-pointer">
                                <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
                                Edit
                            </label>
                        </div>

                        <h2 class="mt-4 text-xl font-extrabold text-slate-900">{{ formData.name || "Account User" }}
                        </h2>
                        <p class="mt-1 text-sm text-slate-500">{{ formData.email || "No email available" }}</p>

                        <div
                            class="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-left space-y-2">
                            <div class="flex items-center justify-between text-xs">
                                <span class="uppercase tracking-wide text-slate-500">Profile Photo</span>
                                <span class="font-semibold text-emerald-700">{{ fileUrl ? "New file selected" :
                                    "Current"
                                }}</span>
                            </div>
                            <p class="text-xs text-slate-600">Use a clear square image for the best result.</p>
                        </div>
                    </div>
                </article>

                <article
                    class="lg:col-span-3 relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 md:p-7 shadow-[0_14px_35px_-20px_rgba(15,23,42,0.45)]">
                    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 to-sky-500"></div>

                    <form @submit.prevent="saveSettings" class="space-y-6">
                        <div class="space-y-1">
                            <h3 class="text-lg md:text-xl font-extrabold text-slate-900">User Information</h3>
                            <p class="text-sm text-slate-600">Edit your name and keep your account details accurate.</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label class="block">
                                <span
                                    class="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">Name</span>
                                <input v-model="formData.name" type="text"
                                    class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    placeholder="Enter your name" />
                            </label>

                            <label class="block">
                                <span
                                    class="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">Email</span>
                                <input v-model="formData.email" type="email" disabled
                                    class="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                                    placeholder="" />
                            </label>
                        </div>

                        <div
                            class="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-600 flex flex-wrap items-center gap-2 justify-between">
                            <span>
                                Last saved:
                                <strong class="text-slate-700">{{ lastSavedAt || "Not saved yet" }}</strong>
                            </span>
                            <span
                                class="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-1 font-semibold">
                                Secure profile update
                            </span>
                        </div>

                        <p v-if="feedbackText" class="rounded-xl px-3 py-2 text-sm border" :class="feedbackType === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-rose-200 bg-rose-50 text-rose-700'">
                            {{ feedbackText }}
                        </p>

                        <div class="pt-1">
                            <CommonButton :buttonText="isSaving ? 'Saving...' : 'Save Settings'"
                                :classes="`w-full md:w-auto bg-emerald-600 text-white hover:bg-emerald-700 ${isSaving ? 'opacity-70 pointer-events-none' : ''}`"
                                :action="() => { }" />
                        </div>
                    </form>
                </article>
            </section>
            <section class="rounded-3xl border border-slate-200/80 bg-white/95 p-5 md:p-6">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 class="text-lg font-extrabold text-slate-900">Subscription Status</h2>
                        <p class="mt-1 text-sm text-slate-600">
                            Track each product plan, remaining days, and renew instantly when needed.
                        </p>
                    </div>
                    <CommonButton button-text="Manage All Subscriptions"
                        classes="bg-sky-600 text-white hover:bg-sky-700" :action="() => router.push('/subscription')" />
                </div>

                <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <article v-for="product in subscriptionCards" :key="product.code"
                        class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <p class="text-xs uppercase tracking-wide text-slate-500">{{ product.code.toUpperCase()
                                    }}</p>
                                <h3 class="text-base font-bold text-slate-900">{{ product.label }}</h3>
                            </div>
                            <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="product.badgeClass">
                                {{ product.statusLabel }}
                            </span>
                        </div>

                        <p class="mt-3 text-sm text-slate-700">{{ product.statusText }}</p>
                        <p class="mt-1 text-xs text-slate-500">{{ product.helperText }}</p>

                        <div class="mt-4 flex flex-wrap gap-2">
                            <CommonButton :buttonText="product.primaryCta"
                                classes="bg-emerald-600 text-white hover:bg-emerald-700"
                                :action="() => router.push(product.pricingPath)" />
                            <CommonButton button-text="Details"
                                classes="bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                                :action="() => router.push('/subscription')" />
                        </div>
                    </article>
                </div>
            </section>

        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import CommonButton from "../components/Buttons/CommonButton.vue";
import defaultAvatar from "@/assets/images/avatar.png";
import axios from "axios";
import Navigation from "../components/Navigation.vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user || {});

const fileUrl = ref(null);
const isSaving = ref(false);
const feedbackText = ref("");
const feedbackType = ref("success");
const lastSavedAt = ref("");

const formData = ref({
    name: user.value?.name || "",
    email: user.value?.email || "",
    avatar: null,
});

const avatarPreview = computed(() => {
    if (fileUrl.value) return fileUrl.value;
    if (user.value?.avatar) return "/storage/" + user.value.avatar;
    return defaultAvatar;
});

const products = [
    { code: "teas", label: "TEAS 7 Prep" },
    { code: "nursing", label: "Nursing Test Bank" },
    { code: "nclex", label: "NCLEX Prep" },
];

const subscriptionCards = computed(() => {
    return products.map((product) => {
        const code = product.code;
        const plans = Array.isArray(user.value?.subscriptions?.[code])
            ? user.value.subscriptions[code]
            : [];
        const hasPlans = plans.length > 0;
        const isTrial = authStore.isTrial(code);
        const isActive = authStore.isActive(code);
        const wasTrial = authStore.wasTrial(code);
        const days = authStore.daysLeft(code);

        let statusLabel = "No Plan";
        let statusText = "No active subscription found.";
        let helperText = "Subscribe to unlock full access.";
        let primaryCta = "Subscribe";
        let badgeClass = "bg-slate-200 text-slate-700";

        if (isTrial && days > 0) {
            statusLabel = "Trial";
            statusText = `Trial active with ${days} day${days === 1 ? "" : "s"} remaining.`;
            helperText = "Upgrade now to keep uninterrupted access.";
            primaryCta = "Upgrade";
            badgeClass = "bg-amber-100 text-amber-700";
        } else if (isActive) {
            statusLabel = "Active";
            statusText = `${days} day${days === 1 ? "" : "s"} remaining on your plan.`;
            helperText = "Renew early anytime to extend access.";
            primaryCta = "Extend Plan";
            badgeClass = "bg-emerald-100 text-emerald-700";
        } else if (hasPlans || wasTrial) {
            statusLabel = "Expired";
            statusText = "Your subscription has expired.";
            helperText = "Renew to continue exam practice and analytics.";
            primaryCta = "Renew";
            badgeClass = "bg-rose-100 text-rose-700";
        }

        return {
            ...product,
            statusLabel,
            statusText,
            helperText,
            primaryCta,
            badgeClass,
            pricingPath: authStore.pricingRoute(code),
        };
    });
});

const updatePreviewFromFile = (file) => {
    if (fileUrl.value) {
        URL.revokeObjectURL(fileUrl.value);
    }
    fileUrl.value = URL.createObjectURL(file);
};

const handleAvatarUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    formData.value.avatar = file;
    updatePreviewFromFile(file);
};

const getErrorMessage = (error) => {
    const validationErrors = error?.response?.data?.errors;
    if (validationErrors && typeof validationErrors === "object") {
        const firstKey = Object.keys(validationErrors)[0];
        if (firstKey && validationErrors[firstKey]?.[0]) {
            return validationErrors[firstKey][0];
        }
    }

    return "Profile update failed. Please try again.";
};

const saveSettings = async () => {
    if (isSaving.value) return;

    feedbackText.value = "";
    feedbackType.value = "success";
    isSaving.value = true;

    try {
        const data = new FormData();
        data.append("name", formData.value.name);
        data.append("email", formData.value.email);

        if (formData.value.avatar instanceof File) {
            data.append("avatar", formData.value.avatar);
        }

        const response = await axios.post("/account", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const updatedUser = response?.data?.data?.data || response?.data?.data || null;
        if (updatedUser && typeof updatedUser === "object") {
            authStore.updateUser({ ...(authStore.user || {}), ...updatedUser });
        }

        feedbackText.value = "Account updated successfully.";
        feedbackType.value = "success";
        lastSavedAt.value = new Date().toLocaleString();
        formData.value.avatar = null;
    } catch (error) {
        feedbackText.value = getErrorMessage(error);
        feedbackType.value = "error";
        console.error("Error updating profile:", error);
    } finally {
        isSaving.value = false;
    }
};

onBeforeUnmount(() => {
    if (fileUrl.value) {
        URL.revokeObjectURL(fileUrl.value);
    }
});
</script>

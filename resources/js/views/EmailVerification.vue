<template>
    <div
        class="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-amber-50/50 to-sky-100/70 text-slate-900">
        <div class="absolute inset-0 pointer-events-none">
            <div
                class="absolute -top-20 -left-24 h-[460px] w-[460px] rounded-full bg-gradient-to-r from-amber-200/60 to-orange-200/60 blur-[110px]">
            </div>
            <div
                class="absolute top-20 -right-14 h-[420px] w-[420px] rounded-full bg-gradient-to-r from-sky-200/70 to-cyan-200/60 blur-[100px]">
            </div>
        </div>

        <div class="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-8 md:px-8">
            <div class="grid w-full gap-5 lg:grid-cols-2">
                <section
                    class="hidden lg:flex flex-col justify-between rounded-3xl border border-white/70 bg-white/70 p-8 shadow-sm backdrop-blur-sm">
                    <div>
                        <Logo />
                        <p
                            class="mt-4 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                            Account Security
                        </p>
                        <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                            Confirm your email to finish setup
                        </h1>
                        <p class="mt-3 text-sm leading-relaxed text-slate-600">
                            Email verification protects your account and ensures you can receive support messages,
                            password resets, and important study updates.
                        </p>
                    </div>

                    <div class="space-y-3">
                        <div class="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-3">
                            <span
                                class="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">1</span>
                            <p class="text-sm text-slate-700">Open the verification email in your inbox.</p>
                        </div>
                        <div class="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-3">
                            <span
                                class="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">2</span>
                            <p class="text-sm text-slate-700">Click the link to verify instantly.</p>
                        </div>
                        <div class="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-3">
                            <span
                                class="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">3</span>
                            <p class="text-sm text-slate-700">Return here and continue to your dashboard.</p>
                        </div>
                    </div>
                </section>

                <section
                    class="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm md:p-7">
                    <button
                        class="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                        @click="goToHome">
                        <i class="pi pi-arrow-left text-xs"></i>
                        Back
                    </button>

                    <div class="mb-5 flex items-start justify-between gap-3">
                        <div>
                            <p class="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Verify Email</p>
                            <h2 class="text-2xl font-extrabold tracking-tight text-slate-900">Secure your account</h2>
                        </div>
                        <span
                            class="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                            :class="statusClasses">
                            {{ statusLabel }}
                        </span>
                    </div>

                    <p class="text-sm leading-relaxed text-slate-600">
                        We sent a verification link to the address below. Click the email link to confirm ownership.
                    </p>

                    <div class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p class="text-[11px] uppercase tracking-wide text-slate-500">Email Address</p>
                        <p class="mt-1 text-sm font-semibold text-slate-800 break-all">
                            {{ email || "No account email found. Please contact support." }}
                        </p>
                    </div>

                    <div v-if="infoMessage" class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                        <p class="text-sm text-emerald-700">{{ infoMessage }}</p>
                    </div>

                    <div v-if="errorMessage" class="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
                        <p class="text-sm text-rose-700">{{ errorMessage }}</p>
                    </div>

                    <div class="mt-5 space-y-2.5">
                        <CommonButton :buttonText="resendButtonText" :disabled="!canResend"
                            classes="w-full rounded-full bg-blue-950 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 shadow-none"
                            :action="sendVerificationLink" />

                        <CommonButton v-if="state === 'verified'" buttonText="Go to Dashboard" icon2="pi pi-arrow-right"
                            classes="w-full rounded-full bg-blue-950 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 shadow-none"
                            :action="goToHome" />
                    </div>

                    <p class="mt-4 text-xs text-slate-500">
                        Didn't get the email? Check spam/junk, then resend. Links may take a few moments to arrive.
                    </p>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import axios from "axios";
import CommonButton from "../components/Buttons/CommonButton.vue";
import Logo from "../components/Logo.vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref(authStore.user?.email || "");
const infoMessage = ref("");
const errorMessage = ref("");
const state = ref("idle");
const resendCooldown = ref(0);

let cooldownTimer = null;
let redirectTimer = null;

const canResend = computed(() => {
    const isBusy = state.value === "sending" || state.value === "verifying";
    return !isBusy && resendCooldown.value === 0 && !!email.value;
});

const resendButtonText = computed(() => {
    if (state.value === "sending") return "Sending verification link...";
    if (state.value === "verifying") return "Verifying your email...";
    if (resendCooldown.value > 0) return `Resend in ${resendCooldown.value}s`;
    return "Resend verification email";
});

const statusLabel = computed(() => {
    if (state.value === "verified") return "Verified";
    if (state.value === "verifying") return "Verifying";
    if (state.value === "error") return "Action needed";
    if (state.value === "sending") return "Sending";
    return "Pending";
});

const statusClasses = computed(() => {
    if (state.value === "verified") return "border-emerald-300 bg-emerald-100 text-emerald-700";
    if (state.value === "verifying") return "border-sky-300 bg-sky-100 text-sky-700";
    if (state.value === "error") return "border-rose-300 bg-rose-100 text-rose-700";
    if (state.value === "sending") return "border-amber-300 bg-amber-100 text-amber-700";
    return "border-amber-300 bg-amber-100 text-amber-700";
});

const clearTimers = () => {
    if (cooldownTimer) {
        clearInterval(cooldownTimer);
        cooldownTimer = null;
    }

    if (redirectTimer) {
        clearTimeout(redirectTimer);
        redirectTimer = null;
    }
};

const startCooldown = (seconds = 30) => {
    resendCooldown.value = seconds;
    if (cooldownTimer) {
        clearInterval(cooldownTimer);
    }

    cooldownTimer = setInterval(() => {
        if (resendCooldown.value <= 1) {
            resendCooldown.value = 0;
            clearInterval(cooldownTimer);
            cooldownTimer = null;
            return;
        }
        resendCooldown.value -= 1;
    }, 1000);
};

const goToHome = () => {
    router.push("/");
};

const sendVerificationLink = async () => {
    if (!email.value) {
        state.value = "error";
        errorMessage.value = "No email address found for this account.";
        infoMessage.value = "";
        return;
    }

    state.value = "sending";
    errorMessage.value = "";

    try {
        const response = await axios.post("/email/verify", { email: email.value });
        infoMessage.value =
            response?.data?.data?.message || "Verification link sent to your email.";
        state.value = "sent";
        startCooldown(30);
    } catch (error) {
        state.value = "error";
        infoMessage.value = "";
        errorMessage.value =
            error?.response?.data?.message || "Could not send verification email. Please try again.";
    }
};

const validateToken = async (verificationEmail, token) => {
    state.value = "verifying";
    errorMessage.value = "";
    infoMessage.value = "";

    try {
        const response = await axios.post("/verify-email/confirm", {
            email: verificationEmail,
            token,
        });

        const isSuccess =
            response?.data?.data?.message === "success" || response?.data?.message === "success";

        if (!isSuccess) {
            throw new Error("Email verification failed.");
        }

        const currentUser = authStore.user || {};
        authStore.updateUser({
            ...currentUser,
            email_verified: true,
            email_verified_at: currentUser.email_verified_at || new Date().toISOString(),
        });

        state.value = "verified";
        infoMessage.value = "Your email has been verified successfully. Redirecting...";
        redirectTimer = setTimeout(() => {
            router.push("/");
        }, 1400);
    } catch (error) {
        state.value = "error";
        errorMessage.value =
            error?.response?.data?.message ||
            "We could not verify that link. Request a new verification email and try again.";
    }
};

onMounted(() => {
    const currentUser = authStore.user;
    const queryEmail = String(route.query.verification_email || "");
    const queryToken = String(route.query.token || "");

    if (queryEmail) {
        email.value = queryEmail;
    }

    if (currentUser?.email_verified || currentUser?.email_verified_at) {
        state.value = "verified";
        infoMessage.value = "Your email is already verified.";
        return;
    }

    if (queryEmail && queryToken) {
        validateToken(queryEmail, queryToken);
    } else {
        sendVerificationLink();
    }
});

onBeforeUnmount(() => {
    clearTimers();
});
</script>

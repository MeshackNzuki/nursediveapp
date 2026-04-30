<template>
    <div
        class="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-rose-50/60 to-cyan-100/70 text-slate-900">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-24 -left-20 h-[420px] w-[420px] rounded-full bg-gradient-to-r from-rose-200/65 to-orange-200/60 blur-[105px]">
            </div>
            <div
                class="absolute top-24 right-0 h-[380px] w-[380px] rounded-full bg-gradient-to-r from-cyan-200/65 to-sky-200/55 blur-[100px]">
            </div>
        </div>

        <div class="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 md:px-8">
            <div class="grid w-full gap-5 lg:grid-cols-2">
                <section
                    class="hidden lg:flex flex-col justify-between rounded-3xl border border-white/70 bg-white/65 p-8 backdrop-blur-sm shadow-sm">
                    <div>
                        <Logo />
                        <p
                            class="mt-4 inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-700">
                            Password Recovery
                        </p>
                        <h2 class="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                            Regain secure access fast
                        </h2>
                        <p class="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                            Use your reset link to create a new password and continue your study journey without losing momentum.
                        </p>
                    </div>

                    <ul class="space-y-3 text-sm text-slate-700">
                        <li class="flex items-start gap-2">
                            <span
                                class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-xs font-bold">1</span>
                            Request or open your reset link.
                        </li>
                        <li class="flex items-start gap-2">
                            <span
                                class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-xs font-bold">2</span>
                            Verify the token automatically from the email URL.
                        </li>
                        <li class="flex items-start gap-2">
                            <span
                                class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-xs font-bold">3</span>
                            Set a new password and sign in.
                        </li>
                    </ul>
                </section>

                <section class="rounded-3xl border border-white/80 bg-white/90 p-6 backdrop-blur-sm shadow-sm md:p-8">
                    <button
                        class="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                        @click="router.push('/login')">
                        <i class="pi pi-arrow-left text-xs"></i>
                        Back to Login
                    </button>

                    <h1 class="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">Reset Password</h1>
                    <p class="mb-5 text-sm text-slate-600">Step {{ step }} of 3</p>

                    <div v-if="message" :class="messageClass" class="mb-4 rounded-xl border px-3 py-2 text-sm">
                        {{ message }}
                    </div>

                    <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p class="text-[11px] uppercase tracking-wide text-slate-500">Email Address</p>
                        <p class="mt-1 break-all text-sm font-semibold text-slate-800">
                            {{ email || "No email provided yet." }}
                        </p>
                    </div>

                    <div v-if="step === 1" class="mt-5">
                        <CommonButton buttonText="Send reset link" :disabled="isBusy || !email"
                            classes="w-full rounded-full bg-blue-950 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 shadow-none"
                            :action="InitiateResetLink" />
                    </div>

                    <div v-if="step === 2" class="mt-5 space-y-3">
                        <p class="text-sm text-slate-600">
                            Check your inbox and open the reset link. If it does not arrive, request another one.
                        </p>
                        <CommonButton :buttonText="isBusy ? 'Sending...' : 'Resend reset link'" :disabled="isBusy || !email"
                            classes="w-full rounded-full bg-blue-950 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 shadow-none"
                            :action="InitiateResetLink" />
                    </div>

                    <div v-if="step === 3" class="mt-5 space-y-4">
                        <div>
                            <label for="password" class="mb-2 block text-sm font-semibold text-slate-800">New Password</label>
                            <input v-model="password" type="password" id="password" required
                                class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-rose-500" />
                        </div>
                        <div>
                            <label for="password_confirmation" class="mb-2 block text-sm font-semibold text-slate-800">Confirm Password</label>
                            <input v-model="password_confirmation" type="password" id="password_confirmation" required
                                class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-rose-500" />
                        </div>
                        <CommonButton :buttonText="isBusy ? 'Resetting...' : 'Reset password'" :disabled="isBusy"
                            classes="w-full rounded-full bg-blue-950 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 shadow-none"
                            :action="changePassword" />
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import CommonButton from "../../components/Buttons/CommonButton.vue";
import Logo from "../../components/Logo.vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const { login } = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const Usertoken = ref("");
const Systemtoken = ref("");
const message = ref("");
const messageType = ref("info");
const step = ref(1);
const isBusy = ref(false);

const messageClass = computed(() => {
    if (messageType.value === "success") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (messageType.value === "error") return "border-rose-200 bg-rose-50 text-rose-700";
    return "border-sky-200 bg-sky-50 text-sky-700";
});

const setMessage = (text, type = "info") => {
    message.value = text;
    messageType.value = type;
};

const validatePasswords = () => {
    if (password.value.length < 4) {
        setMessage("Password must be at least 4 characters long.", "error");
        return false;
    }
    if (password.value !== password_confirmation.value) {
        setMessage("Passwords do not match.", "error");
        return false;
    }
    return true;
};

const InitiateResetLink = async () => {
    if (!email.value) {
        setMessage("Email not found.", "error");
        return;
    }

    isBusy.value = true;
    try {
        const response = await axios.post("/password/forgot", { email: email.value });
        if (response?.data?.data?.token) {
            Systemtoken.value = response.data.data.token;
        }
        setMessage(response?.data?.data?.message || "Reset link sent to your email.", "success");
        step.value = 2;
    } catch (error) {
        console.error(error);
        setMessage(error?.response?.data?.message || "Error sending reset link.", "error");
    } finally {
        isBusy.value = false;
    }
};

const validateToken = async (emailValue, token) => {
    if (!token) {
        setMessage("Missing verification token.", "error");
        return;
    }

    isBusy.value = true;
    try {
        const response = await axios.post("/password-reset/confirm", { email: emailValue, token });
        if (response?.data?.data?.message === "success") {
            Usertoken.value = token;
            setMessage("Token verified. Create a new password.", "success");
            step.value = 3;
            return;
        }
        setMessage(response?.data?.data?.message || "Invalid token. Please request a new reset email.", "error");
    } catch (err) {
        setMessage(err?.response?.data?.message || "Invalid token. Please check your email.", "error");
    } finally {
        isBusy.value = false;
    }
};

const changePassword = async () => {
    if (!validatePasswords()) return;

    isBusy.value = true;
    try {
        const res = await axios.post("/password-reset/confirm", {
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
            token: Usertoken.value,
        });

        setMessage("Password reset successful. Redirecting...", "success");
        setTimeout(() => {
            login(res.data.data);
            router.push("/");
        }, 1000);
    } catch (error) {
        console.error(error);
        setMessage(error?.response?.data?.message || "Error resetting password.", "error");
    } finally {
        isBusy.value = false;
    }
};

onMounted(() => {
    const queryEmail = String(route.query.email || "");
    const queryToken = String(route.query.token || "");
    const resetEmail = String(route.query.reset_email || "");

    if (queryToken && resetEmail) {
        email.value = resetEmail;
        Usertoken.value = queryToken;
        validateToken(resetEmail, queryToken);
        return;
    }

    if (queryEmail) {
        email.value = queryEmail;
        InitiateResetLink();
    }
});
</script>

<template>
    <AuthShell eyebrow="Password recovery" title="Regain secure access fast."
        subtitle="Use your reset link to create a new password and continue your study journey without losing momentum."
        heading="Reset password" :lead="stepLead" :steps="['Request', 'Check inbox', 'New password']" :current-step="step"
        :features="features" brand-chip-class="border-rose-300/30 bg-rose-400/15 text-rose-100">
        <template #heading-action>
            <button type="button" class="dash-btn-ghost px-3 py-1.5 text-xs" @click="router.push('/login')">
                <i class="pi pi-arrow-left text-[10px]"></i> Log in
            </button>
        </template>

        <Transition name="ui-fade-slide">
            <div v-if="message" class="auth-alert" :class="messageClass" role="status">
                <i :class="messageIcon" class="mt-0.5 text-xs"></i>
                <span>{{ message }}</span>
            </div>
        </Transition>

        <div>
            <label for="reset-email" class="auth-label">Email address</label>
            <div class="auth-field">
                <i class="pi pi-envelope auth-field-icon"></i>
                <input v-model="email" type="email" id="reset-email" class="auth-input pr-4" placeholder="name@example.com"
                    autocomplete="email" :readonly="step === 3" />
            </div>
        </div>

        <Transition name="slide-fade" mode="out-in">
            <div v-if="step === 1" key="s1" class="mt-5 space-y-4">
                <p class="text-sm leading-6 text-slate-600">We'll email you a secure link. It works once and expires quickly.</p>
                <button type="button" class="auth-btn theme-surface theme-shadow" :disabled="isBusy || !email" @click="InitiateResetLink">
                    <span v-if="isBusy"><i class="pi pi-spin pi-spinner"></i> Sending...</span>
                    <span v-else class="inline-flex items-center gap-2"><i class="pi pi-send text-xs"></i> Send reset link</span>
                </button>
            </div>

            <div v-else-if="step === 2" key="s2" class="mt-5 space-y-4">
                <div class="dash-tile-soft flex items-start gap-3">
                    <span class="dash-icon-tile theme-icon h-10 w-10 shrink-0"><i class="pi pi-inbox"></i></span>
                    <div>
                        <p class="text-sm font-extrabold text-slate-900">Check your inbox</p>
                        <p class="mt-1 text-xs leading-5 text-slate-600">
                            Open the link we sent to <strong class="text-slate-900">{{ email }}</strong>. Check the spam folder too.
                            If it does not arrive, request another one.
                        </p>
                    </div>
                </div>
                <button type="button" class="auth-btn dash-btn-ghost" :disabled="isBusy || !email" @click="InitiateResetLink">
                    <span v-if="isBusy"><i class="pi pi-spin pi-spinner"></i> Sending...</span>
                    <span v-else class="inline-flex items-center gap-2"><i class="pi pi-refresh text-xs"></i> Resend reset link</span>
                </button>
            </div>

            <form v-else key="s3" class="mt-5 space-y-4" @submit.prevent="changePassword">
                <div>
                    <label for="password" class="auth-label">New password</label>
                    <div class="auth-field">
                        <i class="pi pi-lock auth-field-icon"></i>
                        <input v-model="password" :type="type" id="password" class="auth-input" required autocomplete="new-password"
                            placeholder="At least 6 characters" autofocus />
                        <button type="button" class="auth-eye" @click="type = type === 'password' ? 'text' : 'password'"
                            :aria-label="type === 'password' ? 'Show password' : 'Hide password'">
                            <i :class="type === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash'" class="text-sm"></i>
                        </button>
                    </div>
                </div>
                <div>
                    <label for="password_confirmation" class="auth-label">Confirm password</label>
                    <div class="auth-field">
                        <i class="pi pi-check-circle auth-field-icon"></i>
                        <input v-model="password_confirmation" :type="type" id="password_confirmation" class="auth-input pr-4" required
                            autocomplete="new-password" placeholder="Repeat the password" />
                    </div>
                    <p v-if="password_confirmation && password !== password_confirmation" class="mt-1.5 text-[11px] font-bold text-rose-600">
                        Passwords do not match yet.
                    </p>
                </div>
                <button type="submit" class="auth-btn theme-surface theme-shadow" :disabled="isBusy">
                    <span v-if="isBusy"><i class="pi pi-spin pi-spinner"></i> Resetting...</span>
                    <span v-else class="inline-flex items-center gap-2"><i class="pi pi-key text-xs"></i> Reset password</span>
                </button>
            </form>
        </Transition>
    </AuthShell>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import AuthShell from "../../components/Auth/AuthShell.vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const { login } = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const type = ref("password");
const Usertoken = ref("");
const Systemtoken = ref("");
const message = ref("");
const messageType = ref("info");
const step = ref(1);
const isBusy = ref(false);

const features = [
    { icon: "pi pi-send", text: "Request or open your reset link." },
    { icon: "pi pi-shield", text: "The token is verified automatically from the email URL." },
    { icon: "pi pi-key", text: "Set a new password and you're signed straight in." },
];

const stepLead = computed(() => {
    if (step.value === 1) return "Enter the email on your account and we'll send a reset link.";
    if (step.value === 2) return "Your link is on its way.";
    return "Link verified. Choose a new password.";
});

const messageClass = computed(() => {
    if (messageType.value === "success") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (messageType.value === "error") return "border-rose-200 bg-rose-50 text-rose-700";
    return "border-sky-200 bg-sky-50 text-sky-700";
});

const messageIcon = computed(() => {
    if (messageType.value === "success") return "pi pi-check-circle";
    if (messageType.value === "error") return "pi pi-exclamation-circle";
    return "pi pi-info-circle";
});

const setMessage = (text, type = "info") => {
    message.value = text;
    messageType.value = type;
};

const validatePasswords = () => {
    if (password.value.length < 6) {
        setMessage("Password must be at least 6 characters long.", "error");
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
        const res = await axios.post("/password/reset", {
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
            token: Usertoken.value,
        });

        const userData = res?.data?.data;
        if (!userData?.token) {
            setMessage("Password reset succeeded, but no login token was returned.", "error");
            return;
        }

        setMessage("Password reset successful. Redirecting...", "success");
        setTimeout(() => {
            login(userData);
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

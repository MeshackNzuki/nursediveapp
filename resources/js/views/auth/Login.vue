<template>
    <AuthShell eyebrow="Welcome back" title="Pick up where you left off."
        subtitle="Log in to resume practice tests, track your progress, and keep your study streak alive."
        heading="Log in" :lead="step === 1 ? 'Start with the email on your account.' : `Signing in as ${email}`"
        :steps="['Email', 'Password']" :current-step="step" :features="features">
        <template #heading-action>
            <button v-if="step === 2" type="button" class="dash-btn-ghost px-3 py-1.5 text-xs" @click="step = 1">
                <i class="pi pi-arrow-left text-[10px]"></i> Change email
            </button>
        </template>

        <Transition name="ui-fade-slide">
            <div v-if="message" class="auth-alert border-rose-200 bg-rose-50 text-rose-700" role="alert">
                <i class="pi pi-exclamation-circle mt-0.5 text-xs"></i>
                <span>{{ message }}</span>
            </div>
        </Transition>

        <AuthAttemptCard mode="login" />

        <Transition name="slide-fade" mode="out-in">
            <form v-if="step === 1" key="step1" class="space-y-5" @submit.prevent="handleNextStep">
                <div>
                    <label for="email" class="auth-label">Email</label>
                    <div class="auth-field">
                        <i class="pi pi-envelope auth-field-icon"></i>
                        <input v-model="email" type="email" id="email" class="auth-input pr-4" placeholder="name@example.com"
                            autocomplete="email" required autofocus />
                    </div>
                </div>

                <button type="submit" class="auth-btn theme-surface theme-shadow" :disabled="isLoading || !email">
                    <span v-if="isLoading"><i class="pi pi-spin pi-spinner"></i> Checking...</span>
                    <span v-else class="inline-flex items-center gap-2">Continue <i class="pi pi-arrow-right text-xs"></i></span>
                </button>

                <p class="text-center text-sm text-slate-600">
                    No account yet?
                    <router-link :to="{ path: '/register', query: route.query }" class="auth-link">Create one free</router-link>
                </p>
            </form>

            <form v-else key="step2" class="space-y-5" @submit.prevent="handleLogin">
                <div>
                    <label for="password" class="auth-label">Password</label>
                    <div class="auth-field">
                        <i class="pi pi-lock auth-field-icon"></i>
                        <input v-model="password" :type="type" id="password" class="auth-input" placeholder="Your password"
                            autocomplete="current-password" required autofocus />
                        <button type="button" class="auth-eye" @click="togglePasswordVisibility"
                            :aria-label="type === 'password' ? 'Show password' : 'Hide password'">
                            <i :class="type === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash'" class="text-sm"></i>
                        </button>
                    </div>
                </div>

                <button type="submit" class="auth-btn theme-surface theme-shadow" :disabled="isLoading || !password">
                    <span v-if="isLoading"><i class="pi pi-spin pi-spinner"></i> Signing in...</span>
                    <span v-else class="inline-flex items-center gap-2"><i class="pi pi-sign-in text-xs"></i> Log in</span>
                </button>

                <p class="text-center text-sm text-slate-600">
                    Forgot your password?
                    <router-link :to="`/reset-password?email=${email}`" class="auth-link">Request a reset</router-link>
                </p>
            </form>
        </Transition>
    </AuthShell>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useAuthStore } from "../../stores/authStore";
import { useRouter, useRoute } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useMainStore } from "../../stores";
import AuthShell from "../../components/Auth/AuthShell.vue";
import AuthAttemptCard from "../../components/Auth/AuthAttemptCard.vue";
import { flushPendingAttempt } from "../../utils/pendingAttempt";

const { login } = useAuthStore();
const { closeSidebar } = useMainStore();

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();
const message = ref("");
const type = ref("password");
const step = ref(1);

const features = [
    { icon: "pi pi-history", text: "Start from where you left off" },
    { icon: "pi pi-lock", text: "Secure account access" },
    { icon: "pi pi-gauge", text: "Personalized prep dashboard" },
];

const confirm = useConfirm();
const handleNextStep = () => {
    if (!email.value) return;
    isLoading.value = true;
    axios.post("/check-email", {
        email: email.value,
    })
        .then((response) => {
            if (response.data.data.exists) {
                step.value = 2;
            } else {
                confirm.require({
                    message: 'Email does not exist! Register with email "' + email.value + '"?',
                    header: "Email Not Found!",
                    icon: "pi pi-exclamation-triangle text-rose-500",
                    acceptLabel: "Yes, Register",
                    rejectLabel: "No, Retry Email",
                    acceptClass:
                        "bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full",
                    rejectClass:
                        "bg-sky-400 hover:bg-sky-500 bg-sky-500 text-white font-bold py-2 px-4 rounded-full",
                    accept: () => {
                        router.push({
                            path: "/register",
                            query: {
                                ...route.query,
                                email: email.value,
                            },
                        });
                        step.value = 1;
                        email.value = "";
                    },
                    reject: () => {
                        // no-op
                    },
                });
                setTimeout(() => {
                    message.value = "";
                }, 6000);
            }
        })
        .catch((error) => {
            console.error("Error checking email:", error);
            message.value = "Something went wrong. Please try again!";
            setTimeout(() => {
                message.value = "";
            }, 6000);
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const handleLogin = async () => {
    isLoading.value = true;
    message.value = "";
    try {
        const { data } = await axios.post("/login", {
            email: email.value,
            password: password.value,
        });
        login(data.data);
        if (data.data.roles && data.data.token) {
            const redirectTo = route.query.redirect || "/";

            try {
                const savedAttempt = await flushPendingAttempt();
                router.push(savedAttempt?.redirectTo || redirectTo);
            } catch (err) {
                console.error("Could not save pending attempt:", err);
                router.push(redirectTo);
            }
        }
    } catch (error) {
        message.value = error.response?.data?.message || "Please try again!";
        setTimeout(() => {
            message.value = "";
        }, 6000);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    closeSidebar();
    if (useAuthStore().is_authenticated) {
        router.push("/");
    }
});

const togglePasswordVisibility = () => {
    type.value = type.value === "password" ? "text" : "password";
};
</script>

<template>
    <AuthShell eyebrow="Start free" title="Build an exam-ready routine."
        subtitle="Join Nursenex for realistic exam banks, focused remediation, and progress tracking across TEAS, nursing school, and NCLEX."
        heading="Create your account" lead="Set up your profile to start your prep journey." :features="features"
        brand-chip-class="border-emerald-300/30 bg-emerald-400/15 text-emerald-100">
        <AuthAttemptCard mode="register" />

        <Transition name="ui-fade-slide">
            <div v-if="message" class="auth-alert border-rose-200 bg-rose-50 text-rose-700" role="alert">
                <i class="pi pi-exclamation-circle mt-0.5 text-xs"></i>
                <span>{{ message }}</span>
            </div>
        </Transition>

        <form class="space-y-5" @submit.prevent="handleRegister">
            <div>
                <label for="name" class="auth-label">Full name</label>
                <div class="auth-field">
                    <i class="pi pi-user auth-field-icon"></i>
                    <input v-model="name" type="text" id="name" class="auth-input pr-4" placeholder="Your name" autocomplete="name" autofocus />
                </div>
            </div>

            <div>
                <label for="email" class="auth-label">Email address</label>
                <div class="auth-field">
                    <i class="pi pi-envelope auth-field-icon"></i>
                    <input v-model="email" type="email" id="email" class="auth-input pr-4" autocomplete="email"
                        :placeholder="`${route.query?.email == undefined ? '' : route.query?.email}` || 'you@example.com'" />
                </div>
            </div>

            <div>
                <label for="password" class="auth-label">Password</label>
                <div class="auth-field">
                    <i class="pi pi-lock auth-field-icon"></i>
                    <input v-model="password" :type="type" id="password" class="auth-input" placeholder="Choose a password"
                        autocomplete="new-password" />
                    <button type="button" class="auth-eye" @click="togglePasswordVisibility"
                        :aria-label="type === 'password' ? 'Show password' : 'Hide password'">
                        <i :class="type === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash'" class="text-sm"></i>
                    </button>
                </div>
            </div>

            <button type="submit" class="auth-btn theme-surface theme-shadow" :disabled="isLoading">
                <span v-if="isLoading"><i class="pi pi-spin pi-spinner"></i> Creating your account...</span>
                <span v-else class="inline-flex items-center gap-2"><i class="pi pi-user-plus text-xs"></i> Create account</span>
            </button>

            <p class="text-center text-sm text-slate-600">
                Already have an account?
                <router-link :to="{ path: '/login', query: route.query }" class="auth-link">Log in</router-link>
            </p>
        </form>
    </AuthShell>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { useMainStore } from "../../stores";
import AuthShell from "../../components/Auth/AuthShell.vue";
import AuthAttemptCard from "../../components/Auth/AuthAttemptCard.vue";
import { flushPendingAttempt } from "../../utils/pendingAttempt";

const { login, is_authenticated } = useAuthStore();
const { device_has_account_created, setDeviceHasAccountCreated } = useMainStore();

const route = useRoute();
const router = useRouter();

const name = ref("");
const email = ref((route.query?.email as string) || "");
const password = ref("");
const type = ref("password");
const message = ref();
const isLoading = ref(false);

const features = [
    { icon: "pi pi-verified", text: "Exam-style questions from real past exams. No AI-generated content." },
    { icon: "pi pi-bullseye", text: "Weak-area focus and adaptive practice" },
    { icon: "pi pi-chart-line", text: "Performance analytics across every product" },
];

function togglePasswordVisibility() {
    type.value = type.value === "password" ? "text" : "password";
}

const handleRegister = async () => {
    const registration_data = {
        name: name.value,
        email: email.value,
        password: password.value,
    };

    if (!name.value || !email.value || !password.value) {
        message.value = "All fields are required";
        setTimeout(() => {
            message.value = null;
        }, 3000);
        return;
    }

    isLoading.value = true;
    axios.post("/create-client-account", registration_data)
        .then(async (res) => {
            login(res.data.data);
            setDeviceHasAccountCreated();
            const redirectTo = route.query.redirect as string || '/welcome';

            try {
                const savedAttempt = await flushPendingAttempt();
                router.push(savedAttempt?.redirectTo || redirectTo);
            } catch (err) {
                console.error("Could not save pending attempt:", err);
                router.push(redirectTo);
            }
        })
        .catch((err) => {
            message.value = err.response?.data.message;
            setTimeout(() => {
                message.value = null;
            }, 3000);
        })
        .finally(() => {
            isLoading.value = false;
        });
};

onMounted(() => {
    if (is_authenticated) {
        router.push("/");
    }
    if (device_has_account_created) {
        alert("Please sign in to your existing account.");
        router.push({
            path: "/login",
            query: route.query,
        });
    }
});
</script>

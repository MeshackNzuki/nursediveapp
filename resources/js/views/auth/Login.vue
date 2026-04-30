<template>
    <div
        class="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-sky-50/80 to-cyan-100/70 text-slate-900">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-gradient-to-r from-cyan-200/70 to-teal-200/60 blur-[105px]">
            </div>
            <div
                class="absolute top-20 right-0 h-[380px] w-[380px] rounded-full bg-gradient-to-r from-sky-200/60 to-indigo-200/55 blur-[100px]">
            </div>
        </div>

        <div class="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 md:px-8">
            <div class="grid w-full gap-5 lg:grid-cols-2">
                <section
                    class="hidden lg:flex flex-col justify-between rounded-3xl border border-white/70 bg-white/65 p-8 backdrop-blur-sm">
                    <div>
                        <Logo />
                        <p
                            class="mt-4 inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-700">
                            Welcome Back
                        </p>
                        <h2 class="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                            Continue your exam prep momentum
                        </h2>
                        <p class="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                            Sign in to resume practice tests, track your progress, and keep your study streak alive.
                        </p>
                    </div>

                    <ul class="space-y-3 text-sm text-slate-700">
                        <li class="flex items-start gap-2">
                            <span
                                class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">1</span>
                            Start from where you left off
                        </li>
                        <li class="flex items-start gap-2">
                            <span
                                class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">2</span>
                            Secure account access
                        </li>
                        <li class="flex items-start gap-2">
                            <span
                                class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">3</span>
                            Personalized prep dashboard
                        </li>
                    </ul>
                </section>

                <section class="rounded-3xl border border-white/80 bg-white/90 p-6 backdrop-blur-sm md:p-8">
                    <div class="mb-6 flex items-center justify-between gap-3">
                        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">Sign in</h1>
                        <button @click="step === 1 ? step++ : step--"
                            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                            aria-label="Switch login step">
                            <i :class="step === 1 ? 'pi pi-arrow-right' : 'pi pi-arrow-left'"></i>
                        </button>
                    </div>

                    <div class="mb-6 lg:hidden">
                        <Logo />
                    </div>

                    <p class="mb-4 text-sm text-slate-600">
                        Step {{ step }} of 2. Use your email first, then confirm your password.
                    </p>

                    <span v-if="message" class="mb-4 block rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {{ message }}
                    </span>

                    <Transition name="slide-fade" mode="out-in">
                        <form v-if="step === 1" key="step1" class="space-y-5" @submit.prevent>
                            <div>
                                <label for="email" class="mb-2 block text-sm font-semibold text-slate-800">
                                    Email / Username
                                </label>
                                <input v-model="email" type="email" id="email"
                                    class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-cyan-500"
                                    placeholder="name@company.com" autocomplete="new-password" required />
                            </div>

                            <button @click="handleNextStep"
                                class="w-full cursor-pointer rounded-full bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700">
                                <span v-if="isLoading">Authorizing...</span>
                                <span v-else>Next <i class="pi pi-arrow-right ms-1"></i></span>
                            </button>

                            <p class="text-end text-sm text-slate-600">
                                No account yet?
                                <router-link to="/register" class="font-semibold text-sky-700 hover:underline">Create one</router-link>
                            </p>
                        </form>

                        <form v-else key="step2" class="space-y-5" @submit.prevent>
                            <div class="relative">
                                <label for="password" class="mb-2 block text-sm font-semibold text-slate-800">
                                    Password
                                </label>
                                <input v-model="password" :type="type" id="password" autocomplete="new-password"
                                    class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-cyan-500"
                                    placeholder="Your password" required />
                                <button type="button" @click="togglePasswordVisibility"
                                    class="absolute inset-y-0 right-0 mt-7 flex items-center pe-3 text-slate-500">
                                    <i :class="type === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                                </button>
                            </div>

                            <button @click="handleLogin"
                                class="w-full cursor-pointer rounded-full bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700">
                                <span v-if="isLoading">Authorizing...</span>
                                <span v-else>Login</span>
                            </button>

                            <router-link :to="`/reset-password?email=${email}`"
                                class="block text-end text-sm text-slate-600 hover:text-slate-800">
                                Forgot password?
                                <span class="font-semibold text-sky-700 hover:underline">Request reset</span>
                            </router-link>
                        </form>
                    </Transition>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useAuthStore } from "../../stores/authStore";
import { useRouter, useRoute } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useMainStore } from "../../stores";
import Logo from "../../components/Logo.vue";

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

const confirm = useConfirm();
const handleNextStep = () => {
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
                        router.push("/register?email=" + email.value);
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
            router.push(redirectTo);
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

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.35s ease;
}

.slide-fade-enter-from {
    transform: translateX(8%);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateX(-8%);
    opacity: 0;
}
</style>

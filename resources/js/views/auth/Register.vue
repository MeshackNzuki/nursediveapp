<template>
    <div
        class="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-teal-50/70 to-cyan-100/70 text-slate-900">
        <div class="absolute inset-0 pointer-events-none -z-10">
            <div
                class="absolute -top-24 -left-16 h-[430px] w-[430px] rounded-full bg-gradient-to-r from-emerald-200/70 to-teal-200/60 blur-[105px]">
            </div>
            <div
                class="absolute top-24 right-0 h-[390px] w-[390px] rounded-full bg-gradient-to-r from-sky-200/65 to-blue-200/55 blur-[100px]">
            </div>
        </div>

        <div class="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 md:px-8">
            <div class="grid w-full gap-5 lg:grid-cols-2">
                <section
                    class="hidden lg:flex flex-col justify-between rounded-3xl border border-white/70 bg-white/65 p-8 backdrop-blur-sm">
                    <div>
                        <Logo />
                        <p
                            class="mt-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                            New Account
                        </p>
                        <h2 class="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                            Build your best exam-ready routine
                        </h2>
                        <p class="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                            Join Nursedive to access realistic exam banks, focused remediation, and progress tracking.
                        </p>
                    </div>

                    <ul class="space-y-3 text-sm text-slate-700">
                        <li class="flex items-start gap-2">
                            <span
                                class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">1</span>
                            Exam-style questions and rationales
                        </li>
                        <li class="flex items-start gap-2">
                            <span
                                class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">2</span>
                            Weak-area focus and adaptive practice
                        </li>
                        <li class="flex items-start gap-2">
                            <span
                                class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">3</span>
                            Performance analytics across products
                        </li>
                    </ul>
                </section>

                <section class="rounded-3xl border border-white/80 bg-white/90 p-6 backdrop-blur-sm md:p-8">
                    <div class="mb-6 lg:hidden">
                        <Logo />
                    </div>

                    <h1 class="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">Create account</h1>
                    <p class="mb-5 text-sm text-slate-600">Set up your profile to start your prep journey.</p>

                    <span v-if="message" class="mb-4 block rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {{ message }}
                    </span>

                    <form class="space-y-5" @submit.prevent="handleRegister">
                        <div>
                            <label for="name" class="mb-2 block text-sm font-semibold text-slate-800">
                                Full Name
                            </label>
                            <input v-model="name" type="text" id="name"
                                class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500"
                                placeholder="Your name" />
                        </div>

                        <div>
                            <label for="email" class="mb-2 block text-sm font-semibold text-slate-800">
                                Email Address
                            </label>
                            <input v-model="email" type="email" id="email"
                                class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500"
                                :placeholder="`${route.query?.email == undefined ? '' : route.query?.email}` || 'you@example.com'" />
                        </div>

                        <div class="relative">
                            <label for="password" class="mb-2 block text-sm font-semibold text-slate-800">
                                Password
                            </label>
                            <input v-model="password" :type="type" id="password"
                                class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500"
                                placeholder="Your password" />
                            <button type="button" @click="togglePasswordVisibility"
                                class="absolute inset-y-0 right-0 mt-7 flex items-center pe-3 text-slate-500">
                                <i :class="type === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                            </button>
                        </div>

                        <button type="submit"
                            class="w-full cursor-pointer rounded-full bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700">
                            <span v-if="isLoading">Creating...</span>
                            <span v-else>Register</span>
                        </button>

                        <p class="text-end text-sm text-slate-600">
                            Already have an account?
                            <router-link to="/login" class="font-semibold text-sky-700 hover:underline">Sign in</router-link>
                        </p>
                    </form>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import Logo from "../../components/Logo.vue";
import { useMainStore } from "../../stores";

const { login, is_authenticated } = useAuthStore();
const { device_has_account_created, setDeviceHasAccountCreated } = useMainStore();

const route = useRoute();
const router = useRouter();

const name = ref("");
const email = ref(route.query?.email || "");
const password = ref("");
const type = ref("password");
const message = ref();
const isLoading = ref(false);

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
        .then((res) => {
            login(res.data.data);
            setDeviceHasAccountCreated();
            router.push("/welcome");
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
        router.push("/login");
    }
});
</script>

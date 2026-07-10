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
            <div
                class="flex flex-col items-center justify-center gap-3 mx-auto   bg-white py-6 px-10 lg:py-16 lg:px-16 rounded-3xl border border-white/70  backdrop-blur-sm">
                <div class="w-full text-start md:px-8">
                    <Logo />
                </div>
                <div class="grid w-full gap-5 lg:grid-cols-2">
                    <section
                        class="hidden lg:flex flex-col justify-between    border-r border-gray-200 p-8 backdrop-blur-sm">
                        <div>
                            <h2 class="text-2xl  font-bold text-slate-900  brush-underline-hover">
                                Build an exam-ready routine
                            </h2>
                            <p class="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                                Join Nursedive to access realistic exam banks, focused remediation, and progress
                                tracking.
                            </p>
                        </div>
                        <div>
                            <h5>Why Nursedive is the best choice for your prep journey</h5>
                            <div class="mt-3 space-y-2 text-sm text-slate-600">
                                <p>Our Exams are expertly crafted to reflect the actual test format and difficulty
                                    level.
                                    <strong>No AI-generated content.</strong>
                                </p>
                                <p><strong>Questions</strong> are from <strong>real past exams,</strong> ensuring
                                    you get
                                    authentic practice that builds
                                    confidence and readiness for test day.
                                </p>
                            </div>
                        </div>

                        <ul class="space-y-3 text-sm text-slate-700">
                            <li class="flex items-start gap-2">
                                <span
                                    class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs ">1</span>
                                Exam-style questions and rationales
                            </li>
                            <li class="flex items-start gap-2">
                                <span
                                    class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-xs ">2</span>
                                Weak-area focus and adaptive practice
                            </li>
                            <li class="flex items-start gap-2">
                                <span
                                    class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs ">3</span>
                                Performance analytics across products
                            </li>
                        </ul>
                    </section>

                    <section class="rounded-3xl border border-white/80 bg-white/90 p-1 backdrop-blur-sm md:p-8">


                        <h1 class="mb-2 text-2xl font-extrabold tracking-tight text-sky-600">Register</h1>

                        <p class="mb-5 text-sm text-slate-600">Set up your profile to start your prep journey.</p>

                        <span v-if="message"
                            class="mb-4 block rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
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
                                class="w-full cursor-pointer rounded-full bg-sky-500/95 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700">
                                <span v-if="isLoading">Creating...</span>
                                <span v-else>Register</span>
                            </button>

                            <p class="text-end text-sm text-slate-600">
                                Already have an account?
                                <router-link to="/login" class=" text-sky-500 hover:underline">Log In
                                </router-link>
                            </p>
                        </form>
                    </section>
                </div>
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

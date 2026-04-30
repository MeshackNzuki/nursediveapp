<template>
    <div
        class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-4 sm:p-6 bg-white">
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
                    Referral Program
                </h1>
                <p class="mt-3 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
                    Invite classmates and peers to join your prep platform. Share your unique link and track progress in one place.
                </p>
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <article
                    class="lg:col-span-3 relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 md:p-7 shadow-[0_14px_35px_-20px_rgba(15,23,42,0.45)]">
                    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 to-sky-500"></div>

                    <div class="space-y-5">
                        <div>
                            <h2 class="text-lg md:text-xl font-extrabold text-slate-900">Your Referral Link</h2>
                            <p class="text-sm text-slate-600 mt-1">Copy and send this link to people you want to invite.</p>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-3">
                            <input v-model="referralLink" readonly
                                class="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 focus:outline-none" />
                            <CommonButton buttonText="Copy Link"
                                classes="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3"
                                :action="copyLink" />
                        </div>

                        <p v-if="copied"
                            class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                            Link copied to clipboard.
                        </p>

                        <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:p-5">
                            <h3 class="text-sm font-bold uppercase tracking-wide text-slate-600 mb-3">Share On Social Media</h3>
                            <Socials />
                        </div>
                    </div>
                </article>

                <article
                    class="lg:col-span-2 relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_14px_35px_-20px_rgba(15,23,42,0.45)]">
                    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                    <h3 class="text-lg font-extrabold text-slate-900 mb-4">Referral Stats</h3>

                    <div class="space-y-3">
                        <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center">
                            <p class="text-2xl font-black text-emerald-600">{{ referredUsers.length }}</p>
                            <p class="text-xs uppercase tracking-wide text-slate-500 mt-1">Successful Referrals</p>
                        </div>
                        <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center">
                            <p class="text-2xl font-black text-sky-600">${{ totalRewards }}</p>
                            <p class="text-xs uppercase tracking-wide text-slate-500 mt-1">Total Rewards</p>
                        </div>
                    </div>
                </article>
            </section>

            <section
                class="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 md:p-7 shadow-[0_14px_35px_-20px_rgba(15,23,42,0.45)] pb-8">
                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                <h2 class="text-lg md:text-xl font-extrabold text-slate-900 mb-4">Referred Users</h2>

                <ul v-if="referredUsers.length > 0" class="space-y-3">
                    <li v-for="referredUser in referredUsers" :key="referredUser.email"
                        class="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                        <span class="font-semibold text-slate-800">{{ referredUser.name }}</span>
                        <span class="text-sm text-slate-500">{{ referredUser.email }}</span>
                    </li>
                </ul>
                <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-8 text-center">
                    <p class="text-slate-500 text-sm">No referrals yet. Share your link to get started.</p>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import CommonButton from '../components/Buttons/CommonButton.vue'
import Socials from '../components/Socials.vue'
import Navigation from '../components/Navigation.vue'

const authStore = useAuthStore()

const userNamePart = computed(() => {
    const email = authStore?.user?.email || ''
    if (!email.includes('@')) return 'user'
    return email.split('@')[0]
})

const referralLink = ref(`https://app.nursedive.com/register?ref=${Math.random().toString(36).substring(2, 15)}-${userNamePart.value}`)
const copied = ref(false)
const totalRewards = ref(0)

const referredUsers = ref<Array<{ name: string; email: string }>>([
])

function copyLink() {
    navigator.clipboard.writeText(referralLink.value).then(() => {
        copied.value = true
        setTimeout(() => (copied.value = false), 2000)
    }).catch((error) => {
        console.error('Failed to copy referral link:', error)
    })
}
</script>

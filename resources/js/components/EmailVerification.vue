<template>
  <div v-if="showVerificationPrompt"
    class="relative w-full max-w-[22rem] overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-3 py-2.5 shadow-sm">
    <div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500"></div>

    <div class="flex items-start gap-2.5 pl-2">
      <span
        class="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-600">
        <i class="pi pi-envelope text-sm"></i>
      </span>

      <div class="min-w-0 flex-1">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Action required</p>
        <p class="text-sm font-semibold leading-snug text-slate-800">Verify your email to secure your account.</p>
        <p v-if="user?.email" class="truncate text-xs text-slate-600">{{ user.email }}</p>
      </div>
    </div>

    <div class="mt-2 flex justify-end pl-12">
      <CommonButton buttonText="Verify now" icon2="pi pi-arrow-right"
        classes="bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 shadow-none"
        :action="goToVerification" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import CommonButton from './Buttons/CommonButton.vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user);

const showVerificationPrompt = computed(() => {
  const currentUser = user.value;
  if (!currentUser) return false;
  return !currentUser.email_verified && !currentUser.email_verified_at;
});

const goToVerification = () => {
  router.push('/email-verification');
};
</script>

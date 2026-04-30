<template>
  <div
    class="relative z-10 rounded-2xl min-h-[93.5vh] max-h-[93.5vh] 2xl:max-h-[94vh] 2xl:min-h-[94vh] overflow-y-scroll p-6 bg-white">
    <!-- Background Gradient -->
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div
        class="absolute -top-20 -left-40 h-[300px] w-[300px] lg:h-[600px] lg:w-[600px] bg-gradient-to-r from-purple-300 via-sky-300 to-teal-200 opacity-30 blur-[120px] rounded-full" />
      <div
        class="absolute top-32 right-10 h-[400px] w-[400px] bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-200 opacity-30 blur-[100px] rounded-full" />
    </div>

    <!-- Title -->
    <h1 class="p-3 text-lg lg:text-2xl font-bold text-gray-800 mb-6">
      {{ chapter_name }} Chapters
    </h1>

    <!-- DaisyUI Modal -->
    <dialog id="lockModal" class="modal" :open="showLock">
      <div class="modal-box text-center">
        <i class="pi pi-lock text-rose-500 text-3xl mb-3"></i>
        <h3 class="font-bold text-lg mb-2">Locked Content</h3>
        <p class="text-gray-600 mb-4">
          Please subscribe to access Study Lessons.
        </p>
        <div class="modal-action flex justify-center gap-2">
          <button class="btn btn-primary text-white" @click="goToNclexPricing">
            View NCLEX Plans
          </button>
          <form method="dialog">
            <button class="btn btn-error text-white" @click="showLock = false">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>

    <!-- Subchapters -->
    <div v-if="subChapters.length === 0" class="text-center text-gray-500 mt-20">
      No sub-chapters available for this chapter. (Content coming soon)
    </div>

    <div v-else class="space-y-3 flex flex-wrap w-full" :class="{ 'blur-xs': !active() }">
      <span v-for="sub in subChapters" :key="sub.id"
        class="flex justify-between w-full md:w-72 items-center border-b pb-2 cursor-pointer"
        @click="handleClick(sub.id)">
        <span class="text-gray-700">{{ sub.name }}</span>
        <CommonButton v-if="active()" :action="() => $router.push(`/nursing/sub-chapter/${sub.id}`)" button-text="Open"
          icon2="pi pi-arrow-right" />
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import CommonButton from "../../../components/Buttons/CommonButton.vue";
import { useAuthStore } from "../../../stores/authStore";

const route = useRoute();
const router = useRouter();
const chapter_id = ref(route.query.chapter_id); // make reactive
const { user, pricingRoute } = useAuthStore();

const chapter_name = ref("");
const subChapters = ref([] as any[]);
const showLock = ref(false);

const fetchSubChapters = async () => {
  if (!chapter_id.value) return;
  try {
    const response = await axios.get(`/nursing/chapters/${chapter_id.value}`);
    chapter_name.value = response.data.data.chapter_name;
    subChapters.value = response.data.data.topics;
  } catch (error) {
    console.error("Failed to fetch sub-chapters:", error);
  }
};

// Fetch when mounted
onMounted(fetchSubChapters);

// 🔑 Watch for chapter_id changes
watch(
  () => route.query.chapter_id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      chapter_id.value = newId;
      fetchSubChapters();
    }
  }
);

function active(): boolean {
  const subs = user.subscriptions;
  if (!subs || !subs["nursing"]) return false;
  return subs["nursing"].some(
    (p: any) =>
      p.name === "premium" ||
      p.name === "standard" ||
      p.name === "premium_plus"
  );
}

function handleClick(id: number) {
  if (!active()) {
    showLock.value = true; // Show DaisyUI modal
    return;
  }
  window.location.href = `/nursing/sub-chapter/${id}`;
}

function goToNclexPricing() {
  showLock.value = false;
  router.push(pricingRoute("nclex"));
}
</script>

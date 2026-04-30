<template>
  <div
    class="w-full h-[calc(100vh-45px)] max-h-[calc(100vh-45px)] flex flex-col overflow-hidden bg-blue-950 dark:bg-sky-950  p-2 ">
    <div ref="tabContainer" class=" flex space-x-2 pb-2 ps-3 pt-2 bg-blue-950 dark:bg-sky-950 sticky top-0 z-10">
      <!-- Sliding Bubble -->
      <div
        class="absolute h-12 mx-3.5 rounded-t-lg w-24 bg-gray-50 bubble-box -bottom-0.5 2xl:bottom-0 transition-all duration-300 z-0"
        :style="bubbleStyle" />
      <!-- Tab Buttons -->
      <button v-for="(tab, index) in tabs" :key="index" @click="changeTab(index)" ref="tabRefs"
        class="ps-7 py-2 rounded-t-lg font-semibold text-sm 2xl:text-base transition-all cursor-pointer duration-200 z-10  sticky top-10"
        :class="{
          'text-sky-800 font-bold': activeTab === index,
          'text-gray-50 hover:text-sky-400': activeTab !== index,
        }">
        {{ tab.split('_').filter(Boolean).join(' ') }}
      </button>
    </div>
    <!-- Scrollable Tab Content -->
    <div class="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg shadow">
      <slot :name="`tab-${tabs[activeTab]}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

const props = defineProps<{
  tabs: string[]
}>()

const activeTab = ref(0)
const tabContainer = ref<HTMLElement | null>(null)
const tabRefs = ref<HTMLElement[]>([])

const bubbleStyle = ref('left: 0px; width: 0px')

function changeTab(index: number) {
  activeTab.value = index
  nextTick(updateIndicator)
}

function updateIndicator() {
  const el = tabRefs.value[activeTab.value]
  if (el) {
    const paddingX = 2
    const left = el.offsetLeft - paddingX / 2
    const width = el.offsetWidth + paddingX
    bubbleStyle.value = `left: ${left}px; width: ${width}px`
  }
}

onMounted(() => {
  nextTick(() => {
    tabRefs.value = Array.from(
      tabContainer.value?.querySelectorAll('[ref="tabRefs"]') || []
    ) as HTMLElement[]
    changeTab(0)
  })
  updateIndicator()
})

watch(activeTab, () => {
  nextTick(updateIndicator)
})

</script>

<style scoped>
.bubble-box::before,

.bubble-box::after {
  content: "";
  position: absolute;
  bottom: 0px;
  /* changed from bottom to top since we're flipping vertically */
  width: 25px;
  height: 25px;
  background-color: inherit;

  /* Flipping the SVG vertically using scaleY(-1) */
  -webkit-mask-image: url("data:image/svg+xml,%3csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='M24 24C24 10 14 0 0 0H24V24Z'/%3e%3c/svg%3e");
  mask-image: url("data:image/svg+xml,%3csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='M24 24C24 10 14 0 0 0H24V24Z'/%3e%3c/svg%3e");
  mask-repeat: no-repeat;
  mask-size: cover;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
  -webkit-mask-position: center;
  transform: scaleY(-1);
  /* flip vertically */
}

.bubble-box::before {
  left: -24px;
  transform: scaleX(1) scaleY(-1);
  /* preserve horizontal orientation */
}

.bubble-box::after {
  right: -24px;
  transform: scaleX(-1) scaleY(-1);
  /* mirrored horizontally, and flipped vertically */
}

@media (max-width: 1280px) {
  .bubble-box::after {
    right: -21.5px;
    transform: scaleX(-1) scaleY(-1);
    /* mirrored horizontally, and flipped vertically */
  }

  .bubble-box::before {
    left: -21.5px;
    transform: scaleX(1) scaleY(-1);
    /* preserve horizontal orientation */
  }

}
</style>
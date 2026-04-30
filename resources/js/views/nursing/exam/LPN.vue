<template>
  <Tabs :tabs="['ATI_LPN', 'HESI_LPN', 'REGULAR_LPN']">
    <template #tab-ATI_LPN>
      <section
        class="relative overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-cyan-50 p-5 mb-5 shadow-[0_20px_55px_-34px_rgba(14,116,144,0.55)] dark:border-sky-800 dark:from-slate-900 dark:via-sky-900 dark:to-cyan-950">
        <div
          class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_18%,rgba(56,189,248,0.22),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.14),transparent_42%)] dark:bg-[radial-gradient(circle_at_15%_18%,rgba(34,211,238,0.20),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(52,211,153,0.14),transparent_42%)]">
        </div>
        <div class="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">ATI LPN Test Bank</h2>
            <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">Open an ATI LPN topic to load all linked exam sets.</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="rounded-2xl border border-sky-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:border-sky-700 dark:bg-slate-900/70 dark:text-sky-200">
                {{ filteredAti.length }} topics
              </span>
              <span class="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
                {{ totalExamCount(filteredAti) }} exams
              </span>
            </div>
          </div>

          <input v-model="atiSearch" type="search" placeholder="Search ATI LPN categories..."
            class="h-10 px-4 w-full sm:w-72 border border-cyan-300 rounded-full bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-slate-900/80 dark:border-cyan-700" />
        </div>
      </section>

      <div v-if="filteredAti.length === 0" class="text-center text-slate-400 dark:text-slate-500">No exams available.</div>

      <transition-group v-else name="fade" tag="div" class="grid grid-cols-1 sm:grid-cols-2 gap-4" appear>
        <article v-for="(sub, index) in filteredAti" :key="sub.slug"
          class="group relative overflow-hidden rounded-3xl border border-white/75 bg-white/90 p-5 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-32px_rgba(14,116,144,0.65)] dark:border-sky-800/70 dark:bg-slate-900/70 dark:hover:shadow-[0_26px_60px_-35px_rgba(6,182,212,0.75)]">
          <div :class="['absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100', accentGlowClass(index)]"></div>
          <div class="relative flex h-full flex-col">
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">{{ normalizeText(sub.name) }}</h3>
              <span
                class="inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-xs font-semibold text-white">
                {{ sub?.examsCount }}
              </span>
            </div>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Open this category to view all available ATI LPN exams.</p>

            <div class="mt-4">
              <CommonButton button-text="Open Exams" :action="() => goToExams(sub.slug)"
                classes="bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-0 rounded-lg" />
            </div>
          </div>
        </article>
      </transition-group>
    </template>

    <template #tab-HESI_LPN>
      <section
        class="relative overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-cyan-50 p-5 mb-5 shadow-[0_20px_55px_-34px_rgba(14,116,144,0.55)] dark:border-sky-800 dark:from-slate-900 dark:via-sky-900 dark:to-cyan-950">
        <div
          class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_18%,rgba(56,189,248,0.22),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.14),transparent_42%)] dark:bg-[radial-gradient(circle_at_15%_18%,rgba(34,211,238,0.20),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(52,211,153,0.14),transparent_42%)]">
        </div>
        <div class="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">HESI LPN Test Bank</h2>
            <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">Open a HESI LPN topic to load all linked exam sets.</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="rounded-2xl border border-sky-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:border-sky-700 dark:bg-slate-900/70 dark:text-sky-200">
                {{ filteredHesi.length }} topics
              </span>
              <span class="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
                {{ totalExamCount(filteredHesi) }} exams
              </span>
            </div>
          </div>

          <input v-model="hesiSearch" type="search" placeholder="Search HESI LPN categories..."
            class="h-10 px-4 w-full sm:w-72 border border-cyan-300 rounded-full bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-slate-900/80 dark:border-cyan-700" />
        </div>
      </section>

      <div v-if="filteredHesi.length === 0" class="text-center text-slate-400 dark:text-slate-500">No exams available.</div>

      <transition-group v-else name="fade" tag="div" class="grid grid-cols-1 sm:grid-cols-2 gap-4" appear>
        <article v-for="(sub, index) in filteredHesi" :key="sub.slug"
          class="group relative overflow-hidden rounded-3xl border border-white/75 bg-white/90 p-5 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-32px_rgba(14,116,144,0.65)] dark:border-sky-800/70 dark:bg-slate-900/70 dark:hover:shadow-[0_26px_60px_-35px_rgba(6,182,212,0.75)]">
          <div :class="['absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100', accentGlowClass(index)]"></div>
          <div class="relative flex h-full flex-col">
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">{{ normalizeText(sub.name) }}</h3>
              <span
                class="inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-xs font-semibold text-white">
                {{ sub?.examsCount }}
              </span>
            </div>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Open this category to view all available HESI LPN exams.</p>

            <div class="mt-4">
              <CommonButton button-text="Open Exams" :action="() => goToExams(sub.slug)"
                classes="bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-0 rounded-lg" />
            </div>
          </div>
        </article>
      </transition-group>
    </template>

    <template #tab-REGULAR_LPN>
      <section
        class="relative overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-cyan-50 p-5 mb-5 shadow-[0_20px_55px_-34px_rgba(14,116,144,0.55)] dark:border-sky-800 dark:from-slate-900 dark:via-sky-900 dark:to-cyan-950">
        <div
          class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_18%,rgba(56,189,248,0.22),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.14),transparent_42%)] dark:bg-[radial-gradient(circle_at_15%_18%,rgba(34,211,238,0.20),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(52,211,153,0.14),transparent_42%)]">
        </div>
        <div class="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Regular LPN Test Bank</h2>
            <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">Open a Regular LPN topic to load all linked exam sets.</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="rounded-2xl border border-sky-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:border-sky-700 dark:bg-slate-900/70 dark:text-sky-200">
                {{ filteredRegular.length }} topics
              </span>
              <span class="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200">
                {{ totalExamCount(filteredRegular) }} exams
              </span>
            </div>
          </div>

          <input v-model="regularSearch" type="search" placeholder="Search Regular LPN categories..."
            class="h-10 px-4 w-full sm:w-72 border border-cyan-300 rounded-full bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-slate-900/80 dark:border-cyan-700" />
        </div>
      </section>

      <div v-if="filteredRegular.length === 0" class="text-center text-slate-400 dark:text-slate-500">No exams available.</div>

      <transition-group v-else name="fade" tag="div" class="grid grid-cols-1 sm:grid-cols-2 gap-4" appear>
        <article v-for="(sub, index) in filteredRegular" :key="sub.slug"
          class="group relative overflow-hidden rounded-3xl border border-white/75 bg-white/90 p-5 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-32px_rgba(14,116,144,0.65)] dark:border-sky-800/70 dark:bg-slate-900/70 dark:hover:shadow-[0_26px_60px_-35px_rgba(6,182,212,0.75)]">
          <div :class="['absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100', accentGlowClass(index)]"></div>
          <div class="relative flex h-full flex-col">
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">{{ normalizeText(sub.name) }}</h3>
              <span
                class="inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-xs font-semibold text-white">
                {{ sub?.examsCount }}
              </span>
            </div>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Open this category to view all available Regular LPN exams.</p>

            <div class="mt-4">
              <CommonButton button-text="Open Exams" :action="() => goToExams(sub.slug)"
                classes="bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-0 rounded-lg" />
            </div>
          </div>
        </article>
      </transition-group>
    </template>
  </Tabs>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNursingExamStore } from '../../../stores/nursingExamStore'
import CommonButton from '../../../components/Buttons/CommonButton.vue'
import Tabs from '../../../components/Tabs.vue'
import { normalizeText } from '../../../utils/normalizeText'

const {
  ati_examsubjects_pn_exams_testbank,
  hesi_examsubjects_pn_exams_testbank,
  regular_examsubjects_pn_exams_testbank,
} = useNursingExamStore() as any

const router = useRouter()

const atiSearch = ref('')
const hesiSearch = ref('')
const regularSearch = ref('')

const filteredAti = computed(() =>
  ati_examsubjects_pn_exams_testbank?.filter((s: any) =>
    normalizeText(s.name).toLowerCase().includes(atiSearch.value.toLowerCase())
  ) ?? []
)

const filteredHesi = computed(() =>
  hesi_examsubjects_pn_exams_testbank?.filter((s: any) =>
    normalizeText(s.name).toLowerCase().includes(hesiSearch.value.toLowerCase())
  ) ?? []
)

const filteredRegular = computed(() =>
  regular_examsubjects_pn_exams_testbank?.filter((s: any) =>
    normalizeText(s.name).toLowerCase().includes(regularSearch.value.toLowerCase())
  ) ?? []
)

const accentGlowClass = (index: number) => {
  const glows = [
    'bg-gradient-to-br from-sky-200/40 via-transparent to-transparent dark:from-sky-500/20',
    'bg-gradient-to-br from-emerald-200/35 via-transparent to-transparent dark:from-emerald-500/20',
    'bg-gradient-to-br from-indigo-200/35 via-transparent to-transparent dark:from-indigo-500/20',
  ]

  return glows[index % glows.length]
}

const totalExamCount = (list: any[]) =>
  list.reduce((sum, item) => sum + Number(item?.examsCount ?? 0), 0)

const goToExams = (subject_id: string) => {
  router.push(`/nursing/test-bank-loader/${subject_id}`)
}
</script>

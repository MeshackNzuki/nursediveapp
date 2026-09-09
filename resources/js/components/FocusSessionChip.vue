<template>
    <Transition name="ui-fade-slide">
        <div v-if="isVisible && session" class="fixed bottom-24 right-4 z-[80] max-w-[calc(100vw-2rem)]" role="status"
            aria-live="polite">
            <div class="theme-surface theme-shadow ui-pop flex items-center gap-3 rounded-full py-2 pl-2 pr-3">
                <!-- Ring -->
                <div class="relative h-10 w-10 shrink-0">
                    <svg class="h-10 w-10 -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
                        <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-opacity="0.25"
                            stroke-width="4" />
                        <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="4"
                            stroke-linecap="round" :stroke-dasharray="circumference"
                            :stroke-dashoffset="circumference * (1 - progress / 100)"
                            class="transition-[stroke-dashoffset] duration-1000 linear" />
                    </svg>
                    <span class="absolute inset-0 flex items-center justify-center">
                        <i :class="isCompleted ? 'pi pi-check' : 'pi pi-stopwatch'" class="text-xs"></i>
                    </span>
                </div>

                <div class="min-w-0">
                    <p class="text-[10px] font-bold uppercase tracking-[0.14em] opacity-80">
                        {{ isCompleted ? "Session done" : "Focus session" }}
                    </p>
                    <p class="truncate text-sm font-extrabold leading-tight">
                        <span v-if="!isCompleted" class="tabular-nums">{{ remainingLabel }}</span>
                        <span v-else>Nice work.</span>
                        <span class="opacity-80"> · {{ session.label }}</span>
                    </p>
                </div>

                <div class="ml-1 flex shrink-0 items-center gap-1">
                    <RouterLink v-if="!isCompleted && !onSessionRoute" :to="session.route"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
                        title="Go to the session">
                        <i class="pi pi-arrow-up-right text-xs"></i>
                    </RouterLink>
                    <button type="button" @click="isCompleted ? dismiss() : end()"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
                        :title="isCompleted ? 'Dismiss' : 'End session'">
                        <i class="pi pi-times text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useFocusSession } from "../utils/focusSession";

const route = useRoute();
const { session, isVisible, isCompleted, remainingLabel, progress, end, dismiss } = useFocusSession();

const circumference = 2 * Math.PI * 16;
const onSessionRoute = computed(() => !!session.value && route.path === session.value.route);
</script>

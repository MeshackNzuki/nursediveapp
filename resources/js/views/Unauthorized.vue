<template>

    <section class="bg-white h-full dark:bg-950 min-h-screen">
        <div class="py-8 px-4 mx-auto max-w-(--breakpoint-xl) lg:py-16 lg:px-6">
            <div class="mx-auto max-w-(--breakpoint-sm) text-center">
                <h1
                    class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                    403
                </h1>
                <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                <h2>UNAUTHORIZED</h2>
                </p>
                <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                    Sorry, You are not allowed to view these pages..
                </p>
                <cbutton buttonText="Take Me Back" :action="router.back"></cbutton>

            </div>
        </div>
    </section>
</template>
<script setup>
import commonButton from '../components/Buttons/CommonButton.vue';
import { useRouter } from 'vue-router'

const cbutton = commonButton;

const router = useRouter()



</script>

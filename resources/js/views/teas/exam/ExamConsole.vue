<template>
    <div class="flex flex-col h-full">
        <TeasExamRenderer />
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TeasExamRenderer from '../../../components/TeasExamRenderer.vue'
</script>
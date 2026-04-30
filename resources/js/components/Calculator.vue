<template>
    <dialog id="calculator_id" class="modal">
        <div class="modal-box bg-transparent shadow-none">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-1 top-1">
                    <i class="pi pi-times text-white"></i>
                </button>
            </form>

            <div class="flex flex-col items-center font-mono ">
                <!-- Display -->
                <div class="p-4 space-y-2  shadow-md w-64 select-none bg-sky-950 rounded-2xl">
                    <input v-model="expression" type="text"
                        class="p-2 border bg-blue-100 text-blue-900 rounded w-full text-right" placeholder="0"
                        readonly />
                    <p class="text-lg font-bold text-center">{{ result }}</p>

                    <!-- Buttons -->
                    <div class="grid grid-cols-4 gap-2 mt-2 text-center">
                        <button class="btn" @click="append('7')">7</button>
                        <button class="btn" @click="append('8')">8</button>
                        <button class="btn" @click="append('9')">9</button>
                        <button class="btn btn-error" @click="backspace()">
                            <i class="pi pi-backspace text-white">Del</i>
                        </button>

                        <button class="btn" @click="append('4')">4</button>
                        <button class="btn" @click="append('5')">5</button>
                        <button class="btn" @click="append('6')">6</button>
                        <button class="btn" @click="append('*')">×</button>

                        <button class="btn" @click="append('1')">1</button>
                        <button class="btn" @click="append('2')">2</button>
                        <button class="btn" @click="append('3')">3</button>
                        <button class="btn" @click="append('-')">−</button>

                        <button class="btn" @click="append('0')">0</button>
                        <button class="btn" @click="append('.')">.</button>
                        <button class="btn" @click="append('/')">/</button>
                        <button class="btn" @click="append('+')">+</button>

                        <button class="btn col-span-2 btn-success" @click="calculate()">=</button>
                        <button class="btn col-span-2 btn-warning" @click="clear()">C</button>
                    </div>
                </div>
            </div>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const expression = ref('')
const error = ref(false)

const result = computed(() => {
    try {
        const safeExpr = expression.value.replace(/[^-()\d/*+.]/g, '')
        const res = eval(safeExpr)
        error.value = false
        return isNaN(res) ? '-' : res
    } catch (e) {
        error.value = true
        return '-'
    }
})

const append = (val: string) => {
    expression.value += val
}

const calculate = () => {
    if (!error.value) {
        expression.value = result.value.toString()
    }
}

const clear = () => {
    expression.value = ''
}

const backspace = () => {
    expression.value = expression.value.slice(0, -1)
}
</script>

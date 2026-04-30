<template>
    <Bar class="bg-white rounded-lg shadow-lg m-2 dark:bg-slate-300 text-white" :data="data" :options="options" />
</template>

<script lang="ts">
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export default {
    name: "App",
    components: {
        Bar,
    },
    data() {
        return {
            data: {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                datasets: [
                    {
                        label: "Students",
                        backgroundColor: "#0ea5e9",
                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
                    },
                ],
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        };
    },
};
</script>

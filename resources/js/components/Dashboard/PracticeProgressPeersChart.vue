<script setup lang="ts">
import { computed } from "vue";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    type ChartArea,
    type ChartData,
    type ChartOptions,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];

const createGradient = (
    ctx: CanvasRenderingContext2D,
    area: ChartArea,
    topColor: string,
) => {
    const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
    gradient.addColorStop(0, topColor);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    return gradient;
};

const chartData = computed(
    () =>
        ({
            labels,
            datasets: [
                {
                    label: "Top Peer Group",
                    data: [52, 58, 64, 71, 78, 84],
                    borderColor: "#0ea5e9",
                    pointBackgroundColor: "#0ea5e9",
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: true,
                    backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea?: ChartArea } }) => {
                        const { ctx, chartArea } = context.chart;
                        if (!chartArea) return "rgba(14,165,233,0.15)";
                        return createGradient(ctx, chartArea, "rgba(14,165,233,0.28)");
                    },
                },
                {
                    label: "Average Peer Group",
                    data: [45, 49, 55, 60, 66, 72],
                    borderColor: "#22c55e",
                    pointBackgroundColor: "#22c55e",
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: true,
                    backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea?: ChartArea } }) => {
                        const { ctx, chartArea } = context.chart;
                        if (!chartArea) return "rgba(34,197,94,0.12)";
                        return createGradient(ctx, chartArea, "rgba(34,197,94,0.22)");
                    },
                },
            ],
        }) satisfies ChartData<"line">,
);

const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: "top",
            labels: {
                usePointStyle: true,
                boxWidth: 8,
                color: "#334155",
            },
        },
        tooltip: {
            callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
            },
        },
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: "#475569" },
        },
        y: {
            min: 30,
            max: 100,
            ticks: {
                stepSize: 10,
                color: "#475569",
                callback: (value) => `${value}%`,
            },
            grid: { color: "#e2e8f0" },
        },
    },
};
</script>

<template>
    <div class="w-full rounded-2xl   bg-white/80 dark:bg-sky-900 g p-2">
        <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
                <h3 class="text-base md:text-lg font-semibold text-slate-900 dark:text-white">Practice Progress for
                    Peers</h3>
                <p class="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                    Weekly benchmark trends from active learners using Nursing practice sets.
                </p>
            </div>
            <span class="text-[11px] px-2 py-1 rounded-full bg-sky-100 text-sky-700 font-semibold">Benchmark View</span>
        </div>
        <div class=" bg-white p-2 border-b border-s border-r rounded-sm border-gray-300">
            <Line :data="chartData" :options="options" />
        </div>
    </div>
</template>

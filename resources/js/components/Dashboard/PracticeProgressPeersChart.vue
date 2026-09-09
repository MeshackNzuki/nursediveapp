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
import { useThemeStore } from "../../stores/Theme";

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

const props = withDefaults(
    defineProps<{
        productLabel?: string;
    }>(),
    {
        productLabel: "Nursing",
    },
);

const themeStore = useThemeStore();

const hexToRgba = (hex: string, alpha: number) => {
    const clean = hex.replace("#", "");
    const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
    const n = parseInt(full, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

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
                    borderColor: themeStore.tokens.accent2,
                    pointBackgroundColor: themeStore.tokens.accent2,
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: true,
                    backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea?: ChartArea } }) => {
                        const { ctx, chartArea } = context.chart;
                        if (!chartArea) return hexToRgba(themeStore.tokens.accent, 0.15);
                        return createGradient(ctx, chartArea, hexToRgba(themeStore.tokens.accent, 0.3));
                    },
                },
                {
                    label: "Average Peer Group",
                    data: [45, 49, 55, 60, 66, 72],
                    borderColor: "#94a3b8",
                    pointBackgroundColor: "#94a3b8",
                    borderDash: [5, 4],
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: true,
                    backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea?: ChartArea } }) => {
                        const { ctx, chartArea } = context.chart;
                        if (!chartArea) return "rgba(148,163,184,0.10)";
                        return createGradient(ctx, chartArea, "rgba(148,163,184,0.18)");
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
    <section class="dash-card flex h-full w-full flex-col">
        <div class="pointer-events-none absolute -top-16 -left-16 h-44 w-44 rounded-full blur-3xl theme-glow opacity-50"
            aria-hidden="true"></div>
        <div class="relative flex flex-wrap items-start justify-between gap-2">
            <div class="flex items-start gap-3">
                <span class="dash-icon-tile theme-icon h-10 w-10">
                    <i class="pi pi-chart-line"></i>
                </span>
                <div>
                    <h3 class="dash-title text-base md:text-lg">Practice Progress for Peers</h3>
                    <p class="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                        Weekly benchmark trends from active learners using {{ props.productLabel }} practice sets.
                    </p>
                </div>
            </div>
            <span class="analysis-pill theme-soft border text-[11px]">Benchmark View</span>
        </div>
        <div class="dash-card-white relative mt-4 h-72 min-h-72 p-3">
            <Line :key="themeStore.currentTheme" :data="chartData" :options="options" />
        </div>
    </section>
</template>

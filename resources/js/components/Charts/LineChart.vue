<template>
  <div class="bg-gradient-to-r from-rose-50/50 to-transparent via-gray-50 rounded-lg w-full h-72">
    <Line :data="chartData" :options="options" />
  </div>
</template>

<script lang="ts">
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
  ChartArea,
  ChartConfiguration,
  ChartOptions,
  ChartDataset,
  ChartTypeRegistry
} from 'chart.js';
import { Line } from 'vue-chartjs';
import { defineComponent } from 'vue';
import type { ChartData } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// reusable gradient generator
function createGradient(
  ctx: CanvasRenderingContext2D,
  area: ChartArea,
  topColor: string
) {
  const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  return gradient;
}

export default defineComponent({
  name: 'GradientAreaChart',
  components: { Line },
  data() {
    return {
      chartData: {
        labels: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
          {
            label: 'Performance Progress',
            data: [40, 50, 60, 55, 70, 80, 85, 88, 90, 92, 94, 97],
            fill: true,
            tension: 0.4,
            backgroundColor: (context: {
              chart: {
                ctx: CanvasRenderingContext2D;
                chartArea: ChartArea | undefined;
              };
            }) => {
              const { ctx, chartArea } = context.chart;
              if (!chartArea) return null;
              return createGradient(ctx, chartArea, 'rgba(56, 189, 248, 0.3)');
            },
            borderColor: '#38bdf8',
            pointRadius: 1,
            pointHoverRadius: 5,
            pointBackgroundColor: '#0ea5e9',
            pointBorderColor: '#0ea5e9'
          },
          {
            label: 'Target Score',
            data: [60, 60, 65, 65, 70, 75, 75, 80, 85, 90, 90, 95],
            fill: true,
            tension: 0.4,
            backgroundColor: (context: {
              chart: {
                ctx: CanvasRenderingContext2D;
                chartArea: ChartArea | undefined;
              };
            }) => {
              const { ctx, chartArea } = context.chart;
              if (!chartArea) return null;
              return createGradient(ctx, chartArea, 'rgba(34, 197, 94, 0.3)');
            },
            borderColor: '#22c55e',
            pointRadius: 1,
            pointHoverRadius: 2,
            pointBackgroundColor: '#22c55e',
            pointBorderColor: '#22c55e'
          }
        ]
      } satisfies Partial<ChartData<'line'>>,

      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#000'
            },
            grid: {
              display: false
            }
          },
          y: {
            ticks: {
              color: '#000'
            },
            grid: {
              color: '#e5e7eb'
            }
          }
        }
      } satisfies Partial<ChartOptions<'line'>>

    };
  }
});
</script>

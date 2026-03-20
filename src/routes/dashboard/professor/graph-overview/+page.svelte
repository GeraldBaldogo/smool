<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let data: {
		stats: Array<{ department: string; total: number }>;
		department: string;
	};

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	function generateChart() {
		if (chart) chart.destroy();

		const total = data.stats[0]?.total || 0;

		chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: [data.department],
				datasets: [
					{
						label: 'Total Reports',
						data: [total],
						backgroundColor: '#3b82f6'
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false }
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: { precision: 0 }
					}
				}
			}
		});
	}

	onMount(() => {
		generateChart();
	});
</script>

<div class="space-y-4">
	<div>
		<h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
			Department Reports
		</h2>
		<p class="text-sm text-slate-500">
			View the total submitted maintenance reports for this department
		</p>
	</div>

	<div class="w-full p-4 sm:p-6 bg-white dark:bg-slate-800 border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm">
		<div class="mb-6 border-b border-slate-400 dark:border-slate-700 pb-3">
			<h3 class="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white break-words">
				{data.department}
			</h3>
			<p class="text-sm text-slate-500">
				Total reports recorded under this department
			</p>
		</div>

		<div class="relative h-[280px] sm:h-[360px] lg:h-[500px]">
			<canvas bind:this={canvas}></canvas>
		</div>
	</div>
</div>
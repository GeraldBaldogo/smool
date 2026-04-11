<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import { goto } from '$app/navigation';
	import { FileText, Clock3, CircleX, CircleCheck, Wrench, ClipboardCheck, GraduationCap } from 'lucide-svelte';

	export let data: {
		user: {
			id: number;
			full_name: string;
			email: string;
			role: string;
		};
		reports: {
			id: string;
			report_code?: string | null;
			issue: string;
			status: string;
			category?: string;
			created_at: string;
			address: string;
			landmark: string;
			full_name: string;
			course?: string;
		}[];
        chartReports: {
            id: string;
            status: string;
            created_at: string;
            category?: string;
        }[];
		pendingReports: {
			id: string;
			report_code?: string | null;
			issue: string;
			status: string;
			category?: string;
			created_at: string;
			address: string;
			landmark: string;
			full_name: string;
			course?: string;
		}[];
		stats: {
			total_reports: number | string;
			pending: number | string;
			denied: number | string;
			approved: number | string;
			in_progress: number | string;
			completed: number | string;
			submitted_to_admin: number | string;
		};
	};

	$: stats = data.stats;
	$: reports = data.reports ?? [];
    $: chartReports = data.chartReports ?? [];
	$: pendingReports = data.pendingReports ?? [];

	let total = 0;
	let approved = 0;
	let pending = 0;
	let denied = 0;
	let inProgress = 0;
	let completed = 0;
	let professorReports = 0;

	$: {
		total = Number(stats?.total_reports ?? 0);
		pending = Number(stats?.pending ?? 0);
		denied = Number(stats?.denied ?? 0);
		approved = Number(stats?.approved ?? 0);
		inProgress = Number(stats?.in_progress ?? 0);
		completed = Number(stats?.completed ?? 0);
		professorReports = Number(stats?.submitted_to_admin ?? 0);
	}

	let monthlyChart: Chart;
	let categoryChart: Chart;

	let monthlyCanvas: HTMLCanvasElement;
	let categoryCanvas: HTMLCanvasElement;

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	function getStatusKey(status: string) {
		const s = status?.toLowerCase().trim();

		if (s === 'submitted to admin') return 'submitted-to-admin';
		if (s === 'pending') return 'pending';
		if (s === 'approved') return 'approved';
		if (s === 'in progress') return 'in-progress';
		if (s === 'completed') return 'completed';
		if (s === 'denied') return 'denied';

		return s;
	}

	function getStatusLabel(status: string) {
		const key = getStatusKey(status);

		if (key === 'submitted-to-admin') return 'Professor Report';
		if (key === 'pending') return 'Pending';
		if (key === 'approved') return 'Approved';
		if (key === 'in-progress') return 'In Progress';
		if (key === 'completed') return 'Completed';
		if (key === 'denied') return 'Denied';

		return status;
	}

	function buildCharts() {
		const totalCounts = Array(12).fill(0);

		for (const r of chartReports) {
			const month = new Date(r.created_at).getMonth();
			totalCounts[month]++;
		}

		if (monthlyChart) monthlyChart.destroy();

		monthlyChart = new Chart(monthlyCanvas, {
			type: 'line',
			data: {
				labels: months,
				datasets: [
					{
						label: 'Reports per Month',
						data: totalCounts,
						borderColor: '#30a46c',
						backgroundColor: '#8eceaa',
						tension: 0.3
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1,
							precision: 0
						}
					}
				}
			}
		});

		const categoryMap: Record<string, number> = {};

		for (const r of chartReports) {
			const cat = r.category || 'Uncategorized';

			if (!categoryMap[cat]) {
				categoryMap[cat] = 0;
			}

			categoryMap[cat]++;
		}

		if (categoryChart) categoryChart.destroy();

		const categoryLabels = Object.keys(categoryMap);
		const categoryValues = Object.values(categoryMap);

		const categoryColors = [
			'#30a46c', // green
			'#3b82f6', // blue
			'#f59e0b', // amber
			'#ef4444', // red
			'#8b5cf6', // violet
			'#06b6d4', // cyan
			'#ec4899', // pink
			'#84cc16', // lime
			'#f97316', // orange
			'#14b8a6' // teal
		];

		categoryChart = new Chart(categoryCanvas, {
			type: 'bar',
			data: {
				labels: categoryLabels,
				datasets: [
					{
						label: 'Reports per Category',
						data: categoryValues,
						backgroundColor: categoryLabels.map((_, index) => categoryColors[index % categoryColors.length]),
						borderColor: categoryLabels.map((_, index) => categoryColors[index % categoryColors.length]),
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1,
							precision: 0
						}
					}
				}
			}
		});
	}

	onMount(() => {
		buildCharts();
	});

	$: if (chartReports && monthlyCanvas && categoryCanvas) {
		buildCharts();
	}

	onDestroy(() => {
		if (monthlyChart) monthlyChart.destroy();
		if (categoryChart) categoryChart.destroy();
	});
</script>

<div class="space-y-8">
	<div>
		<h2 class="text-3xl sm:text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h2>
		<p class="text-slate-500 text-sm">System-wide maintenance overview</p>
	</div>

	<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-7 gap-6">
		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm text-slate-500">Total Reports</p>
					<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{total}</p>
				</div>
				<div class="p-3 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300">
					<FileText class="w-6 h-6" />
				</div>
			</div>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm text-slate-500">Pending</p>
					<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{pending}</p>
				</div>
				<div class="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-300">
					<Clock3 class="w-6 h-6" />
				</div>
			</div>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm text-slate-500">Denied</p>
					<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{denied}</p>
				</div>
				<div class="p-3 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300">
					<CircleX class="w-6 h-6" />
				</div>
			</div>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm text-slate-500">Approved</p>
					<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{approved}</p>
				</div>
				<div class="p-3 rounded-xl bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300">
					<CircleCheck class="w-6 h-6" />
				</div>
			</div>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm text-slate-500">In Progress</p>
					<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{inProgress}</p>
				</div>
				<div class="p-3 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300">
					<Wrench class="w-6 h-6" />
				</div>
			</div>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm text-slate-500">Completed</p>
					<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{completed}</p>
				</div>
				<div class="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300">
					<ClipboardCheck class="w-6 h-6" />
				</div>
			</div>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm text-slate-500">Professor Reports</p>
					<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{professorReports}</p>
				</div>
				<div class="p-3 rounded-xl bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300">
					<GraduationCap class="w-6 h-6" />
				</div>
			</div>
		</div>
	</section>

	<section class="grid md:grid-cols-2 gap-6">
		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="mb-4 border-b border-slate-400 dark:border-slate-700 pb-2">
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white">Monthly Reports</h3>
				<p class="text-sm text-slate-500">Reports submitted per month</p>
			</div>

			<div class="h-72">
				<canvas bind:this={monthlyCanvas}></canvas>
			</div>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="mb-4 border-b border-slate-400 dark:border-slate-700 pb-2">
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white">Category Distribution</h3>
				<p class="text-sm text-slate-500">Reports grouped by category</p>
			</div>

			<div class="h-72">
				<canvas bind:this={categoryCanvas}></canvas>
			</div>
		</div>
	</section>

	<section class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
		<div class="mb-6 border-b border-slate-400 dark:border-slate-700 pb-3">
			<h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
				Admin Maintenance Reports
			</h2>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Direct professor submissions and processed maintenance reports
			</p>
		</div>

		{#if reports.length === 0}
			<div class="text-center py-10 text-slate-400">No reports submitted yet</div>
		{:else}
			<div class="space-y-4">
				{#each reports as r}
					<button
						type="button"
						on:click={() => goto(`/dashboard/admin/reports/${r.id}`)}
						class="w-full text-left bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 p-4 sm:p-5 rounded-2xl shadow text-gray-700 dark:text-gray-200 transition hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
					>
						<div class="flex flex-col gap-4">
							<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
								<div class="min-w-0">
									<p class="font-medium break-words">{r.issue}</p>
									<p class="text-xs text-slate-500 mt-1">
										Report ID: {r.report_code ?? r.id}
									</p>
									<p class="text-xs text-slate-500 mt-1">
										{new Date(r.created_at).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric'
										})}
									</p>
								</div>

								<span
									class="flex items-center gap-1 self-start sm:self-auto px-3 py-1 text-sm font-bold rounded-lg border border-slate-400
									{getStatusKey(r.status) === 'pending'
										? 'bg-yellow-100 text-yellow-700'
										: getStatusKey(r.status) === 'submitted-to-admin'
										? 'bg-violet-100 text-violet-700'
										: getStatusKey(r.status) === 'approved'
										? 'bg-green-100 text-green-700'
										: getStatusKey(r.status) === 'denied'
										? 'bg-red-100 text-red-700'
										: getStatusKey(r.status) === 'completed'
										? 'bg-blue-100 text-blue-700'
										: getStatusKey(r.status) === 'in-progress'
										? 'bg-orange-100 text-orange-700'
										: 'bg-gray-100 text-gray-700'}"
								>
									{#if getStatusKey(r.status) === 'pending'}
										<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									{:else if getStatusKey(r.status) === 'submitted-to-admin'}
										<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M14 5l7 7m0 0l-7 7m7-7H3"
											/>
										</svg>
									{:else if getStatusKey(r.status) === 'approved'}
										<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									{:else if getStatusKey(r.status) === 'denied'}
										<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									{:else if getStatusKey(r.status) === 'completed'}
										<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12l2 2l4-4M12 22a10 10 0 100-20 10 10 0 000 20z"
											/>
										</svg>
									{:else if getStatusKey(r.status) === 'in-progress'}
										<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 6v6l4 2"
											/>
											<circle cx="12" cy="12" r="9" stroke-width="2" />
										</svg>
									{/if}
									<span>{getStatusLabel(r.status)}</span>
								</span>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
								<div>
									<p class="text-xs text-slate-500">Submitted By</p>
									<p class="font-medium text-gray-700 dark:text-gray-200">{r.full_name}</p>
								</div>

								<div>
									<p class="text-xs text-slate-500">Department</p>
									<p class="font-medium text-gray-700 dark:text-gray-200">{r.course ?? 'N/A'}</p>
								</div>

								<div>
									<p class="text-xs text-slate-500">Category</p>
									<p class="font-medium text-gray-700 dark:text-gray-200">
										{r.category ?? 'Uncategorized'}
									</p>
								</div>

								<div>
									<p class="text-xs text-slate-500">Landmark</p>
									<p class="font-medium text-gray-700 dark:text-gray-200">{r.landmark || 'N/A'}</p>
								</div>

								<div class="sm:col-span-2 lg:col-span-4">
									<p class="text-xs text-slate-500">Location</p>
									<p class="font-medium text-gray-700 dark:text-gray-200 break-words">{r.address}</p>
								</div>
							</div>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</section>
</div>
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Chart from 'chart.js/auto';

	type Report = {
		id: number;
		issue_description: string;
		status: string;
		created_at: string;
		category: string | null;
	};

	export let data: {
		user: {
			id: number;
			full_name: string;
			email: string;
			role: string;
			department_id?: number;
		};
		reports: Report[];
		stats: {
			total: number;
			pending: number;
			approved: number;
			denied: number;
			completed: number;
		};
	};

	const { user } = data;

	let reports = writable<Report[]>(data.reports);

	function calculateStats(reportList: Report[]) {
		return {
			total: reportList.length,
			pending: reportList.filter((r) => r.status?.toLowerCase().trim() === 'pending').length,
			approved: reportList.filter((r) => r.status?.toLowerCase().trim() === 'approved').length,
			denied: reportList.filter((r) => r.status?.toLowerCase().trim() === 'denied').length,
			completed: reportList.filter((r) => r.status?.toLowerCase().trim() === 'completed').length
		};
	}

	function calculateCategoryStats(reportList: Report[]) {
		const categoryMap: Record<string, number> = {};

		reportList.forEach((r) => {
			const cat = r.category || 'Uncategorized';

			if (!categoryMap[cat]) {
				categoryMap[cat] = 0;
			}

			categoryMap[cat]++;
		});

		return categoryMap;
	}

	let categoryChart: Chart;
	let stats = writable(calculateStats(data.reports));
	let chart: Chart;
	let theme: 'light' | 'dark' = 'light';

	onMount(() => {
		const unsubscribeReports = reports.subscribe(($reports) => {
			const categoryData = calculateCategoryStats($reports);

			if (categoryChart) categoryChart.destroy();

			const categoryCtx = document.getElementById('categoryChart') as HTMLCanvasElement;

			categoryChart = new Chart(categoryCtx, {
				type: 'bar',
				data: {
					labels: Object.keys(categoryData),
					datasets: [
						{
							label: 'Reports per Category',
							data: Object.values(categoryData),
							backgroundColor: '#6366f1'
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false
				}
			});
		});

		const ctx = document.getElementById('studentChart') as HTMLCanvasElement;

		const unsubscribe = stats.subscribe(($stats) => {
			if (chart) chart.destroy();

			chart = new Chart(ctx, {
				type: 'doughnut',
				data: {
					labels: ['Pending', 'Approved', 'Denied', 'Completed'],
					datasets: [
						{
							data: [$stats.pending, $stats.approved, $stats.denied, $stats.completed]
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false
				}
			});
		});

		const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
		if (saved) theme = saved;
		applyTheme();

		const evtSource = new EventSource('/dashboard/stream');

		evtSource.onmessage = (event) => {
			const updatedReport = JSON.parse(event.data);

			reports.update((rs) => {
				const updated = rs.map((r) =>
					r.id === updatedReport.id ? { ...r, status: updatedReport.status } : r
				);

				stats.set(calculateStats(updated));
				return updated;
			});
		};

		return () => {
			unsubscribe();
			unsubscribeReports();
			evtSource.close();
			if (chart) chart.destroy();
			if (categoryChart) categoryChart.destroy();
		};
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', theme);
		applyTheme();
	}

	function applyTheme() {
		document.documentElement.classList.toggle('dark', theme === 'dark');
	}
</script>

<div class="space-y-8">
	<div>
		<h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
			Student Dashboard
		</h2>
		<p class="text-slate-500 text-sm">Track your submitted maintenance reports</p>
	</div>

	<!-- STATS CARDS -->
	<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<p class="text-sm text-slate-500">Total Reports</p>
			<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{$stats.total}</p>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<p class="text-sm text-slate-500">Pending</p>
			<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{$stats.pending}</p>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<p class="text-sm text-slate-500">Approved</p>
			<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{$stats.approved}</p>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<p class="text-sm text-slate-500">Denied</p>
			<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{$stats.denied}</p>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<p class="text-sm text-slate-500">Completed</p>
			<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{$stats.completed}</p>
		</div>
	</section>

	<!-- GRAPHS -->
	<section class="grid md:grid-cols-2 gap-6">
		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="mb-6 border-b border-slate-400 dark:border-slate-700 pb-3">
				<h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
					Reports Overview
				</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Overview of your submitted reports
				</p>
			</div>

			<div class="h-72">
				<canvas id="studentChart"></canvas>
			</div>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="mb-6 border-b border-slate-400 dark:border-slate-700 pb-3">
				<h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
					Category Distribution
				</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Distribution of reports per category
				</p>
			</div>

			<div class="h-72">
				<canvas id="categoryChart"></canvas>
			</div>
		</div>
	</section>

	<!-- STATUS TRACKING -->
	<section class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
		<div class="mb-6 border-b border-slate-400 dark:border-slate-700 pb-3">
			<h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
				Status Tracking
			</h2>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Monitor the latest progress of your submitted reports
			</p>
		</div>

		<div class="space-y-4">
			{#each $reports as report}
				<a
					href={`/dashboard/student/reports/${report.id}`}
					class="block bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 p-4 sm:p-5 rounded-2xl shadow text-gray-700 dark:text-gray-200 transition hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
				>
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div class="min-w-0">
							<p class="font-medium break-words">{report.issue_description}</p>
							<p class="text-xs text-slate-500 mt-1">
								{new Date(report.created_at).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric'
								})}
							</p>
						</div>

						<span
							class="flex items-center gap-1 self-start sm:self-auto px-3 py-1 text-sm font-bold rounded-lg border border-slate-400
							{report.status?.toLowerCase().trim() === 'pending'
								? 'bg-yellow-100 text-yellow-700'
								: report.status === 'Approved'
								? 'bg-green-100 text-green-700'
								: report.status === 'Denied'
								? 'bg-red-100 text-red-700'
								: 'bg-blue-100 text-blue-700'}"
						>
							{#if report.status?.toLowerCase().trim() === 'pending'}
								<!-- clock icon -->
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							{:else if report.status?.toLowerCase().trim() === 'approved'}
								<!-- check icon -->
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M5 13l4 4L19 7" />
								</svg>
							{:else if report.status?.toLowerCase().trim() === 'denied'}
								<!-- X icon -->
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M6 18L18 6M6 6l12 12" />
								</svg>
							{:else if report.status?.toLowerCase().trim() === 'completed'}
								<!-- completed (check circle) -->
								<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M9 12l2 2l4-4M12 22a10 10 0 100-20 10 10 0 000 20z" />
								</svg>
							{/if}
							<span>
								{report.status === 'Pending Professor Review' ? 'Pending' : report.status}
							</span>
						</span>
					</div>
				</a>
			{/each}
		</div>
	</section>
</div>
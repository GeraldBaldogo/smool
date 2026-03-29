<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import Chart from 'chart.js/auto';
	import { goto } from '$app/navigation';

	type Report = {
		id: string;
		report_code?: string | null;
		name: string;
		issue: string;
		date: string;
		status: string;
		category?: string | null;
	};

	export let data: {
		user: any;
		reports: Report[];
	};

	let categoryChart: Chart;
	let categoryCanvas: HTMLCanvasElement;
	let reportCanvas: HTMLCanvasElement;
	let chart: Chart;

	function normalizeStatus(status: string) {
		const s = status?.toLowerCase().trim();

		if (s === 'pending' || s === 'pending professor review') return 'pending';
		if (s === 'approved') return 'approved';
		if (s === 'denied') return 'denied';
		if (s === 'completed') return 'completed';

		return s;
	}

	function isPending(status: string) {
		return normalizeStatus(status) === 'pending';
	}

	function getStatus(status: string) {
		return normalizeStatus(status);
	}

	function getStatusLabel(status: string) {
		const normalized = normalizeStatus(status);

		if (normalized === 'pending') return 'Pending';
		if (normalized === 'approved') return 'Approved';
		if (normalized === 'denied') return 'Denied';
		if (normalized === 'completed') return 'Completed';

		return status;
	}

	function canViewDetails(status: string) {
		return true;
	}

	function calculateCategoryStats(reportList: Report[]) {
		const categoryMap: Record<string, number> = {};

		reportList.forEach((r) => {
			const cat = r.category || 'Uncategorized';
			if (!categoryMap[cat]) categoryMap[cat] = 0;
			categoryMap[cat]++;
		});

		return categoryMap;
	}

	let reports = writable<Report[]>(data.reports);

	let stats = derived(reports, ($reports) => ({
		total: $reports.length,
		pending: $reports.filter((r) => normalizeStatus(r.status) === 'pending').length,
		approved: $reports.filter((r) => normalizeStatus(r.status) === 'approved').length,
		denied: $reports.filter((r) => normalizeStatus(r.status) === 'denied').length,
		completed: $reports.filter((r) => normalizeStatus(r.status) === 'completed').length
	}));

	onMount(() => {
		if (!reportCanvas || !categoryCanvas) return;

		const unsubscribe = reports.subscribe(($reports) => {
			const categoryData = calculateCategoryStats($reports);

			if (categoryChart) categoryChart.destroy();

			categoryChart = new Chart(categoryCanvas, {
				type: 'bar',
				data: {
					labels: Object.keys(categoryData),
					datasets: [
						{
							label: 'Reports by Category',
							data: Object.values(categoryData),
							backgroundColor: '#6366f1'
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						y: { beginAtZero: true }
					}
				}
			});

			const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			const pendingCounts = Array(12).fill(0);
			const approvedCounts = Array(12).fill(0);
			const deniedCounts = Array(12).fill(0);
			const completedCounts = Array(12).fill(0);

			$reports.forEach((r) => {
				const d = new Date(r.date);
				if (isNaN(d.getTime())) return;

				const m = d.getMonth();
				const status = normalizeStatus(r.status);

				if (status === 'pending') pendingCounts[m]++;
				else if (status === 'approved') approvedCounts[m]++;
				else if (status === 'denied') deniedCounts[m]++;
				else if (status === 'completed') completedCounts[m]++;
			});

			if (chart) chart.destroy();

			chart = new Chart(reportCanvas, {
				type: 'line',
				data: {
					labels: months,
					datasets: [
						{ label: 'Pending', data: pendingCounts, borderColor: '#facc15', tension: 0.3 },
						{ label: 'Approved', data: approvedCounts, borderColor: '#22c55e', tension: 0.3 },
						{ label: 'Denied', data: deniedCounts, borderColor: '#ef4444', tension: 0.3 },
						{ label: 'Completed', data: completedCounts, borderColor: '#a855f7', tension: 0.3 }
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false
				}
			});
		});

		return () => {
			unsubscribe();
			if (chart) chart.destroy();
			if (categoryChart) categoryChart.destroy();
		};
	});

	onMount(() => {
		const evtSource = new EventSource('/dashboard/professor/stream');

		evtSource.onmessage = (event) => {
			const updatedReport = JSON.parse(event.data);

			reports.update((rs) =>
				rs.map((r) =>
					r.id === updatedReport.id ? { ...r, status: updatedReport.status } : r
				)
			);
		};

		return () => evtSource.close();
	});

	async function approve(id: string) {
	await updateStatus(id, 'Approved');

	reports.update((rs) =>
		rs.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
	);
}

	async function deny(id: string) {
		await updateStatus(id, 'Denied');

		reports.update((rs) =>
		rs.map((r) => (r.id === id ? { ...r, status: 'Denied' } : r))
		);
	}

	async function updateStatus(id: string, status: string) {
		try {
			const res = await fetch('/dashboard/professor/update-status', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id, status })
			});
			const result = await res.json();
			if (!res.ok) throw new Error(result.error);
		} catch (err) {
			console.error(err);
			alert('Failed to update status.');
		}
	}
</script>

<div class="space-y-8">
	<div>
		<h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
			Professor Dashboard
		</h2>
		<p class="text-slate-500 text-sm">Manage and review submitted maintenance reports</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<p class="text-sm text-slate-500">Total Submitted</p>
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
	</div>

	<div class="grid gap-6 md:grid-cols-2">
		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="mb-6 border-b border-slate-400 dark:border-slate-700 pb-3">
				<h2 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
					Reports Per Month
				</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Overview of submitted reports
				</p>
			</div>

			<div class="h-72">
				<canvas bind:this={reportCanvas}></canvas>
			</div>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<div class="mb-6 border-b border-slate-400 dark:border-slate-700 pb-3">
				<h2 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
					Reports by Category
				</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Distribution of reports per category
				</p>
			</div>

			<div class="h-72">
				<canvas bind:this={categoryCanvas}></canvas>
			</div>
		</div>
	</div>

	<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-4 sm:p-6">
		<div class="border-b border-slate-400 dark:border-slate-700 pb-4 mb-4">
			<h3 class="text-lg font-semibold text-gray-800 dark:text-white">
				Reports Review
			</h3>
			<p class="text-sm text-slate-500">
				Maintenance reports submitted by users for professor verification
			</p>
		</div>

		{#if $reports.length === 0}
			<div class="text-center py-10 text-slate-400">
				No reports available
			</div>
		{:else}
			<div class="md:hidden space-y-4">
				{#each $reports as r}
					<div class="bg-white dark:bg-slate-800 border border-slate-400 dark:border-slate-700 rounded-2xl p-4 shadow">
						{#if canViewDetails(r.status)}
							<button
								type="button"
								class="w-full text-left"
								on:click={() => goto(`/dashboard/professor/reports/${r.id}`)}
							>
								<div class="flex items-start justify-between gap-3 mb-3">
									<div>
										<p class="text-xs text-slate-500">ID</p>
										<p class="text-sm font-semibold text-gray-700 dark:text-gray-200 break-all">
											{r.report_code ?? r.id}
										</p>
									</div>

									<span
										class="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-xl shrink-0
										{getStatus(r.status) === 'pending'
											? 'bg-yellow-100 text-yellow-700'
											: getStatus(r.status) === 'approved'
											? 'bg-green-100 text-green-700'
											: getStatus(r.status) === 'denied'
											? 'bg-red-100 text-red-700'
											: 'bg-blue-100 text-blue-700'}"
									>
										{#if getStatus(r.status) === 'pending'}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<circle cx="12" cy="12" r="10" />
												<path d="M12 6v6l4 2" />
											</svg>
										{:else if getStatus(r.status) === 'approved'}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<path d="M5 13l4 4L19 7" />
											</svg>
										{:else if getStatus(r.status) === 'denied'}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<path d="M6 6l12 12M6 18L18 6" />
											</svg>
										{:else}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<circle cx="12" cy="12" r="10" />
												<path d="M9 12l2 2 4-4" />
											</svg>
										{/if}
										{getStatusLabel(r.status)}
									</span>
								</div>

								<div class="space-y-3 text-sm">
									<div>
										<p class="text-xs text-slate-500">Submitted By</p>
										<p class="font-medium text-gray-700 dark:text-gray-200">{r.name}</p>
									</div>

									<div>
										<p class="text-xs text-slate-500">Issue</p>
										<p class="font-medium text-gray-700 dark:text-gray-200">{r.issue}</p>
									</div>

									<div>
										<p class="text-xs text-slate-500">Date</p>
										<p class="font-medium text-gray-700 dark:text-gray-200">{r.date}</p>
									</div>
								</div>
							</button>
						{:else}
							<div class="w-full text-left">
								<div class="flex items-start justify-between gap-3 mb-3">
									<div>
										<p class="text-xs text-slate-500">ID</p>
										<p class="text-sm font-semibold text-gray-700 dark:text-gray-200 break-all">
											{r.report_code ?? r.id}
										</p>
									</div>

									<span
										class="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-xl shrink-0
										{getStatus(r.status) === 'pending'
											? 'bg-yellow-100 text-yellow-700'
											: getStatus(r.status) === 'approved'
											? 'bg-green-100 text-green-700'
											: getStatus(r.status) === 'denied'
											? 'bg-red-100 text-red-700'
											: 'bg-blue-100 text-blue-700'}"
									>
										{#if getStatus(r.status) === 'pending'}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<circle cx="12" cy="12" r="10" />
												<path d="M12 6v6l4 2" />
											</svg>
										{:else if getStatus(r.status) === 'approved'}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<path d="M5 13l4 4L19 7" />
											</svg>
										{:else if getStatus(r.status) === 'denied'}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<path d="M6 6l12 12M6 18L18 6" />
											</svg>
										{:else}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<circle cx="12" cy="12" r="10" />
												<path d="M9 12l2 2 4-4" />
											</svg>
										{/if}
										{getStatusLabel(r.status)}
									</span>
								</div>

								<div class="space-y-3 text-sm">
									<div>
										<p class="text-xs text-slate-500">Submitted By</p>
										<p class="font-medium text-gray-700 dark:text-gray-200">{r.name}</p>
									</div>

									<div>
										<p class="text-xs text-slate-500">Issue</p>
										<p class="font-medium text-gray-700 dark:text-gray-200">{r.issue}</p>
									</div>

									<div>
										<p class="text-xs text-slate-500">Date</p>
										<p class="font-medium text-gray-700 dark:text-gray-200">{r.date}</p>
									</div>
								</div>
							</div>
						{/if}

						<div class="flex flex-col sm:flex-row gap-2 mt-4">
							{#if isPending(r.status)}
								<button
									on:click={() => approve(r.id)}
									class="px-3 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
								>
									Approve
								</button>

								<button
									on:click={() => deny(r.id)}
									class="px-3 py-2 text-sm rounded-lg bg-slate-500 hover:bg-slate-600 text-white transition"
								>
									Deny
								</button>
							{:else}
								<button
									on:click={() => goto(`/dashboard/professor/reports/${r.id}`)}
									class="px-3 py-2 text-sm rounded-lg border border-slate-400 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
								>
									View Details
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<div class="hidden md:block overflow-x-auto">
				<table class="w-full text-left border-separate border-spacing-y-2">
					<thead>
						<tr class="text-slate-500 text-sm">
							<th>ID</th>
							<th class="text-center">Submitted By</th>
							<th class="text-center">Issue</th>
							<th class="text-center">Date</th>
							<th class="text-center">Status</th>
							<th class="text-center">Action</th>
						</tr>
					</thead>

					<tbody>
						{#each $reports as r}
							<tr
								class="bg-white dark:bg-slate-800 transition {canViewDetails(r.status) ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}"
								on:click={() => canViewDetails(r.status) && goto(`/dashboard/professor/reports/${r.id}`)}
							>
								<td class="p-3 border-y border-l border-slate-400 dark:border-slate-700 rounded-l-2xl font-medium text-sm text-gray-700 dark:text-gray-200">
									{r.report_code ?? r.id}
								</td>

								<td class="p-3 border-y border-slate-400 dark:border-slate-700 text-sm text-gray-700 dark:text-gray-200">
									{r.name}
								</td>

								<td class="p-3 border-y border-slate-400 dark:border-slate-700 text-sm text-gray-700 dark:text-gray-200">
									{r.issue}
								</td>

								<td class="p-3 border-y border-slate-400 dark:border-slate-700 text-sm text-gray-700 dark:text-gray-200">
									{r.date}
								</td>

								<td class="p-3 border-y border-slate-400 dark:border-slate-700">
									<span
										class="flex items-center justify-center gap-2 px-3 py-1 text-xs font-semibold rounded-xl
										{getStatus(r.status) === 'pending'
											? 'bg-yellow-100 text-yellow-700'
											: getStatus(r.status) === 'approved'
											? 'bg-green-100 text-green-700'
											: getStatus(r.status) === 'denied'
											? 'bg-red-100 text-red-700'
											: 'bg-blue-100 text-blue-700'}"
									>
										{#if getStatus(r.status) === 'pending'}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<circle cx="12" cy="12" r="10" />
												<path d="M12 6v6l4 2" />
											</svg>
										{:else if getStatus(r.status) === 'approved'}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<path d="M5 13l4 4L19 7" />
											</svg>
										{:else if getStatus(r.status) === 'denied'}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<path d="M6 6l12 12M6 18L18 6" />
											</svg>
										{:else}
											<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<circle cx="12" cy="12" r="10" />
												<path d="M9 12l2 2 4-4" />
											</svg>
										{/if}
										{getStatusLabel(r.status)}
									</span>
								</td>

								<td class="p-3 border-y border-r border-slate-400 dark:border-slate-700 rounded-r-2xl space-x-2 text-center">
									{#if isPending(r.status)}
										<button
											on:click|stopPropagation={() => approve(r.id)}
											class="px-3 py-1 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
										>
											Approve
										</button>

										<button
											on:click|stopPropagation={() => deny(r.id)}
											class="px-3 py-1 text-sm rounded-lg bg-slate-500 hover:bg-slate-600 text-white transition"
										>
											Deny
										</button>
									{:else}
										<button
											on:click|stopPropagation={() => goto(`/dashboard/professor/reports/${r.id}`)}
											class="px-3 py-1 text-sm rounded-lg border border-slate-400 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:hover:bg-slate-700 dark:hover:text-white dark:hover:border-slate-700 transition"
										>
											View Details
										</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
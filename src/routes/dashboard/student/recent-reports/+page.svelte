<script lang="ts">
	import { writable, derived } from 'svelte/store';

	type Report = {
		id: string;
		issue_description: string;
		status: string;
		created_at: string;
	};

	export let data: {
		reports: Report[];
	};

	let reports = writable<Report[]>(data.reports);
	let search = writable('');
	let filterStatus = writable('All');

	function getStatusKey(status: string) {
		return status?.trim().toLowerCase();
	}

	function getStatusLabel(status: string) {
		const s = getStatusKey(status);

		if (s === 'pending professor review') return 'Pending';
		if (s === 'pending') return 'Pending';
		if (s === 'approved') return 'Approved';
		if (s === 'denied') return 'Denied';
		if (s === 'completed') return 'Completed';

		return status;
	}

	function getStatusClasses(status: string) {
		const s = getStatusKey(status);

		if (s === 'pending' || s === 'pending professor review') {
			return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300';
		}

		if (s === 'approved') {
			return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300';
		}

		if (s === 'denied') {
			return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
		}

		if (s === 'completed') {
			return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300';
		}

		return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300';
	}

	let filteredReports = derived(
		[reports, search, filterStatus],
		([$reports, $search, $filterStatus]) => {
			return $reports.filter((r) => {
				const matchSearch = r.issue_description?.toLowerCase().includes($search.toLowerCase());

				const matchStatus =
					$filterStatus === 'All'
						? true
						: getStatusLabel(r.status).toLowerCase() === $filterStatus.toLowerCase();

				return matchSearch && matchStatus;
			});
		}
	);
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-3xl font-bold text-gray-800 dark:text-white">Recent Reports</h2>
		<p class="text-slate-500 text-sm">Review your report history and current status</p>
	</div>

	<div class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
		<input
			type="text"
			placeholder="Search by issue..."
			class="w-full md:w-96 px-4 py-2 rounded-xl 
			bg-white text-gray-800 dark:text-slate-200 border border-slate-400 dark:border-slate-700 placeholder-gray-400
			dark:bg-slate-800/70 dark:placeholder-gray-400
			focus:outline-none focus:ring-2 focus:ring-blue-500
			transition-colors duration-300 backdrop-blur-lg"
			on:input={(e) => search.set(e.currentTarget.value)}
		/>

		<select
			class="w-full md:w-56 px-4 py-2 rounded-xl 
			bg-white text-gray-800 border border-slate-400 dark:border-slate-700 
			dark:bg-slate-800/70 dark:text-slate-200
			focus:outline-none focus:ring-2 focus:ring-blue-500
			transition-colors duration-300 backdrop-blur-lg"
			on:change={(e) => filterStatus.set(e.currentTarget.value)}
		>
			<option value="All">All</option>
			<option value="Pending">Pending</option>
			<option value="Approved">Approved</option>
			<option value="Denied">Denied</option>
			<option value="Completed">Completed</option>
		</select>
	</div>

	<div class="grid gap-4">
		{#each $filteredReports as report}
			<a
				href={`/dashboard/student/reports/${report.id}`}
				class="block p-5 rounded-xl bg-white dark:bg-slate-800/70 shadow backdrop-blur-lg hover:shadow-lg transition border border-slate-400 dark:border-slate-700"
			>
				<p class="text-lg font-semibold text-gray-900 dark:text-white">
					{report.issue_description ?? 'No description'}
				</p>

				<div class="mt-3">
					<span
						class={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-lg font-semibold border border-slate-400 dark:border-slate-700 ${getStatusClasses(report.status)}`}
					>
						{#if getStatusKey(report.status) === 'pending' || getStatusKey(report.status) === 'pending professor review'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						{:else if getStatusKey(report.status) === 'approved'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						{:else if getStatusKey(report.status) === 'denied'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						{:else if getStatusKey(report.status) === 'completed'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2l4-4M12 22a10 10 0 100-20 10 10 0 000 20z"
								/>
							</svg>
						{/if}

						<span>{getStatusLabel(report.status)}</span>
					</span>
				</div>

				<p class="text-sm text-gray-500 mt-2">
					{new Date(report.created_at).toLocaleString()}
				</p>
			</a>
		{/each}

		{#if $filteredReports.length === 0}
			<p class="text-center py-6 text-slate-500">No reports found.</p>
		{/if}
	</div>
</div>
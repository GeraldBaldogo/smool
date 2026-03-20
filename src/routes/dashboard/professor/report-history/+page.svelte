<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import { goto } from '$app/navigation';

	type Report = {
		id: number;
		name: string;
		issue: string;
		date: string;
		status: string;
	};

	export let data: {
		reports: Report[];
	};

	let reports = writable<Report[]>(data.reports);
	let search = writable('');
	let filterStatus = writable('All');

	let filteredReports = derived(
		[reports, search, filterStatus],
		([$reports, $search, $filterStatus]) => {
			return $reports.filter((r) => {
				const matchSearch =
					r.name.toLowerCase().includes($search.toLowerCase()) ||
					r.issue.toLowerCase().includes($search.toLowerCase());

				const matchStatus =
					$filterStatus === 'All'
						? true
						: r.status.toLowerCase() === $filterStatus.toLowerCase();

				return matchSearch && matchStatus;
			});
		}
	);

	function statusClass(status: string) {
		const s = status?.toLowerCase().trim();

		if (s === 'pending') {
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

		if (s === 'pending admin approval') {
			return 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300';
		}

		return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200';
	}
</script>

<div class="space-y-6">
	<!-- TITLE -->
	<div>
		<h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
			Report History
		</h2>
		<p class="text-slate-500 text-sm">
			View all submitted and processed maintenance reports
		</p>
	</div>

	<!-- FILTER + SEARCH -->
	<div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
		<input
			type="text"
			placeholder="Search by name or issue..."
			class="w-full lg:w-96 px-4 py-3 rounded-xl border
			bg-white/70 text-gray-800 placeholder-gray-400 border-slate-400 shadow-sm
			dark:bg-slate-800/70 dark:text-white dark:placeholder-gray-400 dark:border-slate-600
			backdrop-blur
			focus:outline-none focus:ring-2 focus:ring-blue-500
			transition-colors duration-300"
			on:input={(e) => search.set(e.currentTarget.value)}
		/>

		<select
			class="w-full lg:w-56 px-4 py-3 rounded-xl border
			bg-white/70 text-gray-800 border-slate-400 shadow-sm
			dark:bg-slate-800/70 dark:text-white dark:border-slate-600
			backdrop-blur
			focus:outline-none focus:ring-2 focus:ring-blue-500
			transition-colors duration-300"
			on:change={(e) => filterStatus.set(e.currentTarget.value)}
		>
			<option value="All">All</option>
			<option value="Pending">Pending</option>
			<option value="Approved">Approved</option>
			<option value="Denied">Denied</option>
			<option value="Completed">Completed</option>
		</select>
	</div>

	<!-- HISTORY CARD -->
	<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur shadow rounded-2xl p-4 sm:p-6 border border-slate-400 dark:border-slate-600">
		{#if $filteredReports.length === 0}
			<div class="text-center py-8 text-slate-500">
				No reports found.
			</div>
		{:else}
			<!-- MOBILE CARDS -->
			<div class="md:hidden space-y-4">
				{#each $filteredReports as r}
					<button
						type="button"
						class="w-full text-left bg-white/80 dark:bg-slate-800 border border-slate-400 dark:border-slate-700 rounded-2xl p-4 shadow-sm transition hover:shadow-md"
						on:click={() => goto(`/dashboard/professor/reports/${r.id}`)}
					>
						<div class="flex items-start justify-between gap-3 mb-3">
							<div>
								<p class="text-xs text-slate-500">ID</p>
								<p class="text-sm font-semibold text-gray-800 dark:text-white break-all">
									{r.id}
								</p>
							</div>

							<span class={`px-3 py-1 text-xs rounded-full font-semibold ${statusClass(r.status)}`}>
								{r.status}
							</span>
						</div>

						<div class="space-y-3">
							<div>
								<p class="text-xs text-slate-500">Name</p>
								<p class="font-medium text-gray-800 dark:text-white">{r.name}</p>
							</div>

							<div>
								<p class="text-xs text-slate-500">Issue</p>
								<p class="font-medium text-gray-800 dark:text-white break-words">{r.issue}</p>
							</div>

							<div>
								<p class="text-xs text-slate-500">Date</p>
								<p class="font-medium text-gray-800 dark:text-white">
									{new Date(r.date).toLocaleDateString()}
								</p>
							</div>
						</div>
					</button>
				{/each}
			</div>

			<!-- DESKTOP TABLE -->
			<div class="hidden md:block overflow-x-auto">
				<table class="w-full text-left text-gray-800 dark:text-white border-separate border-spacing-y-2">
					<thead>
						<tr class="text-slate-500 text-sm">
							<th class="py-3 px-3">ID</th>
							<th class="px-3">Name</th>
							<th class="px-3">Issue</th>
							<th class="px-3">Date</th>
							<th class="px-3">Status</th>
						</tr>
					</thead>

					<tbody>
						{#each $filteredReports as r}
							<tr
								class="bg-white/60 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition cursor-pointer"
								on:click={() => goto(`/dashboard/professor/reports/${r.id}`)}
							>
								<td class="py-4 px-3 border-y border-l border-slate-400 dark:border-slate-700 rounded-l-2xl">
									<span class="break-all">{r.id}</span>
								</td>

								<td class="px-3 border-y border-slate-400 dark:border-slate-700">
									{r.name}
								</td>

								<td class="px-3 border-y border-slate-400 dark:border-slate-700">
									{r.issue}
								</td>

								<td class="px-3 border-y border-slate-400 dark:border-slate-700">
									{new Date(r.date).toLocaleDateString()}
								</td>

								<td class="px-3 border-y border-r border-slate-400 dark:border-slate-700 rounded-r-2xl">
									<span class={`px-3 py-1 text-xs rounded-full font-semibold ${statusClass(r.status)}`}>
										{r.status}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
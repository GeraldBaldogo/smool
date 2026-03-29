<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import { goto } from '$app/navigation';

	type Report = {
		id: string;
		report_code?: string | null;
		name: string;
		issue: string;
		date: string;
		status: string;
	};

	export let data: { reports: Report[] };

	const reports = writable<Report[]>(data.reports);

	async function updateStatus(id: string, status: string) {
		try {
			const res = await fetch('/dashboard/professor/update-status', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, status })
			});

			if (!res.ok) throw new Error('Failed to update');

			reports.update((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
		} catch (err) {
			console.error(err);
			alert('Update failed.');
		}
	}

	const pending = derived(reports, ($reports) =>
		$reports.filter((r) => r.status?.toLowerCase() === 'pending')
	);
</script>

<div class="space-y-4">
	<div>
		<h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
			Pending Reports
		</h2>
		<p class="text-sm text-slate-500">
			Review and manage maintenance reports waiting for your approval. Click on a report to view details and take action.
		</p>
	</div>

	<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur shadow rounded-2xl p-4 sm:p-5 border border-slate-400 dark:border-slate-700">
		{#if $pending.length === 0}
			<div class="text-center py-6 text-slate-500">
				No pending reports.
			</div>
		{:else}
			<!-- MOBILE VIEW -->
			<div class="md:hidden space-y-4">
				{#each $pending as r}
					<div class="bg-white dark:bg-slate-800 border border-slate-400 dark:border-slate-700 rounded-2xl p-4 shadow">
						<button
							type="button"
							class="w-full text-left"
							on:click={() => goto(`/dashboard/professor/reports/${r.id}`)}
						>
							<div class="space-y-3">
								<div>
									<p class="text-xs text-slate-500">ID</p>
									<p class="font-medium text-gray-800 dark:text-white break-all">{r.report_code ?? r.id}</p>
								</div>

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

						<div class="flex flex-col sm:flex-row gap-2 mt-4">
							<button
								type="button"
								on:click={() => updateStatus(r.id, 'Approved')}
								class="px-3 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
							>
								Approve
							</button>

							<button
								type="button"
								on:click={() => updateStatus(r.id, 'Denied')}
								class="px-3 py-2 text-sm rounded-lg bg-slate-500 hover:bg-slate-600 text-white transition"
							>
								Deny
							</button>
						</div>
					</div>
				{/each}
			</div>

			<!-- DESKTOP TABLE VIEW -->
			<div class="hidden md:block overflow-x-auto">
				<table class="w-full text-left text-gray-800 dark:text-white border-separate border-spacing-y-2">
					<thead>
						<tr class="text-slate-500 text-sm">
							<th class="px-3 py-3">ID</th>
							<th>Name</th>
							<th>Issue</th>
							<th>Date</th>
							<th>Action</th>
						</tr>
					</thead>

					<tbody>
						{#each $pending as r}
							<tr
								class="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
								on:click={() => goto(`/dashboard/professor/reports/${r.id}`)}
							>
								<td class="p-3 border-y border-l border-slate-400 dark:border-slate-700 rounded-l-xl font-medium">
									{r.report_code ?? r.id}
								</td>

								<td class="p-3 border-y border-slate-400 dark:border-slate-700">
									{r.name}
								</td>

								<td class="p-3 border-y border-slate-400 dark:border-slate-700">
									{r.issue}
								</td>

								<td class="p-3 border-y border-slate-400 dark:border-slate-700">
									{new Date(r.date).toLocaleDateString()}
								</td>

								<td class="p-3 border-y border-r border-slate-400 dark:border-slate-700 rounded-r-xl space-x-2">
									<button
										type="button"
										on:click|stopPropagation={() => updateStatus(r.id, 'Approved')}
										class="px-3 py-1 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
									>
										Approve
									</button>

									<button
										type="button"
										on:click|stopPropagation={() => updateStatus(r.id, 'Denied')}
										class="px-3 py-1 text-sm rounded-lg bg-slate-500 hover:bg-slate-600 text-white transition"
									>
										Deny
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
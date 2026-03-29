<script lang="ts">
	import { goto } from '$app/navigation';

	export let data: {
		historyReports: {
			id: string;
			report_code?: string | null;
			issue: string;
			status: string;
			category?: string | null;
			created_at: string;
			completed_at?: string | null;
			address?: string | null;
			landmark?: string | null;
			admin_feedback?: string | null;
			completion_photo_url?: string | null;
			full_name: string;
			role: string;
			course?: string | null;
		}[];
	};

	let search = '';
	let statusFilter = 'all';
	let roleFilter = 'all';

	function getStatusKey(status: string) {
		return status?.trim().toLowerCase();
	}

	function getStatusLabel(status: string) {
		const s = getStatusKey(status);

		if (s === 'submitted to admin') return 'Professor Report';
		if (s === 'pending') return 'Pending';
		if (s === 'approved') return 'Approved';
		if (s === 'denied') return 'Denied';
		if (s === 'in progress') return 'In Progress';
		if (s === 'completed') return 'Completed';

		return status;
	}

	function getStatusClasses(status: string) {
		const s = getStatusKey(status);

		if (s === 'submitted to admin') return 'bg-violet-100 text-violet-700';
		if (s === 'pending') return 'bg-yellow-100 text-yellow-700';
		if (s === 'approved') return 'bg-green-100 text-green-700';
		if (s === 'denied') return 'bg-red-100 text-red-700';
		if (s === 'in progress') return 'bg-orange-100 text-orange-700';
		if (s === 'completed') return 'bg-blue-100 text-blue-700';

		return 'bg-gray-100 text-gray-700';
	}

	function getRoleClasses(role: string) {
		const r = role?.trim().toLowerCase();

		if (r === 'student') return 'bg-emerald-100 text-emerald-700';
		if (r === 'professor') return 'bg-indigo-100 text-indigo-700';
		if (r === 'admin') return 'bg-rose-100 text-rose-700';

		return 'bg-gray-100 text-gray-700';
	}

	function formatDate(value?: string | null) {
		if (!value) return 'N/A';

		return new Date(value).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatDateTime(value?: string | null) {
		if (!value) return 'N/A';

		const date = new Date(value);

		return `${date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})} at ${date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		})}`;
	}

	$: reports = data.historyReports ?? [];

	$: filteredReports = reports.filter((r) => {
		const matchesStatus =
			statusFilter === 'all' || getStatusKey(r.status) === statusFilter;

		const matchesRole =
			roleFilter === 'all' || r.role?.trim().toLowerCase() === roleFilter;

		const q = search.trim().toLowerCase();

		const matchesSearch =
			!q ||
			r.issue?.toLowerCase().includes(q) ||
			r.full_name?.toLowerCase().includes(q) ||
			r.role?.toLowerCase().includes(q) ||
			r.course?.toLowerCase().includes(q) ||
			r.category?.toLowerCase().includes(q) ||
			r.address?.toLowerCase().includes(q) ||
			r.id?.toLowerCase().includes(q);

		return matchesStatus && matchesRole && matchesSearch;
	});
</script>

<div class="space-y-8">
	<div>
		<h2 class="text-3xl sm:text-3xl font-bold text-gray-800 dark:text-white">History Records</h2>
		<p class="text-slate-500 text-sm">Search and review all maintenance report records</p>
	</div>

	<section class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-4 sm:p-6">
		<div class="border-b border-slate-400 dark:border-slate-700 pb-4 mb-4">
			<h3 class="text-lg font-semibold text-gray-800 dark:text-white">
				Report History
			</h3>
			<p class="text-sm text-slate-500">
				Filter by status, role, and search keywords for faster access
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-[1fr_180px_180px] gap-3 mb-6">
			<input
				type="text"
				bind:value={search}
				placeholder="Search by issue, user, role, course, category, address, or report ID"
				class="w-full rounded-xl border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			<select
				bind:value={statusFilter}
				class="w-full rounded-xl border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="all">All Status</option>
				<option value="submitted to admin">Professor Report</option>
				<option value="pending">Pending</option>
				<option value="approved">Approved</option>
				<option value="denied">Denied</option>
				<option value="in progress">In Progress</option>
				<option value="completed">Completed</option>
			</select>

			<select
				bind:value={roleFilter}
				class="w-full rounded-xl border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="all">All Roles</option>
				<option value="student">Student</option>
				<option value="professor">Professor</option>
			</select>
		</div>

		{#if filteredReports.length === 0}
			<div class="text-center py-10 text-slate-400">
				No history records found
			</div>
		{:else}
			<div class="space-y-4">
				{#each filteredReports as r}
					<button
						type="button"
						on:click={() => goto(`/dashboard/admin/reports/${r.id}`)}
						class="w-full text-left bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 p-4 sm:p-5 rounded-2xl shadow text-gray-700 dark:text-gray-200 transition hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
					>
						<div class="flex flex-col gap-4">
							<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
								<div class="min-w-0">
									<p class="font-medium break-words">{r.issue}</p>
									<p class="text-xs text-slate-500 mt-1">Report ID: {r.report_code ?? r.id}</p>
									<p class="text-xs text-slate-500 mt-1">
										Created: {formatDate(r.created_at)}
									</p>
									<p class="text-xs text-slate-500 mt-1">
										Finished: {formatDateTime(r.completed_at)}
									</p>
								</div>

								<div class="flex flex-wrap items-center gap-2">
									<span
										class="flex items-center gap-1 px-3 py-1 text-sm font-bold rounded-lg border border-slate-400 {getStatusClasses(r.status)}"
									>
										{#if getStatusKey(r.status) === 'submitted to admin'}
											<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M14 5l7 7m0 0l-7 7m7-7H3"
												/>
											</svg>
										{:else if getStatusKey(r.status) === 'pending'}
											<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
										{:else if getStatusKey(r.status) === 'in progress'}
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

									<span class="flex items-center gap-1 px-3 py-1 text-sm font-bold rounded-lg border border-slate-400 {getRoleClasses(r.role)}">
										{r.role}
									</span>
								</div>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
								<div>
									<p class="text-xs text-slate-500">Submitted By</p>
									<p class="font-medium text-gray-700 dark:text-gray-200">{r.full_name}</p>
								</div>

								<div>
									<p class="text-xs text-slate-500">Role</p>
									<p class="font-medium text-gray-700 dark:text-gray-200 capitalize">{r.role}</p>
								</div>

								<div>
									<p class="text-xs text-slate-500">Course</p>
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
									<p class="font-medium text-gray-700 dark:text-gray-200">
										{r.landmark || 'N/A'}
									</p>
								</div>

								<div class="sm:col-span-2 lg:col-span-3">
									<p class="text-xs text-slate-500">Location</p>
									<p class="font-medium text-gray-700 dark:text-gray-200 break-words">
										{r.address || 'N/A'}
									</p>
								</div>

								{#if r.admin_feedback}
									<div class="sm:col-span-2 lg:col-span-4">
										<p class="text-xs text-slate-500">Admin Feedback</p>
										<p class="font-medium text-gray-700 dark:text-gray-200 break-words">
											{r.admin_feedback}
										</p>
									</div>
								{/if}
							</div>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</section>
</div>
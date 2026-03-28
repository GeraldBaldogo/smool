<script lang="ts">
	export let data: {
		report: {
			id: string;
			report_code?: string | null;
			issue_description: string;
			category: string | null;
			subcategory: string | null;
			status: string;
			created_at: string;
			latitude?: number | null;
			longitude?: number | null;
			address?: string | null;
			landmark?: string | null;
			photo_url?: string | null;
			admin_feedback?: string | null;
			completion_photo_url?: string | null;
			completed_at?: string | null;
		} | null;
	};

	const { report } = data;

	function formatDate(value?: string | null) {
		if (!value) return 'N/A';
		return new Date(value).toLocaleString();
	}
</script>

{#if report}
	<div class="space-y-6">
		<div>
			<h2 class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
				Report Details
			</h2>
			<p class="text-sm text-slate-500">
				View your submitted maintenance report and completion details
			</p>
		</div>

		<div class="rounded-2xl p-4 sm:p-6 space-y-6 bg-white dark:bg-slate-800 border border-slate-400 dark:border-slate-700 shadow-sm">
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<p class="text-sm text-slate-500">Report ID</p>
					<p class="text-base font-semibold text-slate-800 dark:text-slate-200 break-all">
						{report.report_code ?? report.id}
					</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Status</p>
					<span
						class="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full
						{report.status?.toLowerCase() === 'pending'
							? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
							: report.status?.toLowerCase() === 'approved'
							? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
							: report.status?.toLowerCase() === 'in progress'
							? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
							: report.status?.toLowerCase() === 'completed'
							? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
							: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}"
					>
						{report.status ?? 'N/A'}
					</span>
				</div>
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				<div class="rounded-xl border border-slate-400 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-900/30">
					<p class="text-sm text-slate-500">Issue Description</p>
					<p class="mt-1 text-base font-semibold text-slate-800 dark:text-slate-200">
						{report.issue_description ?? 'N/A'}
					</p>
				</div>

				<div class="rounded-xl border border-slate-400 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-900/30">
					<p class="text-sm text-slate-500">Created At</p>
					<p class="mt-1 text-slate-700 dark:text-slate-300">
						{formatDate(report.created_at)}
					</p>
				</div>

				<div class="rounded-xl border border-slate-400 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-900/30">
					<p class="text-sm text-slate-500">Category</p>
					<p class="mt-1 text-slate-800 dark:text-slate-200">
						{report.category ?? 'N/A'}
					</p>
				</div>

				<div class="rounded-xl border border-slate-400 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-900/30">
					<p class="text-sm text-slate-500">Specific Issue</p>
					<p class="mt-1 text-slate-800 dark:text-slate-200">
						{report.subcategory ?? 'N/A'}
					</p>
				</div>

				<div class="rounded-xl border border-slate-400 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-900/30 sm:col-span-2">
					<p class="text-sm text-slate-500">Location</p>

					<div class="mt-2 grid gap-3 sm:grid-cols-2">
						<div>
							<p class="text-xs text-slate-500">Latitude</p>
							<p class="text-slate-700 dark:text-slate-300">
								{report.latitude != null ? report.latitude.toFixed(5) : 'N/A'}
							</p>
						</div>

						<div>
							<p class="text-xs text-slate-500">Longitude</p>
							<p class="text-slate-700 dark:text-slate-300">
								{report.longitude != null ? report.longitude.toFixed(5) : 'N/A'}
							</p>
						</div>

						<div class="sm:col-span-2">
							<p class="text-xs text-slate-500">Address</p>
							<p class="text-slate-700 dark:text-slate-300">
								{report.address ?? 'N/A'}
							</p>
						</div>

						<div class="sm:col-span-2">
							<p class="text-xs text-slate-500">Landmark</p>
							<p class="text-slate-700 dark:text-slate-300">
								{report.landmark ?? 'N/A'}
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-xl border border-slate-400 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-900/30 sm:col-span-2">
					<p class="text-sm text-slate-500">Submitted Photo</p>

					{#if report.photo_url}
						<img
							src={report.photo_url}
							alt={report.issue_description ?? 'Report Photo'}
							class="mt-3 rounded-xl shadow border border-slate-400 dark:border-slate-700 max-h-[420px] w-full object-cover"
						/>
					{:else}
						<p class="mt-2 text-slate-500">No photo uploaded.</p>
					{/if}
				</div>
			</div>
		</div>

		{#if report.status?.toLowerCase() === 'completed'}
			<div class="rounded-2xl p-4 sm:p-6 space-y-5 bg-white dark:bg-slate-800 border border-slate-400 dark:border-slate-700 shadow-sm">
				<div class="border-b border-slate-400 dark:border-slate-700 pb-3">
					<h3 class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
						Admin Feedback
					</h3>
					<p class="text-sm text-slate-500">
						Completion summary and repair outcome
					</p>
				</div>

				<div class="rounded-xl border border-slate-400 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-900/30">
					<p class="text-sm text-slate-500">Feedback</p>
					<p class="mt-1 text-slate-700 dark:text-slate-300">
						{report.admin_feedback || 'No feedback provided by admin.'}
					</p>
				</div>

				<div class="rounded-xl border border-slate-400 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-900/30">
					<p class="text-sm text-slate-500">Completed At</p>
					<p class="mt-1 text-slate-700 dark:text-slate-300">
						{formatDate(report.completed_at)}
					</p>
				</div>

				<div class="rounded-xl border border-slate-400 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-900/30">
					<p class="text-sm text-slate-500">Resolution Evidence</p>

					{#if report.completion_photo_url}
						<img
							src={report.completion_photo_url}
							alt="Completion evidence"
							class="mt-3 rounded-xl border border-slate-400 dark:border-slate-700 shadow max-h-[420px] w-full object-cover"
						/>
					{:else}
						<p class="mt-2 text-slate-500">No completion photo uploaded.</p>
					{/if}
				</div>
			</div>
		{/if}

		<a
			href="/dashboard/student/recent-reports"
			class="inline-flex items-center px-4 py-2 rounded-lg border border-slate-400 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
		>
			Back to Recent Reports
		</a>
	</div>
{:else}
	<p class="text-slate-500">Report not found</p>
{/if}
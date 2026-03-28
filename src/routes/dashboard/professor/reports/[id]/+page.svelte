<script lang="ts">
	export let data: {
		report: {
			id: string;
			report_code?: string | null;
			issue_description: string;
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

	async function approve() {
		if (!report) return;
		await updateStatus(report.id, 'Approved');
	}

	async function deny() {
		if (!report) return;
		await updateStatus(report.id, 'Denied');
	}

	async function updateStatus(id: string, status: string) {
		try {
			const res = await fetch('/dashboard/professor/update-status', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, status })
			});

			const result = await res.json();

			if (!res.ok) {
				throw new Error(result.error || 'Failed to update status');
			}

			if (report) report.status = status;
			alert(`Report status updated to ${status}`);
		} catch (err) {
			console.error(err);
			alert('Failed to update status. Try again.');
		}
	}

	function getStatusKey(status?: string | null) {
		return status?.trim().toLowerCase() ?? '';
	}

	function getStatusLabel(status?: string | null) {
		const s = getStatusKey(status);

		if (s === 'pending professor review') return 'Pending';
		if (s === 'pending') return 'Pending';
		if (s === 'approved') return 'Approved';
		if (s === 'denied') return 'Denied';
		if (s === 'completed') return 'Completed';

		return status ?? 'N/A';
	}

	function getStatusClasses(status?: string | null) {
		const s = getStatusKey(status);

		if (s === 'pending' || s === 'pending professor review') {
			return 'bg-yellow-100 text-yellow-700';
		}

		if (s === 'approved') {
			return 'bg-green-100 text-green-700';
		}

		if (s === 'denied') {
			return 'bg-red-100 text-red-700';
		}

		if (s === 'completed') {
			return 'bg-blue-100 text-blue-700';
		}

		return 'bg-gray-100 text-gray-700';
	}

	function formatDate(value?: string | null) {
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
</script>

{#if report}
	<div class="space-y-6">
		<div>
			<h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
				Report Details
			</h2>
			<p class="text-sm text-slate-500">
				Review submitted maintenance report information
			</p>
		</div>

		<!-- MAIN DETAILS CARD -->
		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-4 sm:p-6 space-y-6">
			<div class="grid gap-5 sm:grid-cols-2">
				<div>
					<p class="text-sm text-slate-500">Report ID</p>
					<p class="text-base font-semibold text-gray-800 dark:text-gray-200 break-all">
						{report.report_code ?? report.id}
					</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Status</p>
					<span
						class="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full {getStatusClasses(report.status)}"
					>
						{getStatusLabel(report.status)}
					</span>
				</div>

				<div class="sm:col-span-2">
					<p class="text-sm text-slate-500">Issue Description</p>
					<p class="text-base font-semibold text-gray-800 dark:text-gray-200">
						{report.issue_description ?? 'N/A'}
					</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Created At</p>
					<p class="text-gray-700 dark:text-gray-300">
						{formatDate(report.created_at)}
					</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Completed At</p>
					<p class="text-gray-700 dark:text-gray-300">
						{formatDate(report.completed_at)}
					</p>
				</div>
			</div>

			<div class="border-t border-slate-300 dark:border-slate-700 pt-5 space-y-3">
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white">Location Details</h3>

				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<p class="text-sm text-slate-500">Latitude</p>
						<p class="text-gray-700 dark:text-gray-300">
							{report.latitude != null ? report.latitude.toFixed(5) : 'N/A'}
						</p>
					</div>

					<div>
						<p class="text-sm text-slate-500">Longitude</p>
						<p class="text-gray-700 dark:text-gray-300">
							{report.longitude != null ? report.longitude.toFixed(5) : 'N/A'}
						</p>
					</div>

					<div class="sm:col-span-2">
						<p class="text-sm text-slate-500">Address</p>
						<p class="text-gray-700 dark:text-gray-300">
							{report.address ?? 'N/A'}
						</p>
					</div>

					<div class="sm:col-span-2">
						<p class="text-sm text-slate-500">Landmark</p>
						<p class="text-gray-700 dark:text-gray-300">
							{report.landmark ?? 'N/A'}
						</p>
					</div>
				</div>
			</div>

			<div class="border-t border-slate-300 dark:border-slate-700 pt-5 space-y-3">
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white">Submitted Photo</h3>

				{#if report.photo_url}
					<img
						src={report.photo_url}
						alt={report.issue_description ?? 'Report Photo'}
						class="w-full max-h-[420px] object-cover rounded-xl border border-slate-300 dark:border-slate-700"
					/>
				{:else}
					<p class="text-gray-700 dark:text-gray-300">No photo uploaded.</p>
				{/if}
			</div>
		</div>

		<!-- COMPLETION DETAILS CARD -->
		{#if getStatusKey(report.status) === 'completed' || report.admin_feedback || report.completion_photo_url || report.completed_at}
			<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-4 sm:p-6 space-y-6">
				<div class="border-b border-slate-300 dark:border-slate-700 pb-4">
					<h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
						Completion Details
					</h3>
					<p class="text-sm text-slate-500 mt-1">
						View the admin's final feedback, completion date, and uploaded resolution evidence.
					</p>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="sm:col-span-2">
						<p class="text-sm text-slate-500">Admin Feedback</p>
						<p class="text-gray-700 dark:text-gray-300">
							{report.admin_feedback ?? 'No completion feedback provided.'}
						</p>
					</div>

					<div class="sm:col-span-2">
						<p class="text-sm text-slate-500">Completed At</p>
						<p class="text-gray-700 dark:text-gray-300">
							{formatDate(report.completed_at)}
						</p>
					</div>

					<div class="sm:col-span-2">
						<p class="text-sm text-slate-500">Resolution Evidence</p>
						{#if report.completion_photo_url}
							<img
								src={report.completion_photo_url}
								alt="Completed repair"
								class="mt-2 w-full max-h-[420px] object-cover rounded-xl border border-slate-300 dark:border-slate-700"
							/>
						{:else}
							<p class="text-gray-700 dark:text-gray-300">
								No completed photo uploaded.
							</p>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- REVIEW ACTIONS CARD -->
		{#if getStatusKey(report.status) === 'pending' || getStatusKey(report.status) === 'pending professor review'}
			<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-4 sm:p-6">
				<div class="border-b border-slate-300 dark:border-slate-700 pb-4 mb-4">
					<h3 class="text-lg font-semibold text-gray-800 dark:text-white">
						Review Actions
					</h3>
					<p class="text-sm text-slate-500 mt-1">
						Approve or deny this maintenance report after reviewing the submitted information.
					</p>
				</div>

				<div class="flex flex-col sm:flex-row gap-3">
					<button
						on:click={approve}
						class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-white text-white dark:text-slate-900 transition"
					>
						Approve
					</button>

					<button
						on:click={deny}
						class="px-4 py-2 rounded-lg border border-slate-400 dark:border-slate-600 text-gray-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
					>
						Deny
					</button>
				</div>
			</div>
		{/if}

		<a
			href="/dashboard/professor"
			class="inline-flex items-center px-4 py-2 rounded-lg border border-slate-400 dark:border-slate-700 text-gray-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
		>
			Back to Dashboard
		</a>
	</div>
{:else}
	<p class="text-gray-500">Report not found.</p>
{/if}
<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;
	export let form;

	const report = data.report;

	function getStatusKey(status: string) {
		return status?.trim().toLowerCase();
	}

	function getStatusLabel(status: string) {
		const s = getStatusKey(status);

		if (s === 'submitted to admin') return 'Submitted to Admin';
		if (s === 'pending') return 'Pending';
		if (s === 'approved') return 'Approved';
		if (s === 'in progress') return 'In Progress';
		if (s === 'completed') return 'Completed';
		if (s === 'denied') return 'Denied';

		return status;
	}

	function getStatusClasses(status: string) {
		const s = getStatusKey(status);

		if (s === 'pending') {
			return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300';
		}

		if (s === 'submitted to admin') {
			return 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300';
		}

		if (s === 'approved') {
			return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300';
		}

		if (s === 'in progress') {
			return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300';
		}

		if (s === 'completed') {
			return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300';
		}

		if (s === 'denied') {
			return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
		}

		return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300';
	}

	function canMarkInProgress(status: string) {
		const s = getStatusKey(status);
		return s === 'approved' || s === 'submitted to admin';
	}

	function canMarkCompleted(status: string) {
		return getStatusKey(status) === 'in progress';
	}

	function isCompleted(status: string) {
		return getStatusKey(status) === 'completed';
	}

	function formatDate(date: string | null) {
		if (!date) return 'N/A';

		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	$: normalizedStatus = getStatusKey(report.status);
</script>

<div class="space-y-6 sm:space-y-8">
	<div class="space-y-2">
		<h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
			Report Details
		</h2>
		<p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
			Review the submitted maintenance report and update its progress status.
		</p>
	</div>

	{#if form?.message}
		<div
			class={`rounded-2xl border px-4 py-3 text-sm font-medium ${
				form?.success
					? 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300'
					: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'
			}`}
		>
			{form.message}
		</div>
	{/if}

	<div class="rounded-2xl sm:rounded-3xl border border-slate-400/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/70 backdrop-blur shadow-sm overflow-hidden">
		<div class="border-b border-slate-400 dark:border-slate-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
			<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div class="min-w-0">
					<p class="text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
						Smart School Maintenance Report
					</p>
					<h3 class="mt-1 text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 dark:text-white break-all">
						#{report.id}
					</h3>
				</div>

				<span
					class={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs sm:text-sm font-semibold ${getStatusClasses(report.status)}`}
				>
					{getStatusLabel(report.status)}
				</span>
			</div>
		</div>

		<div class="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
				<div class="rounded-2xl border border-slate-400 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/30 p-4 sm:p-5">
					<p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
						Submitted By
					</p>
					<p class="mt-2 text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words">
						{report.name}
					</p>
				</div>

				<div class="rounded-2xl border border-slate-400 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/30 p-4 sm:p-5">
					<p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
						Date Submitted
					</p>
					<p class="mt-2 text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
						{formatDate(report.date)}
					</p>
				</div>

				<div class="rounded-2xl border border-slate-400 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/30 p-4 sm:p-5 md:col-span-2">
					<p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
						Issue
					</p>
					<p class="mt-2 text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words">
						{report.issue}
					</p>
				</div>

				<div class="rounded-2xl border border-slate-400 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/30 p-4 sm:p-5">
					<p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
						Category
					</p>
					<p class="mt-2 text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words">
						{report.category ?? 'N/A'}
					</p>
				</div>

				<div class="rounded-2xl border border-slate-400 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/30 p-4 sm:p-5">
					<p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
						Landmark
					</p>
					<p class="mt-2 text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words">
						{report.landmark || 'N/A'}
					</p>
				</div>

				<div class="rounded-2xl border border-slate-400 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/30 p-4 sm:p-5 md:col-span-2">
					<p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
						Address
					</p>
					<p class="mt-2 text-base sm:text-lg font-semibold leading-relaxed text-slate-900 dark:text-white break-words">
						{report.address || 'N/A'}
					</p>
				</div>
			</div>

			<div class="mt-6 sm:mt-8 rounded-2xl border border-slate-400 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/30 p-4 sm:p-5">
				<div class="space-y-4">
					<div>
						<h4 class="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
							Update Report Status
						</h4>
						<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
							Updating the status here will also reflect on the user's status tracking.
						</p>
					</div>

					{#if canMarkInProgress(report.status)}
						<form method="POST" action="?/markInProgress">
							<button
								type="submit"
								class="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 sm:px-5 py-2.5 text-sm sm:text-base font-medium text-white hover:bg-orange-700 transition"
							>
								Mark as In Progress
							</button>
						</form>
					{/if}

					{#if canMarkCompleted(report.status)}
						<form
							method="POST"
							action="?/markCompleted"
							enctype="multipart/form-data"
							class="space-y-5"
						>
							<div class="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/30 p-4 sm:p-5">
								<div class="mb-4 border-b border-slate-300 dark:border-slate-700 pb-3">
									<h4 class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
										Completion Form
									</h4>
									<p class="text-sm text-slate-500 dark:text-slate-400">
										Fill out the completion details before marking this report as completed.
									</p>
								</div>

								<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
									<div class="lg:col-span-2">
										<label
											for="feedback"
											class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
										>
											Feedback
										</label>
										<textarea
											id="feedback"
											name="feedback"
											rows="5"
											placeholder="Enter a short note that the maintenance work has been completed..."
											class="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
											required
										></textarea>
									</div>

									<div>
										<label
											for="completed_at"
											class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
										>
											Completed At
										</label>
										<input
											id="completed_at"
											name="completed_at"
											type="date"
											class="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
											required
										/>
									</div>

									<div>
										<label
											for="photo"
											class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
										>
											Resolution Evidence
										</label>
										<input
											id="photo"
											name="photo"
											type="file"
											accept="image/*"
											class="block w-full text-sm text-slate-700 dark:text-slate-200
											file:mr-4 file:py-2.5 file:px-4
											file:rounded-xl file:border-0
											file:text-sm file:font-medium
											file:bg-slate-200 file:text-slate-800
											dark:file:bg-slate-700 dark:file:text-white"
											required
										/>
										<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
											Upload a photo as proof of repair or completed work.
										</p>
									</div>
								</div>

								<div class="mt-5">
									<button
										type="submit"
										class="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-green-600 px-4 sm:px-5 py-2.5 text-sm sm:text-base font-medium text-white hover:bg-green-700 transition"
									>
										Mark as Completed
									</button>
								</div>
							</div>
						</form>
					{/if}

					{#if isCompleted(report.status)}
						<div class="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/30 p-4 sm:p-5">
							<div class="mb-4 border-b border-slate-300 dark:border-slate-700 pb-3">
								<h4 class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
									Completion Details
								</h4>
								<p class="text-sm text-slate-500 dark:text-slate-400">
									Saved completion record for this maintenance report.
								</p>
							</div>

							<div class="space-y-4">
								<div class="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/30 p-4">
									<p class="text-sm text-slate-500 dark:text-slate-400 mb-2">Feedback</p>
									<p class="text-base text-slate-800 dark:text-slate-100">
										{report.admin_feedback || 'No feedback provided.'}
									</p>
								</div>

								<div class="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/30 p-4">
									<p class="text-sm text-slate-500 dark:text-slate-400 mb-2">Completed At</p>
									<p class="text-base text-slate-800 dark:text-slate-100">
										{formatDate(report.completed_at)}
									</p>
								</div>

								<div class="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/30 p-4">
									<p class="text-sm text-slate-500 dark:text-slate-400 mb-3">Resolution Evidence</p>

									{#if report.completion_photo_url}
										<img
											src={report.completion_photo_url}
											alt="Completion evidence"
											class="w-full max-h-[420px] rounded-2xl object-cover border border-slate-300 dark:border-slate-700"
										/>
									{:else}
										<p class="text-base text-slate-500 dark:text-slate-400">
											No completion photo uploaded.
										</p>
									{/if}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<div class="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
				<button
					type="button"
					class="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 sm:px-5 py-2.5 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
					on:click={() => goto('/dashboard/admin/reports')}
				>
					Back to Reports
				</button>

				<div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
					Review this report before updating its status
				</div>
			</div>
		</div>
	</div>
</div>
<script lang="ts">
	export let data: {
		summary: {
			total_feedback: number | string;
			average_rating: number | string | null;
			five_star: number | string;
			four_star: number | string;
			three_star: number | string;
			two_star: number | string;
			one_star: number | string;
		};
		feedbacks: {
			id: string;
			rating: number;
			feedback: string;
			created_at: string;
			full_name: string;
			email: string;
			role: string;
		}[];
	};

	let search = '';
	let ratingFilter = 'all';
	let roleFilter = 'all';

	function formatDate(value?: string | null) {
		if (!value) return 'N/A';

		return new Date(value).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getRoleClasses(role: string) {
		const r = role?.toLowerCase();

		if (r === 'student') return 'bg-green-100 text-green-700';
		if (r === 'professor') return 'bg-blue-100 text-blue-700';
		if (r === 'admin') return 'bg-red-100 text-red-700';

		return 'bg-gray-100 text-gray-700';
	}

	$: totalFeedback = Number(data.summary?.total_feedback ?? 0);
	$: averageRating = Number(data.summary?.average_rating ?? 0);

	$: filteredFeedbacks = data.feedbacks.filter((item) => {
		const matchesRating =
			ratingFilter === 'all' || String(item.rating) === ratingFilter;

		const matchesRole =
			roleFilter === 'all' || item.role?.toLowerCase() === roleFilter;

		const q = search.trim().toLowerCase();

		const matchesSearch =
			!q ||
			item.full_name?.toLowerCase().includes(q) ||
			item.email?.toLowerCase().includes(q) ||
			item.role?.toLowerCase().includes(q) ||
			item.feedback?.toLowerCase().includes(q);

		return matchesRating && matchesRole && matchesSearch;
	});
</script>

<div class="space-y-8">
	<div>
		<h2 class="text-3xl sm:text-3xl font-bold text-gray-800 dark:text-white">
			Ratings & Feedback
		</h2>
		<p class="text-slate-500 text-sm">
			Review user ratings and suggestions to improve the Smart School Maintenance system
		</p>
	</div>

	<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<p class="text-sm text-slate-500">Total Feedback</p>
			<p class="text-3xl font-bold text-gray-700 dark:text-gray-200">{totalFeedback}</p>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<p class="text-sm text-slate-500">Average Rating</p>
			<div class="flex items-center gap-3 mt-2">
				<div class="flex items-center gap-1">
					{#each [1, 2, 3, 4, 5] as star}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class={`w-6 h-6 ${
								star <= Math.round(averageRating)
									? 'fill-yellow-400 text-yellow-400'
									: 'fill-none text-slate-400'
							}`}
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.037 6.27a1 1 0 00.95.69h6.593c.969 0 1.371 1.24.588 1.81l-5.333 3.875a1 1 0 00-.364 1.118l2.037 6.27c.3.921-.755 1.688-1.538 1.118l-5.333-3.875a1 1 0 00-1.176 0l-5.333 3.875c-.783.57-1.838-.197-1.538-1.118l2.037-6.27a1 1 0 00-.364-1.118L.88 11.697c-.783-.57-.38-1.81.588-1.81h6.593a1 1 0 00.95-.69l2.037-6.27z"
							/>
						</svg>
					{/each}
				</div>

				<p class="text-2xl font-bold text-gray-700 dark:text-gray-200">
					{averageRating.toFixed(2)}
				</p>
			</div>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-5 sm:p-6">
			<p class="text-sm text-slate-500">Rating Distribution</p>
			<div class="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
				<p>5 Stars: {data.summary.five_star}</p>
				<p>4 Stars: {data.summary.four_star}</p>
				<p>3 Stars: {data.summary.three_star}</p>
				<p>2 Stars: {data.summary.two_star}</p>
				<p>1 Star: {data.summary.one_star}</p>
			</div>
		</div>
	</section>

	<section class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-4 sm:p-6">
		<div class="border-b border-slate-400 dark:border-slate-700 pb-4 mb-4">
			<h3 class="text-lg font-semibold text-gray-800 dark:text-white">
				User Feedback List
			</h3>
			<p class="text-sm text-slate-500">
				Read comments and suggestions from users for system improvement
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-[1fr_180px_180px] gap-3 mb-6">
			<input
				type="text"
				bind:value={search}
				placeholder="Search by name, email, role, or feedback"
				class="w-full rounded-xl border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			<select
				bind:value={ratingFilter}
				class="w-full rounded-xl border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="all">All Ratings</option>
				<option value="5">5 Stars</option>
				<option value="4">4 Stars</option>
				<option value="3">3 Stars</option>
				<option value="2">2 Stars</option>
				<option value="1">1 Star</option>
			</select>

			<select
				bind:value={roleFilter}
				class="w-full rounded-xl border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="all">All Roles</option>
				<option value="student">Student</option>
				<option value="professor">Professor</option>
				<option value="admin">Admin</option>
			</select>
		</div>

		{#if filteredFeedbacks.length === 0}
			<div class="text-center py-10 text-slate-400">
				No feedback records found
			</div>
		{:else}
			<div class="space-y-4">
				{#each filteredFeedbacks as item}
					<div class="bg-white/70 dark:bg-slate-800/70 border border-slate-400 dark:border-slate-700 rounded-2xl p-4 shadow">
						<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
							<div class="min-w-0">
								<p class="font-semibold text-gray-800 dark:text-gray-200 break-words">
									{item.full_name}
								</p>
								<p class="text-xs text-slate-500 mt-1 break-all">{item.email}</p>
							</div>

							<div class="flex flex-wrap items-center gap-2">
								<div class="flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-50 border border-yellow-200">
									{#each [1, 2, 3, 4, 5] as star}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											class={`w-4 h-4 ${
												star <= item.rating
													? 'fill-yellow-400 text-yellow-400'
													: 'fill-none text-slate-400'
											}`}
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.037 6.27a1 1 0 00.95.69h6.593c.969 0 1.371 1.24.588 1.81l-5.333 3.875a1 1 0 00-.364 1.118l2.037 6.27c.3.921-.755 1.688-1.538 1.118l-5.333-3.875a1 1 0 00-1.176 0l-5.333 3.875c-.783.57-1.838-.197-1.538-1.118l2.037-6.27a1 1 0 00-.364-1.118L.88 11.697c-.783-.57-.38-1.81.588-1.81h6.593a1 1 0 00.95-.69l2.037-6.27z"
											/>
										</svg>
									{/each}
									<span class="ml-1 text-sm font-semibold text-yellow-700">{item.rating}/5</span>
								</div>

								<span class="px-3 py-1 text-xs font-semibold rounded-full {getRoleClasses(item.role)}">
									{item.role}
								</span>
							</div>
						</div>

						<p class="text-sm text-gray-700 dark:text-gray-200 break-words mb-3">
							{item.feedback}
						</p>

						<p class="text-xs text-slate-500">
							Submitted on {formatDate(item.created_at)}
						</p>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
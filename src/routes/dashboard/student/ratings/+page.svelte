<script lang="ts">
	export let data: {
		myFeedbacks: {
			id: string;
			rating: number;
			feedback: string;
			created_at: string;
		}[];
	};

	export let form: {
		success?: boolean;
		message?: string;
	} | null;

	let selectedRating = 0;
	let hoverRating = 0;

	function formatDate(value?: string | null) {
		if (!value) return 'N/A';

		return new Date(value).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="space-y-8">
	<div>
		<h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
			Ratings & Feedback
		</h2>
		<p class="text-slate-500 text-sm">
			Share your experience and help improve the Smart School Maintenance
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

	<section class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-4 sm:p-6">
		<div class="border-b border-slate-400 dark:border-slate-700 pb-4 mb-4">
			<h3 class="text-lg font-semibold text-gray-800 dark:text-white">
				Submit Feedback
			</h3>
			<p class="text-sm text-slate-500">
				Rate the system and tell us what can be improved
			</p>
		</div>

		<form method="POST" action="?/submit" class="space-y-5">
			<div>
				<div class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
					Rating
                </div>

				<input type="hidden" name="rating" value={selectedRating} required />

				<div class="flex items-center gap-1">
					{#each [1, 2, 3, 4, 5] as star}
						<button
							type="button"
							class="transition-transform hover:scale-110"
							on:mouseenter={() => (hoverRating = star)}
							on:mouseleave={() => (hoverRating = 0)}
							on:click={() => (selectedRating = star)}
							aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								class={`w-9 h-9 ${
									star <= (hoverRating || selectedRating)
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
						</button>
					{/each}
				</div>

				<p class="mt-2 text-sm text-slate-500">
					{#if selectedRating === 0}
						Select your rating
					{:else if selectedRating === 5}
						Excellent
					{:else if selectedRating === 4}
						Very Good
					{:else if selectedRating === 3}
						Good
					{:else if selectedRating === 2}
						Fair
					{:else}
						Poor
					{/if}
				</p>
			</div>

			<div>
				<label for="feedback" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
					Feedback
				</label>
				<textarea
					id="feedback"
					name="feedback"
					rows="5"
					required
					placeholder="Share your experience, suggestions, or concerns about the system..."
					class="w-full rounded-xl border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
				></textarea>
			</div>

			<button
				type="submit"
				class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
			>
				Submit Feedback
			</button>
		</form>
	</section>

	<section class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-4 sm:p-6">
		<div class="border-b border-slate-400 dark:border-slate-700 pb-4 mb-4">
			<h3 class="text-lg font-semibold text-gray-800 dark:text-white">
				My Previous Feedback
			</h3>
			<p class="text-sm text-slate-500">
				Your submitted ratings and feedback history
			</p>
		</div>

		{#if data.myFeedbacks.length === 0}
			<div class="text-center py-10 text-slate-400">
				No feedback submitted yet
			</div>
		{:else}
			<div class="space-y-4">
				{#each data.myFeedbacks as item}
					<div class="bg-white/70 dark:bg-slate-800/70 border border-slate-400 dark:border-slate-700 rounded-2xl p-4 shadow">
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
							<div class="flex items-center gap-2">
								<span class="px-3 py-1 text-sm font-bold rounded-lg bg-yellow-100 text-yellow-700">
									⭐ {item.rating}/5
								</span>
							</div>

							<p class="text-xs text-slate-500">
								{formatDate(item.created_at)}
							</p>
						</div>

						<p class="text-sm text-gray-700 dark:text-gray-200 break-words">
							{item.feedback}
						</p>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
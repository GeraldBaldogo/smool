<script lang="ts">
	import { goto } from '$app/navigation';

	export let data: {
		users: {
			id: string;
			full_name: string;
			email: string;
			role: string;
			created_at: string;
		}[];
	};

	const users = data.users;

	function formatDate(value: string) {
		return new Date(value).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getRoleClasses(role: string) {
		const r = role?.toLowerCase();

		if (r === 'admin') return 'bg-red-100 text-red-700';
		if (r === 'professor') return 'bg-blue-100 text-blue-700';
		if (r === 'student') return 'bg-green-100 text-green-700';

		return 'bg-gray-100 text-gray-700';
	}
</script>

<div class="space-y-8">
	<div>
		<h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
			All Users
		</h2>
		<p class="text-slate-500 text-sm">
			View and manage registered users in the system
		</p>
	</div>

	<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-4 sm:p-6">
		<div class="border-b border-slate-400 dark:border-slate-700 pb-4 mb-4">
			<h3 class="text-lg font-semibold text-gray-800 dark:text-white">
				User Directory
			</h3>
			<p class="text-sm text-slate-500">
				Click a user to view their full profile information
			</p>
		</div>

		{#if users.length === 0}
			<div class="text-center py-10 text-slate-400">
				No users found
			</div>
		{:else}
			<!-- MOBILE -->
			<div class="md:hidden space-y-4">
				{#each users as u}
					<button
						type="button"
						class="w-full text-left bg-white dark:bg-slate-800 border border-slate-400 dark:border-slate-700 rounded-2xl p-4 shadow transition hover:shadow-md"
						on:click={() => goto(`/dashboard/admin/users/${u.id}`)}
					>
						<div class="flex items-start justify-between gap-3 mb-3">
							<div class="min-w-0">
								<p class="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
									{u.full_name}
								</p>
								<p class="text-sm text-slate-500 mt-1 break-all">{u.email}</p>
							</div>

							<span class="px-3 py-1 text-xs font-semibold rounded-lg {getRoleClasses(u.role)}">
								{u.role}
							</span>
						</div>

						<div class="grid grid-cols-1 gap-3 text-sm">
							<div>
								<p class="text-xs text-slate-500">Joined</p>
								<p class="font-medium text-gray-700 dark:text-gray-200">
									{formatDate(u.created_at)}
								</p>
							</div>
						</div>
					</button>
				{/each}
			</div>

			<!-- DESKTOP -->
			<div class="hidden md:block overflow-x-auto">
				<table class="w-full text-left border-separate border-spacing-y-2">
					<thead>
						<tr class="text-slate-500 text-sm">
							<th class="px-3">Name</th>
							<th class="px-3">Email</th>
							<th class="px-3">Role</th>
							<th class="px-3">Joined</th>
						</tr>
					</thead>

					<tbody>
						{#each users as u}
							<tr
								class="bg-white dark:bg-slate-800 cursor-pointer hover:shadow-md transition"
								on:click={() => goto(`/dashboard/admin/users/${u.id}`)}
							>
								<td class="p-4 border-y border-l border-slate-400 dark:border-slate-700 rounded-l-2xl font-medium text-sm text-gray-800 dark:text-gray-200">
									{u.full_name}
								</td>

								<td class="p-4 border-y border-slate-400 dark:border-slate-700 text-medium text-gray-700 dark:text-gray-200">
									{u.email}
								</td>

								<td class="p-4 border-y border-slate-400 dark:border-slate-700 text-sm">
									<span class="px-3 py-1 text-sm font-semibold rounded-lg {getRoleClasses(u.role)}">
										{u.role}
									</span>
								</td>

								<td class="p-4 border-y border-r border-slate-400 dark:border-slate-700 rounded-r-2xl text-sm text-gray-700 dark:text-gray-200">
									{formatDate(u.created_at)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
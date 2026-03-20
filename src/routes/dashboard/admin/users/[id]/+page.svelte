<script lang="ts">
	import { goto } from '$app/navigation';

	export let data: {
		user: {
			id: string;
			full_name: string;
			email: string;
			role: string;
			created_at: string;
		} | null;
	};

	const user = data.user;

	function formatDate(value?: string | null) {
		if (!value) return 'N/A';

		return new Date(value).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getRoleClasses(role?: string | null) {
		const r = role?.toLowerCase();

		if (r === 'admin') return 'bg-red-100 text-red-700';
		if (r === 'professor') return 'bg-blue-100 text-blue-700';
		if (r === 'student') return 'bg-green-100 text-green-700';

		return 'bg-gray-100 text-gray-700';
	}
</script>

{#if user}
	<div class="space-y-6">
		<div>
			<h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
				User Profile
			</h2>
			<p class="text-sm text-slate-500">
				View full information for this user
			</p>
		</div>

		<div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-400 dark:border-slate-700 shadow rounded-2xl p-4 sm:p-6 space-y-6">
			<div class="grid gap-5 sm:grid-cols-2">
				<div>
					<p class="text-sm text-slate-500">User ID</p>
					<p class="text-base font-semibold text-gray-800 dark:text-gray-200 break-all">
						{user.id}
					</p>
				</div>

				<div>
					<p class="text-sm text-slate-500 mb-1">Role</p>
					<span class="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-lg {getRoleClasses(user.role)}">
						{user.role}
					</span>
				</div>

				<div class="sm:col-span-2">
					<p class="text-sm text-slate-500">Full Name</p>
					<p class="text-base font-semibold text-gray-800 dark:text-gray-200">
						{user.full_name}
					</p>
				</div>

				<div class="sm:col-span-2">
					<p class="text-sm text-slate-500">Email</p>
					<p class="text-base font-semibold text-gray-800 dark:text-gray-200 break-all">
						{user.email}
					</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Joined</p>
					<p class="text-gray-700 dark:text-gray-300">
						{formatDate(user.created_at)}
					</p>
				</div>
			</div>
		</div>

		<button
			type="button"
			class="inline-flex items-center px-4 py-2 rounded-lg border border-slate-400 dark:border-slate-700 text-gray-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
			on:click={() => goto('/dashboard/admin/users')}
		>
			Back to Users
		</button>
	</div>
{:else}
	<p class="text-gray-500">User not found.</p>
{/if}
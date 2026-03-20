<script lang="ts">
	import { onMount } from 'svelte';

	let code = '';
	let error = '';
	let theme: 'light' | 'dark' = 'light';

	onMount(() => {
		const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
		if (saved) theme = saved;
		applyTheme();
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', theme);
		applyTheme();
	}

	function applyTheme() {
		document.documentElement.classList.toggle('dark', theme === 'dark');
	}

	async function verify() {
		error = '';

		const res = await fetch('/api/auth/verify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ code })
		});

		const data = await res.json();

		if (!res.ok) {
			error = data.message;
			return;
		}

		if (data.role === 'student') {
			window.location.href = '/dashboard/student';
		} else if (data.role === 'professor') {
			window.location.href = '/dashboard/professor';
		} else {
			window.location.href = '/dashboard/admin';
		}
	}
</script>

<div class="min-h-screen relative overflow-hidden bg-animated px-4 bg-slate-100 dark:bg-slate-950">
	<!-- TOP RIGHT THEME TOGGLE -->
	<div class="absolute top-4 right-4 z-20">
		<button
			type="button"
			aria-label="Toggle theme"
			title="Toggle Theme"
			on:click={toggleTheme}
			class={`p-3 rounded-xl border shadow-md transition
			${
				theme === 'light'
					? 'bg-white/80 text-slate-800 border-slate-400 hover:bg-white'
					: 'bg-slate-800/80 text-slate-100 border-slate-700 hover:bg-slate-700'
			}`}
		>
			{#if theme === 'light'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
				</svg>
			{/if}
		</button>
	</div>

	<!-- CENTER CONTENT -->
	<div class="min-h-screen flex items-center justify-center">
		<div
			class="w-full max-w-[400px] rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-lg
			bg-blue-50/85 border border-slate-400 dark:border-slate-700 text-slate-900
			dark:bg-slate-900/70 dark:border-white/10 dark:text-white"
		>
			<div class="text-center mb-6">
				<h1 class="text-2xl font-bold">OTP Verification</h1>
				<p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
					Enter the 6-digit verification code sent to your email
				</p>
			</div>

			{#if error}
				<div
					class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600
					dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
				>
					{error}
				</div>
			{/if}

			<div class="space-y-4">
				<div>
					<div class="block text-sm mb-2 text-slate-700 dark:text-slate-300">
						Verification Code
					</div>
					<input
						type="text"
						bind:value={code}
						placeholder="Enter 6-digit code"
						maxlength="6"
						class="w-full rounded-md bg-white dark:bg-slate-800 border border-black dark:border-slate-600
						text-slate-900 dark:text-white px-3 py-3 text-sm outline-none
						focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
					/>
				</div>

				<button
					type="button"
					on:click={verify}
					class="w-full mt-2 py-3 rounded-md font-semibold bg-blue-700 hover:bg-blue-800 text-white transition"
				>
					Verify Code
				</button>
			</div>

			<div class="mt-6 text-center">
				<p class="text-xs text-slate-500 dark:text-slate-400">
					Check your Gmail inbox and spam folder for the verification code.
				</p>
			</div>
		</div>
	</div>
</div>
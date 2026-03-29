<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let data: {
		user: {
			id: number;
			full_name: string;
			email: string;
			role: string;
			department_id?: number;
		};
	};

	const { user } = data;
	let sidebarOpen = false;

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
</script>

<div class="min-h-screen flex bg-transparent">
	<div class="flex-1">
		<!-- MOBILE SIDEBAR -->
		<div
			class={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 shadow-lg z-40 transform transition-transform duration-300
			${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden flex flex-col justify-between`}
		>
			<div>
				<div class="flex justify-end p-4">
					<button
						on:click={() => (sidebarOpen = false)}
						class="text-gray-800 dark:text-white text-2xl"
					>
						&times;
					</button>
				</div>

				<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<p class="text-sm text-slate-500">Smart School Maintenance</p>
					<p class="font-semibold text-gray-900 dark:text-white">Student Dashboard</p>
					<p class="mt-1 text-gray-700 dark:text-gray-300 text-sm">Welcome, {user.full_name}</p>
				</div>

				<nav class="flex flex-col gap-4 px-6 py-4">
					<a
						href="/dashboard/student"
						class="transition"
						class:text-blue-600={$page.url.pathname === '/dashboard/student'}
						class:font-semibold={$page.url.pathname === '/dashboard/student'}
						class:text-gray-700={$page.url.pathname !== '/dashboard/student'}
						class:dark:text-gray-200={$page.url.pathname !== '/dashboard/student'}
					>
						Dashboard
					</a>

					<a
						href="/dashboard/student/request"
						class="transition"
						class:text-blue-600={$page.url.pathname.startsWith('/dashboard/student/request')}
						class:font-semibold={$page.url.pathname.startsWith('/dashboard/student/request')}
						class:text-gray-700={!$page.url.pathname.startsWith('/dashboard/student/request')}
						class:dark:text-gray-200={!$page.url.pathname.startsWith('/dashboard/student/request')}
					>
						Report Issue
					</a>

					<a
						href="/dashboard/student/recent-reports"
						class="transition"
						class:text-blue-600={$page.url.pathname.startsWith('/dashboard/student/recent-reports')}
						class:font-semibold={$page.url.pathname.startsWith('/dashboard/student/recent-reports')}
						class:text-gray-700={!$page.url.pathname.startsWith('/dashboard/student/recent-reports')}
						class:dark:text-gray-200={!$page.url.pathname.startsWith('/dashboard/student/recent-reports')}
					>
						Recent Reports
					</a>

					<a
						href="/dashboard/student/ratings"
						class="transition"
						class:text-blue-600={$page.url.pathname === '/dashboard/student/ratings'}
						class:font-semibold={$page.url.pathname === '/dashboard/student/ratings'}
						class:text-gray-700={$page.url.pathname !== '/dashboard/student/ratings'}
						class:dark:text-gray-200={$page.url.pathname !== '/dashboard/student/ratings'}
					>
						Ratings & Feedback
					</a>
				</nav>
			</div>

			<div class="px-6 py-4 flex flex-col gap-2">
				<button
					title="Settings"
					aria-label="Settings"
					class="flex items-center gap-2 p-2 rounded-lg transition text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="3" />
						<path
							d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06
							a2 2 0 1 1-2.83 2.83l-.06-.06
							a1.65 1.65 0 0 0-1.82-.33
							1.65 1.65 0 0 0-1 1.51V21
							a2 2 0 1 1-4 0v-.09
							a1.65 1.65 0 0 0-1-1.51
							1.65 1.65 0 0 0-1.82.33l-.06.06
							a2 2 0 1 1-2.83-2.83l.06-.06
							a1.65 1.65 0 0 0 .33-1.82
							1.65 1.65 0 0 0-1.51-1H3
							a2 2 0 1 1 0-4h.09
							a1.65 1.65 0 0 0 1.51-1
							1.65 1.65 0 0 0-.33-1.82l-.06-.06
							a2 2 0 1 1 2.83-2.83l.06.06
							a1.65 1.65 0 0 0 1.82.33h0
							a1.65 1.65 0 0 0 1-1.51V3
							a2 2 0 1 1 4 0v.09
							a1.65 1.65 0 0 0 1 1.51
							1.65 1.65 0 0 0 1.82-.33l.06-.06
							a2 2 0 1 1 2.83 2.83l-.06.06
							a1.65 1.65 0 0 0-.33 1.82v0
							a1.65 1.65 0 0 0 1.51 1H21
							a2 2 0 1 1 0 4h-.09
							a1.65 1.65 0 0 0-1.51 1z"
						/>
					</svg>
					<span>Settings</span>
				</button>

				<button
					class={`px-4 py-2 rounded-lg text-sm font-medium transition
					${theme === 'light'
						? 'bg-slate-200 text-gray-800 border border-black hover:bg-slate-300 hover:shadow-sm'
						: 'bg-slate-700 text-slate-200 hover:bg-slate-600 hover:shadow-sm'}`}
					on:click={() => {
						fetch('/logout', { method: 'POST' }).then(() => (window.location.href = '/login'));
					}}
				>
					Logout
				</button>
			</div>
		</div>

		<!-- NAVBAR -->
		<header class="sticky top-0 z-30 bg-white/70 dark:bg-slate-800/70 backdrop-blur border-b border-slate-400 dark:border-slate-700 shadow px-4 sm:px-6 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<button
						class="md:hidden text-2xl text-gray-800 dark:text-white"
						on:click={() => (sidebarOpen = !sidebarOpen)}
					>
						☰
					</button>

					<div>
						<p class="text-sm text-slate-500">Welcome,</p>
						<p class="font-semibold text-gray-900 dark:text-white">{user.full_name}</p>
					</div>
				</div>

				<nav class="hidden md:flex items-center gap-10 lg:gap-16 xl:gap-24 font-medium">
					<a
						href="/dashboard/student"
						class="transition"
						class:text-blue-600={$page.url.pathname === '/dashboard/student'}
						class:font-semibold={$page.url.pathname === '/dashboard/student'}
						class:text-gray-700={$page.url.pathname !== '/dashboard/student'}
						class:dark:text-gray-200={$page.url.pathname !== '/dashboard/student'}
					>
						Dashboard
					</a>

					<a
						href="/dashboard/student/request"
						class="transition"
						class:text-blue-600={$page.url.pathname.startsWith('/dashboard/student/request')}
						class:font-semibold={$page.url.pathname.startsWith('/dashboard/student/request')}
						class:text-gray-700={!$page.url.pathname.startsWith('/dashboard/student/request')}
						class:dark:text-gray-200={!$page.url.pathname.startsWith('/dashboard/student/request')}
					>
						Report Issue
					</a>

					<a
						href="/dashboard/student/recent-reports"
						class="transition"
						class:text-blue-600={$page.url.pathname.startsWith('/dashboard/student/recent-reports')}
						class:font-semibold={$page.url.pathname.startsWith('/dashboard/student/recent-reports')}
						class:text-gray-700={!$page.url.pathname.startsWith('/dashboard/student/recent-reports')}
						class:dark:text-gray-200={!$page.url.pathname.startsWith('/dashboard/student/recent-reports')}
					>
						Recent Reports
					</a>

					<a
						href="/dashboard/student/ratings"
						class="transition"
						class:text-blue-600={$page.url.pathname === '/dashboard/student/ratings'}
						class:font-semibold={$page.url.pathname === '/dashboard/student/ratings'}
						class:text-gray-700={$page.url.pathname !== '/dashboard/student/ratings'}
						class:dark:text-gray-200={$page.url.pathname !== '/dashboard/student/ratings'}
					>
						Ratings & Feedback
					</a>
				</nav>

				<div class="flex items-center gap-3 text-xl">
					<button
						type="button"
						aria-label="Toggle theme"
						title="Toggle Theme"
						on:click={toggleTheme}
						class="p-2 rounded-lg transition text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
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

					<div class="hidden md:flex items-center gap-2">
						<button
							title="Settings"
							aria-label="Settings"
							class="p-2 rounded-lg transition text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
						>
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
								<circle cx="12" cy="12" r="3" />
								<path
									d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06
									a2 2 0 1 1-2.83 2.83l-.06-.06
									a1.65 1.65 0 0 0-1.82-.33
									1.65 1.65 0 0 0-1 1.51V21
									a2 2 0 1 1-4 0v-.09
									a1.65 1.65 0 0 0-1-1.51
									1.65 1.65 0 0 0-1.82.33l-.06.06
									a2 2 0 1 1-2.83-2.83l.06-.06
									a1.65 1.65 0 0 0 .33-1.82
									1.65 1.65 0 0 0-1.51-1H3
									a2 2 0 1 1 0-4h.09
									a1.65 1.65 0 0 0 1.51-1
									1.65 1.65 0 0 0-.33-1.82l-.06-.06
									a2 2 0 1 1 2.83-2.83l.06.06
									a1.65 1.65 0 0 0 1.82.33h0
									a1.65 1.65 0 0 0 1-1.51V3
									a2 2 0 1 1 4 0v.09
									a1.65 1.65 0 0 0 1 1.51
									1.65 1.65 0 0 0 1.82-.33l.06-.06
									a2 2 0 1 1 2.83 2.83l-.06.06
									a1.65 1.65 0 0 0-.33 1.82v0
									a1.65 1.65 0 0 0 1.51 1H21
									a2 2 0 1 1 0 4h-.09
									a1.65 1.65 0 0 0-1.51 1z"
								/>
							</svg>
						</button>

						<button
							class={`px-4 py-2 rounded-lg text-sm font-medium transition
							${theme === 'light'
								? 'bg-slate-200 text-gray-800 border border-black hover:bg-slate-300 hover:shadow-sm'
								: 'bg-slate-700 text-slate-200 hover:bg-slate-600 hover:shadow-sm'}`}
							on:click={() => {
								fetch('/logout', { method: 'POST' }).then(() => (window.location.href = '/login'));
							}}
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</header>

		<!-- PAGE CONTENT -->
		<main class="p-4 sm:p-6 space-y-8">
			<slot />
		</main>
	</div>
</div>
<script lang="ts">
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import smoolLogo from '$lib/assets/SmOol-removebg-preview.png';

	let theme: 'light' | 'dark' = 'light';
	let mobileMenuOpen = false;

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

	function normalizePath(path: string) {
		return path.toLowerCase().replace(/\/+$/, '') || '/';
	}

	function isActive(path: string) {
		return normalizePath($page.url.pathname) === normalizePath(path);
	}

	async function handleNavigate(path: string) {
		mobileMenuOpen = false;
		await goto(path);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- 🌌 Global Animated Background -->
<div class="fixed inset-0 -z-10 bg-animated"></div>
<div class="orb orb-1"></div>
<div class="orb orb-2"></div>
<div class="orb orb-3"></div>

<!-- ================= NAVBAR ================= -->
<nav class="sticky top-0 z-50 border-b border-black/15 backdrop-blur dark:border-white/10">
	<div class="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6">
		<!-- Logo -->
		<a href="/" class="flex items-center ml-8 transition hover:opacity-90">
			<img
				src={smoolLogo}
				alt="SmOol logo"
				class="h-10 w-auto sm:h-12 md:h-12"
			/>
		</a>

		<!-- Desktop Nav Links -->
		<div class="hidden items-center gap-8 font-medium lg:flex xl:gap-16 text-medium">
			<a
				href="/how-it-works"
				class={`transition ${
					isActive('/how-it-works')
						? 'font-semibold text-blue-500 dark:text-blue-400'
						: 'text-gray-800 hover:text-blue-500 dark:text-white dark:hover:text-blue-400'
				}`}
			>
				How it Works
			</a>

			<a
				href="/features"
				class={`transition ${
					isActive('/features')
						? 'font-semibold text-blue-500 dark:text-blue-400'
						: 'text-gray-800 hover:text-blue-500 dark:text-white dark:hover:text-blue-400'
				}`}
			>
				Features
			</a>

			<a
				href="/FAQ"
				class={`transition ${
					isActive('/FAQ')
						? 'font-semibold text-blue-500 dark:text-blue-400'
						: 'text-gray-800 hover:text-blue-500 dark:text-white dark:hover:text-blue-400'
				}`}
			>
				FAQ
			</a>

			<a
				href="/about"
				class={`transition ${
					isActive('/about')
						? 'font-semibold text-blue-500 dark:text-blue-400'
						: 'text-gray-800 hover:text-blue-500 dark:text-white dark:hover:text-blue-400'
				}`}
			>
				About
			</a>
		</div>

		<!-- Right Actions -->
		<div class="flex items-center gap-2 sm:gap-3">
			<!-- Desktop Sign Up -->
			<a
				href="/signup"
				class="hidden rounded-lg border border-gray-900 px-5 py-2 text-sm font-medium text-gray-800 transition hover:bg-slate-400/30 dark:border-white/30 dark:text-white dark:hover:bg-white/10 md:inline-flex"
			>
				Sign Up
			</a>

			<!-- Desktop Login -->
			<a
				href="/login"
				class="hidden rounded-lg border border-gray-900 px-5 py-2 text-sm font-medium text-gray-800 transition hover:bg-slate-400/30 dark:border-white/30 dark:text-white dark:hover:bg-white/10 md:inline-flex"
			>
				Login
			</a>

			<!-- Theme Toggle -->
			<button
				type="button"
				aria-label="Toggle theme"
				title="Toggle Theme"
				on:click={toggleTheme}
				class="rounded-lg p-2 text-gray-800 transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
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
						<path d="M12 2v2" />
						<path d="M12 20v2" />
						<path d="m4.93 4.93 1.41 1.41" />
						<path d="m17.66 17.66 1.41 1.41" />
						<path d="M2 12h2" />
						<path d="M20 12h2" />
						<path d="m6.34 17.66-1.41 1.41" />
						<path d="m19.07 4.93-1.41 1.41" />
					</svg>
				{/if}
			</button>

			<!-- Mobile Menu Button -->
			<button
				class="rounded-lg p-2 text-xl text-gray-800 transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10 lg:hidden"
				aria-label="Open menu"
				on:click={() => (mobileMenuOpen = true)}
			>
				☰
			</button>
		</div>
	</div>
</nav>

{#if mobileMenuOpen}
	<!-- Overlay -->
	<button
		class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
		aria-label="Close menu overlay"
		on:click={() => (mobileMenuOpen = false)}
	></button>

	<!-- Drawer -->
	<div
		class="fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm translate-x-0 bg-white p-6 shadow-2xl transition-transform duration-300 dark:bg-slate-900 lg:hidden"
	>
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
			<button
				aria-label="Close menu"
				class="rounded-lg p-2 text-xl text-gray-900 transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
				on:click={() => (mobileMenuOpen = false)}
			>
				✕
			</button>
		</div>

		<div class="space-y-2 text-base font-medium text-gray-800 dark:text-white">
			<button
				on:click={() => handleNavigate('/how-it-works')}
				class={`block w-full rounded-lg px-3 py-3 text-left transition ${
					isActive('/how-it-works')
						? 'bg-blue-50 font-semibold text-blue-500 dark:bg-white/5 dark:text-blue-400'
						: 'hover:bg-black/5 dark:hover:bg-white/5'
				}`}
			>
				How it Works
			</button>

			<button
				on:click={() => handleNavigate('/features')}
				class={`block w-full rounded-lg px-3 py-3 text-left transition ${
					isActive('/features')
						? 'bg-blue-50 font-semibold text-blue-500 dark:bg-white/5 dark:text-blue-400'
						: 'hover:bg-black/5 dark:hover:bg-white/5'
				}`}
			>
				Features
			</button>

			<button
				on:click={() => handleNavigate('/FAQ')}
				class={`block w-full rounded-lg px-3 py-3 text-left transition ${
					isActive('/FAQ')
						? 'bg-blue-50 font-semibold text-blue-500 dark:bg-white/5 dark:text-blue-400'
						: 'hover:bg-black/5 dark:hover:bg-white/5'
				}`}
			>
				FAQ
			</button>

			<button
				on:click={() => handleNavigate('/about')}
				class={`block w-full rounded-lg px-3 py-3 text-left transition ${
					isActive('/about')
						? 'bg-blue-50 font-semibold text-blue-500 dark:bg-white/5 dark:text-blue-400'
						: 'hover:bg-black/5 dark:hover:bg-white/5'
				}`}
			>
				About
			</button>
		</div>

		<div class="mt-8 grid grid-cols-2 gap-3">
			<a
				href="/signup"
				class="inline-flex items-center justify-center rounded-lg border border-gray-900 px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-slate-400/30 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
			>
				Sign Up
			</a>

			<a
				href="/login"
				class="inline-flex items-center justify-center rounded-lg border border-gray-900 px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-slate-400/30 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
			>
				Login
			</a>
		</div>
	</div>
{/if}

<!-- ================= END NAVBAR ================= -->

<slot />

<style>
	/* 🌌 Animated Gradient Background */
	.bg-animated {
		background: linear-gradient(120deg, #0f172a, #020617, #1e293b, #020617);
		background-size: 300% 300%;
		animation: gradientMove 18s ease infinite;
	}

	:global(html:not(.dark)) .bg-animated {
		background: linear-gradient(120deg, #e0f2fe, #f8fafc, #e0e7ff, #f8fafc);
	}

	@keyframes gradientMove {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	/* ✨ Floating Orbs */
	.orb {
		position: fixed;
		width: clamp(180px, 30vw, 420px);
		height: clamp(180px, 30vw, 420px);
		border-radius: 9999px;
		filter: blur(100px);
		opacity: 0.45;
		animation: float 20s ease-in-out infinite;
		z-index: -5;
		pointer-events: none;
	}

	.orb-1 {
		background: #3b82f6;
		top: 10%;
		left: 5%;
	}

	.orb-2 {
		background: #8b5cf6;
		top: 50%;
		right: 10%;
		animation-delay: 4s;
	}

	.orb-3 {
		background: #22c55e;
		bottom: 10%;
		left: 40%;
		animation-delay: 8s;
	}

	@keyframes float {
		0% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(40px, -60px);
		}
		100% {
			transform: translate(0, 0);
		}
	}

	@media (max-width: 640px) {
		.orb {
			filter: blur(80px);
			opacity: 0.35;
		}
	}
</style>
<script lang="ts">
	import { ShieldCheck, MapPin, Zap } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let show = false;

	onMount(() => {
		show = true;
	});

	const features = [
		{
			icon: ShieldCheck,
			title: 'Free Issue Reporting',
			description: 'Report maintenance issues at no cost.'
		},
		{
			icon: MapPin,
			title: 'Auto Location Capture',
			description: 'Automatic GPS tagging for more accurate issue reporting.'
		},
		{
			icon: Zap,
			title: 'Faster Response Time',
			description: 'Issues are routed instantly to the maintenance team for quicker action.'
		}
	];
</script>

<main
	class="relative min-h-screen text-gray-900 transition-all duration-700 ease-out dark:text-gray-100"
	class:opacity-0={!show}
	class:translate-y-6={!show}
	class:opacity-100={show}
	class:translate-y-0={show}
>
	<!-- Hero Section -->
	<section
		class="px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-28"
	>
		<div class="mx-auto max-w-6xl">
			<div class="mx-auto max-w-3xl text-center">
				<div
					class="transition-all duration-700 delay-100 ease-out"
					class:opacity-0={!show}
					class:translate-y-6={!show}
					class:opacity-100={show}
					class:translate-y-0={show}
				>
					<h1
						class="mx-auto max-w-[12ch] text-balance text-4xl font-extrabold leading-tight tracking-tight sm:max-w-[14ch] sm:text-5xl md:max-w-3xl md:text-6xl"
					>
						Smart School Maintenance Reporting
					</h1>

					<p
						class="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-gray-600 dark:text-gray-300 sm:mt-6 sm:text-lg sm:leading-8"
					>
						Report issues, attach photos, and automatically capture location for faster
						maintenance response.
					</p>

					<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
						<a
							href="/login"
							class="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 sm:text-base"
						>
							Get Started
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Why Choose Section -->
	<section
		class="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24"
	>
		<div class="mx-auto max-w-6xl">
			<div
				class="transition-all duration-700 delay-200 ease-out"
				class:opacity-0={!show}
				class:translate-y-6={!show}
				class:opacity-100={show}
				class:translate-y-0={show}
			>
				<div class="mx-auto max-w-3xl text-center">
					<p class="text-sm font-semibold uppercase tracking-[0.22em] text-blue-500">
						Why choose us
					</p>

					<h2
						class="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl"
					>
						Why Choose Smart School Maintenance?
					</h2>

					<p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
						Built to make school maintenance reporting simple, accurate, and fast for everyone.
					</p>
				</div>

				<div class="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-3">
					{#each features as feature}
						<svelte:component
							this={feature.icon}
							size={28}
							strokeWidth={2}
							class="text-blue-500"
						/>
						<div class="sr-only">{feature.title}</div>
					{/each}
				</div>

				<div class="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-3">
					{#each features as feature}
						<div
							class="group rounded-2xl border border-black/10 bg-white/50 p-5 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5 sm:p-6"
						>
							<div class="flex items-start gap-4">
								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20"
								>
									<svelte:component
										this={feature.icon}
										size={24}
										strokeWidth={2}
										class="text-blue-500"
									/>
								</div>

								<div class="min-w-0">
									<h3 class="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
										{feature.title}
									</h3>
									<p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
										{feature.description}
									</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<div class="px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl">
			<div class="h-px w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
		</div>
	</div>

	<footer class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400 sm:px-6 sm:py-8 sm:text-base lg:px-8">
		© {new Date().getFullYear()} Smart School Maintenance. All rights reserved.
	</footer>
</main>
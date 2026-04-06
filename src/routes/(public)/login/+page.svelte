<script lang="ts">
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';
	let showPassword = false;

	function handlePasswordInput(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		password = target.value;
	}

	async function handleLogin() {
		error = '';

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await res.json();

			if (!res.ok) {
				error = data?.message || 'Login failed';
				return;
			}

			if (data.requiresOTP) {
				goto('/verify');
				return;
			}

			const roleRoutes: Record<string, string> = {
				student: '/dashboard/student',
				professor: '/dashboard/professor',
				admin: '/dashboard/admin'
			};

			const destination = roleRoutes[data.role];

			if (destination) {
				goto(destination);
			} else {
				error = 'Unknown role';
			}
		} catch (err) {
			console.error(err);
			error = 'Server error';
		}
	}
</script>

<div class="h-screen flex items-center justify-center bg-animated px-4 overflow-hidden">
	<div
		class="w-full max-w-[380px] rounded-xl shadow-2xl p-6 sm:p-8 mx-auto -translate-y-9 backdrop-blur-lg bg-blue-50/85 border border-blue-200 text-slate-900 dark:bg-slate-900/70 dark:border-white/10 dark:text-white"
	>
		<h1 class="text-2xl font-bold text-center">Smart School Maintenance</h1>
		<p class="text-sm text-center text-slate-600 dark:text-slate-400 mb-6">
			Login to your account
		</p>

		{#if error}
			<p class="text-red-500 text-sm mb-2">{error}</p>
		{/if}

		<form class="space-y-4" on:submit|preventDefault={handleLogin}>
			<div>
				<label for="email" class="block text-sm mb-1">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="Enter your email"
					class="w-full rounded-md bg-white dark:bg-slate-800 border border-black dark:border-slate-600 text-slate-900 dark:text-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm mb-1">Password</label>
				<div class="relative">
					<input
						id="password"
						type={showPassword ? 'text' : 'password'}
						value={password}
						on:input={handlePasswordInput}
						placeholder="Enter your password"
						class="w-full rounded-md bg-white dark:bg-slate-800 border border-black dark:border-slate-600 text-slate-900 dark:text-white px-3 py-2 pr-10 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
					/>

					<button
						type="button"
						on:click={() => (showPassword = !showPassword)}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						class="absolute inset-y-0 right-2 flex items-center text-slate-500 hover:text-blue-600"
					>
						{#if showPassword}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7a10.05 10.05 0 012.223-3.592M6.223 6.223A9.956 9.956 0 0112 5c5 0 9 4 10 7a9.956 9.956 0 01-4.223 4.777M15 12a3 3 0 00-4.243-2.829M3 3l18 18"
								/>
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.938 0C21.5 16 17.523 19 12 19S2.5 16 1.062 12C2.5 8 6.477 5 12 5s9.5 3 10.938 7z"
								/>
							</svg>
						{/if}
					</button>
				</div>
			</div>

			<button
				type="submit"
				class="w-full mt-4 py-2 rounded-md font-semibold bg-blue-700 hover:bg-blue-800 text-white transition"
			>
				Login
			</button>
		</form>

		<div class="flex items-center my-4">
			<div class="flex-grow border-t border-slate-400/50"></div>
			<span class="mx-2 text-xs text-slate-500 dark:text-slate-400">OR</span>
			<div class="flex-grow border-t border-slate-400/50"></div>
		</div>

		<div class="flex justify-center items-center gap-8 mb-4">
			<button
				type="button"
				aria-label="Continue with GitHub"
				title="Continue with GitHub"
				class="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-black dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
			>
				<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.38
						.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06
						-3.34.73-4.04-1.61-4.04-1.61
						-.55-1.4-1.34-1.77-1.34-1.77
						-1.09-.74.08-.73.08-.73
						1.2.08 1.83 1.23 1.83 1.23
						1.07 1.83 2.8 1.3 3.49.99
						.11-.78.42-1.3.76-1.6
						-2.66-.3-5.46-1.33-5.46-5.93
						0-1.31.47-2.38 1.23-3.22
						-.12-.3-.53-1.52.12-3.17
						0 0 1-.32 3.3 1.23
						.96-.27 1.98-.4 3-.4
						s2.04.13 3 .4
						c2.3-1.55 3.3-1.23 3.3-1.23
						.65 1.65.24 2.87.12 3.17
						.77.84 1.23 1.91 1.23 3.22
						0 4.61-2.8 5.62-5.47 5.92
						.43.37.81 1.1.81 2.22
						0 1.6-.02 2.88-.02 3.27
						0 .32.22.7.83.58
						C20.56 21.8 24 17.3 24 12
						24 5.37 18.63 0 12 0z"
					/>
				</svg>
			</button>

			<button
				type="button"
				aria-label="Continue with Facebook"
				title="Continue with Facebook"
				class="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-black dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
			>
				<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.29h3.128V8.41c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.462.099 2.793.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.416h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"
					/>
				</svg>
			</button>

			<button
				type="button"
				aria-label="Continue with Google"
				title="Continue with Google"
				class="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-black dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
			>
				<svg class="w-6 h-6" viewBox="0 0 48 48">
					<path
						fill="#FFC107"
						d="M43.6 20.1H24v8h11.3C33.7 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"
					/>
					<path
						fill="#FF3D00"
						d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
					/>
					<path
						fill="#4CAF50"
						d="M24 44c5.1 0 9.8-1.9 13.3-5.1l-6.1-5.2C29.2 36 26.7 37 24 37c-5.2 0-9.6-3.4-11.2-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"
					/>
					<path
						fill="#1976D2"
						d="M43.6 20.1H24v8h11.3c-.8 2.3-2.4 4.3-4.6 5.7l6.1 5.2C39.6 35.7 44 30.4 44 24c0-1.3-.1-2.7-.4-3.9z"
					/>
				</svg>
			</button>
		</div>

		<p class="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
			Don't have an account?
			<a href="/signup" class="text-blue-700 dark:text-blue-400 hover:underline">Sign Up</a>
		</p>
	</div>
</div>
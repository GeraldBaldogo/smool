<script lang="ts">
import {
    onMount
} from 'svelte';

let username = '';
let email = '';
let password = '';
let confirmPassword = '';
let role = 'student';

let departments: {
    id: string;name: string
} [] = [];
let department_id = '';
let error = '';
let adminExists = false;

onMount(async () => {
    error = '';
    try {
        const deptRes = await fetch('/api/departments');
        const deptData = await deptRes.json();
        if (!deptRes.ok) {
            throw new Error(deptData.message || 'Failed to fetch departments');
        }
        departments = deptData;
    } catch (err) {
        console.error('Departments error:', err);
        error = 'Failed to load departments';
    }
    try {
        const adminRes = await fetch('/api/auth/admin-exists');
        const adminData = await adminRes.json();

        if (!adminRes.ok) {
            throw new Error(adminData.message || 'Failed to fetch admin status');
        }
        adminExists = adminData.exists;
        if (adminExists && role === 'admin') {
            role = 'student';
        }
    } catch (err) {
        console.error('Admin exists error:', err);
    }
});

async function handleSignup() {
    error = '';

    if (!username || !email || !password || !confirmPassword) {
        error = 'All fields are required';
        return;
    }

    if (password !== confirmPassword) {
        error = 'Passwords do not match';
        return;
    }

    if (role === 'admin' && adminExists) {
        error = 'An admin account already exists. Only one admin is allowed.';
        return;
    }

    if (role !== 'admin' && !department_id) {
        error = 'Please select a department';
        return;
    }

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_name: username,
                email,
                password,
                role,
                department_id: role === 'admin' ? null : department_id
            })
        });

        const data = await res.json();

        if (!res.ok) {
            error = data.message || 'Signup failed';
            return;
        }

        alert('Signup successful!');
        error = '';
        username = '';
        email = '';
        password = '';
        confirmPassword = '';
        role = 'student';
        department_id = '';
    } catch (err) {
        console.error('Signup error:', err);
        error = 'Server error';
    }
}
</script>

<div class="min-h-screen flex items-start justify-center bg-animated px-4">
    <div
        class="
        w-full max-w-[380px]
        rounded-xl shadow-2xl
        p-6 sm:p-8
        mt-10 mx-auto
        backdrop-blur-lg
        bg-blue-50/85
        border border-blue-200
        text-slate-900
        dark:bg-slate-900/70
        dark:border-white/10
        dark:text-white
        "
        >
        <h1 class="text-2xl font-bold text-center">
            Smart Maintenance
        </h1>

        <p class="text-sm text-center text-slate-600 dark:text-slate-400 mb-6">
            Create an account
        </p>

        {#if error}
        <p class="mb-4 text-sm text-red-600 dark:text-red-400 text-center">
            {error}
        </p>
        {/if}

        <form class="space-y-4" on:submit|preventDefault={handleSignup}>
            <div>
                <div class="block text-sm mb-1">Full Name</div>
                <input
                    type="text"
                    bind:value={username}
                    placeholder="Enter your name"
                    class="w-full rounded-md bg-white dark:bg-slate-800 border border-black dark:border-slate-600
                    text-slate-900 dark:text-white px-3 py-2 text-sm outline-none
                    focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                    />
            </div>

            <div>
                <div class="block text-sm mb-1">Email</div>
                <input
                    type="email"
                    bind:value={email}
                    placeholder="Enter your email"
                    class="w-full rounded-md bg-white dark:bg-slate-800 border border-black dark:border-slate-600
                    text-slate-900 dark:text-white px-3 py-2 text-sm outline-none
                    focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                    />
            </div>

            <div>
                <div class="block text-sm mb-1">Password</div>
                <input
                    type="password"
                    bind:value={password}
                    placeholder="Enter your password"
                    class="w-full rounded-md bg-white dark:bg-slate-800 border border-black dark:border-slate-600
                    text-slate-900 dark:text-white px-3 py-2 text-sm outline-none
                    focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                    />
            </div>

            <div>
                <div class="block text-sm mb-1">Confirm Password</div>
                <input
                    type="password"
                    bind:value={confirmPassword}
                    placeholder="Re-enter password"
                    class="w-full rounded-md bg-white dark:bg-slate-800 border border-black dark:border-slate-600
                    text-slate-900 dark:text-white px-3 py-2 text-sm outline-none
                    focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                    />
            </div>

            {#if role !== "admin"}
            <div>
                <div class="block text-sm mb-1">Department</div>
                <select
                    bind:value={department_id}
                    class="w-full rounded-md bg-white dark:bg-slate-800 border border-black dark:border-slate-600
                    text-slate-900 dark:text-white px-3 py-2 text-sm outline-none
                    focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                    >
                    <option value="" disabled>Select Department</option>
                    {#each departments as dept}
                    <option value={dept.id}>{dept.name}</option>
                    {/each}
                </select>
            </div>
            {/if}

            <div>
                <div class="block text-sm mb-1">Role</div>
                <select
                    bind:value={role}
                    class="w-full rounded-md bg-white dark:bg-slate-800 border border-black dark:border-slate-600
                    text-slate-900 dark:text-white px-3 py-2 text-sm outline-none
                    focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                    >
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                    <option value="admin" disabled={adminExists}>
                        {adminExists ? 'Admin (Only one admin allowed)' : 'Admin'}
                    </option>
                </select>
            </div>

            <button
                type="submit"
                class="w-full mt-4 py-2 rounded-md font-semibold bg-blue-700 hover:bg-blue-800 text-white transition"
                >
                Sign Up
            </button>
        </form>

        <div class="flex items-center my-4">
            <div class="flex-grow border-t border-slate-400/50"></div>
            <span class="mx-2 text-xs text-slate-500 dark:text-slate-400">
                OR
            </span>
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
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.38
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
                        24 5.37 18.63 0 12 0z"/>
                        </svg>
                        </button>

                        <button
                            type="button"
                            aria-label="Continue with Facebook"
                            title="Continue with Facebook"
                            class="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-black dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.29h3.128V8.41c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.462.099 2.793.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.416h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
                                    </svg>
                                    </button>

                                    <button
                                        type="button"
                                        aria-label="Continue with Google"
                                        title="Continue with Google"
                                        class="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-black dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                        >
                                        <svg class="w-6 h-6" viewBox="0 0 48 48">
                                            <path fill="#FFC107" d="M43.6 20.1H24v8h11.3C33.7 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
                                                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"/>
                                                    <path fill="#4CAF50" d="M24 44c5.1 0 9.8-1.9 13.3-5.1l-6.1-5.2C29.2 36 26.7 37 24 37c-5.2 0-9.6-3.4-11.2-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                                                        <path fill="#1976D2" d="M43.6 20.1H24v8h11.3c-.8 2.3-2.4 4.3-4.6 5.7l6.1 5.2C39.6 35.7 44 30.4 44 24c0-1.3-.1-2.7-.4-3.9z"/>
                                                            </svg>
                                                            </button>
                                                            </div>

                                                            <p class="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
                                                                Already have an account?
                                                                <a href="/login" class="text-blue-700 dark:text-blue-400 hover:underline">Login</a>
                                                            </p>
                                                            </div>
                                                            </div>

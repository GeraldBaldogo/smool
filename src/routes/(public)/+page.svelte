<script lang="ts">
import {
    ShieldCheck,
    MapPin,
    Zap
} from "lucide-svelte";
import { onMount } from 'svelte';

let show = false;

onMount(() => {
    show = true;
});
</script>

<main class="relative min-h-screen overflow-hidden text-gray-900 dark:text-gray-100 
    transition-all duration-900 ease-in-out"
    class:opacity-0={!show}
    class:translate-y-10={!show}
    class:opacity-100={show}
    class:translate-y-0={show}
>

    <!-- Animated Background -->
    <div class="absolute inset-0 -z-10 bg-animated"></div>

    <!-- Floating Orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center text-center px-6 py-20 md:py-32
    transition-all duration-700 delay-400"
    class:opacity-0={!show}
    class:translate-y-10={!show}
    class:opacity-100={show}
    class:translate-y-0={show}>
        <h1 class="mx-auto max-w-[12ch] sm:max-w-2xl text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Smart School Maintenance Reporting
        </h1>

        <p class="mx-auto max-w-xl text-base sm:text-lg leading-7 text-gray-600 dark:text-gray-300 mb-8">
            Report issues, attach photos, and automatically capture location
            for faster maintenance response.
        </p>

        <div class="flex flex-col sm:flex-row gap-4">
            <a
                href="/login"
                class="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                Get Started
            </a>

            <!-- <a
                href="/login"
                class="px-6 py-3 rounded-lg border border-gray-600 dark:border-gray-800 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-800 transition"
                >
                Admin Login
            </a> -->
        </div>
    </section>

    <!-- WHY CHOOSE SMART MAINTENANCE -->
    <section class="px-6 pb-20 pt-0
    transition-all duration-700"
    class:opacity-0={!show}
    class:translate-y-10={!show}
    class:opacity-100={show}
    class:translate-y-0={show}>
        <div class="max-w-5xl mx-auto">

            <!-- Section Heading -->
            <h3 class="mx-auto max-w-xs sm:max-w-2xl text-center text-3xl md:text-4xl font-extrabold leading-tight mb-16">
                <span class="block">Why Choose</span>
                <span class="tumble-text block mt-2">
                    {#each "Smart School Maintenance".split("") as char, i}
                        <span
                            class="tumble-char"
                            style="animation-delay: {i * 0.12}s"
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    {/each}
                </span>
                <span class="block">?</span>
            </h3>

            <!-- VALUE STATS (PLAIN / PROFILE-STYLE) -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center sm:text-left">

                <!-- Item 1 -->
                <div class="flex items-start gap-4">
                    <div class="text-blue-500">
                        <ShieldCheck size={32} strokeWidth={2} />
                    </div>
                    <div>
                        <h4 class="font-semibold text-lg">
                            Free Issue Reporting
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Report maintenance issues at no cost
                        </p>
                    </div>
                </div>

                <!-- Item 2 -->
                <div class="flex items-start gap-4">
                    <div class="text-blue-500">
                        <MapPin size={32} strokeWidth={2} />
                    </div>
                    <div>
                        <h4 class="font-semibold text-lg">
                            Auto Location Capture
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Automatic GPS tagging for accuracy
                        </p>
                    </div>
                </div>

                <!-- Item 3 -->
                <div class="flex items-start gap-4">
                    <div class="text-blue-500">
                        <Zap size={32} strokeWidth={2} />
                    </div>
                    <div>
                        <h4 class="font-semibold text-lg">
                            Faster Response Time
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Issues routed instantly to maintenance team
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Footer -->
    <div class="my-1 flex justify-center">
        <div class="h-px w-5/6 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </div>
    <footer class="text-center py-6 text-large text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Smart School Maintenance. All rights reserved.
    </footer>
</main>

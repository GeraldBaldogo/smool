<script lang="ts">
import { onMount } from 'svelte';
import { AlertTriangle, Laptop, MapPin, Zap, School, User } from "lucide-svelte";

let theme: 'light' | 'dark' = 'light';

onMount(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) theme = saved;
    applyTheme();
});

function applyTheme() {
    document.documentElement.classList.toggle('dark', theme === 'dark');
}
</script>

<main class="relative min-h-screen px-6 py-20 text-gray-900 dark:text-gray-100">

<div class="absolute inset-0 -z-10 bg-animated"></div>

<!-- Header -->
<section class="max-w-4xl mx-auto text-center mb-20">
    <h1 class="text-4xl md:text-5xl font-extrabold mb-4">
        About Smart School Maintenance
    </h1>

    <p class="text-lg text-gray-600 dark:text-gray-400">
        A modern intelligent platform designed to simplify maintenance reporting and improve response efficiency.
    </p>
</section>

<!-- Problem -->
<section class="max-w-5xl mx-auto mb-20">

    <div class="p-6 rounded-xl backdrop-blur bg-white/10 dark:bg-black/20 border border-white/20 transition">

        <div class="flex items-center gap-3 mb-4">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                The Problem
            </h2>
        </div>

        <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            Traditional maintenance reporting is often slow, unorganized, and lacks proper documentation.
            Issues are reported verbally or through paper forms, leading to delays, lost reports, and inefficient responses.
        </p>

    </div>

</section>

<!-- Solution -->
<section class="max-w-5xl mx-auto mb-20 p-6 rounded-xl backdrop-blur bg-white/10 dark:bg-black/20 border border-white/20">

    <h2 class="text-3xl font-bold mb-8 flex items-center gap-3">
        Our Solution
    </h2>

    <div class="grid md:grid-cols-3 gap-6">

        <div class="p-6 rounded-xl backdrop-blur bg-white/5 dark:bg-black/30 border border-white/20 hover:-translate-y-2 transition">
            <MapPin class="text-blue-500 mb-3" size={32}/>
            <h3 class="text-xl font-semibold mb-3">Accurate Details</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
                Automatic location capture and photo attachments improve report verification.
            </p>
        </div>

        <div class="p-6 rounded-xl backdrop-blur bg-white/5 dark:bg-black/30 border border-white/20 hover:-translate-y-2 transition">
            <Zap class="text-blue-500 mb-3" size={32}/>
            <h3 class="text-xl font-semibold mb-3">Faster Response</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
                Maintenance teams receive reports instantly for quick action.
            </p>
        </div>

        <div class="p-6 rounded-xl backdrop-blur bg-white/5 dark:bg-black/30 border border-white/20 hover:-translate-y-2 transition">
            <Laptop class="text-blue-500 mb-3" size={32}/>
            <h3 class="text-xl font-semibold mb-3">Digital Reporting</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
                Submit maintenance requests anytime using the online system.
            </p>
        </div>

    </div>

</section>

<!-- Who is it for -->
<section class="max-w-5xl mx-auto p-6 rounded-xl backdrop-blur bg-white/10 dark:bg-black/20 border border-white/20">

    <h2 class="text-3xl font-bold mb-8 flex items-center gap-3">
        Who Is It For?
    </h2>

    <div class="grid md:grid-cols-2 gap-6">

        <div class="flex flex-col items-center p-6 rounded-xl backdrop-blur bg-white/5 dark:bg-black/30 border border-white/20 hover:-translate-y-1 transition">
            <User size={32} class="mb-3 text-blue-500"/>
            <h3 class="text-xl font-semibold mb-2">Students</h3>
            <p class="text-sm text-center text-gray-600 dark:text-gray-300">
                Students can report maintenance issues within the campus such as classroom facilities, equipment damage, and other concerns.
            </p>
        </div>

        <div class="flex flex-col items-center p-6 rounded-xl backdrop-blur bg-white/5 dark:bg-black/30 border border-white/20 hover:-translate-y-1 transition">
            <School size={32} class="mb-3 text-blue-500"/>
            <h3 class="text-xl font-semibold mb-2">Professors</h3>
            <p class="text-sm text-center text-gray-600 dark:text-gray-300">
                Professors can verify submitted maintenance reports to help ensure accuracy and prevent false reporting.
            </p>
        </div>

    </div>

</section>

</main>
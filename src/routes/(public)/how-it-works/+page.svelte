<script lang="ts">
import { onMount } from "svelte";
import { PenSquare, School, UserCog, CheckCircle } from "lucide-svelte";

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

<main class="relative min-h-screen px-6 py-20 text-gray-900 dark:text-gray-100 overflow-hidden">

    <!-- Background -->
    <div class="absolute inset-0 -z-10 bg-animated"></div>

    <!-- Header -->
    <section class="max-w-4xl mx-auto text-center mb-20">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">
            How Smart School Maintenance Works
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
            A verified step-by-step process to ensure only legitimate maintenance issues are addressed.
        </p>
    </section>

    <!-- Steps -->
    <section class="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">

        {#each [
            {
                icon: PenSquare,
                title: "Student Submission",
                desc: "Students submit a maintenance request describing the issue and its location."
            },
            {
                icon: UserCog,
                title: "Professor Review",
                desc: "Professors review and verify the report to confirm its validity and prevent false reports."
            },
            {
                icon: School,
                title: "Admin Processing",
                desc: "Approved reports are forwarded to the admin for maintenance action."
            },
            {
                icon: CheckCircle,
                title: "Completion Report",
                desc: "The admin fixes the issue and submits a report confirming that the problem has been resolved."
            }
        ] as step}

        <div class="group relative p-6 rounded-xl backdrop-blur bg-white/10 dark:bg-black/20 
            border border-white/20 hover:-translate-y-2 transition overflow-hidden">

            <svelte:component this={step.icon} size={36}
                class="mb-4 text-blue-500 transition group-hover:scale-110" />

            <h3 class="text-xl font-semibold mb-2">
                Step {#if step.title === "Student Submission"}1{/if}
                {#if step.title === "Professor Review"}2{/if}
                {#if step.title === "Admin Processing"}3{/if}
                {#if step.title === "Completion Report"}4{/if}
                : {step.title}
            </h3>

            <p class="text-gray-600 dark:text-gray-300 text-sm">
                {step.desc}
            </p>

            <!-- Glow Hover Effect -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition
                bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none">
            </div>

        </div>

        {/each}

    </section>

    <!-- CTA -->
    <section class="text-center mt-[60px]">
        <a href="/login"
            class="inline-block px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition hover:shadow-xl">
            Report an Issue Now
        </a>
    </section>

</main>
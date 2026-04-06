<script lang="ts">
let faqs = [
    { question: "How do I submit a maintenance request?", answer: "You can submit a maintenance request by logging in and filling out the request form in the dashboard under the report issue.", open: false },
    { question: "Who can view my request?", answer: "All authorized users in the system can view your request.", open: false },
    { question: "Can I edit my request after submission?", answer: "No, once a request is submitted, you cannot edit it. Contact admin for changes.", open: false },
    { question: "How long does it take to resolve a request?", answer: "Resolution time may vary depending on staff availability. Requests are processed in the order they are received.", open: false },
    { question: "Can I cancel a request?", answer: "No, requests cannot be canceled once submitted. Please contact the administrator if you need assistance.", open: false },
    { question: "How do I change my account password?", answer: "Go to your profile settings and click on 'Change Password'.", open: false },
    { question: "Can I submit requests as a guest?", answer: "No, you must create an account and log in to submit a maintenance request.", open: false }
];

function toggleFAQ(index: number) {
    faqs = faqs.map((faq, i) =>
        i === index ? { ...faq, open: !faq.open } : faq
    );
}
</script>

<section class="max-w-5xl mx-auto px-6 py-20">

    <!-- Header -->
    <div class="text-center mb-14">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-gray-300">
            Frequently Asked Questions
        </h2>

        <p class="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about the Smart School Maintenance
        </p>
    </div>

    <!-- FAQ Accordion -->
    <div class="space-y-4">

        {#each faqs as faq, index}
        <div class="border border-white/20 rounded-xl overflow-hidden backdrop-blur bg-white/10 dark:bg-black/20 transition">

            <button
                on:click={() => toggleFAQ(index)}
                class="w-full flex justify-between items-center px-6 py-4 text-left font-semibold
                text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-800 transition">

                <span>{faq.question}</span>

                <svg
                    class="w-5 h-5 transition-transform duration-300 {faq.open ? 'rotate-180' : ''}"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">

                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 9l-7 7-7-7"/>
                </svg>

            </button>

            {#if faq.open}
            <div class="px-6 py-4 text-gray-600 dark:text-gray-300 bg-white/5 dark:bg-black/30 transition-all">
                {faq.answer}
            </div>
            {/if}

        </div>
        {/each}

    </div>
</section>
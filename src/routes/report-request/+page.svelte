<script lang="ts">
import { onMount } from "svelte";
import { writable } from "svelte/store";

let issueDescription = "";
let selectedFile: File | null = null;

let location: {
    lat: number | null;lng: number | null
} = {
    lat: null,
    lng: null
};

const locationError = writable("");

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile = target.files[0];
    }
}

onMount(() => {
    if (!navigator.geolocation) {
        locationError.set("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            location.lat = pos.coords.latitude;
            location.lng = pos.coords.longitude;
        },
        (err) => {
            locationError.set("Could not get location: " + err.message);
        }
    );
});

function submitRequest() {
    if (!issueDescription || !selectedFile || location.lat === null || location.lng === null) {
        alert("Please complete all fields and allow location access.");
        return;
    }

    console.log({
        issueDescription,
        selectedFile,
        location
    });

    alert("Maintenance request submitted!");

    issueDescription = "";
    selectedFile = null;
}
</script>

<main class="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 relative z-10">

    <!-- MAIN CONTENT -->
    <div class="flex flex-1 flex-col lg:flex-row items-center justify-center px-6 gap-12
         bg-white/70 dark:bg-gray-900/70
         backdrop-blur-xl rounded-2xl
         shadow-xl mx-4 my-8"
    >


        <!-- LEFT: SMART MAINTENANCE INFO -->
        <section class="max-w-lg">
            <h1 class="text-4xl font-extrabold mb-4 leading-tight">
                Smart Maintenance Reporting System
            </h1>

            <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Easily report maintenance issues with photos and automatic location tracking.
                Helping maintenance teams respond faster and more accurately.
            </p>

            <ul class="space-y-3 text-gray-700 dark:text-gray-300">
                <li>✔ Report issues in seconds</li>
                <li>✔ Attach photos for clarity</li>
                <li>✔ Automatic GPS location capture</li>
                <li>✔ Faster response from maintenance teams</li>
            </ul>
        </section>

        <!-- RIGHT: REPORT FORM -->
        <section class="w-full max-w-xl
         bg-white/80 dark:bg-gray-800/80
         backdrop-blur-lg
         rounded-xl shadow-lg p-6
         border border-white/20 dark:border-gray-700/40"
        >

            <h2 class="text-2xl font-bold mb-6 text-center">
                Report Maintenance Issue
            </h2>

            <!-- Issue Description -->
            <div class="mb-4">
                <label for="issue" class="block mb-1 font-semibold">
                    Issue Description
                </label>
                <textarea
                    id="issue"
                    class="w-full border rounded p-2 bg-white dark:bg-gray-900 dark:border-gray-600"
                    rows="4"
                    bind:value={issueDescription}
                    placeholder="Describe the issue..."
                    ></textarea>
            </div>

            <!-- Photo Upload -->
            <div class="mb-4">
                <label for="photo" class="block mb-1 font-semibold">
                    Upload Photo
                </label>
                <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    on:change={handleFileChange}
                    class="block w-full text-sm"
                    />
                {#if selectedFile}
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Selected file: {selectedFile.name}
                </p>
                {/if}
            </div>

            <!-- Location -->
            <div class="mb-6">
                <p class="block mb-1 font-semibold">Location</p>

                {#if $locationError}
                <p class="text-red-500 text-sm">{$locationError}</p>
                {:else if location.lat !== null && location.lng !== null}
                <p class="text-sm text-green-500">
                    📍 {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </p>
                {:else}
                <p class="text-sm text-gray-500">
                    Waiting for location access…
                </p>
                {/if}
            </div>

            <!-- Submit -->
            <button
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                on:click={submitRequest}
                >
                Submit Request
            </button>
        </section>
    </div>

    <!-- FOOTER -->
    <footer class="border-t border-gray-200 dark:border-gray-700 py-6 px-6 text-sm text-gray-600 dark:text-gray-400">
        <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <p class="font-semibold mb-1">System</p>
                <p>Report Issues</p>
                <p>Track Requests</p>
                <p>Admin Dashboard</p>
            </div>

            <div>
                <p class="font-semibold mb-1">Resources</p>
                <p>User Guide</p>
                <p>Maintenance Policies</p>
                <p>FAQs</p>
            </div>

            <div>
                <p class="font-semibold mb-1">About</p>
                <p>The Team</p>
                <p>Project Overview</p>
                <p>Contact</p>
            </div>

            <div>
                <p class="font-semibold mb-1">Legal</p>
                <p>Privacy Policy</p>
                <p>Terms of Service</p>
            </div>
        </div>
    </footer>

</main>

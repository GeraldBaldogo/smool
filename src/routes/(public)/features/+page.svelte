<script lang="ts">
import {
    Camera,
    MapPin,
    Zap,
    ClipboardList,
    Bell,
    BarChart3,
    Tags
} from "lucide-svelte";
</script>

<!-- FEATURES (ENHANCED) -->
<section class="px-6 pb-24 max-w-6xl mx-auto">

    <!-- Header -->
    <div class="max-w-4xl mx-auto text-center mb-16 mt-14">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-gray-300">
            Key Features
        </h2>

        <p class="text-lg text-gray-600 dark:text-gray-400">
            Smart School Maintenance provides intelligent reporting, real-time monitoring, and automated workflow processing to ensure efficient issue management.
        </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">

        <!-- Photo Upload -->
        <div class="group p-6 rounded-xl backdrop-blur bg-white/10 dark:bg-black/20
            border border-white/20 hover:-translate-y-2 transition">

            <Camera size={36} class="mb-4 text-blue-500" />

            <h4 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Photo Upload
            </h4>

            <p class="text-gray-600 dark:text-gray-300">
                Attach real images to clearly show the maintenance issue.
            </p>
        </div>

        <!-- Auto Location -->
        <div class="group p-6 rounded-xl backdrop-blur bg-white/10 dark:bg-black/20
            border border-white/20 hover:-translate-y-2 transition">

            <MapPin size={36} class="mb-4 text-blue-500" />

            <h4 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Auto Location
            </h4>

            <p class="text-gray-600 dark:text-gray-300">
                GPS location is automatically captured for accuracy.
            </p>
        </div>

        <!-- Fast Response -->
        <div class="group p-6 rounded-xl backdrop-blur bg-white/10 dark:bg-black/20
            border border-white/20 hover:-translate-y-2 transition">

            <Zap size={36} class="mb-4 text-blue-500" />

            <h4 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Fast Response
            </h4>

            <p class="text-gray-600 dark:text-gray-300">
                Maintenance teams are notified instantly.
            </p>
        </div>

        <!-- Issue Tracking -->
        <div class="group p-6 rounded-xl backdrop-blur bg-white/10 dark:bg-black/20
            border border-white/20 hover:-translate-y-2 transition">

            <ClipboardList size={36} class="mb-4 text-blue-500" />

            <h4 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Issue Tracking
            </h4>

            <p class="text-gray-600 dark:text-gray-300">
                Track report status from pending to resolved.
            </p>
        </div>

        <!-- Real-time Alerts -->
        <div class="group p-6 rounded-xl backdrop-blur bg-white/10 dark:bg-black/20
            border border-white/20 hover:-translate-y-2 transition">

            <Bell size={36} class="mb-4 text-blue-500" />

            <h4 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Real-time Alerts
            </h4>

            <p class="text-gray-600 dark:text-gray-300">
                Get notified when new issues are reported.
            </p>
        </div>

        <!-- Graph Visualization Dashboard -->
        <div class="group p-6 rounded-xl backdrop-blur bg-white/10 dark:bg-black/20
            border border-white/20 hover:-translate-y-2 transition">

            <BarChart3 size={36} class="mb-4 text-blue-500" />

            <h4 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Graph Visualization Dashboard
            </h4>

            <p class="text-gray-600 dark:text-gray-300">
                Monitor maintenance statistics using interactive charts.
            </p>
        </div>

        <!-- Choosing Categories Issue -->
        <div class="group p-6 rounded-xl backdrop-blur bg-white/10 dark:bg-black/20
            border border-white/20 hover:-translate-y-2 transition">

            <Tags size={36} class="mb-4 text-blue-500" />

            <h4 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Issue Category Selection
            </h4>

            <p class="text-gray-600 dark:text-gray-300">
                Choose commonly damaged categories for faster and smarter reporting.
            </p>
        </div>

    </div>
</section>
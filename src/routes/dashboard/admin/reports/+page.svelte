<script lang="ts">
    import { goto } from '$app/navigation';
    import { writable, derived } from 'svelte/store';

    type Report = {
        id: string;
        report_code?: string | null;
        name: string;
        issue: string;
        date: string;
        status: string;
    };

    export let data: {
        reports: Report[];
    };

    const reports = writable<Report[]>(data?.reports ?? []);
    const search = writable('');

    function normalizeStatus(status: string) {
        return status?.trim().toLowerCase();
    }

    function getStatusClasses(status: string) {
        const s = normalizeStatus(status);

        if (s === 'approved') {
            return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300';
        }

        if (s === 'in progress') {
            return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300';
        }

        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300';
    }

    const filteredReports = derived(
        [reports, search],
        ([$reports, $search]) => {
            return $reports
                .slice()
                .sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .filter((r) =>
                    r.name.toLowerCase().includes($search.toLowerCase()) ||
                    r.issue.toLowerCase().includes($search.toLowerCase())
                );
        }
    );
</script>

<div class="space-y-6">
    <div>
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white">
            Report Overview
        </h2>
        <p class="text-slate-500 text-sm">
            View approved and in progress maintenance reports.
        </p>
    </div>

    <div class="flex flex-col md:flex-row gap-4 md:justify-between">
        <input
            type="text"
            placeholder="Search by name or issue..."
            class="w-full md:w-96 px-4 py-2 rounded-xl border dark:bg-slate-800 dark:text-white border-slate-400 dark:border-slate-700"
            on:input={(e) => search.set(e.currentTarget.value)}
        />
    </div>

    <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur shadow rounded-2xl p-6 overflow-x-auto border border-slate-400 dark:border-slate-700">
        <table class="w-full text-left text-gray-800 dark:text-white">
            <thead>
                <tr class="text-slate-500 text-sm border-b border-slate-400 dark:border-white/30">
                    <th class="py-3">ID</th>
                    <th>Name</th>
                    <th>Issue</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>
                {#each $filteredReports as r}
                    <tr
                        class="border-b border-slate-400 dark:border-white/30 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                        on:click={() => goto(`/dashboard/admin/reports/${r.id}`)}
                    >
                        <td class="py-3">{r.report_code ?? r.id}</td>
                        <td>{r.name}</td>
                        <td>{r.issue}</td>
                        <td>{new Date(r.date).toLocaleDateString()}</td>
                        <td>
                            <span class={`px-3 py-1 text-xs rounded-full font-semibold border border-slate-400 dark:border-slate-700 ${getStatusClasses(r.status)}`}>
                                {r.status}
                            </span>
                        </td>
                    </tr>
                {/each}

                {#if $filteredReports.length === 0}
                    <tr>
                        <td colspan="5" class="text-center py-6 text-slate-500">
                            No approved or in progress reports found.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>
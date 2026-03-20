<script lang="ts">
import { onMount } from 'svelte';
import Chart from 'chart.js/auto';

export let data: {
    stats: Array<{ department: string; total: number }>;
};

let charts: Chart[] = [];

// PREDEFINED DEPARTMENTS (always visible)
const departments = [
    'College of Computer Studies',
    'College of Nursing',
    'College of Criminology',
    'College of Education and Liberal Arts',
    'College of Hospitality Management',
    'College of Physical Therapy',
    'College of Business and Accountancy'
];

function generateCharts() {
    charts.forEach(c => c.destroy());
    charts = [];

    const container = document.getElementById('charts');
    if (!container) return;

    container.innerHTML = '';

    departments.forEach(dept => {
        const wrapper = document.createElement('div');
        wrapper.className = 'p-4 bg-white dark:bg-slate-800 rounded-lg shadow';

        const title = document.createElement('h3');
        title.textContent = dept;
        title.className = 'font-semibold text-gray-800 dark:text-white mb-2';

        const canvas = document.createElement('canvas');

        wrapper.appendChild(title);
        wrapper.appendChild(canvas);
        container.appendChild(wrapper);

        // TRUE COUNT (0 if no data)
        const total = data.stats.find(s => s.department === dept)?.total || 0;

        const chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: [dept],
                datasets: [{
                    label: 'Total Reports',
                    data: [total],
                    backgroundColor: ['#3b82f6']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });

        charts.push(chart);
    });
}

onMount(() => {
    generateCharts();
});
</script>

<div class="space-y-4">
    <h2 class="text-3xl font-bold text-gray-800 dark:text-white">
        Department Reports
    </h2>

    <div id="charts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
</div>
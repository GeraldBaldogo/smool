<script lang="ts">
  import { goto } from '$app/navigation';

  export let username = 'Student';

  function logout() {
    localStorage.clear();
    goto('/login');
  }
</script>

<nav class="w-full bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
  <div class="font-semibold">
    Welcome, {username}
  </div>

  <div class="flex items-center gap-6">
    <a href="/student/report" class="hover:text-blue-400">Report Form</a>
    <a href="/student/reports" class="hover:text-blue-400">Your Reports</a>

    <button on:click={logout} class="hover:text-red-400">
      Logout
    </button>

    <button class="hover:text-gray-400">⚙️</button>
  </div>
</nav>

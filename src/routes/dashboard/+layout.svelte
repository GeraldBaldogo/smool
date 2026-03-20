<script lang="ts">
  import "../../app.css";
  import { onMount } from "svelte";
  
  // export let data;
  // const { user } = data;
  
  let theme: "light" | "dark" = "light";
  onMount(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) theme = saved;
    applyTheme();
  });

  function applyTheme() {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
</script>

<!-- 🌌 GLOBAL ANIMATED BACKGROUND -->
<div class="fixed inset-0 -z-10 bg-animated"></div>
<div class="orb orb-1"></div>
<div class="orb orb-2"></div>
<div class="orb orb-3"></div>

<!-- PAGE CONTENT -->
<div class="min-h-screen relative">
  <slot />
</div>

<style>
/* 🌌 Animated Gradient Background */
.bg-animated {
  background: linear-gradient(
    120deg,
    #0f172a,
    #020617,
    #1e293b,
    #020617
  );
  background-size: 300% 300%;
  animation: gradientMove 18s ease infinite;
}

/* Light mode background */
:global(html:not(.dark)) .bg-animated {
  background: linear-gradient(
    120deg,
    #e0f2fe,
    #f8fafc,
    #e0e7ff,
    #f8fafc
  );
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ✨ Floating Orbs */
.orb {
  position: fixed;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
  animation: float 20s ease-in-out infinite;
  z-index: -5;
}

.orb-1 {
  background: #3b82f6;
  top: 10%;
  left: 5%;
}

.orb-2 {
  background: #8b5cf6;
  top: 50%;
  right: 10%;
  animation-delay: 4s;
}

.orb-3 {
  background: #22c55e;
  bottom: 10%;
  left: 40%;
  animation-delay: 8s;
}

@keyframes float {
  0% { transform: translate(0, 0); }
  50% { transform: translate(40px, -60px); }
  100% { transform: translate(0, 0); }
}
</style>

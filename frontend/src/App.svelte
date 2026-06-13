<script lang="ts">
  import Router from 'svelte-spa-router';
  import { routes } from './router';
</script>

<main class="min-h-screen bg-gray-100 flex items-center justify-center">
  <Router {routes} />
</main>

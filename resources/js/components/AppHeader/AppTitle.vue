<script setup>
  import useApp from '@/composables/useApp.js';
  const app = useApp();

  defineProps({
    packages: {
      type: Array,
      default: () => [],
    },
  })
</script>

<template>
  <h1>
    <!-- Combine packages into comma separated string -->
    {{ app.state.packages.concat(packages).join(', ') }}
    <small>v.{{ app.state.version }}</small>
  </h1>
</template>

<style scoped>
  h1 {
    /* Dynamically adjust font based on screen width */
    font-size: clamp(1rem, 4cqi, 1.5rem);
  }

  small {
    /* Font size base on parent's font size */
    font-size: 70%;
    font-style: italic;
  }
</style>

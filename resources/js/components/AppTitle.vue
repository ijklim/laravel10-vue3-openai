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
    {{ app.info.packages.concat(packages).join(', ') }}
    <small>v.{{ app.info.version }}</small>
  </h1>
</template>

<style scoped>
  small {
    font-style: italic;
    font-size: 1rem;
  }
</style>

<script setup>
  import { packages, version } from '@/utilities/constants.js';

  defineProps({
    additionalPackages: {
      type: Array,
      default: () => [],
    },
  })
</script>

<template>
  <h1>
    <!-- Combine packages into comma separated string -->
    {{ packages.concat(additionalPackages).join(', ') }}
    <small>v.{{ version }}</small>
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

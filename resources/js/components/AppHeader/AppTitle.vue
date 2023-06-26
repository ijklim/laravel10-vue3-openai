<script setup>
  import { name, version } from '@/utilities/constants.js';
</script>

<template>
  <h1>
    {{ name }}
    <small>v.{{ version }}</small>
  </h1>
</template>

<style scoped>
  h1 {
    /* Dynamically adjust font based on screen width */
    font-size: clamp(1rem, 4cqi, 1.4rem);
  }

  small {
    /* Font size base on parent's font size */
    font-size: 70%;
    font-style: italic;
  }
</style>

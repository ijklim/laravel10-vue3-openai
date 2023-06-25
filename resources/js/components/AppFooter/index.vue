<script setup>
  import { packages } from '@/utilities/constants.js';

  defineProps({
    additionalPackages: {
      type: Array,
      default: () => [],
    },
  })
</script>

<template>
  <!-- Vuetify Flex: https://vuetifyjs.com/en/styles/flex -->
  <!-- flex-row-reverse: Components start from the right -->
  <!-- flex-0-1: Allows vertical shrink -->
  <!-- justify-space-between: Allows components to spread out to the edges -->
  <VFooter class="flex-0-1 flex-row-reverse justify-space-between">
    <span>
      Proudly brought to you by <a href="https://ivan-lim.com" target="_blank">Ivan Lim</a>
    </span>

    <!-- d-md-flex: Display only on breakpoint 'md' and above -->
    <span class="d-none d-md-flex">
      <!-- Combine packages into comma separated string -->
      Built on: {{ packages.concat(additionalPackages).join(', ') }}
    </span>
  </VFooter>
</template>

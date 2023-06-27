<script setup>
  import { computed, ref } from 'vue';
  import ImageGenerationDrawer from '@/components/InputHelpers/ImageGenerationDrawer.vue';

  const bgColorDrawer = 'bg-blue-grey-darken-3';
  const isNavigationDrawerOpen = ref(false);
  const widthDrawer = 230;
  const widthRail = 28;

  /**
   * Handlebar should appear beside App Drawer
   */
  const styleHandlebar = computed(() => {
    // Note: Position has to changed when drawer is open
    // Note: -1 to position covers the border of the drawer, looks better
    const leftHandlebar = (isNavigationDrawerOpen.value ? widthDrawer : widthRail) - 1;
    return {
      backgroundColor: `${bgColorDrawer}`,
      transform: `translate(${leftHandlebar}px, 30px)`,
    };
  });
</script>

<template>
  <!-- Navigation Drawer doc: https://vuetifyjs.com/en/components/navigation-drawers/ -->
  <!-- Note: permanent:drawer to not overlap VMain and to start off visible -->
  <!-- Note: rail: mini version of drawer -->
  <VNavigationDrawer
    permanent
    :class="bgColorDrawer"
    :width="widthDrawer"
    :rail="!isNavigationDrawerOpen"
    :rail-width="widthRail"
  >
    <!-- Handlebar Button to toggle Navigation Drawer -->
    <!-- position 'absolute': allows translate styling to work -->
    <!-- rounded 'sm': prevents circular button -->
    <!-- variant 'text': removes elevation -->
    <VBtn
      aria-label="Toggle App Drawer"
      :icon="isNavigationDrawerOpen ? 'mdi-chevron-left' : 'mdi-chevron-right'"
      position="absolute"
      rounded="sm"
      width="26"
      variant="text"
      @click="isNavigationDrawerOpen = !isNavigationDrawerOpen"
      :class="bgColorDrawer"
      :ripple=false
      :style="styleHandlebar"

    />

    <VContainer class="pa-7" v-if="isNavigationDrawerOpen">
      <ImageGenerationDrawer />
    </VContainer>
  </VNavigationDrawer>
</template>
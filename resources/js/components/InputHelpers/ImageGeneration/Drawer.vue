<script setup>
  import useOpenAI from '@/composables/useOpenAI.js';
  import { IMAGE_SIZES } from '@/utilities/constants.js';


  // === Composables ===
  const openAI = useOpenAI();


  // === Computed ===
  // todo: Add Image Styles (Digital Art, Anime, Acrylic, Oil Painting, Art Deco, Painting, Synthwave, Steampunk, Foggy Scenery, Photography, Vintage Photo)
</script>

<template>
  <VRow>
    <VBtnToggle
      color="blue-darken-4"
      density="comfortable"
      divided
      mandatory
      outlined
      rounded="lg"
      v-model="openAI.imageSize.value"
    >
      <VBtn
        v-for="(availableImageSize, index) in IMAGE_SIZES"
        class="sm"
        :key="index"
        :value="availableImageSize"
      >
        {{ availableImageSize.split('x')[0] }}
      </VBtn>
    </VBtnToggle>
  </VRow>
</template>
<script setup>
  import { reactive, watchEffect } from 'vue';
  import useOpenAI from '@/composables/useOpenAI.js';
  import { IMAGE_SIZES } from '@/utilities/constants.js';
  import { FORM_INPUT_RULES } from '@/utilities/formInputRules.js';


  // === Composables ===
  const openAI = useOpenAI();


  // === Data Fields ===
  const form = reactive({
    imageDescription: '',
  });


  // === Watcher ===
  watchEffect(() => {
    if (!form.imageDescription) {
      // Revert system message to default
      openAI.state.messageSystem = null;
      return;
    }

    openAI.state.form.questionComplete = `
      ${form.imageDescription}
    `;
  });
</script>

<template>
  <VContainer class="pa-3 pt-0 mb-3">
    <VRow>
      <VBtnToggle
        color="blue-darken-4"
        divided
        mandatory
        outlined
        rounded="lg"
        v-model="openAI.imageSize.value"
      >
        <VBtn
          v-for="(availableImageSize, index) in IMAGE_SIZES"
          :key="index"
          :value="availableImageSize"
        >
          {{ availableImageSize }}
        </VBtn>
      </VBtnToggle>
    </VRow>
  </VContainer>

  <VTextarea
    auto-grow
    clearable
    clear-icon="mdi-close-circle"
    label="Describe the picture you have in mind"
    rows="3"
    variant="outlined"
    v-model="form.imageDescription"
    :rules="FORM_INPUT_RULES.NOT_EMPTY"
  />
</template>

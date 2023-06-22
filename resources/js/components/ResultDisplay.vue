<script setup>
  import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/index.vue';
  import useOpenAI from '@/composables/useOpenAI.js';
  import { OPENAI_REQUEST_TYPES } from '@/utilities/constants.js';

  const openAI = useOpenAI();
</script>

<template>
  <!-- Colors doc: https://vuetifyjs.com/en/styles/colors/ -->
  <VCard
    class="mt-5 bg-brown-darken-4"
    v-if="openAI.state.responseFromAI.isDisplayReady"
  >
    <!-- Card Item doc: https://vuetifyjs.com/en/api/v-card-item/ -->
    <VCardItem
      prepend-icon="mdi-microphone-question"
    >
      <!-- === Question entered by the user === -->
      <VCardTitle>
        {{ openAI.state.responseFromAI.prompt }}
      </VCardTitle>

      <!-- === Button: Copy To Clipboard === -->
      <template v-slot:append v-if="openAI.state.responseFromAI.canBeCopiedToClipboard">
        <ButtonCopyToClipboard
          buttonTextOriginal="Copy Response"
          :contentToCopy="openAI.state.responseFromAI.answers"
        />
      </template>
    </VCardItem>

    <VDivider />

    <!-- === Answers from Chat Completion === -->
    <!-- flex-column to display answers vertically -->
    <VCardText
      class="d-flex flex-column"
      v-if="openAI.state.responseFromAI.requestType === OPENAI_REQUEST_TYPES.CHAT"
    >
      <div v-for="(answer, index) in openAI.state.responseFromAI.answers" :key="index" class="mt-2">
        <strong>{{ answer }}</strong>
      </div>
    </VCardText>

    <!-- === Image from Image Generation === -->
    <!-- justify-center to center image -->
    <VCardText
      class="d-flex justify-center"
      v-if="openAI.state.responseFromAI.requestType === OPENAI_REQUEST_TYPES.IMAGE"
    >
      <img
        :height="openAI.state.responseFromAI.image.height"
        :src="openAI.state.responseFromAI.image.url"
        :width="openAI.state.responseFromAI.image.width"
      />
    </VCardText>
  </VCard>
</template>

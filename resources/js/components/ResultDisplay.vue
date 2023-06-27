<script setup>
  import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/index.vue';
  import ButtonDownloadImage from '@/components/ButtonDownloadImage/index.vue';
  import useOpenAI from '@/composables/useOpenAI.js';
  import { OPENAI_REQUEST_TYPES } from '@/utilities/constants.js';

  const openAI = useOpenAI();
</script>

<template>
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

      <!-- === Button: Download Image === -->
      <template v-slot:append v-if="openAI.state.responseFromAI.canBeDownloaded">
        <ButtonDownloadImage
          :base64ImageToDownload="openAI.state.responseFromAI.image.src"
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
      <!-- With Base64 image src, it can be downloaded without CORS issue -->
      <a :href="openAI.state.responseFromAI.image.src" download>
        <img
        :height="openAI.state.responseFromAI.image.height"
        :src="openAI.state.responseFromAI.image.src"
        :width="openAI.state.responseFromAI.image.width"
        />

        <!-- Tooltip doc: https://vuetifyjs.com/en/api/v-tooltip/ -->
        <VTooltip activator="parent" theme="light" location="top center">
          Click to download
        </VTooltip>
      </a>
    </VCardText>
  </VCard>
</template>

<script setup>
  import { reactive,watchEffect } from 'vue';
  import useOpenAI from '@/composables/useOpenAI.js';
  import { FORM_INPUT_RULES } from '@/utilities/formInputRules.js';

  const openAI = useOpenAI();

  const form = reactive({
    company: '',
    position: '',
    jobDescription: '',
  });

  // === Watcher ===
  watchEffect(() => {
    if (!form.position || !form.company || !form.jobDescription) {
      // Revert system message to default
      openAI.state.messageSystem = null;
      return;
    }

    openAI.state.form.questionComplete = `
      Applying for ${form.position} at ${form.company},
      job description "${form.jobDescription}".
      Write cover letter.
    `;
    openAI.state.messageSystem = 'You are a brilliant intelligent creative resume writer.';
  });
</script>

<template>
  <VTextField
    label="Company"
    v-model="form.company"
    :rules="FORM_INPUT_RULES.NOT_EMPTY"
  />

  <VTextField
    label="Position"
    v-model="form.position"
    :rules="FORM_INPUT_RULES.NOT_EMPTY"
  />

  <VTextarea
    auto-grow
    clearable
    clear-icon="mdi-close-circle"
    label="Job Description"
    rows="3"
    variant="outlined"
    v-model="form.jobDescription"
    :rules="FORM_INPUT_RULES.NOT_EMPTY"
  />
</template>

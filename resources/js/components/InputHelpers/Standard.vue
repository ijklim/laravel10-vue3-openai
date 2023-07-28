<script setup>
  import useOpenAI from '@/composables/useOpenAI.js';
  import { FORM_INPUT_RULES } from '@/utilities/formInputRules.js';


  // === Composables ===
  const openAI = useOpenAI();


  // === Events Declarations ===
  const emit = defineEmits(['keyEnter']);
</script>

<template>
  <!-- === Input Helper: (Default) === -->
  <VTextField
    label="Which type of specialist would you like to communicate with?"
    v-model="openAI.roleAI.value"
    :rules="FORM_INPUT_RULES.NOT_EMPTY"
  />

  <!-- Textarea doc: https://vuetifyjs.com/en/components/textareas/ -->
  <VTextarea
    auto-grow
    clearable
    clear-icon="mdi-close-circle"
    counter
    label="What is your question?"
    rows="3"
    variant="outlined"
    v-model="openAI.state.form.questionComplete"
    :rules="FORM_INPUT_RULES.NOT_EMPTY"
    @keypress.enter.prevent="$emit('keyEnter')"
  />
</template>

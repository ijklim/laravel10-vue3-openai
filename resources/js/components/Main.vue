<script setup>
  import { computed, reactive, ref, watchEffect } from 'vue';
  import AppFooter from '@/components/AppFooter/index.vue';
  import AppHeader from '@/components/AppHeader/index.vue';

  // === Data Variables ===
  const answers = ref([]);
  const form = reactive({
    // === For helper: Standard ===
    questionFull: '',
    // === For helper: Cover Letter ===
    company: '',
    position: '',
    jobDescription: '',
  });
  // Note: `questionWithAnswers` is set to `questionFull` after a response is received from OpenAI
  const questionWithAnswers = ref(null);
  const isProcessing = ref(false);
  const rulesNotEmpty = [
    value => value ? true : 'Enter a value.',
  ];
  // OpenAI models
  const availableModels = reactive({
    'gpt-3.5-turbo': {
      maxTokens: 0,
    },
  });
  const modelSelected = ref(Object.keys(availableModels)[0]);
  // Input Helper Types
  const helperInputTypes = [
    'Standard',
    'Cover Letter',
  ];
  const helperInputTypeSelected = ref(helperInputTypes[0]);
  // The default system message to set the tone of the conversation with OpenAI
  const messageSystem = ref('You are a helpful assistant');

  // === Computed Fields ===
  const questionFormatted = computed(() => {
    // Condense multiple spaces and non word characters
    const patternCharsToReplaceWithSpace = /([^A-Za-z0-9_'":;])+/g;
    return form.questionFull.replaceAll(patternCharsToReplaceWithSpace, ' ');
  });


  // === Watcher ===
  watchEffect(() => {
    if (!form.position || !form.company || !form.jobDescription) {
      return;
    }

    form.questionFull = `
      Applying for ${form.position} at ${form.company},
      job description "${form.jobDescription}".
      Write cover letter.
    `;
    messageSystem.value = 'You are a brilliant intelligent creative resume writer.';
  });


  // === Methods ===
  /**
   * Make api call to OpenAI server to ask a question
   *
   * @param {*} event
   */
  const submit = async (event) => {
    // Clear previous answer
    answers.value = [];
    questionWithAnswers.value = null;

    const resultsFormValidation = await event;
    if (!resultsFormValidation.valid) {
      // Form fails validation
      return;
    }

    isProcessing.value = true;

    // Axios + Vue doc: https://v2.vuejs.org/v2/cookbook/using-axios-to-consume-apis.html
    // Token count doc: https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
    const payload = {
      endPoint: 'chat/completions',
      // Ref: https://platform.openai.com/docs/guides/gpt
      parameters: {
        model: modelSelected.value,
        messages: [
          {
            role: 'system',
            content: messageSystem.value,
          },
          {
            role: 'user',
            content: questionFormatted.value,
          }
        ],
      },
    };
    const apiResponse = await axios.post('/api/openai/post', payload);
    // Sample apiResponse: { id: "...", choices: [{ text: "..."}], model: "...", object: "...", usage: {} }
    // console.log(`[${import.meta.url.split('?')[0].split('/').slice(3).join('/')}::submit()] apiResponse`, apiResponse);
    if (apiResponse.status === 200) {
      questionWithAnswers.value = questionFormatted;
      // Model: 2020–2022
      // answers.value = apiResponse.data?.choices[0]?.text.split('\n');
      // Model: 2023-
      answers.value = apiResponse.data?.choices[0]?.message?.content.split('\n');
    }

    isProcessing.value = false;
  };
</script>

<template>
  <!-- Application Layout: https://vuetifyjs.com/en/features/application-layout/ -->
  <VApp>
    <!-- === Header === -->
    <AppHeader />

    <!-- === Body === -->
    <VMain class="">
      <VContainer class="">
        <!-- Form doc: https://vuetifyjs.com/en/components/forms/ -->
        <!-- Sizing doc: https://vuetifyjs.com/en/styles/sizing/ -->
        <VSheet class="mx-auto mt-5 bg-transparent">
          <!-- === Customization Panel === -->
          <VContainer class="pa-0">
            <VRow>
              <VCol
                cols="8"
                class="flex-grow-1 flex-shrink-0"
              >
                <!-- === Input Helper Type Selector === -->
                <!-- Button Toggle doc: https://vuetifyjs.com/en/components/button-groups/ -->
                <VBtnToggle
                  class="mb-3"
                  color="deep-purple-accent-3"
                  divided
                  mandatory
                  outlined
                  rounded="lg"
                  v-model="helperInputTypeSelected"
                >
                  <VBtn
                    v-for="helperInputType in helperInputTypes"
                    :key="helperInputType"
                    :value="helperInputType"
                  >
                    {{ helperInputType }}
                  </VBtn>
                </VBtnToggle>
              </VCol>

              <!-- <VSpacer /> -->

              <VCol
                cols="4"
                class="flex-grow-0 flex-shrink-1"
              >
                <!-- === OpenAI model selector === -->
                <!-- Selects doc: https://vuetifyjs.com/en/components/selects/ -->
                <VSelect
                  bg-color="deep-purple-accent-3"
                  density="comfortable"
                  label="OpenAI Model"
                  variant="outlined"
                  v-model="modelSelected"
                  :items="Object.keys(availableModels)"
                >
                </VSelect>
              </VCol>
            </VRow>
          </VContainer>

          <!-- === Form that allows user to ask question === -->
          <VForm validate-on="submit lazy" @submit.prevent="submit">
            <!-- === Input Helper: Standard === -->
            <!-- Textarea doc: https://vuetifyjs.com/en/components/textareas/ -->
            <VTextarea
              auto-grow
              clearable
              clear-icon="mdi-close-circle"
              counter
              label="What is your question?"
              rows="3"
              variant="outlined"
              v-model="form.questionFull"
              v-if="helperInputTypeSelected === 'Standard'"
              :rules="rulesNotEmpty"
            />

            <!-- === Input Helper: Cover Letter === -->
            <VTextField
              label="Company"
              v-model="form.company"
              v-if="helperInputTypeSelected === 'Cover Letter'"
              :rules="rulesNotEmpty"
            />

            <VTextField
              label="Position"
              v-model="form.position"
              v-if="helperInputTypeSelected === 'Cover Letter'"
              :rules="rulesNotEmpty"
            />

            <VTextarea
              auto-grow
              clearable
              clear-icon="mdi-close-circle"
              label="Job Description"
              rows="3"
              variant="outlined"
              v-model="form.jobDescription"
              v-if="helperInputTypeSelected === 'Cover Letter'"
              :rules="rulesNotEmpty"
            />


            <!-- For debug purpose, remove `d-none` to show -->
            <div class="pa-5 d-none">
              questionFormatted: {{ questionFormatted }}
            </div>
            <div class="pa-5 d-none">
              countWordsInQuestionFormatted: {{ countWordsInQuestionFormatted }}
            </div>
            <div class="pa-5 d-none">
              helperInputTypeSelected: {{ helperInputTypeSelected }}
            </div>

            <!-- Button doc: https://vuetifyjs.com/en/components/buttons/ -->
            <VBtn
              block
              class="mt-2"
              color="green-darken-3"
              type="submit"
              :disabled="isProcessing"
              :loading="isProcessing"
            >
              Submit
            </VBtn>
          </VForm>

          <!-- === Results from OpenAI === -->
          <!-- Colors doc: https://vuetifyjs.com/en/styles/colors/ -->
          <VCard
            class="mt-5 bg-brown-darken-4"
            prepend-icon="mdi-microphone-question"
            v-show="!!questionWithAnswers"
          >
            <template v-slot:title>
              {{ questionWithAnswers }}
            </template>

            <template v-slot:text>
              <div v-for="(answer, index) in answers" :key="index" class="mt-2">
                <strong>{{ answer }}</strong>
              </div>
            </template>
          </VCard>
        </VSheet>
      </VContainer>
    </VMain>

    <!-- === Footer === -->
    <AppFooter />
  </VApp>
</template>


<script setup>
  import { computed, reactive, ref, toRaw, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import AppFooter from '@/components/AppFooter/index.vue';
  import AppHeader from '@/components/AppHeader/index.vue';
  import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/index.vue';
  import ScreenBreakpoints from '@/components/Debug/ScreenBreakpoints.vue';
  import useOpenAI from '@/composables/useOpenAI.js';
  import useProcessing from '@/composables/useProcessing.js';

  const openAI = useOpenAI();
  const processing = useProcessing();

  // === Data Variables ===
  const INPUT_HELPER_TYPE_DEFAULT = 'Standard';
  // const answers = ref([]);
  const form = reactive({
    // === For helper: Cover Letter ===
    company: '',
    position: '',
    jobDescription: '',
  });
  const rulesNotEmpty = [
    value => value ? true : 'Enter a value.',
  ];
  const helperInputTypeSelected = ref(INPUT_HELPER_TYPE_DEFAULT);

  // Input Helper Types
  const helperInputTypes = computed(() => {
    const route = useRoute();
    // console.log(`[${import.meta.url.split('?')[0].split('/').slice(3).join('/')}::helperInputTypes()] route`, route, toRaw(route));
    // console.log(`[${import.meta.url.split('?')[0].split('/').slice(3).join('/')}::helperInputTypes()] route.query`, route.query);

    const results = [INPUT_HELPER_TYPE_DEFAULT];

    if (route.query?.helper === 'cl') {
      results.push('Cover Letter');
    }
    return results;
  });

  // === Watcher ===
  // Todo: Move out to own module
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
</script>

<template>
  <!-- === For Debug Purpose Only === -->
  <!-- <ScreenBreakpoints /> -->

  <!-- Application Layout: https://vuetifyjs.com/en/features/application-layout/ -->
  <VApp>
    <!-- === Header === -->
    <AppHeader />

    <!-- === Body === -->
    <VMain class="">
      <VContainer class="">
        <!-- Form doc: https://vuetifyjs.com/en/components/forms/ -->
        <!-- Sizing doc: https://vuetifyjs.com/en/styles/sizing/ -->
        <!-- Column Breakpoint doc: https://vuetifyjs.com/en/api/v-col/ -->
        <!-- Flex doc: https://vuetifyjs.com/en/styles/flex/ -->
        <VSheet class="mx-auto mt-5 bg-transparent">
          <!-- === Customization Panel === -->
          <VContainer class="pa-0 mb-3">
            <!-- Note: Using flex-row-reverse to place model selection to the right -->
            <!-- Note: Using no-gutters to reduce the gaps between vertically stacked VCols on small screen  -->
            <VRow no-gutters class="flex-row-reverse">
              <!-- === OpenAI model selector === -->
              <VCol
                cols="12"
                sm="4"
              >
                <!-- Selects doc: https://vuetifyjs.com/en/components/selects/ -->
                <!-- Note: The gap below is taken up by .v-input__details:grid-area for error message -->
                <VSelect
                  bg-color="deep-purple-accent-3"
                  density="comfortable"
                  label="OpenAI Model"
                  variant="outlined"
                  v-model="openAI.state.modelSelected"
                  :items="Object.keys(openAI.OPENAI_MODELS)"
                >
                </VSelect>
              </VCol>

              <!-- === Input Helper Type Selector === -->
              <VCol
                cols="12"
                sm="8"
                v-if="helperInputTypes.length > 1"
              >
                <!-- Button Toggle doc: https://vuetifyjs.com/en/components/button-groups/ -->
                <VBtnToggle
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
            </VRow>
          </VContainer>

          <!-- === Form that allows user to ask question === -->
          <VForm validate-on="submit lazy" @submit.prevent="openAI.submitForm">
            <!-- === Input Helper: (Default) === -->
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
              v-if="helperInputTypeSelected === INPUT_HELPER_TYPE_DEFAULT"
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
              questionFormatted: {{ openAI.questionFormatted }}
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
              :disabled="processing.isEventProcessing()"
              :loading="processing.isEventProcessing()"
            >
              Submit
            </VBtn>
          </VForm>

          <!-- === Results from OpenAI === -->
          <!-- Colors doc: https://vuetifyjs.com/en/styles/colors/ -->
          <VCard
            class="mt-5 bg-brown-darken-4"
            v-show="!!openAI.state.questionWithAnswers"
          >
            <!-- Card Item doc: https://vuetifyjs.com/en/api/v-card-item/ -->
            <VCardItem
              prepend-icon="mdi-microphone-question"
            >
              <!-- === Question entered by the user === -->
              <VCardTitle>
                {{ openAI.state.questionWithAnswers }}
              </VCardTitle>

              <!-- === Button: Copy To Clipboard === -->
              <template v-slot:append>
                <ButtonCopyToClipboard
                  buttonTextOriginal="Copy Response"
                  :contentToCopy="openAI.state.answersFromAI"
                />
              </template>
            </VCardItem>

            <VDivider />

            <!-- === Answers === -->
            <VCardText class="d-flex flex-column">
              <div v-for="(answer, index) in openAI.state.answersFromAI" :key="index" class="mt-2">
                <strong>{{ answer }}</strong>
              </div>
            </VCardText>
          </VCard>
        </VSheet>
      </VContainer>
    </VMain>

    <!-- === Footer === -->
    <AppFooter />
  </VApp>
</template>


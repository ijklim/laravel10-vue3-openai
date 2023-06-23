<script setup>
  import { ref } from 'vue';
  import AppFooter from '@/components/AppFooter/index.vue';
  import AppHeader from '@/components/AppHeader/index.vue';
  import ScreenBreakpoints from '@/components/Debug/ScreenBreakpoints.vue';
  import ResultDisplay from '@/components/ResultDisplay.vue';
  import useInputHelper from '@/composables/useInputHelper.js';
  import useOpenAI from '@/composables/useOpenAI.js';
  import useProcessing from '@/composables/useProcessing.js';
  import useUserSelection from '@/composables/useUserSelection.js';
  import { OPENAI_MODELS } from '@/utilities/constants.js';

  const inputHelper = useInputHelper();
  const openAI = useOpenAI();
  const processing = useProcessing();
  const userSelection = useUserSelection();
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
                  v-model="userSelection.activeOpenAIModelKey"
                  :items="Object.keys(OPENAI_MODELS)"
                >
                </VSelect>
              </VCol>

              <!-- === Input Helper Type Selector === -->
              <VCol
                cols="12"
                sm="8"
                v-if="inputHelper.components.value.length > 1"
              >
                <!-- Button Toggle doc: https://vuetifyjs.com/en/components/button-groups/ -->
                <VBtnToggle
                  color="deep-purple-accent-3"
                  divided
                  mandatory
                  outlined
                  rounded="lg"
                  v-model="userSelection.activeInputHelperIndex.value"
                >
                  <VBtn
                    v-for="(inputHelperComponent, index) in inputHelper.components.value"
                    :key="index"
                    :value="index"
                  >
                    {{ inputHelperComponent.name }}
                  </VBtn>
                </VBtnToggle>
              </VCol>
            </VRow>
          </VContainer>

          <!-- === Form that allows user to ask question === -->
          <VForm validate-on="submit lazy" @submit.prevent="openAI.submitForm">
            <!-- === Input Helper Component === -->
            <component
              :is="inputHelper.components.value[userSelection.activeInputHelperIndex.value].component"
            />

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
          <ResultDisplay />
        </VSheet>
      </VContainer>
    </VMain>

    <!-- === Footer === -->
    <AppFooter />
  </VApp>
</template>


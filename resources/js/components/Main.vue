<script setup>
  import AppDrawer from '@/components/AppDrawer/index.vue';
  import AppFooter from '@/components/AppFooter/index.vue';
  import AppHeader from '@/components/AppHeader/index.vue';
  import ScreenBreakpoints from '@/components/Debug/ScreenBreakpoints.vue';
  import ResultDisplay from '@/components/ResultDisplay.vue';
  import VueAdsRandom from '@/components/VueAds/Random.vue';
  import useInputHelper from '@/composables/useInputHelper.js';
  import useOpenAI from '@/composables/useOpenAI.js';
  import useProcessing from '@/composables/useProcessing.js';
  import useUserSelection from '@/composables/useUserSelection.js';


  // === Composables ===
  const inputHelper = useInputHelper();
  const openAI = useOpenAI();
  const processing = useProcessing();
  const userSelection = useUserSelection();
</script>

<template>
  <!-- === For Debug Purpose Only === -->
  <!-- <ScreenBreakpoints /> -->

  <!-- Application Layout: https://vuetifyjs.com/en/features/application-layout/ -->
  <!-- Note: VLayout comes with better documentation than VApp, does not work too well with VFooter. -->
  <VLayout>
    <!-- === Header === -->
    <AppHeader />

    <!-- === Footer === -->
    <!-- Note: Affects the space Navigation Drawer takes if defined below -->
    <AppFooter :additionalPackages="['Vuetify 3']" />

    <!-- === Drawer (Side Menu) === -->
    <AppDrawer />

    <!-- === Body === -->
    <!-- VMain necessary to start content below AppHeader, part of Vuetify Application Layout -->
    <VMain class="">
      <VContainer fluid>
        <!-- Sizing doc: https://vuetifyjs.com/en/styles/sizing/ -->
        <!-- Column Breakpoint doc: https://vuetifyjs.com/en/api/v-col/ -->

        <!-- === Customization Panel === -->
        <!-- no-gutters: Reduce the gaps between vertically stacked VCols on small screen  -->
        <!-- flex-row-reverse: Places model selection to the right -->
        <!-- mb-md-0: Bottom margin not necessary when VCols are arranged horizontally -->
        <VRow no-gutters class="flex-row-reverse mb-5 mb-md-0">
          <!-- === OpenAI model selector === -->
          <VCol
            cols="12"
            md="4"
          >
            <!-- Selects doc: https://vuetifyjs.com/en/components/selects/ -->
            <!-- Note: The gap below is taken up by .v-input__details:grid-area for error message -->
            <!-- Important: v-model must use .value for computed field -->
            <VSelect
              bg-color="deep-purple-accent-3"
              density="comfortable"
              label="OpenAI Model"
              variant="outlined"
              v-model="userSelection.activeOpenAIModelKey.value"
              :items="userSelection.availableOpenAIModelKeys.value"
            >
            </VSelect>
          </VCol>

          <!-- === Input Helper Type Selector === -->
          <VCol
            cols="12"
            md="8"
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

        <!-- === Form that allows user to ask question === -->
        <VForm validate-on="submit lazy" @submit.prevent="openAI.submitForm">
          <!-- === Input Helper Component === -->
          <component
            :is="userSelection.activeInputHelper.value.component"
          />

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

        <!-- === Advertisements === -->
        <VRow no-gutters class="mt-10 mb-5">
          <!-- Note: Both `mx-auto text-center` are needed for best placements when screen is resized -->
          <VCol
            class="mx-auto text-center"
            cols="12"
            md="8"
            lg="6"
          >
            <VueAdsRandom />
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
  </VLayout>
</template>


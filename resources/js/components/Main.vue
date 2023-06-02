<script setup>
  import { ref } from 'vue';
  import AppTitle from '@/components/AppTitle.vue';

  const question = ref("");
  const answers = ref([]);
  const isProcessing = ref(false);
  const rulesQuestion = [
    value => value ? true : 'Enter a question.',
  ];

  /**
   * Make api call to OpenAI server to ask a question
   *
   * @param {*} event
   */
  const submit = async (event) => {
    // Clear previous answer
    answers.value = [];

    const resultsFormValidation = await event;
    if (!resultsFormValidation.valid) {
      // Form fails validation
      return;
    }

    isProcessing.value = true;

    // Axios + Vue doc: https://v2.vuejs.org/v2/cookbook/using-axios-to-consume-apis.html
    const payload = {
      "endPoint": "completions",
      "parameters": {
        "model": "text-davinci-003",
        "prompt": question.value,
        "max_tokens": 4000,
        "temperature": 1.2
      }
    };
    const apiResponse = await axios.post('/api/openai/post', payload);
    // Sample apiResponse: { id: "...", choices: [{ text: "..."}], model: "...", object: "...", usage: {} }
    // console.log(`[${import.meta.url.split('?')[0].split('/').slice(3).join('/')}::submit()] apiResponse`, apiResponse);
    if (apiResponse.status === 200) {
      answers.value = apiResponse.data?.choices[0]?.text.split('\n');
    }

    isProcessing.value = false;
  };
</script>

<template>
  <!-- Application Layout: https://vuetifyjs.com/en/features/application-layout/ -->
  <VApp>
    <!-- === Header === -->
    <VAppBar class="pl-5">
      <AppTitle :packages="['Vuetify 3']" />
    </VAppBar>

    <!-- === Body === -->
    <VMain class="">
      <VContainer class="">
        <!-- Form doc: https://vuetifyjs.com/en/components/forms/ -->
        <!-- Sizing doc: https://vuetifyjs.com/en/styles/sizing/ -->
        <VSheet class="mx-auto mt-5 bg-transparent">
          <VForm validate-on="submit lazy" @submit.prevent="submit">
            <!-- Textarea doc: https://vuetifyjs.com/en/components/textareas/ -->
            <VTextarea
              auto-grow
              clearable
              clear-icon="mdi-close-circle"
              counter
              label="What is your question?"
              rows="3"
              variant="outlined"
              v-model="question"
              :rules="rulesQuestion"
            />

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

          <div class="mt-5 bg-blue-lighten-4 pa-5">
            <em>{{ question }}</em>

            <div v-for="(answer, index) in answers" :key="index" class="mt-2">
              <strong>{{ answer }}</strong>
            </div>
          </div>
        </VSheet>
      </VContainer>
    </VMain>

    <!-- === Footer === -->
    <VFooter class="d-flex justify-space-around flex-0-1">
      <span>
        Proudly brought to you by <a href="https://ivan-lim.com" target="_blank">Ivan Lim</a>
      </span>
    </VFooter>
  </VApp>
</template>


<script setup>
  import { ref } from 'vue';
  import AppTitle from '@/components/AppTitle.vue';

  const question = ref("");
  const answer = ref("");
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
    answer.value = "";

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
      answer.value = apiResponse.data.choices[0].text;
    }

    isProcessing.value = false;
  };
</script>

<template>
  <VCard>
    <VLayout>
      <VAppBar title="Vuetify Version"></VAppBar>

      <VMain>
        <VContainer>
          <AppTitle :packages="['Vuetify 3']" />

          <!-- Form doc: https://vuetifyjs.com/en/components/forms/ -->
          <VSheet width="900" class="mx-auto mt-5">
            <VForm validate-on="submit lazy" @submit.prevent="submit">
              <VTextField
                label="What is your question?"
                v-model="question"
                :rules="rulesQuestion"
              />

              <!-- Button doc: https://vuetifyjs.com/en/components/buttons/ -->
              <VBtn
                block
                class="mt-2"
                color="indigo-darken-3"
                type="submit"
                :disabled="isProcessing"
                :loading="isProcessing"
              >
                Submit
              </VBtn>
            </VForm>

            <div class="mt-5">Response from ChatGPT:</div>
            <pre class="mt-5 bg-blue-lighten-4 pa-5">{{ answer }}</pre>
          </VSheet>
        </VContainer>
      </VMain>
    </VLayout>
  </VCard>
</template>


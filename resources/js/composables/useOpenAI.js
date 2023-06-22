/**
 * Data in this module is format ready to be sent to OpenAI api
 */
import { computed, reactive } from 'vue';
import useProcessing from '@/composables/useProcessing.js';

// OpenAI models
const OPENAI_MODELS = {
  'gpt-3.5-turbo': { created: 1677610602 },
  'gpt-3.5-turbo-0301': { created: 1677649963 },
};

const state = reactive({
  answersFromAI: [],
  form: {
    questionComplete: '',
  },
  messageSystem: null,
  modelSelected: Object.keys(OPENAI_MODELS)[0],
  // Once answer is received from AI, questionWithAnswers is set to user's question
  questionWithAnswers: null,
});

export default () => {
  // === Computed Fields ===
  const questionFormatted = computed(() => {
    // Condense multiple spaces and non word characters
    const patternCharsToReplaceWithSpace = /([^A-Za-z0-9_'":;])+/g;
    return state.form.questionComplete.replaceAll(patternCharsToReplaceWithSpace, ' ');
  });

  // === Methods ===
  /**
   * Make api call to OpenAI server to ask a question
   *
   * @param {*} event
   */
  const submitForm = async (event) => {
    // Clear previous answers
    state.answersFromAI = [];
    state.questionWithAnswers = null;

    const resultsFormValidation = await event;
    if (!resultsFormValidation.valid) {
      // Form fails validation
      return;
    }

    const processing = useProcessing();
    const eventCode = processing.generateEventCode('SUBMIT_FORM');
    processing.setEvent(eventCode);

    // Axios + Vue doc: https://v2.vuejs.org/v2/cookbook/using-axios-to-consume-apis.html
    // Token count doc: https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
    const payload = {
      endPoint: 'chat/completions',
      // Ref: https://platform.openai.com/docs/guides/gpt
      parameters: {
        model: state.modelSelected,
        messages: [
          {
            role: 'system',
            content: state.messageSystem ?? 'You are a helpful assistant',
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
    if (apiResponse.status === 200) {
      state.questionWithAnswers = questionFormatted.value;
      // Model: 2020–2022
      // state.answersFromAI = apiResponse.data?.choices[0]?.text.split('\n');
      // Model: 2023-
      state.answersFromAI = apiResponse.data?.choices[0]?.message?.content.split('\n');
    }

    processing.clearEvent(eventCode);
  };

  return {
    OPENAI_MODELS,
    questionFormatted,
    state,
    submitForm,
  };
};

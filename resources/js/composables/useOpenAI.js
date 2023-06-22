/**
 * Data in this module is format ready to be sent to OpenAI api
 */
import { computed, reactive } from 'vue';
import useProcessing from '@/composables/useProcessing.js';
import useUserSelection from '@/composables/useUserSelection.js';
import {
  OPENAI_MODELS,
  OPENAI_REQUEST_TYPES,
  IMAGE_SIZES,
  RESPONSE_DEFAULT
} from '@/utilities/constants.js';

const state = reactive({
  answersFromAI: [],
  form: {
    imageSize: IMAGE_SIZES[0],
    questionComplete: '',
  },
  messageSystem: null,
  responseFromAI: JSON.parse(JSON.stringify(RESPONSE_DEFAULT)),
});

const userSelection = useUserSelection();

export default () => {
  // === Computed Fields ===
  const questionFormatted = computed(() => {
    // Condense multiple spaces and non word characters
    const patternCharsToReplaceWithSpace = /([^A-Za-z0-9_'":;])+/g;
    return state.form.questionComplete.replaceAll(patternCharsToReplaceWithSpace, ' ');
  });

  /**
   * Construct parameters based on different request type
   *
   * Ref: https://platform.openai.com/docs/api-reference/[chat|images]
   */
  const apiParamenters = computed(() => {
    switch (OPENAI_MODELS[userSelection.activeOpenAIModelKey.value].requestType) {
      // === Chat Completion ===
      case OPENAI_REQUEST_TYPES.CHAT:
        return {
          model: userSelection.activeOpenAIModelKey.value,
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
        };
      // === Image Generation ===
      case OPENAI_REQUEST_TYPES.IMAGE:
        return {
          // Currently only support 1 image per call
          n: 1,
          prompt: questionFormatted.value,
          size: state.form.imageSize,
        };
    }

    // Should not happen, all types should be defined above
    return {};
  });

  // === Methods ===
  /**
   * Make api call to OpenAI server to ask a question
   *
   * @param {*} event
   */
  const submitForm = async (event) => {
    // Restore default
    state.responseFromAI = JSON.parse(JSON.stringify(RESPONSE_DEFAULT));

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
      endPoint: OPENAI_MODELS[userSelection.activeOpenAIModelKey.value].endPoint,
      // Ref: https://platform.openai.com/docs/guides/gpt
      parameters: apiParamenters.value,
    };
    const apiResponse = await axios.post('/api/openai/post', payload);
    // Sample apiResponse: { id: "...", choices: [{ text: "..."}], model: "...", object: "...", usage: {} }
    if (apiResponse.status === 200) {
      state.responseFromAI.prompt = questionFormatted.value;
      state.responseFromAI.requestType = OPENAI_MODELS[userSelection.activeOpenAIModelKey.value].requestType;

      switch (state.responseFromAI.requestType) {
        // === Chat Completion ===
        case OPENAI_REQUEST_TYPES.CHAT:
          state.responseFromAI.answers = apiResponse.data?.choices[0]?.message?.content.split('\n');
          break;
        // === Image Generation ===
        case OPENAI_REQUEST_TYPES.IMAGE:
          state.responseFromAI.image = {
            height: state.form.imageSize.split('x')[1],
            url: apiResponse.data?.data[0]?.url,
            width: state.form.imageSize.split('x')[0],
          };
          state.responseFromAI.canBeCopiedToClipboard = false;
          break;
      }

      state.responseFromAI.isDisplayReady = true;
    }

    processing.clearEvent(eventCode);
  };

  return {
    questionFormatted,
    state,
    submitForm,
  };
};

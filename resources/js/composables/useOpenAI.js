/**
 * Data in this module is format ready to be sent to OpenAI api
 */
import { computed, reactive } from 'vue';
import useProcessing from '@/composables/useProcessing.js';
import useUserSelection from '@/composables/useUserSelection.js';
import useUtility from '@/composables/useUtility.js';
import { cache } from '@/utilities/cache.js';
import {
  OPENAI_MODELS,
  OPENAI_REQUEST_TYPES,
  IMAGE_SIZES,
  RESPONSE_DEFAULT
} from '@/utilities/constants.js';


// === Composables ===
const userSelection = useUserSelection();
const utility = useUtility(import.meta);


const state = reactive({
  answersFromAI: [],
  form: {
    imageSize: null,
    questionComplete: '',
  },
  messageSystem: null,
  responseFromAI: JSON.parse(JSON.stringify(RESPONSE_DEFAULT)),
});


export default () => {
  // === Computed Fields ===
  const cacheKeyImageSize = `${utility.cacheKeyPrefix}__imageSize`;
  // console.log(`[${utility.currentFileName}] cacheKeyImageSize: `, cacheKeyImageSize);
  /**
   * Image size parameter for Image Generation
   */
  const imageSize = computed({
    get() {
      if (state.form.imageSize) {
        return state.form.imageSize;
      }

      // Get active index from cache
      const cachedImageSize = cache.get(cacheKeyImageSize, IMAGE_SIZES[0]);
      // console.log(`[${utility.currentFileName}::computed::imageSize] cachedImageSize`, cachedImageSize);

      // Note: Check to ensure the cached key is still valid
      return IMAGE_SIZES.includes(cachedImageSize) ? cachedImageSize : IMAGE_SIZES[0];
    },
    set(value) {
      state.form.imageSize = value;
      // Cache setting
      cache.store(cacheKeyImageSize, value);
    },
  });

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
          // b64_json supports download without CORS issue
          response_format: 'b64_json',
          size: imageSize.value,
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
      if (apiResponse?.error) {
        alert(`Error encountered: ${apiResponse.error?.message}`);
      } else if (apiResponse?.data) {
        // Expect response is returned
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
              height: null,
              // Note: `url` is returned when response_format is 'url'
              src: apiResponse.data?.data[0]?.url || `data:image/png;base64, ${apiResponse.data.data[0]?.b64_json}`,
              width: null,
            };
            state.responseFromAI.canBeCopiedToClipboard = false;
            state.responseFromAI.canBeDownloaded = true;
            break;
        }

        state.responseFromAI.isDisplayReady = true;
      }
    }

    processing.clearEvent(eventCode);
  };

  return {
    imageSize,
    questionFormatted,
    state,
    submitForm,
  };
};

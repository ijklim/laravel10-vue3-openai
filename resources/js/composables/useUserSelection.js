import { computed, reactive } from 'vue';
import useInputHelper from '@/composables/useInputHelper.js';
import { cache } from '@/utilities/cache.js';
import { OPENAI_MODELS } from '@/utilities/constants.js';

const moduleName = import.meta.url.match(/[^\/]+\.js/i)[0];
// console.log(`[${moduleName}]`);

// Note: Initializing here will cause error `inject() can only be used inside setup() or functional components.`
let inputHelper = null;

const state = reactive({
  activeInputHelperIndex: null,
  // activeOpenAIModelKey examples: gpt-3.5-turbo, gpt-3.5-turbo-0301
  activeOpenAIModelKey: null,
});


export default () => {
  // === Computed Fields ===
  const cacheKeyActiveInputHelperIndex = `${moduleName}__activeInputHelperIndex`;
  const activeInputHelperIndex = computed({
    get() {
      if (state.activeInputHelperIndex) {
        return state.activeInputHelperIndex;
      }

      // Get active index from cache
      const cachedInputHelperIndex = cache.get(cacheKeyActiveInputHelperIndex, 0);
      // Initialize inputHelper composable if necessary
      inputHelper = inputHelper ?? useInputHelper();

      // Note: Check to ensure the cached key is still valid
      return inputHelper.components.value[cachedInputHelperIndex] ? cachedInputHelperIndex : 0;
    },
    set(value) {
      state.activeInputHelperIndex = value;
      // Cache setting
      cache.store(cacheKeyActiveInputHelperIndex, value);
    },
  });

  const cacheKeyActiveOpenAIModelKey = `${moduleName}__activeOpenAIModelKey`;
  /**
   * The currently selected OpenAI model key, e.g. gpt-3.5-turbo
   *
   * @returns {string}
   */
  const activeOpenAIModelKey = computed({
    get() {
      if (state.activeOpenAIModelKey) {
        return state.activeOpenAIModelKey;
      }

      // Get active model from cache
      const cachedOpenAIModelKey = cache.get(cacheKeyActiveOpenAIModelKey, '');

      // Note: Check to ensure the cached key is still in the list of available keys
      // console.log('[activeOpenAIModelKey::get()] cachedOpenAIModelKey', cachedOpenAIModelKey);

      // Note: Check to ensure the cached key is still valid
      return availableOpenAIModelKeys.value.includes(cachedOpenAIModelKey) ? cachedOpenAIModelKey : availableOpenAIModelKeys.value[0];
    },
    set(value) {
      state.activeOpenAIModelKey = value;
      // Cache setting
      cache.store(cacheKeyActiveOpenAIModelKey, value);
    },
  });

  /**
   * Only models with the same request type as the input helper is available for selection
   *
   * @returns {Array}
   */
  const availableOpenAIModelKeys = computed(() => {
    // Initialize inputHelper composable if necessary
    inputHelper = inputHelper ?? useInputHelper();

    return Object.keys(OPENAI_MODELS)
      .filter((openAIModelKey) => {
        return OPENAI_MODELS[openAIModelKey].requestType === inputHelper.components.value[activeInputHelperIndex.value].requestType;
      });
  });


  return {
    activeInputHelperIndex,
    activeOpenAIModelKey,
    availableOpenAIModelKeys,
  }
};

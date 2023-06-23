import { computed, reactive } from 'vue';
import useInputHelper from '@/composables/useInputHelper.js';
import { cache } from '@/utilities/cache.js';
import { OPENAI_MODELS } from '@/utilities/constants.js';

// Note: Initializing here will cause error `inject() can only be used inside setup() or functional components.`
let inputHelper = null;

const state = reactive({
  activeInputHelperIndex: null,
  // activeOpenAIModelKey examples: gpt-3.5-turbo, gpt-3.5-turbo-0301
  activeOpenAIModelKey: null,
});

export default () => {
  // === Computed Fields ===
  const activeInputHelperIndex = computed({
    get() {
      if (state.activeInputHelperIndex) {
        return state.activeInputHelperIndex;
      }

      // Get active index from cache
      const cachedInputHelperIndex = cache.get('activeInputHelperIndex', 0);
      // Initialize inputHelper composable if necessary
      inputHelper = inputHelper ?? useInputHelper();

      // Note: Check to ensure the cached key is still valid
      return inputHelper.components.value[cachedInputHelperIndex] ? cachedInputHelperIndex : 0;
    },
    set(value) {
      state.activeInputHelperIndex = value;
      // Cache setting
      cache.store('activeInputHelperIndex', value);
    },
  });

  const activeOpenAIModelKey = computed({
    get() {
      if (state.activeOpenAIModelKey) {
        return state.activeOpenAIModelKey;
      }

      // Get active model from cache
      const cachedOpenAIModelKey = cache.get('activeOpenAIModelKey', '');
      // console.log('[activeOpenAIModelKey::get()] cachedOpenAIModelKey', cachedOpenAIModelKey);

      // Note: Check to ensure the cached key is still valid
      return OPENAI_MODELS[cachedOpenAIModelKey] ? cachedOpenAIModelKey : Object.keys(OPENAI_MODELS)[0];
    },
    set(value) {
      state.activeOpenAIModelKey = value;
      // Cache setting
      cache.store('activeOpenAIModelKey', value);
    },
  });


  return {
    activeInputHelperIndex,
    activeOpenAIModelKey,
  }
};

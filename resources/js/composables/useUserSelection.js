import { computed, reactive } from 'vue';
import { OPENAI_MODELS } from '@/utilities/constants.js';

const state = reactive({
  // e.g. gpt-3.5-turbo, gpt-3.5-turbo-0301
  selectedOpenAIModelKey: null,
});

export default () => {
  // === Methods ===
  const cache = {
    get: (key, defaultValue = null) => {
      return localStorage.getItem(key) || defaultValue;
    },
    store: (key, value) => {
      localStorage.setItem(key, value);
    },
  };

  // === Computed Fields ===
  const activeOpenAIModelKey = computed({
    get() {
      if (state.selectedOpenAIModelKey) {
        return state.selectedOpenAIModelKey;
      }

      // Get active model from cache
      const cachedOpenAIModelKey = cache.get('activeOpenAIModelKey', '');
      // console.log('[activeOpenAIModelKey::get()] cachedOpenAIModelKey', cachedOpenAIModelKey);
      // Note: Just in case the cached key is obsolete
      return OPENAI_MODELS[cachedOpenAIModelKey] ? cachedOpenAIModelKey : Object.keys(OPENAI_MODELS)[0];
    },
    set(value) {
      state.selectedOpenAIModelKey = value;
      // Cache activeOpenAIModelKey
      cache.store('activeOpenAIModelKey', value);
    },
  });

  return {
    activeOpenAIModelKey,
  }
};

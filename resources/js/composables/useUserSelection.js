import { computed, reactive } from 'vue';
import { cache } from '@/utilities/cache.js';
import { OPENAI_MODELS } from '@/utilities/constants.js';

const state = reactive({
  // e.g. gpt-3.5-turbo, gpt-3.5-turbo-0301
  activeOpenAIModelKey: null,
});

export default () => {
  // === Computed Fields ===
  const activeOpenAIModelKey = computed({
    get() {
      if (state.activeOpenAIModelKey) {
        return state.activeOpenAIModelKey;
      }

      // Get active model from cache
      const cachedOpenAIModelKey = cache.get('activeOpenAIModelKey', '');
      // console.log('[activeOpenAIModelKey::get()] cachedOpenAIModelKey', cachedOpenAIModelKey);
      // Note: Just in case the cached key is obsolete
      return OPENAI_MODELS[cachedOpenAIModelKey] ? cachedOpenAIModelKey : Object.keys(OPENAI_MODELS)[0];
    },
    set(value) {
      state.activeOpenAIModelKey = value;
      // Cache activeOpenAIModelKey
      cache.store('activeOpenAIModelKey', value);
    },
  });

  return {
    activeOpenAIModelKey,
  }
};

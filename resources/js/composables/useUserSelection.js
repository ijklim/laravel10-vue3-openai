import { computed, onBeforeMount, reactive } from 'vue';
import useInputHelper from '@/composables/useInputHelper.js';
import useUtility from '@/composables/useUtility.js';
import { cache } from '@/utilities/cache.js';
import { OPENAI_MODELS } from '@/utilities/constants.js';


// === Composables ===
const utility = useUtility(import.meta);


// Note: Initializing here will cause error `inject() can only be used inside setup() or functional components.`
let inputHelper;


// === Data ===
const state = reactive({
  activeInputHelperIndex: null,
  // activeOpenAIModelKey examples: gpt-3.5-turbo, gpt-3.5-turbo-0301
  activeOpenAIModelKey: null,
});


// === Computed Fields ===
const activeInputHelper = computed(() => {
  return inputHelper.components.value[activeInputHelperIndex.value];
});

const cacheKeyActiveInputHelperIndex = `${utility.cacheKeyPrefix}__activeInputHelperIndex`;
const activeInputHelperIndex = computed({
  get() {
    const index = state.activeInputHelperIndex || cache.get(cacheKeyActiveInputHelperIndex, 0);

    // Note: Check to ensure the cached key is still valid
    return inputHelper.components.value[index] ? index : 0;
  },
  set(value) {
    state.activeInputHelperIndex = value;
    // Note: When Input Helper changes, must clear selected OpenAI Model key as the list might change
    state.activeOpenAIModelKey = null;
    // Cache setting
    cache.store(cacheKeyActiveInputHelperIndex, value);
  },
});

/**
 * Available OpenAI Model is dependent on Input Helper, each Input Helper has its own cached selected model
 *
 * @returns {string}
 */
const cacheKeyActiveOpenAIModelKey = computed(() => {
  return `${utility.cacheKeyPrefix}__${activeInputHelperIndex.value}__activeOpenAIModelKey`;
});

/**
 * The currently selected OpenAI model key, e.g. gpt-3.5-turbo
 *
 * @returns {string}
 */
const activeOpenAIModelKey = computed({
  get() {
    // console.log(`[${utility.currentFileName}::(computed)activeOpenAIModelKey::get()] state.activeOpenAIModelKey: `, state.activeOpenAIModelKey);

    // Either user selection or cache
    const key = state.activeOpenAIModelKey || cache.get(cacheKeyActiveOpenAIModelKey.value, '');
    // console.log(`[${utility.currentFileName}::(computed)activeOpenAIModelKey::get()] availableOpenAIModelKeys.value.includes(key): `, availableOpenAIModelKeys.value.includes(key));

    // Note: Check to ensure the cached key is still valid
    const result = availableOpenAIModelKeys.value.includes(key) ? key : availableOpenAIModelKeys.value[0];
    // console.log(`[${utility.currentFileName}::(computed)activeOpenAIModelKey::get()] result: `, result);
    return result;
  },
  set(newValue, oldValue) {
    // console.log(`[${utility.currentFileName}::(computed)activeOpenAIModelKey::set()] newValue, oldValue: `, newValue, oldValue);
    state.activeOpenAIModelKey = newValue;
    // Cache setting
    cache.store(cacheKeyActiveOpenAIModelKey.value, newValue);
  },
});

/**
 * Only models with the same request type as the input helper is available for selection
 *
 * @returns {Array}
 */
const availableOpenAIModelKeys = computed(() => {
  const activeInputHelperRequestType = inputHelper.components.value[activeInputHelperIndex.value].requestType;

  const result = Object.keys(OPENAI_MODELS)
    .filter((openAIModelKey) => {
      return OPENAI_MODELS[openAIModelKey].requestType === activeInputHelperRequestType;
    });
  // console.log(`[${utility.currentFileName}::(computed)availableOpenAIModelKeys] result: `, result);
  return result;
});


export default () => {
  // === Lifecycle Hooks ===
  onBeforeMount(() => {
    // console.log(`[${utility.currentFileName}::onBeforeMount()]`);

    // Initialize inputHelper composable if necessary
    if (!inputHelper) {
      // console.log(`[${utility.currentFileName}::onBeforeMount()] Initializing inputHelper`);
      inputHelper = useInputHelper();
    }
  });


  return {
    activeInputHelper,
    activeInputHelperIndex,
    activeOpenAIModelKey,
    availableOpenAIModelKeys,
    // Note: state only necessary for testing
    // state,
  }
};

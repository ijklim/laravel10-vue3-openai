import { defineAsyncComponent, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import { OPENAI_REQUEST_TYPES } from '@/utilities/constants.js';

// Note: Initializing here will cause error `inject() can only be used inside setup() or functional components.`
let route = null;

const components = shallowRef([]);

export default () => {
  // Initialize route composable if necessary
  route = route ?? useRoute();

  // Initialize component array
  components.value = [];

  // Build the list of available Input Helpers
  // Note: If componentDrawer exists, it will be used in AppDrawer
  components.value.push({
    component: defineAsyncComponent(() => import('@/components/InputHelpers/Standard.vue')),
    name: 'Standard',
    requestType: OPENAI_REQUEST_TYPES.CHAT,
  });

  components.value.push({
    component: defineAsyncComponent(() => import('@/components/InputHelpers/ImageGeneration.vue')),
    componentDrawer: defineAsyncComponent(() => import('@/components/InputHelpers/ImageGenerationDrawer.vue')),
    name: 'Image Generator',
    requestType: OPENAI_REQUEST_TYPES.IMAGE,
  });

  // Cover Letter is available if query string `?helper=cl` exists
  if (route?.query?.helper === 'cl') {
    components.value.push({
      component: defineAsyncComponent(() => import('@/components/InputHelpers/CoverLetter.vue')),
      name: 'Cover Letter',
      requestType: OPENAI_REQUEST_TYPES.CHAT,
    });
  }

  return {
    components,
  };
};

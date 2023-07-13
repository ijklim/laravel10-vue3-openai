import { computed, defineAsyncComponent, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import { OPENAI_REQUEST_TYPES } from '@/utilities/constants.js';

// Note: Initializing here will cause error `inject() can only be used inside setup() or functional components.`
let route = null;

// const components = shallowRef([]);
const components = computed(() => {
  if (!route) {
    return [];
  }

  const results = [];

  // Build the list of available Input Helpers
  // Note: If componentDrawer exists, it will be used in AppDrawer
  results.push({
    component: defineAsyncComponent(() => import('@/components/InputHelpers/Standard.vue')),
    name: 'Standard',
    requestType: OPENAI_REQUEST_TYPES.CHAT,
  });

  results.push({
    component: defineAsyncComponent(() => import('@/components/InputHelpers/ImageGeneration/index.vue')),
    componentDrawer: defineAsyncComponent(() => import('@/components/InputHelpers/ImageGeneration/Drawer.vue')),
    name: 'Image Generator',
    requestType: OPENAI_REQUEST_TYPES.IMAGE,
  });

  // Cover Letter is available if query string `?helper=cl` exists
  if (route?.query?.helper === 'cl') {
    results.push({
      component: defineAsyncComponent(() => import('@/components/InputHelpers/CoverLetter.vue')),
      name: 'Cover Letter',
      requestType: OPENAI_REQUEST_TYPES.CHAT,
    });
  }

  return results;
})


export default () => {
  // Initialize route composable if necessary
  route = route ?? useRoute();


  return {
    components,
  };
};

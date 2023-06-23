import { defineAsyncComponent, shallowRef } from 'vue';

const components = shallowRef([]);

export default (route) => {
  // Build the list of available Input Helpers
  components.value.push({
    name: 'Standard',
    component: defineAsyncComponent(() => import('@/components/InputHelpers/Standard.vue')),
  });
  components.value.push({
    name: 'Image Generator',
    component: defineAsyncComponent(() => import('@/components/InputHelpers/ImageGeneration.vue')),
  });
  // Cover Letter is available if query string `?helper=cl` exists
  if (route?.query?.helper === 'cl') {
    components.value.push({
      name: 'Cover Letter',
      component: defineAsyncComponent(() => import('@/components/InputHelpers/CoverLetter.vue')),
    });
  }

  return {
    components,
  };
};

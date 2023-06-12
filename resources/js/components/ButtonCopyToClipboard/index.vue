<template>
  <VBtn
    class="mb-2"
    color="info"
    prepend-icon="mdi-content-copy"
    @click="handleCopy"
  >
    {{ buttonText ?? buttonTextOriginal }}
  </VBtn>
</template>

<script>
import { isProxy, toRaw } from 'vue';

export default {
  props: {
    buttonTextOriginal: {
      type: String,
      default: 'Copy To Clipboard',
    },
    contentToCopy: {
      type: [Array, String],
      default: null,
    },
  },
  data() {
    return {
      buttonText: null,
    }
  },
  methods: {
    handleCopy() {
      this.buttonText = 'Copying...';

      // Note: isProxy is provided by Vue3 to work with ref object
      const content = isProxy(this.contentToCopy) ? toRaw(this.contentToCopy) : this.contentToCopy;
      navigator.clipboard.writeText(content);
      // console.log(`[${import.meta.url.split('?')[0].split('/').slice(3).join('/')}::handleCopy()] this.contentToCopy`, this.contentToCopy);
      // console.log(`[${import.meta.url.split('?')[0].split('/').slice(3).join('/')}::handleCopy()] content`, content);

      this.buttonText = 'Copyied!';

      setTimeout(() => {
        // Clear button text to revert to original
        this.buttonText = null;
      }, 1500);
    },
  },
}
</script>
<template>
  <VBtn
    color="info"
    prepend-icon="mdi-content-copy"
    @click="handleClick"
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
    handleClick() {
      this.buttonText = 'Copying...';

      // Note: isProxy is provided by Vue3 to work with ref object
      let content = isProxy(this.contentToCopy) ? toRaw(this.contentToCopy) : this.contentToCopy;
      if (Array.isArray(content)) {
        // console.log(`[${import.meta.url.split('?')[0].split('/').slice(3).join('/')}::handleClick()] content`, content);
        content = content.join("\n");
      }
      navigator.clipboard.writeText(content);
      // console.log(`[${import.meta.url.split('?')[0].split('/').slice(3).join('/')}::handleClick()] this.contentToCopy`, this.contentToCopy);

      this.buttonText = 'Copyied!';

      setTimeout(() => {
        // Clear button text to revert to original
        this.buttonText = null;
      }, 1500);
    },
  },
}
</script>
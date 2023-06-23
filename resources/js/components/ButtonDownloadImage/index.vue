<template>
  <VBtn
    color="info"
    prepend-icon="mdi-download"
    @click="handleClick"
  >
    {{ buttonText ?? buttonTextOriginal }}
  </VBtn>
</template>

<script>
export default {
  props: {
    buttonTextOriginal: {
      type: String,
      default: 'Download',
    },
    base64ImageToDownload: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      buttonText: null,
    }
  },
  methods: {
    async handleClick() {
      const tmpDownlaodLink = document.createElement('a');
      tmpDownlaodLink.href = this.base64ImageToDownload;
      tmpDownlaodLink.download = '';
      document.body.appendChild(tmpDownlaodLink);
      tmpDownlaodLink.click();
      document.body.removeChild(tmpDownlaodLink);
    },
  },
}
</script>
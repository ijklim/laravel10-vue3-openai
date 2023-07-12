<script setup>
  defineProps({
    height: {
      type: Number,
      default: 250,
    },
    // e.g. https://amzn.to/3rplmNE
    href: {
      type: String,
      required: true,
    },
    // Note: Images should be in the folder `public/images/Amazon/`
    // Example image value: /images/Amazon/1028240_student_v5_associate_300x250.jpg
    image: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 300,
    },
  });
</script>

<template>
  <a
    target="_blank"
    :href="href"
  >
    <img
      :height="height"
      :src="image"
      :width="width"
    />
  </a>
</template>
<script setup>
  import { ref } from 'vue';
  import AmazonBanner from '@/components/ads/Amazon/Banner.vue';
  import GoogleAdSense from '@/components/ads/GoogleAdSense.vue';

  const numberOfAvailableAds = 3;
  const whichAdToShow = ref(Math.ceil(Math.random() * numberOfAvailableAds));
</script>

<template>
  <!-- === Google AdSense Type: In-feed === -->
  <GoogleAdSense
    v-if="whichAdToShow === 1"
    adFormat="fluid"
    adLayoutKey="-fb+5w+4e-db+86"
    :adSlot="7471404401"
  />

  <!-- === Amazon Prime Student === -->
  <AmazonBanner
    v-if="whichAdToShow === 2"
    href="https://amzn.to/3rplmNE"
    image="/images/Amazon/1028240_student_v5_associate_300x250.jpg"
  />

  <!-- === Amazon Prime === -->
  <AmazonBanner
    v-if="whichAdToShow === 3"
    href="https://amzn.to/43sUolr"
    image="/images/Amazon/AssocAds_GleasonSVOD_300x250.jpg"
  />
</template>
<template>
  <div v-if="svgComponent" class="map-image-wrapper">
    <img class="map-image" :src="svgComponent" alt="country-map" />
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref, watch } from 'vue';

const props = defineProps({
  countryCode: {
    type: String,
    required: true,
  },
});

// Import all SVGs with import.meta.glob
const svgComponent = ref<string | undefined>();


watch(
  () => props.countryCode,
  (newValue) => {
    const filePath = `/countries/${newValue.toLowerCase()}.svg`;
    svgComponent.value = filePath;
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.map-image {
  width: 100%;
  height: 100%;
}
</style>

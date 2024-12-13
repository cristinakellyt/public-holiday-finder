<template>
  <div v-if="svgComponent" class="map-image-wrapper">
    <img class="map-image" :src="svgComponent" alt="country-map" />
  </div>
</template>

<script setup lang="ts">
//Vue
import { ref, watch } from 'vue'

const props = defineProps({
  countryCode: {
    type: String,
    required: true,
  },
})

const svgComponent = ref<string>()

watch(
  () => props.countryCode,
  (newValue) => {
    const filePath = `/src/assets/countries/${newValue.toLowerCase()}.svg`
    svgComponent.value = filePath
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.map-image {
  width: 100%;
  height: 100%;
}
</style>

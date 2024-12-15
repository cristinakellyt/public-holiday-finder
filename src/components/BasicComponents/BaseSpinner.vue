<template>
  <div v-if="isLoading" class="spinner-wrapper">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
})
</script>

<style scoped lang="scss">
.spinner-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa70;
  z-index: 1000;
}

.spinner {
  border: pxToRem(5) solid rgba(0, 0, 0, 0.1);
  border-top: pxToRem(5) solid $color-primary;
  border-radius: 50%;
  width: pxToRem(50);
  height: pxToRem(50);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

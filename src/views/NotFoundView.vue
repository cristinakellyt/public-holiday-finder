<template>
  <div class="not-found-container">
    <h1>404 - Page Not Found</h1>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  h1 {
    font-size: pxToRem(24);
    font-weight: bold;
    color: $color-primary;
  }
}
</style>

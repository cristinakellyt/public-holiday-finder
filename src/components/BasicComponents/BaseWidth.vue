<template>
  <div class="base-width">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.base-width {
  max-width: $max-width;
  margin: 0 auto;
  padding: pxToRem(32);
}
</style>

<template>
  <div class="base-modal">
    <div class="backdrop" @click="close"></div>

    <div class="modal">
      <div class="modal__content">
        <h2>
          <slot name="title"></slot>
        </h2>

        <div>
          <slot name="text"> </slot>
        </div>

        <div v-if="hasButtons" class="modal__content--buttons">
          <slot name="buttons"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  hasButtons: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.base-modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(195, 195, 195, 0.5);
  height: 100%;
  width: 100%;
  z-index: 1000;
}
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $pure-white;
  border-radius: pxToRem(10);
  box-shadow: 0 0 pxToRem(20) pxToRem(-4) rgba(0, 0, 0, 0.1);
  padding: pxToRem(20);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: pxToRem(640);
  width: pxToRem(640);
  z-index: 10000;
  transition: all 0.2s ease-out;

  &__content {
    display: flex;
    flex-direction: column;

    gap: pxToRem(20);
    padding: pxToRem(20) 0;

    &--buttons {
      display: flex;
      justify-content: space-between;
      gap: pxToRem(20);
      margin-top: pxToRem(12);
    }
  }
}

@include media-query($tablet) {
  .modal {
    width: pxToRem(420);
    padding: pxToRem(15) pxToRem(20);

    &__content {
      gap: pxToRem(10);

      h2 {
        margin-bottom: pxToRem(18);
      }

      &--buttons {
        margin-top: pxToRem(32);
      }
    }
  }
}

@include media-query($mobile-large) {
  .modal {
    width: pxToRem(320);
    max-width: pxToRem(320);
  }
}
</style>

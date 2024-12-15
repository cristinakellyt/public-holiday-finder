<template>
  <div
    v-for="(toastsForPosition, position) in toasts"
    :key="position"
    :class="`base-toast-container base-toast-container--${position}`"
  >
    <AnimationTransition group>
      <div
        v-for="toast in toastsForPosition"
        :key="toast.id"
        class="base-toast"
        :class="`base-toast--${toast.type}`"
        role="alert"
        aria-live="assertive"
      >
        <span class="base-toast__message">{{ toast.message }}</span>
        <button class="base-toast__close" @click="removeToast(toast.id, position)">&times;</button>
      </div>
    </AnimationTransition>
  </div>
</template>

<script setup lang="ts">
//Vue
import { onMounted, onUnmounted, reactive } from 'vue'
//Utils
import { toastManager } from '@/utils/ToastManager'
//Types
import { type Toast, ToastPosition } from '@/types/toast'

// Reactive map to hold toasts
const toasts = reactive<Record<ToastPosition, Toast[]>>({
  'top-center': [],
  'bottom-center': [],
  'top-right': [],
  'top-left': [],
  'bottom-right': [],
  'bottom-left': [],
})

const updateToasts = (newToasts: Record<ToastPosition, Toast[]>) => {
  // Deep update toasts
  for (const position in newToasts) {
    toasts[position as ToastPosition] = [...newToasts[position as ToastPosition]]
  }
}

const removeToast = (id: number, position: ToastPosition) => {
  toastManager.removeToast(id, position)
}

onMounted(() => {
  // Subscribe to toast manager to get toasts updates
  toastManager.subscribe(updateToasts)
})

onUnmounted(() => {
  // Unsubscribe from toast manager when component is unmounted to prevent memory leaks and unnecessary updates
  toastManager.unsubscribe(updateToasts)
})
</script>

<style scoped lang="scss">
.base-toast-container {
  z-index: 1000;
  position: fixed;
  max-width: max-content;
}

.base-toast-container--top-center {
  bottom: unset;
  top: pxToRem(32);
  left: 50%;
  transform: translateX(-50%);
}

.base-toast-container--bottom-center {
  top: unset;
  bottom: pxToRem(32);
  left: 50%;
  transform: translateX(-50%);
}

.base-toast-container--top-right {
  top: pxToRem(32);
  right: pxToRem(32);
}

.base-toast-container--top-left {
  top: pxToRem(32);
  left: pxToRem(32);
}

.base-toast-container--bottom-right {
  bottom: pxToRem(32);
  right: pxToRem(32);
}

.base-toast-container--bottom-left {
  bottom: pxToRem(32);
  left: pxToRem(32);
}

.base-toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: pxToRem(10);
  margin-bottom: pxToRem(10);
  padding: pxToRem(10) pxToRem(20);
  border-radius: pxToRem(5);
  font-size: pxToRem(14);
  min-width: pxToRem(300);
  box-shadow: 0 pxToRem(2) pxToRem(10) rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;

  &__message {
    font-weight: 600;
  }
}

.base-toast--success {
  background-color: #d4edda;
  color: #155724;
}

.base-toast--error {
  background-color: #f8d7da;
  color: #721c24;
}

.base-toast--info {
  background-color: #cce5ff;
  color: #004085;
}

.base-toast--warning {
  background-color: #fff3cd;
  color: #856404;
}

.base-toast__close {
  background: none;
  border: none;
  font-size: pxToRem(24);
  color: inherit;
  cursor: pointer;
}
</style>

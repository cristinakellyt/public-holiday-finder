<template>
  <RouterLink v-if="path" :to="path" class="router-button" role="link">
    <button :type="buttonType" :class="classes">
      <img v-if="iconBefore" :src="iconBefore" alt="icon" class="button-icon" />
      <span class="button-text">{{ text }}</span>
      <img v-if="icon" :src="icon" alt="icon" class="button-icon" />
    </button>
  </RouterLink>

  <button v-else :type="buttonType" :class="classes">
    <img v-if="iconBefore" :src="iconBefore" alt="icon" class="button-icon" />
    <span class="button-text">{{ text }}</span>
    <img v-if="icon" :src="icon" alt="icon" class="button-icon" />
  </button>
</template>

<script setup lang="ts">
//Vue
import { computed } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  /**
   * The text of the button
   */
  text: {
    type: String,
    default: 'Button text',
  },
  /**
   * Button style - 'primary', 'secondary', 'tertiary', 'inverted', or 'clean'
   */
  buttonStyle: {
    type: String as PropType<'primary' | 'secondary' | 'tertiary' | 'inverted' | 'clean'>,
    default: 'primary',
  },
  /**
   * Button size - 'small', 'medium', or 'large'
   */
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'small',
  },
  /**
   * Button type - 'button', 'submit', or 'reset'
   */
  buttonType: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
  /**
   * Path to navigate to (used in <RouterLink>)
   */
  path: {
    type: Object,
    default: null,
  },
  /**
   * If the button is disabled
   */
  isDisabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Icon URL for the button
   */
  icon: {
    type: String,
    default: null,
  },
  /**
   * Icon URL to display before the text
   */
  iconBefore: {
    type: String,
    default: null,
  },
  /**
   * Additional class for the button
   */
  extraClass: {
    type: String,
    default: null,
  },
})

const classes = computed(() => [
  props.size,
  props.buttonStyle,
  {
    'button-wrapper': true,
    'is-disabled': props.isDisabled,
    [props.extraClass || '']: true,
  },
])
</script>

<style scoped lang="scss">
.router-button {
  width: 100%;
}

.button-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: pxToRem(8);
  width: 100%;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: pxToRem(12);
  font-size: pxToRem(15);
  font-weight: 500;
  font-family: $main-font-family;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &.primary {
    background-color: $color-primary;
    color: $pure-white;
    border: pxToRem(1) solid $color-primary;

    &:hover {
      background-color: $color-primary-2;
    }
  }

  &.secondary {
    background-color: $color-primary-2;
    color: $pure-white;
    border: pxToRem(1) solid $color-primary-2;

    &:hover {
      box-shadow: pxToRem(2) pxToRem(2) pxToRem(5) 0 $gray-300;
    }
  }

  &.inverted {
    background-color: $pure-white;
    border: pxToRem(1) solid $color-primary;
    color: $color-primary;

    &:hover {
      box-shadow: pxToRem(2) pxToRem(2) pxToRem(5) 0 $gray-300;
    }
  }

  &.tertiary {
    background-color: $red;
    color: $pure-white;
    border: pxToRem(1) solid $red;

    &:hover {
      box-shadow: pxToRem(2) pxToRem(2) pxToRem(5) 0 $gray-300;
    }
  }

  &.clean {
    background-color: transparent;
    color: $gray-500;
    border: pxToRem(1) solid $gray-400;
    border-radius: pxToRem(4);

    &:hover {
      box-shadow: 0 0 pxToRem(5) 0 $gray-300;
    }
  }

  &.small {
    padding: pxToRem(8) pxToRem(16);
  }

  &.medium {
    padding: pxToRem(10) pxToRem(20);
  }

  &.large {
    padding: pxToRem(12) pxToRem(24);
  }

  &.is-disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
  }
}

@include media-query($tablet) {
  .button-wrapper {
    &.small {
      font-size: pxToRem(10);
    }

    &.medium {
      font-size: pxToRem(12);
    }

    &.large {
      font-size: pxToRem(14);
    }
  }
}
</style>

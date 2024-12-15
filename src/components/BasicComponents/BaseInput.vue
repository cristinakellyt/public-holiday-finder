<template>
  <div class="input-wrapper">
    <label :for="fieldName" class="input-label">{{ labelText }}</label>

    <input
      :id="fieldName"
      v-model="inputValue"
      :class="{ 'input-element': true, [extraClass]: !!extraClass, error: textError || apiError }"
      :name="fieldName"
      :type="type"
      :placeholder="placeholder"
      :readonly="isReadOnly"
      :maxlength="maxLength"
      :minlength="minLength"
      :required="isRequired"
      @input="onInput"
      @focus="onFocus"
    />
    <span class="input-extra"><slot name="input-extra"></slot></span>

    <span v-if="textError" class="text-error">{{ textError }}</span>
  </div>
</template>

<script setup lang="ts">
//Vue
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * The type of the input
     */
    type?: 'text' | 'number'
    /**
     * The placeholder of the input
     */
    placeholder?: string
    /**
     * The fieldName of the input
     */
    fieldName: string
    /**
     * The value of the input
     */
    input?: string | number | undefined
    /**
     * If is readonly
     */
    isReadOnly?: boolean
    /**
     * debounce
     */
    debounce?: number
    /**
     * Max length
     */
    maxLength?: number
    /**
     * Min length
     */
    minLength?: number
    /**
     * label text
     */
    labelText?: string
    /**
     * extra class
     */
    extraClass?: string
    /**
     * text error
     */
    textError?: string | null
    /**
     * apiError
     */
    apiError?: boolean
    /**
     * required
     */
    isRequired?: boolean
  }>(),
  {
    type: 'text',
    input: '',
    placeholder: 'Type here...',
    isReadonly: false,
    debounce: 0,
    extraClass: '',
    isRequired: true,
    maxLength: 1000,
    minLength: 0,
    labelText: '',
    textError: null,
  },
)

const emit = defineEmits<{
  (e: 'inputChange', value: string): void
  (e: 'focus'): void
}>()

const inputValue = ref<string>()
const inputTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

// watch for changes in the input props
watch(
  () => props.input,
  (newValue) => {
    inputValue.value = String(newValue)
  },
  { immediate: true },
)

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  inputValue.value = target.value
  if (inputTimeout.value) {
    clearTimeout(inputTimeout.value)
  }
  inputTimeout.value = setTimeout(() => {
    emit('inputChange', inputValue.value || '')
  }, props.debounce)
}

const onFocus = () => {
  emit('focus')
}

//watch input to check max length
watch(inputValue, (newValue) => {
  if (newValue && newValue.length > props.maxLength) {
    inputValue.value = newValue.slice(0, props.maxLength)
    emit('inputChange', inputValue.value || '')
  }
})
</script>

<style scoped lang="scss">
.input-wrapper {
  @include flex-direction-align-justify(row, pxToRem(15), center, flex-start);
  position: relative;
  width: 100%;

  .input-label {
    font-size: pxToRem(14);
    font-weight: 500;
    text-wrap: nowrap;
  }

  .input-element {
    width: 100%;
    background-color: $pure-white;
    transition: border-color 0.2s;
    font-family: $main-font-family;
    border: pxToRem(1) solid $gray-300;
    border-radius: pxToRem(5);
    padding: pxToRem(8) pxToRem(10);
    font-size: pxToRem(14);
    font-weight: 500;
    color: $gray-900;
    position: relative;

    &::placeholder {
      color: $gray-400;
      font-size: pxToRem(12);
      font-weight: 400;
    }

    &:focus {
      outline: none;
      border-color: $color-primary;
    }

    &.error {
      border-color: $red;
    }
  }

  .input-extra {
    position: absolute;
    top: 50%;
    right: pxToRem(8);
    transform: translateY(-50%);
  }

  .text-error {
    position: absolute;
    right: 0;
    bottom: pxToRem(-25);
    transform: translateY(-30%);
    font-size: pxToRem(12);
    color: $red;
    margin-top: pxToRem(5);
  }
}
</style>

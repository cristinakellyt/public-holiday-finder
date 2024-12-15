<template>
  <div class="search-bar-wrapper">
    <img :class="`search-icon ${size}`" :src="icSearch" alt="search" />
    <input
      id="search-input"
      v-model.trim="searchKey"
      class="search-input"
      :class="`${size}`"
      type="text"
      :placeholder="placeholder"
      :aria-label="placeholder"
      @input="onInputSearch"
      @keydown.down.prevent="emit('onArrowDown')"
      @keydown.up.prevent="emit('onArrowUp')"
      @keydown.enter="emit('onEnter')"
    />
    <img
      v-show="searchKey"
      :class="`clear-icon ${size}`"
      :src="icClear"
      alt="clear"
      @click="onClearSearchKey"
    />
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref, type PropType, watch } from 'vue'
// Icons
import icSearch from '@/assets/icons/ic_search.svg'
import icClear from '@/assets/icons/ic_close-circle.svg'

const emit = defineEmits(['onSearch', 'onArrowDown', 'onArrowUp', 'onEnter'])

const props = defineProps({
  size: {
    type: String as PropType<'large' | 'small'>,
    default: 'large',
  },
  placeholder: {
    type: String,
    default: 'Search',
  },
  debounceTime: {
    type: Number,
    default: 0,
  },
  searchQuery: {
    type: String,
    default: '',
  },
})

const queryTimeout = ref<ReturnType<typeof setTimeout>>()
const searchKey = ref(props.searchQuery)

const onInputSearch = () => {
  clearTimeout(queryTimeout.value)

  // Set timeout to emit search event after timeBeforeSearch
  queryTimeout.value = setTimeout(() => {
    emit('onSearch', searchKey.value)
  }, props.debounceTime)
}

// Function to clear search key
const onClearSearchKey = () => {
  searchKey.value = ''
  emit('onSearch', searchKey.value)
}

//watch searchQuery
watch(
  () => props.searchQuery,
  (newVal) => {
    searchKey.value = newVal
  },
)
</script>

<style scoped lang="scss">
.search-bar-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: transparent;
  position: relative;
  border-bottom: pxToRem(1.5) solid $gray-300;
  transition: border-bottom 0.3s ease;

  & .search-input:focus {
    outline: none;
  }

  &:focus-within {
    border-bottom: pxToRem(1.5) solid $color-primary;
  }
}

.search-input {
  width: 100%;
  border-radius: pxToRem(4);
  border: none;
  font-family: $main-font-family;
  font-weight: 500;
  background-color: transparent;
  color: $gray-900;

  &::placeholder {
    color: $gray-600;
    font-size: inherit;
    font-weight: 400;
  }

  &.large {
    padding: pxToRem(15) pxToRem(20) pxToRem(15) 0;
    font-size: pxToRem(14);
  }

  &.small {
    padding: pxToRem(10) pxToRem(15) pxToRem(10) 0;
    font-size: pxToRem(12);
  }
}

.search-icon {
  margin: 0 pxToRem(10);

  &.large {
    width: pxToRem(24);
    height: pxToRem(24);
  }

  &.small {
    width: pxToRem(20);
    height: pxToRem(20);
  }
}

.clear-icon {
  position: absolute;
  right: pxToRem(10);
  cursor: pointer;

  &.large {
    width: pxToRem(24);
    height: pxToRem(24);
  }

  &.small {
    width: pxToRem(20);
    height: pxToRem(20);
  }
}
</style>

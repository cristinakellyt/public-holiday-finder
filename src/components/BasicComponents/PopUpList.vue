<template>
  <div class="backdrop" @click="emit('closePopUpList')"></div>
  <ul class="pop-up-list-wrapper">
    <p class="pop-up-list-error" v-if="searchError">
      Sorry, something went wrong with the search, please try again.
    </p>

    <p
      class="pop-up-list-error"
      v-if="!searchError && locationsResult && locationsResult.length === 0"
    >
      No results match your search, try a different term.
    </p>

    <template v-else>
      <li
        v-for="(result, index) in locationsResult"
        :key="result.countryCode"
        class="pop-up-list-item"
        :class="{ selected: selectedIndex === index }"
        @click="emit('selectLocation', result)"
        @mouseover="selectedIndex = index"
        @keydown.enter="emit('selectLocation', result)"
        ref="listItems"
        tabindex="0"
      >
        {{ result.name }}
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
// Vue
import { ref, watch } from 'vue'
import type { PropType } from 'vue'
// Types
import type { Country } from '@/types/country'

const props = defineProps({
  locationsResult: {
    type: Array as PropType<Country[] | null>,
    required: true,
  },
  searchError: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['selectLocation', 'closePopUpList'])
const selectedIndex = ref(-1)
const listItems = ref<HTMLElement[]>([])

// Reset selection when results change
watch(
  () => props.locationsResult,
  () => {
    selectedIndex.value = -1
  },
)

// Expose methods to the parent component to make the component accessible for keyboard navigation
defineExpose({
  moveUp() {
    if (props.locationsResult && props.locationsResult.length > 0) {
      if (selectedIndex.value <= 0) {
        selectedIndex.value = props.locationsResult.length - 1
      } else {
        selectedIndex.value--
      }
      scrollToSelected()
    }
  },
  moveDown() {
    if (props.locationsResult && props.locationsResult.length > 0) {
      if (selectedIndex.value >= props.locationsResult.length - 1) {
        selectedIndex.value = 0
      } else {
        selectedIndex.value++
      }
      scrollToSelected()
    }
  },
  selectCurrent() {
    if (selectedIndex.value >= 0 && props.locationsResult) {
      emit('selectLocation', props.locationsResult[selectedIndex.value])
    }
  },
})

const scrollToSelected = () => {
  if (listItems.value[selectedIndex.value]) {
    listItems.value[selectedIndex.value].scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  }
}
</script>

<style scoped lang="scss">
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 999;
}

.pop-up-list-wrapper {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: pxToRem(200);
  overflow-y: auto;
  background-color: $gray-200;
  z-index: 1000;
  border-radius: pxToRem(4);

  .pop-up-list-item,
  .pop-up-list-error {
    cursor: pointer;
    padding: pxToRem(10);
    font-weight: 500;
    color: $text-color;
  }

  .pop-up-list-item {
    &.selected {
      background-color: $green-1;
    }
  }
}
</style>

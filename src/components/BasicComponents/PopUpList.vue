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
        class="pop-up-list-item"
        v-for="result in locationsResult"
        :key="result.countryCode"
        @click="emit('selectLocation', result)"
        @keydown.enter="emit('selectLocation', result)"
        tabindex="0"
      >
        {{ result.name }}
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
//Vue
import { type PropType } from 'vue'
// Types
import type { Country } from '@/types/country'

defineProps({
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
    &:hover {
      background-color: $green-1;
    }
  }
}
</style>

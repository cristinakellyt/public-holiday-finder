<template>
  <div class="pagination">
    <button class="pagination-button" @click="goToFirstPage" :disabled="currentPage === 1">
      <img :src="icDoubleLeftArrow" alt="double-left-arrow" />
    </button>
    <button class="pagination-button" @click="goToPreviousPage" :disabled="currentPage === 1">
      <img :src="icLeftArrow" alt="left-arrow" />
    </button>
    <span class="pagination-text">{{ actualPage }} / {{ totalPages }}</span>
    <button class="pagination-button" @click="goToNextPage" :disabled="currentPage === totalPages">
      <img :src="icRightArrow" alt="right-arrow" />
    </button>
    <button class="pagination-button" @click="goToLastPage" :disabled="currentPage === totalPages">
      <img :src="icDoubleRightArrow" alt="double-right-arrow" />
    </button>
  </div>
</template>

<script setup lang="ts">
//Vue
import { ref, computed, watch } from 'vue'
//Icons
import icDoubleLeftArrow from '@/assets/icons/ic_double_left_arrow.svg'
import icLeftArrow from '@/assets/icons/ic_left_arrow.svg'
import icRightArrow from '@/assets/icons/ic_right_arrow.svg'
import icDoubleRightArrow from '@/assets/icons/ic_double_right_arrow.svg'

const emit = defineEmits(['updateCurrentPage'])
const props = defineProps({
  pageSize: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
})

const actualPage = ref(props.currentPage)

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.pageSize)
})

function goToNextPage() {
  if (actualPage.value < totalPages.value) {
    actualPage.value++
  }
  emit('updateCurrentPage', actualPage.value)
}

function goToPreviousPage() {
  if (actualPage.value > 1) {
    actualPage.value--
  }
  emit('updateCurrentPage', actualPage.value)
}

function goToFirstPage() {
  actualPage.value = 1
  emit('updateCurrentPage', actualPage.value)
}

function goToLastPage() {
  actualPage.value = totalPages.value
  emit('updateCurrentPage', actualPage.value)
}

// Watch props.currentPage, if it changes, update actualPage
watch(
  () => props.currentPage,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      actualPage.value = newValue
    }
  },
)
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  gap: pxToRem(10);
  font-weight: 500;
  width: 100%;

  .pagination-button {
    padding: pxToRem(2);
    border-radius: pxToRem(50);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: $green-1;
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }

    & img {
      height: pxToRem(24);
    }
  }

  .pagination-text {
    color: $color-primary-2;
    font-weight: 500;
  }
}
</style>

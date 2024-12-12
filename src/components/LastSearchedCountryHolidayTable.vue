<template>
  <div class="last-searched-country-wrapper">
    <BaseTable :table-data="tableData" :options="tableOptions">
      <template #title>
        <h2 class="title">
          Public Holidays for {{ lastCountrySearched.countryName }}
          <img
            v-if="lastCountrySearched.countryFlagUrl"
            :src="lastCountrySearched.countryFlagUrl"
            alt="country-flag"
          />
        </h2>
        <p class="subtitle">*This was your last searched country</p>
      </template>

      <template #date="{ rowData }">
        {{ dateFormatter(rowData.date) }}
      </template>

      <template #name="{ rowData }">
        <div class="centralized-container" @click="goToURL(rowData.wikipediaLink)">
          <span class="name" :class="{ link: rowData.wikipediaLink }">{{ rowData.name }}</span>
          <img
            v-if="rowData.wikipediaLink"
            :src="icRedirectLink"
            alt="redirect-link"
            class="redirect-link"
          />
        </div>
      </template>
    </BaseTable>
    <BasePagination
      v-if="lastCountrySearched.holidays.length > pageSize"
      :page-size="pageSize"
      :total-items="lastCountrySearched.holidays.length"
      :current-page="currentPage"
      @updateCurrentPage="updatePage"
    />
  </div>
</template>

<script setup lang="ts">
//Vue
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
//Types
import type { TableOptions } from '@/types/tableOptions'
//Stores
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'
//Utils
import dateFormatter from '@/utils/dateFormatter'
import goToURL from '@/utils/goToURL'
//Icons
import icRedirectLink from '@/assets/icons/ic_redirect_link.svg'

const lastCountrySearchedStore = useLastCountrySearchedStore()
const { lastCountrySearched } = storeToRefs(lastCountrySearchedStore)
const tableData = ref(lastCountrySearched.value.holidays)
const currentPage = ref(1)
const pageSize = ref(5)

const tableOptions = ref<TableOptions>({
  headings: {
    date: 'Date',
    name: 'Name',
  },
})

const updatePage = (page: number) => {
  currentPage.value = page
  getPaginatedData()
}

const getPaginatedData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = currentPage.value * pageSize.value
  tableData.value = lastCountrySearched.value.holidays.slice(startIndex, endIndex)
}

onMounted(() => {
  getPaginatedData()
})
</script>

<style scoped lang="scss">
.last-searched-country-wrapper {
  max-width: pxToRem(800);
}

.title {
  @include flex-gap(row, pxToRem(10), center, center);
}

.subtitle {
  font-size: pxToRem(12);
  color: $pure-white;
  font-weight: 500;
}

.name {
  .link {
    text-decoration: underline;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: $color-primary;
    }
  }
}

.centralized-container {
  @include flex-gap(row, pxToRem(10), center, flex-start);
  width: max-content;
}

.redirect-link {
  width: pxToRem(16);
  height: pxToRem(16);
  cursor: pointer;
}
</style>

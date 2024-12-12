<template>
  <div>
    <BaseTable :table-data="lastCountrySearched.holidays" :options="tableOptions">
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
        <div class="centralized-container" @click="goToHolidayInfo(rowData.wikipediaLink)">
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
  </div>
</template>

<script setup lang="ts">
//Vue
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
//Types
import type { TableOptions } from '@/types/tableOptions'
//Stores
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'
//Utils
import dateFormatter from '@/utils/dateFormatter'
//Icons
import icRedirectLink from '@/assets/icons/ic_redirect_link.svg'

const lastCountrySearchedStore = useLastCountrySearchedStore()
const { lastCountrySearched } = storeToRefs(lastCountrySearchedStore)

const tableOptions = ref<TableOptions>({
  headings: {
    date: 'Date',
    name: 'Name',
  },
})

const goToHolidayInfo = (wikipediaLink: string) => {
  if (wikipediaLink) {
    window.open(wikipediaLink, '_blank')
  }
}
</script>

<style scoped lang="scss">
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

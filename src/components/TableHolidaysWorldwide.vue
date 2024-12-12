<template>
  <BaseTable
    class="table-holidays-worldwide"
    v-if="publicHolidaysWorldwide.length > 0"
    :options="tableOptions"
    :table-data="publicHolidaysWorldwide"
  >
    <template #title>
      <h2>Public Holidays Worldwide</h2>
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
    <template #country="{ rowData }">
      <div class="centralized-container">
        <img v-if="rowData.flagUrl" :src="rowData.flagUrl" alt="country-flag" />
        <span>{{ rowData.countryName }}</span>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
//Vue
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
//Utils
import dateFormatter from '@/utils/dateFormatter'
//Icons
import icRedirectLink from '@/assets/icons/ic_redirect_link.svg'

const publicHolidaysStore = usePublicHolidaysStore()

const tableOptions = {
  headings: {
    date: 'Date',
    name: 'Name',
    country: 'Country',
  },
}

const { publicHolidaysWorldwide } = storeToRefs(publicHolidaysStore)

//Fetch public holidays worldwide and fill data with flags and country name to display in table
onMounted(async () => {
  try {
    await publicHolidaysStore.fetchPublicHolidaysWorldwide()
  } catch (error) {
    console.error(error)
  }
})

const goToHolidayInfo = (wikipediaLink: string) => {
  if (wikipediaLink) {
    window.open(wikipediaLink, '_blank')
  }
}
</script>

<style scoped lang="scss">
.table-holidays-worldwide {
  display: flex;
  flex-direction: column;
  align-items: center;
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

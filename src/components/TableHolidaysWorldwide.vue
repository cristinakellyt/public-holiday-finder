<template>
  <BaseTable
    class="table-holidays-worldwide"
    v-if="tableData.length > 0"
    :options="tableOptions"
    :tableData="tableData"
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
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
//Types
import type { PublicHoliday } from '@/types/publicHolidays'
//Utils
import dateFormatter from '@/utils/dateFormatter'
import getWikipediaLink from '@/utils/wikipediaPage'
import fetchCountryFlag from '@/utils/countryFlag'
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

const { publicHolidaysWorldwide, availableCountries } = storeToRefs(publicHolidaysStore)

const tableData = ref<PublicHoliday[]>([])

//Fetch public holidays worldwide and fill data with flags and country name to display in table
onMounted(async () => {
  try {
    await publicHolidaysStore.fetchPublicHolidaysWorldwide()
    const holidays = JSON.parse(JSON.stringify(publicHolidaysWorldwide.value))
    //Fill data with flags by calling fillDataWithFlags
    await Promise.all(
      holidays.map(async (holiday: PublicHoliday) => {
        const flagUrl = await fetchCountryFlag(holiday.countryCode)
        holiday.flagUrl = flagUrl
      }),
    )
    //Fill data with country name
    holidays.map((holiday: PublicHoliday) => {
      const countryName = availableCountries.value.find(
        (country) => country.countryCode === holiday.countryCode,
      )?.name
      holiday.countryName = countryName
    })

    //Fill data with wikipedia link
    await Promise.all(
      holidays.map(async (holiday: PublicHoliday) => {
        holiday.wikipediaLink = await getWikipediaLink(holiday.name)
      }),
    )

    tableData.value = holidays
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

<template>
  <main>
    <BaseWidth v-if="availableCountries.length > 0">
      <SearchCountry />
      <TableHolidaysWorldwide />
      <LastSearchedCountryHolidayTable
        v-if="lastCountrySearched.countryCode && lastCountrySearched.holidays.length > 0"
      />
    </BaseWidth>
  </main>
</template>

<script setup lang="ts">
//Vue
import { storeToRefs } from 'pinia'
//Components
import SearchCountry from '@/components/SearchCountry.vue'
import TableHolidaysWorldwide from '@/components/TableHolidaysWorldwide.vue'
import LastSearchedCountryHolidayTable from '@/components/LastSearchedCountryHolidayTable.vue'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'

const publicHolidaysStore = usePublicHolidaysStore()
const lastCountrySearchedStore = useLastCountrySearchedStore()

const { lastCountrySearched } = storeToRefs(lastCountrySearchedStore)
const { availableCountries } = storeToRefs(publicHolidaysStore)
</script>

<style scoped lang="scss"></style>

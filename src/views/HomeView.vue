<template>
  <main>
    <BaseWidth>
      <SearchCountry />
      <MapComponent
        :clickable-countries="getCountriesNames"
        @onCountrySelected="onCountrySelected"
        :selected-country="lastCountrySearched.name"
      />
      <p class="error-message" v-if="availableCountries.length === 0">
        Sorry, we are experiencing issues, please try again later.
      </p>
      <CountryDetailSection
        v-if="lastCountrySearched.countryCode && lastCountrySearched.holidays.length > 0"
      />
      <TableHolidaysWorldwide />
    </BaseWidth>
  </main>
</template>

<script setup lang="ts">
//Vue
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
//Components
import SearchCountry from '@/components/SearchCountry.vue'
import TableHolidaysWorldwide from '@/components/TableHolidaysWorldwide.vue'
import MapComponent from '@/components/MapComponent.vue'
import CountryDetailSection from '@/components/CountryDetailSection .vue'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'

const publicHolidaysStore = usePublicHolidaysStore()
const lastCountrySearchedStore = useLastCountrySearchedStore()

const { lastCountrySearched } = storeToRefs(lastCountrySearchedStore)
const { availableCountries } = storeToRefs(publicHolidaysStore)

const getCountriesNames = computed(() => availableCountries.value.map((country) => country.name))

// Find country code selected in the map and set it in the store
const onCountrySelected = async (countryName: string) => {
  const countryCode = availableCountries.value.find(
    (country) => country.name === countryName,
  )?.countryCode
  if (countryCode) {
    await lastCountrySearchedStore.setLastCountrySearched(countryCode)
  }
}
</script>

<style scoped lang="scss">
.error-message {
  text-align: center;
  margin-top: pxToRem(20);
  color: $red;
}
</style>

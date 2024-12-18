<template>
  <main>
    <BaseWidth>
      <SearchCountry />
      <MapComponent
        class="display-map"
        :clickable-countries="getCountriesNames"
        @onCountrySelected="onCountrySelected"
        :selected-country="lastCountrySearched.name"
      />
      <!-- Error Message for when there are no countries available or if the last country searched is not available -->
      <p
        class="error-message"
        v-if="(availableCountries.length === 0 && !loadingStatus) || errorStatus"
      >
        Sorry, we are experiencing issues, please try again later.
      </p>
      <!-- Loading Status -->
      <BaseSpinner :isLoading="firstLoad && loadingStatus" />
      <!-- Country Detail Section -->
      <CountryDetailSection
        v-if="lastCountrySearched.countryCode && lastCountrySearched.holidays"
      />
      <TableHolidaysWorldwide />
    </BaseWidth>
  </main>
</template>

<script setup lang="ts">
//Vue
import { storeToRefs } from 'pinia'
import { computed, watch, ref } from 'vue'
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

const { lastCountrySearched, loadingStatus, errorStatus } = storeToRefs(lastCountrySearchedStore)
const { availableCountries } = storeToRefs(publicHolidaysStore)

const getCountriesNames = computed(() => availableCountries.value.map((country) => country.name))
const firstLoad = ref<boolean>(true)

// Find country code selected in the map and set it in the store
const onCountrySelected = async (countryName: string) => {
  const countryCode = availableCountries.value.find(
    (country) => country.name === countryName,
  )?.countryCode
  if (countryCode) {
    await lastCountrySearchedStore.setLastCountrySearched(countryCode)
  }
}

// When the lastCountrySearched is filled, set the firstLoad to false
// This is used to show the spinner while the lastCountrySearched is filled for the first time
watch(
  () => lastCountrySearched.value,
  () => {
    if (lastCountrySearched.value.countryCode) {
      firstLoad.value = false
    }
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.error-message {
  text-align: center;
  margin-top: pxToRem(20);
  color: $red;
}

@include media-query($tablet) {
  .display-map {
    display: none;
  }
}
</style>

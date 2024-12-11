<template>
  <div class="search-country-wrapper">
    <SearchBar placeholder="Search for a country" :debounce-time="300" @onSearch="fetchLocations" />
    <PopUpList
      v-if="filteredCountries !== null || searchKey"
      :locations-result="filteredCountries"
      :search-error="searchError"
      @select-location="selectLocation"
    />
  </div>
</template>

<script setup lang="ts">
//Vue
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
// Components
import SearchBar from '@/components/BasicComponents/SearchBar.vue'
import PopUpList from '@/components/BasicComponents/PopUpList.vue'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
// Types
import type { Country } from '@/types/country'

const publicHolidaysStore = usePublicHolidaysStore()

onMounted(async () => {
  try {
    await publicHolidaysStore.fetchAvailableCountries()
  } catch (error) {
    searchError.value = true
    console.error(error)
  }
})

const { availableCountries } = storeToRefs(publicHolidaysStore)
const filteredCountries = ref<Country[] | null>(null)
const searchError = ref<boolean>(false)
const searchKey = ref<string>('')

const fetchLocations = (searchQuery: string) => {
  searchKey.value = searchQuery

  // If the search key is empty, set the filtered countries to null
  if (searchQuery === '') {
    filteredCountries.value = null
    return
  }

  // Filter the countries based on the search key
  filteredCountries.value = availableCountries.value.filter((country) => {
    return country.name.toLowerCase().includes(searchQuery.toLowerCase())
  })
}

const selectLocation = (location: Country) => {
  console.log(location)
}
</script>

<style scoped lang="scss">
.search-country-wrapper {
  position: relative;
  max-width: pxToRem(600);
  margin: 0 auto;
}
</style>

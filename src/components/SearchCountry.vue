<template>
  <div
    class="backdrop"
    v-if="filteredCountries !== null || searchKey"
    @click="closePopUpList"
  ></div>
  <div class="search-country-wrapper">
    <SearchBar
      placeholder="Search for a country"
      :debounce-time="200"
      :search-query="searchKey"
      @onSearch="getCountries"
      @onArrowDown="handleArrowDown"
      @onArrowUp="handleArrowUp"
      @onEnter="handleEnter"
    />
    <PopUpList
      v-if="filteredCountries !== null || searchKey"
      ref="popupListRef"
      :locations-result="filteredCountries"
      :search-error="searchError"
      @select-location="selectLocation"
      @close-pop-up-list="closePopUpList"
    />
  </div>
</template>

<script setup lang="ts">
//Vue
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
// Components
import SearchBar from '@/components/BasicComponents/SearchBar.vue'
import PopUpList from '@/components/BasicComponents/PopUpList.vue'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
import { useLastCountrySearchedStore } from '@/stores/lastCountrySearchedStore'
// Types
import type { Country } from '@/types/country'

const publicHolidaysStore = usePublicHolidaysStore()
const lastCountrySearchedStore = useLastCountrySearchedStore()
const { availableCountries } = storeToRefs(publicHolidaysStore)
const filteredCountries = ref<Country[] | null>(null)
const searchKey = ref<string>('')
const popupListRef = ref<InstanceType<typeof PopUpList> | null>(null)

const searchError = computed(() => {
  return availableCountries.value.length === 0
})

const getCountries = (searchQuery: string) => {
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

const selectLocation = async (location: Country) => {
  await lastCountrySearchedStore.setLastCountrySearched(location.countryCode)
  closePopUpList()
}

const closePopUpList = () => {
  filteredCountries.value = null
  searchKey.value = ''
}

const handleArrowDown = () => {
  popupListRef.value?.moveDown()
}

const handleArrowUp = () => {
  popupListRef.value?.moveUp()
}

const handleEnter = () => {
  popupListRef.value?.selectCurrent()
}
</script>

<style scoped lang="scss">
.search-country-wrapper {
  position: relative;
  max-width: pxToRem(600);
  margin: 0 auto pxToRem(16) auto;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
}
</style>

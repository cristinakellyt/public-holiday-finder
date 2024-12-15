<template>
  <main>
    <BaseWidth class="saved-countries-wrapper">
      <h1 class="title">Check your favorite countries</h1>
      <div class="countries-container" v-if="countriesData.length > 0">
        <CountryInfo
          v-for="country in countriesData"
          :key="country.countryCode"
          :country-details="country"
          @onSaved="toggleFavoriteCountry"
        />
      </div>

      <div class="countries-container" v-else>
        <p class="no-countries-message">No favorite countries found. Add some!</p>
        <div class="button-container">
          <BaseButton :text="'Go to home'" :path="{ name: 'home' }" />
        </div>
      </div>
    </BaseWidth>
  </main>
</template>

<script setup lang="ts">
//Vue
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
//Components
import CountryInfo from '@/components/CountryInfo.vue'
//Stores
import { useFavoritesCountriesStore } from '@/stores/favoritesCountriesStore'
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
//Types
import type { CountryInfo as TypeCountryInfo } from '@/types/country'

const favoritesCountriesStore = useFavoritesCountriesStore()
const publicHolidaysStore = usePublicHolidaysStore()
const { favoritesCountries } = storeToRefs(favoritesCountriesStore)

const countriesData = ref<TypeCountryInfo[]>([])

const getCountryInfo = async (countryCode: string) => {
  const countryData = await publicHolidaysStore.getCountryInfo(countryCode)
  countriesData.value.push(countryData)
}

watch(favoritesCountries, async () => {
  countriesData.value = []
  await Promise.all(favoritesCountries.value.map(getCountryInfo))
})

const toggleFavoriteCountry = (value: boolean, countryCode: string) => {
  if (value) {
    favoritesCountriesStore.addFavoriteCountry(countryCode)
  } else {
    favoritesCountriesStore.removeFavoriteCountry(countryCode)
  }
}

onMounted(async () => {
  await Promise.all(favoritesCountries.value.map(getCountryInfo))
})
</script>

<style scoped lang="scss">
.saved-countries-wrapper {
  margin-top: calc($header-height + pxToRem(20));
}

.title {
  margin-bottom: pxToRem(20);
  color: $color-primary-2;
  font-weight: 600;
  text-align: center;
}

.no-countries-message {
  margin-bottom: pxToRem(20);
  color: $color-primary-2;
  font-weight: 600;
  text-align: center;
}

.button-container {
  max-width: pxToRem(200);
  margin: 0 auto;
}
</style>

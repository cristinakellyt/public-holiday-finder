import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
const CONFIG_FAVORITES_COUNTRIES = 'favoritesCountries'

export const useFavoritesCountriesStore = defineStore('favoritesCountries', () => {
  const favoritesCountries = ref<string[]>([])
  const publicHolidaysStore = usePublicHolidaysStore()

  onMounted(() => {
    const storedFavorites = localStorage.getItem(CONFIG_FAVORITES_COUNTRIES)
    if (storedFavorites) {
      favoritesCountries.value = JSON.parse(storedFavorites)
    }
    publicHolidaysStore.updateIfCountryIsFavorite()
  })

  const addFavoriteCountry = (countryCode: string) => {
    favoritesCountries.value.unshift(countryCode)
    localStorage.setItem(CONFIG_FAVORITES_COUNTRIES, JSON.stringify(favoritesCountries.value))
    publicHolidaysStore.updateIfCountryIsFavorite()
  }

  const removeFavoriteCountry = (countryCode: string) => {
    favoritesCountries.value = favoritesCountries.value.filter((code) => code !== countryCode)
    localStorage.setItem(CONFIG_FAVORITES_COUNTRIES, JSON.stringify(favoritesCountries.value))
    publicHolidaysStore.updateIfCountryIsFavorite()
  }

  return { favoritesCountries, addFavoriteCountry, removeFavoriteCountry }
})

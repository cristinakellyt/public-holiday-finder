import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Country } from '@/types/country'
import type { PublicHoliday } from '@/types/publicHolidays'
const API_URL = 'https://date.nager.at/api/v3/'

export const usePublicHolidaysStore = defineStore('publicHolidays', () => {
  const availableCountries = ref<Country[]>([])
  const publicHolidaysWorldwide = ref<PublicHoliday[]>([])

  const fetchAvailableCountries = async () => {
    try {
      const response = await fetch(`${API_URL}AvailableCountries`)
      const data = await response.json()
      availableCountries.value = data
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching available countries')
    }
  }

  const fetchPublicHolidaysWorldwide = async () => {
    try {
      const response = await fetch(`${API_URL}NextPublicHolidaysWorldwide`)
      const data = await response.json()
      publicHolidaysWorldwide.value = data
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching public holidays')
    }
  }

  return {
    availableCountries,
    fetchAvailableCountries,
    publicHolidaysWorldwide,
    fetchPublicHolidaysWorldwide,
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Country } from '@/types/country'

const API_URL = 'https://date.nager.at/api/v3/'

export const usePublicHolidaysStore = defineStore('publicHolidays', () => {
  const availableCountries = ref<Country[]>([])

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

  return { availableCountries, fetchAvailableCountries }
})

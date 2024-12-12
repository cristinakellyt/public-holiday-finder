import { defineStore } from 'pinia'
import { ref } from 'vue'
// Types
import type { Border, CountryInfo } from '@/types/country'
// Stores
import { useCountryFlagStore } from '@/stores/countryFlagStore'

const API_URL = 'https://date.nager.at/api/v3/'

export const useCountryStore = defineStore('country', () => {
  const countryFlagStore = useCountryFlagStore()

  const countryInfo = ref<CountryInfo>({
    commonName: '',
    officialName: '',
    countryCode: '',
    region: '',
    borders: [],
  })

  const fetchCountryInfo = async (countryCode: string) => {
    try {
      const response = await fetch(`${API_URL}CountryInfo/${countryCode}`)
      const data = await response.json()
      data.borders = await addFlagUrlToBorders(data.borders)
      countryInfo.value = data
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching country info')
    }
  }

  const addFlagUrlToBorders = async (borders: Border[]) => {
    return await Promise.all(
      borders.map(async (border) => {
        return {
          ...border,
          flagUrl: await countryFlagStore.getCountryFlag(border.countryCode.toLowerCase()),
        }
      }),
    )
  }

  return {
    fetchCountryInfo,
    countryInfo,
    addFlagUrlToBorders,
  }
})

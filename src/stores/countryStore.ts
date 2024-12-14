import { defineStore } from 'pinia'
import { ref } from 'vue'
// Types
import type { Border, CountryInfo } from '@/types/country'
// Stores
import { useCountryFlagStore } from '@/stores/countryFlagStore'
import { devLog } from '@/utils/logger'

const CONFIG = {
  API_URL: 'https://date.nager.at/api/v3/',
}

export const useCountryStore = defineStore('country', () => {
  const countryFlagStore = useCountryFlagStore()

  const countryInfo = ref<CountryInfo | null>(null)

  const getCountryInfo = async (countryCode: string) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}CountryInfo/${countryCode}`)
      if (!response.ok) return null
      const data = await response.json()
      data.borders = await addFlagUrlToBorders(data.borders)
      countryInfo.value = data
    } catch (error) {
      devLog('Error fetching country info:', error)
      return null
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
    getCountryInfo,
    countryInfo,
    addFlagUrlToBorders,
  }
})

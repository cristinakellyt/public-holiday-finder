import { defineStore } from 'pinia'
import { ref } from 'vue'
import { devLog } from '@/utils/logger'

const CONFIG = {
  STORAGE_KEY: 'countryFlag',
  API_BASE_URL: 'https://flagcdn.com/24x18',
}

type CountryFlag = {
  [key: string]: string
}

export const useCountryFlagStore = defineStore('countryFlag', () => {
  const countriesFlagObj = ref<CountryFlag>({})

  const loadCountryFlag = () => {
    const countryFlagStored = localStorage.getItem(CONFIG.STORAGE_KEY)
    if (countryFlagStored) {
      countriesFlagObj.value = JSON.parse(countryFlagStored)
    }
  }

  const fetchCountryFlag = async (countryCode: string) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/${countryCode}.webp`)
      if (!response.ok) return null

      const flagUrl = response.url
      countriesFlagObj.value[countryCode] = flagUrl
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(countriesFlagObj.value))
      return flagUrl
    } catch (error) {
      devLog("Error while fetching country flag: ", error)
      return null
    }
  }

  const getCountryFlag = async (countryCode: string) => {
    const normalizedCountryCode = countryCode.toLowerCase()
    //if flag already exists, return it else fetch it
    if (countriesFlagObj.value[normalizedCountryCode]) {
      return countriesFlagObj.value[normalizedCountryCode]
    } else {
      return await fetchCountryFlag(normalizedCountryCode)
    }
  }

  return { getCountryFlag, loadCountryFlag }
})

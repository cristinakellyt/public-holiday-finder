import { defineStore } from 'pinia'
import { ref } from 'vue'

const FLAG_URL = 'https://flagcdn.com/24x18'

type CountryFlag = {
  [key: string]: string
}

export const useCountryFlagStore = defineStore('countryFlag', () => {
  const countriesFlagObj = ref<CountryFlag>({})

  const loadCountryFlag = () => {
    const countryFlagStored = localStorage.getItem('countryFlag')
    if (countryFlagStored) {
      countriesFlagObj.value = JSON.parse(countryFlagStored)
    }
  }

  const fetchCountryFlag = async (countryCode: string) => {
    try {
      const response = await fetch(`${FLAG_URL}/${countryCode}.webp`)
      const flagUrl = response.url
      countriesFlagObj.value[countryCode] = flagUrl
      localStorage.setItem('countryFlag', JSON.stringify(countriesFlagObj.value))
      return flagUrl
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching countries flags')
    }
  }

  const getCountryFlag = async (countryCode: string) => {
    const normalizedCountryCode = countryCode.toLowerCase()
    //if flag already exists, return it else fetch it
    if (countriesFlagObj.value[normalizedCountryCode]) {
      return countriesFlagObj.value[normalizedCountryCode]
    } else {
      const flagUrl = await fetchCountryFlag(normalizedCountryCode)
      return flagUrl
    }
  }

  return { countriesFlagObj, getCountryFlag, loadCountryFlag }
})

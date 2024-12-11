import { defineStore } from 'pinia'

const FLAG_URL = 'https://flagcdn.com/24x18'

export const useCountriesStore = defineStore('countriesStore', () => {
  const fetchCountriesFlags = async (codeCountry: string) => {
    try {
      const response = await fetch(`${FLAG_URL}/${codeCountry}.webp`)
      return response.url
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching countries flags')
    }
  }

  return { fetchCountriesFlags }
})

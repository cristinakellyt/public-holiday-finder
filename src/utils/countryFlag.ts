import { useCountriesStore } from '@/stores/countriesStore'

const countriesStore = useCountriesStore()

const fetchCountryFlag = async (countryCode: string) => {
  try {
    // Fetch the flag URL using the country code
    const flagUrl = await countriesStore.fetchCountriesFlags(countryCode.toLowerCase())
    // Add the flag URL to the row
    return flagUrl
  } catch (error) {
    console.error(`Failed to fetch flag for ${countryCode}:`, error)
    return null
  }
}

export default fetchCountryFlag

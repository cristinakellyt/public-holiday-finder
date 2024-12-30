import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import type { Country, CountryInfo } from '@/types/country'
import type { PublicHoliday } from '@/types/publicHolidays'
//Stores
import { useFavoritesCountriesStore } from '@/stores/favoritesCountriesStore'
//Utils
import { devLog } from '@/utils/logger'
//Composables
import { useCountryFlag } from '@/composables/countryFlag'
import { useWikipediaLinks } from '@/composables/wikipediaLinks'

const CONFIG = {
  API_URL: 'https://date.nager.at/api/v3/',
}

export const usePublicHolidaysStore = defineStore('publicHolidays', () => {
  const availableCountries = ref<Country[]>([])
  const publicHolidaysWorldwide = ref<PublicHoliday[]>([])
  const loadingStatus = ref<boolean>(false)
  // create map of crountryName to Holidays
  const countryHolidaysMap = ref<{ [key: string]: PublicHoliday[] }>({})
  const isPublicHolidayTodayMap = ref<{ [key: string]: boolean }>({})
  const publicHolidaysByYearMap = ref<{ [key: string]: PublicHoliday[] }>({})
  const countryInfoMap = ref<{ [key: string]: CountryInfo }>({})

  const favoritesCountriesStore = useFavoritesCountriesStore()
  const { favoritesCountries } = storeToRefs(favoritesCountriesStore)

  const { getCountryFlag } = useCountryFlag()
  const { getWikipediaLink } = useWikipediaLinks()

  const getAvailableCountries = async () => {
    loadingStatus.value = true
    // Return data if already fetched, avoid fetching again
    if (availableCountries.value.length > 0) {
      loadingStatus.value = false
      return availableCountries.value
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}AvailableCountries`)
      if (!response.ok) return []
      const data = (await response.json()) as Country[]
      availableCountries.value = data
      loadingStatus.value = false
      return data
    } catch (error) {
      devLog('Error fetching available countries:', error)
      loadingStatus.value = false
      return []
    }
  }

  const getPublicHolidaysWorldwide = async () => {
    loadingStatus.value = true
    // Return data if already fetched, avoid fetching again
    if (publicHolidaysWorldwide.value.length > 0) {
      loadingStatus.value = false
      return publicHolidaysWorldwide.value
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}NextPublicHolidaysWorldwide`)
      if (!response.ok) return null

      const data = (await response.json()) as PublicHoliday[]
      // Add Flags
      await Promise.all(
        data.map(async (holiday: PublicHoliday) => {
          const flagUrl = await getCountryFlag(holiday.countryCode)
          holiday.flagUrl = flagUrl
        }),
      )
      // Add Country Name
      data.map(async (holiday: PublicHoliday) => {
        const countries = await getAvailableCountries()
        const countryName = countries?.find(
          (country) => country.countryCode === holiday.countryCode,
        )?.name
        holiday.countryName = countryName
      })
      // Add Wikipedia Link
      await Promise.all(
        data.map(async (holiday: PublicHoliday) => {
          holiday.wikipediaLink = await getWikipediaLink(holiday.name)
        }),
      )
      publicHolidaysWorldwide.value = data
      loadingStatus.value = false
      return structuredClone(data)
    } catch (error) {
      devLog('Error fetching public holidays:', error)
      loadingStatus.value = false
      return null
    }
  }

  const getPublicHolidaysByCountry = async (countryCode: string) => {
    loadingStatus.value = true
    // Return data if already fetched, avoid fetching again
    if (countryCode in countryHolidaysMap.value) {
      loadingStatus.value = false
      return countryHolidaysMap.value[countryCode]
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}NextPublicHolidays/${countryCode}`)
      if (!response.ok) return null

      const data = (await response.json()) as PublicHoliday[]
      countryHolidaysMap.value[countryCode] = data
      loadingStatus.value = false
      return structuredClone(data)
    } catch (error) {
      devLog('Error fetching public holidays by country:', error)
      loadingStatus.value = false
      return null
    }
  }

  const isTodayPublicHoliday = async (countryCode: string) => {
    loadingStatus.value = true
    // Return data if already fetched, avoid fetching again
    if (countryCode in isPublicHolidayTodayMap.value) {
      loadingStatus.value = false
      return isPublicHolidayTodayMap.value[countryCode]
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}IsTodayPublicHoliday/${countryCode}`)
      if (!response.ok) return null

      const data = response.status === 200
      isPublicHolidayTodayMap.value[countryCode] = data
      loadingStatus.value = false
      return data
    } catch (error) {
      devLog('Error fetching if today is a public holiday:', error)
      loadingStatus.value = false
      return null
    }
  }

  const getPublicHolidaysByYear = async (year: number, countryCode: string) => {
    loadingStatus.value = true
    // Return data if already fetched, avoid fetching again
    if (`${countryCode}-${year}` in publicHolidaysByYearMap.value) {
      loadingStatus.value = false
      return publicHolidaysByYearMap.value[`${countryCode}-${year}`]
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}PublicHolidays/${year}/${countryCode}`)
      if (!response.ok) return null

      const data = (await response.json()) as PublicHoliday[]

      // Add Wikipedia Link
      await Promise.all(
        data.map(async (holiday: PublicHoliday) => {
          holiday.wikipediaLink = await getWikipediaLink(holiday.name)
        }),
      )
      publicHolidaysByYearMap.value[`${countryCode}-${year}`] = data
      loadingStatus.value = false
      return structuredClone(data)
    } catch (error) {
      devLog('Error fetching public holidays by year:', error)
      loadingStatus.value = false
      return null
    }
  }

  const getCountryInfo = async (countryCode: string) => {
    loadingStatus.value = true
    if (countryCode in countryInfoMap.value) {
      loadingStatus.value = false
      return countryInfoMap.value[countryCode]
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}CountryInfo/${countryCode}`)
      if (!response.ok) return null

      const data = await response.json()
      data.borders = await Promise.all(
        data.borders.map(async (border: CountryInfo) => {
          return {
            ...border,
            flagUrl: await getCountryFlag(border.countryCode.toLowerCase()),
          }
        }),
      )
      data.isHolidayToday = await isTodayPublicHoliday(countryCode)

      data.isFavorite = favoritesCountries.value.includes(countryCode)
      countryInfoMap.value[countryCode] = data
      loadingStatus.value = false
      return structuredClone(data)
    } catch (error) {
      devLog('Error fetching country info:', error)
      loadingStatus.value = false
      return null
    }
  }

  const updateIfCountryIsFavorite = () => {
    Object.keys(countryInfoMap.value).forEach((countryCode) => {
      countryInfoMap.value[countryCode].isFavorite = favoritesCountries.value.includes(countryCode)
    })
  }

  return {
    availableCountries,
    loadingStatus,
    getAvailableCountries,
    getPublicHolidaysWorldwide,
    getPublicHolidaysByCountry,
    isTodayPublicHoliday,
    getPublicHolidaysByYear,
    getCountryInfo,
    updateIfCountryIsFavorite,
  }
})

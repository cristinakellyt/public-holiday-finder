import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Country, CountryInfo } from '@/types/country'
import type { PublicHoliday } from '@/types/publicHolidays'
//Stores
import { useCountryFlagStore } from '@/stores/countryFlagStore'
import { useWikipediaLinksStore } from '@/stores/wikipediaLinksStore'
import { devLog } from '@/utils/logger'

const CONFIG = {
  API_URL: 'https://date.nager.at/api/v3/',
}

export const usePublicHolidaysStore = defineStore('publicHolidays', () => {
  const availableCountries = ref<Country[]>([])
  const publicHolidaysWorldwide = ref<PublicHoliday[]>([])
  // create map of crountryName to Holidays
  const countryHolidaysMap = ref<{ [key: string]: PublicHoliday[] }>({})
  const isPublicHolidayTodayMap = ref<{ [key: string]: boolean }>({})
  const publicHolidaysByYearMap = ref<{ [key: string]: PublicHoliday[] }>({})
  const countryInfo = ref<CountryInfo | null>(null)
  const countryInfoMap = ref<{ [key: string]: CountryInfo }>({})

  const countryFlagStore = useCountryFlagStore()
  const wikipediaLinksStore = useWikipediaLinksStore()

  const getAvailableCountries = async () => {
    // Return data if already fetched, avoid fetching again
    if (availableCountries.value.length > 0) return availableCountries.value

    try {
      const response = await fetch(`${CONFIG.API_URL}AvailableCountries`)
      if (!response.ok) return []
      const data = await response.json()
      availableCountries.value = data
      return availableCountries.value
    } catch (error) {
      devLog('Error fetching available countries:', error)
      return []
    }
  }

  const getPublicHolidaysWorldwide = async () => {
    // Return data if already fetched, avoid fetching again
    if (publicHolidaysWorldwide.value.length > 0) return publicHolidaysWorldwide.value

    try {
      const response = await fetch(`${CONFIG.API_URL}NextPublicHolidaysWorldwide`)
      if (!response.ok) return []

      const data = (await response.json()) as PublicHoliday[]
      // Add Flags
      await Promise.all(
        data.map(async (holiday: PublicHoliday) => {
          const flagUrl = await countryFlagStore.getCountryFlag(holiday.countryCode)
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
          holiday.wikipediaLink = await wikipediaLinksStore.getWikipediaLink(holiday.name)
        }),
      )
      publicHolidaysWorldwide.value = data
      return structuredClone(data)
    } catch (error) {
      devLog('Error fetching public holidays:', error)
      return []
    }
  }

  const getPublicHolidaysByCountry = async (countryCode: string) => {
    // Return data if already fetched, avoid fetching again
    if (countryCode in countryHolidaysMap.value) {
      return countryHolidaysMap.value[countryCode]
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}NextPublicHolidays/${countryCode}`)
      if (!response.ok) return []

      const data = (await response.json()) as PublicHoliday[]
      countryHolidaysMap.value[countryCode] = data
      return structuredClone(data)
    } catch (error) {
      devLog('Error fetching public holidays by country:', error)
      return []
    }
  }

  const isTodayPublicHoliday = async (countryCode: string) => {
    // Return data if already fetched, avoid fetching again
    if (countryCode in isPublicHolidayTodayMap.value) {
      return isPublicHolidayTodayMap.value[countryCode]
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}IsTodayPublicHoliday/${countryCode}`)
      if (!response.ok) return null

      const data = response.status === 200
      isPublicHolidayTodayMap.value[countryCode] = data
      return data
    } catch (error) {
      devLog('Error fetching if today is a public holiday:', error)
      return null
    }
  }

  const getPublicHolidaysByYear = async (year: number, countryCode: string) => {
    // Return data if already fetched, avoid fetching again
    if (`${countryCode}-${year}` in publicHolidaysByYearMap.value) {
      return publicHolidaysByYearMap.value[`${countryCode}-${year}`]
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}PublicHolidays/${year}/${countryCode}`)
      if (!response.ok) return null

      const data = (await response.json()) as PublicHoliday[]

      // Add Wikipedia Link
      await Promise.all(
        data.map(async (holiday: PublicHoliday) => {
          holiday.wikipediaLink = await wikipediaLinksStore.getWikipediaLink(holiday.name)
        }),
      )
      publicHolidaysByYearMap.value[`${countryCode}-${year}`] = data
      return structuredClone(data)
    } catch (error) {
      devLog('Error fetching public holidays by year:', error)
      return null
    }
  }

  const getCountryInfo = async (countryCode: string) => {
    if (countryCode in countryInfoMap.value) {
      countryInfo.value = countryInfoMap.value[countryCode]
      return
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}CountryInfo/${countryCode}`)
      if (!response.ok) return null

      const data = await response.json()
      data.borders = await Promise.all(
        data.borders.map(async (border: CountryInfo) => {
          return {
            ...border,
            flagUrl: await countryFlagStore.getCountryFlag(border.countryCode.toLowerCase()),
          }
        }),
      )
      data.isHolidayToday = await isTodayPublicHoliday(countryCode)
      countryInfo.value = data
      countryInfoMap.value[countryCode] = data
    } catch (error) {
      devLog('Error fetching country info:', error)
      return null
    }
  }

  return {
    availableCountries,
    countryInfo,
    getAvailableCountries,
    getPublicHolidaysWorldwide,
    getPublicHolidaysByCountry,
    isTodayPublicHoliday,
    getPublicHolidaysByYear,
    getCountryInfo,
  }
})

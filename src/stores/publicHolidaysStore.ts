import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Country } from '@/types/country'
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
      return data
    } catch (error) {
      devLog('Error fetching public holidays:', error)
      return []
    }
  }

  const getPublicHolidaysByCountry = async (countryCode: string) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}NextPublicHolidays/${countryCode}`)
      if (!response.ok) return []

      return (await response.json()) as PublicHoliday[]
    } catch (error) {
      devLog('Error fetching public holidays by country:', error)
      return []
    }
  }

  const isTodayPublicHoliday = async (countryCode: string) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}IsTodayPublicHoliday/${countryCode}`)
      if (!response.ok) return null

      return response.status === 200
    } catch (error) {
      devLog('Error fetching if today is a public holiday:', error)
      return null
    }
  }

  const getPublicHolidaysByYear = async (year: number, countryCode: string) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}PublicHolidays/${year}/${countryCode}`)
      if (!response.ok) return null

      return (await response.json()) as PublicHoliday[]
    } catch (error) {
      devLog('Error fetching public holidays by year:', error)
      return null
    }
  }

  return {
    availableCountries,
    getAvailableCountries,
    getPublicHolidaysWorldwide,
    getPublicHolidaysByCountry,
    isTodayPublicHoliday,
    getPublicHolidaysByYear,
  }
})

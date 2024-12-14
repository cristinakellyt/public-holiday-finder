import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Country } from '@/types/country'
import type { PublicHoliday } from '@/types/publicHolidays'
//Stores
import { useCountryFlagStore } from '@/stores/countryFlagStore'
import { useWikipediaLinksStore } from '@/stores/wikipediaLinksStore'
const API_URL = 'https://date.nager.at/api/v3/'

export const usePublicHolidaysStore = defineStore('publicHolidays', () => {
  const availableCountries = ref<Country[]>([])
  const publicHolidaysWorldwide = ref<PublicHoliday[]>([])
  const countryPublicHolidays = ref<PublicHoliday[]>([])
  const isTodayPublicHoliday = ref<boolean>(false)

  const countryFlagStore = useCountryFlagStore()
  const wikipediaLinksStore = useWikipediaLinksStore()

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

  const fetchPublicHolidaysWorldwide = async () => {
    try {
      const response = await fetch(`${API_URL}NextPublicHolidaysWorldwide`)
      const data = await response.json()
      // Add Flags
      await Promise.all(
        data.map(async (holiday: PublicHoliday) => {
          const flagUrl = await countryFlagStore.getCountryFlag(holiday.countryCode)
          holiday.flagUrl = flagUrl
        }),
      )
      // Add Country Name
      data.map((holiday: PublicHoliday) => {
        const countryName = availableCountries.value.find(
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
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching public holidays')
    }
  }

  const fetchPublicHolidaysByCountry = async (countryCode: string) => {
    try {
      const response = await fetch(`${API_URL}NextPublicHolidays/${countryCode}`)
      const data = await response.json()
      countryPublicHolidays.value = data
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching public holidays by country')
    }
  }

  const checkIfTodayIsHoliday = async (countryCode: string) => {
    try {
      const response = await fetch(`${API_URL}IsTodayPublicHoliday/${countryCode}`)
      isTodayPublicHoliday.value = response.status === 200
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching if today is a public holiday')
    }
  }

  const fetchPublicHolidaysByYear = async (year: number, countryCode: string) => {
    try {
      const response = await fetch(`${API_URL}PublicHolidays/${year}/${countryCode}`)
      if (response.status !== 200) {
        throw new Error()
      }
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error('Error fetching public holidays by year')
    }
  }

  const getPublicHolidaysByYear = async (year: number, countryCode: string) => {
    try {
      const data = await fetchPublicHolidaysByYear(year, countryCode)
      return data
    } catch (error) {
      return null
    }
  }

  return {
    availableCountries,
    fetchAvailableCountries,
    publicHolidaysWorldwide,
    fetchPublicHolidaysWorldwide,
    countryPublicHolidays,
    fetchPublicHolidaysByCountry,
    isTodayPublicHoliday,
    checkIfTodayIsHoliday,
    getPublicHolidaysByYear,
  }
})

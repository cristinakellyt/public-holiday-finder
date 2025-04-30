import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import type { Country, CountryInfo } from '@/types/country'
import type { PublicHoliday } from '@/types/publicHolidays'
//Stores
import { useFavoritesCountriesStore } from '@/stores/favoritesCountriesStore'
//Utils
import { devLog } from '@/utils/logger'
import { successResult, errorResult } from '@/utils/resultBuilder'
//Composables
import { useCountryFlag } from '@/composables/countryFlag'
import { useWikipediaLinks } from '@/composables/wikipediaLinks'
//ApiResult
import type { ApiResult } from '@/types/ApiResult'
import { ResultStatus } from '@/types/ApiResult'

const CONFIG = {
  API_URL: 'https://date.nager.at/api/v3/',
}

export const usePublicHolidaysStore = defineStore('publicHolidays', () => {
  const availableCountries = ref<Country[]>([])
  const publicHolidaysWorldwide = ref<PublicHoliday[]>([])

  // Use Map for countryName to Holidays
  const countryHolidaysMap = ref<Map<string, PublicHoliday[]>>(new Map())
  const isPublicHolidayTodayMap = ref<Map<string, boolean>>(new Map())
  const publicHolidaysByYearMap = ref<Map<string, PublicHoliday[]>>(new Map())
  const countryInfoMap = ref<Map<string, CountryInfo>>(new Map())

  const favoritesCountriesStore = useFavoritesCountriesStore()
  const { favoritesCountries } = storeToRefs(favoritesCountriesStore)

  const { getCountryFlag } = useCountryFlag()
  const { getWikipediaLink } = useWikipediaLinks()

  const getAvailableCountries = async (): Promise<ApiResult<Country[]>> => {
    // Return data if already fetched, avoid fetching again
    if (availableCountries.value.length > 0) {
      return successResult(availableCountries.value)
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}AvailableCountries`)
      if (!response.ok) {
        return errorResult('Failed to fetch available countries', response.status)
      }
      const data = (await response.json()) as Country[]
      availableCountries.value = data
      return successResult(data)
    } catch (error) {
      devLog('Error fetching available countries:', error)
      return errorResult('Failed to fetch available countries')
    }
  }

  const getPublicHolidaysWorldwide = async (): Promise<ApiResult<PublicHoliday[]>> => {
    // Return data if already fetched, avoid fetching again
    if (publicHolidaysWorldwide.value.length > 0) {
      return successResult(publicHolidaysWorldwide.value)
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}NextPublicHolidaysWorldwide`)
      if (!response.ok) {
        return errorResult('Failed to fetch public holidays worldwide', response.status)
      }

      const data = (await response.json()) as PublicHoliday[]
      // Add Flags
      await Promise.all(
        data.map(async (holiday: PublicHoliday) => {
          const flag = await getCountryFlag(holiday.countryCode)
          if (flag.status === ResultStatus.ERROR) return
          holiday.flagUrl = flag.data
        }),
      )
      // Add Country Name
      for (const holiday of data) {
        const countries = await getAvailableCountries()
        //If we have and error in the available countries we should throw an error
        if (countries.status === ResultStatus.ERROR) {
          throw new Error('Failed to fetch available countries')
        }
        const countryName = countries.data.find(
          (country) => country.countryCode === holiday.countryCode,
        )?.name
        holiday.countryName = countryName
      }
      // Add Wikipedia Link
      await Promise.all(
        data.map(async (holiday: PublicHoliday) => {
          const link = await getWikipediaLink(holiday.name)
          if (link.status === ResultStatus.ERROR) return
          holiday.wikipediaLink = link.data
        }),
      )
      publicHolidaysWorldwide.value = data
      return successResult(structuredClone(data))
    } catch (error) {
      devLog('Error fetching public holidays:', error)
      return errorResult('Failed to fetch public holidays worldwide')
    }
  }

  const getPublicHolidaysByCountry = async (
    countryCode: string,
  ): Promise<ApiResult<PublicHoliday[]>> => {
    // Return data if already fetched, avoid fetching again
    if (countryHolidaysMap.value.has(countryCode)) {
      return successResult(countryHolidaysMap.value.get(countryCode)!)
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}NextPublicHolidays/${countryCode}`)
      if (!response.ok) {
        return errorResult('Failed to fetch public holidays by country', response.status)
      }

      const data = (await response.json()) as PublicHoliday[]
      countryHolidaysMap.value.set(countryCode, data)
      return successResult(structuredClone(data))
    } catch (error) {
      devLog('Error fetching public holidays by country:', error)
      return errorResult('Failed to fetch public holidays by country')
    }
  }

  const isTodayPublicHoliday = async (countryCode: string): Promise<ApiResult<boolean>> => {
    // Return data if already fetched, avoid fetching again
    if (isPublicHolidayTodayMap.value.has(countryCode)) {
      return successResult(isPublicHolidayTodayMap.value.get(countryCode)!)
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}IsTodayPublicHoliday/${countryCode}`)
      if (!response.ok) {
        return errorResult('Failed to fetch if today is a public holiday', response.status)
      }

      const data = response.status === 200
      isPublicHolidayTodayMap.value.set(countryCode, data)
      return successResult(data)
    } catch (error) {
      devLog('Error fetching if today is a public holiday:', error)
      return errorResult('Failed to fetch if today is a public holiday')
    }
  }

  const getPublicHolidaysByYear = async (
    year: number,
    countryCode: string,
  ): Promise<ApiResult<PublicHoliday[]>> => {
    // Return data if already fetched, avoid fetching again
    const key = `${countryCode}-${year}`
    if (publicHolidaysByYearMap.value.has(key)) {
      return successResult(publicHolidaysByYearMap.value.get(key)!)
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}PublicHolidays/${year}/${countryCode}`)
      if (!response.ok) {
        return errorResult('Failed to fetch public holidays by year', response.status)
      }

      const data = (await response.json()) as PublicHoliday[]
      // Add Wikipedia Link
      await Promise.all(
        data.map(async (holiday: PublicHoliday) => {
          const link = await getWikipediaLink(holiday.name)
          if (link.status === ResultStatus.ERROR) return
          holiday.wikipediaLink = link.data
        }),
      )
      publicHolidaysByYearMap.value.set(key, data)
      return successResult(structuredClone(data))
    } catch (error) {
      devLog('Error fetching public holidays by year:', error)
      return errorResult('Failed to fetch public holidays by year')
    }
  }

  const getCountryInfo = async (countryCode: string): Promise<ApiResult<CountryInfo>> => {
    if (countryInfoMap.value.has(countryCode)) {
      return successResult(countryInfoMap.value.get(countryCode)!)
    }

    try {
      const response = await fetch(`${CONFIG.API_URL}CountryInfo/${countryCode}`)
      if (!response.ok) {
        return errorResult('Failed to fetch country info', response.status)
      }

      const data = (await response.json()) as CountryInfo
      // Add Borders Flags
      data.borders = (await Promise.all(
        data.borders.map(async (border: CountryInfo) => {
          const flag = await getCountryFlag(border.countryCode.toLowerCase())
          if (flag.status === ResultStatus.ERROR) return border
          return {
            ...border,
            flagUrl: flag.data,
          }
        }),
      )) as CountryInfo[]

      // Add if today is a public holiday
      const isHolidayToday = await isTodayPublicHoliday(countryCode)
      isHolidayToday.status === ResultStatus.SUCCESS
        ? (data.isHolidayToday = isHolidayToday.data)
        : (data.isHolidayToday = null)

      // Add if country is favorite
      data.isFavorite = favoritesCountries.value.includes(countryCode)
      countryInfoMap.value.set(countryCode, data)
      return successResult(structuredClone(data))
    } catch (error) {
      devLog('Error fetching country info:', error)
      return errorResult('Failed to fetch country info')
    }
  }

  const updateIfCountryIsFavorite = () => {
    countryInfoMap.value.forEach((countryInfo, countryCode) => {
      countryInfo.isFavorite = favoritesCountries.value.includes(countryCode)
    })
  }

  return {
    availableCountries,
    publicHolidaysWorldwide,
    getAvailableCountries,
    getPublicHolidaysWorldwide,
    getPublicHolidaysByCountry,
    isTodayPublicHoliday,
    getPublicHolidaysByYear,
    getCountryInfo,
    updateIfCountryIsFavorite,
  }
})

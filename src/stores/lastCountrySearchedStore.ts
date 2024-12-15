import { defineStore } from 'pinia'
import { ref } from 'vue'
//Types
import type { PublicHoliday } from '@/types/publicHolidays'
import type { LastCountrySearched } from '@/types/country'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
import { useWikipediaLinksStore } from '@/stores/wikipediaLinksStore'
import { useCountryFlagStore } from '@/stores/countryFlagStore'

export const useLastCountrySearchedStore = defineStore('lastCountrySearched', () => {
  const publicHolidaysStore = usePublicHolidaysStore()
  const wikipediaLinksStore = useWikipediaLinksStore()
  const countryFlagStore = useCountryFlagStore()

  const lastCountrySearched = ref<LastCountrySearched>({
    countryCode: '',
    name: '',
    flagUrl: '',
    holidays: [],
  })
  const loadingStatus = ref<boolean>(false)
  const errorStatus = ref<boolean>(false)

  const loadLastCountrySearched = () => {
    const lastCountryStored = localStorage.getItem('lastCountrySearched')
    if (lastCountryStored) {
      lastCountrySearched.value = JSON.parse(lastCountryStored)
    }
  }
  const setLastCountrySearched = async (countryCode: string) => {
    loadingStatus.value = true
    errorStatus.value = false
    // if countryCode is equal to lastCountrySearched.value.countryCode, return
    if (countryCode === lastCountrySearched.value.countryCode) {
      loadingStatus.value = false
      return
    }

    // No need to treat errors as the user doesn't reach this point if there is no available countries
    const name = await getCountryName(countryCode)
    // Even if the flag is not found, we want to show the country name
    const flagUrl = await countryFlagStore.getCountryFlag(countryCode)

    const holidays = await getHolidays(countryCode)
    // If the holidays are not found, set the error status to true
    if (holidays === null) {
      errorStatus.value = true
      loadingStatus.value = false
      return
    }

    lastCountrySearched.value = {
      countryCode: countryCode,
      name: name,
      flagUrl: flagUrl,
      holidays: holidays,
    }
    localStorage.setItem('lastCountrySearched', JSON.stringify(lastCountrySearched.value))
    loadingStatus.value = false
  }

  const getCountryName = async (countryCode: string) => {
    const countries = await publicHolidaysStore.getAvailableCountries()

    const countryName = countries.find((country) => country.countryCode === countryCode)?.name
    return countryName ? countryName : ''
  }

  const getHolidays = async (countryCode: string) => {
    const holidays = await publicHolidaysStore.getPublicHolidaysByCountry(countryCode)
    if (holidays === null) return null

    //Find links in wikipediaLinks store and fill holidays with them if they exist
    //if not, fetch them
    await Promise.all(
      holidays.map(async (holiday: PublicHoliday) => {
        // Even if the wikipedia link is not found, we want to show the holiday name
        holiday.wikipediaLink = await wikipediaLinksStore.getWikipediaLink(holiday.name)
      }),
    )
    return holidays
  }

  return {
    lastCountrySearched,
    setLastCountrySearched,
    loadLastCountrySearched,
    loadingStatus,
    errorStatus,
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
//Types
import type { PublicHoliday } from '@/types/publicHolidays'
import type { LastCountrySearched } from '@/types/country'
import { ResultStatus } from '@/types/ApiResult'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
//Composables
import { useWikipediaLinks } from '@/composables/wikipediaLinks'
import { useCountryFlag } from '@/composables/countryFlag'

export const useLastCountrySearchedStore = defineStore('lastCountrySearched', () => {
  // Setup Stores
  const publicHolidaysStore = usePublicHolidaysStore()

  //Setup composables
  const { getWikipediaLink } = useWikipediaLinks()
  const { getCountryFlag } = useCountryFlag()

  // Setup internal and external states
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
    if (name === null) {
      errorStatus.value = true
      loadingStatus.value = false
      return
    }
    // Even if the flag is not found, we want to show the country name
    const flag = await getCountryFlag(countryCode)
    if (flag.status === ResultStatus.ERROR) {
      errorStatus.value = true
      loadingStatus.value = false
      return
    }
    const flagUrl = flag.data

    const holidays = await getHolidays(countryCode)
    // If the holidays are not found, set the error status to true
    if (holidays === null) {
      errorStatus.value = true
      loadingStatus.value = false
      return
    }

    lastCountrySearched.value = {
      countryCode,
      name: name || '',
      flagUrl,
      holidays,
    }
    localStorage.setItem('lastCountrySearched', JSON.stringify(lastCountrySearched.value))
    loadingStatus.value = false
  }

  const getCountryName = async (countryCode: string) => {
    const countries = await publicHolidaysStore.getAvailableCountries()
    if (countries.status === ResultStatus.ERROR) {
      return null
    }

    const countryName = countries.data.find((country) => country.countryCode === countryCode)?.name
    return countryName
  }

  const getHolidays = async (countryCode: string) => {
    const holidays = await publicHolidaysStore.getPublicHolidaysByCountry(countryCode)
    if (holidays.status === ResultStatus.ERROR) return null

    //Find links in wikipediaLinks store and fill holidays with them if they exist
    //if not, fetch them
    await Promise.all(
      holidays.data.map(async (holiday: PublicHoliday) => {
        // Even if the wikipedia link is not found, we want to show the holiday name
        const link = await getWikipediaLink(holiday.name)
        if (link.status === ResultStatus.ERROR) return
        holiday.wikipediaLink = link.data
      }),
    )
    return holidays.data
  }

  return {
    lastCountrySearched,
    setLastCountrySearched,
    loadLastCountrySearched,
    loadingStatus,
    errorStatus,
  }
})

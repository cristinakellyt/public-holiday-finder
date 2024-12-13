import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
//Types
import type { PublicHoliday } from '@/types/publicHolidays'
import type { LastCountrySearched } from '@/types/lastSearchedCountry'
//Stores
import { usePublicHolidaysStore } from '@/stores/publicHolidaysStore'
import { useWikipediaLinksStore } from '@/stores/wikipediaLinksStore'
import { useCountryFlagStore } from '@/stores/countryFlagStore'

export const useLastCountrySearchedStore = defineStore('lastCountrySearched', () => {
  const publicHolidaysStore = usePublicHolidaysStore()
  const wikipediaLinksStore = useWikipediaLinksStore()
  const countryFlagStore = useCountryFlagStore()
  const { availableCountries, countryPublicHolidays } = storeToRefs(publicHolidaysStore)

  const lastCountrySearched = ref<LastCountrySearched>({
    countryCode: '',
    countryName: null,
    countryFlagUrl: null,
    holidays: [],
  })

  const loadLastCountrySearched = () => {
    const lastCountryStored = localStorage.getItem('lastCountrySearched')
    if (lastCountryStored) {
      lastCountrySearched.value = JSON.parse(lastCountryStored)
    }
  }
  const setLastCountrySearched = async (countryCode: string) => {
    // if countryCode is equal to lastCountrySearched.value.countryCode, return
    if (countryCode === lastCountrySearched.value.countryCode) return

    lastCountrySearched.value = {
      countryCode: countryCode,
      countryName: await getCountryName(countryCode),
      countryFlagUrl: await countryFlagStore.getCountryFlag(countryCode),
      holidays: await getHolidays(countryCode),
    }
    localStorage.setItem('lastCountrySearched', JSON.stringify(lastCountrySearched.value))
  }

  const getCountryName = async (countryCode: string) => {
    if (availableCountries.value.length === 0) {
      await publicHolidaysStore.fetchAvailableCountries()
    }

    const countryName = availableCountries.value.find(
      (country) => country.countryCode === countryCode,
    )?.name

    if (countryName) {
      return countryName
    } else {
      return null
    }
  }

  const getHolidays = async (countryCode: string) => {
    await publicHolidaysStore.fetchPublicHolidaysByCountry(countryCode)

    // Clone countryPublicHolidays to avoid reference issues
    const holidays = JSON.parse(JSON.stringify(countryPublicHolidays.value))

    //Find links in wikipediaLinks store and fill holidays with them if they exist
    //if not, fetch them
    await Promise.all(
      holidays.map(async (holiday: PublicHoliday) => {
        holiday.wikipediaLink = await wikipediaLinksStore.getWikipediaLink(holiday.name)
      }),
    )
    return holidays
  }

  return {
    lastCountrySearched,
    setLastCountrySearched,
    loadLastCountrySearched,
  }
})
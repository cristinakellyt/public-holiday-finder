import type { PublicHoliday } from '@/types/publicHolidays'

type Country = {
  countryCode: string
  name: string
  flagUrl?: string | null
}

type CountryInfo = Country & {
  commonName: string
  officialName: string
  region: string
  isHolidayToday: boolean
  isFavorite: boolean
  borders: CountryInfo[]
}

type LastCountrySearched = Country & {
  holidays: PublicHoliday[]
}

export type { Country, CountryInfo, LastCountrySearched }

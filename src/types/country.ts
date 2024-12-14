import type { PublicHoliday } from '@/types/publicHolidays'

type Country = {
  countryCode: string
  name: string | null
  flagUrl?: string | null
}

type CountryInfo = Country & {
  commonName: string
  officialName: string
  region: string
  borders: CountryInfo[]
}

type LastCountrySearched = Country & {
  holidays: PublicHoliday[]
}

export type { Country, CountryInfo, LastCountrySearched }

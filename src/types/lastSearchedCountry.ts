import type { PublicHoliday } from '@/types/publicHolidays'

export type LastCountrySearched = {
  countryCode: string
  countryName: string | null
  countryFlagUrl: string | null
  holidays: PublicHoliday[]
}

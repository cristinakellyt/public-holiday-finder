type PublicHoliday = {
  date: string
  localName: string
  name: string
  countryCode: string
  global: boolean
  counties: string[]
  launchYear: number
  types: string[]
  flagUrl?: string | null
  countryName?: string
  wikipediaLink?: string | null
}

export type { PublicHoliday }

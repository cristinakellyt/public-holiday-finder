type Country = {
  countryCode: string
  name: string
}

type CountryInfo = {
  commonName: string
  officialName: string
  countryCode: string
  region: string
  borders: Border[]
}

type Border = {
  commonName: string
  officialName: string
  countryCode: string
  region: string
  borders: unknown[]
  flagUrl?: string
}

export type { Country, CountryInfo, Border }

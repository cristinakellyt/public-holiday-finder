import { ref, onMounted } from 'vue'
import { devLog } from '@/utils/logger'
import { setItemWithExpiration, getItemWithExpiration } from '@/utils/localStorageWithExpiration'
import { ResultStatus } from '@/types/ApiResult'
//Types
import type { ApiResult } from '@/types/ApiResult'
//Utils
import { successResult, errorResult } from '@/utils/resultBuilder'

const CONFIG = {
  STORAGE_KEY: 'countryFlag',
  API_BASE_URL: 'https://flagcdn.com/24x18',
}

type CountryFlag = {
  [key: string]: string
}

export function useCountryFlag() {
  const countriesFlagObj = ref<CountryFlag>({})

  // Load the country flag from the local storage
  onMounted(() => {
    loadCountryFlag()
  })

  const loadCountryFlag = () => {
    const countryFlagStored = getItemWithExpiration(CONFIG.STORAGE_KEY)
    if (countryFlagStored !== null) {
      countriesFlagObj.value = countryFlagStored
    }
  }

  const fetchCountryFlag = async (countryCode: string): Promise<ApiResult<string | null>> => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/${countryCode}.webp`)
      if (!response.ok) return errorResult('Failed to fetch country flag', response.status)

      const flagUrl = response.url
      countriesFlagObj.value[countryCode] = flagUrl
      setItemWithExpiration(CONFIG.STORAGE_KEY, countriesFlagObj.value, 10000)
      return successResult(flagUrl)
    } catch (error) {
      devLog('Error while fetching country flag: ', error)
      return errorResult('Error while fetching country flag', 500)
    }
  }

  const getCountryFlag = async (countryCode: string): Promise<ApiResult<string | null>> => {
    const normalizedCountryCode = countryCode.toLowerCase()
    //if flag already exists, return it else fetch it
    if (countriesFlagObj.value[normalizedCountryCode]) {
      return successResult(countriesFlagObj.value[normalizedCountryCode])
    } else {
      const result = await fetchCountryFlag(normalizedCountryCode)
      if (result.status === ResultStatus.ERROR) return result
      return successResult(result.data)
    }
  }

  return { getCountryFlag, loadCountryFlag }
}

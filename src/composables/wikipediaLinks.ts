import { ref, onBeforeMount } from 'vue'
import { devLog } from '@/utils/logger'
import { setItemWithExpiration, getItemWithExpiration } from '@/utils/localStorageWithExpiration'
import { ResultStatus } from '@/types/ApiResult'
//Types
import type { ApiResult } from '@/types/ApiResult'
//Utils
import { successResult, errorResult } from '@/utils/resultBuilder'

type WikipediaLinks = {
  [key: string]: string
}

const CONFIG = {
  STORAGE_KEY: 'wikipediaLinks',
  API_BASE_URL: 'https://en.wikipedia.org/w/api.php',
}

export function useWikipediaLinks() {
  const wikipediaLinks = ref<WikipediaLinks>({})

  // Load the wikipedia links from the local storage
  onBeforeMount(() => {
    loadWikipediaLinks()
  })

  const loadWikipediaLinks = () => {
    const wikipediaLinksStored = getItemWithExpiration(CONFIG.STORAGE_KEY)
    if (wikipediaLinksStored !== null) {
      wikipediaLinks.value = wikipediaLinksStored
    }
  }

  // Fetch wikipedia link from wikipedia api and save it in the state management
  const fetchWikipediaLink = async (holidayName: string): Promise<ApiResult<string | null>> => {
    // To have a better match, we use the wikipedia api to search for the holiday name
    // if the is no 'holiday' string in the holiday name, we search we concact hollidayName
    // with 'holiday' string
    const searchQuery = holidayName.includes('holiday') ? holidayName : holidayName + ' holiday'
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: searchQuery,
      format: 'json',
      origin: '*',
    })

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}?${params.toString()}`)
      if (!response.ok) return errorResult('Failed to fetch Wikipedia link', response.status)

      const data = await response.json()

      // Get the first search result
      const firstResult = data.query?.search[0]
      if (firstResult) {
        const wikiUrl = `https://en.wikipedia.org/wiki/${firstResult.title.replace(/ /g, '_')}`
        wikipediaLinks.value[holidayName] = wikiUrl
        setItemWithExpiration(CONFIG.STORAGE_KEY, wikipediaLinks.value, 10000)
        return successResult(wikiUrl)
      } else {
        devLog('No search results found for:', holidayName)
        return errorResult('No search results found for: ' + holidayName, 404)
      }
    } catch (error) {
      devLog('Error fetching Wikipedia link:', error)
      return errorResult('Error fetching Wikipedia link', 500)
    }
  }

  const getWikipediaLink = async (holidayName: string): Promise<ApiResult<string | null>> => {
    //if link already exists, return it
    if (wikipediaLinks.value[holidayName]) {
      return successResult(wikipediaLinks.value[holidayName])
    } else {
      const linkResult = await fetchWikipediaLink(holidayName)
      if (linkResult.status === ResultStatus.ERROR) return linkResult
      return successResult(linkResult.data)
    }
  }

  return { getWikipediaLink, loadWikipediaLinks }
}

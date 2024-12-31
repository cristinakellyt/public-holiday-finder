import { ref, onBeforeMount } from 'vue'
import { devLog } from '@/utils/logger'
import { setItemWithExpiration, getItemWithExpiration } from '@/utils/localStorageWithExpiration'

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
  const fetchWikipediaLink = async (holidayName: string): Promise<string | null> => {
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
      if (!response.ok) return null

      const data = await response.json()

      // Get the first search result
      const firstResult = data.query?.search[0]
      if (firstResult) {
        const wikiUrl = `https://en.wikipedia.org/wiki/${firstResult.title.replace(/ /g, '_')}`
        wikipediaLinks.value[holidayName] = wikiUrl
        setItemWithExpiration(CONFIG.STORAGE_KEY, wikipediaLinks.value, 10000)
        return wikiUrl
      } else {
        devLog('No search results found for:', holidayName)
        return null
      }
    } catch (error) {
      devLog('Error fetching Wikipedia link:', error)
      return null
    }
  }

  const getWikipediaLink = async (holidayName: string) => {
    //if link already exists, return it
    if (wikipediaLinks.value[holidayName]) {
      return wikipediaLinks.value[holidayName]
    } else {
      const link = await fetchWikipediaLink(holidayName)
      return link
    }
  }

  return { getWikipediaLink, loadWikipediaLinks }
}

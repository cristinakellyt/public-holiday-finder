import { defineStore } from 'pinia'
import { ref } from 'vue'
import { devLog } from '@/utils/logger'

type WikipediaLinks = {
  [key: string]: string
}

const CONFIG = {
  STORAGE_KEY: 'wikipediaLinks',
  API_BASE_URL: 'https://en.wikipedia.org/w/api.php',
}

export const useWikipediaLinksStore = defineStore('wikipediaLinks', () => {
  const wikipediaLinks = ref<WikipediaLinks>({})

  const loadWikipediaLinks = () => {
    const wikipediaLinksStored = localStorage.getItem(CONFIG.STORAGE_KEY)
    if (wikipediaLinksStored) {
      wikipediaLinks.value = JSON.parse(wikipediaLinksStored)
    }
  }

  //Fetch wikipedia link from wikipedia api and save it in the state management
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
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(wikipediaLinks.value))
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
})

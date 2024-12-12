import { defineStore } from 'pinia'
import { ref } from 'vue'

type WikipediaLinks = {
  [key: string]: string
}

export const useWikipediaLinksStore = defineStore('wikipediaLinks', () => {
  const wikipediaLinks = ref<WikipediaLinks>({})

  const loadWikipediaLinks = () => {
    const wikipediaLinksStored = localStorage.getItem('wikipediaLinks')
    if (wikipediaLinksStored) {
      wikipediaLinks.value = JSON.parse(wikipediaLinksStored)
    }
  }

  //Fetch wikipedia link from wikipedia api and save it in the state management
  const fetchWikipediaLink = async (holidayName: string): Promise<string | null> => {
    const baseUrl = 'https://en.wikipedia.org/w/api.php'
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: holidayName,
      format: 'json',
      origin: '*',
    })

    const url = `${baseUrl}?${params.toString()}`

    try {
      const response = await fetch(url)
      const data = await response.json()

      // Get the first search result
      const firstResult = data.query.search[0]
      if (firstResult) {
        const wikiUrl = `https://en.wikipedia.org/wiki/${firstResult.title.replace(/ /g, '_')}`
        wikipediaLinks.value[holidayName] = wikiUrl
        localStorage.setItem('wikipediaLinks', JSON.stringify(wikipediaLinks.value))
        return wikiUrl
      } else {
        console.warn('No search results found for:', holidayName)
        return null
      }
    } catch (error) {
      console.error('Error fetching Wikipedia link:', error)
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

  return { wikipediaLinks, getWikipediaLink, loadWikipediaLinks }
})

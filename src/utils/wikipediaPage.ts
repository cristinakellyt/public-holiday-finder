type WikipediaSearchResult = {
  title: string
}

type WikipediaResponse = {
  query: {
    search: WikipediaSearchResult[]
  }
}

async function getWikipediaLink(holidayName: string): Promise<string | null> {
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
    const data: WikipediaResponse = await response.json()

    // Get the first search result
    const firstResult = data.query.search[0]
    if (firstResult) {
      const wikiUrl = `https://en.wikipedia.org/wiki/${firstResult.title.replace(/ /g, '_')}`
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

export default getWikipediaLink

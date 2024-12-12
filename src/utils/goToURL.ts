const goToURL = (url: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

export default goToURL

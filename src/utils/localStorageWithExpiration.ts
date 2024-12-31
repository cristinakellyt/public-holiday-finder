function setItemWithExpiration(key: string, value: any, expirationInMinutes: number) {
  const now = new Date()
  const item = {
    value: value,
    expiration: now.getTime() + expirationInMinutes * 60 * 1000,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

function getItemWithExpiration(key: string) {
  const itemStr = localStorage.getItem(key)

  // If the item doesn't exist, return null
  if (!itemStr) {
    return null
  }

  const item = JSON.parse(itemStr)
  const now = new Date()

  // Check if the item is expired
  if (now.getTime() > item.expiration) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}

export { setItemWithExpiration, getItemWithExpiration }

const dateFormatter = (date: string) => {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}

export default dateFormatter

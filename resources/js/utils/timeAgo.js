// utils/timeAgo.js
export function timeAgo(from, to = new Date()) {
  const fromDate = new Date(from)
  const toDate = new Date(to)

  if (isNaN(fromDate) || isNaN(toDate)) {
    return '' // fallback
  }

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const seconds = Math.floor((fromDate - toDate) / 1000)

  const ranges = {
    year: 3600 * 24 * 365,
    month: 3600 * 24 * 30,
    week: 3600 * 24 * 7,
    day: 3600 * 24,
    hour: 3600,
    minute: 60,
    second: 1,
  }

  for (const key in ranges) {
    if (Math.abs(seconds) >= ranges[key] || key === 'second') {
      const delta = seconds / ranges[key]
      return rtf.format(Math.round(delta), key)
    }
  }
}

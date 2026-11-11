export function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  for (const [name, secs] of [['day', 86400], ['hour', 3600], ['minute', 60]]) {
    if (s >= secs) {
      const n = Math.floor(s / secs)
      return `${n} ${name}${n > 1 ? 's' : ''} ago`
    }
  }
  return 'just now'
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

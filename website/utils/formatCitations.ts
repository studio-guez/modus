const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
]

const MONTHS_FR_ABBR = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
]

function parseDate(dateString: string, isPublicationDate = false) {
  // Check if the date string has a time component
  // Date-only formats: "2024-01-15", "January 15, 2024", etc.
  // Date-time formats include "T" or contain ":" for time
  const hasTime = dateString.includes('T') || /\d{1,2}:\d{2}/.test(dateString)
  
  let date: Date
  if (isPublicationDate && !hasTime) {
    // For publication dates without time, assume 13:00 CET (12:00 UTC)
    const baseDate = new Date(dateString)
    if (isNaN(baseDate.getTime())) return null
    // Set to 12:00 UTC (which is 13:00 CET)
    date = new Date(Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 12, 0, 0))
  } else {
    date = new Date(dateString)
  }
  
  if (isNaN(date.getTime())) return null
  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth(),
    year: date.getUTCFullYear(),
    hours: String(date.getUTCHours()).padStart(2, '0'),
    minutes: String(date.getUTCMinutes()).padStart(2, '0')
  }
}

export interface CitationStyleItem {
  key: string
  label: string
  citation: string
  content: string
}

export interface CitationParams {
  title: string
  slug: string
  dateStr: string
  url: string
  accessedDate: string
}

function generateBibtex(title: string, slug: string, dateStr: string, url: string, accessedDate: string): string {
  const pub = parseDate(dateStr, true)
  const acc = parseDate(accessedDate)
  if (!pub || !acc) return ''
  
  return `@misc{${slug},
  author = "Modus",
  title = "${title} --- Modus",
  year = "${pub.year}",
  url = "${url}",
  note = "[En ligne; Page disponible le ${acc.day}-${MONTHS_FR[acc.month]}-${acc.year}]"
}`
}

function generateBibtexHtml(title: string, slug: string, dateStr: string, url: string, accessedDate: string): string {
  const pub = parseDate(dateStr, true)
  const acc = parseDate(accessedDate)
  if (!pub || !acc) return ''
  
  return `<pre>@misc{${slug},
  author = "Modus",
  title = "${title} --- Modus",
  year = "${pub.year}",
  url = "<a href="${url}">${url}</a>",
  note = "[En ligne; Page disponible le ${acc.day}-${MONTHS_FR[acc.month]}-${acc.year}]"
}</pre>`
}

export function generateCitationStyles(params: CitationParams): CitationStyleItem[] {
  const { title, slug, dateStr, url, accessedDate } = params
  const link = `<a href="${url}">${url}</a>`
  
  const pub = parseDate(dateStr, true)
  const acc = parseDate(accessedDate)
  
  if (!pub || !acc) {
    return []
  }

  // Pre-formatted date strings for each style
  const apaDate = `${pub.year}, ${MONTHS_FR[pub.month]} ${pub.day}`
  const apaAccessed = `${acc.hours}:${acc.minutes}, ${MONTHS_FR[acc.month]} ${acc.day}, ${acc.year}`
  
  const mlaDate = `${pub.day} ${MONTHS_FR_ABBR[pub.month]} ${pub.year}, ${pub.hours}:${pub.minutes} UTC`
  const mlaAccessed = `${acc.day} ${MONTHS_FR_ABBR[acc.month]} ${acc.year}, ${acc.hours}:${acc.minutes}`
  
  const mhraDate = `${pub.day} ${MONTHS_FR[pub.month]} ${pub.year}, ${pub.hours}:${pub.minutes} UTC`
  const mhraAccessed = `${acc.day} ${MONTHS_FR[acc.month]} ${acc.year}`
  
  const chicagoAccessed = `${MONTHS_FR[acc.month]} ${acc.day}, ${acc.year}`
  
  const cbeDate = `${pub.year} ${MONTHS_FR_ABBR[pub.month]} ${pub.day}, ${pub.hours}:${pub.minutes} UTC`
  const cbeAccessed = `${acc.year} ${MONTHS_FR_ABBR[acc.month]} ${acc.day}`
  
  const bluebookAccessed = `${MONTHS_FR[acc.month]} ${acc.day}, ${acc.year}`

  return [
    {
      key: 'apa',
      label: 'APA Style',
      citation: `${title}. (${apaDate}). Modus. Page consultée le ${apaAccessed} à partir de ${url}.`,
      content: `${title}. (${apaDate}). <em>Modus</em>. Page consultée le ${apaAccessed} à partir de ${link}.`
    },
    {
      key: 'mla',
      label: 'MLA Style',
      citation: `"${title}." Modus. ${mlaDate}. ${mlaAccessed}\n<${url}>.`,
      content: `"${title}." <em>Modus</em>. ${mlaDate}. ${mlaAccessed}\n&lt;${link}&gt;.`
    },
    {
      key: 'mhra',
      label: 'MHRA Style',
      citation: `Modus, '${title}', Modus, ${mhraDate}, <${url}> [Page consultée le ${mhraAccessed}]`,
      content: `Modus, '${title}', <em>Modus</em>, ${mhraDate}, &lt;${link}&gt; [Page consultée le ${mhraAccessed}]`
    },
    {
      key: 'chicago',
      label: 'Chicago Style',
      citation: `Modus, "${title}," Modus,\n${url} (Page consultée le ${chicagoAccessed}).`,
      content: `Modus, "${title}," <em>Modus</em>,\n${link} (Page consultée le ${chicagoAccessed}).`
    },
    {
      key: 'cbe',
      label: 'CBE/CSE Style',
      citation: `Modus. ${title} [Internet]. Modus; ${cbeDate} [cité ${cbeAccessed}]. Disponible à l'adresse:\n${url}.`,
      content: `Modus. ${title} [Internet]. Modus; ${cbeDate} [cité ${cbeAccessed}]. Disponible à l'adresse:\n${link}.`
    },
    {
      key: 'bluebook',
      label: 'Bluebook Style',
      citation: `${title}, ${url} (Page consultée le ${bluebookAccessed}).`,
      content: `${title}, ${link} (Page consultée le ${bluebookAccessed}).`
    },
    {
      key: 'bibtex',
      label: 'BibTeX',
      citation: generateBibtex(title, slug, dateStr, url, accessedDate),
      content: generateBibtexHtml(title, slug, dateStr, url, accessedDate)
    }
  ]
}

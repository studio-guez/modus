export function formatDateRange(stringStartDate: string, stringEndDate?: string): string {

    const startDate = new Date(stringStartDate)
    const endDate = stringEndDate ? new Date(stringEndDate) : null

    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }
    const formatter = new Intl.DateTimeFormat('fr-FR', options)

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

    const start = capitalize(formatter.format(startDate))

    if (!endDate) return start

    const end = capitalize(formatter.format(endDate))

    if(start === end) return start

    return `${start} – ${end}`
}

export function formatDate(stringDate: string): string {

    const startDate = new Date(stringDate)

    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: 'long',
        year: '2-digit',
        day: 'numeric'
    }
    const formatter = new Intl.DateTimeFormat('fr-FR', options)

    return formatter.format(startDate)
}

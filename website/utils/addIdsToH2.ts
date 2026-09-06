export function addIdsToH2(html: string): string {
    let index = 0
    return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_match, attrs: string, inner: string) => {
        const text = inner.replace(/<[^>]+>/g, '').trim()
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || `header-${index}`
        index++
        // Remove any existing id attribute before adding the new one
        const cleanAttrs = attrs.replace(/\s*id="[^"]*"/gi, '')
        return `<h2${cleanAttrs} id="${id}">${inner}</h2>`
    })
}

/**
 * Gets the backend base URL from runtime config
 */
export function getBackendBaseUrl(): string {
    const config = useRuntimeConfig()
    return config.public.apiBaseUrl as string
}

/**
 * Builds the PDF download URL for a report
 */
export function buildPdfUrl(slug: string): string {
  return `${getBackendBaseUrl()}/rapport/${slug}/pdf`
}

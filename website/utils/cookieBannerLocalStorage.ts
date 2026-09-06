export function setCookieBannerValue(value: boolean): void {
    localStorage.setItem("cookieBannerValue", JSON.stringify(value))
}

export function getCookieBannerValue(): boolean | null {
    const storedValue = localStorage.getItem('cookieBannerValue')
    return storedValue !== null ? JSON.parse(storedValue) : null
}

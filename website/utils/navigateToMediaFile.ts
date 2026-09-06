export function navigateToMediaFile() {
    window.setTimeout(() => {

        const mediaAnchor = document.querySelector('#media-anchor')

        if( !(mediaAnchor instanceof HTMLElement) ) return

        const offset = 150
        const elementPosition = mediaAnchor.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' })

    }, 1_500)
}

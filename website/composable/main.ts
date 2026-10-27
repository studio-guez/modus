import type {Ref} from "vue";
import type {IApiImage, IApiMenus} from "~/composable/adminApi/apiDefinitions";
import {ApiFetchMenus} from "~/composable/adminApi/apiFetch";

export const arrayOfH2TitleIdInCurrentPage: () => Ref<{ anchor: string; name: string }[]> = () => {
    return useState(
        'h2TitleIdInCurrentPage',
        () => []
    )
}

export const bodyScrollInfo: () => Ref<{ top: number }> = () => {
    return useState(
        'bodyScrollInfoStore',
        () => {
            return {
                top: 0
            }
        }
    )
}

export const showCookieBanner: () => Ref<boolean> = () => {
    return useState('showCookieBanner', () => {
        return true
    })
}

export const cookieIsValidate: () => Ref<boolean> = () => {
    return useState('cookieIsValidate', () => {
        return false
    })
}

export const showMenu: () => Ref<boolean> =
    () => useState('showMenu', () => false)

/**
 * Returns the nav menus data ref, fetching it via useAsyncData so it is
 * available during SSR and cached in the payload (no client refetch).
 * Must be called from component/composable setup, not from templates.
 */
export const useMenus = (): Ref<IApiMenus | null> => {
    const {data} = useAsyncData('menus', () => ApiFetchMenus())
    return data as Ref<IApiMenus | null>
}

export const useStateNavBarreMsgMessage: () => Ref<null | string> =
    () => useState('FixedHeaderMessage', () => null)

// Podcast player state
export const useSpotifyUrl: () => Ref<string | null> =
    () => useState('spotifyUrl', () => null)

export const useSpotifyTitle: () => Ref<string | null> =
    () => useState('spotifyTitle', () => null)

export const usePodcastPlayerIsOpen: () => Ref<boolean> =
    () => useState('podcastPlayerIsOpen', () => false)

export const useSpotifyIsPlaying: () => Ref<boolean> =
    () => useState('spotifyIsPlaying', () => false)

export const useSpotifyTogglePlay: () => Ref<(() => void) | null> =
    () => useState('spotifyTogglePlay', () => null)

// YouTube player state
export const useYoutubeUrl: () => Ref<string | null> =
    () => useState('youtubeUrl', () => null)

export const useYoutubeTitle: () => Ref<string | null> =
    () => useState('youtubeTitle', () => null)

// Actualités (news) state
export interface IActualiteGlobal {
  title: string
  link?: string
  color: string
}

export const useActualites: () => Ref<IActualiteGlobal[]> =
    () => useState('actualites', () => [])

/** Default meta description, for pages that have no `preview` text of their own. */
export const SITE_DESCRIPTION = 'modus. pour une mobilité durable à Genève'

/**
 * Shape shared by every CMS payload that can name a page: `IApiPage`,
 * `IApiProjects` and the tag/report variants all expose some of these keys.
 */
interface ICmsTitledPage {
    options?: {
        headerTitle?: string | null
        headerImage?: IApiImage | null
        preview?: string | null
    }
    title?: { value?: string | null } | null
}

/**
 * Page title from a CMS payload, preferring the editor-facing `headerTitle` and
 * falling back to the Kirby page title (several pages, such as the legal notices,
 * leave `headerTitle` empty).
 *
 * `undefined` rather than an empty string when neither is set, so the defaults in
 * app.vue (bare site name) apply.
 */
const cmsPageTitle = (page: ICmsTitledPage | null | undefined) =>
    page?.options?.headerTitle?.trim()
    || page?.title?.value?.trim()
    || undefined

/** `preview` as plain text: the tag page maps its writer-field description onto it. */
const cmsPageDescription = (page: ICmsTitledPage | null | undefined) =>
    page?.options?.preview
        ?.replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim()
    || undefined

/**
 * Sets the document <title> and the social share meta (og:title, description,
 * og:image) of a page from its CMS payload.
 */
export const useCmsPageMeta = (page: Ref<ICmsTitledPage | null | undefined>) => {
    useSeoMeta({
        title: () => cmsPageTitle(page.value),
        ogTitle: () => cmsPageTitle(page.value),
    })
    useCmsShareMeta(page)
}

/**
 * Social share description and image from a CMS payload: the `resize.og` crop of
 * the header image, else the site-wide fallback set in app.vue. Separate from
 * useCmsPageMeta so the home page can use it while keeping the bare site name as
 * its title.
 */
export const useCmsShareMeta = (page: Ref<ICmsTitledPage | null | undefined>) => {
    useSeoMeta({
        description: () => cmsPageDescription(page.value),
        ogDescription: () => cmsPageDescription(page.value),
        ogImage: () => page.value?.options?.headerImage?.resize.og,
        ogImageAlt: () => page.value?.options?.headerImage
            ? page.value.options.headerImage.alt?.trim() || cmsPageTitle(page.value)
            : undefined,
    })
}

import type {Ref} from "vue";
import type {IApiMenus} from "~/composable/adminApi/apiDefinitions";
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

/**
 * Shape shared by every CMS payload that can name a page: `IApiPage`,
 * `IApiProjects` and the tag/report variants all expose one or both keys.
 */
interface ICmsTitledPage {
    options?: { headerTitle?: string | null }
    title?: { value?: string | null } | null
}

/**
 * Sets the document <title> from a CMS payload, preferring the editor-facing
 * `headerTitle` and falling back to the Kirby page title (several pages, such as
 * the legal notices, leave `headerTitle` empty).
 *
 * Returns `undefined` rather than an empty string when neither is set, so the
 * `titleTemplate` in app.vue falls back to the bare site name.
 */
export const useCmsPageTitle = (page: Ref<ICmsTitledPage | null | undefined>) => {
    useHead({
        title: () => page.value?.options?.headerTitle?.trim()
            || page.value?.title?.value?.trim()
            || undefined,
    })
}

import {Ref} from "vue";
import {IApiMenus} from "~/composable/adminApi/apiDefinitions";

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

export const useMenus: () => Ref<IApiMenus | null> =
    () => useState('menus', () => null)

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

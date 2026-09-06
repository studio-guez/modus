<template>
    <app-project-list
        api-endpoint="medias"
        page-type="media"
        :filter-groups="filterGroups"
        empty-message="Aucun média ne correspond à votre recherche."
        @play-video="handlePlayVideo"
        @play-podcast="handlePlayPodcast"
    />
</template>

<script setup lang="ts">
import AppProjectList, { FilterGroup, FilterOption } from "~/components/AppProjectList.vue";
import { IApiSingleProject } from "~/composable/adminApi/apiDefinitions";
import { useSpotifyUrl, useSpotifyTitle, usePodcastPlayerIsOpen, useYoutubeUrl, useYoutubeTitle } from '~/composable/main'

const spotifyUrl = useSpotifyUrl()
const spotifyTitle = useSpotifyTitle()
const playerIsOpen = usePodcastPlayerIsOpen()
const youtubeUrl = useYoutubeUrl()
const youtubeTitle = useYoutubeTitle()

const mediaTypeOptions: FilterOption[] = [
    { key: 'videos', label: 'Vidéos', bgColor: 'var(--app-color-yellow)', textColor: 'var(--app-color-black)', borderColor: 'var(--app-color-yellow)' },
    { key: 'podcasts', label: 'Podcasts', bgColor: 'var(--app-color-yellow-light)', textColor: 'var(--app-color-black)', borderColor: 'var(--app-color-yellow-light)' },
]

const filterGroups: FilterGroup[] = [
    {
        id: 'type',
        type: 'single',
        queryParam: 'type',
        options: mediaTypeOptions,
        filterFn: (item: IApiSingleProject, selectedKeys: string[]) => {
            const content = item.content as Record<string, unknown>
            const mediaType = content.mediatype as string | undefined
            return mediaType ? selectedKeys.includes(mediaType) : false
        }
    }
]

function handlePlayVideo(mediaUrl: string, title: string) {
    // Stop podcast if playing
    spotifyUrl.value = null
    spotifyTitle.value = null
    
    youtubeUrl.value = mediaUrl
    youtubeTitle.value = title
}

function handlePlayPodcast(mediaUrl: string, title: string) {
    // If same podcast, do nothing
    if (spotifyUrl.value === mediaUrl) {
        return
    }
    
    // Stop video if playing
    youtubeUrl.value = null
    youtubeTitle.value = null
    
    // Only start collapsed if player wasn't already open
    const wasAlreadyOpen = !!spotifyUrl.value
    spotifyUrl.value = mediaUrl
    spotifyTitle.value = title
    if (!wasAlreadyOpen) {
        playerIsOpen.value = false
    }
}
</script>

<template>
    <app-project-list :api-endpoint="apiEndpoint" :filter-groups="computedFilterGroups" :tags-as-links="true"
        empty-message="Aucun contenu ne correspond à votre recherche." @play-video="handlePlayVideo"
        @play-podcast="handlePlayPodcast" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppProjectList, { type FilterGroup, type FilterOption } from "~/components/AppProjectList.vue"
import type { IApiSingleProject } from "~/composable/adminApi/apiDefinitions"
import { ApiFetchProjects } from "~/composable/adminApi/apiFetch"
import { useSpotifyUrl, useSpotifyTitle, usePodcastPlayerIsOpen, useYoutubeUrl, useYoutubeTitle } from '~/composable/main'

const route = useRoute()
const slug = computed(() => String(Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug ?? ''))
const apiEndpoint = computed(() => `tags/${slug.value}`)

// Media player state
const spotifyUrl = useSpotifyUrl()
const spotifyTitle = useSpotifyTitle()
const playerIsOpen = usePodcastPlayerIsOpen()
const youtubeUrl = useYoutubeUrl()
const youtubeTitle = useYoutubeTitle()

// Fetch data to check if we have projects
const {data: tagData} = await useAsyncData(
    () => `tag-${slug.value}`,
    () => ApiFetchProjects(apiEndpoint.value),
    {watch: [slug]}
)

const hasProjects = computed(() => {
    if (!tagData.value) return false
    return Object.values(tagData.value.children).some((item: IApiSingleProject) => {
        const content = item.content as Record<string, unknown>
        return content.pageType === 'project'
    })
})

// Status filter options - same as projects page
const statusFilterOptions: FilterOption[] = [
    { key: 'en-cours', label: 'En cours', bgColor: 'transparent', textColor: 'var(--app-color-black)', borderColor: 'var(--app-color-black)' },
    { key: 'termine', label: 'Terminé', bgColor: 'transparent', textColor: 'var(--app-color-black)', borderColor: 'var(--app-color-black)' },
]

// Filter groups - only show status filter when projects exist
const computedFilterGroups = computed<FilterGroup[]>(() => {
    if (!hasProjects.value) return []

    return [
        {
            id: 'status',
            type: 'single',
            queryParam: 'status',
            options: statusFilterOptions,
            filterFn: (item: IApiSingleProject, selectedKeys: string[]) => {
                const content = item.content as Record<string, unknown>
                const pageType = content.pageType as string | undefined

                // Non-project items (medias, reports) are treated as "terminé"
                if (pageType !== 'project') {
                    return selectedKeys.includes('termine')
                }

                // For projects, check dates
                const isProjectWithDuration = content.isprojectwithduration === 'true'
                const dateEnd = content.dateend as string | undefined
                const isOngoing = isProjectWithDuration
                    ? !!(dateEnd && new Date(dateEnd) > new Date())
                    : content.projectstatus === 'en-cours'
                const computedStatus = isOngoing ? 'en-cours' : 'termine'
                return selectedKeys.includes(computedStatus)
            }
        }
    ]
})

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

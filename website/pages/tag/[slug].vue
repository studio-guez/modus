<template>
    <app-project-list :api-endpoint="apiEndpoint" :filter-groups="computedFilterGroups" :tags-as-links="true"
        empty-message="Aucun contenu ne correspond à votre recherche." @play-video="handlePlayVideo"
        @play-podcast="handlePlayPodcast" @pdf-download="handlePdfDownload" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import AppProjectList, { FilterGroup, FilterOption } from "~/components/AppProjectList.vue"
import { IApiSingleProject, IApiProjects } from "~/composable/adminApi/apiDefinitions"
import { ApiFetchProjects } from "~/composable/adminApi/apiFetch"
import { useSpotifyUrl, useSpotifyTitle, usePodcastPlayerIsOpen, useYoutubeUrl, useYoutubeTitle } from '~/composable/main'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const apiEndpoint = computed(() => `tags/${slug.value}`)

// Media player state
const spotifyUrl = useSpotifyUrl()
const spotifyTitle = useSpotifyTitle()
const playerIsOpen = usePodcastPlayerIsOpen()
const youtubeUrl = useYoutubeUrl()
const youtubeTitle = useYoutubeTitle()

// Track if we have projects in the content
const hasProjects = ref(false)

// Fetch data to check if we have projects
onMounted(async () => {
    try {
        const data: IApiProjects = await ApiFetchProjects(apiEndpoint.value)
        const children = Object.values(data.children)
        hasProjects.value = children.some((item: IApiSingleProject) => {
            const content = item.content as Record<string, unknown>
            return content.pageType === 'project'
        })
    } catch (e) {
        console.error('Failed to fetch tag data:', e)
    }
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

function handlePdfDownload(pdfUrl: string) {
    window.open(pdfUrl, '_blank')
}
</script>

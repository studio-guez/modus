<template>
  <div class="v-spotify-controler" v-if="spotifyUrl" :key="spotifyUrl">
    <div ref="embedContainer" class="v-spotify-controler__embed"></div>
  </div>
</template>

<script setup lang="ts">
import { useSpotifyUrl, useSpotifyIsPlaying, useSpotifyTogglePlay } from '~/composable/main'

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: SpotifyIFrameAPI) => void
    SpotifyIframeApi?: SpotifyIFrameAPI
  }
}

interface SpotifyIFrameAPI {
  createController: (
    element: HTMLElement,
    options: { uri: string; height?: number; width?: string },
    callback: (controller: SpotifyEmbedController) => void
  ) => void
}

interface SpotifyEmbedController {
  togglePlay: () => void
  play: () => void
  pause: () => void
  addListener: (event: string, callback: (data: unknown) => void) => void
  destroy: () => void
}

const spotifyUrl = useSpotifyUrl()
const isPlaying = useSpotifyIsPlaying()
const togglePlayRef = useSpotifyTogglePlay()

const embedContainer = ref<HTMLElement | null>(null)
let currentController: SpotifyEmbedController | null = null
let iframeApiLoaded = false
let iframeApi: SpotifyIFrameAPI | null = null

function getSpotifyUri(url: string): string | null {
  const match = url.match(/episode\/([a-zA-Z0-9]+)/)
  return match ? `spotify:episode:${match[1]}` : null
}

function loadIframeApi(): Promise<SpotifyIFrameAPI> {
  return new Promise((resolve) => {
    if (iframeApi) {
      resolve(iframeApi)
      return
    }

    if (window.SpotifyIframeApi) {
      iframeApi = window.SpotifyIframeApi
      resolve(iframeApi)
      return
    }

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      iframeApi = IFrameAPI
      window.SpotifyIframeApi = IFrameAPI
      resolve(IFrameAPI)
    }

    if (!iframeApiLoaded) {
      const script = document.createElement('script')
      script.src = 'https://open.spotify.com/embed/iframe-api/v1'
      script.async = true
      document.body.appendChild(script)
      iframeApiLoaded = true
    }
  })
}

function createPlayer(api: SpotifyIFrameAPI, uri: string) {
  if (!embedContainer.value) return

  // Clear previous content
  embedContainer.value.innerHTML = ''

  api.createController(
    embedContainer.value,
    { uri, height: 152, width: '100%' },
    (controller) => {
      currentController = controller

      togglePlayRef.value = () => {
        controller.togglePlay()
      }

      controller.addListener('playback_update', (e: unknown) => {
        const data = e as { data: { isPaused: boolean } }
        isPlaying.value = !data.data.isPaused
      })

      // Wait for ready state then auto-play
      controller.addListener('ready', () => {
        controller.play()
      })
    }
  )
}

watch(spotifyUrl, async (newUrl: string | null) => {
  // Always destroy existing controller first
  if (currentController) {
    currentController.destroy()
    currentController = null
  }
  isPlaying.value = false
  togglePlayRef.value = null

  if (!newUrl) {
    return
  }

  const uri = getSpotifyUri(newUrl)
  if (!uri) {
    console.error('Invalid Spotify URL:', newUrl)
    return
  }

  const api = await loadIframeApi()
  
  await nextTick()
  createPlayer(api, uri)
}, { immediate: true })

onUnmounted(() => {
  if (currentController) {
    currentController.destroy()
    currentController = null
  }
  isPlaying.value = false
  togglePlayRef.value = null
})
</script>

<style lang="scss" scoped>
.v-spotify-controler {
  width: 100%;
  background-color: #1f1f1f; // Match Spotify dark theme bg

  &__embed {
    width: 100%;
    background-color: #1f1f1f;
    
    :deep(iframe) {
      display: block;
    }
  }
}
</style>

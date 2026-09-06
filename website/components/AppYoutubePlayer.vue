<template>
  <section class="v-youtube-player" :class="{ 'v-youtube-player--short': isShort }" v-if="youtubeUrl">
    <div class="v-youtube-player__container">
      <button
        @click="closePlayer"
        aria-label="Fermer le lecteur"
        class="v-youtube-player__close-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </button>
      <div class="v-youtube-player__iframe-container">
        <iframe
          :src="embedUrl"
          :title="youtubeTitle || 'YouTube video player'"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useYoutubeUrl, useYoutubeTitle } from '~/composable/main'

const youtubeUrl = useYoutubeUrl()
const youtubeTitle = useYoutubeTitle()

// Detect if the URL is a YouTube Short
const isShort = computed(() => {
  if (!youtubeUrl.value) return false
  return /youtube\.com\/shorts\//.test(youtubeUrl.value)
})

function extractVideoId(url: string): string | null {
  // youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (shortMatch) return shortMatch[1]

  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
  if (watchMatch) return watchMatch[1]

  // youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)
  if (embedMatch) return embedMatch[1]

  // youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/)
  if (shortsMatch) return shortsMatch[1]

  return null
}

const embedUrl = computed(() => {
  if (!youtubeUrl.value) return null

  const videoId = extractVideoId(youtubeUrl.value)
  if (!videoId) {
    console.error('Invalid YouTube URL:', youtubeUrl.value)
    return null
  }

  // Use youtube-nocookie.com and add origin parameter for Safari compatibility (Error 153 fix)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const baseUrl = `https://www.youtube-nocookie.com/embed/${videoId}`
  
  if (isShort.value) {
    return `${baseUrl}?autoplay=1&loop=1&playlist=${videoId}&origin=${origin}`
  }
  return `${baseUrl}?autoplay=1&origin=${origin}`
})

function closePlayer() {
  youtubeUrl.value = null
  youtubeTitle.value = null
}
</script>

<style lang="scss" scoped>
.v-youtube-player {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  width: 480px;
  max-width: calc(100vw - 2rem);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-radius: 1.66666666667rem;
  overflow: hidden;
  background: #000;

  &:hover .v-youtube-player__close-btn{
    opacity: 1;
  }
}

.v-youtube-player--short {
  width: 270px;
}

.v-youtube-player__container {
  position: relative;
}

.v-youtube-player__close-btn {
  position: absolute;
  top: .5rem;
  right: .5rem;
  border: none;
  width: 1.77777777778rem;
  height: 1.77777777778rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  cursor: pointer;
  color: white;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.1s;
}

.v-youtube-player__iframe-container {
  position: relative;
  padding-bottom: 56.25%; // 16:9 aspect ratio
  height: 0;
  overflow: hidden;

  .v-youtube-player--short & {
    padding-bottom: 177.78%; // 9:16 aspect ratio for Shorts
  }
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

@media (max-width: 600px) {
  .v-youtube-player {
    bottom: 1rem;
    right: 1rem;
    max-width: calc(100vw - 2rem);
  }
}
</style>

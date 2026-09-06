<template>
  <section
    class="v-podcast-player"
    :class="{
      'v-podcast-player--is-open': playerIsOpen,
      'v-podcast-player--has-url': spotifyUrl
    }"
    v-if="spotifyUrl"
  >
    <div class="v-podcast-player__container">
      <div class="v-podcast-player__header">
        <div class="v-podcast-player__header__ui">
          <span class="v-podcast-player__header__title">
            {{ spotifyTitle }}
          </span>
          <button
            @click="togglePlay?.()"
            :aria-label="isPlaying ? 'Mettre en pause' : 'Lecture'"
            class="v-podcast-player__btn"
            :disabled="!togglePlay"
          >
            <svg
              v-if="isPlaying"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M320-200v-560l440 280-440 280Z" />
            </svg>
          </button>
          <button
            @click="togglePlayerIsOpen"
            :aria-label="toggleButtonAriaLabel"
            :aria-expanded="playerIsOpen"
            class="v-podcast-player__btn"
          >
            <svg
              v-if="playerIsOpen"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="m136-80-56-56 264-264H160v-80h320v320h-80v-184L136-80Zm344-400v-320h80v184l264-264 56 56-264 264h184v80H480Z" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M120-120v-320h80v184l504-504H520v-80h320v320h-80v-184L256-200h184v80H120Z" />
            </svg>
          </button>
          <button
            @click="closePlayer"
            aria-label="Fermer le lecteur"
            class="v-podcast-player__btn"
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
        </div>
      </div>
      <div class="v-podcast-player__iframe-container">
        <SpotifyControler />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSpotifyUrl, useSpotifyTitle, usePodcastPlayerIsOpen, useSpotifyIsPlaying, useSpotifyTogglePlay } from '~/composable/main'

const spotifyUrl = useSpotifyUrl()
const spotifyTitle = useSpotifyTitle()
const playerIsOpen = usePodcastPlayerIsOpen()
const isPlaying = useSpotifyIsPlaying()
const togglePlay = useSpotifyTogglePlay()

const toggleButtonAriaLabel = computed(() =>
  playerIsOpen.value ? 'Réduire le lecteur audio' : 'Agrandir le lecteur audio'
)

function togglePlayerIsOpen() {
  playerIsOpen.value = !playerIsOpen.value
  updateBodyClass()
}

function closePlayer() {
  spotifyUrl.value = null
  spotifyTitle.value = null
  playerIsOpen.value = false
  updateBodyClass()
}

function updateBodyClass() {
  if (playerIsOpen.value && spotifyUrl.value) {
    document.body.classList.add('podcast-player-is-open')
  } else {
    document.body.classList.remove('podcast-player-is-open')
  }
}

watch(spotifyUrl, (newUrl: string | null) => {
  if (!newUrl) {
    updateBodyClass()
  }
})

onUnmounted(() => {
  document.body.classList.remove('podcast-player-is-open')
})
</script>

<style lang="scss" scoped>
.v-podcast-player {
  width: 100%;
  max-height: var(--app-podcast-player-header-height);
  overflow: hidden;
  color: var(--app-color-black);
  transition: max-height 0.25s ease-in-out;
  background: var(--app-color-yellow-light);
  &.v-podcast-player--is-open {
    max-height: calc(var(--app-podcast-player-header-height) + var(--app-podcast-player-iframe-height));
  }
}

.v-podcast-player__container {
  width: 100%;
}

.v-podcast-player__header {
  display: flex;
  justify-content: flex-end;
  height: var(--app-podcast-player-header-height);
  align-items: center;
  padding: 0 1rem;
  box-sizing: border-box;
  gap: 1rem;
  flex-wrap: nowrap;
  width: 100%;
}

.v-podcast-player__header__title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  font-weight: 600;
  margin-right: 0.25rem;
}

.v-podcast-player__header__ui {
  display: flex;
  align-items: center;
  user-select: none;
  gap: 0.5rem;
  flex-shrink: 0;
}

.v-podcast-player__btn {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  svg {
    display: block;
    height: 1.25rem;
    width: auto;
  }
}

.v-podcast-player__iframe-container {
  width: 100%;
  height: var(--app-podcast-player-iframe-height);
  overflow: hidden;
  background-color: #121212; // Match Spotify dark theme
}
</style>

<template>
  <div class="v-app-highlights-outer">
    <section class="v-app-highlights">
      <div class="v-app-highlights__header">
        <h2 v-if="title" class="v-app-highlights__title">{{ title }}</h2>
        <p v-if="subtitle" class="v-app-highlights__subtitle">{{ subtitle }}</p>
      </div>

      <div class="v-app-highlights__track-wrapper">
        <button
          v-if="canScrollPrev"
          class="v-app-highlights__nav v-app-highlights__nav--prev"
          @click="scrollPrev"
          aria-label="Previous"
        >
          <div class="v-app-highlights__nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="21" viewBox="0 0 15 21" fill="none">
              <path d="M0.949951 1.16089L11.95 10.1609L0.949951 19.1609" stroke="#016052" stroke-width="3"/>
            </svg>
          </div>
        </button>

        <div
          ref="trackRef"
          class="v-app-highlights__track"
          :class="{ 'v-app-highlights__track--pointer': isPointerDevice }"
        >
          <div class="v-app-highlights__item" v-for="(item, idx) in items" :key="idx">
            <app-item-card
              v-bind="mapItemToCardProps(item)"
              @play-video="handlePlayVideo"
              @play-podcast="handlePlayPodcast"
            />
          </div>
        </div>

        <button
          v-if="canScrollNext"
          class="v-app-highlights__nav v-app-highlights__nav--next"
          @click="scrollNext"
          aria-label="Next"
        >
          <div class="v-app-highlights__nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="21" viewBox="0 0 15 21" fill="none">
              <path d="M0.949951 1.16089L11.95 10.1609L0.949951 19.1609" stroke="#016052" stroke-width="3"/>
            </svg>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>


<script setup lang="ts">
import AppItemCard from '~/components/AppItemCard.vue'
import { mapItemToCardProps } from '~/utils/mapItemToCardProps'
import type { IApiSingleProject } from '~/composable/adminApi/apiDefinitions'
import { useSpotifyUrl, useSpotifyTitle, usePodcastPlayerIsOpen, useYoutubeUrl, useYoutubeTitle } from '~/composable/main'

const props = defineProps<{
  title?: string
  subtitle?: string
  items: IApiSingleProject[]
}>()

const emit = defineEmits<{
  (e: 'play-video', mediaUrl: string, title: string): void
  (e: 'play-podcast', mediaUrl: string, title: string): void
}>()

const spotifyUrl = useSpotifyUrl()
const spotifyTitle = useSpotifyTitle()
const playerIsOpen = usePodcastPlayerIsOpen()
const youtubeUrl = useYoutubeUrl()
const youtubeTitle = useYoutubeTitle()

function handlePlayVideo(mediaUrl: string, title: string) {
  spotifyUrl.value = null
  spotifyTitle.value = null
  youtubeUrl.value = mediaUrl
  youtubeTitle.value = title
}

function handlePlayPodcast(mediaUrl: string, title: string) {
  if (spotifyUrl.value === mediaUrl) return
  youtubeUrl.value = null
  youtubeTitle.value = null
  const wasAlreadyOpen = !!spotifyUrl.value
  spotifyUrl.value = mediaUrl
  spotifyTitle.value = title
  if (!wasAlreadyOpen) {
    playerIsOpen.value = false
  }
}
const trackRef = ref<HTMLElement | null>(null)
const isPointerDevice = ref(false)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

function updateScrollState() {
  const track = trackRef.value
  if (!track) return
  canScrollPrev.value = track.scrollLeft > 1
  canScrollNext.value = track.scrollLeft < track.scrollWidth - track.clientWidth - 1
}

function scrollPrev() {
  const track = trackRef.value
  if (!track) return
  const item = track.querySelector('.v-app-highlights__item') as HTMLElement
  if (!item) return
  const gap = parseFloat(getComputedStyle(track).gap) || 0
  track.scrollBy({ left: -(item.offsetWidth + gap), behavior: 'smooth' })
}

function scrollNext() {
  const track = trackRef.value
  if (!track) return
  const item = track.querySelector('.v-app-highlights__item') as HTMLElement
  if (!item) return
  const gap = parseFloat(getComputedStyle(track).gap) || 0
  track.scrollBy({ left: item.offsetWidth + gap, behavior: 'smooth' })
}

onMounted(() => {
  const mql = window.matchMedia('(pointer: fine)')
  isPointerDevice.value = mql.matches

  const updatePointerType = (e: MediaQueryListEvent) => {
    isPointerDevice.value = e.matches
    nextTick(updateScrollState)
  }
  mql.addEventListener('change', updatePointerType)

  nextTick(updateScrollState)

  // Update button visibility on track scroll
  trackRef.value?.addEventListener('scroll', updateScrollState, { passive: true })

  // Recalculate on resize
  const ro = new ResizeObserver(() => updateScrollState())
  if (trackRef.value) ro.observe(trackRef.value)

  onBeforeUnmount(() => {
    trackRef.value?.removeEventListener('scroll', updateScrollState)
    mql.removeEventListener('change', updatePointerType)
    ro.disconnect()
  })
})
</script>


<style lang="scss" scoped>
.v-app-highlights-outer {
  position: relative;
}

.v-app-highlights {
  width: 100%;
  padding: 4.22222222222rem 0;
}

.v-app-highlights__header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 0 var(--app-base-gutter);
}

.v-app-highlights__title {
  margin: 0 0 0.25rem 0;
  color: var(--app-color-black);
  font-size: 3.55555555556rem;
  font-weight: 600;
  line-height: 1.14;

  @media (max-width: 1280px) {
    font-size: 2.5rem;
  }
  @media (max-width: 900px) {
    font-weight: 900;
    font-size: 1.45rem;
    line-height: 1.225;
    margin-bottom: 0.25em;
  }
}

.v-app-highlights__subtitle {
  color: var(--app-color-black);
  font-weight: 600;
  margin: 0;
  font-size: 1.33333333333rem;
  max-width: none;
}

/* Track wrapper with nav buttons */
.v-app-highlights__track-wrapper {
  position: relative;
}

.v-app-highlights__nav {
  all: unset;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;
  width: 4.94444444444rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--app-color-grey);
  opacity: 0.8;
  transition: opacity 0.2s ease;
  padding: 0;

  @media (max-width: 900px) {
    display: none;
  }

  &:hover {
    opacity: 0.9;
  }

  svg {
    display: block;
    flex-shrink: 0;
    height: 1rem;
  }
}

.v-app-highlights__nav-icon{
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--app-color-main--dark);
  border-radius: 50%;
  width: 2.77777777778rem;
  height: 2.77777777778rem;
}

.v-app-highlights__nav--prev {
  left: 0;

  svg {
    transform: rotate(180deg);
  }
}

.v-app-highlights__nav--next {
  right: 0;
}

/* Scrollable track */
.v-app-highlights__track {
  --padding-x: max(var(--app-gutter), calc((100vw - 1300px ) / 2 + var(--app-gutter)));
  display: flex;
  gap: 1.11111111111rem;
  padding: 0 var(--padding-x) 0 var(--padding-x);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  /* Pointer devices: hide scrollbar, navigation via buttons */
  &.v-app-highlights__track--pointer {
    overflow-x: hidden;
    scroll-snap-type: none;

    @media (max-width: 900px) {
      overflow-x: auto;
      scroll-snap-type: x mandatory;
    }
  }
}

.v-app-highlights__item {
  flex: 0 0 max(22rem, calc(33vw - 0.74074074074rem));
  display: flex;
  @media (max-width: 900px) {
    flex: 0 0 95%;
  }
  @media (min-width: 1921px) {
  flex: 0 0 max(26rem, calc(20vw - 0.74074074074rem));
  }
}
</style>

<template>
  <div v-if="visibleActualites.length > 0" class="v-actualites-bar">
    <div
      v-for="(actualite, index) in visibleActualites"
      :key="index"
      class="v-actualites-bar__item"
      :style="{ '--actualite-bg': `var(--app-color-${actualite.color})` }"
    >
      <div class="v-actualites-bar__scroll-container">
        <component
          :is="actualite.link ? 'a' : 'div'"
          :href="actualite.link || undefined"
          :target="actualite.link ? '_blank' : undefined"
          class="v-actualites-bar__scroll"
        >
          <span
            v-for="n in getRepeatCount(index)"
            :key="'a' + n"
            class="v-actualites-bar__scroll-item"
          >
            <span class="v-actualites-bar__text">{{ actualite.title }}</span>
            <svg-actualites class="v-actualites-bar__logo" />
          </span>
          <span
            v-for="n in getRepeatCount(index)"
            :key="'b' + n"
            class="v-actualites-bar__scroll-item"
          >
            <span class="v-actualites-bar__text">{{ actualite.title }}</span>
            <svg-actualites class="v-actualites-bar__logo" />
          </span>
        </component>
      </div>
      <button
        type="button"
        class="v-actualites-bar__close"
        @click="dismissActualite(index)"
        aria-label="Fermer"
      >
        <svg-close />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useActualites, type IActualiteGlobal } from '~/composable/main'

const actualites = useActualites()

const dismissedIndices = ref<number[]>([])

const visibleActualites = computed(() => {
  return actualites.value.filter((_: IActualiteGlobal, index: number) => !dismissedIndices.value.includes(index))
})

const windowWidth = ref(0)

const repeatCounts = computed(() => {
  return actualites.value.map((actualite: IActualiteGlobal) => {
    const estimatedItemWidth = actualite.title.length * 20 + 150
    const neededWidth = windowWidth.value * 2
    return Math.max(4, Math.ceil(neededWidth / estimatedItemWidth) + 2)
  })
})

function getRepeatCount(index: number): number {
  const actualIndex = actualites.value.findIndex((act: IActualiteGlobal, i: number) =>
    !dismissedIndices.value.includes(i) &&
    visibleActualites.value.indexOf(act) === index
  )
  return repeatCounts.value[actualIndex ?? 0] ?? 4
}

function updateWindowWidth() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  updateWindowWidth()
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

function dismissActualite(index: number) {
  const actualIndex = actualites.value.findIndex((act: IActualiteGlobal, i: number) =>
    !dismissedIndices.value.includes(i) &&
    visibleActualites.value.indexOf(act) === index
  )
  if (actualIndex !== undefined && actualIndex !== -1) {
    dismissedIndices.value = [...dismissedIndices.value, actualIndex]
  }
}
</script>

<style lang="scss" scoped>
.v-actualites-bar {
  display: flex;
  flex-direction: column;
  color: var(--app-color-black);
  width: 100%;
}

.v-actualites-bar__item {
  display: flex;
  align-items: center;
  background-color: var(--actualite-bg, var(--app-color-teal));
  height: 3.5rem;
  overflow: hidden;
  position: relative;

  @media (max-width: 900px) {
    height: 2.5rem;
  }
}

.v-actualites-bar__scroll-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  height: 100%;
}

.v-actualites-bar__scroll {
  display: flex;
  align-items: center;
  height: 100%;
  animation: scrollActualiteBar 60s linear infinite;
  width: max-content;
  text-decoration: none;
  color: inherit;

  &:hover {
    animation-play-state: paused;
  }
  @media (max-width: 900px) {
    animation-duration: 40s;
  }
}

.v-actualites-bar__scroll-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-left: 1.5rem;
  white-space: nowrap;

  @media (max-width: 900px) {
    gap: 0.5rem;
    padding-left: 0.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;

    @media (max-width: 900px) {
      padding-right: 0.5rem;
    }
  }
}

.v-actualites-bar__text {
  font-size: 2rem;
  font-weight: 700;

  @media (max-width: 900px) {
    font-size: 1.25rem;
  }
}

.v-actualites-bar__logo {
  flex-shrink: 0;
  height: 2.5rem;
  width: auto;

  @media (max-width: 900px) {
    height: 1.5rem;
  }
}

.v-actualites-bar__close {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  background-color: var(--actualite-bg, var(--app-color-teal));
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s ease;

  @media (max-width: 900px) {
    width: 2.5rem;
    height: 2.5rem;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;

    @media (max-width: 900px) {
      width: 1rem;
      height: 1rem;
    }
  }
}

@keyframes scrollActualiteBar {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>

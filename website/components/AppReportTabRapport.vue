<template>
  <article ref="articleRef" class="v-report-tab-rapport">
    <h1 class="v-report-tab-rapport__title">{{ title }}</h1>
    <template v-if="bodyContent.length > 0">
      <template v-for="(item, index) in bodyContent" :key="index">
        <!-- mdheading blocks -->
        <template v-if="item.content?.type === 'mdheading'">
          <app-report-heading :level="item.content.content.level" :text="item.content.content.text"
            class="v-report-tab-rapport__section v-report-tab-rapport__section--full" />
        </template>

        <!-- reportbody blocks -->
        <template v-else-if="item.content?.type === 'reportbody'">
          <app-report-text :text="item.content.content.text"
            class="v-report-tab-rapport__section v-report-tab-rapport__section--full" />
        </template>

        <!-- mdreportimage blocks -->
        <template v-else-if="item.content?.type === 'mdreportimage'">
          <app-report-image :image="item.image?.[0]" :size="item.content.content.size || 'large'"
            :alt="item.content.content.alt" :caption="item.content.content.caption"
            :alignment="item.content.content.alignment || 'left'"
            :figure-number="item.figureNumber"
            class="v-report-tab-rapport__section" :class="{
              'v-report-tab-rapport__section--full': item.content.content.size === 'full' || item.content.content.size === 'large'
            }" />
        </template>
      </template>
    </template>

    <!-- Floating bibliography tooltip -->
    <Transition name="tooltip-container">
      <div v-if="visibleRefs.length > 0" class="v-report-tab-rapport__bib-tooltip">
        <TransitionGroup name="bib-item" tag="div" class="v-report-tab-rapport__bib-list">
          <div v-for="refIndex in visibleRefs" :key="refIndex" class="v-report-tab-rapport__bib-item">
            <span class="v-report-tab-rapport__bib-number">[{{ refIndex }}]</span>
            <span class="v-report-tab-rapport__bib-text" v-html="getBibliographyText(refIndex)"></span>
          </div>
        </TransitionGroup>
      </div>
    </Transition>
  </article>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import AppReportHeading from '~/components/AppReportHeading.vue'
import AppReportText from '~/components/AppReportText.vue'
import AppReportImage from '~/components/AppReportImage.vue'

interface BibliographyItem {
  id?: string
  index?: number
  text?: string
}

const props = defineProps<{
  title: string
  bodyContent: any[]
  bibliography?: BibliographyItem[]
}>()

const articleRef = ref<HTMLElement | null>(null)
const visibleRefs = ref<number[]>([])
let observer: IntersectionObserver | null = null

const getBibliographyText = (index: number): string => {
  const item = props.bibliography?.find((b: BibliographyItem) => b.index === index)
  return item?.text || ''
}

const setupObserver = () => {
  if (!articleRef.value || typeof IntersectionObserver === 'undefined') return

  // Clean up existing observer
  if (observer) {
    observer.disconnect()
  }

  const refElements = articleRef.value.querySelectorAll('.bib-ref[data-ref]')
  if (refElements.length === 0) return

  // Get nav height to exclude refs behind it
  const navEl = document.querySelector('.v-app-nav')
  const navHeight = navEl ? navEl.getBoundingClientRect().height : 0

  const visibleSet = new Set<number>()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const refNumber = parseInt((entry.target as HTMLElement).dataset.ref || '', 10)
        if (isNaN(refNumber)) return

        if (entry.isIntersecting) {
          visibleSet.add(refNumber)
        } else {
          visibleSet.delete(refNumber)
        }
      })

      visibleRefs.value = Array.from(visibleSet).sort((a, b) => a - b)
    },
    {
      root: null,
      rootMargin: `-${navHeight}px 0px 0px 0px`,
      threshold: 0.1,
    }
  )

  refElements.forEach((el: Element) => {
    observer!.observe(el)
  })
}

const scrollToFigure = (figureNumber: number) => {
  const el = document.getElementById(`figure-${figureNumber}`)
  if (!el) return
  const navEl = document.querySelector<HTMLElement>('.v-app-nav')
  const offset = navEl ? navEl.getBoundingClientRect().height : 0
  const top = el.getBoundingClientRect().top + window.scrollY - offset - 16
  window.scrollTo({ top, behavior: 'smooth' })
}

const setupFigureRefClickHandlers = () => {
  if (!articleRef.value) return
  const figureRefs = articleRef.value.querySelectorAll('.figure-ref[data-figure]')
  figureRefs.forEach((el: Element) => {
    const htmlEl = el as HTMLElement
    htmlEl.style.cursor = 'pointer'
    htmlEl.addEventListener('click', () => {
      const figNum = parseInt(htmlEl.dataset.figure || '', 10)
      if (!isNaN(figNum)) scrollToFigure(figNum)
    })
  })
}

onMounted(() => {
  nextTick(() => {
    setupObserver()
    setupFigureRefClickHandlers()
  })
})

// Re-setup observer when body content changes
watch(() => props.bodyContent, () => {
  nextTick(() => {
    setupObserver()
    setupFigureRefClickHandlers()
  })
}, { deep: true })

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}

.v-report-tab-rapport {
  background: var(--app-color-white);
  padding: var(--app-report-tab-padding-y) 0;
  min-height: var(--app-report-tab-min-height);
}

.v-report-tab-rapport__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--app-color-main);
  margin: 0 0 1rem 0;
  padding: 0 var(--app-report-tab-padding-x);
  text-wrap: balance;
  line-height: 1.14;

  @media (min-width: 768px) {
    font-weight: 600;
    font-size: 3.55555555556rem;
  }
}

.v-report-tab-rapport__section {
  display: block;
}

.v-report-tab-rapport__section--full {
  width: 100%;
}

// Floating bibliography tooltip
.v-report-tab-rapport__bib-tooltip {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  padding: 0 var(--app-base-padding-x) 0.25rem var(--app-base-padding-x);
  z-index: 100;
  @media (max-width: 1024px) {
    display: none;
  }
}

.v-report-tab-rapport__bib-item {
  font-size: 0.88888888888rem;
  line-height: 1.4;
  color: var(--app-color-black);
  font-weight: 500;
  background-color: var(--app-color-sage);
  padding: .75rem 1.11111111111rem;
  border-radius: 2000px;
}

.v-report-tab-rapport__bib-number {
  font-weight: 700;
  margin-right: 0.25rem;
}

.v-report-tab-rapport__bib-text {
  :deep(a) {
    color: var(--app-color-main);
    word-break: break-all;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

// Bibliography list container
.v-report-tab-rapport__bib-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

// Container transition (when all items appear/disappear)
.tooltip-container-enter-active,
.tooltip-container-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.tooltip-container-enter-from,
.tooltip-container-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

// Individual item transitions
.bib-item-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.bib-item-leave-active {
  transition: opacity 0.25s ease-out;
}

// Moving items transition (push/pull effect)
.bib-item-move {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.bib-item-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.bib-item-leave-to {
  opacity: 0;
}
</style>

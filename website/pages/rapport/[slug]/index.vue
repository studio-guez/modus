<template>
  <div class="v-report-page">

    <main ref="mainRef">
      <!-- Main Layout: Sidebar (1/5) + Tabs (4/5) -->
      <div class="v-report-page__main-layout">
        <!-- Left: Sidebar TOC (1/5) -->
        <app-report-sidebar v-if="bodyContentArray.length > 0" :body-content="bodyContentArray" class="v-report-page__sidebar" />

        <!-- Right: Tabs and Content (4/5) -->
        <div class="v-report-page__right">
          <!-- Tabs Navigation -->
          <div class="v-report-page__tabs">
            <button v-for="tab in tabs" :key="tab.key" class="v-report-page__tab" :class="[tab.class, { 'v-report-page__tab--active': activeTab === tab.key }]" @click="activeTab = tab.key">
              {{ tab.label }}
            </button>
          </div>

          <!-- Main Content Area -->
          <div class="v-report-page__content">
            <!-- Tab: Rapport -->
            <app-report-tab-rapport v-show="activeTab === 'rapport'" :body-content="bodyContentArray" :title="headerText ?? ''" :bibliography="bibliography" />

            <!-- Tab: Bibliographie -->
            <app-report-tab-bibliographie v-show="activeTab === 'bibliographie'" :bibliography="bibliography" @go-to-ref="goToRef" />

            <!-- Tab: Citations -->
            <app-report-tab-citations v-show="activeTab === 'citations'" :title="headerText || ''" :slug="currentSlug || ''" :summary="summary"
              :date-start="dateStart" />

            <!-- Tab: En lien -->
            <app-report-tab-en-lien v-show="activeTab === 'en-lien'" :tags="parsedTags" :related-reports="relatedReports" :linked-projects="linkedProjects" />
          </div>
          <!-- Download PDF Button -->
          <a :href="pdfDownloadUrl" class="v-report-page__download" :class="{ 'v-report-page__download--hidden': !isMainVisible }" target="_blank" rel="noopener" title="Télécharger le rapport au format PDF" aria-label="Télécharger le rapport au format PDF">
            <svg xmlns="http://www.w3.org/2000/svg" width="63" height="63" viewBox="0 0 63 63" fill="none">
                <path d="M54.2732 38.7669V49.1047C54.2732 50.4756 53.7286 51.7903 52.7593 52.7597C51.7899 53.729 50.4752 54.2736 49.1043 54.2736H12.9218C11.551 54.2736 10.2362 53.729 9.26687 52.7597C8.29751 51.7903 7.75293 50.4756 7.75293 49.1047V38.7669M18.0908 25.8446L31.0131 38.7669M31.0131 38.7669L43.9354 25.8446M31.0131 38.7669V7.75336" stroke="#1E1E1E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
      <app-share-link />
    </main>

    <!-- Footer -->
    <app-page-footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ApiFetchPage } from '~/composable/adminApi/apiFetch'
import { buildPdfUrl } from '~/utils/backendUrl'
import AppPageFooter from '~/components/AppPageFooter.vue'
import AppReportSidebar from '~/components/AppReportSidebar.vue'
import AppReportTabRapport from '~/components/AppReportTabRapport.vue'
import AppReportTabBibliographie from '~/components/AppReportTabBibliographie.vue'
import AppReportTabCitations from '~/components/AppReportTabCitations.vue'
import AppReportTabEnLien from '~/components/AppReportTabEnLien.vue'

interface BibliographyItem {
  id?: string
  text?: string
}

interface Tag {
  name: string
  slug: string
}

interface RelatedReport {
  slug: string
  title: string
  headerTitle?: string
  headerImage?: {
    mediaUrl?: string
    focus?: string
    resize?: {
      tiny?: string
      small?: string
      reg?: string
      large?: string
    }
  }
  tags?: string
  dateStart?: string
  preview?: string
}

const tabs = computed(() => {
  const result: { key: string; label: string; class?: string }[] = [
    { key: 'rapport', label: 'Rapport', class: 'v-report-page__tab--main' },
  ]
  if (bibliography.value && bibliography.value.length > 0) {
    result.push({ key: 'bibliographie', label: 'Bibliographie' })
  }
  result.push({ key: 'citations', label: 'Citations' })
  if ((parsedTags.value && parsedTags.value.length > 0) || linkedProjects.value.length > 0) {
    result.push({ key: 'en-lien', label: 'En lien' })
  }
  return result
})

const route = useRoute()
const router = useRouter()

const validTabs = ['rapport', 'bibliographie', 'citations', 'en-lien']
const initialTab = validTabs.includes(route.query.tab as string) ? (route.query.tab as string) : 'rapport'
const activeTab = ref(initialTab)

// Update URL when tab changes
watch(activeTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } })
})

const slug = computed(() => String(route.params.slug))
const currentSlug = computed(() => slug.value)

const {data: pageData} = await useAsyncData(
  () => `rapport-${slug.value}`,
  () => ApiFetchPage(`bibliotheque/${slug.value}`),
  {watch: [slug]}
)

const headerCover = computed(() => pageData.value?.options.headerImage?.mediaUrl)
const headerFocus = computed(() => pageData.value?.options.headerImage?.focus)
const headerText = computed(() => pageData.value?.options.headerTitle)
const bodyContent = computed<any>(() => pageData.value?.body)
const dateStart = computed(() => pageData.value?.options.dateStart)
const tags = computed<Tag[]>(() => (pageData.value?.options as any)?.tags || [])
const summary = computed<string | undefined>(() => (pageData.value as any)?.summary)
const bibliography = computed<BibliographyItem[]>(() => (pageData.value as any)?.bibliography || [])
const relatedReports = computed<RelatedReport[]>(() => (pageData.value as any)?.relatedReports || [])
const linkedProjects = computed<{ slug: string; title: string; dateStart?: string }[]>(() => (pageData.value as any)?.linkedProjects || [])

// Main element ref and visibility tracking
const mainRef = ref<HTMLElement | null>(null)
const isMainVisible = ref(true)

const goToRef = (index: number | undefined) => {
  if (index == null) return
  activeTab.value = 'rapport'
  nextTick(() => {
    const el = document.querySelector<HTMLElement>(`.bib-ref[data-ref="${index}"]`)
    if (!el) return
    const navEl = document.querySelector<HTMLElement>('.v-app-nav')
    const offset = navEl ? navEl.getBoundingClientRect().height : 0
    const top = el.getBoundingClientRect().top + window.scrollY - offset - 16
    window.scrollTo({ top, behavior: 'smooth' })
  })
}

// Calculate if button overlaps outside main based on scroll position
const checkButtonVisibility = () => {
  if (!mainRef.value) return
  
  const mainRect = mainRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const isMobile = window.innerWidth <= 1024
  
  // Button dimensions and position vary by viewport
  // Desktop: top: 50%, size: 4.72222222222rem (~85px at 18px base)
  // Mobile: bottom: 0.5rem, size: 3rem (~54px at 18px base)
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
  
  let buttonTop: number
  let buttonBottom: number
  
  if (isMobile) {
    const buttonSize = 3 * rootFontSize
    const bottomOffset = 0.5 * rootFontSize
    buttonBottom = viewportHeight - bottomOffset
    buttonTop = buttonBottom - buttonSize
  } else {
    const buttonSize = 4.72222222222 * rootFontSize
    const buttonCenter = viewportHeight / 2
    buttonTop = buttonCenter - (buttonSize / 2)
    buttonBottom = buttonCenter + (buttonSize / 2)
  }
  
  // Button is visible if it's fully within main's vertical bounds
  isMainVisible.value = buttonTop >= mainRect.top && buttonBottom <= mainRect.bottom
}

let scrollHandler: (() => void) | null = null

// PDF download URL
const pdfDownloadUrl = computed(() => {
  if (!currentSlug.value) return '#'
  return buildPdfUrl(currentSlug.value)
})

// Convert bodyContent to array (handles both array and object formats from API)
const bodyContentArray = computed(() => {
  if (!bodyContent.value) return []
  return Array.isArray(bodyContent.value)
    ? bodyContent.value
    : Object.values(bodyContent.value)
})

const parsedTags = computed(() => {
  if (!tags.value || !Array.isArray(tags.value)) return []
  return tags.value
})

onMounted(() => {
  // Set up scroll listener for button visibility
  scrollHandler = () => checkButtonVisibility()
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('resize', scrollHandler, { passive: true })
  checkButtonVisibility() // Initial check
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
    window.removeEventListener('resize', scrollHandler)
  }
})
</script>

<style lang="scss" scoped>
*{
    box-sizing: border-box;
}

.v-report-page {
  min-height: 100vh;
}

.v-report-page__main-layout {
  display: grid;
  grid-template-columns: 1fr 5fr;
  gap: 2.33333333333rem;
  margin: 0 auto;
  background: var(--app-color-grey);
  padding: 2.22222222222rem var(--app-base-padding-x) 2.22222222222rem 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding-top: 4.22222222222rem;
    padding-left: var(--app-base-padding-x);
  }
}

.v-report-page__right {
  min-width: 0;
  @media (max-width: 1024px) {
    display: flex;
  }
}

.v-report-page__tabs {
  display: flex;
  max-width: calc(100% - 1.66666666667rem);
  @media (max-width: 1024px) {
    flex-direction: column;
    flex-shrink: 0;
    height: fit-content;
    border-radius: 1.11111111111rem 0 0 1.11111111111rem;
    overflow: hidden;
  }
}

.v-report-page__tab {
  max-width: none;
  width: 13.2222222222rem;
  height: 3.77777777778rem;
  border: none;
  background: var(--app-color-sage-dark);
  font-size: 1.11111111111rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 1.66666666667rem 1.66666666667rem 0 0;
  transition: background-color 0.2s ease;
  color: var(--app-color-black);
  position: relative;
  margin: 0;
  padding: 0;

  &:not(.v-report-page__tab--main):hover{
    background: var(--app-color-sage);
  }

  &--active {
    background: var(--app-color-sage);
  }

  &--main {
    background: var(--app-color-white);
  }

  @media (max-width: 1024px) {
    font-size: 0.88888888888rem;;
    border-radius: 0 1.11111111111rem 1.11111111111rem 0;
    width: 2.22222222222rem;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    text-orientation: mixed;
    height: calc(9rem + 1.11111111111rem);
    margin-top: -1.11111111111rem;
    padding-bottom: 1.11111111111rem;
    filter: drop-shadow(0 -4px 4px rgba(0, 0, 0, 0.15));
    &:first-child {
      height: 9rem;
      margin-top: 0;
      padding-bottom: 0;
    }
    &:nth-child(1) { z-index: 4; }
    &:nth-child(2) { z-index: 3; }
    &:nth-child(3) { z-index: 2; }
    &:nth-child(4) { z-index: 1; }
    &--active {
      z-index: 5!important;
    }
  }
}

.v-report-page__content {
  padding: 0;
  border-radius: 0 1.66666666667rem 1.66666666667rem 1.66666666667rem;
  overflow: hidden;
  @media (max-width: 1024px) {
    border-radius: 0 1.11111111111rem 1.11111111111rem 1.11111111111rem;
  }
}

.v-report-page__download {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  background-color: var(--app-color-yellow);
  color: var(--app-color-black);
  width: 4.72222222222rem;
  height: 4.72222222222rem;
  border-radius: 100%;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.2);
  position: fixed;
  right: 2rem;
  top: 50%;
  z-index: 11;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  svg {
    display: block;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateY(4px);
  }

  &--hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    width: 3rem;
    height: 3rem;
    bottom: 0.5rem;
    top: auto;
    right: 0.5rem;
    svg {
      width: 2rem;
      height: 2rem;
    }
  }
}
</style>

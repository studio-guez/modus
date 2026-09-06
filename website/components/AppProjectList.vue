<template>
  <div class="v-project-list">
    <app-page :header-cover="headerCover" :header-text="headerText" :header-type="'list'">
      <div class="v-project-list__content app-show-background-on-nav">
        <div class="v-project-list__description" v-if="preview">
          {{ preview }}
        </div>

        <!-- Tag filters (from backend availableTags) or tag links - hidden on mobile -->
        <div class="v-project-list__tags" v-if="visibleTags.length > 0">
          <template v-if="tagsAsLinks">
            <NuxtLink v-for="tag of visibleTags" :key="tag.slug" :to="`/tag/${tag.slug}`"
              class="v-project-list__filter v-project-list__filter--link">
              {{ tag.name }}
            </NuxtLink>
          </template>
          <template v-else>
            <button type="button" class="v-project-list__filter" v-for="tag of visibleTags" :key="tag.slug"
              :class="{ 'v-project-list__filter--active': isTagSelected(tag.slug) }"
              :aria-pressed="isTagSelected(tag.slug)" @click="toggleTagFilter(tag.slug)">
              {{ tag.name }}
              <svg v-if="isTagSelected(tag.slug)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                stroke="currentColor" stroke-width="2" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </template>
        </div>

        <!-- Mobile filter button -->
        <div class="v-project-list__mobile-filter-trigger" v-if="hasMobileFilters">
          <button type="button" class="v-project-list__mobile-filter-btn app-button app-button--small" @click="openMobileFilter">
            <span>Filtrer<span v-if="activeFiltersCount > 0"> ({{ activeFiltersCount }})</span></span>
          </button>
        </div>

        <!-- Mobile filter modal -->
        <Teleport to="body">
          <Transition name="filter-modal">
            <div class="v-project-list__modal-overlay" v-if="isMobileFilterOpen" @click.self="closeMobileFilter">
              <div class="v-project-list__modal">
                <div class="v-project-list__modal-header">
                  <span class="v-project-list__modal-title">Filtrer</span>
                  <button type="button" class="v-project-list__modal-close" @click="closeMobileFilter" aria-label="Fermer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                  </button>
                </div>
                <div class="v-project-list__modal-body">
                  <!-- Tag filters (non-link) inside modal -->
                  <div class="v-project-list__modal-section" v-if="visibleTags.length > 0 && !tagsAsLinks">
                    <div class="v-project-list__modal-filters">
                      <button type="button" class="v-project-list__filter" v-for="tag of visibleTags" :key="tag.slug"
                        :class="{ 'v-project-list__filter--active': isTagSelected(tag.slug) }"
                        :aria-pressed="isTagSelected(tag.slug)" @click="toggleTagFilter(tag.slug)">
                        {{ tag.name }}
                        <svg v-if="isTagSelected(tag.slug)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                          stroke="currentColor" stroke-width="2" viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M4 4l8 8M12 4l-8 8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <!-- Dynamic filter groups inside modal -->
                  <template v-for="group in filterGroups" :key="group.id">
                    <div class="v-project-list__modal-section" v-if="getVisibleOptions(group).length > 0">
                      <div class="v-project-list__modal-filters">
                        <button type="button" class="v-project-list__filter" :class="[
                          `v-project-list__filter--${group.id}`,
                          { 'v-project-list__filter--active': isFilterSelected(group.id, option.key) }
                        ]" v-for="option in getVisibleOptions(group)" :key="option.key" :style="{
                          '--filter-bg': option.bgColor || 'transparent',
                          '--filter-text': option.textColor || 'var(--app-color-grey-text)',
                          '--filter-border': option.borderColor || 'var(--app-color-grey-text)',
                        }" :aria-pressed="isFilterSelected(group.id, option.key)" @click="toggleFilter(group, option.key)">
                          {{ option.label }}
                          <svg v-if="isFilterSelected(group.id, option.key)" xmlns="http://www.w3.org/2000/svg" width="16"
                            height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M4 4l8 8M12 4l-8 8" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </template>
                </div>
                <div class="v-project-list__modal-footer">
                  <button type="button" class="v-project-list__modal-clear" v-if="hasActiveFilters" @click="clearTagFilter">
                    Effacer tous les filtres
                  </button>
                  <button type="button" class="v-project-list__modal-apply app-button app-button--small" @click="closeMobileFilter">
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

        <div class="v-project-list__filters-row" v-if="filterGroups.length > 0 || visibleTags.length > 0">
          <div class="v-project-list__filters">
            <!-- Dynamic filter groups -->
            <template v-for="group in filterGroups" :key="group.id">
              <button type="button" class="v-project-list__filter" :class="[
                `v-project-list__filter--${group.id}`,
                { 'v-project-list__filter--active': isFilterSelected(group.id, option.key) }
              ]" v-for="option in getVisibleOptions(group)" :key="option.key" :style="{
                '--filter-bg': option.bgColor || 'transparent',
                '--filter-text': option.textColor || 'var(--app-color-grey-text)',
                '--filter-border': option.borderColor || 'var(--app-color-grey-text)',
              }" :aria-pressed="isFilterSelected(group.id, option.key)" @click="toggleFilter(group, option.key)">
                {{ option.label }}

                <svg v-if="isFilterSelected(group.id, option.key)" xmlns="http://www.w3.org/2000/svg" width="16"
                  height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </template>
          </div>
          <button type="button" class="v-project-list__filter v-project-list__filter--clear" v-if="hasActiveFilters"
            @click="clearTagFilter">
            Effacer tous les filtres
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor"
              stroke-width="2" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
        <template v-if="itemsToShow.length > 0">
          <div class="v-project-list__content__grid">
            <TransitionGroup name="list-fade">
              <app-item-card v-for="item of itemsToShow" :key="item.slug"
                v-bind="mapItemToCardProps(item, pageType, backendBaseUrl)" @play-video="handlePlayVideo"
                @play-podcast="handlePlayPodcast" @pdf-download="handlePdfDownload" />
            </TransitionGroup>
          </div>
        </template>
        <template v-else>
          <div class="v-project-list__empty">
            {{ emptyMessage }}
          </div>
        </template>
      </div>
    </app-page>
    <app-page-footer />
  </div>
</template>


<script setup lang="ts">
import { ComputedRef, Ref, UnwrapRef } from 'vue'
import AppPage from "~/components/AppPage.vue";
import { IApiSingleProject, IApiTag } from "~/composable/adminApi/apiDefinitions";
import { ApiFetchProjects } from "~/composable/adminApi/apiFetch";
import AppItemCard from "~/components/AppItemCard.vue";
import { mapItemToCardProps } from '~/utils/mapItemToCardProps';

export type PageType = 'media' | 'report' | 'tool' | 'project'

export interface FilterOption {
  key: string
  label: string
  bgColor?: string
  textColor?: string
  borderColor?: string
}

export interface FilterGroup {
  id: string
  type: 'single' | 'multi'
  queryParam: string
  options: FilterOption[]
  filterFn: (item: IApiSingleProject, selectedKeys: string[]) => boolean
}

const props = withDefaults(defineProps<{
  apiEndpoint: string
  filterMap?: Record<string, string>
  filterDescription?: string
  emptyMessage: string
  pageType?: PageType
  filterGroups?: FilterGroup[]
  tagsAsLinks?: boolean
}>(), {
  filterMap: () => ({}),
  filterDescription: '',
  filterGroups: () => [],
  tagsAsLinks: false,
})

const emit = defineEmits<{
  (e: 'play-video', mediaUrl: string, title: string): void
  (e: 'play-podcast', mediaUrl: string, title: string): void
  (e: 'pdf-download', pdfUrl: string): void
}>()

// Mobile filter modal state
const isMobileFilterOpen = ref(false)

// Whether the mobile filter button should show (has non-link tag filters or filter groups)
const hasMobileFilters = computed(() => {
  const hasTagFilters = !props.tagsAsLinks && visibleTags.value.length > 0
  const hasGroupFilters = props.filterGroups.length > 0
  return hasTagFilters || hasGroupFilters
})

function openMobileFilter() {
  isMobileFilterOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeMobileFilter() {
  isMobileFilterOpen.value = false
  document.body.style.overflow = ''
}

onUnmounted(() => {
  document.body.style.overflow = ''
})

const runtimeConfig = useRuntimeConfig()
const backendBaseUrl = runtimeConfig.public.backendBaseUrl as string

const route = useRoute()
const router = useRouter()

const headerCover: Ref<UnwrapRef<undefined | string>> = ref(undefined)
const headerText: Ref<UnwrapRef<undefined | string>> = ref(undefined)
const preview: Ref<UnwrapRef<undefined | string>> = ref(undefined)
const items: Ref<UnwrapRef<undefined | IApiSingleProject[]>> = ref(undefined)
const availableTags: Ref<UnwrapRef<IApiTag[]>> = ref([])

// Query params: tags for tag filter (comma-separated for multiple)
const selectedTags: Ref<UnwrapRef<string[]>> = ref(parseTagsFromQuery(route.query.tags))

// Dynamic filter state: maps filterGroup.id -> selected keys
const filterSelections: Ref<Record<string, string[]>> = ref({})

// Initialize filter selections from query params
function initFilterSelectionsFromQuery() {
  const selections: Record<string, string[]> = {}
  for (const group of props.filterGroups) {
    const queryValue = route.query[group.queryParam]
    if (group.type === 'single') {
      selections[group.id] = queryValue ? [queryValue as string] : []
    } else {
      selections[group.id] = parseTagsFromQuery(queryValue as string | undefined)
    }
  }
  filterSelections.value = selections
}

// Check if filter option is selected
function isFilterSelected(groupId: string, key: string): boolean {
  return filterSelections.value[groupId]?.includes(key) ?? false
}

// Toggle filter selection
function toggleFilter(group: FilterGroup, key: string) {
  const current = filterSelections.value[group.id] || []
  let newSelection: string[]

  if (group.type === 'single') {
    // Single select: toggle on/off
    newSelection = current.includes(key) ? [] : [key]
  } else {
    // Multi select: add/remove from array
    const index = current.indexOf(key)
    if (index === -1) {
      newSelection = [...current, key]
    } else {
      newSelection = current.filter((k: string) => k !== key)
    }
  }

  filterSelections.value = {
    ...filterSelections.value,
    [group.id]: newSelection
  }
  updateQueryParams()
}

function parseTagsFromQuery(queryValue: string | (string | null)[] | undefined): string[] {
  if (!queryValue) return []
  if (Array.isArray(queryValue)) {
    return queryValue.filter((v): v is string => typeof v === 'string')
  }
  return queryValue.split(',').filter(Boolean)
}

// Check if a tag is selected
function isTagSelected(slug: string): boolean {
  return selectedTags.value.includes(slug)
}

// Items to show (filtered or all)
const itemsToShow: ComputedRef<UnwrapRef<IApiSingleProject[]>> = computed(() => {
  if (!items.value) return []
  const hasTagFilters = selectedTags.value.length > 0
  const hasGroupFilters = props.filterGroups.some((g: FilterGroup) => (filterSelections.value[g.id]?.length ?? 0) > 0)
  if (!hasTagFilters && !hasGroupFilters) return items.value
  return filteredItems(items.value)
})

function filteredItems(items: IApiSingleProject[]): IApiSingleProject[] {
  return simulateFiltering(
    items,
    selectedTags.value,
    filterSelections.value
  )
}

// Helper to check if items would exist with given filter state
function simulateFiltering(
  itemList: IApiSingleProject[],
  tagSlugs: string[],
  groupSelections: Record<string, string[]>
): IApiSingleProject[] {
  return Object.values(itemList).filter(item => {
    // Tag filter (OR logic - item matches if it has ANY of the selected tags)
    if (tagSlugs.length > 0) {
      const tags = item.content.tags
      if (!tags || !Array.isArray(tags)) return false
      const hasAnyTag = tags.some(t => tagSlugs.includes(t.slug))
      if (!hasAnyTag) return false
    }

    // Apply each filter group's filterFn
    for (const group of props.filterGroups) {
      const selected = groupSelections[group.id] || []
      if (selected.length > 0) {
        if (!group.filterFn(item, selected)) return false
      }
    }

    return true
  })
}

// Computed: tags that would have results if selected (given current other filters)
// When tagsAsLinks is true, show all available tags as navigation links
const visibleTags = computed(() => {
  if (!items.value) return []

  // In link mode, show all available tags (they're links to other tag pages)
  if (props.tagsAsLinks) {
    return availableTags.value
  }

  return availableTags.value.filter((tag: IApiTag) => {
    // If already selected, always show it
    if (isTagSelected(tag.slug)) return true
    // Check if selecting this tag would have results
    const newTagSelection = [...selectedTags.value, tag.slug]
    const results = simulateFiltering(
      items.value!,
      newTagSelection,
      filterSelections.value
    )
    return results.length > 0
  })
})

// Get visible filter options for a group (options that would have results)
function getVisibleOptions(group: FilterGroup): FilterOption[] {
  if (!items.value) return []
  return group.options.filter(option => {
    // If already selected, always show it
    if (isFilterSelected(group.id, option.key)) return true
    // Simulate selecting this option
    const newSelections = { ...filterSelections.value }
    if (group.type === 'single') {
      newSelections[group.id] = [option.key]
    } else {
      newSelections[group.id] = [...(filterSelections.value[group.id] || []), option.key]
    }
    const results = simulateFiltering(
      items.value!,
      selectedTags.value,
      newSelections
    )
    return results.length > 0
  })
}

onMounted(async () => {
  const pageData = await ApiFetchProjects(props.apiEndpoint)

  headerCover.value = pageData.options.headerImage?.resize.tiny
  headerText.value = pageData.options.headerTitle
  preview.value = pageData.options.preview
  items.value = Object.values(pageData.children)

  // Get available tags from backend
  if (pageData.options.availableTags) {
    availableTags.value = pageData.options.availableTags
  }

  lazyLoadHeadImage(pageData.options.headerImage?.url || '')
})

function lazyLoadHeadImage(largeImageUrl: string) {
  const imageToLoad = new Image()
  imageToLoad.src = largeImageUrl
  imageToLoad.addEventListener('load', () => headerCover.value = largeImageUrl)
}

// Filter actions
function toggleTagFilter(slug: string) {
  const index = selectedTags.value.indexOf(slug)
  if (index === -1) {
    selectedTags.value = [...selectedTags.value, slug]
  } else {
    selectedTags.value = selectedTags.value.filter((t: string) => t !== slug)
  }
  updateQueryParams()
}

function clearTagFilter() {
  selectedTags.value = []
  // Clear all filter group selections
  const cleared: Record<string, string[]> = {}
  for (const group of props.filterGroups) {
    cleared[group.id] = []
  }
  filterSelections.value = cleared
  updateQueryParams()
}

function updateQueryParams() {
  const query: Record<string, string> = {}
  if (selectedTags.value.length > 0) query.tags = selectedTags.value.join(',')

  // Add filter group query params
  for (const group of props.filterGroups) {
    const selected = filterSelections.value[group.id] || []
    if (selected.length > 0) {
      query[group.queryParam] = selected.join(',')
    }
  }
  router.push({ query })
}

const activeFiltersCount = computed(() => {
  let count = selectedTags.value.length
  for (const g of props.filterGroups) {
    count += filterSelections.value[g.id]?.length ?? 0
  }
  return count
})

const hasActiveFilters = computed(() => activeFiltersCount.value > 0)

// Watch for query param changes
watch(() => route.query, (newQuery: Record<string, string | (string | null)[] | null | undefined>) => {
  selectedTags.value = parseTagsFromQuery(newQuery.tags as string | undefined)
  initFilterSelectionsFromQuery()
}, { immediate: true })

// Initialize filter selections on mount
onMounted(() => {
  initFilterSelectionsFromQuery()
})

function handlePlayVideo(mediaUrl: string, title: string) {
  emit('play-video', mediaUrl, title)
}

function handlePlayPodcast(mediaUrl: string, title: string) {
  emit('play-podcast', mediaUrl, title)
}

function handlePdfDownload(pdfUrl: string) {
  emit('pdf-download', pdfUrl)
}
</script>


<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.v-project-list__content {
  padding-top: 2.55555555556rem;
  color: var(--app-color-black);
}

.v-project-list__description {
  padding: 0 var(--app-base-padding-x) 2.55555555556rem var(--app-base-padding-x);
  max-width: 85ch;
  text-align: center;
  text-wrap: balance;
  font-size: 1.33333333333rem;
  margin: 0 auto 0 auto;
}

.v-project-list__tags {
  padding: 1.33333333333rem var(--app-base-padding-x);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }
}

.v-project-list__mobile-filter-trigger {
  display: none;
  padding: 0.5rem var(--app-base-padding-x);
  font-variant-ligatures: no-contextual;
  position: sticky;
  top: var(--app-nav__height, 0px);
  z-index: 50;
  background-color: var(--app-color-white);

  @media (max-width: 768px) {
    display: block;
  }
}

.v-project-list__mobile-filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  background-color: var(--app-color-main--dark);
  color: var(--app-color-white);
  border-color: var(--app-color-main--dark);

  &:hover {
    background-color: var(--app-color-main--dark);
    color: var(--app-color-white);
    filter: brightness(0.9);
  }

  svg {
    width: 1em;
    height: 1em;
  }
}

// Mobile filter modal
.v-project-list__modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
}

.v-project-list__modal {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  background-color: var(--app-color-white);
  overflow: hidden;
}

.v-project-list__modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background-color: var(--app-color-main--dark);
  color: var(--app-color-white);
  flex-shrink: 0;
}

.v-project-list__modal-title {
  font-size: 1.11111111111rem;
  font-weight: 600;
}

.v-project-list__modal-close {
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-color-white);
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
}

.v-project-list__modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.v-project-list__modal-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.v-project-list__modal-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.v-project-list__modal-footer {
  flex-shrink: 0;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 1px solid #e5e5e5;
  background-color: var(--app-color-white);
}

.v-project-list__modal-apply {
  width: 100%;
  text-align: center;
  justify-content: center;
  background-color: var(--app-color-main--dark);
  color: var(--app-color-white);
  border-color: var(--app-color-main--dark);
  font-weight: 600;
  padding: 0.75rem 1rem;

  &:hover {
    background-color: var(--app-color-main--dark);
    color: var(--app-color-white);
    filter: brightness(0.9);
  }
}

.v-project-list__modal-clear {
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  font-size: 0.88888888888rem;
  color: var(--app-color-grey-text);
  text-decoration: underline;
}

// Modal transition
.filter-modal-enter-active {
  transition: opacity 0.25s ease;
  .v-project-list__modal {
    transition: transform 0.25s ease;
  }
}
.filter-modal-leave-active {
  transition: opacity 0.2s ease;
  .v-project-list__modal {
    transition: transform 0.2s ease;
  }
}
.filter-modal-enter-from {
  opacity: 0;
  .v-project-list__modal {
    transform: translateY(100%);
  }
}
.filter-modal-leave-to {
  opacity: 0;
  .v-project-list__modal {
    transform: translateY(100%);
  }
}

.v-project-list__filters-row {
  padding: 1.33333333333rem var(--app-base-padding-x);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 4.94444444444rem;

  @media (max-width: 768px) {
    display: none;
  }
}

.v-project-list__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.v-project-list__filter {
  all: revert;
  --filter-bg: transparent;
  --filter-text: var(--app-color-grey-text);
  --filter-border: var(--app-color-grey-text);
  box-sizing: border-box;
  appearance: none;
  font-family: inherit;
  font-weight: inherit;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: .58333333333rem .83333333333rem;
  line-height: 1;
  font-size: .88888888888rem;
  border-radius: 2rem;
  color: var(--filter-text);
  border: 2px solid var(--filter-border);
  background-color: var(--filter-bg);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, filter 0.2s ease;

  &:hover {
    background-color: var(--app-color-orange-bright);
    color: var(--app-color-black);
    border-color: var(--app-color-orange-bright);
  }

  &:focus-visible {
    outline: 2px solid var(--app-color-orange-bright);
    outline-offset: 2px;
  }

  svg {
    width: 1em;
    height: 1em;
  }

  &.v-project-list__filter--active {
    background-color: var(--app-color-orange-bright);
    color: var(--app-color-black);
    border-color: var(--app-color-orange-bright);

    &:hover {
      filter: brightness(0.9);
    }
  }

  &.v-project-list__filter--clear {
    background-color: transparent;
    background-color: var(--app-color-black);
    color: var(--app-color-white);
    border-color: var(--app-color-black);

    &:hover {
      filter: brightness(0.9);
    }
  }

  &.v-project-list__filter--link {
    text-decoration: none;

    &:hover,
    &.router-link-exact-active {
      background-color: var(--app-color-orange-bright);
      color: var(--app-color-black);
      border-color: var(--app-color-orange-bright);
    }
  }
}

.v-project-list__content {
  position: relative;
  width: 100%;
}

.v-project-list__content__grid {
  --grid-gap: 1.11111111111rem;
  --item-per-row: 1;

  padding: 0 var(--app-base-padding-x) 4.55555555556rem var(--app-base-padding-x);
  display: grid;
  grid-template-columns: repeat(var(--item-per-row), 1fr);
  width: 100%;
  gap: var(--grid-gap);

  @media (min-width: 741px) {
    --item-per-row: 2;
    /* 2 columns */
  }

  @media (min-width: 1381px) {
    --item-per-row: 3;
    /* 3 columns */
  }

  @media (min-width: 1921px) {
    grid-template-columns: repeat(auto-fit,minmax(26rem,1fr));
  }

}

.v-project-list__empty {
  padding: 1rem var(--app-base-padding-x);
  text-align: center;
}

/* Simple fade transition for list items */
.list-fade-enter-active {
  transition: opacity 0.5s ease-in-out;
}

.list-fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
}
</style>

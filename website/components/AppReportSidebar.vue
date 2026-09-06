<template>
  <aside class="v-report-sidebar" :class="{ 'v-report-sidebar--open': isOpen }">
    <h2 class="v-report-sidebar__title">Sommaire</h2>
    <button 
      class="v-report-sidebar__toggle app-button app-button--small"
      :class="{ 'v-report-sidebar__toggle--open': isOpen }"
      @click="isOpen = !isOpen"
    >
      <span>Sommaire</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        fill="currentColor" 
        viewBox="0 0 16 16"
        class="v-report-sidebar__toggle-icon"
        :class="{ 'v-report-sidebar__toggle-icon--open': isOpen }"
      >
        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" stroke="currentColor" stroke-width="0.5"/>
      </svg>
    </button>
    
    <nav class="v-report-sidebar__nav" v-show="isOpen || !isMobile">
      <ul class="v-report-sidebar__list">
        <li 
          v-for="(heading, index) in headings" 
          :key="index"
          class="v-report-sidebar__item"
        >
          <a 
            :href="`#${heading.id}`"
            class="v-report-sidebar__link"
            :class="{ 'v-report-sidebar__link--active': activeId === heading.id }"
            @click="handleClick(heading.id, $event)"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface HeadingItem {
  id: string
  text: string
}

const props = defineProps<{
  bodyContent: any[]
}>()

const isOpen = ref(false)
const isMobile = ref(false)
const activeId = ref<string | null>(null)

// Extract h2 headings from body content
const headings = computed<HeadingItem[]>(() => {
  if (!props.bodyContent) return []
  
  const result: HeadingItem[] = []
  
  // Handle both array and object formats for bodyContent
  const items = Array.isArray(props.bodyContent) 
    ? props.bodyContent 
    : Object.values(props.bodyContent)
  
  for (const item of items) {
    // Handle mdheading blocks with h2 level
    if (item.content?.type === 'mdheading' && item.content?.content?.level === 'h2') {
      const text = item.content.content.text?.replace(/<[^>]*>/g, '') || ''
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
      if (text) {
        result.push({ id, text })
      }
    }
    
    // Handle reportbody blocks that may contain h2 elements
    if (item.content?.type === 'reportbody' && item.content?.content?.text) {
      const htmlText = item.content.content.text
      const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi
      let match
      while ((match = h2Regex.exec(htmlText)) !== null) {
        const text = match[1].replace(/<[^>]*>/g, '')
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
        if (text) {
          result.push({ id, text })
        }
      }
    }
  }
  
  return result
})

function handleClick(id: string, event: Event) {
  event.preventDefault()
  activeId.value = id
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
  if (isMobile.value) {
    isOpen.value = false
  }
}

function checkMobile() {
  isMobile.value = window.innerWidth <=  1024
}

function handleScroll() {
  if (!headings.value.length) return
  
  const scrollPos = window.scrollY + 100
  
  for (let i = headings.value.length - 1; i >= 0; i--) {
    const el = document.getElementById(headings.value[i].id)
    if (el && el.offsetTop <= scrollPos) {
      activeId.value = headings.value[i].id
      return
    }
  }
  
  activeId.value = headings.value[0]?.id || null
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
.v-report-sidebar {
  position: sticky;
  top: calc(var(--app-nav__height) + 2.22222222222rem);
  align-self: start;
  min-width: 0;
  
  @media (max-width: 1024px) {
    position: fixed;
    top: calc(var(--app-nav__height) + 1rem);
    left: var(--app-base-padding-x);
    right: var(--app-base-padding-x);
    z-index: 100;
    margin-bottom: 1rem;
    box-shadow: 0 4px 11.1px 0 rgba(0, 0, 0, 0.15);
    border-radius: 1.11111111111rem;
    overflow: hidden;
  }
}

.v-report-sidebar__title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 13.2222222222rem;
  height: 3.77777777778rem;
  font-size: 1.11111111111rem;  font-weight: 600;
  color: var(--app-color-black);
  margin: 0;
  
  @media (max-width: 1024px) {
    display: none;
  }
}

.v-report-sidebar__toggle {
  display: none;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  height: 2.22222222222rem;
  border-radius: 0;
  
  @media (max-width: 1024px) {
    display: flex;
    background-color: var(--app-color-main--dark);
    color: var(--app-color-white);
  }
  @media (max-width: 1024px) {
    font-size: 0.88888888888rem;;
  }
}

.v-report-sidebar__toggle-icon {
  transition: transform 0.2s ease;
  
  &--open {
    transform: rotate(180deg);
  }
}

.v-report-sidebar__nav {
  @media (max-width: 1024px) {
    background-color: var(--app-color-white);
    padding: 1rem;
    font-weight: 500;
  }
}

.v-report-sidebar__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.v-report-sidebar__item {
  margin: 0;
  padding: 0;
  &::before {
    display: none;
  }
}

.v-report-sidebar__link {
  display: block;
  padding: 0.5rem 0;
  color: inherit;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.88888888888rem;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 1.11111111111rem;
  }
  
  &:hover {
    text-decoration: underline;
  }
  
  &--active {
    text-decoration: underline;
  }
}
</style>

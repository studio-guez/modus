<template>
  <section class="v-app-report-tab-citations">
    <div class="v-app-report-tab-citations__summary" v-if="summary">
      <div class="v-app-report-tab-citations__section-title">Résumé</div>
      <p class="v-app-report-tab-citations__summary-text">{{ summary }}</p>
    </div>
    
    <div class="v-app-report-tab-citations__meta" v-if="year">
      <div class="v-app-report-tab-citations__section-title">Année de publication</div>
      <p class="v-app-report-tab-citations__year">{{ year }}</p>
    </div>
    
    <div class="v-app-report-tab-citations__citations">
      <div class="v-app-report-tab-citations__section-title">Comment citer la page</div>
      <div class="v-app-report-tab-citations__styles">
        <div 
          v-for="style in citationStyles" 
          :key="style.key"
          class="v-app-report-tab-citations__style"
        >
          <div class="v-app-report-tab-citations__style-title">{{ style.label }}</div>
          <div class="v-app-report-tab-citations__style-row">
            <div class="v-app-report-tab-citations__style-text" v-html="style.content"></div>
            <button 
              class="v-app-report-tab-citations__copy-btn app-button app-button--small"
              :class="{ 'is-copied': copiedStyle === style.key }"
              @click="copyToClipboard(style.key, style.citation, style.content)"
            >
              <svg v-if="copiedStyle !== style.key" xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                <g clip-path="url(#clip0_2140_1505)">
                  <path d="M20.4455 0H7.66667C6.256 0 5.11213 1.14693 5.11213 2.55453V5.10907H2.55453C1.14693 5.10907 0 6.256 0 7.66667V20.4455C0 21.8561 1.14693 23 2.55453 23H15.3333C16.744 23 17.8879 21.8531 17.8879 20.4455V17.8909H20.4424C21.8531 17.8909 22.9969 16.744 22.9969 15.3364V2.55453C22.9969 1.14693 21.8531 0 20.4424 0H20.4455ZM16.6121 20.4455C16.6121 21.1508 16.0387 21.7243 15.3333 21.7243H2.55453C1.8492 21.7243 1.27573 21.1508 1.27573 20.4455V7.66667C1.27573 6.96133 1.8492 6.38787 2.55453 6.38787H15.3333C16.0387 6.38787 16.6121 6.96133 16.6121 7.66667V20.4455ZM21.7212 15.3333C21.7212 16.0387 21.1477 16.6121 20.4424 16.6121H17.8879V7.66667C17.8879 6.256 16.7409 5.11213 15.3333 5.11213H6.38787V2.55453C6.38787 1.8492 6.96133 1.27573 7.66667 1.27573H20.4455C21.1508 1.27573 21.7243 1.8492 21.7243 2.55453V15.3333H21.7212Z" fill="black"/>
                </g>
                <defs>
                  <clipPath id="clip0_2140_1505">
                    <rect width="23" height="23" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { generateCitationStyles, type CitationStyleItem } from '~/utils/formatCitations'

const props = defineProps<{
  title: string
  slug: string
  summary?: string
  dateStart?: string
  url?: string
}>()

const copiedStyle = ref<string | null>(null)

const year = computed(() => {
  if (!props.dateStart) return null
  const date = new Date(props.dateStart)
  return isNaN(date.getTime()) ? null : date.getFullYear()
})

const currentUrl = computed(() => {
  if (props.url) return props.url
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return ''
})

const accessDate = computed(() => {
  const now = new Date()
  return now.toISOString()
})

const citationStyles = computed<CitationStyleItem[]>(() => {
  return generateCitationStyles({
    title: props.title || 'Untitled Report',
    slug: props.slug,
    dateStr: props.dateStart || new Date().toISOString(),
    url: currentUrl.value,
    accessedDate: accessDate.value
  })
})

async function copyToClipboard(styleKey: string, plainText: string, html: string) {
  try {
    // Write both plain text and HTML to clipboard
    // Word and rich text editors will use HTML, plain text editors will use text
    const clipboardItem = new ClipboardItem({
      'text/plain': new Blob([plainText], { type: 'text/plain' }),
      'text/html': new Blob([html], { type: 'text/html' })
    })
    await navigator.clipboard.write([clipboardItem])
    copiedStyle.value = styleKey
    setTimeout(() => {
      copiedStyle.value = null
    }, 2000)
  } catch (err) {
    // Fallback to plain text if ClipboardItem not supported
    try {
      await navigator.clipboard.writeText(plainText)
      copiedStyle.value = styleKey
      setTimeout(() => {
        copiedStyle.value = null
      }, 2000)
    } catch (fallbackErr) {
      console.error('Failed to copy:', fallbackErr)
    }
  }
}
</script>

<style lang="scss" scoped>
.v-app-report-tab-citations {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: var(--app-color-sage);
  padding: var(--app-report-tab-padding-y) var(--app-report-tab-padding-x);
  min-height: var(--app-report-tab-min-height);
  font-size: 0.88888888888rem;
  color: var(--app-color-black);
  line-height: 1.25;
}

.v-app-report-tab-citations__section-title {
  font-weight: 700;
}

.v-app-report-tab-citations__summary-text, .v-app-report-tab-citations__year {
  font-size: 0.88888888888rem;
  font-weight: 500;
  margin: 0;
}

.v-app-report-tab-citations__styles {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.v-app-report-tab-citations__style-title {
  font-size: 0.88888888888rem;
  font-weight: 700;
  color: var(--app-color-main);
  margin-bottom: 0.25rem;
}

.v-app-report-tab-citations__style-row{
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 0.61111111111rem;
  max-width: 100%;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
}

.v-app-report-tab-citations__copy-btn {
  all: unset;
  display: flex;
  cursor: pointer;
  flex-shrink: 0;
  &:hover {
    background-color: transparent;
  }
  &.is-copied {
    color: var(--app-color-main);
  }
}

.v-app-report-tab-citations__style-text {
  box-sizing: border-box;
  display: block;
  align-items: center;
  padding: .58333333333rem .83333333333rem;
  font-size: .88888888888rem;
  border-radius: .83333333333rem;
  color: var(--app-color-black);
  border: none;
  background-color: #F2F3F2;
  font-weight: 500;
  white-space: pre-line;
  max-width: 100%;

  :deep(a) {
    color: var(--app-color-main);
    text-decoration: underline;
  }

  :deep(pre) {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>

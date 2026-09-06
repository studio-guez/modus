<template>
  <figure 
    class="v-report-image" 
    :class="[`v-report-image--${size}`, alignment ? `v-report-image--align-${alignment}` : '']"
    :id="figureNumber ? `figure-${figureNumber}` : undefined"
  >
    <img 
      class="v-report-image__img"
      :src="imageSrc"
      :alt="alt || 'Image du rapport'"
      loading="lazy"
    />
    <figcaption 
      v-if="caption || figureNumber" 
      class="v-report-image__caption"
    >
      <span v-if="figureNumber" class="v-report-image__figure-label">Figure {{ figureNumber }}{{ caption ? ' — ' : '' }}</span><span v-if="caption" v-html="caption" />
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ReportImageData {
  resize?: {
    tiny?: string
    small?: string
    reg?: string
    large?: string
    xxl?: string
  }
  mediaUrl?: string
  alt?: string
  caption?: string
}

const props = defineProps<{
  image?: ReportImageData
  size?: 'full' | 'large' | 'medium' | 'small'
  alt?: string
  caption?: string
  alignment?: 'left' | 'center' | 'right'
  figureNumber?: number | null
}>()

const imageSrc = computed(() => {
  if (!props.image) return ''
  
  // Choose appropriate resize based on size prop
  if (props.image.resize) {
    if (props.size === 'full' || props.size === 'large') {
      return props.image.resize.large || props.image.resize.xxl || props.image.mediaUrl
    } else if (props.size === 'medium') {
      return props.image.resize.reg || props.image.resize.large || props.image.mediaUrl
    } else if (props.size === 'small') {
      return props.image.resize.reg || props.image.resize.small || props.image.mediaUrl
    }
    return props.image.resize.large || props.image.mediaUrl
  }
  
  return props.image.mediaUrl || ''
})
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}

.v-report-image {
  margin: 0 0 1rem 0;
  gap: 0.5rem;
  padding: 0 var(--app-report-tab-padding-x);
  width: 100%;
}

.v-report-image__img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.v-report-image--full {
  @media (min-width: 768px) {
    padding: 0;
  }
}

.v-report-image--medium {
  @media (min-width: 768px) {
    width: 44.4444444444rem;
    max-width: 100%;
  }
}

.v-report-image--small {
  @media (min-width: 768px) {
    width: 35.1111111111rem;
    max-width: 100%;
  }
}

.v-report-image--align-left {
  @media (min-width: 768px) {
    margin-left: 0;
    margin-right: auto;
  }
}

.v-report-image--align-center {
  @media (min-width: 768px) {
    margin-left: auto;
    margin-right: auto;
  }
}

.v-report-image--align-right {
  @media (min-width: 768px) {
    margin-left: auto;
    margin-right: 0;
  }
}

.v-report-image__caption {
  font-size: 0.66666666666rem;
  color: var(--app-color-main);
  line-height: 1.08333333333;
  margin-top: 0.55555555555rem;
  font-weight: 500;

  .v-report-image--full & {
  padding: 0 var(--app-report-tab-padding-x);
  }
}

.v-report-image__figure-label {
  font-weight: 700;
}
</style>

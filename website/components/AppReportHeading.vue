<template>
  <component :is="level" 
    class="v-report-heading" 
    :class="`v-report-heading--${level}`"
    :id="headingId"
    v-html="text"
  >
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  level: 'h2' | 'h3'
  text: string
}>()

const headingId = computed(() => {
  const plainText = props.text?.replace(/<[^>]*>/g, '') || ''
  return plainText.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
})
</script>

<style lang="scss" scoped>
.v-report-heading {
  scroll-margin-top: calc(var(--app-nav__height) + 1rem);
  padding: 0 var(--app-report-tab-padding-x);
}

.v-report-heading--h2 {
  font-size: 1.33333333333rem;
  font-weight: 700;
  color: var(--app-color-main--dark);
  margin-bottom: 0.5rem 0 1rem 0;
  line-height: 1.1;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
}

.v-report-heading--h3 {
  font-size: 0.88888888888rem;
  font-weight: 700;
  margin-bottom: 0 0 1rem 0;
  color: var(--app-color-black);
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 1.33333333333rem;
  }
}
</style>

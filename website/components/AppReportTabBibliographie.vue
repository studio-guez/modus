<template>
  <section class="v-report-tab-bibliographie">
      <div v-for="(item, index) in bibliography" :key="item.id || index" class="v-report-tab-bibliographie__item">
        <button class="v-report-tab-bibliographie__number" @click="emit('go-to-ref', item.index)">[{{ item.index }}]</button> <span v-html="item.text"></span>
      </div>
  </section>
</template>

<script setup lang="ts">
interface BibliographyItem {
  id?: string
  index?: number
  text?: string
}

defineProps<{
  bibliography: BibliographyItem[]
}>()

const emit = defineEmits<{
  'go-to-ref': [index: number | undefined]
}>()
</script>

<style lang="scss" scoped>
.v-report-tab-bibliographie{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--app-color-sage);
    padding: var(--app-report-tab-padding-y) var(--app-report-tab-padding-x);
    min-height: var(--app-report-tab-min-height);
    font-size: 0.88888888888rem;
    line-height: 1.25;
}

.v-report-tab-bibliographie__item {
  color: var(--app-color-black);
  font-weight: 500;
}

.v-report-tab-bibliographie__number {
  font-weight: 700;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  cursor: pointer;
  text-underline-offset: 2px;
  transition: color 0.2s ease;
  &:hover{
    color: var(--app-color-orange-bright);
  }
}

.v-report-tab-bibliographie__item :deep(a) {
  color: var(--app-color-main);
  word-break: break-all;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>

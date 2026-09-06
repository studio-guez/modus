<template>
  <div class="v-report-text" v-html="text" />
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.v-report-text {
  line-height: 1.5;
  color: var(--app-color-black);
  padding: 0 var(--app-report-tab-padding-x);
  font-size: 0.88888888888rem;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 1.33333333333rem;
  }

  :deep(p) {
    margin: 0 0 1rem 0;
    font-weight: 500;
    font-size: 0.88888888888rem;

    @media (min-width: 768px) {
      font-size: 1.33333333333rem;
    }
  }

  :deep(strong, b) {
    font-weight: 600;
  }

  :deep(em) {
    font-style: italic;
  }

  :deep(u) {
    text-decoration: underline;
  }

  :deep(a) {
    color: var(--app-color-main);
    text-decoration: underline;
    transition: color 0.2s ease;

    &:hover {
      color: var(--app-color-main--dark);
    }
  }

  :deep(mark) {
    background-color: transparent;
    padding: 0;
    color: var(--app-color-main);
  }

  :deep(mark.figure-ref) {
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--app-color-main--dark);
    }
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 1rem 0;
  }

  :deep(li) {
    margin: 0;
  }

  :deep(li p) {
    margin: 0;
  }
}
</style>

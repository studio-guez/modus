<template>
  <div class="v-navigate-tags">
    <div class="v-navigate-tags__tags">
      <nuxt-link
        v-for="tag of tags"
        :key="tag.slug"
        :to="`/tag/${tag.slug}`"
        class="v-navigate-tags__tag"
      >
        {{ tag.name }}
      </nuxt-link>
    </div>

    <div class="v-navigate-tags__action">
      <h4 v-if="title" class="v-navigate-tags__title">{{ title }}</h4>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IApiTag } from '~/composable/adminApi/apiDefinitions'
import { ApiFetchProjectTags } from '~/composable/adminApi/apiFetch'

const props = defineProps<{
  title?: string
}>()

const tags = ref<IApiTag[]>([])

onMounted(async () => {
  const data = await ApiFetchProjectTags()
  tags.value = data.tags
})
</script>


<style lang="scss" scoped>
.v-navigate-tags {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  border-radius: var(--app-radius-large);
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    border-radius: var(--app-radius-small);
  }
}

.v-navigate-tags__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-content: center;
  justify-content: center;
  padding: 5.55555555556rem 2.77777777778rem;
  background-color: var(--app-color-white);
  @media (max-width: 900px) {  
    padding: 1rem;
  }
}

.v-navigate-tags__tag {
  all: revert;
  box-sizing: border-box;
  text-decoration: none;
  font-family: inherit;
  font-weight: inherit;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: .58333333333rem .83333333333rem;
  line-height: 1;
  font-size: .88888888888rem;
  border-radius: 2rem;
  color: var(--app-color-grey-text);
  border: 2px solid var(--app-color-grey-text);
  background-color: transparent;
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
}

.v-navigate-tags__action {
  padding: 5.55555555556rem 2.77777777778rem;
  background-color: var(--app-color-grey--dark);
  color: var(--app-color-white);
  @media (max-width: 900px) {  
    padding: 1rem;
    text-align: center;
  }
}

.v-navigate-tags__title {
      color: var(--app-color-white);
      font-size: 3.55555555556rem;
      font-weight: 600;
      margin: 0;
      line-height: 1.14;
      margin-bottom: 1.38888888889rem;
      @media (max-width: 1280px) {
        font-size: 2.5rem;
      }
      @media (max-width: 900px) {
        font-weight: 900;
        font-size: 1.45rem;
        margin-top: 1em;
        line-height: 1.225;;
      }
}

.app-button{
    color: var(--app-color-black);
    background-color: var(--app-color-yellow);  
    border-color: var(--app-color-yellow);
    &:hover {
        background-color: var(--app-color-main--dark);
        border-color: var(--app-color-main--dark);
        color: var(--app-color-white);
    }
}
</style>

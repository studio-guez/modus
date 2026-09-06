<template>
    <div
        class="v-index"
    >
      <app-page
        :header-cover="headerCover"
        :header-text="headerText"
        :body-content="bodyContent"
      />
      <app-page-footer/>
    </div>
</template>


<script setup lang="ts">
import AppPage from "~/components/AppPage.vue";
import {ApiFetchPage} from "~/composable/adminApi/apiFetch";

useHead({
  title: 'modus',
  meta: [
    {
      name: 'description',
      content: 'modus. pour une mobilité durable à Genève',
    }
  ],
})

const {data: pageData} = await useAsyncData('page-home', () => ApiFetchPage('home'))

const headerCover = computed(() => pageData.value?.options.headerImage?.mediaUrl)
const headerText = computed(() => pageData.value?.options.headerTitle)
const bodyContent = computed(() => pageData.value?.body)

</script>





<style lang="scss" scoped >
.v-index {
}

.v-index__bottom_content {
    background: var(--app-color-grey);
    position: relative;
    z-index: 10;
    width: 100%;
    padding-bottom: 2rem;
}

.v-index__bottom_content__section {
    box-sizing: border-box;
    max-width: 1300px;
    margin: auto;
    padding: var(--app-gutter);

    @media (max-width: 1300px) {
        padding: 0;
    }
}

</style>

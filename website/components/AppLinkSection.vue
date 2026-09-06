<template>
  <section class="v-app-link-section" >

    <h3 style="text-align: left">{{title}}</h3>

    <div class="v-app-link-section__box">
      <a class="v-app-link-section__box__item"
         v-for="item of links"
         target="_blank" :href="item.url"
      >
        <div>{{item.name}}</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
          <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
        </svg>
      </a>
    </div>
  </section>

</template>





<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
    title: string,
    links: {
        name: "Instagram.com, Genève en selle",
        url: "https://www.instagram.com/geneve_en_selle/"
    }[]
}>()
</script>





<style lang="scss" scoped >
.v-app-link-section__box {
  display: flex;
  gap: 1rem;
  flex-direction: row;
  flex-wrap: wrap;
}

.v-app-link-section__box__item {
  display: flex;
  border: solid;
  border-radius: 2rem;
  padding: 1rem;
  color: var(--app-color-main--dark);
  text-decoration: none;
  justify-content: space-between;
  max-width: 25rem;

  &:hover {
    color: var(--app-color-main);
  }
}

svg {
  display: block;
  height: 1.5rem;
  width: auto;
  padding-left: 1rem;
}
</style>

<template>
    <section class="v-app-power-bi-sub-section"
    >
      <template v-if="subpageData">
        <template v-for="page in subpageData.power_bi_pages">
          <a class="v-app-power-bi-sub-section__item"
             :href="page.content.power_bi_pages_link"
          >

            <div class="v-app-power-bi-sub-section__item__header">
              <img class="v-app-power-bi-sub-section__item__header__icon"
                   v-if="page.image[0]"
                   :src="page.image[0].resize.reg"
                   alt="icon"
              />
              <div class="v-app-power-bi-sub-section__item__header__number"
              >{{ page.content.power_bi_pages_number }}</div>
            </div>

            <div class="v-app-power-bi-sub-section__item__body">
              <div class="v-app-power-bi-sub-section__item__body__title"
              >{{ page.content.power_bi_pages_title }}</div>
              <div class="v-app-power-bi-sub-section__item__body__description"
              >{{ page.content.power_bi_pages_description }}</div>
            </div>

          </a>
        </template>
      </template>
    </section>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'
import {IApiPage__subpage__power_bi_pages} from "~/composable/adminApi/apiDefinitions";

const props = defineProps<{
    url: string
}>()

const subpageData: Ref<null | IApiPage__subpage__power_bi_pages> = ref(null)

onMounted(async () => {
    subpageData.value = await ((await fetch(`${props.url}.json`)).json()) as IApiPage__subpage__power_bi_pages
})

</script>





<style lang="scss" scoped >
.v-app-power-bi-sub-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.v-app-power-bi-sub-section__item {
  display: block;
  text-decoration: none;
  background: white;
  border-radius: var(--app-radius-small);
  box-sizing: border-box;
  width: calc( (100% + 1rem) / 2 - 1rem );
  max-width: 35rem;

  &:nth-child(4n + 2) {
    .v-app-power-bi-sub-section__item__header {
      background: var(--app-color-yellow);
      color: var(--app-color-main--dark);
    }
  }

  &:nth-child(4n + 3) {
    .v-app-power-bi-sub-section__item__header {
      background: var(--app-color-main);
    }
  }

  &:nth-child(4n + 4) {
    .v-app-power-bi-sub-section__item__header {
      background: var(--app-color-green-light);
      color: var(--app-color-main);
    }
  }

  @media (max-width: 900px) {
    width: 100%;
  }
}

.v-app-power-bi-sub-section__item__header {
  background: var(--app-color-main--dark);
  border-top-left-radius: var(--app-radius-small);
  border-top-right-radius: var(--app-radius-small);
  color: white;
  position: relative;
  box-sizing: border-box;
  padding: 2rem 1rem 1rem;
}

.v-app-power-bi-sub-section__item__header__icon {
  display: block;
  position: absolute;
  top:    .5rem;
  right:  .5rem;
  height: 2rem;
}

.v-app-power-bi-sub-section__item__header__number {
  font-size: 3rem;
  line-height: 1.15em;
  font-weight: 600;
}

.v-app-power-bi-sub-section__item__body {
  padding: 3rem 1rem 1rem;
}

.v-app-power-bi-sub-section__item__body__description {
  font-weight: 500;
}

</style>

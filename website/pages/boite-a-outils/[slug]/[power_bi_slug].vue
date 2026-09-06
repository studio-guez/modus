<template>
    <section class="v-proto"
    >
      <div class="v-proto__embed"
      >
        <template v-if="pageData">
          <iframe :src="pageData.page.content.power_bi_link"
                  class="v-proto__embed__iframe"
          ></iframe>
        </template>
      </div>
    </section>
</template>





<script setup lang="ts">
import {ApiFetchPagePowerBIPage} from "~/composable/adminApi/apiFetch";

const route = useRoute()

const slug = computed(() => String(Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug ?? ''))
const powerBiSlug = computed(() => String(Array.isArray(route.params.power_bi_slug) ? route.params.power_bi_slug[0] : route.params.power_bi_slug ?? ''))

const {data: pageData} = await useAsyncData(
    () => `powerbi-tool-${slug.value}-${powerBiSlug.value}`,
    () => ApiFetchPagePowerBIPage(`boite-a-outils/${slug.value}/${powerBiSlug.value}`),
    {watch: [slug, powerBiSlug]}
)

</script>





<style lang="scss" scoped >
.v-proto__embed {
  display: block;
  width: calc(100% / 12 * 12);
  margin-left: auto;
  margin-right: auto;
  height: 100vh;
  padding-top: var(--app-nav__height);
  box-sizing: border-box;
}

.v-proto__embed__iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  border-top: solid 1px var(--app-color-main--dark);
  box-shadow: 0 20px 10px -10px rgba(1, 152, 59, .25);
  box-sizing: border-box;
}
</style>

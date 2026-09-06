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
import {ApiPowerBIResponse} from "~/composable/adminApi/apiDefinitions";

const pageData: Ref<null | ApiPowerBIResponse> = ref(null)

onMounted(() => {
    const slug = useRoute()?.params?.slug
    const power_bi_slug = useRoute()?.params?.power_bi_slug

    ApiFetchPagePowerBIPage(`projects/${slug}/${power_bi_slug}`).then(value => {
        pageData.value = value as ApiPowerBIResponse
    })
})

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

<template>
    <section
        class="v-slug"
    >
        <app-page
            :header-cover="headerCover"
            :header_focus="headerFocus"
            :header-text="headerText"
            :body-content="bodyContent"
        />
        <app-page-footer/>
    </section>
</template>





<script setup lang="ts">
import AppPage from "~/components/AppPage.vue";
import {ApiFetchPage} from "~/composable/adminApi/apiFetch";

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const {data: pageData} = await useAsyncData(
    () => `page-${slug.value}`,
    () => ApiFetchPage(slug.value),
    {watch: [slug]}
)

const headerCover = computed(() => pageData.value?.options.headerImage?.mediaUrl)
const headerFocus = computed(() => pageData.value?.options.headerImage?.focus)
const headerText = computed(() => pageData.value?.options.headerTitle)
const bodyContent = computed(() => pageData.value?.body)
</script>





<style lang="scss" scoped >
.v-slug {
}
</style>

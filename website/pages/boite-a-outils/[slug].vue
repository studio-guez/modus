<template>
    <section
        class="v-tool-slug"
    >
        <app-page
            :header-cover="headerCover"
            :header_focus="headerFocus"
            :title-content="bodyTitle"
            :body-content="bodyContent"
            :path="true"
            :header-size="'small'"
            :header-text="headerText"
            :power_subpages="powerSubpages"
        />
        <app-share-link />
        <app-page-footer/>
    </section>
</template>


<script setup lang="ts">
import AppPage from "~/components/AppPage.vue";
import {ApiFetchPage} from "~/composable/adminApi/apiFetch";

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const {data: pageData} = await useAsyncData(
    () => `tool-${slug.value}`,
    () => ApiFetchPage(`boite-a-outils/${slug.value}`),
    {watch: [slug]}
)

// External tools should not have an internal page
if (pageData.value?.options.isExternalLink) {
    if (pageData.value.options.externalUrl) {
        await navigateTo(pageData.value.options.externalUrl, {external: true})
    } else {
        throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
}

const headerCover = computed(() => pageData.value?.options.headerImage?.mediaUrl)
const headerFocus = computed(() => pageData.value?.options.headerImage?.focus)
const headerText = computed(() => pageData.value?.options.headerTitle)

const bodyTitle = computed(() => pageData.value?.options.preview)
const bodyContent = computed(() => pageData.value?.body)
const powerSubpages = computed(() => pageData.value?.options.subpages)
</script>

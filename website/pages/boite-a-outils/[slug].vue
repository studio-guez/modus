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
import {Ref, UnwrapRef} from 'vue'
import AppPage from "~/components/AppPage.vue";
import {IApiBody, IApiPage__subpage} from "~/composable/adminApi/apiDefinitions";
import {ApiFetchPage} from "~/composable/adminApi/apiFetch";

const headerCover: Ref<UnwrapRef<undefined | string>> = ref(undefined)
const headerFocus: Ref<UnwrapRef<undefined | string>> = ref(undefined)
const headerText: Ref<UnwrapRef<undefined | string>> = ref(undefined)

const bodyTitle: Ref<UnwrapRef<undefined | string>> = ref(undefined)
const bodyContent: Ref<UnwrapRef<undefined | IApiBody>> = ref(undefined)
const powerSubpages: Ref<UnwrapRef<undefined | IApiPage__subpage[]>> = ref(undefined)

onMounted(async () => {
    const slug = useRoute()?.params?.slug

    if(typeof slug !== 'string') return

    const pageData = await ApiFetchPage(`boite-a-outils/${slug}`)

    // External tools should not have an internal page
    if (pageData.options.isExternalLink) {
        if (pageData.options.externalUrl) {
            window.location.href = pageData.options.externalUrl
        } else {
            throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
        }
        return
    }

    headerCover.value = pageData.options.headerImage?.mediaUrl
    headerFocus.value = pageData.options.headerImage?.focus
    headerText.value = pageData.options.headerTitle

    bodyTitle.value = pageData.options.preview
    bodyContent.value = pageData.body
    powerSubpages.value = pageData.options.subpages
})
</script>

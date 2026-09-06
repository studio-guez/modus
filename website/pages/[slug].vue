<template>
    <section
        class="v-slug"
    >
        <app-page
            :header-cover="headerCover"
            :header-text="headerText"
            :body-content="bodyContent"
        />
        <app-page-footer/>
    </section>
</template>





<script setup lang="ts">
import {defineProps, Ref, UnwrapRef} from 'vue'
import AppPage from "~/components/AppPage.vue";
import {IApiBody} from "~/composable/adminApi/apiDefinitions";
import {ApiFetchPage} from "~/composable/adminApi/apiFetch";

const headerCover: Ref<UnwrapRef<undefined | string>> = ref(undefined)
const headerText: Ref<UnwrapRef<undefined | string>> = ref(undefined)

const bodyContent: Ref<UnwrapRef<undefined | IApiBody>> = ref(undefined)

onMounted(async () => {
    const slug = useRoute()?.params?.slug

    if(typeof slug !== 'string') return

    const pageData = await ApiFetchPage(slug)

    headerCover.value = pageData.options.headerImage?.mediaUrl
    headerText.value = pageData.options.headerTitle

    bodyContent.value = pageData.body
})
</script>





<style lang="scss" scoped >
.v-slug {
}
</style>

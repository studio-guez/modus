<template>
    <section
        class="v-project-slug"
    >
        <app-page
            :header-cover="headerCover"
            :header_focus="headerFocus"
            :title-content="bodyTitle"
            :body-content="bodyContent"
            :path="true"
            :header-size="'small'"
            :header-text="headerText"
            :date_start="dateStart"
            :is_project_with_duration="isProjectWithDuration"
            :date_end="dateEnd"
            :project_status="projectStatus"
            :power_subpages="powerSubpages"
        />
        <app-share-link />
        <app-page-footer/>
    </section>
</template>





<script setup lang="ts">
import {defineProps, Ref, UnwrapRef} from 'vue'
import AppPage from "~/components/AppPage.vue";
import {IApiBody, IApiPage__subpage} from "~/composable/adminApi/apiDefinitions";
import {ApiFetchPage} from "~/composable/adminApi/apiFetch";

const headerCover: Ref<UnwrapRef<undefined | string>> = ref(undefined)
const headerFocus: Ref<UnwrapRef<undefined | string>> = ref(undefined)
const headerText: Ref<UnwrapRef<undefined | string>> = ref(undefined)

const bodyTitle: Ref<UnwrapRef<undefined | string>> = ref(undefined)
const bodyContent: Ref<UnwrapRef<undefined | IApiBody>> = ref(undefined)

const dateStart: Ref<UnwrapRef<undefined | string>>              = ref(undefined)
const isProjectWithDuration: Ref<UnwrapRef<undefined | string>>  = ref(undefined)
const dateEnd: Ref<UnwrapRef<undefined | string>>                = ref(undefined)
const projectStatus: Ref<UnwrapRef<undefined | string>>          = ref(undefined)

const powerSubpages: Ref<UnwrapRef<undefined | IApiPage__subpage[]>>            = ref(undefined)

onMounted(async () => {
    const slug = useRoute()?.params?.slug

    if(typeof slug !== 'string') return

    const pageData = await ApiFetchPage(`projects/${slug}`)

    headerCover.value = pageData.options.headerImage?.mediaUrl
    headerFocus.value = pageData.options.headerImage?.focus
    headerText.value = pageData.options.headerTitle

    bodyTitle.value = pageData.options.preview
    bodyContent.value = pageData.body

    dateStart.value = pageData.options.dateStart
    isProjectWithDuration.value = pageData.options.isProjectWithDuration
    dateEnd.value = pageData.options.dateEnd
    projectStatus.value = pageData.options.projectStatus

    powerSubpages.value = pageData.options.subpages
})
</script>

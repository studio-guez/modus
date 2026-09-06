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
import AppPage from "~/components/AppPage.vue";
import {ApiFetchPage} from "~/composable/adminApi/apiFetch";

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const {data: pageData} = await useAsyncData(
    () => `project-${slug.value}`,
    () => ApiFetchPage(`projects/${slug.value}`),
    {watch: [slug]}
)

const headerCover = computed(() => pageData.value?.options.headerImage?.mediaUrl)
const headerFocus = computed(() => pageData.value?.options.headerImage?.focus)
const headerText = computed(() => pageData.value?.options.headerTitle)

const bodyTitle = computed(() => pageData.value?.options.preview)
const bodyContent = computed(() => pageData.value?.body)

const dateStart = computed(() => pageData.value?.options.dateStart)
const isProjectWithDuration = computed(() => pageData.value?.options.isProjectWithDuration)
const dateEnd = computed(() => pageData.value?.options.dateEnd)
const projectStatus = computed(() => pageData.value?.options.projectStatus)

const powerSubpages = computed(() => pageData.value?.options.subpages)
</script>

<template>
    <section
        class="v-project-form"
    >
        <app-page
            :header-cover="headerCover"
            :header-text="headerText"
            :body-content="bodyContent"
        />
        <div
            class="v-project-form__bottom_content"
        >
            <div class="v-project-form__bottom_content__section">
                <app-form />
            </div>
        </div>
        <app-page-footer/>
    </section>
</template>





<script setup lang="ts">
import AppPage from "~/components/AppPage.vue";
import {ApiFetchPage} from "~/composable/adminApi/apiFetch";

const {data: pageData} = await useAsyncData('page-proposer-un-projet', () => ApiFetchPage('proposer-un-projet'))

const headerCover = computed(() => pageData.value?.options.headerImage?.resize.xxl)
const headerText = computed(() => pageData.value?.options.headerTitle)
const bodyContent = computed(() => pageData.value?.body)
</script>





<style lang="scss" scoped >
.v-project-form {
    min-height: calc(100vh);
}

.v-project-form__bottom_content {
    background: var(--app-color-grey);
    position: relative;
    z-index: 10;
    width: 100%;
    padding-bottom: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.v-project-form__bottom_content__section {
    box-sizing: border-box;
    max-width: 900px;
    margin: auto;
    padding: 0;
    width: 100%;

    @media (max-width: 900px) {
        padding-left: var(--app-gutter);
        padding-right: var(--app-gutter);
    }
}
</style>

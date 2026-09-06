<template>
    <section
        class="v-app-actuality"
    >
        <div class="v-app-actuality__title child-remove-margin">
            <h4>Actualités</h4>
        </div>
        <div class="v-app-actuality__img"
        >
            <img alt="image du project"
                 :src="src ? src.resize?.reg : 'images/8.jpg'"
                 class="v-app-actuality__img__img"
            />
        </div>

        <div class="v-app-actuality__content"
        >
            <h4 class="v-app-actuality__content__title"
            >{{title}}</h4>
            <div class="v-app-actuality__content__desc child-remove-margin"
                 v-if="description"
                 v-html="description"
            />
            <div class="v-app-actuality__content__bottom">
                <a v-if="url" class="app-button app-button--small"
                   :href="url"
                   target="_blank"
                >-> Découvrir</a>
                <nuxt-link v-else class="app-button app-button--small" href="/projects">-> Découvrir des projets</nuxt-link>
            </div>
        </div>

    </section>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'
import {IApiImage} from "~/composable/adminApi/apiDefinitions";

const props = defineProps<{
    src?: IApiImage
    title: string
    description?: string
    url?: string
}>()
</script>





<style lang="scss" scoped >
.v-app-actuality {
    display: flex;
    flex-direction: row;
    background: var(--app-color-yellow);
    border-radius: var(--app-radius-small);
    box-sizing: border-box;
    flex-wrap: wrap;
    align-items: center;
    position: relative;

    h4 {
        color: var(--app-color-main--dark);
    }
}

.v-app-actuality__title {
    padding: .5em 1rem;
    position: absolute;
    top: var(--app-gutter);
    left: var(--app-gutter);
    width: auto;
    background:var(--app-color-green-light);
    border-radius: 2rem;

    @media (max-width: 900px) {
        width: 100%;
        position: static;
        background: none;
    }
}

.v-app-actuality__img {
    box-sizing: border-box;
    width: 50%;

    @media (max-width: 900px) {
        width: 100%;
    }
}

.v-app-actuality__img__img {
    aspect-ratio: 1/1;
    display: block;
    background: lightgrey;
    border-radius: var(--app-radius-small);
    width: 100%;
    object-fit: cover;

    @media (max-width: 900px) {
        border-radius: var(--app-radius-small) var(--app-radius-small) var(--app-radius-large) var(--app-radius-large);
    }
}

.v-app-actuality__content {
    box-sizing: border-box;
    padding: 0 1rem 1rem;
    width: 50%;

    @media (max-width: 900px) {
        width: 100%;
    }
}

.v-app-actuality__content__title {
    margin-top: 1em;
    margin-bottom: .25em;
}

.v-app-actuality__content__desc {
    color: var(--app-color-main);
    font-weight: 600;
}


.v-app-actuality__content__bottom {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
}
</style>

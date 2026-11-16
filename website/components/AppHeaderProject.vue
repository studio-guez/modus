<template>
    <header class="v-app-header-project">
        <div class="v-app-header-project__media">
            <img
                class="v-app-header-project__image"
                alt="image graphique de ville pour habiller le header du site"
                :src="bgImage ? bgImage : '/header--default.jpg'"
                :style="{
                    objectPosition: props.bg_focus,
                }"
            />
            <div class="v-app-header-project__title-row"
                 v-if="text"
            >
                <h1 class="v-app-header-project__title"
                    v-html="formattedText"
                />
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { markModus } from '~/utils/markModus'

const props = defineProps<{
    bgImage?: string,
    bg_focus?: string,
    text?: string,
}>()

const formattedText = computed(() => {
    if (!props.text) return ''
    return markModus(props.text)
})
</script>

<style lang="scss" scoped >
.v-app-header-project {
    background: var(--app-color-white);
    width: 100%;
    padding-bottom: .75rem;

    @media (min-width: 768px) {
        padding-bottom: 2rem;
    }
}

// The image fills the whole media box, title row included. The title row's
// bottom half is painted white, so the image always stops at the vertical
// middle of the pill, whatever the number of lines in the title.
.v-app-header-project__media {
    position: relative;
    padding-top: clamp(12rem, 23vw, 19rem);
}

.v-app-header-project__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
}

.v-app-header-project__title-row {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    padding: 0 .5rem;
    background: linear-gradient(to bottom, transparent 50%, var(--app-color-white) 50%);
}

.v-app-header-project__title {
    box-sizing: border-box;
    max-width: 1300px;
    margin: 0 auto;
    padding: .4rem 1.25rem;
    background: var(--app-color-white);
    border: 1.5px solid var(--app-color-main--dark);
    border-radius: 2rem;
    color: var(--app-color-main--dark);
    font-size: clamp(1.38888889rem, 3.3vw, 2.77777778rem);
    line-height: 1.1;
    text-align: left;

    @media (min-width: 768px) {
        padding: .75rem 2rem;
        border-radius: 3rem;
    }

    @media (min-width: 981px) {
        padding: 1rem 2.77777778rem;
        border-radius: 4rem;
    }

    &:deep(mark) {
        background: transparent;
        color: var(--app-color-main);
        padding: 0;
    }
}
</style>

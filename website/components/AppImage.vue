<template>
    <div
        :class="{
            'is-variante': isVariante
        }"
        class="v-app-image"
    >
        <div
            class="v-app-image__image-container"
        >
            <img
                alt="portrait"
                class="v-app-image__img"
                v-if="src"
                :src="src"
            >
            <img
                v-else
                class="v-app-image__img v-app-image__img--empty"
                alt="image de remplacement si pas de photo de profil"
                src="../assets/module_seperate/04--white.svg"
            >
        </div>

        <span
            class="v-app-image__name"
        >{{name}}</span>
        <span
            class="v-app-image__status"
            v-if="status"
        >{{status}}</span>
        <span
            v-if="desc"
            class="v-app-image__desc"
        >{{desc}}</span>
    </div>
</template>





<script lang="ts" setup>
defineProps<{
    src?: string,
    name: string,
    status?: string,
    desc?: string,
    isVariante?: boolean
}>()

</script>





<style lang="scss" scoped >
.v-app-image {
    overflow: hidden;
}

.v-app-image__image-container {
    position: relative;
    background: linear-gradient(to right, var(--app-color-main), var(--app-color-main--dark));
    padding-top: 140%;
}

.v-app-image__img {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    top: 0;
    left: 0;

    &.v-app-image__img--empty {
        object-fit: contain;
        width: 102%;
        left: -1%;
    }
}

.v-app-image__name {
    margin-top: .25rem;
    font-weight: 600;
    display: block;
    text-align: center;
    font-size: .75rem;
    line-height: 1rem;

    .is-variante & {
        color: var(--app-color-main);
    }
}

.v-app-image__status {
    display: block;
    text-align: center;
    font-weight: 500;
    font-size: .75rem;
    line-height: 1rem;
    .is-variante & {
        color: var(--app-color-main);
    }
}

.v-app-image__desc {
    display: block;
    text-align: center;
    font-weight: 500;
    font-size: .5rem;
    line-height: .65rem;
    padding-top: .25rem;

    .is-variante & {
        color: var(--app-color-main);
    }
}
</style>

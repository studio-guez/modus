<template>
    <div
        class="v-app-large-image"
        :style="{
            backgroundImage: src,
        }"
    >
        <h4
            class="v-app-large-image__title"
        >{{ title }}</h4>
    </div>
</template>





<script lang="ts" setup>
defineProps<{
    src?: string,
    title: string,
}>()


</script>





<style lang="scss" scoped >
.v-app-large-image {
    background: linear-gradient(to right, var(--app-color-main), var(--app-color-main--dark));
    padding-top: 125%;
    position: relative;
}

.v-app-large-image__title {
    color: white;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: var(--app-gutter);
}
</style>

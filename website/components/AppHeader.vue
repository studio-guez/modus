<template>
    <header
        class="v-app-header"
        :class="{
            'v-app-header--no-signature-text': !text,
        }"
    >
    <img
        class="v-app-header__image"
        alt="image graphique de ville pour habiller le header du site"
        :src="bgImage ? bgImage : '/header--default.jpg'"
        :style="{
            objectPosition: props.bg_focus,
        }"
    />
    <div class="v-app-header__signature"
        v-if="text"
        v-html="text"
    />
    </header>
</template>





<script lang="ts" setup>
const props = defineProps<{
  bgImage?: string,
  bg_focus?: string,
  text?: string,
}>()

</script>





<style lang="scss" scoped >
.v-app-header {
    background: var(--app-color-white);
    width: 100%;
    height: var(--app-header-height);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    position: relative;

  &.v-app-header--regular {
    height: auto;
    background: var(--app-color-grey);

    .v-app-header__container {
      height: auto;
      position: relative;

      .v-app-header__container__graphic-box {
        height: auto;
        position: relative;

        .v-app-header__graphic-box__module_1 {
          height: auto;
          max-height: 75vh;
          object-fit: cover;
          top: 0;
        }
      }
    }
  }
}

.v-app-header__image {
    object-fit: cover;
    flex: 1;
    min-height: 0;
}

.v-app-header__signature {
    flex: 0 0 auto;
    line-height: 1em;
    letter-spacing: -.0125em;
    box-sizing: border-box;
    width: 100%;
    padding: var(--app-gutter);
    background: var(--app-color-white);
    padding-bottom: 2rem;
    padding-top: 2rem;
    font-size: 4.5rem;
    font-weight: 900;
    color: var(--app-color-main--dark);
    max-width: 1300px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;

    @media (max-width: 900px) {
        font-size: 2.5rem;
    }

    @media (max-width: 700px) {
        font-size: 2rem;
    }
}
</style>

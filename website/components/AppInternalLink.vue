<template>
    <section
        class="v-app-internal-link"
        :class="{
            'v-app-internal-link--circle': styleDesign === 'circle',
            'v-app-internal-link--full': isFull,
        }"
    >
        <div class="v-app-internal-link__img"
        >
            <img alt="image du project"
                 :src="src"
                 class="v-app-internal-link__img__img"
            />
        </div>
        <div class="v-app-internal-link__content-wrapper">
            <div class="v-app-internal-link__content">
                <h4 v-if="isFull" class="v-app-internal-link__content__title"
                >{{ title }}</h4>
                <div>
                    <h4 v-if="!isFull" class="v-app-internal-link__content__title"
                    >{{ title }}</h4>
                    <div class="v-app-internal-link__content__desc child-remove-margin"
                        v-if="description"
                        v-html="description"
                    />
                    <div v-if="isFull" class="v-app-internal-link__content__button">
                        <nuxt-link class="app-button app-button--small" :href="href">En savoir plus +</nuxt-link>
                    </div>
                </div>
                <div v-if="!isFull" class="v-app-internal-link__content__button">
                    <nuxt-link class="app-button app-button--small" :href="href">En savoir plus +</nuxt-link>
                </div>
            </div>
        </div>
    </section>
</template>





<script setup lang="ts">
const props = defineProps<{
    src: string
    href: string
    title: string
    description?: string
    styleDesign?: "circle" | 'default',
    isFull?: boolean
}>()
</script>





<style lang="scss" scoped >
.v-app-internal-link {
    display: flex;
    flex-direction: column;
    background: var(--app-color-green-light);
    border-radius: var(--app-radius-small);
    box-sizing: border-box;
    height: 100%;
    flex-wrap: nowrap;
    align-items: flex-start;
    overflow: hidden;
    position: relative;

    &.v-app-internal-link--circle {
        border-top-left-radius:     16rem;
        border-top-right-radius:    16rem;
    }

    &.v-app-internal-link--full {
        flex-direction: row;
        padding: 4.22222222222rem 0;
        border-radius: 0;
        @media (max-width: 900px) {
            padding: var(--app-gutter) 0;
        }
    }
}

.v-app-internal-link__content-wrapper {
    .v-app-internal-link--full & {
      box-sizing: border-box;  
      max-width: 1300px;
      margin: 0 auto;
      padding: 0 var(--app-gutter);
    }
}

.v-app-internal-link__content {
    box-sizing: border-box;
    padding: 0 1rem 1rem;
    width: 100%;
    height: 100%;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    gap: 1rem;

    .v-app-internal-link--full & {
      background-color: var(--app-color-grey);
      border-radius: var(--app-radius-large) var(--app-radius-large) 0.55555555555rem var(--app-radius-large);
      display: grid;
      grid-template-columns: 1fr 1fr;
      row-gap: 1rem;
      padding: 2.77777777778rem;
      align-items: center;
      @media (max-width: 900px) {
        border-radius: var(--app-radius-small) var(--app-radius-small) 0.255555555555rem var(--app-radius-small);
        display:block;
        padding: 1rem;
      }
    }
}

.v-app-internal-link__img__img {
  display: block;
  background: var(--app-color-main);
  width: 100%;
  object-fit: cover;
  border-radius: var(--app-radius-small) var(--app-radius-small) var(--app-radius-large) var(--app-radius-large);
  flex-shrink: 0;
  aspect-ratio: 5/3;

  .v-app-internal-link--circle & {
    border-bottom-left-radius: var(--app-radius-small);
    border-bottom-right-radius: var(--app-radius-small);
  }

  .v-app-internal-link--full &
   {
    aspect-ratio: auto;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    border-radius: 0;
  }

  @media (max-width: 900px) {
    aspect-ratio: 1/1;
  }
}

.v-app-internal-link__content__title {
  margin-top: 1em;
  margin-bottom: .25em;
    color: var(--app-color-main--dark);

    .v-app-internal-link--full & {
      color: var(--app-color-black);
      font-size: 3.55555555556rem;
      font-weight: 600;
      margin: 0;
      line-height: 1.14;
      @media (max-width: 1280px) {
        font-size: 2.5rem;
      }
      @media (max-width: 900px) {
        color: var(--app-color-main--dark);
        font-weight: 900;
        font-size: 1.45rem;
        margin-top: 1em;
        margin-bottom: .25em;
        line-height: 1.225;;
      }
    }
}

.v-app-internal-link__content__button {
  display: flex;
  justify-content: flex-end;
    .v-app-internal-link--full & {
        justify-content: flex-start;
        & .app-button{
            color: var(--app-color-black);
            background-color: var(--app-color-yellow);  
            border-color: var(--app-color-yellow);
            &:hover {
                background-color: var(--app-color-main--dark);
                border-color: var(--app-color-main--dark);
                color: var(--app-color-white);
            }
        }
      @media (max-width: 900px) {
          justify-content: flex-end;

      }
    }
}

.v-app-internal-link__content__desc {
    font-weight: 600;
    .v-app-internal-link--full & {
        margin-bottom: 1.38888888889rem;
    }
}
</style>
<style lang="scss">
.v-app-internal-link__content__desc {
    > * {
        color: var(--app-color-main) !important;
    }
    .v-app-internal-link--full & {
        > * {
            color: var(--app-color-black) !important;
        }
    }
}
</style>

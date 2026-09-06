<template>
  <header
          class="v-app-header-home"
  >
    <div
            class="v-app-header-home__container"
    >
      <div
              class="v-app-header-home__container__graphic-box"
      >
        <img
                class="v-app-header-home__graphic-box__module_1"
                alt="image graphique de ville pour habiller le header du site"
                :src="bgImage"
        />
      </div>
      <div
              class="v-app-header-home__container__graphic-box"
      >
        <img
                class="v-app-header-home__graphic-box__module_1"
                alt="image graphique de ville pour habiller le header du site"
                :src="bgImage"
        />
      </div>
    </div>

    <h1
            class="v-app-header-home__signature"
            v-html="formattedText"
    />

  </header>
</template>





<script lang="ts" setup>
import { markModus } from '~/utils/markModus'

const props = defineProps<{
    bgImage: string,
    text?: string,
}>()

const formattedText = computed(() => {
    if (!props.text) return ''
    return markModus(props.text)
})


</script>





<style lang="scss" scoped >
.v-app-header-home {
  box-sizing: border-box;
  background: white;
  width: 100%;
  padding: 6rem var(--app-base-padding-x) 0 var(--app-base-padding-x);
  height: var(--app-header-height);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;


  @media (max-width: 900px) {
    height: calc( var(--app-header-height) );
  }
}

.v-app-header-home__container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.v-app-header-home__signature {
  z-index: 1;
  color: var(--app-color-white);
  font-size: var(--app-header-title-size);
  text-align: center;
  text-wrap: balance;
  margin: 0;
  text-shadow: 0 4px 64.4px rgba(0, 0, 0, 0.30);
  max-width: 68.3333333333rem;

  &:deep(mark) {
      background: transparent;
      color: var(--app-color-main);
      padding: 0;
  }
}

.v-app-header-home__container__graphic-box {
  position: absolute;
  top: 0;
  left: 0;
  height: var(--app-header-height);
  width: auto;
  animation: scroll 200s linear infinite;

}

.v-app-header-home__graphic-box__module_1 {
  position: relative;
  top: 0;
  height: var(--app-header-height);

  .v-app-header-home__container__graphic-box + .v-app-header-home__container__graphic-box & {
    transform: translate3d(100%, 0, 0);
  }
}

@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}


</style>

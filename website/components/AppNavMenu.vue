<template>
  <Transition name="drawer">
    <div class="v-app-nav-menu" v-if="showMenu().value">
      <div class="v-app-nav-menu__header">
        <!-- Top Menu -->
        <div class="v-app-nav-menu__section v-app-nav-menu__section--top" v-if="useMenus().value?.topMenu?.length">
            <template v-for="item of useMenus().value?.topMenu" :key="item.url">
            <a v-if="item.openInNewTab" class="v-app-nav-menu__item v-app-nav-menu__item--top" :class="{ 'v-app-nav-menu__item--has-image': item.svgUrl }" :href="item.url" target="_blank" rel="noopener noreferrer">
                <img v-if="item.svgUrl" class="v-app-nav-menu__icon" :src="item.svgUrl" :alt="item.title">
                <span v-else>{{ item.title }}</span>
            </a>
            <nuxt-link v-else class="v-app-nav-menu__item v-app-nav-menu__item--top" :class="{ 'v-app-nav-menu__item--has-image': item.svgUrl }" :href="item.url" @click="showMenu().value = false">
                <img v-if="item.svgUrl" class="v-app-nav-menu__icon" :src="item.svgUrl" :alt="item.title">
                <span v-else>{{ item.title }}</span>
            </nuxt-link>
            </template>
        </div>
        <!-- Menu Toggle (close button) -->
        <div class="v-app-nav-menu__toggle" @click="showMenu().value = false">
          <svg width="30" height="30" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30Z" fill="var(--app-color-main)"/>
            <rect x="13" y="18" width="34" height="4" fill="var(--app-color-white)"/>
            <rect x="13" y="28" width="34" height="4" fill="var(--app-color-white)"/>
            <rect x="13" y="38" width="34" height="4" fill="var(--app-color-white)"/>
          </svg>
        </div>
      </div>

      <!-- Main Menu (with 2 levels) -->
      <div class="v-app-nav-menu__section v-app-nav-menu__section--main">
        <template v-for="item of useMenus().value?.mainMenu" :key="item.url">
          <div class="v-app-nav-menu__group">
            <a v-if="item.openInNewTab" class="v-app-nav-menu__item v-app-nav-menu__item--main" :class="{ 'v-app-nav-menu__item--has-image': item.svgUrl }" :href="item.url" target="_blank" rel="noopener noreferrer">
              <img v-if="item.svgUrl" class="v-app-nav-menu__icon" :src="item.svgUrl" :alt="item.title">
              <span v-else>{{ item.title }}</span>
            </a>
            <nuxt-link v-else class="v-app-nav-menu__item v-app-nav-menu__item--main" :class="{ 'v-app-nav-menu__item--has-image': item.svgUrl }" :href="item.url" @click="showMenu().value = false">
              <img v-if="item.svgUrl" class="v-app-nav-menu__icon" :src="item.svgUrl" :alt="item.title">
              <span v-else>{{ item.title }}</span>
            </nuxt-link>
            <!-- Children (2nd level) -->
            <div v-if="item.children?.length" class="v-app-nav-menu__children">
              <template v-for="child of item.children" :key="child.url">
                <a v-if="child.openInNewTab" class="v-app-nav-menu__item v-app-nav-menu__item--child" :class="{ 'v-app-nav-menu__item--has-image': child.svgUrl }" :href="child.url" target="_blank" rel="noopener noreferrer">
                  <img v-if="child.svgUrl" class="v-app-nav-menu__icon" :src="child.svgUrl" :alt="child.title">
                  <span v-else>{{ child.title }}</span>
                </a>
                <nuxt-link v-else class="v-app-nav-menu__item v-app-nav-menu__item--child" :class="{ 'v-app-nav-menu__item--has-image': child.svgUrl }" :href="child.url" @click="showMenu().value = false">
                  <img v-if="child.svgUrl" class="v-app-nav-menu__icon" :src="child.svgUrl" :alt="child.title">
                  <span v-else>{{ child.title }}</span>
                </nuxt-link>
              </template>
            </div>
          </div>
        </template>
      </div>

      <!-- Bottom Menu -->
      <div class="v-app-nav-menu__section v-app-nav-menu__section--bottom" v-if="useMenus().value?.bottomMenu?.length">
        <template v-for="item of useMenus().value?.bottomMenu" :key="item.url">
          <a v-if="item.openInNewTab" class="v-app-nav-menu__item v-app-nav-menu__item--bottom" :class="{ 'v-app-nav-menu__item--has-image': item.svgUrl }" :href="item.url" target="_blank" rel="noopener noreferrer">
            <img v-if="item.svgUrl" class="v-app-nav-menu__icon" :src="item.svgUrl" :alt="item.title">
            <span v-else>{{ item.title }}</span>
          </a>
          <nuxt-link v-else class="v-app-nav-menu__item v-app-nav-menu__item--bottom" :class="{ 'v-app-nav-menu__item--has-image': item.svgUrl }" :href="item.url" @click="showMenu().value = false">
            <img v-if="item.svgUrl" class="v-app-nav-menu__icon" :src="item.svgUrl" :alt="item.title">
            <span v-else>{{ item.title }}</span>
          </nuxt-link>
        </template>
      </div>

      <!-- Footer Menu -->
      <div class="v-app-nav-menu__section v-app-nav-menu__section--footer">
        <!-- Social icons -->
        <div class="v-app-nav-menu__social app__icon">
          <a href="https://ch.linkedin.com/company/fondation-modus" target="_blank">
            <span class="v-app-nav-menu__icon-social">
              <SvgLinkedin />
            </span>
          </a>
          <a href="https://www.youtube.com/@modus-ge" target="_blank">
            <span class="v-app-nav-menu__icon-social">
              <SvgYoutube />
            </span>
          </a>
          <a href="https://www.instagram.com/fondation_modus/" target="_blank">
            <span class="v-app-nav-menu__icon-social">
              <SvgInstagram />
            </span>
          </a>
          <a href="https://open.spotify.com/show/1nWW7TtBUhy9z7uf1pncIE?si=f3b45773979b4b76" target="_blank">
            <span class="v-app-nav-menu__icon-social">
              <SvgSpotify />
            </span>
          </a>
        </div>
        <template v-for="item of useMenus().value?.footerMenu" :key="item.url">
          <a v-if="item.openInNewTab" class="v-app-nav-menu__item v-app-nav-menu__item--footer" :href="item.url" target="_blank" rel="noopener noreferrer">
            <img v-if="item.svgUrl" class="v-app-nav-menu__icon" :src="item.svgUrl" :alt="item.title">
            <span v-else>{{ item.title }}</span>
          </a>
          <nuxt-link v-else class="v-app-nav-menu__item v-app-nav-menu__item--footer" :href="item.url" @click="showMenu().value = false">
            <img v-if="item.svgUrl" class="v-app-nav-menu__icon" :src="item.svgUrl" :alt="item.title">
            <span v-else>{{ item.title }}</span>
          </nuxt-link>
        </template>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { showMenu, useMenus } from "~/composable/main";
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.v-app-nav-menu {
  position: fixed;
  top: 0;
  right: 0;
  height: 100dvh;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 45rem;
  background: var(--app-color-grey);
  box-sizing: border-box;
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
  pointer-events: all;
  border-radius: 2rem 0 0 2rem;
  
  @media (min-width: 768px) {
    --app-base-padding-x: 2rem;
  }

  @media (min-width: 1024px) {
    --app-base-padding-x: 2rem;
  }

  @media (max-width: 900px) {
    width: 100%;
    border-radius: 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 var(--app-base-padding-x);
    box-sizing: border-box;
    min-height: var(--app-nav__height); 
  }

  &__toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__section {
    display: flex;
    gap: 0.5rem;
    max-width: 100%;

    &--main {
      flex-direction: column;
      align-items: flex-start;
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 1.55555555556rem var(--app-base-padding-x);
      gap: 0.83333333333rem;
    }
    &--bottom {
      flex-direction: column;
      align-items: flex-start;
      padding: 0.55555555555rem var(--app-base-padding-x);
      gap: 0.83333333333rem;
    }
    &--footer {
        background-color: var(--app-color-white);
        width: 100%;
        border-radius: 0 0 0 2rem;
        flex-direction: column;
        align-items: flex-start;
        padding: 1.55555555556rem var(--app-base-padding-x);
        gap: 1.55555555556rem;

        @media (max-width: 900px) {
            padding: 0.75rem var(--app-base-padding-x);
            gap: 0.775rem;
            border-radius: 0;
        }
    }
  }

  &__group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.83333333333rem;
    max-width: 100%;
  }

  &__children {
    display: flex;
    gap: 0.55555555555rem;
    @media (max-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.83333333333rem;
        margin-left: 0.75rem;
    }
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    height: 2rem;
    width: auto;

    :deep(svg) {
      height: 100%;
      width: auto;
      fill: currentColor;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    text-decoration: none;
    box-sizing: border-box;
    transition: color 0.3s ease, background-color 0.3s ease;
    max-width: 100%;
    min-width: 0;

    &--has-image {
      background-color: transparent !important;
      padding: 0 !important;
      border-radius: 0 !important;

      &:hover {
        background-color: transparent !important;
      }
    }
  }

  &__item--top {
    color: var(--app-color-main--dark);
    background-color: var(--app-color-yellow);
    border-radius: 5em 5em 0 5em;
    font-size: 1.11111111111rem;
    line-height: 1em;
    font-weight: 700;
    padding: 0.2222222222222222rem 1.11111111111rem;

    &:hover {
      background-color: var(--app-color-main--dark);
      color: var(--app-color-yellow);
    }
  }

  &__item--main {
    justify-content: center;
    background-color: var(--app-color-white);
    color: var(--app-color-main--dark);
    border-radius: 5em;
    font-size: 2rem;
    line-height: 1em;
    font-weight: 600;
    padding: 1.11111111111rem;

    &:hover {
      color: var(--app-color-white);
      background-color: var(--app-color-main--dark);
    }

    @media (max-width: 900px) {
      padding: 0.75rem;
      font-size: 1rem;
    }
  }

  &__item--child {
    justify-content: center;
    background-color: var(--app-color-white);
    color: var(--app-color-main--dark);
    border-radius: 5em;
    font-size: 1.11111111111rem;
    line-height: 1em;
    font-weight: 600;
    padding: 0.75rem 1.11111111111rem;

    &:hover {
      color: var(--app-color-white);
      background-color: var(--app-color-main--dark);
    }

    @media (max-width: 900px) {
      padding: 0.75rem;
      font-size: 0.75rem;
    }
  }

  &__item--bottom {
    justify-content: center;
    background-color: var(--app-color-main--dark);
    color: var(--app-color-yellow);
    border-radius: 5em;
    font-size: 1.33333333333rem;
    line-height: 1em;
    font-weight: 700;
    padding: 0.75rem 1.11111111111rem;

    &:hover {
      color: var(--app-color-main--dark);
      background-color: var(--app-color-yellow);
    }

    @media (max-width: 900px) {
      padding: 0.75rem;
      font-size: 0.75rem;
    }
  }

  &__item--footer {
    font-size: 1.11111111111rem;
    line-height: 1em;
    font-weight: 600;
    text-decoration: underline;

    &:hover {
      color: var(--app-color-main);
    }

    @media (max-width: 900px) {
      font-size: 0.75rem;
    }
  }

  &__social {
    display: flex;
    align-items: stretch;
    pointer-events: all;
    gap: 0;

    & a {
      box-sizing: content-box;
      display: flex;
      align-items: center;
      padding: 0 0.125rem;
      height: auto;
      background-color: transparent;
      border-radius: 0;
    }
  }

  &__icon-social {
    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 1.675rem;
    width: 1.675rem;
    background-color: var(--app-color-main--dark);
    border-radius: 200px;
  }
}

// Drawer transition
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease-in-out;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>

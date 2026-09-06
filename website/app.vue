<template>
  <app-nav/>

  <nuxt-page/>

  <ClientOnly>
    <div class="v-app__cookie" v-if="!cookieIsValidate().value && showCookieBanner().value">
        <app-cookie/>
    </div>
  </ClientOnly>

  <div class="v-app__bottom-bar">
    <app-actualites-bar/>
    <app-podcast-player/>
  </div>
  <app-youtube-player/>
</template>





<script lang="ts" setup>

import {
    bodyScrollInfo,
    cookieIsValidate,
    showCookieBanner,
    showMenu,
    useMenus,
    useStateNavBarreMsgMessage
} from "~/composable/main";
import AppCookie from "~/components/AppCookie.vue";
import {getCookieBannerValue, setCookieBannerValue} from "~/utils/cookieBannerLocalStorage";
import {matomo, updateMatomoWithNavigation} from "~/utils/matomo";

// Site-wide <title> suffix. The site name comes from the CMS (menus.json), which
// useMenus() already fetches on every render, so this costs no extra request.
// A page that sets no title of its own renders the bare site name — which is the
// wanted behaviour for the home page.
const menus = useMenus()
const siteName = computed(() => menus.value?.siteTitle?.trim() || 'modus')

useHead(computed(() => ({
    titleTemplate: (pageTitle?: string) =>
        pageTitle?.trim() ? `${pageTitle} | ${siteName.value}` : siteName.value,
})))

if (import.meta.client) {
    matomo()
    useRouter().afterEach((to, from) => {
        updateMatomoWithNavigation(from.fullPath)
    })
}

onMounted(() => {
    window.addEventListener('scroll', () => {
        bodyScrollInfo().value = {top: window.scrollY }
    })

    if(useRouter().currentRoute.value.path === '/declic-mobilite') useRouter().push('/forms/declic-mobilite')
})

useRouter().beforeEach((to, from, next) => {
    showMenu().value = false
    useStateNavBarreMsgMessage().value = null
    next()
})

watch(cookieIsValidate, (value, oldValue, onCleanup) => {
    setCookieBannerValue(value.value)
})

onBeforeMount(() => {
    if( getCookieBannerValue() === true ) cookieIsValidate().value = true
})

</script>





<style lang="scss" scoped >
.v-app__cookie {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 100;
}

.v-app__bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 100;
}
</style>

<style lang="scss">
.page-enter-active, .page-leave-active {
    position: relative;
    transition: all .5s ease-in-out;
}

.page-enter-from {
    transform: translate3d(5vw, 0, 0);
    opacity: 0;
}

.page-enter-to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
}

.page-leave-from {
    transform: translate3d(0, 0, 0);
    opacity: 1;
}

.page-leave-to {
    transform: translate3d(0, -1vh, 0);
    opacity: 0;
}
</style>

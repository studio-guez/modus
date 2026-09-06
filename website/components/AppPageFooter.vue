<template>
    <footer
        class="v-app-page-footer"
    >
        <div class="v-app-page-footer__footer">

            <section class="v-app-page-footer__footer__mailto"
                 v-if="showMailTo"
            >
                <div class="v-app-page-footer__footer__mailto__link__text"
                >
                    <div>Vous avez des questions&nbsp;?</div>
                    <div>Vous pouvez nous écrire à cette adresse&nbsp;</div>
                    <div><a href="mailto:info@modus-ge.ch" class="app-button app-button--small v-app-page-footer__footer__mailto__link">info@modus-ge.ch</a></div>
                </div>
            </section>

            <app-newsletter/>
            <img
                src="/images/166.jpg"
                class="v-app-page-footer__bottom-image"
                alt="image d'architecture urbaine"
            />
        </div>


        <div
            class="v-app-page-footer__bottom"
        >
            <img
                alt="logo Modus fin de page"
                src="/modus-webapp-footer--web--v2.jpg"
            />
            <div
                :class="{'with-opacity-1': transformYValue > 92}"
                :style="`transform: translate(0, -${ (100 - transformYValue)}%) scale(${transformYValue / 100}, ${transformYValue / 100})`"
                class="v-app-page-footer__bottom__contact"
            >
                <a href="mailto:info@modus-ge.ch" target="_blank">info@modus-ge.ch</a>
                <address class="v-app-page-footer__bottom__address"><a href="https://maps.app.goo.gl/JFB5uPAcHgqTwReH8" target="_blank">Rte de la Galaise 25, 1228 Plan-les-Ouates</a></address>
                <div class="app__icon">
                    <a href="https://ch.linkedin.com/company/fondation-modus" target="_blank">
                        <SvgLinkedin />
                    </a>
                    <a href="https://www.youtube.com/@modus-ge" target="_blank">
                        <SvgYoutube />
                    </a>
                    <a href="https://www.instagram.com/fondation_modus/" target="_blank">
                        <SvgInstagram />
                    </a>
                    <a href="https://open.spotify.com/show/1nWW7TtBUhy9z7uf1pncIE?si=f3b45773979b4b76" target="_blank">
                        <SvgSpotify />
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>


<script setup lang="ts">
import type {ComputedRef} from 'vue'
import {bodyScrollInfo} from "~/composable/main";
import {getValueToPercent} from "~/utils/precent";

withDefaults(defineProps<{
    showMailTo?: boolean
}>(), {
    showMailTo: true,
})

const bodyScrollInfoStore = bodyScrollInfo()

const transformYValue: ComputedRef<number> = computed(() => {
    if (import.meta.server) return 0
    return getValueToPercent(bodyScrollInfoStore.value.top, document.body.scrollHeight - window.innerHeight)
})
</script>


<style lang="scss" scoped>
.v-app-page-footer {
    position: relative;
}

.v-app-page-footer__footer {
    background: white;
    position: relative;
    z-index: 10;
}

.v-app-page-footer__footer__mailto__link__text {
    color: var(--app-color-main--dark);
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.1;
    padding: 2.55555555556rem var(--app-base-padding-x);
}

.v-app-page-footer__footer__mailto__link {
    font-weight: 700;
}

.v-app-page-footer__bottom {
    position: sticky;
    bottom: 0;
    z-index: 1;
    background: white;

    > img {
        box-sizing: border-box;
        padding: 2rem 1rem 1.5rem;
        width: 100%;
        height: auto;
        display: block;
    }
}

.v-app-page-footer__bottom-image {
    display: block;
    width: 100%;
    height: 100vh;
    position: relative;
    z-index: 10;
    object-fit: cover;
}

.v-app-page-footer__bottom__contact {
    margin: auto;
    text-align: center;
    width: 100%;
    max-width: none;
    padding-bottom: 1.5rem;
    transition: opacity 1s ease-in-out;
    opacity: 0;
    color: var(--app-color-main);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &.with-opacity-1 {
        opacity: 1;
    }

    > a {
        display: block;
        text-decoration: none;
    }

    address {
        font-style: normal;
        a {    
            text-decoration: none;
        }
    }

    .app__icon {
        a {
            background: var(--app-color-main);
            transition: background-color 0.3s ease-in-out;

            &:hover {
                background-color: var(--app-color-main--dark);
            }
        }
    }
    a{
        transition: color 0.3s ease-in-out;
        &:hover {
            color: var(--app-color-main--dark);
        }
    }
}
.v-app-page-footer__bottom__address{
    margin-bottom: 1rem;
}
</style>


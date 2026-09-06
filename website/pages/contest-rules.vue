<template>
    <main
            class="v-page-en"
    >
        <div
                class="v-page-en__content app-show-background-on-nav"
        >
            <section
                class="v-page-en__section"
            >
                <div
                    class="v-page-en__section__content v-page-en__grid v-page-en__grid--with-gutter"
                >
                    <div>

                        <div
                            class="v-page-en__section__title"
                        >
                            <h2>Contest rules</h2>
                        </div>
                        <h3>Contest rules for participants in the Greater Geneva Mobility Survey</h3>
                        <p style="color: var(--app-color-main--dark)">By entering the contest, you agree to the following terms and conditions:</p>

                        <h4>Organizer</h4>
                        <p>Yougov for Fondation Modus</p>

                        <h4>Who can participate</h4>
                        <p>Only individuals who have participated in the GREATER GENEVA MOBILITY survey and have completed the online questionnaire in full (i.e. the participant has filled in all of the required responses) can participate in the contest. The GREATER GENEVA MOBILITY survey is open to all permanent residents of Greater Geneva, who were contacted personally via a written invitation sent by the Fondation Modus.</p>

                        <h4>How to enter</h4>
                        <p>individuals can participate in the contest by answering “yes” to the relevant question at the end of the online survey. They will then be asked to provide their email address, which will be used only to contact the contest winners. Under no circumstances will it be used for other purposes or shared with third parties.</p>
                        <p>The contest is open from June 4, 2024 through August 2, 2024 (the same period as the GREATER GENEVA MOBILITY survey).</p>

                        <h4>Conditions</h4>
                        <p>participants who do not complete the online survey in full or do not provide a valid email address will not be eligible to compete.</p>

                        <h4>Drawing of winners and prizes</h4>
                        <p>200 winners will be selected randomly at the end of August 2024. The drawing is definitive. Any legal recourse is strictly prohibited. The prize is non-transferable, non-negotiable, non-exchangeable and cannot be redeemed for cash.</p>

                        <h4>Awarding of prizes</h4>
                        <p>prize winners will be informed individually by email at the email address they provided in the online survey. They will be asked to provide their home address, to which the prize will be sent. No prize-awarding ceremony will be held, and there will be no further correspondence concerning the contest.</p>
                        <p>Yougov reserves the right to verify the accuracy of participants’ personal information at the time the prizes are awarded. In the event that an identity is non-verifiable, Yougov reserves the right to not allocate or remit prizes.</p>

                        <h4>Acceptance of the terms and conditions</h4>
                        <p>By entering, participants confirm that they accept the terms and conditions in full. They also acknowledge that Yougov’s decisions before, during and after the Contest are final and may not be appealed legally.</p>
                    </div>
                </div>
            </section>

        </div>

        <footer class="v-page-en__footer">
            <app-newsletter/>
            <img
                    src="/images/166.jpg"
                    class="v-page-en__bottom-image"
                    alt="image d'architecture urbaine"
            />
        </footer>


        <div
                class="v-page-en__bottom"
        >
            <img
                    alt="logo Modus fin de page"
                    src="/modus-webapp-footer--web--v2.jpg"
            />
            <div
                    :class="{'with-opacity-1': transformYValue > 92}"
                    :style="`transform: translate(0, -${ (100 - transformYValue)}%) scale(${transformYValue / 100}, ${transformYValue / 100})`"
                    class="v-page-en__bottom__mailto"
            ><a href="mailto:info@modus-ge.ch" target="_blank">info@modus-ge.ch</a></div>
        </div>

    </main>
</template>


<script lang="ts" setup>

import AppVideo from "~/components/AppVideo.vue";
import {arrayOfH2TitleIdInCurrentPage} from "~/composable/main";
import {getValueToPercent} from "~/utils/precent";


import {bodyScrollInfo} from "~/composable/main";
import {ComputedRef} from "vue";

useHead({
    title: 'modus',
    meta: [
        {
            name: 'description',
            content: 'modus. pour une mobilité durable à Genève',
        }
    ],
})

const bodyScrollInfoStore = bodyScrollInfo()

const transformYValue: ComputedRef<number> = computed(() => {
    return getValueToPercent(bodyScrollInfoStore.value.top, document.body.scrollHeight - window.innerHeight)
})

const h2TitleIdInCurrentPage = arrayOfH2TitleIdInCurrentPage()

onMounted(() => {
    nextTick(() => {
        h2TitleIdInCurrentPage.value =
            Array.from(document.querySelectorAll('.v-page-en__section__title h2'))
                .map((htmlHeadingElement) => {


                    if (!htmlHeadingElement.id)
                        htmlHeadingElement.id = encodeURIComponent(htmlHeadingElement.textContent || 'generateID')

                    return {
                        anchor: htmlHeadingElement.id,
                        name: (htmlHeadingElement as HTMLElement).innerText,
                    }
                })

        interactionWithElementToAnimated()
    })
})

function interactionWithElementToAnimated() {
    const elementsToSetBackgroundNav = document.querySelectorAll('.app-schema_animation')

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active')
            } else {
                entry.target.classList.remove('is-active')
            }
        })
    }, {
        rootMargin: `0px 0px ${window.innerHeight / 5 * -1}px 0px`
    })

    elementsToSetBackgroundNav.forEach((value) => {
        observer.observe(value)
    })
}
</script>


<style lang="scss" scoped>
.v-page-en {
    h3 {
        font-size: 1.5rem;
        line-height: 1em;
    }

    h4, p {
        font-weight: 600;
        font-size: .85rem;
        line-height: 1.2em;
    }

    h4 {
        margin-top: 1rem;
        margin-bottom: 0;
        + p {
            margin-top: 0;
        }
    }

    p {
        max-width: none;
        margin-top: 1rem;
        margin-bottom: 1rem;
        color: var(--app-color-main);

    }

    @media (max-width: 900px) {
        h3 {
            font-size: 1rem;
        }

        h4, p {
            font-size: .75rem;
        }
    }

    @media (max-width: 700px) {
        h3 {
            font-size: 1rem;
        }

        h4, p {
            font-size: .65rem;
        }
    }
}

.v-page-en__section {
  box-sizing: border-box;
  padding-left: var(--app-gutter);
  padding-right: var(--app-gutter);
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;

  &.v-page-en__section--no-padding {
    padding-top: 0;
    padding-bottom: 0;
  }

  &.v-page-en__section--intro {
    box-sizing: content-box;
    position: relative;

    p:nth-child(1n + 1) {
      color: var(--app-color-main);
    }

    p:nth-child(2n + 1) {
      color: var(--app-color-main--dark);
    }
  }

  .v-page-en__section__graphic-items {
    position: absolute;

    @media (max-width: 900px) {
      display: none;
    }
  }

  .v-page-en__section__graphic-items--m {
    top: 0;
    left: 0;
    transform: translate(-100%, 0%);
    height: 16vw;
    max-height: 298px;
  }

  .v-page-en__section__graphic-items--o {
    bottom: 0;
    left: 0;
    transform: translate(-100%, 0%);
    height: 8vw;
    max-height: 148px;
  }

  .v-page-en__section__graphic-items--du {
    top: 0;
    right: 0;
    transform: translate(90%, -10%);
    height: 20vw;
    max-height: 372px;
  }

  .v-page-en__section__graphic-items--s {
    bottom: 0;
    right: 0;
    transform: translate(100%, 0%);
    height: 12vw;
    max-height: 224px;
  }
}

.v-page-en__section__video-box {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, .5fr);
    gap: var(--app-gutter);
    padding-top: 2rem;
}

.v-page-en__section__video-box__player {
    width: 100%;
    max-width: 20rem;
    margin: auto;

    &.v-page-en__section__video-box__player--xl {
        grid-column-end: span 2;
        max-width: 28rem;
    }

    @media (max-width: 1200px) {
        grid-column-end: span 2;
    }
}

.v-page-en__section__content {
  position: relative;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;

  > img {
    display: block;
    width: 100%;
  }

  &.v-page-en__section__content--sticky {
    @media (max-width: 700px) {
      flex-direction: column;
    }

    > * {
      @media (max-width: 900px) {
        width: calc(((100% + var(--app-gutter)) / 5 * 3) - var(--app-gutter)) !important;
      }
      @media (max-width: 700px) {
        width: calc(((100% + var(--app-gutter)) / 1) - var(--app-gutter)) !important;
      }
    }

    .v-page-en__section__content--sticky__coll {
      @media (max-width: 900px) {
        width: calc(((100% + var(--app-gutter)) / 5 * 2) - var(--app-gutter)) !important;
      }
      @media (max-width: 700px) {
        width: 100% !important;
      }
    }

    .v-page-en__section__content--sticky__coll__text-sticky {
      position: sticky;
      top: calc(var(--app-nav__height) * 2);
    }

    .v-page-en__section__content--sticky__coll__element-sticky {
      position: sticky;
      top: var(--app-nav__height);

      > img {
        display: block;
        width: calc(100% + var(--app-gutter));
        height: auto;
        object-fit: cover;
        object-position: bottom;

        @media (max-width: 900px) {
          width: calc(100vw / 5 * 2);
        }

        @media (max-width: 700px) {
          margin-left: calc(-1 * var(--app-gutter));
          margin-right: calc(-1 * var(--app-gutter));
          height: 75vh;
          margin-bottom: -2rem;
          width: calc(100% + var(--app-gutter) * 2);
        }
      }
    }
  }

  &.v-page-en__section__content--list-with-img {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    row-gap: 2rem;
    column-gap: 2rem;
    margin-top: 2rem;

    .v-page-en__section__content--list-with-img__item {
      box-sizing: border-box;
      width: calc(50% - 1rem);
        align-items: flex-start;
      display: flex;
        flex-direction: column;

        @media (max-width: 900px) {
            width: 100%;
            align-items: center;
        }
    }

    .v-page-en__section__content--list-with-img__item__img {
      display: block;
      width: 4rem;
      height: 4rem;
      flex-shrink: 0;
        padding-bottom: .5rem;
        padding-left: .5rem;

        @media (max-width: 900px) {
            width: 5rem;
            height: 5rem;
            padding-bottom: 0;
            padding-left: 0;
        }
    }

    .v-page-en__section__content--list-with-img__item__text {
      width: 100%;
      flex-shrink: 1;
      box-sizing: border-box;
      padding-left: .5rem;
      font-size: .55rem;
      line-height: 1.25em;
        @media (max-width: 900px) {
            margin-top: 1rem;
        }
    }

    .v-page-en__section__content--list-with-img__item__text__title {
        margin-bottom: .5rem;
        font-size: .65rem;
    }
    .v-page-en__section__content--list-with-img__item__text__content {
      color: var(--app-color-main);
    }
  }
}


.v-page-en__section__title {
  display: flex;
  flex-direction: column;
  align-items: center;

  > * {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

    h3 {
        text-align: center;
        margin-bottom: 0;
        line-height: 1.25em;

    }
    h2 + h3 {
        margin-top: 0;
    }
}

.v-page-en__grid {
  display: flex;
  flex-wrap: nowrap;

  &.v-page-en__grid--with-gutter {
    gap: var(--app-gutter);
  }

  &.v-page-en__grid--wrap {
    flex-wrap: wrap;
  }

  &.v-page-en__grid--centred {
    justify-content: center;
  }
}

[class*="v-page-en__grid__coll"] {
  > *:first-child {
    margin-top: 0 !important;
  }

  > *:last-child {
    margin-top: 0 !important;
  }
}

.v-page-en__grid__coll-full {
  width: 100%;
}

.v-page-en__grid__coll-1-2 {
  width: 50%;

  .v-page-en__grid--with-gutter & {
    width: calc(((100% + var(--app-gutter)) / 2) - var(--app-gutter));
  }

  @media (max-width: 900px) {
    width: 75%;

    .v-page-en__grid--with-gutter & {
      width: calc(((100% + var(--app-gutter)) / 3) - var(--app-gutter));
    }
  }

  @media (max-width: 700px) {
    width: 100%;

    .v-page-en__grid--with-gutter & {
      width: 100%;
    }
  }
}

.v-page-en__grid__coll-1-4 {
  width: 25%;

  .v-page-en__grid--with-gutter & {
    width: calc(((100% + var(--app-gutter)) / 4) - var(--app-gutter));
  }

  @media (max-width: 1200px) {
    width: calc(100% / 3);

    .v-page-en__grid--with-gutter & {
      width: calc(((100% + var(--app-gutter)) / 3) - var(--app-gutter));
    }
  }

  @media (max-width: 900px) {
    width: 50%;

    .v-page-en__grid--with-gutter & {
      width: calc(((100% + var(--app-gutter)) / 2) - var(--app-gutter));
    }
  }

  @media (max-width: 700px) {
    width: 100%;

    .v-page-en__grid--with-gutter & {
      width: 100%;
    }
  }
}

.v-page-en__grid__coll-1-3 {
  width: calc(100% / 3);

  .v-page-en__grid--with-gutter & {
    width: calc(((100% + var(--app-gutter)) / 3) - var(--app-gutter));
  }

  @media (max-width: 900px) {
    width: 50%;

    .v-page-en__grid--with-gutter & {
      width: calc(((100% + var(--app-gutter)) / 2) - var(--app-gutter));
    }
  }


  @media (max-width: 700px) {
    width: 100%;

    .v-page-en__grid--with-gutter & {
      width: 100%;
    }
  }
}

.v-page-en__grid__coll-3-4 {
  width: 75%;

  .v-page-en__grid--with-gutter & {
    width: calc(((100% + var(--app-gutter)) / 4 * 3) - var(--app-gutter));
  }

  @media (max-width: 1200px) {
    width: 100%;

    .v-page-en__grid--with-gutter & {
      width: 100%;
    }
  }
}

.v-page-en__content {
  background: var(--app-color-grey);
  position: relative;
  z-index: 10;
  width: 100%;

  @media (max-width: 900px) {
    > section:first-child {
      padding-top: 0;
    }
  }
}

.v-page-en__footer {
  background: white;
  position: relative;
  z-index: 10;
}

.v-page-en__bottom-image {
  display: block;
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 10;
  object-fit: cover;
}


.v-page-en__bottom {
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

.v-page-en__bottom__mailto {
  margin: auto;
  text-align: center;
  width: 100%;
  max-width: none;
  padding-bottom: 1.5rem;
  transition: opacity 1s ease-in-out;
  opacity: 0;

  &.with-opacity-1 {
    opacity: 1;
  }

  > a {
    color: var(--app-color-main);
    display: block;
    text-decoration: none;
  }
}


.app-schema_animation {
  > img {
    display: block;
    height: auto;
    position: absolute;
    z-index: 1;


    &:not(.not-animated) {
      transform-origin: center center;
      transition: opacity 0s cubic-bezier(.25, 0, .75, 0), transform 0s cubic-bezier(0, 0, 1, 1);
      transition-duration: .25s;
      transition-delay: .25s;
      opacity: 0;
      transform: translate(0, 10%) scale(.75) rotate(5deg);
    }

    &.is-circle {
      transition: opacity 0s cubic-bezier(.25, 0, .75, 0), transform 0s cubic-bezier(0, 0, 1, 1);
      transition-duration: .25s;
      opacity: 0;
      transform: translate(0, 0) scale(.85) rotate(0);
      transition-delay: .5s !important;
    }
  }

  &.is-active > img {
    opacity: 1;

    &:not(.not-animated) {
      transition-duration: .75s;

      $increment: 0.05s;
      @for $i from 1 through 20 {
        &:nth-child(#{$i}n) {
          transition-delay: #{($i - 1) * $increment};
        }
      }
    }

    &.is-circle {
      transition-duration: .5s;
    }

    transform: translate(0, 0) scale(1) rotate(0);
  }
}

.app-schema_1 {
  max-width: 25rem;
  margin: auto;

  > img {
    display: block;
    height: auto;
    position: absolute;
    z-index: 1;
  }

  .app-schema_1_0 {
    width: 100%;
    position: relative;
    opacity: 0 !important;
    pointer-events: none;
    z-index: -1;
  }

  .app-schema_1_1 {
    top: 92.4%;
    left: 75.1%;
    width: 22.1%;
  }

  .app-schema_1_2 {
    top: 8.3%;
    left: 3.9%;
    width: 8.7%;
  }

  .app-schema_1_3 {
    top: 1.3%;
    left: 57.5%;
    width: 23.3%;
  }

  .app-schema_1_4 {
    top: 33.3%;
    left: 74.5%;
    width: 25.4%;
  }

  .app-schema_1_5 {
    top: 54%;
    left: 62.5%;
    width: 23%;
  }

  .app-schema_1_6 {
    top: 65.3%;
    left: 34.5%;
    width: 25.8%;
  }

  .app-schema_1_7 {
    top: 62.4%;
    left: 0;
    width: 28.3%;
  }

  .app-schema_1_8 {
    top: 21.4%;
    left: 1%;
    width: 23%;
  }

  .app-schema_1_9 {
    top: 0;
    left: 23%;
    width: 23%;
  }

  .app-schema_1_10 {
    z-index: 0;
    top: 8%;
    left: 16%;
    width: 61.7%;
  }

  .app-schema_1_11 {
    z-index: 0;
    top: 41.8%;
    left: 29.5%;
    width: 35%;
  }
}


.app-schema_2 {
  max-width: 25rem;
  margin: auto;
  margin-top: 2rem;

  > img {
    display: block;
    height: auto;
    position: absolute;
    z-index: 1;
  }

  .app-schema_2_0 {
    width: 100%;
    position: relative;
    opacity: 0 !important;
    pointer-events: none;
    z-index: -1;
  }

  .app-schema_2_1 {
    top: 67.5%;
    left: 76.5%;
    width: 23.5%;
  }

  .app-schema_2_2 {
    top: 66.8%;
    left: 24.2%;
    width: 25%;
  }

  .app-schema_2_3 {
    top: 14.8%;
    left: 0.1%;
    width: 35%;
  }

  .app-schema_2_4 {
    top: 0.8%;
    left: 67.5%;
    width: 29.8%;
  }

  .app-schema_2_5 {
    top: 45.4%;
    left: 37.4%;
    width: 36.7%;
  }

  .app-schema_2_6 {
    z-index: 0;
    top: 9.8%;
    left: 23.5%;
    width: 64.4%;
  }

}

</style>

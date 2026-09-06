<template>
    <template v-if="headerCover || headerText">
      <template v-if="useRoute().path === '/'">
        <app-header-home
          :text="headerText"
          :bg-image="headerCover"
        />
      </template>
      <template v-else>
        <app-header-list
                :text="headerText"
                :bg-image="headerCover"
                :bg_focus="header_focus"
        />
      </template>
    </template>
    <template v-else>
        <div class="v-app-page__header__loading">

        </div>
    </template>
    <main class="v-app-page" :class="{ 'v-app-page--home': useRoute().path === '/' }">
      <div class="v-app-page__path"
            v-if="path"
      >
          <div class="v-app-page__path__content app-font-small">
              <nuxt-link href="/">Home</nuxt-link> / <nuxt-link href="/projects/">Les Projets Modus</nuxt-link> <span class="v-app-page__path__content__title">/ {{headerText?.split(' ').slice(0, 8).join(' ')}}…</span>
              <div style="padding-top: .5rem; display: flex; justify-content: space-between; flex-direction: row; gap: 1rem; flex-wrap: wrap"
                    v-if="status"
              >
                <div class="v-app-page__status-button"
                      style="
                        font-weight: 600;
                        font-size: .75rem;
                        border: solid 2px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: .5rem;
                        border-radius: 2rem;
                        padding: .015rem .5rem .025rem;
                        min-width: 3rem;
                        text-align: center;
                        "
                >{{status}}</div>
              </div>
          </div>
      </div>

      <div class="v-app-page__content">
        <slot v-if="$slots.default" />
        <template v-else>
        <template v-if="bodyContent">

          <template v-for="(segment, segIdx) of bodyContentSegments" :key="segIdx">

            <!-- Breakout: full-width blocks rendered outside the grid -->
            <template v-if="segment.type === 'breakout'">
              <div class="v-app-page__breakout" v-if="segment.item.content.type === 'internalLink'">
                <app-internal-link
                  :src="segment.item.image[0].url"
                  :title="segment.item.content.content.linktitle"
                  :description="segment.item.content.content.text"
                  :href="segment.item.content.content.link"
                  :style-design="segment.item.content.content.style"
                  :is-full="true"
                />
              </div>
              <div class="v-app-page__breakout" v-else-if="segment.item.content.type === 'internalLinks'">
                <app-internal-links
                  :src="segment.item.image[0]?.url"
                  :title="segment.item.content.content.sectiontitle"
                  :subtitle="segment.item.content.content.sectionsubtitle"
                  :cards="segment.item.content.content.cards"
                />
              </div>
              <div class="v-app-page__breakout" v-else-if="segment.item.content.type === 'highlights'">
                <app-highlights
                  :title="segment.item.content.content.highlightstitle"
                  :subtitle="segment.item.content.content.highlightssubtitle"
                  :items="segment.item.highlightsItems || []"
                />
              </div>
              <div class="v-app-page__breakout" v-else-if="segment.item.content.type === 'profiles'">
                <app-profiles
                  :profiles-data="segment.item.content.content"
                  :profiles-images-data="segment.item.profilesImages"
                />
              </div>
            </template>

            <!-- Grid segment: regular content inside the 2-column grid -->
            <template v-else>
              <div class="v-app-page__content__grid">

                <template v-if="segIdx === 0 && titleContent">
                  <div class="v-app-page__section v-app-page__section--full">
                    <h1>{{titleContent}}</h1>
                  </div>
                </template>

                <template v-for="bodyContentItem of segment.items">

                  <template v-if="bodyContentItem.content.type === 'mdheading'">
                    <template v-if="bodyContentItem.content.content.level === 'h2'">
                      <div class="v-app-page__section v-app-page__section--full">
                        <h2 v-html="bodyContentItem.content.content.text" />
                      </div>
                    </template>
                    <template v-else-if="bodyContentItem.content.content.level === 'h3'">
                      <div class="v-app-page__section v-app-page__section--full">
                        <h3 v-html="bodyContentItem.content.content.text" />
                      </div>
                    </template>
                  </template>

                  <template v-else-if="bodyContentItem.content.type === 'mdimage'">
                    <div class="v-app-page__section v-app-page__section--full">
                      <div class="v-app-page__section__img">
                        <img class="v-app-page__section__img__item"
                             :alt="bodyContentItem.image[0].alt || 'Pas de description pour cette image'"
                             :src="bodyContentItem.image[0].resize.large"
                        />
                        <div class="v-app-page__section__img__caption"
                             v-if="bodyContentItem.image[0].caption"
                        >{{bodyContentItem.image[0].caption}}</div>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="bodyContentItem.content.type === 'simpleText'">
                    <div class="v-app-page__section">
                      <app-text-content
                        :text="bodyContentItem.content.content.text"
                        variant="yellow-block"
                      />
                    </div>
                  </template>

                  <template v-else-if="bodyContentItem.content.type === 'body'">
                    <div class="v-app-page__section v-app-page__section--body v-app-page__section--full">
                      <div :style="{ textAlign: bodyContentItem.content.content.alignment || 'left' }" v-html="addIdsToH2(bodyContentItem.content.content.text)"/>
                    </div>
                  </template>

                  <!-- Non-full-width internalLink stays in the grid -->
                  <template v-else-if="bodyContentItem.content.type === 'internalLink'">
                    <div class="v-app-page__section">
                      <app-internal-link
                        :src="bodyContentItem.image[0].resize.reg"
                        :title="bodyContentItem.content.content.linktitle"
                        :description="bodyContentItem.content.content.text"
                        :href="bodyContentItem.content.content.link"
                        :style-design="bodyContentItem.content.content.style"
                        :is-full="false"
                      />
                    </div>
                  </template>

                  <template v-else-if="bodyContentItem.content.type === 'video'">
                    <div class="v-app-page__section v-app-page__section--full" style="max-width: 60rem">
                      <app-video
                              :video_embed_url="videoPlatformUrlFormat(bodyContentItem.content.content.url)?.src || null"
                              :video_caption="bodyContentItem.content.content.caption"
                      />
                    </div>
                  </template>

                  <template v-else-if="bodyContentItem.content.type === 'spotify'">
                    <div class="v-app-page__section v-app-page__section--full" style="max-width: 60rem">
                      <app-spotify
                              :podcast_link="bodyContentItem.content.content.url"
                              :podcast_caption="bodyContentItem.content.content.caption"
                              :spotify-data="bodyContentItem.content"
                      />
                    </div>
                  </template>

                  <template v-else-if="bodyContentItem.content.type === 'listPoints'">
                    <div class="v-app-page__section">
                      <app-list-points
                              :title="bodyContentItem.content.content.titlecontent"
                              :content="bodyContentItem.content.content.text"
                      />
                    </div>
                  </template>

                  <template v-else-if="bodyContentItem.content.type === 'actuality'">
                    <div class="v-app-page__section v-app-page__section--full">
                      <app-actuality
                              :title="bodyContentItem.content.content.linktitle"
                              :url="bodyContentItem.content.content.link"
                              :description="bodyContentItem.content.content.text"
                              :src="bodyContentItem.image[0]"
                      />
                    </div>
                  </template>

                  <template v-else-if="bodyContentItem.content.type === 'linksSection'">
                    <div class="v-app-page__section v-app-page__section--full">
                      <app-link-section
                              :title="bodyContentItem.content.content.title"
                              :links="bodyContentItem.content.content.links"
                      />
                    </div>
                  </template>

                  <template v-else-if="bodyContentItem.content.type === 'dropdown'">
                    <div class="v-app-page__section v-app-page__section--full">
                      <app-drop-down
                              :title="bodyContentItem.content.content.title"
                              :dropdown_content="bodyContentItem.content.content.dropdown_content"
                              :dropdown_intro="bodyContentItem.content.content.dropdown_intro"
                      />
                    </div>
                  </template>

                  <template v-else-if="bodyContentItem.content.type === 'navigateProjectsByTags'">
                    <div class="v-app-page__section v-app-page__section--full">
                      <app-navigate-projects-by-tags
                              :title="bodyContentItem.content.content.title"
                      />
                    </div>
                  </template>

                </template>
              </div>
            </template>

          </template>

        </template>

        <template v-else>
          <div class="v-app-page__content__grid">
            chargement du contenu…
          </div>
        </template>


        <template v-if="power_subpages && power_subpages[0]">
          <div class="v-app-page__content__grid">
            <div v-for="subpage of power_subpages"
                 class="v-app-page__section v-app-page__section--full"
            >
              <AppPowerBISubSection
                      :url="subpage.url"
              />
            </div>
          </div>


          <div class="v-app-page__content__grid">
            <div class="v-app-page__section v-app-page__section--full v-app-page__section--power-bi">
              <nuxt-link class="app-button app-button--var-white v-app-page__subpage-button"
                         :href="`${parentSlug}/${power_subpages[0].slug}`"
              >
                <div>Tous les chiffres →</div>
                <svg width="106" height="83" viewBox="0 0 106 83" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="13.959" y="43.1216" width="19.1892" height="39.3784" fill="#009E3D" stroke="white"/>
                  <rect x="43.1211" y="0.5" width="19.1892" height="82" fill="#009E3D" stroke="white"/>
                  <rect x="72.2832" y="20.6892" width="19.1892" height="61.8108" fill="#009E3D" stroke="white"/>
                  <line x1="-8.37027e-08" y1="82" x2="105.432" y2="82" stroke="#009E3D" stroke-width="2"/>
                </svg>
                </nuxt-link>
            </div>
          </div>
        </template>
        </template>
      </div>
    </main>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'
import {
    IApiBody,
    IApiPage__subpage
} from "~/composable/adminApi/apiDefinitions";
import AppProfiles from "~/components/AppProfiles.vue";
import AppListPoints from "~/components/AppListPoints.vue";
import {addIdsToH2} from "~/utils/addIdsToH2";
import {copyCurrentUrlToClipboard} from "~/utils/copyCurrentUrlToClipboard";
import AppDropDown from "~/components/AppDropDown.vue";
import {ApiFetchPage_powerBiSubPage} from "~/composable/adminApi/apiFetch";
import {videoPlatformUrlFormat} from "~/composable/videoPlatformUrlFormat";

const props = defineProps<{
  headerText?: string
  headerCover?: string
  header_focus?: string
  bodyContent?: IApiBody
  headerSize?: 'small'
  headerType?: 'default' | 'list'
  titleContent?: string
  path?: boolean
  date_start?: string,
  is_project_with_duration?: "true" | "false",
  date_end?: string,
  project_status?: string,
  power_subpages?: IApiPage__subpage[]
}>()

const parentSlug = useRoute().path

function isBreakoutItem(item: any): boolean {
    return (item.content.type === 'internalLink' && item.content.content.width === 'true')
        || item.content.type === 'internalLinks'
        || item.content.type === 'highlights'
        || item.content.type === 'profiles'
}

type BodyContentSegment =
    | { type: 'grid', items: any[] }
    | { type: 'breakout', item: any }

const bodyContentSegments = computed<BodyContentSegment[]>(() => {
    if (!props.bodyContent) return []
    const segments: BodyContentSegment[] = []
    let currentGridItems: any[] = []

    for (const bodyContentItem of Object.values(props.bodyContent)) {
        if (isBreakoutItem(bodyContentItem)) {
            if (currentGridItems.length) {
                segments.push({ type: 'grid', items: [...currentGridItems] })
                currentGridItems = []
            }
            segments.push({ type: 'breakout', item: bodyContentItem })
        } else {
            currentGridItems.push(bodyContentItem)
        }
    }
    if (currentGridItems.length) {
        segments.push({ type: 'grid', items: currentGridItems })
    }
    return segments
})

const status: ComputedRef<null | 'En cours' | 'Terminé'> = computed(() => {
    if(props.is_project_with_duration === 'false') {
        return props.project_status === 'en-cours' ? 'En cours' : 'Terminé'
    }

    if( props.date_end === undefined ) return 'En cours'

    return new Date(props.date_end).getTime() < new Date().getTime() ? 'Terminé' : 'En cours'
})

const statusColor: ComputedRef< 'var(--app-color-orange)' | 'var(--app-color-main--dark)'> = computed(() => {
    return status.value ===  'En cours' ? 'var(--app-color-orange)' : 'var(--app-color-main--dark)'
})




// onMounted(async () => {
//
//     if(props.bower_subpage && props.bower_subpage[0]) {
//
//         const bower_subpage = props.bower_subpage[0]
//
//         console.log( await ApiFetchPage_powerBiSubPage(`${bower_subpage.content.power_bi_pages_title}`) )
//     }
//
// })

</script>





<style lang="scss" scoped >
.v-app-page {
  padding-top:0;

  &.v-app-page--home {
    background: var(--app-color-grey);
  }
}

.v-app-page__header {
  background: white;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--app-header-height);
  position: fixed;

  @media (max-width: 900px) {
    height: calc( var(--app-header-height) );
  }

  .v-app-page--header-small & {
    height: auto;
    position: relative;
  }
}

.v-app-page__header__loading {
    background: var(--app-color-white);
    width: 100%;
    height: 100%;
}

.v-app-page__content {
  background: transparent;
  position: relative;
  z-index: 10;
  width: 100%;
}

.v-app-page__breakout {
  width: 100%;
  box-sizing: border-box;
}

.v-app-page__path {
    font-weight: 600;
    position: sticky;
    top: var(--app-nav__height);
    z-index: 100;
    box-sizing: border-box;
    width: 100%;
    background: var(--app-color-white);
    padding-bottom: 0.5rem;
}


.v-app-page__path__content {
    box-sizing: border-box;
    padding-left: var(--app-gutter);
    padding-right: var(--app-gutter);
    margin: auto;
    max-width: 1300px;
}

.v-app-page__path__content__title {
    @media (max-width: 900px) {
        display: none;
    }
}

.v-app-page__content__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  box-sizing: border-box;
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
  column-gap: 2rem;
  row-gap: 4rem;
  padding-top: 4rem;
  padding-bottom: 4rem;
  padding-left: var(--app-gutter);
  padding-right: var(--app-gutter);
    @media (max-width: 900px) {
      row-gap: 2rem;
    }
}

.v-app-page__section__img {
    width: 100%;
}

.v-app-page__section__img__item {
    display: block;
    width: 100%;
    max-height: 80vh;
    margin: auto;
    object-fit: contain;
}

.v-app-page__section {
  box-sizing: border-box;
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  width: 100%;

  @media (max-width: 900px) {
    grid-column: span 2;
  }

  &.v-app-page__section--body {
    &:deep(*) {
      text-align: inherit;
    }

    &:deep(h2 a) {
      opacity: .5;
      text-decoration: none;
      position: relative;
      display: inline-block;

      &:hover {
        opacity: 1;
      }
    }

    &:deep(ul),
    &:deep(ol) {
      box-sizing: border-box;
      max-width: 60rem;
      margin-left: auto;
      margin-right: auto;
    }
  }

  &.v-app-page__section--full {
    grid-column: span 2;
  }

  &.v-app-page__section--no-padding {
    padding-top: 0;
    padding-bottom: 0;
  }

  &.v-app-page__section--no-margin {
    padding-left: 0;
    padding-right: 0;
  }

  &.v-app-page__section--intro {
    box-sizing: content-box;
    position: relative;

    p:nth-child(1n + 1) {
      color: var(--app-color-main);
    }

    p:nth-child(2n + 1) {
      color: var(--app-color-main--dark);
    }
  }

  &.v-app-page__section--power-bi {
    padding-bottom: 10rem;
  }

  .v-app-page__section__graphic-items {
    position: absolute;

    @media (max-width: 900px) {
      display: none;
    }
  }

  .v-app-page__section__graphic-items--m {
    top: 0;
    left: 0;
    transform: translate(-100%, 0%);
    height: 16vw;
    max-height: 298px;
  }

  .v-app-page__section__graphic-items--o {
    bottom: 0;
    left: 0;
    transform: translate(-100%, 0%);
    height: 8vw;
    max-height: 148px;
  }

  .v-app-page__section__graphic-items--du {
    top: 0;
    right: 0;
    transform: translate(90%, -10%);
    height: 20vw;
    max-height: 372px;
  }

  .v-app-page__section__graphic-items--s {
    bottom: 0;
    right: 0;
    transform: translate(100%, 0%);
    height: 12vw;
    max-height: 224px;
  }
}

.v-app-page__status-button {
  color: white;
  background-color: v-bind(statusColor);
  border-color: v-bind(statusColor) !important;
}

.v-app-page__subpage-button {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  font-size: 2rem;
  box-sizing: border-box;
  padding: 1.5rem 1rem;

  > svg {
    height: 3rem;
  }
}
</style>

<style lang="scss">
.v-app-page {
    h1 {
        margin-bottom: 0;
    }

    h2, h3 {
        color: var(--app-color-black);
        text-align: center;
    }

    h4, p {
        color: black;
    }

}
</style>

<template>
    <section class="v-app-profiles child-remove-margin">
      <h3 v-if="profilesData" class="v-app-profiles__title">{{ profilesData.title }}</h3>

      <div class="v-app-profiles__grid">
        <template v-for="(profileImageItem, index) of profilesImagesData" :key="profileImageItem.content.id || index">
          <article class="v-app-profiles__card"
                   :class="{ 'v-app-profiles__card--flipped': flippedCards[index] }"
          >
            <!-- FRONT -->
            <div class="v-app-profiles__card__front">
              <div class="v-app-profiles__card__header">
                <template v-if="profileImageItem.image.length > 0">
                  <img class="v-app-profiles__card__img"
                       :src="profileImageItem.image[0].resize.large"
                       alt="profile"
                  />
                </template>
                <div class="v-app-profiles__card__img v-app-profiles__card__img--placeholder" v-else />
                <a v-if="profileImageItem.content.link"
                    class="v-app-profiles__card__linkedin v-app-profiles__card__linkedin--front"
                    :href="profileImageItem.content.link"
                    target="_blank"
                    rel="noopener"
                    @click.stop
                >
                  <svg height="72" viewBox="0 0 72 72" width="72" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fill-rule="evenodd">
                      <path d="M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z"
                            style="fill: var(--app-color-main)"/>
                      <path d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z"
                            fill="#FFF"/>
                    </g>
                  </svg>
                </a>
              </div>
              <div class="v-app-profiles__card__body">
                <div class="v-app-profiles__card__actions">
                  <button v-if="profileImageItem.content.profiledescription"
                          class="app-button app-button--small v-app-profiles__card__btn v-app-profiles__card__btn--plus"
                          @click.stop="toggleFlip(index)"
                  >
                    <span class="v-app-profiles__card__btn-text">+</span>
                  </button>
                </div>
                <div class="v-app-profiles__card__info">
                  <div class="v-app-profiles__card__name">{{ profileImageItem.content.name }}</div>
                  <div class="v-app-profiles__card__role">{{ profileImageItem.content.description }}</div>
                </div>
              </div>
            </div>

            <!-- BACK -->
            <div class="v-app-profiles__card__back" v-if="profileImageItem.content.profiledescription">
              <div class="v-app-profiles__card__body">
                <div class="v-app-profiles__card__actions">
                  <button class="app-button app-button--small v-app-profiles__card__btn v-app-profiles__card__btn--plus"
                          @click.stop="toggleFlip(index)"
                  >
                    <span class="v-app-profiles__card__btn-text">−</span>
                  </button>
                  <div class="v-app-profiles__card__actions-right">
                    <a v-if="profileImageItem.content.link"
                       class="v-app-profiles__card__linkedin"
                       :href="profileImageItem.content.link"
                       target="_blank"
                       rel="noopener"
                       @click.stop
                    >
                      <svg height="72" viewBox="0 0 72 72" width="72" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fill-rule="evenodd">
                          <path d="M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z"
                                style="fill: var(--app-color-main)"/>
                          <path d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z"
                                fill="#FFF"/>
                        </g>
                      </svg>
                    </a>
                  </div>
                </div>
                <div class="v-app-profiles__card__description_wrapper">
                <div class="v-app-profiles__card__description">{{ profileImageItem.content.profiledescription }}</div>
                </div>
              </div>
            </div>
          </article>
        </template>
      </div>
    </section>
</template>


<script setup lang="ts">
import {IApiProfiles, IApiProfilesImages} from "~/composable/adminApi/apiDefinitions";

const props = defineProps<{
    profilesData?: IApiProfiles
    profilesImagesData?: IApiProfilesImages[]
}>()

const flippedCards = ref<Record<number, boolean>>({})

function toggleFlip(index: number) {
    flippedCards.value[index] = !flippedCards.value[index]
}
</script>


<style lang="scss" scoped>
.v-app-profiles {
  box-sizing: border-box;
  width: 100%;
}

.v-app-profiles__title {
  text-align: left;
  color: var(--app-color-main--dark);
  margin-bottom: 0;
  padding: 2rem var(--app-base-padding-x);
  box-sizing: border-box;
  font-size: 1.8rem;

  @media (max-width: 900px) {
    font-size: 1.5rem;
  }
}

// Grid — same pattern as AppProjectList
.v-app-profiles__grid {
  --grid-gap: 1.11111111111rem;
  --item-per-row: 1;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: repeat(var(--item-per-row), 1fr);
  width: 100%;
  gap: var(--grid-gap);
  padding: 3rem var(--app-base-padding-x);
  background: var(--app-color-grey);

  @media (min-width: 841px) {
    --item-per-row: 2;
  }

  @media (min-width: 1341px) {
    --item-per-row: 3;
  }

  @media (min-width: 1641px) {
    --item-per-row: 4;
  }

  @media (min-width: 1921px) {
    grid-template-columns: repeat(auto-fit, minmax(26rem, 1fr));
  }
}

// Card — same structure as AppItemCard
.v-app-profiles__card {
  --card-bg: var(--app-color-white);
  --card-text: var(--app-color-black);

  color: var(--card-text);
  box-sizing: border-box;
  width: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.v-app-profiles__card--flipped .v-app-profiles__card__front {
  transform: rotateY(180deg);
}
.v-app-profiles__card--flipped .v-app-profiles__card__back {
  transform: rotateY(0deg);
}

.v-app-profiles__card__front,
.v-app-profiles__card__back {
  display: flex;
  flex-direction: column;
  transition: transform 0.5s;
  background: var(--card-bg);
  backface-visibility: hidden;
  border-radius: 1.66666666667rem;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.v-app-profiles__card__front {
  position: relative;
}

.v-app-profiles__card__back {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
  z-index: 2;
}

// Header / image
.v-app-profiles__card__header {
  position: relative;
  width: 100%;
}

.v-app-profiles__card__img {
  display: block;
  width: 100%;
  background-color: var(--app-color-grey--dark);
  object-fit: cover;
  object-position: top;
  aspect-ratio: 320/360;
}

.v-app-profiles__card__img--placeholder {
  background: var(--app-color-grey--dark);
}

// Body
.v-app-profiles__card__body {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 11.6666666667rem;
}

.v-app-profiles__card__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.11111111111rem 1.66666666667rem;
  column-gap: 0.77777777777rem;
}

.v-app-profiles__card__actions-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  column-gap: 0.77777777777rem;
  margin-left: auto;
}

.v-app-profiles__card__btn {
  font-size: 1.11111111111rem;
  text-transform: lowercase;
  border-color: var(--card-text);
  background-color: transparent;
  color: var(--card-text);
  padding: 0 .83333333333rem;
  display: inline-flex;
  align-items: center;
  height: 3.05555555556rem;
}

.v-app-profiles__card__btn--plus {
  font-size: 2rem;
}

.v-app-profiles__card__btn:hover {
  background-color: var(--card-text);
  color: var(--card-bg);
}

.v-app-profiles__card__linkedin {
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;

  svg {
    height: 2.4375rem;
    width: auto;
    display: block;
  }

  &--front{
    position:absolute;
    top: 1.11111111111rem;
    right: 1.66666666667rem;
  }
}

// Info section (name + role)
.v-app-profiles__card__info {
  padding: 0 1.66666666667rem 1.66666666667rem 1.66666666667rem;
  margin: auto 0 0 0;
}

.v-app-profiles__card__name {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--card-text);

  @media (max-width: 900px) {
    font-size: 1.4rem;
  }
}

.v-app-profiles__card__role {
  font-size: 1.11111111111rem;
  color: var(--app-color-main);
  margin-top: 0.25rem;
  line-height: 1.1;

  @media (max-width: 900px) {
    font-size: 1rem;
  }
}

// Back — description
.v-app-profiles__card__description_wrapper {
  box-sizing: border-box;
  padding: 0 1.66666666667rem 1.66666666667rem 1.66666666667rem;
  margin: auto 0 0 0;
}
.v-app-profiles__card__description {
  box-sizing: border-box;
  font-size: 1.1rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 20;
  line-height: 1.25;
  @media (max-width: 900px) {
    font-size: 1rem;
  }
}
</style>

<template>
    <section class="v-app-project-media"
             @click="projectMediaClicked"
             :class="firstMediaInBodyBlocks?.type"
    >
      <img class="v-app-project-media__cover"
           :src="projectMediaData.headerImage[0].resize.reg"
           :style="{
                        objectPosition: projectMediaData.headerImage[0].focus,
                    }"
      />
        <div class="v-app-project-media__header">
          <div class="v-app-project-media__header__title app-font-h1">
            {{projectMediaData.content.title}}
          </div>

          <div class="v-app-project-media__header__headerTitle app-font-h4">
            {{projectMediaData.content.headertitle}}
          </div>
        </div>

<!--      <div class="v-app-project-media__date"-->
<!--      >{{formatDateRange(projectMediaData.content.datestart, projectMediaData.content.dateend)}}</div>-->

      <div class="v-app-project-media__details"
           v-if="firstMediaInBodyBlocks"
      >
        <div class="app-font-small">{{firstMediaInBodyBlocks.content.credits}}</div>
        <div class="app-font-small" v-if="firstMediaInBodyBlocks.content.date">publié le {{formatDate( firstMediaInBodyBlocks.content.date )}}</div>
      </div>

      <div class="v-app-project-media__player-wrap"
           v-if="firstMediaInBodyBlocks"
           @click.stop="useRouter().push({
            query: {
                target: 'media'
            },
            path: `/project/${props.projectMediaData.slug}`,

           })"
      >
        <template v-if="firstMediaInBodyBlocks.type === 'spotify'">
          <div class="v-app-project-media__player-wrap__title app-font-small"
          >
            accéder au podcast
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="white"
               class="v-app-project-media__player-wrap__payer"
          >
            <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
          </svg>
        </template>

        <template v-else-if="firstMediaInBodyBlocks.type === 'video'">
          <div class="v-app-project-media__player-wrap__title app-font-small"
          >
            accéder à la vidéo
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="white"
               class="v-app-project-media__player-wrap__payer"
          >
            <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
          </svg>
        </template>
      </div>

    </section>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'
import {IApiSingleProject} from "~/composable/adminApi/apiDefinitions";
import {formatDateRange} from "~/utils/formatDateRange";
import {formatDate} from "../utils/formatDate";

const props = defineProps<{
    projectMediaData: IApiSingleProject
}>()

const firstMediaInBodyBlocks = computed(() => findMediaInProject(props.projectMediaData.content.body))

function projectMediaClicked() {
    useRouter().push(`/project/${props.projectMediaData.slug}`)
}
</script>





<style lang="scss" scoped >
.v-app-project-media {
  --v-app-project-media__padin-top: 3rem;

  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  cursor: pointer;
  background: var(--app-color-main--dark);
  box-sizing: border-box;
  padding: var(--v-app-project-media__padin-top) 0 13rem;
  min-height: 20rem;
  user-select: none;

  &.video {
    background: var(--app-color-yellow);
  }
}

.v-app-project-media__cover {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  object-fit: cover;

  transition: all .5s ease-in-out;
  transform: scale(1);
  opacity: 0;
  mix-blend-mode: color-dodge;
  filter: brightness(0.6) contrast(2);

  .v-app-project-media:hover & {
    //transform: scale(1.1);
    opacity: 1;
  }
}

.v-app-project-media__header {
  box-sizing: border-box;
  overflow: hidden;
}

.v-app-project-media__header__title {
  position: relative;
  box-sizing: border-box;
  padding: 0 var(--app-gutter);
  width: 100%;
  color: white;
  transform-origin: bottom;
  transition: all .15s .15s linear;
  opacity: 1;
  transform: scale(1);

  .v-app-project-media.video & {
    color: var(--app-color-main--dark);
  }

  .v-app-project-media:hover & {
    transition: all .25s 0s linear;
    opacity: 0;
    transform: scale(.95);
  }
}

.v-app-project-media__header__headerTitle {
  position: relative;
  box-sizing: border-box;
  padding: 0 var(--app-gutter);
  width: 100%;
  color: white;
  padding-top: 2rem;
  transform-origin: top;
  transition: all .15s .2s linear;
  opacity: 1;
  transform: scale(1);

  .v-app-project-media.video & {
    color: var(--app-color-main--dark);
  }

  .v-app-project-media:hover & {
    transition: all .25s 0s linear;
    opacity: 0;
    transform: scale(.95);
  }
}

//.v-app-project-media__date {
//  position: absolute;
//  top: 1rem;
//  left: 1rem;
//  background: var(--app-color-main);
//  border-radius: 1rem;
//  color: white;
//  padding: .25rem 1rem;
//  font-size: .75rem;
//
//}

.v-app-project-media__details {
  --v-app-project-media__gradient-height: 2rem;

  color: white;
  position: absolute;
  height: calc(100% / 3 );
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 2rem var(--app-gutter) 2rem;
  background: linear-gradient(to bottom, rgba(1, 96, 82, 0) var(--v-app-project-media__gradient-height), rgba(1, 96, 82, 1) var(--v-app-project-media__gradient-height));
  pointer-events: none;

  .v-app-project-media.video & {
    color: var(--app-color-main--dark);
  }

  transform-origin: top;
  transition: all .15s .25s linear;
  opacity: 1;
  transform: scale(1);

  .v-app-project-media.video & {
    background: linear-gradient(to bottom, rgba(223, 244, 61, 0) var(--v-app-project-media__gradient-height), rgba(223, 244, 61, 1) var(--v-app-project-media__gradient-height));
  }

  .v-app-project-media:hover & {
    transition: all .25s 0s linear;
    opacity: 0;
    transform: scale(.95);
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--v-app-project-media__gradient-height);
    background: linear-gradient(to bottom, rgba(1, 96, 82, 0), rgba(1, 96, 82, 1));

    .v-app-project-media.video & {
      background: linear-gradient(to bottom, rgba(223, 244, 61, 0), rgba(223, 244, 61, 1));
    }
  }

  > * {
    font-weight: 500;

  }
}

.v-app-project-media__player-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  padding: 1rem 1rem 2rem;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  transition: all .35s .2s ease-out;
  transform: scale(1);
  transform-origin: bottom right;
  //height: 5rem;

  &:hover {
    transition: all .25s 0s ease-in;
    transform: scale(1.25);
  }
}

.v-app-project-media__player-wrap__title {
  color: white;
  display: block;
  font-weight: 500;
  transform-origin: bottom right;

  .v-app-project-media.video & {
    color: var(--app-color-main--dark) !important;
  }

  transition: all .25s ease-out;
  opacity: 0;
  transform: scale(.85);


  .v-app-project-media:hover & {
    opacity: .25;
    transform: scale(1);
    transition: all .25s .15s ease-in;

  }
  .v-app-project-media.video:hover & {
    opacity: .75;
  }

  .v-app-project-media__player-wrap:hover & {
    opacity: 1;
    transform: scale(1) translate(-.5rem, 0);
    transition: all .35s 0s ease-in;
  }

}

.v-app-project-media__player-wrap__payer {
  display: block;
  height: 3rem;
  width:  3rem;
  transform-origin: bottom right;
  transition: all .35s .2s ease-out;
  opacity: 1;
  transform: scale(.66);

  .v-app-project-media:hover & {
    transition: all .25s 0s ease-in;
    transform: scale(1);
  }

  .v-app-project-media.video & {
    fill: var(--app-color-main--dark);
  }
}
</style>

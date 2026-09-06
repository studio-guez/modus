<template>
    <section class="v-app-spotify"
    >
      <div class="v-app-spotify__iframe-box" id="media-anchor">
        <iframe style="border-radius:12px"
                :src="`https://open.spotify.com/embed/episode/${podcastId}?utm_source=generator`"
                width="100%"
                height="152"
                frameBorder="0"
                allowfullscreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"/>
      </div>
      <div class="v-app-spotify__caption">
        {{podcast_caption}}
        <br>{{spotifyData.content.credits}}, publié le {{formatDate(spotifyData.content.date)}}
      </div>
    </section>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'
import {IApiBodyContent_spotify} from "~/composable/adminApi/apiDefinitions";
import {formatDate} from "../utils/formatDate";

const props = defineProps<{
    podcast_link: string,
    podcast_caption: string,
    spotifyData: IApiBodyContent_spotify
}>()

const podcastId: ComputedRef<string | null> = computed(() => {
    const match = props.podcast_link.match(/episode\/([a-zA-Z0-9]+)\?/);
    const episodeId = match ? match[1] : null;

    if (!episodeId) {
        console.error("Lien de partage invalide.")
    }

    return episodeId
})

onMounted(() => {
    nextTick(() => {
        if(useRoute().query.target === 'media') navigateToMediaFile()
    })
})


</script>





<style lang="scss" scoped >
.v-app-spotify__iframe-box {
  iframe {
    display: block;
    width: 100%;

  }
}

.v-app-spotify__caption {
  font-size: 1rem;
  line-height: 1.2em;
  margin-top: .2em;
  margin-bottom: 1.2em;
}
</style>

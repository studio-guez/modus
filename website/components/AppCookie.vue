<template>
    <section
        class="v-app-cookie"
    >
        <div>
          Le site <strong>modus-ge.ch</strong> utilise des vidéos YouTube. Cette plateforme utilise des cookies. Aucun autre cookie n’est utilisé sur le site de modus (préférences, de suivi, de géolocalisation, pour une publicité ciblée, etc.). En poursuivant la navigation sur ce site, vous acceptez l’utilisation des cookies tiers liés à la plateforme YouTube. Pour en savoir plus sur la politique de confidentialité du site <strong>modus-ge.ch</strong> consultez <nuxt-link href="/protection-des-donnees-personnelles" >CE DOCUMENT</nuxt-link>
        </div>
      <div style="display: flex; flex-direction: row; gap: 1rem">
        <div>
          <button style="font-weight: 500"
                  @click="showCookieBanner().value = false"
          >Refuser
          </button>
        </div>
        <div>
          <button
                  @click="cookieIsValidate().value = true"
          >Accepter
          </button>
        </div>
      </div>
    </section>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'
import {cookieIsValidate, showCookieBanner} from "~/composable/main";

const props = defineProps<{
    message?: string
}>()
</script>





<style lang="scss" scoped >
.v-app-cookie {
    position: relative;
    width: 100%;
    background: var(--app-color-main);
    color: white;
    font-size: .85rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
    font-weight: 500;
    align-items: center;
    line-height: 1.15em;
    box-sizing: border-box;
    padding: .5rem;

    @media (max-width: 800px) {
        flex-direction: column;
        gap: .5rem;
    }
}

button {
    font-size: 1rem;
    padding: .5em;
    line-height: 1em;
    background: var(--app-color-main--dark);
    color: white;
}
</style>

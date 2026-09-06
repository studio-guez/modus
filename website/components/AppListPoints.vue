<template>
    <section class="v-app-list-points"
    >
      <app-citation
              :text="title"
      />
      <div class="v-app-list-points__content"
      >
        <div v-html="content" />
      </div>
    </section>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
    title: string
    content: string
}>()
</script>





<style lang="scss" >
.v-app-list-points__content {
}
</style>

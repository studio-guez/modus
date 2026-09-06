<template>
    <section
        class="v-citation"
    >
      <h2 class="v-citation__text"
          v-html="text"
      />
    </section>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
    text: string
}>()
</script>





<style lang="scss" scoped >
.v-citation {
    width: 100%;
    display: flex;
    justify-content: center;
}

.v-citation__text {
    padding: 4rem 2rem 4rem;
    width: 100%;
    box-sizing: border-box;
    max-width: none;
    text-align: center;
    color: white;
    background: linear-gradient(to right, var(--app-color-main), var(--app-color-main--dark));
    border-radius: var(--app-radius-small) var(--app-radius-reg) var(--app-radius-reg) var(--app-radius-large);
  margin: 0;
}
</style>

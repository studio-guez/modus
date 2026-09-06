<template>
    <section
        class="v-app-text-content"
        :class="variant"
    >
      <div class="v-app-text-content__text-container child-remove-margin"
           v-html="text"
      >
      </div>
    </section>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'

const props = withDefaults(defineProps<{
    text?: string
    variant: 'regular' | 'yellow-block'
}>(), {
    variant: 'regular',
})
</script>




<style lang="scss" scoped>
.v-app-text-content {
    display: flex;
    justify-content: center;
}

.v-app-text-content__text-container {
    border-radius: var(--app-radius-small) var(--app-radius-reg) var(--app-radius-reg) var(--app-radius-large);

    .yellow-block & {
        background-color: var(--app-color-yellow);
        border-radius: var(--app-radius-large) 0 var(--app-radius-large) 0;
        box-sizing: border-box;
        padding: 5rem 2rem;
    }
}


</style>

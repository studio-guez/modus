<template>
  <div class="app-share-link">
    <div class="app-share-link__button" @click="shareClicked">
      <button class="app-button app-button--small">{{ buttonText }}</button>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="app-share-link__icon" viewBox="0 0 16 16">
        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { copyCurrentUrlToClipboard } from '~/utils/copyCurrentUrlToClipboard'

const buttonText = ref('Copier le lien de cette page')

function shareClicked() {
  copyCurrentUrlToClipboard()
  buttonText.value = 'Lien copié'
}
</script>

<style lang="scss" scoped>
.app-share-link {
  display: flex;
  background-color: var(--app-color-grey);
  justify-content: center;
  padding: 2rem;

  &__button {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  &__icon {
    display: block;
  }

  &__button:hover .app-share-link__icon {
    animation: takeoff 4s ease-in-out forwards;
  }
}

@keyframes takeoff {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  25% {
    opacity: 0;
  }
  50% {
    transform: translate(300px, -200px) rotate(30deg);
  }
  100% {
    transform: translate(600px, -600px) rotate(90deg);
    opacity: 0;
  }
}
</style>

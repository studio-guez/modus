<template>
    <section class="v-app-internal-links">
        <img
            v-if="src"
            class="v-app-internal-links__bg"
            :src="src"
            alt=""
        />
        <div class="v-app-internal-links__container">
            <div class="v-app-internal-links__inner">
                <div class="v-app-internal-links__header">
                    <h4 v-if="title" class="v-app-internal-links__title">{{ title }}</h4>
                    <p v-if="subtitle" class="v-app-internal-links__subtitle">{{ subtitle }}</p>
                </div>
                <div class="v-app-internal-links__cards">
                    <nuxt-link
                        v-for="(card, idx) of cards"
                        :key="idx"
                        :href="`/${card.slug}`"
                        class="v-app-internal-links__card"
                        :class="`v-app-internal-links__card--${card.color || 'green-light'}`"
                    >
                        <span class="v-app-internal-links__card__badge app-button app-button--small">{{ card.buttontext || 'Découvrir' }}</span>
                        <div class="v-app-internal-links__card__body">
                            <h5 class="v-app-internal-links__card__title">{{ card.title }}</h5>
                            <p class="v-app-internal-links__card__subtitle">{{ card.subtitle }}</p>
                        </div>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </section>
</template>


<script setup lang="ts">
defineProps<{
    src?: string
    title?: string
    subtitle?: string
    cards: {
        title: string
        subtitle: string
        slug: string
        color?: 'green-light' | 'green-medium' | 'green-dark'
        buttontext?: string
    }[]
}>()
</script>


<style lang="scss" scoped>
.v-app-internal-links {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding: 4.22222222222rem 0;
    @media (max-width: 900px) {
        padding: 4.22222222222rem 0 var(--app-gutter) 0;
    }
}

.v-app-internal-links__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.v-app-internal-links__container {
    position: relative;
    max-width: 1300px;
    margin: 0 auto;
}

.v-app-internal-links__inner {
    padding: 0 var(--app-gutter);
}

.v-app-internal-links__header {
    text-align: center;
    margin-bottom: 2.5rem;
}

.v-app-internal-links__title {
    text-align: center;
    margin: 0 0 0.25rem 0;
    color: var(--app-color-black);
    font-size: 3.55555555556rem;
    font-weight: 600;
    line-height: 1.14;
    max-width: none;
    @media (max-width: 1280px) {
        font-size: 2.5rem;
    }
    @media (max-width: 900px) {
        font-weight: 900;
        font-size: 1.45rem;
        margin-bottom: .25em;
        line-height: 1.225;;
    }
}

.v-app-internal-links__subtitle {
    color: var(--app-color-black);
    font-weight: 600;
    margin: 0;
    font-size: 1.33333333333rem;
    max-width: none;
}

.v-app-internal-links__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.11111111111rem;

    @media (max-width: 1280px) {
        grid-template-columns: 1fr;
    }
}

.v-app-internal-links__card {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    border-radius: var(--app-radius-large) var(--app-radius-large) 0.55555555555rem var(--app-radius-large);
    padding: 6rem 1.5rem 2rem 1.5rem;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    &--green-light {
        background-color: var(--app-color-teal);
    }

    &--green-medium {
        background-color: var(--app-color-main);
    }

    &--green-dark {
        background-color: var(--app-color-main--dark);
    }

    @media (max-width: 900px) {
        border-radius: var(--app-radius-small) var(--app-radius-small) 0.255555555555rem var(--app-radius-small);
    }
}

.v-app-internal-links__card__badge {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: var(--app-color-yellow)!important;
    color: var(--app-color-black)!important;
    border-color: var(--app-color-yellow)!important;
}

.v-app-internal-links__card__title {
    margin: 0 0 1.38888888889rem 0;
    font-size: 3.55555555556rem;
    font-weight: 600;
    line-height: 1.14;
    max-width: none;
    color: var(--app-color-white);
    @media (max-width: 1280px) {
        font-size: 2.5rem;
    }
    @media (max-width: 900px) {
        font-weight: 900;
        font-size: 1.45rem;
        line-height: 1.225;
         margin: 0 0 0.25rem 0;
    }

    .v-app-internal-links__card--green-light & {
        color: var(--app-color-black);
    }
}

.v-app-internal-links__card__subtitle {
    color: var(--app-color-white);
    font-weight: 600;
    margin: 0;
    font-size: 0.95rem;

    .v-app-internal-links__card--green-light & {
        color: var(--app-color-black);
    }
}
</style>

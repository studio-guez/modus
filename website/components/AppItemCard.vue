<template>
    <article class="v-app-item-card"
             :class="cardTypeClass"
    >
        <div class="v-app-item-card__front">
            <div class="v-app-item-card__header">
                <NuxtLink v-if="clickBehavior === 'navigate'" :to="href" class="v-app-item-card__header__link">
                    <img class="v-app-item-card__header__img"
                        alt="cover"
                        :src="imgSrc"
                        :style="{ objectPosition: objectPosition }"
                    />
                </NuxtLink>
                <a v-else-if="clickBehavior === 'external'" :href="href" target="_blank" class="v-app-item-card__header__link">
                    <img class="v-app-item-card__header__img"
                        alt="cover"
                        :src="imgSrc"
                        :style="{ objectPosition: objectPosition }"
                    />
                </a>
                <component v-else :is="'button'" class="v-app-item-card__header__link" @click.stop="handleActionClick">
                    <img class="v-app-item-card__header__img"
                        alt="cover"
                        :src="imgSrc"
                        :style="{ objectPosition: objectPosition }"
                    />
                </component>
                <div class="v-app-item-card__header__date-container" v-if="dateLabel">
                    <div class="v-app-item-card__header__date">
                        {{ dateLabel }}
                    </div>
                </div>
                <div class="v-app-item-card__header__overlay" v-if="overlayIcon">
                    <!-- Play icon for video -->
                    <div v-if="overlayIcon === 'play'" class="v-app-item-card__overlay-icon v-app-item-card__overlay-icon--play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <!-- Mic icon for podcast -->
                    <div v-else-if="overlayIcon === 'mic'" class="v-app-item-card__overlay-icon v-app-item-card__overlay-icon--mic">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="v-app-item-card__body">
                <div class="v-app-item-card__actions">
                    <button class="app-button app-button--small v-app-item-card__button v-app-item-card__button--plus"
                            @click.stop="flipCard" 
                            v-if="preview || hasStatus"
                    >
                        <span class="v-app-item-card__button-text">+</span>
                    </button>
                    <div class="v-app-item-card__actions-right">
                        <a v-if="hasPdfButton && pdfUrl" 
                           class="v-app-item-card__pdf-button"
                           :href="pdfUrl"
                           target="_blank"
                           rel="noopener"
                           @click.stop
                        >
                            <svg-pdf style="width: 2.1875rem; height: 2.4375rem;" />
                        </a>
                        <NuxtLink v-if="clickBehavior === 'navigate'"
                           class="app-button app-button--small v-app-item-card__button"
                           :to="href"
                           @click.stop
                        ><span class="v-app-item-card__button-text">{{ actionLabel }}</span></NuxtLink>
                        <a v-else-if="clickBehavior === 'external'"
                           class="app-button app-button--small v-app-item-card__button"
                           :href="href"
                           target="_blank"
                           @click.stop
                        ><span class="v-app-item-card__button-text">{{ actionLabel }}</span></a>
                        <button v-else class="app-button app-button--small v-app-item-card__button"
                                @click.stop="handleActionClick"
                        ><span class="v-app-item-card__button-text">{{ actionLabel }}</span></button>
                    </div>
                </div>
                <component :is="titleTag" class="v-app-item-card__title">{{ title }}</component>
            </div>
        </div>
        <div class="v-app-item-card__back" v-if="preview || hasStatus">
            <div class="v-app-item-card__body">
                <div class="v-app-item-card__actions">
                    <button class="app-button app-button--small v-app-item-card__button v-app-item-card__button--plus"
                            @click.stop="flipCard"
                    >
                        <span class="v-app-item-card__button-text">−</span>
                    </button>
                    <div class="v-app-item-card__actions-right">
                        <a v-if="hasPdfButton && pdfUrl" 
                           class="v-app-item-card__pdf-button"
                           :href="pdfUrl"
                           target="_blank"
                           rel="noopener"
                           @click.stop
                        >
                            <svg-pdf style="width: 2.1875rem; height: 2.4375rem;" />
                        </a>
                        <NuxtLink v-if="clickBehavior === 'navigate'"
                           class="app-button app-button--small v-app-item-card__button"
                           :to="href"
                           @click.stop
                        ><span class="v-app-item-card__button-text">{{ actionLabel }}</span></NuxtLink>
                        <a v-else-if="clickBehavior === 'external'"
                           class="app-button app-button--small v-app-item-card__button"
                           :href="href"
                           target="_blank"
                           @click.stop
                        ><span class="v-app-item-card__button-text">{{ actionLabel }}</span></a>
                        <button v-else class="app-button app-button--small v-app-item-card__button"
                                @click.stop="handleActionClick"
                        ><span class="v-app-item-card__button-text">{{ actionLabel }}</span></button>
                    </div>
                </div>
                <div class="v-app-item-card__preview">{{ preview }}</div>
                <div class="v-app-item-card__status-container" v-if="hasStatus">
                    <div class="v-app-item-card__status"
                            v-if="status"
                            :style="{ backgroundColor: statusColor, borderColor: statusColor }"
                    >{{ status }}</div>
                </div>
            </div>
        </div>
    </article>
</template>


<script setup lang="ts">
import type { CardType, ClickBehavior, OverlayIcon } from '~/utils/cardConfig'

const emit = defineEmits<{
    (e: 'play-video', mediaUrl: string, title: string): void
    (e: 'play-podcast', mediaUrl: string, title: string): void
}>()

const router = useRouter()

const props = withDefaults(defineProps<{
    cardType?: CardType
    clickBehavior?: ClickBehavior
    overlayIcon?: OverlayIcon
    hasPdfButton?: boolean
    hasStatus?: boolean
    imgSrc?: string
    objectPosition?: string
    dateLabel?: string
    title?: string
    titleTag?: string
    preview?: string
    status?: string
    statusColor?: string
    href?: string
    actionLabel?: string
    mediaUrl?: string
    pdfUrl?: string
}>(), {
    cardType: 'project-supported',
    clickBehavior: 'navigate',
    overlayIcon: null,
    hasPdfButton: false,
    hasStatus: false,
    actionLabel: 'Découvrir',
    titleTag: 'h2',
})

const isFlipped = ref(false)

const cardTypeClass = computed(() => {
    const classes = [`v-app-item-card`, `v-app-item-card--${props.cardType}`]
    if (isFlipped.value) classes.push('v-app-item-card--flipped')
    return classes.join(' ')
})

function flipCard() {
    isFlipped.value = !isFlipped.value
}

function handleActionClick() {
    switch (props.clickBehavior) {
        case 'play-video':
            if (props.mediaUrl) emit('play-video', props.mediaUrl, props.title || '')
            break
        case 'play-podcast':
            if (props.mediaUrl) emit('play-podcast', props.mediaUrl, props.title || '')
            break
        case 'external':
            if (props.href) window.open(props.href, '_blank')
            break
        case 'navigate':
        default:
            if (props.href) router.push(props.href)
    }
}
</script>


<style lang="scss" scoped>
.v-app-item-card {
    // Default theme (can be overridden by modifiers)
    --card-bg: var(--app-color-green-light);
    --card-text: var(--app-color-black);

    color: var(--card-text);
    box-sizing: border-box;
    width: 100%;
    position: relative;
    transform-style: preserve-3d;
}

.v-app-item-card--flipped .v-app-item-card__front {
    transform: rotateY( 180deg );
}
.v-app-item-card--flipped .v-app-item-card__back {
    transform: rotateY( 0deg );
}

.v-app-item-card__front, .v-app-item-card__back {
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

.v-app-item-card__front {
    position: relative;
}

.v-app-item-card__back {
    position: absolute;
    top: 0;
    left: 0;
    transform: rotateY( 180deg );
    z-index: 2;
}

// Card type modifiers - Project types
.v-app-item-card--project-modus {
    --card-bg: var(--app-color-main--dark);
    --card-text: var(--app-color-white);
}

.v-app-item-card--project-supported {
    --card-bg: var(--app-color-main);
    --card-text: var(--app-color-white);
}

// Card type modifiers - Media types
.v-app-item-card--video {
    --card-bg: var(--app-color-yellow);
    --card-text: var(--app-color-black);
}

.v-app-item-card--podcast {
    --card-bg: var(--app-color-yellow-light);
    --card-text: var(--app-color-black);
}

// Card type modifiers - Report type
.v-app-item-card--report {
    --card-bg: var(--app-color-sage);
    --card-text: var(--app-color-black);
}

// Card type modifiers - Tool types
.v-app-item-card--tool-internal,
.v-app-item-card--tool-external {
    --card-bg: var(--app-color-teal);
    --card-text: var(--app-color-black);
}

// Header
.v-app-item-card__header {
    position: relative;
    width: 100%;
}

.v-app-item-card__header__link {
    all: unset;
    display: block;
    width: 100%;
    cursor: pointer;
}

.v-app-item-card__header__img {
    display: block;
    width: 100%;
    background-color: #D3DABF;
    object-fit: cover;
    aspect-ratio: 441/250;
}

.v-app-item-card__header__date-container {
    box-sizing: border-box;
    position: absolute;
    top: 1rem;
    padding: 0 1.66666666667rem;
    text-align: center;
    display: flex;
    justify-content: center;
    width: 100%;
    @media (min-width: 741px) {
        justify-content: flex-end;
    }
}

.v-app-item-card__header__date {
    background: var(--app-color-yellow);
    border-radius: 1000px;
    color: var(--app-color-black);
    padding: .58333333333rem .83333333333rem;
    line-height: 1;
    font-size: .88888888888rem;
}

.v-app-item-card__header__overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

// Overlay icons
.v-app-item-card__overlay-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.v-app-item-card__overlay-icon--play,
.v-app-item-card__overlay-icon--mic {
    width: 3.5rem;
    height: 3.5rem;
    color: var(--app-color-yellow);
}

// Body
.v-app-item-card__body {
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-height: 11.6666666667rem;
}

.v-app-item-card__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.11111111111rem 1.66666666667rem;
    column-gap: 0.77777777777rem;
}

.v-app-item-card__actions-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: 0.77777777777rem;
    margin-left:auto
}

.v-app-item-card__button {
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

.v-app-item-card__button--plus{
    font-size: 2rem;
}

.v-app-item-card__button:hover {
    background-color: var(--card-text);
    color: var(--card-bg);
}

.v-app-item-card__pdf-button {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
}

.v-app-item-card__title {
    padding: 0 1.66666666667rem 1.66666666667rem 1.66666666667rem;
    margin: auto 0 0 0;
    font-size: 2rem;
    color: var(--card-text);
    text-align: left;
}

.v-app-item-card__preview {
    box-sizing: border-box;
    padding: 0 1.66666666667rem 0 1.66666666667rem;
    margin: auto 0 1.66666666667rem 0;
    font-size: 1.33333333333rem;
    max-height: calc(100% - 10.5rem);
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 8;
    line-height: 1.25;
}

.v-app-item-card__status-container {
    padding: 0 1.66666666667rem 1.66666666667rem 1.66666666667rem;
}

.v-app-item-card__status {
    font-size: 0.83333333333rem;
    color: var(--app-color-white);
    padding: 0 .83333333333rem;
    display: inline-flex;
    align-items: center;
    height: 1.83333333333rem;
    border-radius: 1000px;
}
</style>

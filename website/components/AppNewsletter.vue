<template>
    <section class="v-app-newsletter child-remove-margin" >
        <p
            class="v-app-newsletter__title"
        >Laissez vos coordonnées pour recevoir nos informations</p
        >
        <form
            method="post"
            action="https://newsletter.infomaniak.com/v3/api/1/newsletters/webforms/23661/submit"
            class="inf-form"
        >
            <input type="email"
                   name="email"
                   style="display:none"
            />
            <input type="hidden"
                   name="key"
                   value="eyJpdiI6Im5zaVRib1JKaGJtemhFN1pNNjltZmROUktkZzFiTHVuRlJvc2JRWnRic0U9IiwibWFjIjoiMDMyMmE5ZmZhMzkzYzZiOGM3ZjNmNjUxZmIwNTMyNDYyMWZmOTBiZThlYjE5NDI0YzQzM2Q4NTY0ZWQ4NzllZCIsInZhbHVlIjoiTUowcHBcL01URFNlc1lMbUNyM2h1eUg4M2xtczFqS2tnY1huVnB4c1plU2M9In0="
            >
            <input type="hidden"
                   name="webform_id"
                   value="23661"
            >

            <div class="inf-success" style="display:none">
                <p class="v-app-newsletter__feedback v-app-newsletter__feedback--success">
                    Votre inscription a été enregistrée avec succès !
                </p>
            </div>

            <div class="inf-content">
                <input
                    class="v-app-newsletter__input"
                    name="inf[1]"
                    data-inf-meta="1"
                    type="email"
                    placeholder="@"
                    required="required"
                    data-inf-error="Merci de renseigner une adresse email"
                />

                <altcha-widget
                    hidelogo
                    hidefooter
                    floating
                    challengeurl="https://newsletter.infomaniak.com/v3/altcha-challenge"
                ></altcha-widget>

                <div class="inf-submit">
                    <input class="app-button app-button--small" type="submit" name="" value="Envoyer">
                </div>
            </div>
        </form>
    </section>
</template>





<script lang="ts" setup>
useHead({
    script: [
        {
            src: 'https://eu.altcha.org/js/latest/altcha.min.js',
            type: 'module',
            defer: true,
        },
        {
            src: 'https://newsletter.storage5.infomaniak.com/mcaptcha/altcha.js',
            defer: true,
        },
        {
            src: 'https://newsletter.infomaniak.com/v3/static/webform_index.js?v=1774452332',
            type: 'text/javascript',
        },
    ],
})
</script>





<style lang="scss" scoped >
.v-app-newsletter {
    background: var(--app-color-main--dark);
    padding: 2.55555555556rem var(--app-base-padding-x);

    .v-app-newsletter__input {
        font-size: 1.5rem;
        line-height: 1.5rem;

        @media (max-width: 900px) {
            font-size: 1rem;
            line-height: 1rem;
        }
    }
}

.v-app-newsletter__title {
    color: var(--app-color-white);
    font-size: 2.66666666667rem;
    background: transparent !important;
    text-align: center;
    text-wrap: balance;
    padding: 0;
    font-weight: 600;
    margin-bottom: 1.77777777778rem;
    line-height: 1;
    max-width: none;
}

form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

input[type='email'] {
    all: unset;
    font-family: inherit;
    background: white;
    border-radius: 3rem;
    padding: 0.75rem 0.83333333333rem;
    width: 60ch;
    box-sizing: border-box;
    margin-bottom: 1.77777777778rem;
    font-size:1.77777777778rem;
    font-weight: 500;
    line-height: 1;
    max-width: 100%;

    &::placeholder {
        color: var(--app-color-main--dark);
    }
}

input[type='submit'] {
    background-color: var(--app-color-yellow);
    color: var(--app-color-black);
    border: none;
    width: auto;

    &:hover {
        background-color: var(--app-color-yellow-light);
        color: var(--app-color-black);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.v-app-newsletter__feedback {
    margin-top: 1rem;
    font-size: 1rem;
    text-align: center;

    &--success {
        color: #a8e6a3;
    }

    &--error {
        color: #ffb3b3;
    }
}

.inf-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 100%;
}
</style>

<template>
    <form class="app-form"
        @submit.prevent="handleSubmit">
        <div class="app-form__group">
            <input type="text" id="nom" placeholder="Nom" v-model="formData.nom" required>
            <input type="text" id="prenom" placeholder="Prénom" v-model="formData.prenom" required>
        </div>
        <div class="app-form__group">
            <input type="text" id="institution" placeholder="Institution" v-model="formData.institution" required>
            <input type="email" id="email" placeholder="E-mail" v-model="formData.email" required>
        </div>
        <input type="text" id="nomProjet" placeholder="Titre du projet" v-model="formData.nomProjet" required>

        <!-- Honeypot: hidden from real users, only bots fill it in. Do not remove. -->
        <div class="app-form__honeypot" aria-hidden="true">
            <label for="website">Ne remplissez pas ce champ</label>
            <input type="text"
                   id="website"
                   name="website"
                   v-model="formData.website"
                   tabindex="-1"
                   autocomplete="off">
        </div>

        <textarea id="description"
                  v-model="formData.description"
                  required
                  maxlength="1250"
                  placeholder="Courte description du projet (objectifs, partenaires, montant du projet, etc./ 250 mots max)"
        ></textarea>
        <button class="app-button--small"
                v-if="status === 'nothing' || status === 'sending ERROR'"
                type="submit"
        >Envoyer</button>
        <div style="text-align: center"
                v-else-if="status === 'sending PROGRESS'"
        >Envoi en cours…</div>

        <div style="text-align: center"
             v-if="responseMassage.length > 0"
             v-html="responseMassage"
        ></div>
    </form>
</template>

<script setup lang="ts">

import type {UnwrapNestedRefs, UnwrapRef} from "vue";

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl as string

let status: Ref<UnwrapRef<"sending PROGRESS" | "sending ERROR" | "sending OK" | "nothing">> = ref("nothing")
let responseMassage = ref('')

const formData: UnwrapNestedRefs<{
    [key: string]: any
    institution: string;
    nomProjet: string;
    description: string;
    nom: string;
    prenom: string;
    email: string
    website: string;
}> = reactive({
    nom: "",
    prenom: "",
    institution: "",
    email: "",
    nomProjet: "",
    description: "",
    website: "", // honeypot, must stay empty
});

const handleSubmit = async () => {
    // Réinitialiser le formulaire
    // formData.nom = "";
    // formData.prenom = "";
    // formData.email = "";
    // formData.institution = "";
    // formData.nomProjet = "";
    // formData.description = "";

    sendMessageData()

};


async function sendMessageData() {
    status.value = "sending PROGRESS"
    responseMassage.value  = ''

    if(formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/g) === null) {
        status.value           = 'sending ERROR'
        responseMassage.value  = 'Adresse mail incorrecte'
        return
    }

    const contactUrl = new URL(`${apiBaseUrl}/contact?`)

    for(const itemKey in formData) {
        contactUrl.searchParams.append(itemKey, formData[itemKey] )
    }

    try {
        const response = await fetch(
            contactUrl.href,
            {
                method: 'POST',
            }
        )

        const jsonResponse = await response.json()

        window.setTimeout(() => {

            if(jsonResponse.succes === false) {
                let errorMessage = 'Problème(s):'
                if (jsonResponse.alert?.error) {
                    errorMessage += ' ' + jsonResponse.alert.error
                }
                responseMassage.value  = errorMessage
                status.value           = 'sending ERROR'

            } else {
                responseMassage.value = "Votre message a bien été envoyé. Nous revenons vers vous au plus vite!\n"
                status.value           = 'sending OK'
            }

        }, 2500)


    } catch {
        responseMassage.value  = 'Erreur de connection, réessayez plus tard'
        status.value           = 'sending ERROR'
    }

}
</script>

<style lang="scss">

form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    gap: var(--app-gutter);
}

button {
    background: linear-gradient(to right, var(--app-color-main), var(--app-color-main--dark));
    border: none;
    color: white;
    max-width: 10rem;
    margin: auto;

    @media (max-width: 900px) {
        display: block;
        width: auto;
    }
}

.app-form__group {
    display: flex;
    justify-content: center;
    gap: var(--app-gutter);
    flex-wrap: nowrap;

    @media (max-width: 900px) {
        flex-wrap: wrap;
    }
}

.app-form__honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

input, textarea {
    box-sizing: border-box;
    width: 100%;
    display: block;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    font-family: inherit;
    padding: .3rem 1rem;
    resize: none;
    border: solid var(--app-color-main) 2px;
    border-radius: var(--app-radius-small);

    &::placeholder {
        color: inherit;
        font-size: inherit;
        line-height: inherit;
        font-family: inherit;
    }
}

textarea {
    height: 5.5rem;
}

input {

}

</style>

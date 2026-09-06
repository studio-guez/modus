<template>
    <form class="app-form-declic-mobility">
        <div v-for="question in visibleQuestions" :key="question.id" class="app-form__section">

            <label v-if="question.type !== 'message'"
                   v-html="question.text"
            />

            <!-- Afficher le message si la question est de type 'message' -->
            <template v-if="question.type === 'message'">
                <div class="app-form-declic-mobility__message"
                     v-html="question.text"
                ></div>
            </template>

            <!-- Select -->
            <template v-else-if="question.type === 'select'">
                <select v-model="responses[question.id]">
                    <option v-for="option in question.options" :key="option" :value="option">
                        {{ option }}
                    </option>
                    <!-- Option "autre" -->
                    <option v-if="question.hasOtherOption" value="autre">Autre</option>
                </select>

                <!-- Textarea pour "autre" -->
                <textarea
                    v-if="question.hasOtherOption && responses[question.id] === 'autre'"
                    v-model="responses[`${question.id}_other`]"
                    placeholder="Précisez votre réponse"
                ></textarea>
            </template>

            <!-- Input (texte) -->
            <template v-else-if="question.type === 'input'">
                <input v-model="responses[question.id]" type="text" :placeholder="question.placeholder" :readonly="question.id === 20" />
            </template>

            <!-- Input (nombre) -->
            <template v-else-if="question.type === 'number'">
                <div v-for="(option, key) in question.values" :key="option" class="app-form__section__subsections">
                    <label>{{ option }}</label>
                    <input v-model="responses[question.id][key]" type="number" />
                </div>
            </template>

            <!-- Checkbox -->
            <template v-else-if="question.type === 'checkbox'">
                <div v-for="option in question.options" :key="option" class="app-form__section__subsections">
                    <input type="checkbox" :value="option" v-model="responses[question.id]" />
                    <label>{{ option }}</label>
                </div>
            </template>

            <!-- Textarea -->
            <template v-else-if="question.type === 'textarea'">
                <textarea v-model="responses[question.id]" :placeholder="question.placeholder"></textarea>
            </template>

            <!-- Mail -->
            <template v-else-if="question.type === 'mail'">
              <input v-model="responses[question.id]" type="email" :placeholder="question.placeholder" />
            </template>

            <!-- Family Code -->
            <template v-else-if="question.type === 'family_code'">
                <div class="app-form__family-code">
                    <div class="app-form__family-code__inputs">
                        <div class="app-form__family-code__field">
                            <label>Prénom :</label>
                            <input v-model="responses[`${question.id}_prenom`]" type="text" placeholder="Votre prénom" />
                        </div>
                        <div class="app-form__family-code__field">
                            <label>Nom :</label>
                            <input v-model="responses[`${question.id}_nom`]" type="text" placeholder="Votre nom" />
                        </div>
                    </div>
                    <div class="app-form__family-code__result">
                        <label>Code famille généré :</label>
                        <input v-model="responses[question.id]" type="text" :placeholder="question.placeholder" readonly />
                    </div>
                </div>
            </template>
        </div>

        <!-- Section email pour soumission partielle quand isBlocking avec allowEmailSubmission -->
        <div v-if="!isFormValid.isValid && isFormValid.allowEmailSubmission" class="app-form__blocked-email-section">

          <p>Accepteriez-vous d'être recontacté.e pour participer à d'autres initiatives ou des études pilotées par la Fondation Modus et visant à promouvoir la mobilité durable&nbsp;?</p>

          <div class="app-form__section">
            <select v-model="responses[47]">
              <option value="oui">Oui</option>
              <option value="non">Non</option>
            </select>
          </div>

          <template v-if="responses[47] === 'oui'">
            <p style="color: var(--app-color-main) !important;">Merci de nous indiquer votre adresse email pour que nous puissions vous recontacter&nbsp;:</p>
            <div class="app-form__section">
                <input v-model="responses[44]" type="email" placeholder="Entrez votre adresse email" />
            </div>
          </template>
        </div>

        <button type="submit" @click.prevent="submitForm">Envoyer</button>
    </form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl as string

interface QuestionConditions {
    isBlocking?: boolean; // Si true, bloque les questions suivantes
    allowEmailSubmission?: boolean; // Si true avec isBlocking, permet quand même de valider avec email
    dependsOn?: number;
    value: string | number | boolean | ((dependentValue?: any) => boolean);
}

interface Question {
    id: number;
    text: string;
    type: "select" | "input" | "checkbox" | "textarea" | "number" | 'mail' | 'family_code';
    placeholder?: string;
    conditions?: QuestionConditions;
    /**
     * A string variable that optionally holds a message to be displayed in modal window
     * when the current question is blocked.
     * This message provides context or explanation regarding the obstruction.
     */
    messageIfCurrentQuestionIsBlocked?: string;
}

interface Question_message {
    id: number;
    text: string;
    type: 'message';
    conditions?: QuestionConditions;
    /**
     * A string variable that optionally holds a message to be displayed in modal window
     * when the current question is blocked.
     * This message provides context or explanation regarding the obstruction.
     */
    messageIfCurrentQuestionIsBlocked?: string
}

interface Question_select extends Question {
    type: 'select';
    options: string[];
    hasOtherOption?: boolean;
}

interface Question_input extends Question {
    type: 'input';
}

interface Question_checkbox extends Question {
    type: 'checkbox';
    options: string[];
}

interface Question_textarea extends Question {
    type: 'textarea';
}

interface Question_number extends Question {
    type: "number";
    values: string[],
}

interface Question_mail extends Question {
    type: 'mail';
}

interface Question_family_code extends Question {
    type: 'family_code';
}

interface Responses {
    [key: number | string]: string | number | string[] | boolean | undefined;
}

type QuestionType =
    Question_select
    | Question_input
    | Question_checkbox
    | Question_textarea
    | Question_number
    | Question_message
    | Question_mail
    | Question_family_code

// Données des questions
const questions: QuestionType[] = [
    /**
     * block 0
     */
    {
        id: 0,
        text: 'Comment avez-vous eu connaissance de l\'initiative Déclic Mobilité ?',
        type: "select",
        options: [
            "Je l’ai vu sur une affiche dans les trams/bus",
            "J’ai reçu un e-mail de SwissPass",
            "J’ai reçu une lettre du Canton",
            "Des proches m'en ont parlé",
            "J'ai lu un article sur l’initiative dans un journal",
            "J'en ai entendu parler à la radio",
            "Média Modus (site internet, newsletter, réseaux sociaux…)",
            "Autre",
        ],
    },


    {
      id: 0.2,
      type: 'message',
      conditions: {
        isBlocking: true,
        dependsOn: NaN,
        value: () => {
          const dependentValue = responses.value[0]
          return dependentValue === undefined
        },
      },
      messageIfCurrentQuestionIsBlocked: `Veuillez remplir la question précédente pour continuer.`,
      text: `<p>Veuillez remplir la question précédente pour continuer.</p>`,
    },


    /**
     * block 1
     */
    {
        id: 1,
        text: 'Avant toute chose, avez-vous un compte SwissPass ?',
        type: "select",
        options: [
            'oui',
            'non',
        ],
    },

    {
        id: 1.2,
        type: 'message',
        conditions: {
            isBlocking: true,
            allowEmailSubmission: true,
            dependsOn: 1,
            value: dependentValue => dependentValue === undefined || dependentValue === "non",
        },
        messageIfCurrentQuestionIsBlocked: `Si vous n'avez pas de carte SwissPass, vous devez rapidement en commander une avant de procéder à votre enregistrement.`,
        text: `
          <p style="text-align: left !important;" >Si vous n'avez pas de carte SwissPass, vous devez rapidement en commander une avant de procéder à votre enregistrement. En effet, l’accès aux abonnements et services offerts pendant l'initiative nécessite que vous ayez <a target='_blank' href="https://www.swisspass.ch/register/1">un&nbsp;compte SwissPass</a>.</p>
          <p style="text-align: left !important;" >Pour obtenir la carte SwissPass, vous pouvez en faire la demande auprès d’un point de vente des transports publics ou la commander via le site internet de SwissPass.</p>
          <p style="text-align: left !important;" >Merci de revenir très vite pour remplir ce formulaire une fois votre compte SwissPass activé.</p>
        `,
    },





    /**
     * block 2
     */
    {
        id: 2,
        text: "Dans quel territoire résidez-vous ?",
        type: "select",
        options: ["Canton de Genève", "Autre"],
    },

    {
        id: 2.1,
        type: 'message',
        conditions: {
            isBlocking: true,
            dependsOn: 2,
            value: dependentValue => !dependentValue,
        },
        text: `<p>Sélectionnez un territoire ci-dessus.</p>`,
    },

    {
        id: 2.2,
        type: 'message',
        conditions: {
            isBlocking: true,
            dependsOn: 2,
            value: dependentValue => dependentValue === "Autre",
        },
        messageIfCurrentQuestionIsBlocked: 'Vous résidez hors du territoire couvert par l’initiative « Déclic Mobilité ».',
        text: `
          <p>Vous résidez hors du territoire couvert par l’initiative « Déclic Mobilité ».</p>
          <p>Si vous connaissez des personnes qui résident sur le territoire du Canton de Genève, n’hésitez pas à leur partager l’information.</p>
        `,
    },





    /**
     * block 4
     */
    {
        id: 4,
        text: "Dans quelle commune de Genève votre domicile est-il situé ?",
        conditions: {
            dependsOn: 2,
            value: dependentValue => dependentValue === "Canton de Genève",
        },
        type: "select",
        options: [
            "Aire-la-Ville",
            "Anières",
            "Avully",
            "Avusy",
            "Bardonnex",
            "Bellevue",
            "Bernex",
            "Carouge",
            "Cartigny",
            "Céligny",
            "Chancy",
            "Chêne-Bougeries",
            "Chêne-Bourg",
            "Choulex",
            "Collex-Bossy",
            "Collonge-Bellerive",
            "Cologny",
            "Confignon",
            "Corsier",
            "Dardagny",
            "Genève",
            "Genthod",
            "Gy",
            "Hermance",
            "Jussy",
            "Laconnex",
            "Lancy",
            "Le Grand-Saconnex",
            "Meinier",
            "Meyrin",
            "Onex",
            "Perly-Certoux",
            "Plan-les-Ouates",
            "Pregny-Chambésy",
            "Presinge",
            "Puplinge",
            "Russin",
            "Satigny",
            "Soral",
            "Thônex",
            "Troinex",
            "Vandœuvres",
            "Vernier",
            "Versoix",
            "Veyrier",
        ],
    },


    /**
     * block 5
     * */
    {
        id: 5,
        type: 'select',
        text: 'Quelle est la structure de votre ménage ?',
        options: [
            'Personne seule',
            'Couple sans enfant(s)',
            'Couple avec enfant(s)',
            'Personne seule avec enfant(s)',
            'Colocation',
        ],
        hasOtherOption: true,
    },


  /**
   *
   */
  {
    id: 5.1,
    type: 'select',
    options: [
      'Oui',
      'Non',
    ],
    text: "Disposez-vous d'un code famille ?"
  },


  /**
   *
   */
  {
    id: 5.2,
    type: 'input',
    conditions: {
      isBlocking: false,
      dependsOn: 5.1,
      value: dependentValue => dependentValue === "Oui"
    },
    text: "Merci d’indiquer le code famille ici :"
  },





  /**
     * block 6
     * */
    {
        id: 6.1,
        text: "Combien de personnes de 65 ans et plus composent votre ménage ?",
        type: "select",
        options: [
            "0",
            "1",
            "2",
            "3",
            "4",
        ],
    },


    {
        id: 6.2,
        text: "Combien de personnes de 26 à 64 ans composent votre ménage ?",
        type: "select",
        options: [
            "0",
            "1",
            "2",
            "3",
            "4",
        ],
    },

    {
        id: 6.3,
        text: "Combien de personnes de 18 à 25 ans composent votre ménage ?",
        type: "select",
        options: [
            "0",
            "1",
            "2",
            "3",
            "4",
        ],
    },

    {
        id: 6.4,
        text: "Combien de personnes de 16 à 17 ans composent votre ménage ?",
        type: "select",
        conditions: {
            dependsOn: 5,
            value: dependentValue =>
                dependentValue === "Couple avec enfant(s)"
                || dependentValue === "Personne seule avec enfant(s)"
            ,
        },
        options: [
            "0",
            "1",
            "2",
            "3",
            "4",
        ],
    },

    {
        id: 6.5,
        text: "Combien de personnes de personnes de moins de 16 ans composent votre ménage ?",
        type: "select",
        conditions: {
            dependsOn: 5,
            value: dependentValue =>
                dependentValue === "Couple avec enfant(s)"
                || dependentValue === "Personne seule avec enfant(s)"
            ,
        },
        options: [
            "0",
            "1",
            "2",
            "3",
            "4",
        ],
    },









    /**
     * block 7
     * */
    {
        id: 7,
        text: "De combien de voitures disposez-vous au sein de votre ménage ?",
        type: "select",
        options: [
            "0",
            "1",
            "2",
            "3",
            "4",
            "plus de 4",
        ],
    },





    /**
     * block 7.5
     * */
    {
        id: 7.5,
        text: "De combien de deux-roues motorisés (moto/scooter) disposez-vous au sein de votre ménage ?",
        type: "select",
        options: [
            "0",
            "1",
            "2",
            "3",
            "4",
            "plus de 4",
        ],
    },





    /**
     * block 8
     * */
    {
        id: 8,
        text: "À quelle fréquence vous déplacez-vous en voiture ?",
        type: "select",
        conditions: {
            dependsOn: 7,
            value: dependentValue => dependentValue !==undefined && dependentValue !== "0"
            ,
        },
        options: [
            "Tous les jours ou presque",
            "Une à plusieurs fois par semaine",
            "Moins d’une fois par semaine",
        ],
    },





    /**
     * block 8.5
     * */
    {
        id: 8.5,
        text: "À quelle fréquence vous déplacez-vous en deux roues motorisés ?",
        type: "select",
        conditions: {
            dependsOn: 7.5,
            value: dependentValue => dependentValue !==undefined && dependentValue !== "0"
            ,
        },
        options: [
            "Tous les jours ou presque",
            "Une à plusieurs fois par semaine",
            "Moins d’une fois par semaine",
        ],
    },





    /**
     * block 9
     * */
    {
        id: 9,
        text: 'Quelle est votre année de naissance ?',
        type: 'select',
        options: [
            "1925", "1926", "1927", "1928", "1929", "1930", "1931", "1932", "1933", "1934", "1935", "1936", "1937", "1938", "1939", "1940", "1941", "1942", "1943", "1944", "1945", "1946", "1947", "1948", "1949", "1950", "1951", "1952", "1953", "1954", "1955", "1956", "1957", "1958", "1959", "1960", "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006",
            "2007 ou plus"
        ],
    },

    {
        id: 9.1,
        type: 'message',
        conditions: {
            isBlocking: true,
            dependsOn: 9,
            value: dependentValue => !dependentValue,
        },
        text: `Sélectionnez une année`,
    },

    {
        id: 9.2,
        type: 'message',
        conditions: {
            isBlocking: true,
            dependsOn: 9,
            value: dependentValue => dependentValue === "2007 ou plus",
        },
        text: `Cette initiative s’adresse uniquement aux personnes majeures. Merci pour votre compréhension. N’hésitez pas à partager l’information auprès des personnes majeures de votre entourage.`,
    },




    /**
     * block 10
     * */
    {
        id: 10,
        text: 'Êtes-vous une femme ou un homme ?',
        type: 'select',
        options: [
            'Une femme',
            'Un homme',
            'Autre / je ne souhaite pas répondre',
        ],
    },





    /**
     * block 13
     * */
    {
        id: 13,
        text: 'Quelle situation professionnelle vous correspond actuellement ?',
        type: 'select',
        hasOtherOption: true,
        options: [
            "Actif/active à temps plein",
            "Actif/active à temps partiel",
            "Sans emploi / au chômage",
            "Etudiant·e",
            "Retraité·e",
        ],
    },






    /**
     * block 14
     * */
    {
        id: 14,
        text: 'Quel est votre niveau de formation ?',
        type: 'select',
        options: [
            "Scolarité obligatoire",
            "Formation professionnelle (CFC, école de commerce, apprentissage, etc.)",
            "Formation générale sans maturité (école de culture générale, diplôme d’administration, etc.)",
            "Maturité ou formation de type gymnasial (collège, lycée, maturité professionnelle ou spécialisée)",
            "Formation supérieure (HES, université, école supérieure, brevet/diplôme fédéral, etc.)",
            "Autre / Ne sait pas",
        ],
    },



    /**
     * block 14.5
     * */
    {
        id: 14.5,
        text: 'Avez-vous un permis moto/scooter (A1, A limité ou A) ?  ',
        type: 'select',
        conditions: {
            dependsOn: 7.5,
            value: dependentValue => dependentValue !==undefined && dependentValue !== "0"
        },
        options: [
            "Oui",
            "Non",
            "Momentanément pas (par exemple retrait)",
        ],
    },




    /**
     * block 15
     * */
    {
        id: 15,
        text: 'Avez-vous le permis de conduire ?  ',
        type: 'select',
        options: [
            "Oui",
            "Non",
            "Momentanément pas (par exemple retrait)",
        ],
    },


    /**
     * block 15.9
     * */
    {
        id: 15.9,
        type: 'message',
        text: `
                <p>L'initiative est réservé aux personnes qui ont une voiture ou un deux-roues motorisés et le permis de conduire ou le permis A1 ou A.</p>
               `,
        conditions: {
            isBlocking: true,
            dependsOn: NaN,
            allowEmailSubmission: true,
            value: () => {

                type PermisResponse  = "Oui" | "Non" | "Momentanément pas (par exemple retrait)"

                const voitures_au_sein_du_menage    = responses.value[7]    as undefined | "plus de 4" | string
                const deux_roues_au_sein_du_menage  = responses.value[7.5]  as undefined | "plus de 4" | string
                const permis_moto                   = responses.value[14.5] as PermisResponse
                const permis_voiture                = responses.value[15]   as PermisResponse

                if( voitures_au_sein_du_menage === '0'
                    && deux_roues_au_sein_du_menage === '0' ) return true

                if(permis_moto !== 'Oui' && permis_voiture !== 'Oui') return true

                return false
            },
        },
        messageIfCurrentQuestionIsBlocked: 'Les participants doivent avoir un véhicule motorisé et le permis correspondant.',
    },




    /**
     * block 16
     * */
    {
        id: 16,
        text: 'De quel(s) abonnement(s) de transports publics disposez-vous ?<br><small>Plusieurs réponses possibles.</small>',
        type: 'checkbox',
        options: [
            "Aucun",
            "Abonnement de zone unireso TPG",
            "Abonnement de parcours CFF",
            "Abonnement demi-tarif CFF",
            "Abonnement général (AG) CFF",
            "Autre",
        ],
    },




    /**
     * block 17
     * */
    {
        id: 17,
        text: `Avez-vous personnellement accès à l’un de ces véhicules :
              <br><span class="app-font-small">(Veuillez mentionner uniquement le(s) véhicule(s) de votre ménage que vous pouvez utiliser.)</span>`,
        type: 'checkbox',
        options: [
            "Vélo à assistance électrique",
            "Vélo cargo",
            "Vélo conventionnel (mécanique)",
            "Aucun",
        ],
    },



    /**
     * block 18
     * */
    {
        id: 18,
        text: 'Souhaitez-vous faire évoluer vos pratiques de déplacement pour un mode de vie plus durable ?',
        type: 'select',
        options: [
            "Oui, tout à fait",
            "Plutôt oui",
            "Plutôt non",
            "Pas du tout",
        ],
    },




    /**
     * block 19
     * */
    {
        id: 19,
        text: `La voiture ou le deux-roues motorisé que vous n’utiliserez pas pendant l'initiative est-elle ou est-il partagée avec d’autres adultes de votre ménage ?`,
        type: 'select',
        conditions: {
            dependsOn: NaN,
            value: () => {

                const personnes_de_65_ans_et_plus = responses.value[6.1] ? responses.value[6.1] as string : '0'
                const personnes_de_26_a_64_ans    = responses.value[6.2] ? responses.value[6.2] as string : '0'
                const personnes_de_18_a_25_ans    = responses.value[6.3] ? responses.value[6.3] as string : '0'
                const personnes_de_16_a_17_ans    = responses.value[6.4] ? responses.value[6.4] as string : '0'
                const personnes_de_0_a_15_ans     = responses.value[6.5] ? responses.value[6.5] as string : '0'

                const totalAdults =
                      parseInt(personnes_de_65_ans_et_plus)
                    + parseInt(personnes_de_26_a_64_ans)
                    + parseInt(personnes_de_18_a_25_ans)

                const voitures_au_sein_du_menage    = responses.value[7]    ? responses.value[7]    as "plus de 4" | string : "0"
                const deux_roues_au_sein_du_menage  = responses.value[7.5]  ? responses.value[7.5]  as "plus de 4" | string : "0"

                if (voitures_au_sein_du_menage    === "plus de 4")  return true
                if (deux_roues_au_sein_du_menage  === "plus de 4")  return true

                const totalVehicules = parseInt(voitures_au_sein_du_menage) + parseInt(deux_roues_au_sein_du_menage)

                return totalVehicules < totalAdults
            }
            ,
        },
        options: [
            "Oui, tout à fait",
            "Plutôt oui",
            "Plutôt non",
            "Pas du tout",
        ],
    },

    /**
     * block 20
     * */
    {
        id: 20,
        text: `Code famille :
          <span class="app-font-small">
            <br>Toutes les personnes de votre ménage doivent participer à l'initiative.
            <br><strong>Merci de noter ce code famille et le transmettre aux autres utilisateurs de la voiture pour qu’ils puissent l’indiquer dans leur formulaire d’inscription.</strong>
            <br>
            <br>Ce code famille est généré automatiquement à partir de votre prénom et nom pour que nous puissions faire le lien entre vos réponses.
          </span>
        `,
        type: 'family_code',
      // todo: virer le readonly colé à l'arache pour le question No 20 (voir dans le template la condition if question.id === 20
        conditions: {
            dependsOn: 19,
            value: le_vehicule_est_partage => {

                if (le_vehicule_est_partage === "Oui, tout à fait") return true
                else if (le_vehicule_est_partage === "Plutôt oui") return true
                return false
            },
        },
        placeholder: "Code généré automatiquement",
    },




    /**
     * block 22
     * */
    {
        id: 22,
        text: `Si votre candidature est sélectionnée, vous pourrez choisir parmi les services suivants (qui vous seront intégralement offerts)
          <ul>
            <li>Abonnement transports public Unireso, Mobilis ou AG découverte</li>
            <li>Vélo à assistance électrique 25, 45 ou vélocargo (sous réserve de disponibilité)</li>
            <li>Abonnement et crédits de circulation Mobility,</li>
            <li>Abonnement Donkey Republic</li>
            <li>Abonnement et crédits de circulation Carvélo</li>
            <li>Bons taxi</li>
            <li>Bons pour livraison de courses</li>
            <li>Bons de réparation pour votre vélo personnel</li>
            <li>Atelier de remise en selle ou coaching vélo individualisé</li>
            <li>Bons pour accès à un espace de coworking</li>
          </ul>
          <p style="color:#ff4d84; font-weight: bold;">
                        Une unique période reste possible pour activer le kit mobilité et elle se déroulera du 18 mai au 17 juin.
          </p>
        `,
                type: 'message',
    },




  /**
   * block 23
   * */
  {
    id: 23,
    text: `L’équipe d’organisation du « Déclic mobilité » offre la possibilité aux participant.e.s de laisser leur voiture ou leur deux-roues motorisé dans un parking de la Fondation des parkings pendant toute la durée de l'initiative. Il s’agit du Parking Quai Ernest-Ansermet.
           <p>Seriez-vous intéressé.e par cette offre (tous les frais seront à notre charge), sachant que vous garderez la possibilité de récupérer votre véhicule à n’importe quel moment pendant l'initiative (une seule sortie sera autorisée).</p>
        `,
    type: 'select',
    options: [
      "Oui, j’aimerais pouvoir profiter de cette offre",
      "Non, je ne suis pas intéressé.e",
    ]
  },


  /**
   * block 24
   * */
  {
    id: 24,
    text: `Pour pouvoir transmettre à la Fondation des Parkings la liste des véhicules concernés par l'initiative, nous avons besoin du numéro de la plaque d’immatriculation de la voiture ou du deux-roues motorisé que vous souhaiteriez garer dans le parking du Quai Ansermet.
          <p>Ce numéro ne sera utilisé qu’à cette fin et cette donnée ne sera pas conservée au-delà du 31 aout 2026.</p>
        `,
    type: 'input',
    conditions: {
      dependsOn: 23,
      value: place_de_parking => {
        return place_de_parking === "Oui, j’aimerais pouvoir profiter de cette offre"
      },
    },
  },

  /**
   * block 41
   * */
  {
    id: 41,
    type: 'message',
    text: `
        <p style="text-align: left !important;">
          Le questionnaire est presque terminé.
        </p>
        <p style="text-align: left !important;">
          Pour évaluer l’efficacité de la démarche « Déclic mobilité » et faire un retour sur les enseignements à tirer de cette expérience, nous avons besoin de mesurer la manière dont les participant·e·s font évoluer leurs pratiques de mobilité à l’occasion de cette initiative.
        </p>
        <p style="text-align: left !important;">
          Pour cela, l’équipe organisatrice du « Déclic mobilité » vous invite à participer à une campagne de suivi GPS avec l’application Mov’us, de la Fondation Modus. Ce suivi permettra de mesurer et analyser les évolutions des pratiques pendant trois semaines en amont de l’expérience, pendant celle-ci, puis pendant deux semaine après cell-ci. Votre participation à ce suivi est importante pour le bon fonctionnement du projet. Vous pouvez en savoir plus sur l’utilisation de vos données et les mesures de protection mises en place en cliquant sur le lien suivant : <a target="_blank" href="${apiBaseUrl}/declic-mobilite-notice-protection-globale.pdf" >Notice d’utilisation et de protection des données.</a>
        </p>`
  },


  /**
   * block 42
   * */
  {
    id: 42,
    type: 'select',
    options: [
      'oui',
      'non',
    ],
    text: `Confirmez-vous avoir lu la notice d’utilisation et de <a target="_blank" href="${apiBaseUrl}/declic-mobilite-notice-protection-globale.pdf" >protection des données</a>, et accepteriez-vous de participer au suivi GPS ?`
  },


  /**
   * block 43
   * */
  {
    id: 43,
    type: 'message',
    text: `
        <p style="text-align: left !important;">
          Pour être recontacté si votre candidature est sélectionnée, merci de renseigner votre adresse email et postale.
        </p>
        <p class="app-font-small" style="text-align: left !important;">
        En inscrivant votre adresse email et postale, vous acceptez qu’elles soient enregistrées dans la base de données des personnes susceptibles de participer au défi. Les données renseignées dans ce formulaire ne seront utilisées que dans le cadre de l’organisation de l’initiative « Déclic Mobilité » et en aucun cas ne seront transmises à des tiers.
        </p>
        <p class="app-font-small" style="text-align: left !important;">
        Elles seront détruites au plus tard le 31 décembre 2026.
        </p>
        `
  },

  /**
   * block 44
   * */
    {
        id: 44,
        text: `Adresse email :`,
        type: "mail",
        placeholder: "Entrez votre adresse email",
    },


    /**
     * block 45
     * */
    {
      id: 45,
      text: `Nom et numéro de rue :`,
      type: "input",
      placeholder: "Exemple: Rte de la Galaise 15",
    },

    /**
     * block 46
     * */
    {
      id: 46,
      text: "Accepteriez-vous d’être recontacté.e pour participer à d’autres initiatives ou des études pilotées par la Fondation Modus et visant à promouvoir la mobilité durable ?",
      type: "select",
      options: [
        'Oui',
        'Non'
      ],

    },
];

// État des réponses
const responses = ref<Responses>({});

// Initialiser les réponses pour les questions de type checkbox
questions.forEach((question) => {
    if (question.type === 'checkbox' || question.type === 'number') {
        responses.value[question.id] = [];
    }
});

// Fonction pour générer un hash simple à partir d'une chaîne
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir en entier 32 bits
    }
    return Math.abs(hash);
}

// Fonction pour générer le code famille
function generateFamilyCode(prenom: string, nom: string): string {
    if (!prenom || !nom) return '';

    // Normaliser les chaînes (enlever les accents, mettre en majuscules)
    const normalizeString = (str: string) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase()
            .replace(/[^A-Z]/g, '');
    };

    const prenomNormalized = normalizeString(prenom);
    const nomNormalized = normalizeString(nom);

    // Prendre les 3 premières lettres de chaque
    const prenomPart = prenomNormalized.substring(0, 3).padEnd(3, 'X');
    const nomPart = nomNormalized.substring(0, 3).padEnd(3, 'X');

    // Générer un nombre basé sur le prénom et nom complets
    const fullName = prenomNormalized + nomNormalized;
    const hashNumber = simpleHash(fullName) % 10000; // Nombre entre 0 et 9999
    const numberPart = hashNumber.toString().padStart(4, '0');

    return `${prenomPart}${nomPart}_${numberPart}`;
}

// Watcher pour mettre à jour automatiquement le code famille
watch(
    () => [responses.value['20_prenom'], responses.value['20_nom']],
    ([prenom, nom]) => {
        if (typeof prenom === 'string' && typeof nom === 'string') {
            responses.value[20] = generateFamilyCode(prenom, nom);
        }
    },
    { deep: true }
);

function clearResponse() {
    responses.value = {};

    // Initialiser les réponses pour les questions de type checkbox
    questions.forEach((question) => {
        if (question.type === 'checkbox' || question.type === 'number') {
            responses.value[question.id] = [];
        }
    });
}

// Calculer les questions visibles
const visibleQuestions: Ref<QuestionType[]> = ref([])


watch(responses, () => updateContent(), { deep: true });
onMounted(() => updateContent())

function updateContent() {

    const visible: QuestionType[] = [];
    let isBlocked = false; // Indicateur pour savoir si un bloc de type message a bloqué l'affichage

    for (const question of questions) {
        // Si un bloc de type message a bloqué l'affichage, masquer cette question
        if (isBlocked) {
            continue; // Passer à la question suivante
        }

        // Vérifier si la question actuelle a une condition
        if (question.conditions) {
            const { dependsOn, value } = question.conditions;

            if( dependsOn ) {
                const dependentValue = responses.value[dependsOn];
                const conditionMet = typeof value === "function" ? value(dependentValue) : dependentValue === value;

                if (!conditionMet) {
                    continue; // Passer à la question suivante
                }

                if (question.type === 'message' && conditionMet) {
                    isBlocked = question.conditions.isBlocking ? question.conditions.isBlocking : false
                }
            } else {

                if( typeof value !== "function" ) {
                    console.error(`dependsOn is undefined and value is not a function.
                    if dependsOn is not specified, value must be nu function to check a condition.`)

                    continue;
                }

                const conditionMet = value()

                if (!conditionMet) {
                    continue; // Passer à la question suivante
                }

                if (question.type === 'message' && conditionMet) {
                    isBlocked = question.conditions.isBlocking ? question.conditions.isBlocking : false
                }
            }
        }

        // Ajouter la question aux questions visibles
        visible.push(question);
    }

    visibleQuestions.value = visible;
}

// Validation du formulaire
const isFormValid: ComputedRef<{
    isValid: boolean,
    message: string,
    allowEmailSubmission: boolean,
}> = computed(() => {

    let msg: {
        isValid: boolean,
        message: string,
        allowEmailSubmission: boolean,
    } = {
        message: '',
        isValid: true,
        allowEmailSubmission: false,
    }

    for (const [index, question] of visibleQuestions.value.entries()) {

        if (question.type === 'message') {
            if(question.conditions?.isBlocking) {
                msg = {
                    isValid: false,
                    message: question.messageIfCurrentQuestionIsBlocked || question.text,
                    allowEmailSubmission: question.conditions.allowEmailSubmission || false,
                }
            }
            continue
        }

        if (question.type === 'mail') {
            const email: string | number | string[] | boolean | undefined = responses.value[question.id]

            if( email === undefined )  {
              msg = {
                  isValid: false,
                  message: "oups, votre mail est vide",
              }
              break
            }

            else if(typeof email !== 'string') {
                msg = {
                    isValid: false,
                    message: "oups, votre mail n'est pas une chaine de caractère",
                }
                break
            }

            else if( ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ) {
                msg = {
                    isValid: false,
                    message: "oups, votre mail est mal formaté",
                }
                break
            }
        }

        else if (question.type === 'family_code') {
            const prenom = responses.value[`${question.id}_prenom`]
            const nom = responses.value[`${question.id}_nom`]
            const code = responses.value[question.id]

            if (!prenom || typeof prenom !== 'string' || prenom.trim() === '') {
                msg = {
                    isValid: false,
                    message: "Veuillez renseigner votre prénom pour le code famille",
                }
                break
            }

            if (!nom || typeof nom !== 'string' || nom.trim() === '') {
                msg = {
                    isValid: false,
                    message: "Veuillez renseigner votre nom pour le code famille",
                }
                break
            }

            if (!code || typeof code !== 'string' || code.trim() === '') {
                msg = {
                    isValid: false,
                    message: "Le code famille n'a pas été généré correctement",
                }
                break
            }
        }

        else if( responses.value[question.id] === undefined
            || responses.value[question.id] === ""
        ) {
          msg = {
              isValid: false,
              message: `la question ${index + 1}, "${question.text}" est vide`
          }
          break
        }

        else if ( Array.isArray(responses.value[question.id]) && (responses.value[question.id] as string[]).length === 0 ) {
          msg = {
              isValid: false,
              message: `rien est sélectionné pour la question ${index + 1}, "${question.text}"`
          }
          break
        }
    }

    return msg
});

// Soumission du formulaire
const submitForm = async () => {
    if (isFormValid.value.isValid) {

      const idOfQuestionForMailAdress = 44
      const questionForMailAdresse = visibleQuestions.value.find(q => q.id === idOfQuestionForMailAdress)

      const mailOfUser = questionForMailAdresse ? responses.value[questionForMailAdresse.id] : undefined
      const mailToSendValidationMail = (typeof mailOfUser === 'string')? mailOfUser : 'nico+logerror@villa1203.ch'

        const jsonData: {
          value: {
            question: QuestionType,
            response: string | number | string[] | boolean | undefined,
          }[],
          mail: string
        } = {
          mail: mailToSendValidationMail,
          value: visibleQuestions.value.map((question) => {
            return {
              question: question,
              response: responses.value[question.id],
            }
          })
        }

        const url = "https://mail-recording.villa1203.deno.net/data";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            alert(`Formulaire soumis, merci!`)
            clearResponse()
        } catch (error) {
            console.error("Erreur lors de l'envoi de la requête POST:", error);

            alert(`Erreur lors de l'envoi de la requête POST: ${error}`)
        }

    } else if (isFormValid.value.allowEmailSubmission) {
        // Cas particulier: formulaire bloqué MAIS on permet de soumettre avec email
        const idOfQuestionForMailAdress = 44
        const emailResponse = responses.value[idOfQuestionForMailAdress]

        // Vérifier que l'email est valide
        if (!emailResponse || typeof emailResponse !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailResponse)) {
            alert("Veuillez renseigner une adresse email valide pour continuer.")
            return
        }

        const jsonData: {
          value: {
            question: QuestionType,
            response: string | number | string[] | boolean | undefined,
          }[],
          mail: string,
          blockedSubmission: boolean
        } = {
          mail: emailResponse,
          blockedSubmission: true,
          value: visibleQuestions.value.map((question) => {
            return {
              question: question,
              response: responses.value[question.id],
            }
          })
        }

        const url = "https://mail-recording.villa1203.deno.net/data";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            alert(`Formulaire soumis, merci!`)
            clearResponse()
        } catch (error) {
            console.error("Erreur lors de l'envoi de la requête POST:", error);

            alert(`Erreur lors de l'envoi de la requête POST: ${error}`)
        }
    } else {
        alert( isFormValid.value.message )
    }
};
</script>

<style lang="scss">
form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    gap: 8rem;
    counter-reset: section;
}

input[readonly] {
    background-color: #f0f0f0;
    cursor: not-allowed;
    color: #666;
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

.app-form-declic-mobility__group {
    display: flex;
    justify-content: center;
    gap: var(--app-gutter);
    flex-wrap: nowrap;

    @media (max-width: 900px) {
        flex-wrap: wrap;
    }
}

.app-form__section {
    > label::before {
        counter-increment: section;
        content: counter(section) ". ";
        font-weight: bold;
        margin-right: 5px;
    }

    > label.no-counter::before {
        content: none;
    }
}

.app-form__section__message {
    color: red;
    margin-top: 10px;
}

.app-form-declic-mobility__message {
    text-align: center;

    > * {
        text-align: center !important;
        max-width: none !important;
    }
}

.app-form__family-code {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1rem;

    &__inputs {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    &__field {
        flex: 1;
        min-width: 200px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
            font-weight: normal;
            font-size: 0.9em;
        }

        label::before {
            content: none !important;
        }
    }

    &__result {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
            font-weight: bold;
            font-size: 0.9em;
        }

        label::before {
            content: none !important;
        }

        input {
            font-weight: bold;
            font-size: 1.1em;
        }
    }
}

.app-form__blocked-email-section {
    margin-top: 2rem;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 2px solid var(--app-color-main);

    .app-form__section {
        label {
            font-weight: bold;
            color: var(--app-color-main);
        }

        label::before {
            content: none !important;
        }

        input {
            margin-top: 0.5rem;
        }
    }
}
</style>

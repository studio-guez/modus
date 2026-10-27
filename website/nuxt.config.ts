// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({

    runtimeConfig: {
        // Server-only base URL used by SSR to reach the API from inside the container.
        // Falls back to the public URL when empty. Env: NUXT_API_BASE_URL_SERVER
        apiBaseUrlServer: '',
        public: {
            apiBaseUrl: 'http://localhost:8080' // overridden by NUXT_PUBLIC_API_BASE_URL
        }
    },

    app: {
        baseURL: '/',
        head: {
            htmlAttrs: {
                lang: 'fr'
            },
            // Share meta (og:*, twitter:card) is set per request in app.vue and the
            // pages, since og:url and og:image depend on the page being rendered.
        },
        pageTransition: {
            name: 'page',
            mode: 'out-in',
        },
    },

    devtools: {enabled: true},
    vite: {
        optimizeDeps: {
            include: ['@vue/devtools-core', '@vue/devtools-kit'],
        },
    },
    vue: {
        compilerOptions: {
            isCustomElement: (tag) => tag === 'altcha-widget',
        },
    },
    css: [
        '@/assets/_main.scss'
    ],
    ssr: true,
})

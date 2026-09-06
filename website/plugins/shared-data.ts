import { ApiFetchNews } from '~/composable/adminApi/apiFetch'
import { useActualites } from '~/composable/main'

/**
 * Fetches the actualités/news banner data server-side and stores it in shared
 * state. Menus are now fetched directly by the nav components via useMenus().
 *
 * Sequential `await useAsyncData(...)` is used instead of Promise.all because
 * Promise.all resolves with the AsyncData objects synchronously (before the
 * fetches complete), whereas `await` correctly waits for the payload.
 */
export default defineNuxtPlugin(async () => {
    const {data: newsData} = await useAsyncData('shared-news', () => ApiFetchNews())

    const actualites = useActualites()
    const news = newsData.value
    if (news) {
        const acts: { title: string; link?: string; color: string }[] = []
        if (news.actualite1title) {
            acts.push({ title: news.actualite1title, link: news.actualite1link || undefined, color: news.actualite1color || 'teal' })
        }
        if (news.actualite2title) {
            acts.push({ title: news.actualite2title, link: news.actualite2link || undefined, color: news.actualite2color || 'sage' })
        }
        actualites.value = acts
    }
})

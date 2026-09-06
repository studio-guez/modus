export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/media/site/')) {
    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl as string
    const path = to.path.replace('/media/site/', '')
    return navigateTo(`${apiBaseUrl}/media/site/${path}`, {
      external: true,
    })
  }
})

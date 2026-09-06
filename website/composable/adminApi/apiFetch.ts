import type {ApiPowerBIResponse, IApiMenus, IApiNews, IApiPage, IApiProjectTags, IApiProjects} from "~/composable/adminApi/apiDefinitions";

function getBaseUrl(): string {
    const config = useRuntimeConfig()
    const serverUrl = config.apiBaseUrlServer as string
    const publicUrl = config.public.apiBaseUrl as string
    const url = (import.meta.server && serverUrl) ? serverUrl : publicUrl
    return url.endsWith('/') ? url : url + '/'
}

// The API does not send Content-Type: application/json, so $fetch/ofetch does
// not auto-parse the response. Passing responseType:'json' forces JSON parsing.
const JSON_OPTS = { responseType: 'json' as const }

export async function ApiFetchPage(apiPath: string): Promise<IApiPage> {
    return await $fetch(`${getBaseUrl()}${apiPath}.json`, JSON_OPTS) as IApiPage
}

export async function ApiFetchPage_powerBiSubPage(apiPath: string): Promise<IApiPage> {
    return await $fetch(`${getBaseUrl()}${apiPath}.json`, JSON_OPTS) as IApiPage
}

export async function ApiFetchPagePowerBIPage(apiPath: string): Promise<ApiPowerBIResponse> {
    return await $fetch(`${getBaseUrl()}${apiPath}.json`, JSON_OPTS) as ApiPowerBIResponse
}

export async function ApiFetchProjects(apiPath: string): Promise<IApiProjects> {
    return await $fetch(`${getBaseUrl()}${apiPath}.json`, JSON_OPTS) as IApiProjects
}

export async function ApiFetchPagesInfo() {
    return await $fetch(`${getBaseUrl()}pages-info.json`, JSON_OPTS)
}

export async function ApiFetchMenus(): Promise<IApiMenus> {
    return await $fetch(`${getBaseUrl()}menus.json`, JSON_OPTS) as IApiMenus
}

export async function ApiFetchProjectTags(): Promise<IApiProjectTags> {
    return await $fetch(`${getBaseUrl()}project-tags.json`, JSON_OPTS) as IApiProjectTags
}

export async function ApiFetchNews(): Promise<IApiNews> {
    return await $fetch(`${getBaseUrl()}news.json`, JSON_OPTS) as IApiNews
}

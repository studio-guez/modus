import {ApiPowerBIResponse, IApiMenus, IApiNews, IApiPage, IApiProjectTags, IApiProjects} from "~/composable/adminApi/apiDefinitions";

function getBaseUrl(): string {
    const config = useRuntimeConfig()
    const url = config.public.apiBaseUrl as string
    return url.endsWith('/') ? url : url + '/'
}

export async function ApiFetchPage(apiPath: string): Promise<IApiPage> {
    const baseUrl = getBaseUrl()
    return ((await fetch(`${getBaseUrl()}${apiPath}.json`)).json())
}

export async function ApiFetchPage_powerBiSubPage(apiPath: string): Promise<IApiPage> {
    const baseUrl = getBaseUrl()
    return ((await fetch(`${baseUrl}${apiPath}.json`)).json())
}

export async function ApiFetchPagePowerBIPage(apiPath: string): Promise<ApiPowerBIResponse> {
    const baseUrl = getBaseUrl()
    return ((await fetch(`${baseUrl}${apiPath}.json`)).json())
}

export async function ApiFetchProjects(apiPath: string): Promise<IApiProjects> {
    const baseUrl = getBaseUrl()
    return ((await fetch(`${baseUrl}${apiPath}.json`)).json())
}

export async function ApiFetchPagesInfo() {
    const baseUrl = getBaseUrl()
    return ((await fetch(`${baseUrl}pages-info.json`)).json())
}

export async function ApiFetchMenus(): Promise<IApiMenus> {
    const baseUrl = getBaseUrl()
    return ((await fetch(`${baseUrl}menus.json`)).json())
}

export async function ApiFetchProjectTags(): Promise<IApiProjectTags> {
    const baseUrl = getBaseUrl()
    return ((await fetch(`${baseUrl}project-tags.json`)).json())
}

export async function ApiFetchNews(): Promise<IApiNews> {
    const baseUrl = getBaseUrl()
    return ((await fetch(`${baseUrl}news.json`)).json())
}

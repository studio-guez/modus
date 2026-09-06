import {IApiBodyContent_spotify, IApiBodyContent_video} from "~/composable/adminApi/apiDefinitions";

export function findMediaInProject(projectBody: unknown) {
    if ( ! (typeof projectBody === 'string') ) {
        console.error('projectBody must be type of string')
        return null
    }

    const projectBodyParsed = JSON.parse(projectBody) as
        (IApiBodyContent_spotify | IApiBodyContent_video)[]

    return projectBodyParsed.find(item => item.type === 'spotify' || item.type === 'video')
}

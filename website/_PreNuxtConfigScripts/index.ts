import {ApiFetchPagesInfo, ApiFetchProjects} from "../composable/adminApi/apiFetch";
import type {IApiProjects, IApiSiteInfo} from "../composable/adminApi/apiDefinitions";
import { writeFile } from "node:fs/promises";


async function main() {
    const pageData: IApiProjects = await ApiFetchProjects('projects')

    const pageInfo: IApiSiteInfo = await ApiFetchPagesInfo()

    const arrayOfRoutesPages = Object.values(pageInfo.children).map(children => `/${children.slug}`)

    const arrayOfRoutesPagesProject: string[] =  Object.values(pageData.children).map(project => `/project/${project.slug}`)

    const arrayOfRoutes = [...arrayOfRoutesPages, ...arrayOfRoutesPagesProject]

    console.log( arrayOfRoutes )

    const fileContent = `// Généré automatiquement\n\nexport const generatedRoutes: string[] = ${JSON.stringify(arrayOfRoutes, null, 2)};`;

    try {
        // Écrire dans le fichier TypeScript
        await writeFile("./generatedRoutes.ts", fileContent);
        console.log("Routes enregistrées dans 'generatedRoutes.ts'");
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du fichier :", error);
    }
}
main()

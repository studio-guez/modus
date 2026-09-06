export interface IApiPage {
    "options": {
        "headerTitle": string,
        "headerImage": IApiImage | null
        dateStart: string,
        isProjectWithDuration: "true" | "false",
        dateEnd: string,
        projectStatus?: string,
        subpages: IApiPage__subpage[]
        isExternalLink?: boolean,
        externalUrl?: string,
        preview?: string,
    },
    "body": IApiBody,
    title?: {
        value: string
    }
}

export interface IApiPage__subpage {
    content: {
        power_bi_link: string,
        power_bi_pages: string,
        image: string
        power_bi_pages_number: string
        power_bi_pages_title: string
        power_bi_pages_description: string
        power_bi_pages_link: string
        uuid: string
    },
    translations: [],
    children: [],
    files: string[],
    id: string,
    mediaUrl: string,
    mediaRoot: string,
    num: number,
    parent: string,
    slug: string,
    template: {},
    uid: string,
    uri: string,
    url: string
}

export interface IApiPage__subpage__power_bi_pages {
    "page": {
        "content": {
            "title": string
            "power_bi_link": string
            "power_bi_pages": string
            "uuid": string
        },
        "translations": [],
        "children": [],
        "files": string[],
        "id": string,
        "mediaUrl": string,
        "mediaRoot": string,
        "num": number,
        "parent": string,
        "slug": string,
        "template": {},
        "uid": string,
        "uri": string,
        "url": string
    },
    "power_bi_pages": {
        "content": {
            "image": string[],
            "power_bi_pages_number": string,
            "power_bi_pages_title": string,
            "power_bi_pages_description": string,
            "power_bi_pages_link": string,
            "id": string
        },
        "image": {
            "focus": null,
            "caption": string,
            "alt": null,
            "link": null,
            "photoCredit": null,
            "url": string,
            "mediaUrl": string,
            "width": number,
            "height": number,
            "resize": {
                "tiny": string,
                "small": string,
                "reg": string,
                "large": string,
                "xxl": string
            }
        }[]
    }[]
}

export interface IApiBody {
    [key: string]:
    {
        "image": IApiImage[],
        "content": {
            "content": {
                "level": "h2" | "h3",
                "text": string
            },
            "id": string,
            "isHidden": boolean,
            "type": "mdheading"
        }
    }
    |
    {
        "image": IApiImage[],
        content: IApiBodyContent_video
    }
    |
    {
        "image": IApiImage[],
        content: IApiBodyContent_spotify
    }
    |
    {
        "image": IApiImage[],
        "content": {
            "content": {
                image: [
                    "file://MFDDVR1e0EFYnsDD"
                ],
                alt: "",
                caption: ""
            },
            "id": string,
            "isHidden": boolean,
            "type": "mdimage"
        }
    }
    |
    {
        "image": IApiImage[],
        "content": {
            "content": {
                "text": string
            },
            "id": string,
            "isHidden": boolean,
            "type": "simpleText"
        }
    }
    |
    {
        "image": IApiImage[],
        "content": {
            "content": {
                "text": string,
                "alignment": "left" | "center" | "right" | "justify"
            },
            "id": string,
            "isHidden": boolean,
            "type": "body"
        }
    }
    |
    {
        "image": IApiImage[],
        "content": {
            "content": IApiProfiles,
            "id": string,
            "isHidden": boolean,
            "type": "profiles"
        },
        profilesImages: IApiProfilesImages[]
    }
    |
    {
        "image": IApiImage[],
        "content": {
            "content": {
                "image": string[],
                "linktitle": string,
                "text": string,
                "link": string
                "style": "circle" | 'default',
                "width": "true" | 'false',
            },
            "id": string,
            "isHidden": boolean,
            "type": "internalLink"

        }
    }
    |
    {
        image: IApiImage[],
        content: {
            content: {
                image: string[],
                linktitle: string,
                text: string,
                link: string
            },
            id: string,
            isHidden: boolean,
            type: "actuality"
        }
    }
    |
    {
        content: {
            content: {
                title: string,
                links: {
                    name: "Instagram.com, Genève en selle",
                    url: "https://www.instagram.com/geneve_en_selle/"
                }[]
            },
            id: string,
            isHidden: boolean,
            type: "linksSection"
        }
    }
    |
    {
        content: {
            content: {
                title: string,
                dropdown_content: string
                dropdown_intro: string
            },
            id: string,
            isHidden: false,
            type: "dropdown"
        },
    }
    |
    {
        content: {
            content: {
                title: string,
            },
            id: string,
            isHidden: boolean,
            type: "navigateProjectsByTags"
        },
    }
    |
    {
        image: IApiImage[],
        content: {
            content: {
                sectiontitle: string,
                sectionsubtitle: string,
                image: string[],
                cards: {
                    title: string,
                    subtitle: string,
                    slug: string,
                    color: 'green-light' | 'green-medium' | 'green-dark',
                    buttontext: string
                }[]
            },
            id: string,
            isHidden: boolean,
            type: "internalLinks"
        },
    }
    |
    {
        image: IApiImage[],
        highlightsItems: IApiSingleProject[],
        content: {
            content: {
                highlightstitle: string,
                highlightssubtitle: string,
                highlightsitems: string,
            },
            id: string,
            isHidden: boolean,
            type: "highlights"
        },
    }
}

export interface IApiBodyContent_video {
    content: {
        url: string,
        caption?: string
        credits?: string
        date?: string
    },
    id: string,
    isHidden: false,
    type: "video"
}

export interface IApiBodyContent_spotify {
    content: {
        url: string,
        caption?: string
        credits?: string
        date?: string
    },
    id: string,
    isHidden: false,
    type: "spotify"
}


export interface IApiProfiles {
    "title": string,
    "profiles": {
        "image": string[],
        "name": string,
        "description": string,
        "profiledescription": string
    }[]
}

export interface IApiProfilesImages {
    content: {
        description: string,
        profiledescription: string,
        id: string,
        image: string[],
        name: string
        link?: string
    },
    image: IApiImage[]
}


export interface IApiImage {
    /** like 54.5% 45.8% */
    "focus": string
    "caption": string,
    "alt": string | null,
    "link": string | null,
    "photoCredit": string | null,
    "url": string,
    "mediaUrl": string,
    "width": number,
    "height": number,
    "resize": {
        "tiny": string,
        "small": string,
        "reg": string,
        "large": string,
        "xxl": string
    }
}

export interface IApiTag {
    slug: string,
    name: string,
}

export interface IApiProjectTags {
    tags: IApiTag[]
}

export interface IApiProjects {
    "options": {
        "headerTitle": string,
        "headerImage": IApiImage | null,
        "preview": string,
        "availableTags"?: IApiTag[],
    },
    "children": {
        [key: string]: IApiSingleProject
    }
}

export interface IApiSingleProject {
    "headerImage": IApiImage[],
    slug: string
    "content": {
        "title": string,
        "headerimage": string,
        "headertitle": string,
        "body": IApiBody,
        "pdffile": string,
        "uuid": string,
        datestart: string,
        isprojectwithduration: "true" | "false",
        dateend: string,
        tags?: IApiTag[],
        // Tag page aggregation field (from tag.json.php)
        pageType?: 'media' | 'report' | 'project',
    }
}

export interface IApiSiteInfo {
    "title": {
        "value": string
    },
    "children": IApiSiteInfoChildren[]
}

export interface IApiSiteInfoChildren {
    "children": {
        "data": []
    },
    "title": {
        "value": string
    },
    "headerimage": {
        "value": string
    },
    "headertitle": {
        "value": string
    },
    "id": string,
    "mediaUrl": string,
    "mediaRoot": string,
    "num": number,
    "parent": null,
    "slug": string,
    "template": {},
    "translations": {
        "data": []
    },
    "uid": string
    "uri": string
    "url": string
}

export interface PowerBIPage {
    title: string;
    power_bi_link: string;
    power_bi_pages?: string; // Optionnel
    uuid: string;
}

export interface Page {
    content: PowerBIPage;
    translations?: unknown[]; // Type inconnu mais explicite
    children?: unknown[];
    files?: unknown[];
    id: string;
    mediaUrl: string;
    mediaRoot: string;
    num: number;
    parent: string;
    slug: string;
    template?: Record<string, unknown>; // Objet générique
    uid: string;
    uri: string;
    url: string;
}

export interface ApiPowerBIResponse {
    page: Page;
    power_bi_pages?: ApiPowerBIResponse__power_bi_page[]; // Optionnel
}

export interface ApiPowerBIResponse__power_bi_page {
    content: {
        image: string[],
        power_bi_pages_number: string,
        power_bi_pages_title: string,
        power_bi_pages_description: string,
        power_bi_pages_link: string,
        power_bi_pages_number_descritpion: string,
        id: string
    },
    image: IApiImage[]
}

// Menu system types
export interface IApiMenuItem {
    type: 'page' | 'external'
    url: string
    title: string
    svgUrl: string | null
    openInNewTab: boolean
    children?: IApiMenuItem[]
}

export interface IApiMenus {
    topMenu: IApiMenuItem[]
    mainMenu: IApiMenuItem[]
    bottomMenu: IApiMenuItem[]
    footerMenu: IApiMenuItem[]
}

export interface IApiNews {
    actualite1title: string | null
    actualite1link: string | null
    actualite1color: string
    actualite2title: string | null
    actualite2link: string | null
    actualite2color: string
}

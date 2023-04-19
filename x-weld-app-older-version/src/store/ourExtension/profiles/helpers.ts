import { profiles } from ".";
import { PrintingDiapason, PrintingDiapasonProcessor, Profile, ProfileAdditionalParameters, ProfileMainParameters, ProfileOscilationParameters, ProfilesMetadata, ProfileWeldParameters } from "./types";

export const isSatisfiesProfilesMetadataType = (data: any): Boolean => {
    const mockProfilesMetadata: ProfilesMetadata = {
        gas: [],
        oscilationTypes: [],
        weldTypes: [],
        wireDiameters: []
    }
    const keys = Object.keys(mockProfilesMetadata)
    for (const key in data) {
        const index = keys.indexOf(key);
        if (index != -1) {
            keys.splice(index, 1)
        }
    }
    return keys.length === 0
}

export const isSatisfiesProfileType = (data: any): Boolean => {
    const mockProfile: Profile = {
        name: "",
        profileAdditionalParameters: {} as ProfileAdditionalParameters,
        profileMainParameters: {} as ProfileMainParameters,
        profileOscilationParameters: {} as ProfileOscilationParameters,
        profileWeldParameters: {} as ProfileWeldParameters
    }
    const keys = Object.keys(mockProfile)
    for (const key in data) {
        const index = keys.indexOf(key);
        if (index != -1) {
            keys.splice(index, 1)
        }
    }
    return keys.length === 0
}

export const getSortedMapKeys = (map: Map<string, any>) => {
    return Array.from(map.keys()).sort()
}

export const getRootDiapason = (diapasonList?: PrintingDiapason[]): PrintingDiapason | undefined => {
    if (diapasonList) {
        for (const diapason of diapasonList) {
            if (diapason.isRootDiapason) {
                return diapason;
            }
        }
    }
}

export const getProfilesNames = (profiles: Profile[]): string[] => {
    const names = []
    for (const profile of profiles) {
        names.push(profile.name)
    }
    return names.sort()
}


export const printingDiapasonProcessor: PrintingDiapasonProcessor = {
    hasNext(printingDiapason: PrintingDiapason): boolean {
        return Boolean(printingDiapason.nextDiapason)
    },

    hasPrev(printingDiapason: PrintingDiapason): boolean {
        return Boolean(printingDiapason.prevDiapason)
    },

    next(printingDiapason: PrintingDiapason): PrintingDiapason | null {
        if (printingDiapason.nextDiapason) {
            return printingDiapason.nextDiapason
        } else {
            return null
        }
    },

    prev(printingDiapason: PrintingDiapason): PrintingDiapason | null {
        if (printingDiapason.prevDiapason) {
            return printingDiapason.prevDiapason
        } else {
            return null
        }
    },

    createNext(printingDiapason: PrintingDiapason) {
        let newPrintingDiapason: PrintingDiapason = {
            isRootDiapason: false,
            profile: printingDiapason.profile
        }

        newPrintingDiapason = JSON.parse(JSON.stringify(newPrintingDiapason))

        if (printingDiapason.nextDiapason) {
            const nextDiapason = printingDiapason.nextDiapason;
            printingDiapason.nextDiapason = newPrintingDiapason;
            newPrintingDiapason.prevDiapason = printingDiapason;
            newPrintingDiapason.nextDiapason = nextDiapason;
            nextDiapason.prevDiapason = newPrintingDiapason;
        } else {
            printingDiapason.nextDiapason = newPrintingDiapason;
            newPrintingDiapason.prevDiapason = printingDiapason;
        }
    },

    deleteCurrent(printingDiapason: PrintingDiapason) {
        if (!printingDiapason.isRootDiapason) {
            if (printingDiapason.prevDiapason && printingDiapason.nextDiapason) {
                printingDiapason.prevDiapason.nextDiapason = printingDiapason.nextDiapason;
                printingDiapason.nextDiapason.prevDiapason = printingDiapason.prevDiapason;
                return printingDiapason.nextDiapason
            } else if (printingDiapason.prevDiapason) {
                printingDiapason.prevDiapason.nextDiapason = null
                return printingDiapason.prevDiapason
            } else if (printingDiapason.nextDiapason) {
                printingDiapason.nextDiapason.prevDiapason = null
                return printingDiapason.nextDiapason
            } else {
                return printingDiapason
            }
        } else {
            return printingDiapason
        }
    },

    getRootDiapason(printingDiapason): PrintingDiapason {
        if (printingDiapason.isRootDiapason) return printingDiapason
        let rootDiapason = this.searchInNextDiapasones(printingDiapason)
        if (rootDiapason) return rootDiapason
        rootDiapason = this.searchInPrevDiapasones(printingDiapason)
        if (rootDiapason) return rootDiapason;
        return printingDiapason;
    },

    searchInPrevDiapasones(printingDiapason: PrintingDiapason): PrintingDiapason | null {
        const prevDiapason = printingDiapason.prevDiapason
        if (prevDiapason) {
            if (prevDiapason.isRootDiapason) {
                return prevDiapason
            } else {
                return this.searchInPrevDiapasones(prevDiapason)
            }
        } else {
            return null;
        }
    },

    searchInNextDiapasones(printingDiapason: PrintingDiapason): PrintingDiapason | null {
        const nextDiapason = printingDiapason.nextDiapason
        if (nextDiapason) {
            if (nextDiapason.isRootDiapason) {
                return nextDiapason
            } else {
                return this.searchInNextDiapasones(nextDiapason)
            }
        } else {
            return null;
        }
    },

    deleteAll(printingDiapason: PrintingDiapason): PrintingDiapason {
        const rootDiapason = this.getRootDiapason(printingDiapason)
        let nextDiapason = rootDiapason.nextDiapason;
        rootDiapason.nextDiapason = null;
        while(true) {
            if (nextDiapason && !nextDiapason.isRootDiapason) {
                nextDiapason.prevDiapason = null;
                let nextNextDiapson = nextDiapason.nextDiapason
                nextDiapason.nextDiapason = null;
                nextDiapason = nextNextDiapson;
            } else {
                break;
            }
        }
        let prevDiapason = rootDiapason.prevDiapason;
        rootDiapason.prevDiapason = null;
        while(true) {
            if (prevDiapason && !prevDiapason.isRootDiapason) {
                prevDiapason.nextDiapason = null;
                let prevPrevDiapson = prevDiapason.prevDiapason
                prevDiapason.prevDiapason = null;
                prevDiapason = prevPrevDiapson;
            } else {
                break;
            }
        }

        return rootDiapason
    },
}

const paramNameByPath = new Map([
    ['profile.profileMainParameters.current', 'Ток, А'],
    ['profile.profileMainParameters.voltage', 'Напряжение, В'],
    ['profile.profileMainParameters.feedRate', 'V подачи, м/мин'],
    ['profile.profileAdditionalParameters.arcLength', 'Длина дуги'],
    ['profile.profileAdditionalParameters.dynamic', 'Динамика'],
    ['profile.profileAdditionalParameters.weldingSpeed', 'V наплавки, м/мин'],
    ['profile.profileOscilationParameters.width', 'Ширина, мм'],
    ['profile.profileOscilationParameters.period', 'Период, мм']
]) 

export const resolveParamNameByPath = (path: string) => {
    const name = paramNameByPath.get(path);
    if (!name) {
        return 'хз че за параметер'
    }
    return name
}

const iconByProfileName = new Map([
    ['Конструкционные стали', 'Fe-C'],
    ['Нержавеющие стали', 'Cr-Ni'],
    ['Никелевые сплавы', 'Ni'],
    ['Титановые сплавы', 'Ti'],
    ['Алюминиево-магниевые сплавы', 'Al-Mg'],
    ['Медные сплавы', 'Cu']
])

export const resolveIconByProfileName = (name: string) => {
    let icon = iconByProfileName.get(name)
    if (!icon) {
        icon = ''
    }
    return icon
}
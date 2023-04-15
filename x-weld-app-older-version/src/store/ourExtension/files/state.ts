import { LightFilesState } from "./types";

export const defaultState = (): LightFilesState => {
    return {
        dirs: [],
        files: [],
        recursiveFlag: [],
        fileSystem: {
            gcodes: new Map(),
            config: new Map()
        },
        isLoadingFinish: true
    }
}

export const state = defaultState();
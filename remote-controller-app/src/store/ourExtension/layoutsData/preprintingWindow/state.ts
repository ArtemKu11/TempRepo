import { PreprintingWindowState } from "./types"

export const defaultState = (): PreprintingWindowState => {
    return {
        a1Coords: {
            x: 0,
            y: 0,
            z: 0
        },
        a2Coords: {
            x: 0,
            y: 0,
            z: 0
        },
        b1Coords: {
            x: 0,
            y: 0,
            z: 0
        },
        b2Coords: {
            x: 0,
            y: 0,
            z: 0
        },
        dispacement: {
            x: 0,
            y: 0,
            z: 0
        },
        rotateAngle: 0,
        scale: 1
    }
}

export const state = defaultState()
import { FileData } from "../../files/types"

export interface PreprintingWindowState {
    a1Coords: UsualCoords
    a2Coords: UsualCoords
    b1Coords: UsualCoords
    b2Coords: UsualCoords
    dispacement: UsualCoords
    rotateAngle: number
    scale: number
    file?: FileData | null
}

export interface UsualCoords {
    x: number,
    y: number,
    z: number
}
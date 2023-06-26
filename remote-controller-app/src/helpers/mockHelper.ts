import { FileData, GcodePrintingProfiles } from "@/store/ourExtension/files/types";
import { PrintingDiapason } from "@/store/ourExtension/profiles/types";
import { Profile } from "@/store/ourExtension/profiles/types";

export class MockHelper {

    // Неизвестные значения соответствуют действительности (именно так и будет, если будет undefined)
    getFileDataMock(): FileData {
        return {
            name: "printing_file.gcode",
            modified: "--.--.----",
            permissions: "rw",
            size: 0,
            sizeInKb: "?",
            computedSize: "?",
            layers: "?",
            printingTime: "?h:?m",
            isSelected: false,
            pathForMoonraker: "printing_file.gcode",
            dirnameForMoonraker: "",
            profiles: this.getGcodePrintingProfilesMock()
        }
    }

    getProfileMock(): Profile {
        return {
            name: "Оффлайн-профиль",
            profileMainParameters: {
                current: 15,
                feedRate: 5,
                voltage: 220,
            },
            profileAdditionalParameters: {
                arcLength: 1,
                dynamic: 2,
                weldingSpeed: 0.5
            },
            profileOscilationParameters: {
                period: 2,
                type: "Синус",
                width: 5
            },
            profileWeldParameters: {
                gas: "Ag",
                material: "Fe-C",
                method: "MIG",
                wireDiameter: 0.8
            }
        }
    }

    getGcodePrintingProfilesMock(): GcodePrintingProfiles {
        return {
            profiles: this.getProfilesMapMock(),
        }
    }

    getProfilesMapMock(): Map<string, PrintingDiapason> {
        const profiles = new Map()
        profiles.set(this.getProfileMock().name, this.getPrintingDiapasonMock())
        return profiles
    }

    getPrintingDiapasonMock(): PrintingDiapason {
        return {
            profile: this.getProfileMock(),
            isRootDiapason: true,
        }
    }
}

export const mockHelper = new MockHelper()
import { PrintingDiapason } from "../../profiles/types"
import { InfoAlertType } from "./types"

export class AlertsProcessor {
    dispatch: Function | null = null

    addDiapasonAlert(layersText: string) {
        if (!this.dispatch) return
        const alert: InfoAlertType = {
            message: `Диапазон добавлен ${layersText}`,
            type: 'green',
            time: 1500
        }
        this.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
    }

    diapasonSelectedAlert(layersText: string) {
        if (!this.dispatch) return
        const alert: InfoAlertType = {
            message: `Выбран диапазон ${layersText}`,
            type: 'green',
            time: 1500
        }
        this.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
    }

    deleteDiapasonAlert(deletedDiapason: PrintingDiapason) {
        if (!this.dispatch) return
        const alert: InfoAlertType = {
            message: `Удален диапазон (${deletedDiapason.firstLayer} - ${deletedDiapason.lastLayer})`,
            type: 'red',
            time: 1500
        }
        this.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
    }

    deleteAllDiapasonesAlert() {
        if (!this.dispatch) return
        const alert: InfoAlertType = {
            message: `Удалены все диапазоны кроме первого`,
            type: 'red',
            time: 1500
        }
        this.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
    }

    lastPrintingProfileSelectedAlert(layersText?: string) {
        if (!this.dispatch) return
        let message = `Выбран профиль последней печати`
        if (layersText) {
            message += ` ${layersText}`
        }
        const alert: InfoAlertType = {
            message: message,
            type: 'green',
            time: 2000
        }
        this.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
    }

    profileSelectedAlert(profileName: string, layersText?: string) {
        if (!this.dispatch) return
        let message = `Выбран профиль: ${profileName}`
        if (layersText) {
            message += ` ${layersText}`
        }
        const alert: InfoAlertType = {
            message: message,
            type: 'green',
            time: 2000
        }
        this.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
    }

    showInfoAlert(alert: InfoAlertType) {
        if (!this.dispatch) return
        this.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
    }
}

export const Alerts = new AlertsProcessor()

// export const Alerts = {
//     get dispatch(): Function {
//         return this.dispatch
//     },

//     set dispatch(dispatch: Function) {
//         this.dispatch = dispatch
//     },

//     addDiapasonAlert(layersText: string) {
//         const alert: InfoAlertType = {
//             message: `Диапазон добавлен ${layersText}`,
//             type: 'green',
//             time: 1500
//         }
//         this.dispatch('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
//     },

//     diapasonSelectedAlert(dispatchFunc: Function, layersText: string) {
//         const alert: InfoAlertType = {
//             message: `Выбран диапазон ${layersText}`,
//             type: 'green',
//             time: 1500
//         }
//         dispatchFunc('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
//     },

//     deleteDiapasonAlert(dispatchFunc: Function, deletedDiapason: PrintingDiapason) {
//         const alert: InfoAlertType = {
//             message: `Удален диапазон (${deletedDiapason.firstLayer} - ${deletedDiapason.lastLayer})`,
//             type: 'red',
//             time: 1500
//         }
//         dispatchFunc('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
//     },

//     deleteAllDiapasonesAlert(dispatchFunc: Function) {
//         const alert: InfoAlertType = {
//             message: `Удалены все диапазоны кроме первого`,
//             type: 'red',
//             time: 1500
//         }
//         dispatchFunc('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
//     },

//     lastPrintingProfileSelectedAlert(dispatchFunc: Function, layersText?: string) {
//         let message = `Выбран профиль последней печати`
//         if (layersText) {
//             message += ` ${layersText}`
//         }
//         const alert: InfoAlertType = {
//             message: message,
//             type: 'green',
//             time: 2000
//         }
//         dispatchFunc('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
//     },

//     profileSelectedAlert(dispatchFunc: Function, profileName: string, layersText?: string) {
//         let message = `Выбран профиль: ${profileName}`
//         if (layersText) {
//             message += ` ${layersText}`
//         }
//         const alert: InfoAlertType = {
//             message: message,
//             type: 'green',
//             time: 2000
//         }
//         dispatchFunc('ourExtension/layoutsData/alerts/showInfoAlert', alert, { root: true })
//     }
// }
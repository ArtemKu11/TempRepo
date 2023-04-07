import { MainWindowState } from "./types";

export const mainWindowState = (): MainWindowState => {
    return {
        buttonList: [
            {
                buttonId: 0,
                buttonName: "Открыть файл",
                buttonImage: require("@/layouts/main_window_layout/img/open_file_icon.png")
            },

            {
                buttonId: 1,
                buttonName: "Допечатная подготовка",
                buttonImage: require("@/layouts/main_window_layout/img/move_icon.png")
            },

            {
                buttonId: 2,
                buttonName: "Конфигурация",
                buttonImage: require("@/layouts/main_window_layout/img/config_icon.png")
            },

            {
                buttonId: 3,
                buttonName: "Печать",
                buttonImage: require("@/layouts/main_window_layout/img/print_icon.png")
            }
        ]
    }
}

export const state = mainWindowState();
import { MainWindowState } from "./types";

export const mainWindowState = (): MainWindowState => {
    return {
        buttonList: [
            {
                buttonName: "Открыть файл",
                buttonImage: require("@/layouts/main_window_layout/img/open_file_icon.png")
            },

            {
                buttonName: "Допечатная подготовка",
                buttonImage: require("@/layouts/main_window_layout/img/move_icon.png")
            },

            {
                buttonName: "Конфигурация",
                buttonImage: require("@/layouts/main_window_layout/img/config_icon.png")
            },

            {
                buttonName: "Печать",
                buttonImage: require("@/layouts/main_window_layout/img/print_icon.png")
            }
        ]
    }
}

export const state = mainWindowState();
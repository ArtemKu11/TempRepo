import { FileBrowseWindowState } from "./types";

export const fileBrowserWindowState = () : FileBrowseWindowState => {
    return {
        fileList: [
            {
                fileId: 0,
                name: "some_file.gcode",
                date: "03.04.23",
                size: 12,
                isActive: false
            },
            {
                fileId: 1,
                name: "some_file1.gcode",
                date: "03.04.23",
                size: 12,
                isActive: false
            },
            {
                fileId: 2,
                name: "some_file2.gcode",
                date: "03.04.23",
                size: 12,
                isActive: false
            }
        ]
    }
};

export const state = fileBrowserWindowState();
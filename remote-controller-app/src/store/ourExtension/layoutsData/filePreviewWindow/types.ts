import { FileData } from "../../files/types";
import { PrintingDiapason } from "../../profiles/types";

export interface FilePreviewWindowState {
    fileData?: FileData,
    selectedDiapason: PrintingDiapason | null
}
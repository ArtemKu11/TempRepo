export interface MainWindowState {
    buttonList: Array<MainWindowButtonInfo>
}

export interface MainWindowButtonInfo {
    buttonId: number,
    buttonName: string,
    buttonImage: string
    activeButtonImage?: string
}
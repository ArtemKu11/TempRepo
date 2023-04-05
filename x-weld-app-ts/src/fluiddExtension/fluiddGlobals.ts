export const Globals = Object.freeze({
    NETWORK_REQUEST_TIMEOUT: 0,
    SOCKET_PING_INTERVAL: 10000,
    MOONRAKER_DB: {
        fluidd: {
            NAMESPACE: 'fluidd',
            ROOTS: {
                uiSettings: { name: 'uiSettings', dispatch: 'config/initUiSettings' },
                macros: { name: 'macros', dispatch: 'macros/initMacros' },
                console: { name: 'console', dispatch: 'console/initConsole' },
                charts: { name: 'charts', dispatch: 'charts/initCharts' },
                cameras: { name: 'cameras', dispatch: 'cameras/initLegacyCameras' },
                layout: { name: 'layout', dispatch: 'layout/initLayout' }
            }
        },
        // webcams: {
        //   NAMESPACE: 'webcams',
        //   ROOTS: {
        //     webcams: { dispatch: 'cameras/initCameras' }
        //   }
        // }
    },
    SOCKET_RETRY_DELAY: 2000,
    KLIPPY_RETRY_DELAY: 1500,
    CONSOLE_RECEIVE_PREFIX: '',
    FILTERED_FILES_PREFIX: ['.thumbs', 'thumbs'],
    FILTERED_FILES_EXTENSION: ['.ignoreme'],
})
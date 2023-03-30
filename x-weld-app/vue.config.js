const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                @use "sass:math";
                @import "@/layouts/base_layout/css/base_layout.scss";
                `,
            },
        }
    }
})

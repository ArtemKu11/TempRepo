import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'


import MainWindow from '@/components/mainWindow/MainWindow.vue'



Vue.use(VueRouter)


const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'MainWindow',
        component: MainWindow
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'


import FileSelectWindow from '@/components/fileSelectWindow/FileSelectWindow.vue'
import PrintWindow from '@/components/printWindow/PrintWindow.vue'
import OscillationWindow from '@/components/oscillationWindow/OscillationWindow.vue'




Vue.use(VueRouter)


const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'FileSelectWindow',
        component: FileSelectWindow
    },

    {
        path: '/print',
        name: 'PrintWindow',
        component: PrintWindow
    },

    {
        path: '/osc',
        name: 'OscillationWindow',
        component: OscillationWindow
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
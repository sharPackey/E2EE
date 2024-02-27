import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from "@/components/LoginPage.vue";
import ChatPage from "@/components/ChatPage.vue";
import Register from "@/components/Register";
import GroupChatPage from "@/components/GroupChatPage.vue";
import cView from "../views/chatview.vue";

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/cview',
        name: 'cview',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: cView,
        children:[
            {
                path:'',
                component: ()=>import("@/components/HelloWorld.vue")
            },
            {
                path: 'groupchat',
                name: 'groupChat',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: GroupChatPage
            },
            {
                path: 'chat',
                name: 'Chat',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: ChatPage
            },
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router

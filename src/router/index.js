import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue"
import Signup from '../views/Signup.vue'
import HomeLayout from "../layout/HomeLayout.vue";
import Profile from "../views/Profile.vue";


const routes = [
  { path: '/', component: HomeLayout , 
    children : [
     {
        path : '/',
        component : Home
     },
     {
        path : '/profile',
        component : Profile
     }
    ]
  },
  { path: '/login', component: Login },
  { path: '/register', component: Signup }
]

const router = createRouter({
  history : createWebHistory(),
  routes
})

export default router;
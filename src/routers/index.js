import Vue from "vue"
import VueRouter from "vue-router"

import * as ErrorView from "@/views/error"
import { routerT } from "@/setup/i18n-setup"

import tenant from "@/routers/tenant/index"
import admin from "@/routers/admin/index"

Vue.use(VueRouter)

const routes = [
  admin,
  tenant,
  {
    path: "/",
    name: "root",
    component: () => import("@/components/container/ContainerRoot"),
    redirect: {name: "app-list"},
    meta: { title: routerT("router.console") },
    children: [
      {
        path: "console",
        name: "console",
        component: () => import("@/views/console/Index")
      },{
        path:"changePassword",
        name:"changePassword",
        component:()=>import("@/views/auth/ChangePassword")
      }
    ]
  },

  {
    path: "/app-list",
    name: "app-list",
    meta: { title: "产品列表" },
    component: () => import("@/views/auth/appList")
  },

  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/Login"),
    meta: { title: routerT("router.login") }
  },

  {
    path: "/register",
    name: "register",
    component: () => import("@/views/auth/Register"),
    meta: { title: "商户注册"}
  },

  {
    path: "/tpbind",
    name: "tpbind",
    component: () => import("@/views/auth/TpBind"),
    meta: { title: "第三方绑定" }
  },

  {
    path: "/403",
    name: "403",
    component: ErrorView.Error403,
    meta: { title: 403 }
  },

  {
    path: "/404",
    name: "404",
    component: ErrorView.Error404,
    meta: { title: 404 }
  },

  {
    path: "/500",
    name: "500",
    component: ErrorView.Error500,
    meta: { title: 500 }
  },

  {
    path: "*",
    redirect: {name: "404"}
  }

]

export default new VueRouter({
  mode: "hash",
  scrollBehavior: () => ( { y: 0 } ),
  routes
})


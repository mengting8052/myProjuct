/**
 *  应用管理模块
 *
 */

import FrontendSystem from "./frontend-system"
import BackgroundModule from "./background-module"


const routers = {
  path: "module-manage",
  name: "module-manage",
  component: () => import("@/components/container/ContainerBase.vue"),
  children: [
    FrontendSystem,
    BackgroundModule
  ]
}

export default routers

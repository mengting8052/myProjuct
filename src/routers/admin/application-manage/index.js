/**
 *  应用管理模块
 *
 */

import ProductManage from "./product-manage"
import BusinessFunctionManage from "./business-function-manage"


const routers = {
  path: "application-manage",
  name: "application-manage",
  component: () => import("@/components/container/ContainerBase"),
  children: [
    ProductManage,
    BusinessFunctionManage
  ]
}

export default routers

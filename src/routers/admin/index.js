/**
 * 管理员路由集合地
 */

import applicationManage from "@/routers/admin/application-manage/index"
import moduleManage from "@/routers/admin/module-manage/index"
import authorityManage from "@/routers/admin/authority-manage/index"
import userManage from "@/routers/admin/user-manage/index"
import merchantManage from "@/routers/admin/merchant-manage/index"
import merchantVerify from "@/routers/admin/merchant-verify"
import Settings from "@/routers/admin/redis/index"

/**
 *   管理员子路由存放于数组
 */
const children = [ applicationManage, moduleManage, authorityManage, userManage, merchantManage, merchantVerify, Settings ];

const routers = {
  path: "/",
  name: "",
  component: () => import("@/components/container/ContainerRoot.vue"),
  children: children
}

export default routers

/**
 *  前端系统
 *
 */

const routers = {
  path: "frontend-system",
  name: "frontend-system",
  component: () => import("@/views/admin/module-manage/frontend-system/FrontendSystem")
}

export default routers

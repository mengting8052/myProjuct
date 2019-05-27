/**
 *  前端系统
 *
 */

const routers = {
  path: "background-module",
  name: "background-module",
  component: () => import("@/views/admin/module-manage/background-module/BackgroundModule")
}

export default routers

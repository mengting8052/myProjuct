import {
  routerT
} from "@/setup/i18n-setup"

const router = {
  path: "business-function-manage",
  name: "business-function-manage",
  component: () => import("@/components/container/ContainerBase"),
  redirect: {
    name: "business-function-list",
  },

  children: [
    //业务功能管理列表
    {
      path: "/",
      name: "business-function-list",
      meta: {
        title: routerT("router.admin.applicationManage.business.businessManage"),
        redirect: true,
      },
      component: () => import("@/views/admin/application-manage/business-function-manage/BusinessFunctionList")
    },
    //业务功能管理 - 新增功能
    {
      path: "create",
      name: "create-business-function",
      meta: {
        title: routerT("router.admin.applicationManage.business.add"),
        redirect: true
      },
      component: () => import("@/views/admin/application-manage/business-function-manage/CreateBusinessFunction")
    },
    //业务功能管理 - 新增功能
    {
      path: "edit",
      name: "edit-business-function",
      meta: {
        title: routerT("router.admin.applicationManage.business.edit"),
        redirect: true
      },
      component: () => import("@/views/admin/application-manage/business-function-manage/EditBusinessFunction")
    },
    //菜单排序
    {
      path: "menusort",
      name: "menu-sort",
      meta: {
        title: routerT("router.admin.applicationManage.business.sortMenu"),
        redirect: true
      },
      component: () => import("@/views/admin/application-manage/business-function-manage/MenuSort")
    },
  ]
}

export default router

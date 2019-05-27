import { routerT } from "@/setup/i18n-setup"

const routers = {
  path: "role-manage",
  name: "role-manage",
  component: () => import("@/components/container/ContainerBase"),
  meta: {
    title: routerT("router.tenant.roleManage.roleManage")
  },
  redirect: {
    name: "role-manage-list"
  },
  children: [
    {
      meta: {
        title: routerT("router.tenant.roleManage.list"),
        redirect: true
      },
      path: "/",
      name: "role-manage-list",
      component: () => import("@/views/tenant/role-manage/RoleManage")
    },{
      meta: {
        title:routerT("router.tenant.roleManage.add"),
        redirect: true
      },
      path:"create",
      name:"role-add",
      component: () => import("@/views/tenant/role-manage/RoleAdd")
    },{
      meta: {
        title: routerT("router.tenant.roleManage.edit"),
        redirect: true
      },
      path:"edit",
      name:"role-edit",
      component: () => import("@/views/tenant/role-manage/RoleEdit")
    }
  ]
}

export default routers

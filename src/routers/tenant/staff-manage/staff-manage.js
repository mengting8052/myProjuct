import {
  routerT
} from "@/setup/i18n-setup"

const routers = {
  path: "staff-manage",
  name: "staff-manage",
  component: () => import("@/components/container/ContainerBase"),
  redirect: {
    name: "staff-manage-list"
  },
  children: [{
      meta: {
        title: routerT("router.tenant.staffManage.list"),
        redirect: true
      },
      path: "/",
      name: "staff-manage-list",
      component: () => import("@/views/tenant/staff-manage/StaffManage")
    },
    {
      meta: {
        title: routerT("router.tenant.staffManage.add"),
        redirect: true
      },
      path: "create",
      name: "staff-add",
      component: () => import("@/views/tenant/staff-manage/StaffAdd")
    }, {
      meta: {
        title: routerT("router.tenant.staffManage.edit"),
        redirect: true
      },
      path: "edit",
      name: "staff-edit",
      component: () => import("@/views/tenant/staff-manage/StaffEdit")
    }
  ]

}

export default routers

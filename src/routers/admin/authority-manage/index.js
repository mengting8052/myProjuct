import {
  routerT
} from "@/setup/i18n-setup"

const routers = {
  path: "authority-manage",
  name: "authority-manage",
  component: () => import("@/components/container/ContainerBase"),
  redirect: {
    name: "authority-list"
  },
  children: [{
      path: "/",
      name: "authority-list",
      meta: {
        title:routerT("router.admin.authorityManage.authorityList"),
        redirect: true
      },
      component: () => import("@/views/admin/authority-manage/AuthorityList")
    },
    {
      path: "create",
      name: "authority-add",
      meta: {
        title:routerT("router.admin.authorityManage.add"),
        redirect: true
      },
      component: () => import("@/views/admin/authority-manage/add")
    },
    {
      path: "edit",
      name: "authority-edit",
      meta: {
        title: routerT("router.admin.authorityManage.edit"),
        redirect: true
      },
      component: () => import("@/views/admin/authority-manage/edit")
    }
  ],
}

export default routers

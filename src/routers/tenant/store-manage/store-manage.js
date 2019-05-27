import {routerT} from "@/setup/i18n-setup"

const routers = {
  path: "store-manage",
  name: "store-manage",
  component: () => import("@/components/container/ContainerBase"),
  redirect: {
    name: "store-manage-list"
  },
  children: [
    {
      meta: {
        title: routerT("router.tenant.storeManage.list"),
        redirect: true
      },
      path: "/",
      name: "store-manage-list",
      component: () => import("@/views/tenant/store-manage/List"),
    }, 
    {
      meta: {
        title: routerT("router.tenant.storeManage.add"),
        redirect: true
      },
      path: "create",
      name: "store-manage-create",
      component: () => import("@/views/tenant/store-manage/CreateOrUpdate"),
    },
    {
      meta: {
        title: routerT("router.tenant.storeManage.edit"),
        redirect: true
      },
      path: "edit/:id",
      name: "store-manage-edit",
      component: () => import("@/views/tenant/store-manage/CreateOrUpdate"),
    }
  ]
}
export default routers

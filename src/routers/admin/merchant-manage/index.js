import {
  routerT
} from "@/setup/i18n-setup"

const routers = {
  path: "merchant-manage",
  name: "merchant-manage",
  component: () => import("@/components/container/ContainerBase"),
  redirect: { name: "merchant-list" },
  children: [
    {
      path: "/",
      name: "merchant-list",
      meta: {
        title: routerT("router.admin.merchantManage.merchantList"),
        redirect: true
      },
      component: () => import("@/views/admin/merchant-manage/MerchantList")
    },
    {
      path:"create",
      name:"tenant-add",
      meta: {
        title:routerT("router.admin.merchantManage.add"),
        redirect: true
      },
      component: () => import("@/views/admin/merchant-manage/add")
    },
    {
      path:"edit",
      name:"tenant-edit",
      meta: {
        title:routerT("router.admin.merchantManage.edit"),
        redirect: true
      },
      component: () => import("@/views/admin/merchant-manage/edit")
    }
  ]
}

export default routers

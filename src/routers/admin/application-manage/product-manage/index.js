import {
  routerT
} from "@/setup/i18n-setup"

const router = {
  path: "product-manage",
  name: "product-manage",
  component: () => import("@/components/container/ContainerBase"),
  redirect: {
    name: "product-list"
  },
  children: [{
      path: "/",
      name: "product-list",
      meta: {
        title: routerT("router.admin.applicationManage.product.productManage"),
        redirect: true
      },
      component: () => import("@/views/admin/application-manage/product-manage/List")
    },
    {
      path: "create",
      name: "product-create",
      meta: {
        title: routerT("router.admin.applicationManage.product.add"),
        redirect: true
      },
      component: () => import("@/views/admin/application-manage/product-manage/CreateOrUpdate")
    },
    {
      path: "edit/:id",
      name: "product-edit",
      meta: {
        title: routerT("router.admin.applicationManage.product.edit"),
        redirect: true
      },
      component: () => import("@/views/admin/application-manage/product-manage/CreateOrUpdate")
    }
  ]
}

export default router

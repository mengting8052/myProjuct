import {
  routerT
} from "@/setup/i18n-setup"

const routers = {
  path: "merchant-verify",
  name: "merchant-verify",
  component: () => import("@/components/container/ContainerBase"),
  redirect: { name: "merchant-verify-list" },
  children: [
    {
      path: "/",
      name: "merchant-verify-list",
      meta: {
        title: "商户审核列表",
        redirect: true
      },
      component: () => import("@/views/admin/merchant-verify/List")
    },
    {
      path: "detail",
      name: "merchant-verify-detail",
      meta: {
        title: "商户审核详情",
        redirect: true
      },
      component: () => import("@/views/admin/merchant-verify/Detail")
    }
  ]
}

export default routers

import {routerT} from "@/setup/i18n-setup"

const routers = {
  path: "tenant-home",
  name: "tenant-home",
  component: () => import("@/components/container/ContainerBase"),
  meta: {
    title: routerT("router.tenant.tenantHome.home")
  },
  redirect: {
    name: "tenant-home-index"
  },
  children: [
    {
      meta: {
        title: routerT("router.tenant.tenantHome.home")
      },
      path: "/",
      name: "tenant-home-index",
      component: () => import("@/views/tenant/tenant-home/TenantHome"),
    }
  ]
}

export default routers

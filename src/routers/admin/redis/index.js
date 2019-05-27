
import { routerT } from "@/setup/i18n-setup"

const routers = {
  path: "settings",
  name: "redis",
  component: () => import("@/components/container/ContainerBase.vue"),
  redirect: {
    name: "settings"
  },
  children: [{
      path: "/",
      name: "settings",
      meta: {
        title:routerT("router.admin.settings.Redis"),
        redirect: true
      },
      component: () => import("@/views/admin/redis/redis.vue")
    }]
}

export default routers

import { routerT } from "@/setup/i18n-setup"

const routers = {
  path: "user-manage",
  name: "user-manage",
  component: () => import("@/components/container/ContainerBase.vue"),
  redirect: {
    name: "user-list"
  },
  children: [{
      path: "/",
      name: "user-list",
      meta: {
        title: routerT("router.admin.userManage.list"),
        redirect: true
      },
      component: () => import("@/views/admin/user-manage/UserList")
    },
    {
      path: "create",
      name: "user-add",
      meta: {
        title: routerT("router.admin.userManage.add"),
        redirect: true
      },
      component: () => import("@/views/admin/user-manage/add.vue")
    },
    {
      path: "edit",
      name: "user-edit",
      meta: {
        title: routerT("router.admin.userManage.edit"),
        redirect: true
      },
      component: () => import("@/views/admin/user-manage/edit.vue")
    },
    {
      path: "relevance",
      name: "relevance-role",
      meta: {
        title: routerT("router.admin.userManage.assignRole"),
        redirect: true
      },
      component: () => import("@/views/admin/user-manage/edit.vue"),
      props: () => ({ onlyRelevanceRole: true })
    }
  ]
}

export default routers

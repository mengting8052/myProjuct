const routers = {
  path: "organization-manage",
  name: "organization-manage",
  component: () => import("@/components/container/ContainerBase"),
  redirect: {
    name: "organization-manage-list"
  },
  children: [
    {
      path: "/",
      name: "organization-manage-list",
      component: () => import("@/views/tenant/organization-manage/Index")
    }
  ]
}

export default routers

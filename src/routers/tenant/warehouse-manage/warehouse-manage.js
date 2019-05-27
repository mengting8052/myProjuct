
import {routerT} from "@/setup/i18n-setup"
const routers={
  path:"warehouse-manage",
  name:"warehouse-manage",
  component: () => import("@/components/container/ContainerBase"),
  redirect:{
    name:"warehouse-manage-list"
  },
  children:[
    {
      meta:{
        title:routerT("router.tenant.warehouseManage.list"),
        redirect: true
      },
      path:"/",
      name:"warehouse-manage-list",
      component: () => import("@/views/tenant/warehouse-manage/WarehouseManage")
    },{
      meta:{
        title:routerT("router.tenant.warehouseManage.add"),
        redirect: true
      },
      path:"create",
      name:"warehouse-add",
      component: () => import("@/views/tenant/warehouse-manage/WarehouseAdd")
    },
    {
      meta:{
        title:routerT("router.tenant.warehouseManage.edit"),
        redirect: true
      },
      path:"edit",
      name:"warehouse-edit",
      component: () => import("@/views/tenant/warehouse-manage/WarehouseEdit")
    }
  ]
}
export default routers
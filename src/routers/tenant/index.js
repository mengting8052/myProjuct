/**
 * 商户路由集合地
 */

import tenantHome from "@/routers/tenant/tenant-home/tenant-home"
import RoleManage from "@/routers/tenant/role-manage/role-manage"
import OrganizationManage from "@/routers/tenant/organization-manage/organization-manage"
import StaffManage from "@/routers/tenant/staff-manage/staff-manage"
import WarehouseManage from "@/routers/tenant/warehouse-manage/warehouse-manage"
import StoreManage from '@/routers/tenant/store-manage/store-manage'
/**
 *   商户子路由存放于数组
 */
const children = [ tenantHome, RoleManage ,OrganizationManage,StaffManage,WarehouseManage,StoreManage];

const routers = {
  path: "/platform",
  name: "platform",
  component: () => import("@/components/container/ContainerRoot"),
  children: children
}

export default routers


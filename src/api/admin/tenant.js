
import http from "@/utils/http"


// 获取商户列表
export function gettenantList(page, data) {
  return http({
    method: "post",
    url: `/tenant/pageInfo/${page.pageNum}/${page.pageSize}`,
    data
  })
}

// 新增商户
export function add(data) {
  return http({
    method: "post",
    url: "/tenant/saveOrUpdateTenant",
    data
  })
}

//  获取商户详情
export function detail(id) {
  return http({
    method: "get",
    url: `/tenant/getById/${id}`
  })
}

//  更新商户信息
export function update(data) {
  return http({
    method: "post",
    url: "/tenant/saveOrUpdateTenant",
    data
  })
}

// 获取商户审核列表
export function tenantAuditPage(params) {
  return http({
    method: "get",
    url: "/tenant/tenantAuditPage",
    params
  })
}

// 根据ID 获取审核数据
export function tenantAuditById(auditId) {
  return http({
    method: "get",
    url: "/tenant/tenantById",
    params: { auditId }
  })
}

// 审核商户
export function tenantAudit(id, data) {
  return http({
    method: "put",
    url: `/tenant/tenantAudit/${id}`,
    data
  })
}





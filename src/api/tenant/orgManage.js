import http from "@/utils/http"

export function fetchOrgTree(tenantId) {
  return http({
    method: "get",
    url: `/tenant/organ/all/${tenantId}`
  })
}

export function fetchOrgEmployee(pagination, data = {}) {
  return http({
    method: "post",
    url: `/tenant/employee/all/${pagination.pageNum}/${pagination.pageSize}`,
    data
  })
}

export function createOrg(data = {}) {
  return http({
    method: "post",
    url: "/tenant/organ/save",
    data
  })
}

export function updateOrg(data = {}) {
  return http({
    method: "post",
    url: "/tenant/organ/update",
    data
  })
}

export function removeOrg(orgId) {
  return http({
    method: "get",
    url: `/tenant/organ/delete/${orgId}`
  })
}

export function showOrg(tenantId) {
  return http({
    method: "get",
    url: `/tenant/organ/single/${tenantId}`
  })
}

export function getInfo(data = {}) {
  return http({
    method: "post",
    url: "/tenant/organ/getInfo",
    data
  })
}

export function fetchWarehouse(warehouseId) {
  return http({
    method: "get",
    url: `/warehouse/one/${warehouseId}`
  })
}

export function updateWarehouse(data = {}) {
  return http({
    method: "post",
    url: "/warehouse/update",
    data
  })
}

export function fetchShop(shopId) {
  return http({
    method: "get",
    url: `/shop/one/${shopId}`
  })
}

export function updateShop(data = {}) {
  return http({
    method: "post",
    url: "/shop/update",
    data
  })
}

export function createShop(data = {}) {
  return http({
    method: "post",
    url: "/shop/add",
    data
  })
}
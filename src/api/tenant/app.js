import http from "@/utils/http"

/** 
 * 根据商户id获取产品列表
 */
export function queryBymerchantId(id) {
  return http({
    method: "get",
    url: `/app/list/${id}`
  })
}

export function getTenantApp(){
  return http({
    method:"get",
    url:"/app/listTenantApp",
  })
}
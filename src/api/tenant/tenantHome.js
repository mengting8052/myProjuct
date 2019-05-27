import http from "@/utils/http"

/** 
 * 获取商户列表
 * @params {Object} data
*/
export function getTenantPageInfo(param){
 return  http({
   method:"post",
   url:`/tenant/pageInfo/${param.page}/${param.pageSize},${param}`,
   data
 })
}

/** 
 * 获取商户信息
 * 
*/
export function getTenantDetail(id){
  return http({
    method:"get",
    url:`/tenant/getById/${id}`
  })
}
/**
 *  产品管理
 *
 */

import http from "@/utils/http"

/**
 * 产品列表页面 - 获取Table数据
 * @params 页数
 */
export function fetchTable(params){
  return http({
    method:"get",
    url:`/app/list/${params.page}/${params.pageSize}`
  })
}

/**
 * 产品列表页面 - 删除接口
 * @param id
 */
export function deleteProductList(id){
  return http({
    method:"get",
    url:`/app/delete/${id}`
  })
}

// 业务功能删除
export function deleteBisfunction(id){
  return http({
    method:"get",
    url:`/bisfunction/delete/${id}`
  })
}
/**
 *  产品新增-关联角色接口
 * @params 页数
 */
export function fetchRoleTable(params){
  return http({
    method:"post",
    url:`/role/pageInfo/${params.page}/${params.pageSize}`,
    data: { name: params.name }
  })
}

export function saveOrUpdateApp(data = {}) {
  return http({
    method: "post",
    url: "/app/saveOrUpdate",
    data
  })
}

export function fetchApp(id) {
  return http({
    method: "get",
    url: `/app/get/${id}`
  })
}




import http from "@/utils/http"
/**
 * 获取产品列表
 * @param {Object} data 
 */
export function listApp(data){
  return http({
    method:"post",
    url:"/app/listApp",
    data
  })

}
/** 
 * 获取角色列表
 * @param {Object} data 
*/

export function getRoleList(page, data){
  return http({
    method:"post",
    url:`/role/pageInfo/${page.pageNum}/${page.pageSize}`,
    data
  })
}

// 获取角色列表(不分页)

export function queryRoleList(data){
  return http({
    method:"post",
    url:`/role/list`,
    data
  })
}
/**
 * 新增角色
 */
export function add(data){
    return http({
      method:"post",
      url:"/role/saveOrUpdateRole",
      data
    })
}

/***
 * 获取角色详情
 */
export function detail(id){
  return http({
    method:"get",
    url:`/role/getById/${id}`
  })
}
/**
 * 角色编辑
 */

 export function update(data){
  return http({
    method:"post",
    url:"/role/saveOrUpdateRole",
    data
  })
 }

 /** 
  * 删除角色
 */
 export function del(id){
  return http({
    method:"get",
    url:`/role/delete/${id}`
  })
 }
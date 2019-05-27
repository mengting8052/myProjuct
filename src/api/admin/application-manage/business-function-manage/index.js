/**
 *  业务功能管理
 */

import http from "@/utils/http"

/**
 * 业务功能管理列表 - 前端系统下拉框列表数据
 */
export function fetchFrontSystem(){
  return http({
    method:"post",
    url:"/frontSystemController/list",
    data: {}
  })
}

/**
 * 业务功能列表Table数据接口
 * @param params
 */
export function fetchBusinessFunctionList(page,params){
  return http({
    method:"post",
    url:`/bisfunction/${page.pageNum}/${page.pageSize}`,
    data: params
  })
}

/**
 * 业务功能列表 - Tree 接口
 * @param params
 */
export function fetchBusinessFunctionAllTree(params = {}){
  return http({
    method:"post",
    url:"/bisfunction/all/tree",
    data: params
  })
}
/**
 * 获取Tree数据 -  不包含前端系统
 * @param params
 */
export function fetchTree(params){
  return http({
    method:"post",
    url:`/bisfunction/tree`,
    data: params
  })
}

/**
 * 获取子系统Table数据
 */
export function fetchSubSystem(){
  return http({
    method:"post",
    url:"/sys/list",
    data: {}
  })
}

/**
 * 获取对应子系统模块
 */
export function fetchSubSystemModule(ids){
  return http({
    method:"post",
    url:"/sysFunction/sys/list",
    data: ids
  })
}

/**
 * 菜单排序  接口
 * @param params
 */
export function saveMenuSort(params){
  return http({
    method:"post",
    url:"/bisfunction/updateBatch",
    data: params
  })
}

/**
 * 业务功能 -  新增/更新
 * @param params
 */
export function saveBusinessFunction(params){
  return http({
    method:"post",
    url:"/bisfunction/saveOrUpdate",
    data: params
  })
}

/**
 * 根据ID获取详情
 * @param id
 */
export function getBusinessFunctionDetail(id){
  return http({
    method:"get",
    url:`/bisfunction/get/${id}`
  })
}













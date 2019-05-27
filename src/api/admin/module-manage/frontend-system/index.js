import http from "@/utils/http"
import Qs from "qs"

/**
 * 获取前端系统
 * @param params
 */
export function fetchFrontSystem(params){
  return http({
    method:"post",
    url:`/frontSystemController/list/${params.page}/${params.pageSize}`,
    data: params.data
  })
}

/**
 * 删除前端系统
 * @param params
 */
export function deleteFrontSystem(params){
  return http({
    method:"post",
    url:"/frontSystemController/delete",
    data: params
  })
}

/**
 * 添加/编辑 前端系统
 * @param params
 */
export function saveOrEditFrontSystem(params){
  return http({
    method:"post",
    url:"/frontSystemController/saveOrEdit",
    data: params
  })
}

/**
 * 根据ID获取前端系统
 * @param params
 */
export function getFrontSystemDetail(params){
  return http({
    method:"post",
    url:"/frontSystemController/getFrontSystemById",
    data: params
  })
}

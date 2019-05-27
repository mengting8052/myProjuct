import http from "@/utils/http"
import Qs from "qs"

/**
 * 获取子系统
 * @param params
 */
export function fetchSubSystem(){
  return http({
    method:"post",
    url:"/sys/list",
    data:{}
  })
}
/**
 * 获取子系统详情
 * @param params
 */
export function fetchSubSystemDetail(id){
  return http({
    method:"get",
    url:`/sys/get/${id}`
  })
}

/**
 * 加载table模块数据
 * @param params
 */
export function fetchModule(params){
  return http({
    method:"post",
    url: `/module/list/${params.pageNum}/${params.pageSize}`,
    data: params.data
  })
}
// 获取模块列表
export function queryModuleList(data){
  return http({
    method:"post",
    url: "/module/list",
    data
  })
}

/**
 * 新增/ 编辑  后台模块
 * @param params
 */
export function saveOrUpdateModule(params){
  return http({
    method:"post",
    url: "/module/saveOrUpdate",
    data: params
  })
}

/**
 * 根据ID获取模块详情
 * @param id
 */
export function getModuleDetail(id){
  return http({
    method:"get",
    url: `/module/get/${id}`
  })
}

/**
 * 删除模块
 * @param id
 */
export function deleteModule(id){
  return http({
    method:"get",
    url: `/module/delete/${id}`
  })
}

/**
 * 获取技术类型
 * @param platform
 */
export function getPlatform(platform){
  return http({
    method:"get",
    url: `/config/get/${platform}`
  })
}

/**
 * 保存/更新子系统
 * @param params
 */
export function saveOrUpdateSubSystem(params){
  return http({
    method:"post",
    url: "/sys/saveOrUpdate",
    data: params
  })
}

/**
 * 获取子系统模块详情
 * @param id
 */
export function getSubSystemDetail(id){
  return http({
    method:"get",
    url: `/sys/get/${id}`,
  })
}





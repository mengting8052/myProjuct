
import http from "@/utils/http"


// 获取列表
export function  getAuthorityList(page,data){
  return http({
    method:"post",
    url:`/sysFunction/list/${page.pageNum}/${page.pageSize}`,
    data
  })
}
// 删除用户

export function del(id){
  return http({
    method:"get",
    url:`/sysFunction/delete/${id}`,
  })
}
// 新增权限
 export function add(data){
  return http({
    method:"post",
    url:"/sysFunction/saveOrUpdate",
    data
  })
 }

//  获取权限详情
export function detail(id){
  return http({
    method:"get",
    url:`/sysFunction/get/${id}`
  })
 }

//  更新权限信息
export function update(data){
  return http({
    method:"post",
    url:"/sysFunction/saveOrUpdate",
    data
  })
}

export function queryBySubSystemIds(data){
  return http({
    method:"post",
    url:"/sysFunction/sys/list",
    data
  })
}




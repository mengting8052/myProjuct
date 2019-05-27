import http from "@/utils/http"

/** 
 * 获取仓库列表
*/ 

export function getWareHouseList(page,data){
    return http({
      method:"post",
      url:`/warehouse/all/${page.pageNum}/${page.pageSize}`,
      data
    })
}

/** 
 * 新增仓库
*/

export function add(data){
  return http({
    method:"post",
    url:"/warehouse/add",
    data
  })
}

/** 
 * 仓库修改
*/
export function update(data){
  return http({
    method:"post",
    url:"/warehouse/update",
    data
  })
}

/** 
 * 删除仓库
*/
export function del(id){
  return http({
    method:"get",
    url:`/warehouse/delete/${id}`
  })
}

/** 
 * 获取仓库详情
*/
export function detail(id){
  return http({
    method:"get",
    url:`/warehouse/one/${id}`
  })

}

/** 
 * 获取状态
*/
export function changeStatus(id,status){
  return http({
    method:"get",
    url:`/warehouse/state/${id}/${status}`
  })
}
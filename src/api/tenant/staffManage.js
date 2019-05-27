import http from "@/utils/http"


/** 
 * 获取员工列表
 * @params {Object} page data
*/

export function getStaffList(page,data){
  return http({
    method:"post",
    url:`/tenant/employee/all/${page.pageNum}/${page.pageSize}`,
    data
  })
}
/** 
 * 编辑
*/
export function detail(id){
  return http({
    method:"get",
    url:`/tenant/employee/one/${id}`,
  })
}

// 获取员工性别
export function getGenderInfo(code){
  return http({
    method:"get",
    url:`/config/get/${code}`
  })
}

// 新增员工
export function add(data){
  return http({
    method:"post",
    url:"/tenant/employee/save",
    data
  })
}

// 更新员工信息
export function update(data){
    return http({
      method:"post",
      url:"/tenant/employee/update",
      data
    })
}

// 移除员工
export function remove(id) {
  return http({
    method: "delete",
    url: `/tenant/employee/delete/${id}`
  })
}

// 重置密码
export function reset(data){
  return http({
    method:"post",
    url:"/user/edit/password",
    data
  })
}



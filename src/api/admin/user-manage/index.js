import http from "@/utils/http"


// 获取列表
export function  getUserList(page,data){
  return http({
    method:"post",
    url:`/user/pageInfo/${page.pageNum}/${page.pageSize}`,
    data
  })
}
// 删除用户

export function del(data){
  return http({
    method:"post",
    url:"/user/edit/password",
    data
  })
}
// 新增用户
 export function add(data){
  return http({
    method:"post",
    url:"/user/saveOrUpdateUser",
    data
  })
 }

//  获取用户详情
export function detail(id){
  return http({
    method:"get",
    url:`/user/getById/${id}`
  })
 }

//  更新用户信息
export function update(data){
  return http({
    method:"post",
    url:"/user/saveOrUpdateUser",
    data
  })
}
// 重置密码
export function resetPassword(data){
  return http({
    method:"post",
    url:"/user/edit/password",
    data
  })
}

// 修改密码
export function changePassword(data){
  return http({
    method:"post",
    url:"/user/update/password",
    data
  })
}


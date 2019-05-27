import http from "@/utils/http"
import { USER_LOGIN_API_URL, USER_INFO_API_URL } from "@/utils/env"

/**
 * 用户登录
 * 
 * @param {object} data 
 * 
 * {username, password}
 */
export function login(data = {}) {
  return http({
    method: "post",
    url: USER_LOGIN_API_URL,
    data
  })
}

/**
 * 拉取用户数据
 */
export function fetchUser() {
  return http({
    method: "get",
    url: USER_INFO_API_URL
  })
}

/** 
 * 修改密码
*/
export function changePassword(data){
  return http({
    method:"post",
    url:"/user/update/password",
    data
  })
}

// 同步redis
export function refreshRedis(){
  return http({
    method:"get",
    url:"/redis/refresh"
  })
}

// 注册商户
export function register(data = {}) {
  return http({
    method: "post",
    url: "/tenant/registerTenant",
    data 
  })
}

// 第三方绑定
export function tpBind(params) {
  return http({
    method: "post",
    url: "/auth/thirdLogin",
    params
  })
}

// 获取第三方登录支持的方式
export function supportType() {
  return http({
    method: "get",
    url: "/tpauth/supportType"
  })
}

// 修改指定 uid 的密码
export function empassword(params) {
  return http({
    method: "post",
    url: "/user/update/empassword",
    params
  })
}
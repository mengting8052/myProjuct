import http from "@/utils/http"

export function queryTreeByAppIds(ids){
  return http({
    method:"post",
    url:"/bisfunction/list/tree",
    data:ids
  })
}
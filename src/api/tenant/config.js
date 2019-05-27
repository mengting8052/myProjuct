import http from "@/utils/http"

export function fetchConfigByCode(code) {
  return http({
    method: "get",
    url: `/config/get/${code}`
  })
}
import http from "@/utils/http"

export function fetchRegion() {
  return http({
    method: "get",
    url: "/region/all/"
  })
}
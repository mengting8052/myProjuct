import http from "@/utils/http"

export function getOrganAll(merchantId){
  return http({
    method:"get",
    url:`/tenant/organ/all/${merchantId}`
  })
}
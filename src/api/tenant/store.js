import http from "@/utils/http"

export function fetchStoreList(page, data) {
  return http({
    method: "post",
    url: `/shop/all/${page.pageNum}/${page.pageSize}`,
    data
  })
}

export function updateStoreStatus(storeId, status) {
  return http({
    method: "get",
    url: `/shop/status/${storeId}/${status}`
  })
}

export function removeStore(storeId) {
  return http({
    method: "get",
    url: `/shop/delete/${storeId}`
  })
}
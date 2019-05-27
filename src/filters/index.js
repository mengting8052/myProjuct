import moment from "moment"
export function timeFormat(unixTime, full = true) {
  if (full) {
    return moment(unixTime).format('YYYY-MM-DD HH:mm:ss')
  } else {
    return moment(unixTime).format('YYYY-MM-DD')
  }
}
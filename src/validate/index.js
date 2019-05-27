import {i18n} from "@/setup/i18n-setup"
/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}
export function checkTelNo(telNo) {

  //国内1开头11为数字
  //澳洲4开头9位，04开头10位
  //加入支付宝脱敏数据验证
  var temp = telNo;
  var mobileNoReg = /^1[0-9]{10}$/;
  var AmobileNoReg1 = /^4[0-9]{8}$/;
  var AmobileNoReg2 = /^04[0-9]{8}$/;
  if (telNo.indexOf("*") > -1) {
    telNo = telNo.replace(/\*/g, '5');
    if (telNo.match(mobileNoReg) == null
      && telNo.match(AmobileNoReg1) == null
      && telNo.match(AmobileNoReg2) == null) {
      return false;
    } else {
      var flag = true;
      telNo=temp;
      for (var i = 0; i < telNo.length; i++) {
        if (i == 0 || i == 1 || i == 2 || i == telNo.length - 1
          || i == telNo.length - 2) {
          if (isNaN(telNo.charAt(i))) {
            flag = false;
            break;
          }
        } else {
          if (telNo.charAt(i) != "*") {
            flag = false;
          }
        }
      }
      return flag;
    }
  } else {
    if (telNo.match(mobileNoReg) == null
      && telNo.match(AmobileNoReg1) == null
      && telNo.match(AmobileNoReg2) == null) {
      return false;
    } else {
      return true;
    }
  }
}

/**
 * 姓名
 * @param {*} s
 */
export function isName (s) {
  return /^[\u4E00-\u9FA5]{2,6}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * 家庭详细住址
 * @param {*} s
 */
export function isAddres (s) {
  return /^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}
/**
 * 电话号码，非必填
 * @param {*}
 */
export function validatePhone(rule, value, callback){
  if(value == null || value == ""){
    callback();
  }else{
    if(!(/^1[0-9]{10}$/.test(value))){
      callback(new Error(i18n.t("common.form.rules.phone")));
    }else{
      callback();
    }

  }
}

/**
 * 身份证号码，非必填
 * @param {*}
 */
export function validateIDNumber(rule, value, callback){
  let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  if(value == null || value == ""){
    callback();
  }else{
    if(!(reg.test(value))){
      callback(new Error(i18n.t("common.form.rules.identityNo")));
    }else{
      callback();
    }
  }
}



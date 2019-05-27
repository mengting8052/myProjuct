const prefixAppCode = "GVT_APP_CODE";

class AppCode {

  constructor() {}

  static setAppCode(appcode) {
    return localStorage.setItem(prefixAppCode, appcode);
  }

  static getAppCode() {
    return localStorage.getItem(prefixAppCode);
  }

  static removeAppCode() {
    return localStorage.removeItem(prefixAppCode);
  }

}

export default AppCode;

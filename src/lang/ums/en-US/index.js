import iviewEN from "iview/dist/locale/en-US"
import routerEN from "./router"
import admin from "./admin"
import tenant from "./tenant"
import auth from "./auth"
import components from "./components"

const lang = {
  ...iviewEN,

  ...routerEN,

  ...admin,
  
  ...auth,

  ...tenant,

  ...components,

  loginForm: {
    title: "Account Login",
    username: "Username",
    password: "Password",
    loginBtn: "Login",

    tpLoginText: {
      weixin: "Wechat Login",
      alipay: "Alipay Login",
    }
  },

  bindForm: {
    title: "Bind Account",
    username: "Username",
    password: "Password",
    loginBtn: "Bind",
  },

  header: {
    currentTimeZone: "Time Zone:",
    i18n: "Translations",
    userInfo: "Personal Info",
    updatePwd: "Password Change",
    logOut: "Logout"
  },

  common: {
    pagination: "{pageSize} Page/piece",

    jwtExpired:  "Login expired, please log in again!",

    Redis:"Synchronization to Redis",

    changePassword: "Change Password",
    newPassword: "new password",
    confirmPassword: "confirm password",

    form: {
      btn: {
        search: "Query",
        reset: "Reset",
        cancel: "Cancel",
        sure: "Ok",
        checked: "Select",
        confirm: "Save",
        checkedAndClosed: "Select And Close",
        cancel: "Cancel",
        sure: "Confirm",
        checked: "Selected",
        confirm: "Save",
        checkedAndClosed: "Select and close",
      },
      rules: {
        phone: "Please enter the correct phone format",
        identityNo: "Please enter the correct ID number"
      },
      label: {}
    },

    table: {
      thead: {
        operate: "Operation"
      },

      tbody: {
        operate: {
          edit: "Edit",
          remove: "Delete",
        },
      },
    },
    message:{
      accOrPassword:"Wrong account or password",
    },
    // 提示框
    modal: {
      title: "Reminder",
      contentDel: "This action will permanently delete the data. Do you want to continue?",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      deleteSuccess: "Remove Success!",
      createSuccess: "Added successfully!",
      editSuccess: "Update Success!",
      passwordReset: "Password Reset Success!",
      timeOut:"The request timeout"
    },
  }
}

export default lang

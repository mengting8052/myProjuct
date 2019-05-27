import iviewZH from "iview/dist/locale/zh-CN"
import routerZH from "./router"
import admin from "./admin"
import tenant from "./tenant"
import auth from "./auth"
import components from "./components"
const lang = {
  ...iviewZH,

  ...routerZH,

  ...admin,
  
  ...auth,

  ...tenant,

  ...components,

  loginForm: {
    title: "账号登录",
    username: "用户名",
    password: "密码",
    loginBtn: "登录",

    tpLoginText: {
      weixin: "微信登录",
      alipay: "支付宝登录",
    }
  },

  bindForm: {
    title: "绑定账户",
    username: "用户名",
    password: "密码",
    loginBtn: "绑定",
  },

  header: {
    currentTimeZone: "当前时区：",
    i18n: "语言切换",
    userInfo: "个人信息",
    updatePwd: "修改密码",
    logOut: "注销"
  },

  common: {
    pagination: "{pageSize} 条/页",
    jwtExpired: "登录过期, 请重新登录!",
    Redis:"同步到Redis",
    changePassword: "修改密码",
    newPassword: "新密码",
    confirmPassword: "确认密码",
    form: {
      btn: {
        search: "搜索",
        reset: "重置",
        cancel: "取消",
        sure: "确定",
        checked: "选中",
        confirm: "保存",
        checkedAndClosed: "选中并关闭",
      },
      rules: {
        phone: "请输入正确的电话格式",
        identityNo: "请输入正确身份证号码"
      },
      label: {}
    },

    table: {
      thead: {
        operate: "操作"
      },

      tbody: {
        operate: {
          edit: "编辑",
          remove: "删除",
        },
      },
    },
    message:{
      accOrPassword:"账户或密码错误"
    },
    // 提示框
    modal: {
      title: "提示",
      contentDel: "此操作将永久删除该数据, 是否继续?",
      save: "保存",
      cancel: "取消",
      delete: "删除",
      deleteSuccess: "删除成功!",
      createSuccess: "添加成功!",
      editSuccess: "更新成功!",
      passwordReset: "密码重置成功",
      timeOut:"请求超时"
    },
  }
}

export default lang

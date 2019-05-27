var env = require("../utils/env");

var domain = env.FRONTEND_DOMAIN;

var adminData = [
  {
    name: "应用管理",
    enName: "Apps",
    icon: "icon-setting",
    childBisFunction: [
      {
        name: "产品管理",
        enName: "Products",
        uri: `${domain}/application-manage/product-manage`,
      },
      {
        name: "业务功能管理",
        enName: "Businesses",
        uri: `${domain}/application-manage/business-function-manage`,
      }
    ]
  },

  {
    name: "模块管理",
    enName: "Modules",
    icon: "icon-setting",
    childBisFunction: [
      {
        name: "前端系统",
        enName: "Frontends",
        uri: `${domain}/module-manage/frontend-system`,
      },
      {
        name: "后台模块",
        enName: "Backends",
        uri: `${domain}/module-manage/background-module`,
      }
    ]
  },

  {
    name: "权限管理",
    enName: "Permissions",
    uri: `${domain}/authority-manage`,
    icon: "icon-mywork"
  },

  {
    name: "角色管理",
    enName: "Roles",
    uri: `${domain}/platform/role-manage`,
    icon: "icon-mywork"
  },

  {
    name: "用户管理",
    enName: "Users",
    uri: `${domain}/user-manage`,
    icon: "icon-mywork"
  },

  {
    name: "商户管理",
    enName: "Tenants",
    icon: "icon-setting",
    uri: `${domain}/merchant-manage`,
  },

  // {
  //   name: "商户审核",
  //   enName: "Tenants Verify",
  //   icon: "icon-setting",
  //   uri: `${domain}/merchant-verify`,
  // },

  {
    name:"系统设置",
    enName:"Settings",
    icon: "icon-setting",
    uri:`${domain}/settings`
  }
];

module.exports = { menuData: adminData };

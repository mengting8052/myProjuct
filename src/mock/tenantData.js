var env = require("../utils/env");

var domain = env.FRONTEND_DOMAIN;

var adminData = [
  {
    name: "商户首页",
    enName: "Home",
    uri: `${domain}/platform/tenant-home`,
  },
  {
    name: "角色管理",
    enName: "Roles",
    uri: `${domain}/platform/role-manage`,
  },
  {
    name: "组织管理",
    enName: "Orgnaizations",
    uri: `${domain}/platform/organization-manage`,
  },
  {
    name: "员工管理",
    enName: "Staffs",
    uri: `${domain}/platform/staff-manage`,
  },
  {
    name: "仓库管理",
    enName: "Warehouses",
    uri: `${domain}/platform/warehouse-manage`,
  },
  {
    name: "门店管理",
    enName: "Stores",
    uri: `${domain}/platform/store-manage`,
  },
];

module.exports = { menuData: adminData };

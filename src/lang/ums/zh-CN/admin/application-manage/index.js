/**
 *
 * 产品管理列表
 */
const lang = {
  title: "选择角色",
  addProductBtn: "新增产品",

  table: {
    thead: {
      code: "产品编码",
      name: "产品名称",
    },
    tbody: {}
  },
  
  // 产品信息页面 - 新增,修改
  productMsg: {
    title: "产品信息",
    productCode: "产品编码",
    productName: "产品名称",
    productURL: "链接地址",
    productLogo: "产品图标",
    fullLogo: "完整图标",
    size: "尺寸",
    shrinkLogo: "压缩图标",
    productType: "产品类型",
    defaultRole: "默认角色",
    selectRole: "选择角色",
    selectAssociationRole: "关联功能",
    roleName: "角色名称",
    tenant: "商户",
    platform: "平台",
    roleCode: "角色编码",
    selectedRole:"已选角色"
  },
  others:{
    success:"操作成功",
    productTypes:{
      tenant:"商户",
      admin:"平台"
    }
  },
  rules:{
    code: "请输入产品编码",
    numOrLetter:"只允许输入字母+数字",
    name: "请输入产品名称",
    numAndLetter: "只允许数字、字母和 -!",
  }
 
}

export default lang

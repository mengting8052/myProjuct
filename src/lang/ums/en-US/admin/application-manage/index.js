/**
 *
 * 产品管理列表
 */
const lang = {
  title: "Role options",
  addProductBtn: "New product",

  table: {
    thead: {
      code: "Product code",
      name: "Product name",
    },
    tbody: {}
  },
  
  // 产品信息页面 - 新增,修改
  productMsg: {
    title: "Product information",
    productCode: "Product code",
    productName: "Product name",
    productURL: "Link address",
    productLogo: "Product logo",
    fullLogo: "Complete logo",
    size: "Size",
    shrinkLogo: "Contracted logo",
    productType: "Product type",
    defaultRole: "Default roles",
    selectRole: "Role options",
    selectAssociationRole: "Correlated functions",
    roleName: "Role name",
    tenant: "Merchant",
    platform: "Platform",
    roleCode: "Role coding",
    selectedRole:"Selected Role"
  },
  others:{
    success:"success",
    productTypes:{
      tenant:"Merchant",
      admin:"Platform"
    }
  },
  rules:{
    code: "Please enter the product code",
    numOrLetter:"Only allow letters and numbers",
    name: "please input the product name",
    numAndLetter: "Only numbers, letters, and - are allowed",
  }
 
}

export default lang

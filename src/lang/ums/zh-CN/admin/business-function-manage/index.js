/**
 *
 * 业务功能管理
 */
const lang = {
  title: "业务功能列表",
  subTitle: "业务功能信息",

  form: {
    label:{
      code: "业务功能编码",
      name: "业务功能名称",
      type: "业务功能类型",
      system: "前端系统",
      parents: "上级功能",
      url: "URL地址",
      sort: "排序值",
      icon: "菜单图标",
      control: "控件",
      menu: "菜单",
      enName:"业务功能英文名"

    }
  },
  text: {
    range: "输入范围 1 - 9999",
    authority: "关联权限",
    selectIcon: "选择菜单图标",
    selectSubSystem: "选择子系统",
    sortRules:"排序规则：排序值越小排在越前，排序值范围 1 - 9999，如排序值相同则按照菜单编码值进行排序",
    saveSuccess:"保存成功",
    saveFail:"保存失败",
  },
  button: {
    createFunction: "新增功能",
    menuSort: "菜单排序",
    selectIcon: "选择图标",
    createSubSystem: "增加子系统",

  },

  table: {
    thead: {
      code: "业务功能编码",
      name: "业务功能名称",
      type: "业务功能类型",
      system: "前端系统",
      parents: "上级功能",
      subSystemName: "子系统名称",
      menuCode: "菜单编码",
      menuName: "菜单名称",
      sortValue: "排序值",
    },
    tbody: {
      menu: "菜单",
      control: "控件",
    }
  },

  modal: {
    selectSystem: "请选择子系统",
    createModule:"所选子系统未添加模块权限，请移步到权限管理给对应模块添加权限!"
  },
  rules: {
    businessFunctionCode: "请输入业务功能编码",
    businessFunctionName: "请输入业务功能名称",
    businessFunctionType: "请选择业务功能类型",
    businessFunctionSystem: "请选择前端系统",
    businessFunctionSort: "请输入排序值",
    relevanceSelf:"不能自关联",
    onlyInteger:"只能输入整数",
    superior:"上级系统为菜单项，请重新选择",
    enName:"请输入业务功能英文名"
  }

}

export default lang

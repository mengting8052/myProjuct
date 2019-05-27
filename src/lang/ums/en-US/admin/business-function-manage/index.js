/**
 *
 * 业务功能管理
 */
const lang = {
  title: "List of business functions",
  subTitle:"Business function information",

  form: {
    label: {
      code: "Business function code",
      name: "Business function name",
      type: "Business function types",
      system: "Front-end system",
      parents: "Previous function",
      url: "URL address",
      sort: "Sorting value",
      icon: "Menu icon",
      control: "Control",
      menu: "Menu",
      enName:"EnName"
    }
  },
  text: {
    range: "Input range 1 - 9999",
    authority: "Related permissions",
    selectIcon: "Select the menu icon",
    selectSubSystem: "Select subsystems",
    sortRules: "Collation: The smaller the sort value is, the earlier the sort value is, the sort value range is 1 - 9999. If the sort value is the same, the menu code value is sorted.",
    saveSuccess: "Save successfully",
    saveFail: "Save failed",
  },
  button: {
    createFunction: "New functions",
    menuSort: "Menu sorting",
    selectIcon: "Select icons",
    createSubSystem: "Add subsystems",

  },

  table: {
    thead: {
      code: "Business function code",
      name: "Business function name",
      type: "Business function type",
      system: "Front-end system",
      parents: "Previous function",
      subSystemName: "Subsystem name",
      menuCode: "Menu code",
      menuName: "Menu name",
      sortValue: "Sorting value",
    },
    tbody: {
      menu: "Menu",
      control: "Control",
    }
  },

  modal: {
    selectSystem: "Please select a subsystem",
    createModule: "There are no modules for the selected subsystem, please add modules for this subsystem!"
  },
  rules: {
    businessFunctionCode: "Please enter the business function code",
    businessFunctionName: "Please enter a business function name",
    businessFunctionType: "Please select the type of business function",
    businessFunctionSystem: "Please select the front end system",
    businessFunctionSort: "Please enter a sort value",
    relevanceSelf:"Can't relate to itself",
    onlyInteger:"You can only put in integers",
    superior:"The superior system is the menu item, please re-select it",
    enName:"Please enter the English name of the business function"
  }

}

export default lang

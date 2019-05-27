/** 
 * 新增员工
 */
const lang = {

  btns: {
    save: "保存",
    cancel: "取消",
    resetPassword: "修改密码"
  },
  others:{
    success:"操作成功",
    title:"提示",
    content:"是否继续重置密码?密码是：111111"
  },
  form: {
    employeeDetail: {
      cacheUserName: "用户名",
      cachePassword: "密码",
      name: "姓名",
      phone: "电话",
      birthday: "生日",
      identityNo: "身份证号",
      gender: "性别",
      entryTime: "入职日期",
      departureTime: "离职日期",
      organId: "所属部门",
      number:"工号"
    },
    rules:{
      userName:"请输入用户名",
      password:"请输入密码",
      name:"请输入姓名",
      identityNo:"长度不能超过18位",
      organName:"请输入所属部门"
    },
    version: "Apos版本约束：新建或修改的员工只适用于Apos客户端2.0及以上版本",
    modal: {
      title: "请选择组织机构"
    },
    roles: {
      allot: "分配角色",
      allCheck: "全选"
    }
  }
}
export default lang

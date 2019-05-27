/** 
 * 新增员工
 */
const lang = {
  btns: {
    save: "Save",
    cancel: "Cancel",
    resetPassword: "Change password"
  },
  others:{
    success:"operate successfully",
    title:"Reminder",
    content:"This operation will initialize user's login password. Do you want to continue? The password is: 111111"
  },
  form: {
    employeeDetail: {
      cacheUserName: "User name",
      cachePassword: "Password",
      name: "Full name",
      phone: "Telephone",
      birthday: "Birthday",
      identityNo: "ID card No.",
      gender: "Gender",
      entryTime: "Entry time",
      departureTime: "Departure time",
      organId: "Subordinate departments",
      number:"Number"
    },
    rules:{
      userName:"Please enter your user name",
      password:"Please enter your password",
      name:"Please enter your name",
      identityNo:"It can't be longer than 18 bits",
      organName:"Please enter your Subordinate departments"
    },
    version: "Apos version constraint: new or modified employees apply only to Apos client version 2.0 and above",
    modal: {
      title: "Select organizations"
    },
    roles: {
      allot: "Roles assignment",
      allCheck: "Check all"
    }
  }
}
export default lang

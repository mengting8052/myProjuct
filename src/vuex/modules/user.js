import { fetchUser } from "@/api/auth"
import Auth from "@/utils/auth"

const user = {
  state: {
    // 用户 ID
    id: "",
    // 用户名
    name: "",
    // 账号
    userName: "",
    // 商户ID
    tenantId: 0,
    //code 
    code:"",
    // 默认为商户用户
    isTenant: true,
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_TENANT_ID: (state, tenantId) => {
      state.tenantId = tenantId
    },
    SET_TENANT_CODE:(state,code)=>{
      state.code=code;
    },
    IS_NOT_TENANT: (state) => {
      state.isTenant = false;
    },
    LOGOUT_USER: (state) => {
      state.id = "";
      state.name = "";
      state.userName = "";
      state.tenantId = 0;
      state.code="";
      state.isTenant = true;
      Auth.logOut();
    }
  },

  actions: {

    FetchUserData({ commit }) {
      return new Promise((resolve, reject) => {
        fetchUser().then(response => {
          
          // 用户数据源
          const userinfo = response.data;

          /**
           * 依据自定义 app.code 校验所筛选出的 app item
           *
           * 默认为 {}, 请不要改变它
           */
          let appFound = true;
          
          /**
           * 由于 router.beforEach() 中
           *
           * 依据 user.id = true or false
           *
           * 来判断是否进行用户信息的拉取
           *
           * 因此, 你必须要在 appFound 完成初始化"后", 且不为空对象"时"
           *
           *  ----- 才可更新其他的 state -----
           */
          if (appFound && JSON.stringify(appFound) !== "{}") {
            // mutation 用户 ID
            commit("SET_ID", userinfo.user.id);

            // mutation 用户 名称
            commit("SET_NAME", userinfo.user.name);
            
            // mutation 商户code
              if(userinfo.tenant && userinfo.tenant.code){
                 commit("SET_TENANT_CODE",userinfo.tenant.code)
              }
          
              // mutation 商户id
            if(userinfo.tenant && userinfo.tenant.id) {
              commit("SET_TENANT_ID", userinfo.tenant.id); 
            }

            if(userinfo.employee && userinfo.employee.code) {
              commit("SET_TENANT_CODE",userinfo.employee.code)
            }

            if(userinfo.employee && userinfo.employee.tenantId) {
              commit("SET_TENANT_ID", userinfo.employee.tenantId);

            }

            // mutation 账户
            commit("SET_USERNAME", userinfo.user.userName);

            // mutation 商户 or !商户
            userinfo.user.system === 1 && commit("IS_NOT_TENANT");
          } else {
            reject({ source: "action", redirect: 403 })
          }

          // resolve apps
          resolve(userinfo.apps);

        }).catch(error => {
          reject(error)
        })
      })
    },

    Logout({ commit }) {
      commit("LOGOUT_USER");
    }
  }
}

export default user

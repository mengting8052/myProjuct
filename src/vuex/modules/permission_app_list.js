import AppCode from "@/utils/app-code"
import { ENV } from "@/utils/env"

function parseApps(apps, appTarget) {

  let permissions = [];
  let menus = [];

  // 递归解析全部 permission code list
  function loop(arr) {
    arr.some(item => {
      permissions.push(item.code);
      if (item.childBisFunction && item.childBisFunction.length) {
        permissions.push(item.code);
        loop(item.childBisFunction);
      }
    });
  }

  if (apps.length) {

    const resource = appTarget ? apps.filter(app => { return app.code === appTarget }) : apps

    resource.forEach(app => {
      // parse permission code list
      loop(app.bisFunctions);
      // parse menu data
      app.bisFunctions.forEach(item => {
        if (item.type !== "control") {
          let obj = { name: item.name, enName: item.enName, icon: item.icon, uri: `${item.uri}`, childBisFunction: [] };
          if (item.childBisFunction) {
            item.childBisFunction.forEach(child => {
              if (child.type !== "control") {
                obj.childBisFunction.push({ name: child.name, enName: item.enName, icon: child.icon, uri: `${child.uri}` });
              }
            });
          }
          menus.push(obj);
        }
      })
    });
  }

  return { menus, permissions: [... new Set(permissions)] };
}

const permission = {
  state: {
    // 产品列表
    apps: [],
    // 权限列表
    permissions: [],
    // 菜单数据
    menus: [],
    // 目标 app code
    appTarget: ""
  },

  mutations: {
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_APP_TARGET: (state, appTarget) => {
      state.appTarget = appTarget
    },
    SET_APPS: (state, apps) => {
      state.apps = apps
    }
  },

  actions: {
    InitPermissionByApps({ commit }, apps) {
      return new Promise((resolve, reject) => {
        commit("SET_APPS", apps.filter(item => {
          // TODO 
          // 依据产品类型过滤出 web app 产品
          // 暂时硬编码带过滤 app code
          return item.code !== "AposClient";
        }))

        const appTarget = AppCode.getAppCode();

        if (ENV === "development") {
          if (appTarget) {
            const data = parseApps(apps, appTarget);
            commit("SET_APP_TARGET", appTarget)
            commit("SET_PERMISSIONS", data.permissions);
            commit("SET_MENUS", data.menus);
            resolve();
          } else {
            reject()
          }
        } else {
          const data = parseApps(apps, appTarget);
          commit("SET_APP_TARGET", appTarget)
          commit("SET_PERMISSIONS", data.permissions);
          commit("SET_MENUS", data.menus);
          resolve();
        }
      });
    },

    ChangeAppTarget({ commit }, appTarget) {
      AppCode.setAppCode(appTarget)
      commit("SET_APP_TARGET", appTarget)

      // 防止同一个 SPA 切换产品时, permissions & menus 未响应变化
      const data = parseApps(this.state.permission.apps, appTarget)
      commit("SET_PERMISSIONS", data.permissions);
      commit("SET_MENUS", data.menus);
    }
  }
}

export default permission;

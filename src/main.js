import Vue from "vue"
import HeroUI from "gvt-hero"
import App from "./App.vue"
import router from "./routers"
import store from "./vuex/store"
import iView from "iview"
import VueBus from "./utils/bus"
import Auth from "./utils/auth"
import Lang from "./utils/lang"
import { i18n, setI18nLanguage } from "@/setup/i18n-setup"
import * as filters from './filters/index'

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
});

Vue.use(HeroUI);
Vue.use(VueBus);

const cleanLangAndTokenQuery = (to, from , next) => {
  to.query.token && delete to.query.token
  if(to.query.lang) {
    delete to.query.lang
    if(from.path === to.path) {
      iView.LoadingBar.finish()
    }
    next({
      // 替换当前路由地址
      replace: true,
      path: to.path,
      params: to.params,
      query: to.query
    });
  } else {
    next();
  }
}

/**
 * 路径白名单
 *
 * 任意场景都能无阻碍访问
 */
const accessRoutePath = ["/login", "/403", "/404", "/500", "/register", "/tpbind"];

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();

  if(to.query.lang) {
    // query.lang 存在时, 更新本地 lang
    Lang.setLang(to.query.lang)
  } else {
    // 若 query.lang 不存在, 且本地未缓存语种时, 默认将其置为 "zh-CN"
    !Lang.getLang() && Lang.setLang()
  }
  // 初始化 vue-i18n locale
  setI18nLanguage(Lang.getLang())

  // query.token 存在时, 更新本地 jwt
  if(to.query.token) {
    Auth.setToken(to.query.token)
  }

  if(Auth.getToken()) {
    if(to.path === "/login" || to.path === "/") {
      next({path: "/console"});
      iView.LoadingBar.finish();
    } else {
      if(store.getters.user.id === ""){
        store.dispatch("FetchUserData").then(apps => {

          const appTarget = to.query.appcode ? to.query.appcode : ""

          store.dispatch("InitPermissionByApps", {apps, appTarget}).then(() => {
            cleanLangAndTokenQuery(to, from, next)
          })
          
      }).catch(error => {
        Auth.removeToken()
        if(error && error.source === "action") {
          next({ path: `/${error.redirect}` })
        } else {
          next({ path: "/login" })
        }
      })
      }else{
        cleanLangAndTokenQuery(to, from, next)
      }
    }
  }else {
    if(accessRoutePath.indexOf(to.path) > -1) {
      cleanLangAndTokenQuery(to, from, next)
    }else {
      next({path: "/login"});
      iView.LoadingBar.finish();
    }
  }
});

// 注入全部过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

router.afterEach(router => {
  iView.LoadingBar.finish();
});

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: h => h(App)
});

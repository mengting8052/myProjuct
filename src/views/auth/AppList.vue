<style lang="less">
.AppList {
  &::after {
    display: block;
    content: "";
    clear: both;
  }

  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: #ffffff;
    z-index: 999;
    img {
      height: 70px;
      padding: 14px;
    }
  }

  .gvt-tool {
    display: inline-block;
    font-size: 14px;
    line-height: 30px;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    color: #333333;

    div[class^="tool-"] {
      display: inline-block;
    }

    .tool-timezone {
      user-select: none;
      color: #a7a7a7;
      margin-right: 10px;
    }

    .tool-lang {
      position: relative;
      text-align: left;
      user-select: none;
      margin-right: -5px;
      .tool-label {
        padding: 20px 10px;
        min-width: 110px;
        border-left: 1px solid #e9effa;
        cursor: pointer;
        &:after {
          border: solid #333333;
          border-width: 0 2px 2px 0;
          display: inline-block;
          margin-left: 5px;
          padding: 3px;
          transform: rotate(45deg);
          line-height: 30px;
          position: relative;
          top: -3px;
          content: " ";
        }
      }
      .tool-menu {
        position: absolute;
        top: 70px;
        left: 0;
        max-height: 200px;
        width: 100%;
        overflow: auto;
        background-color: #fff;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        ul {
          list-style-type: none;
          border-right: 1px solid #e5e5e5;
          border-left: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
          li {
            padding: 10px;
            cursor: pointer;
            border-top: 1px solid #e5e5e5;
            &:hover {
              background-color: #f2f3f5;
              color: #409fff;
            }
          }
        }
      }
    }

    .tool-user {
      position: relative;
      text-align: left;
      user-select: none;
      .user-name {
        padding: 20px 10px;
        min-width: 110px;
        border-left: 1px solid #e9effa;
        cursor: pointer;
        &:after {
          border: solid #333333;
          border-width: 0 2px 2px 0;
          display: inline-block;
          margin-left: 5px;
          padding: 3px;
          transform: rotate(45deg);
          line-height: 30px;
          position: relative;
          top: -3px;
          content: " ";
        }
      }
      .user-menu {
        position: absolute;
        top: 70px;
        left: 0;
        max-height: 200px;
        width: 100%;
        overflow: auto;
        background-color: #fff;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        ul {
          list-style-type: none;
          border-left: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
          li {
            padding: 10px;
            cursor: pointer;
            border-top: 1px solid #e5e5e5;
            &:hover {
              background-color: #f2f3f5;
              color: #409fff;
            }
          }
        }
      }
    }
  }

  .content {
    background: #fff;
    position: absolute;
    top: 90px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    .apps {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      .app-item {
        cursor: pointer;
        float: left;
        width: 24%;
        text-align: center;
        margin-bottom: 100px;
        .app-logo {
          width: 140px;
          height: 140px;
          display: block;
          margin: 0 auto;
        }
        .app-name {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>


<template>
  <div class="AppList">
    <header>
      <img src="//47.75.105.17:22124/group1/M00/01/07/wKi5SlvrjQCAANGMAAAR2Ug-7l4909.png">

      <div class="gvt-tool">
        <div class="tool-timezone">
          {{ $t("header.currentTimeZone") }}
          {{ getClientTimezone() }}
        </div>

        <div
          class="tool-lang"
          v-clickoutside="handleLangMenuClose"
          @click="langMenuShow = !langMenuShow"
        >
          <div class="tool-label">{{ $t("header.i18n") }}</div>
          <div class="tool-menu" v-show="langMenuShow">
            <ul>
              <li @click="changeLocale('zh-CN')" v-show="locale !== 'zh-CN'">简体中文</li>
              <li @click="changeLocale('en-US')" v-show="locale !== 'en-US'">English</li>
            </ul>
          </div>
        </div>

        <div
          class="tool-user"
          v-clickoutside="handleUserMenuClose"
          @click="userMenuShow = !userMenuShow"
        >
          <div class="user-name">{{ user.userName }}</div>
          <div class="user-menu" v-show="userMenuShow">
            <ul>
              <li v-show="user.isTenant" @click="goHome">{{ $t("header.userInfo") }}</li>
              <li @click="changePassword">{{ $t("header.updatePwd") }}</li>
              <li @click="logout">{{ $t("header.logOut") }}</li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <div class="content">
      <div class="apps">
        <div class="app-item" v-for="item in apps" @click="appClick(item.code)">
          <img
            class="app-logo"
            :src="item.appLogo"
            :alt="item.name"
            :title="item.name"
            onerror="this.src='/static/timg.png'"
          >
          <p class="app-name">{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Lang from "@/utils/lang";
import AppCode from "@/utils/app-code";
import { redirect } from "@/utils/helper";
import { mapGetters, mapActions } from "vuex";

export default {
  directives: {
    clickoutside: {
      bind(el, binding, vnode) {
        function documentHandler(e) {
          if (el.contains(e.target)) {
            return false;
          }
          if (binding.expression) {
            binding.value(e);
          }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener("click", documentHandler);
      },
      unbind(el, binding) {
        document.removeEventListener("click", el.__vueClickOutside__);
        delete el.__vueClickOutside__;
      }
    }
  },

  data() {
    return {
      langMenuShow: false,
      userMenuShow: false,
      locale: Lang.getLang()
    };
  },

  computed: {
    ...mapGetters(["user", "apps"])
  },

  methods: {
    ...mapActions(["Logout"]),

    appClick(url) {
      AppCode.setAppCode(url);
      this.$store.dispatch("ChangeAppTarget", url);
      this.$router.push("/")
      // redirect(url);
    },

    logout() {
      this.Logout();
    },

    goHome() {
      window.location.hash = "/platform/tenant-home";
    },

    changePassword() {
      window.location.hash = "/changePassword";
    },

    handleLangMenuClose() {
      this.langMenuShow = false;
    },

    changeLocale(lang) {
      Lang.setLang(lang);
      window.location.reload();
    },

    handleUserMenuClose() {
      this.userMenuShow = false;
    },

    userMenuClick(param) {
      this.$emit("user-menu-click", param);
    },

    getClientTimezone() {
      const date = new Date();
      const timezone = date.getTimezoneOffset();
      const prefix = timezone < 0 ? "+" : "-";
      const diff = Math.abs(timezone);

      // 计算 hour
      const tmp_hour = Math.floor(diff / 60);
      const hour = tmp_hour < 10 ? `0${tmp_hour}` : tmp_hour;
      // 计算 min
      const tmp_min = Math.floor(diff % 60);
      const min = tmp_min < 10 ? `0${tmp_min}` : tmp_min;

      return `UTC ${prefix} ${hour} : ${min}`;
    }
  }
};
</script>

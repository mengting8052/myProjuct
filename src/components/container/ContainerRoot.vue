<template>
  <hero-layout
    :locale="locale"
    :username="user.userName"
    :menu-data="menuData"
    :route-matched="routeMatched"
    :menu-info="user.isTenant"
    :app-target="appTarget"
    menu-pwd
    @user-info-click="goHome"
    @user-pwd-click="changePassword"
    @user-logout-click="logout">
    <div slot="content">
      <router-view></router-view>
    </div>
  </hero-layout>
</template>

<script>
import Auth from "@/utils/auth";
import { ENV } from "@/utils/env";
import { mapGetters, mapActions } from "vuex";
import Lang from "@/utils/lang"

export default {
  name: "ContainerRoot",

  data() {
    return {
      menuData: [],
      routeMatched: [],
      locale: Lang.getLang()
    }
  },

  computed: {
    ...mapGetters(["menus", "user", "isTenant", "appTarget"])
  },

  watch: {
    $route() {
      this.routeMatched = this.$route.matched;
    }
  },

  created() {
    this.routeMatched = this.$route.matched;
  },

  mounted() {
    this.$nextTick(() => {
      this.menuData = ENV === "development" ? this.mockMenuData() : this.menus
    });
  },

  methods: {
    logout() {
      this.Logout();
    },

    goHome(){
      window.location.hash = "/platform/tenant-home"
    },

    changePassword(){
      window.location.hash = "/changePassword"
    },

    mockMenuData() {
      //isTenant: true 默认为商户用户
      var mock = this.isTenant ? require("../../mock/tenantData.js") : require("../../mock/adminData.js");
      return mock.menuData;
    },

    ...mapActions([
      'Logout'
    ]),
  }
}
</script>

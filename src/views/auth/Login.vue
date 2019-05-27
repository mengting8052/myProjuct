<template>
  <div>
    <div class="gvt-login-skin"></div>
    <img
      class="gvt-login-icon"
      src="//47.75.105.17:22124/group1/M00/01/07/wKi5SlvrjMOAQHHgAAKHbYU_e_w612.png"
    >
    <div class="gvt-login-form gvt-form">
      <p class="gvt-login-title">{{ $t("loginForm.title") }}</p>
      <div class="gvt-form-item">
        <label>{{ $t("loginForm.username") }}</label>
        <br>
        <input type="text" v-model="form.username" @keyup.enter="submit">
      </div>
      <div class="gvt-form-item">
        <label>{{ $t("loginForm.password") }}</label>
        <br>
        <input type="password" v-model="form.password" @keyup.enter="submit">
      </div>
      <div class="gvt-form-item">
        <button type="button" @click="submit">{{ $t("loginForm.loginBtn") }}</button>
      </div>
      <div class="tp-login-item" v-for="item in supports" @click="tpLoginClick(item.loginUrl)">
        <img :src="'/static/' + item.code + '.png'" />
        <span v-show="item.code === 'WEIXIN'">{{$t('loginForm.tpLoginText.weixin')}}</span>
        <span v-show="item.code === 'ALIPAY'">{{$t('loginForm.tpLoginText.alipay')}}</span>
      </div>
    </div>
    <footer class="gvt-login-footer">Copyright &copy; 2019 Grand View Technology Pty Ltd</footer>
  </div>
</template>

<script>
import md5 from "js-md5";
import { login, supportType } from "@/api/auth";
import Auth from "@/utils/auth";
import { redirect } from "@/utils/helper";
import { BACKEND_DOMAIN, WEBPACK_DEV_SERVER_PROXY_TARGET, ENV } from "@/utils/env";


export default {
  name: "auth-login",

  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      supports: []
    };
  },

  computed: {
    backendDomain() {
      return BACKEND_DOMAIN === "/api" ? WEBPACK_DEV_SERVER_PROXY_TARGET : BACKEND_DOMAIN
    }
  },

  created() {
    supportType().then(response => {
      this.supports = response.data;
    });
  },

  mounted() {
    document.title = `Astraea - ${this.$t("loginForm.loginBtn")}`;
  },

  methods: {
    tpLoginClick(redirectUrl) {
      redirect(this.backendDomain + redirectUrl);
    },

    submit() {
      const params = Object.assign({}, this.form, {
        password: md5(this.form.password)
      });
      login(params)
        .then(response => {
          const jwt = response.data.token;
          Auth.setToken(jwt);
          // const path = ENV === "development" ? "/" : "/app-list"
          this.$router.push("/");
        })
        .catch(error => {
          this.$Message.error(this.$t("common.message.accOrPassword"));
        });
    }
  }
};
</script>


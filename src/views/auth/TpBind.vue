<template>
  <div>
    <div class="gvt-login-skin"></div>
    <img
      class="gvt-login-icon"
      src="//47.75.105.17:22124/group1/M00/01/07/wKi5SlvrjMOAQHHgAAKHbYU_e_w612.png"
    >
    <div class="gvt-login-form gvt-form">
      <p class="gvt-login-title">{{ $t("bindForm.title") }}</p>
      <div class="gvt-form-item">
        <label>{{ $t("bindForm.username") }}</label>
        <br>
        <input type="text" v-model="form.username" @keyup.enter="submit">
      </div>
      <div class="gvt-form-item">
        <label>{{ $t("bindForm.password") }}</label>
        <br>
        <input type="password" v-model="form.password" @keyup.enter="submit">
      </div>
      <div class="gvt-form-item">
        <button type="button" @click="submit">{{ $t("bindForm.loginBtn") }}</button>
      </div>
    </div>
    <footer class="gvt-login-footer">Copyright &copy; 2019 Grand View Technology Pty Ltd</footer>
  </div>
</template>

<script>
import md5 from "js-md5";
import { tpBind } from "@/api/auth";
import Auth from "@/utils/auth";

export default {
  name: "auth-login",

  data() {
    return {
      form: {
        username: "",
        password: "",
        appid: this.$route.query.appid || ""
      },
    };
  },

  mounted() {
    document.title = `Astraea - ${this.$t("bindForm.loginBtn")}`;
  },

  methods: {
    submit() {
      const params = Object.assign({}, this.form, {
        password: md5(this.form.password)
      });
      tpBind(params)
        .then(response => {
          const jwt = response.data.token;
          Auth.setToken(jwt);
          this.$router.push("/");
        })
        .catch(error => {
          this.$Message.error(this.$t("common.message.accOrPassword"));
        });
    }
  }
};
</script>


<template>
  <div>
    <Form ref="changePassword" :label-width="100" :model="form" :rules="rules">
      <FormItem :label="$t('changePassword.form.label.name')">
        <p>{{form.name}}</p>
      </FormItem>
      <FormItem :label="$t('changePassword.form.label.oldPassword')" prop="oldPassWord">
        <Input type="password" v-model="form.oldPassWord" autocomplete="off"></Input>
      </FormItem>
      <FormItem :label="$t('changePassword.form.label.newPassword')" prop="newPassword">
        <Input type="password" v-model="form.newPassword" autocomplete="off"></Input>
      </FormItem>
      <FormItem :label="$t('changePassword.form.label.checkPass')" prop="checkPass">
        <Input type="password" v-model="form.checkPass" autocomplete="off"></Input>
      </FormItem>

      <FormItem>
        <Button type="ghost" @click="cancel">{{$t("changePassword.btns.cancel")}}</Button>
        <Button type="primary"@click="submit":loading="btnLoading">{{$t("changePassword.btns.save")}}</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import { changePassword } from "@/api/auth";
import md5 from "js-md5";
import { Mixin_Redirect } from "@/mixins"

export default {
  mixins: [Mixin_Redirect],

  data() {
    var oldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("changePassword.form.rules.oldPassWord")));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("changePassword.form.rules.newPassword")));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs["changePassword"].validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("changePassword.form.rules.again")));
      } else if (value !== this.form.newPassword) {
        callback(new Error(this.$t("changePassword.form.rules.inconsistent")));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: "",
        oldPassWord: "",
        newPassword: "",
        checkPass: ""
      },

      btnLoading: false,

      rules: {
        oldPassWord: [{ required: true, validator: oldPass, trigger: "blur" }],
        newPassword: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },

  computed: {
    ...mapGetters(["user"])
  },

  created() {
    this.form.name = this.user.name;
  },

  methods: {
    ...mapActions(["Logout"]),

    cancel() {
      this.aposFlag ? this.redirectApos() : this.$router.go(-1)
    },

    submit() {
      this.$refs["changePassword"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          changePassword({
            newPassword: md5(this.form.newPassword),
            password: md5(this.form.oldPassWord)
          })
            .then(response => {
              this.$Message.success(this.$t("changePassword.others.success"));
              this.aposFlag ? this.redirectApos() : this.Logout()
            })
            .catch(error => {
              this.btnLoading = false;
              this.$Message.error(error.message);
            });
        }
      });
    }
  }
};
</script>


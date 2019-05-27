<template>
  <Modal v-model="show" :title="$t('common.changePassword')" @on-visible-change="visibleChange">
    <Form ref="password-form" :model="form.data" :rules="form.rules" :label-width="100">
      <FormItem :label="$t('common.newPassword')" prop="newPassword">
        <Input type="password" v-model="form.data.newPassword" autocomplete="off"></Input>
      </FormItem>
      <FormItem :label="$t('common.confirmPassword')" prop="confirmPassword">
        <Input type="password" v-model="form.data.confirmPassword" autocomplete="off"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="show = !show">{{$t("common.form.btn.cancel")}}</Button>
      <Button type="primary" :loading="btnLoading" @click="confirm">{{$t("common.form.btn.sure")}}</Button>
    </div>
  </Modal>
</template>

<script>
import { empassword } from "@/api/auth"
import md5 from "js-md5"

export default {
  props: {
    value: Boolean,
    // 旧密码
    password: {
      type: String,
      required: true
    },
    // 用户ID
    userId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    const passwordValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("changePassword.form.rules.newPassword")));
      } else {
        if (this.form.data.confirmPassword !== "") {
          this.$refs["password-form"].validateField("confirmPassword");
        }
        callback();
      }
    };
    const confirmPasswordValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("changePassword.form.rules.again")));
      } else if (value !== this.form.data.newPassword) {
        callback(new Error(this.$t("changePassword.form.rules.inconsistent")));
      } else {
        callback();
      }
    };

    return {
      show: this.value,
      btnLoading: false,
      form: {
        data: { newPassword: "", confirmPassword: "" },
        rules: {
          newPassword: [
            { required: true, validator: passwordValidator, trigger: "blur" }
          ],
          confirmPassword: [
            { required: true, validator: confirmPasswordValidator, trigger: "blur" }
          ]
        }
      }
    }
  },

  watch: {
    show(val) {
      this.$emit("input", val)
    },

    value(val) {
      this.show = val
    }
  },

  methods: {
    confirm() {
      this.$refs["password-form"].validate(valid => {
        if(valid) {
          this.btnLoading = true
          const params = {userId: this.userId, newPassword: md5(this.form.data.newPassword), password: this.password }
          empassword(params).then(response => {
            this.$Message.success(this.$t("staffModify.others.success"));
            this.show = !this.show
            this.$emit("on-success", md5(this.form.data.newPassword));
            this.btnLoading = false
          }).catch(error => {
            this.$Message.error(error.message)
            this.btnLoading = false
          })
        }
      })
    },

    visibleChange(val) {
      if(val) {
        this.$refs["password-form"].resetFields()
      }
    }
  }
}
</script>


<template>
  <Form :model="form.data" ref="editForm" :rules="form.rules" :label-width="100">
    <!-- 编码 -->
    <FormItem :label="$t('authorityManage.form.label.code')" prop="code">
      <Input v-model="form.data.code" :maxlength="64"></Input>
    </FormItem>
    <!-- 名称  -->
    <FormItem :label="$t('authorityManage.form.label.name')" prop="name">
      <Input v-model="form.data.name" :maxlength="64"></Input>
    </FormItem>
    <!-- 模块 -->
    <FormItem :label="$t('authorityManage.form.label.mid')" prop="mid">
      <Select v-model="form.data.mid" filterable @on-change="changeSubSystem">
        <Option v-for="item in moduleList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </FormItem>
    <!-- 路径 -->
    <FormItem :label="$t('authorityManage.form.label.uri')" prop="uri">
      <Input v-model="form.data.uri" :maxlength="256"></Input>
    </FormItem>
    <!-- 请求方法 -->
    <FormItem :label="$t('authorityManage.form.label.httpMethod')" prop="httpMethod">
      <config-select code="http_method" v-model="form.data.httpMethod"></config-select>
    </FormItem>
    <!-- 描述 -->
    <FormItem :label="$t('authorityManage.form.label.description')" prop="description">
      <Input type="textarea" v-model="form.data.description" :maxlength="256"></Input>
    </FormItem>
    <br>
    <FormItem>
      <Button type="primary" @click="confirm()":loading="btnLoading">{{$t('authorityManage.btns.save')}}</Button>
      <Button type="ghost"  @click="$router.push({ name: 'authority-list' })">{{$t('authorityManage.btns.cancel')}}</Button>
    </FormItem>
  </Form>
</template>

<script>
import { detail, update } from "@/api/admin/authorityList";
import { queryModuleList } from "@/api/admin/module-manage/background-module";

import { mapGetters } from "vuex";

import { ConfigSelect } from "@/components/config";
export default {
  name: "editForm",

  components: { ConfigSelect },

  data() {
    var validateCode = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error(this.$t("authorityManage.form.rules.code")));
        return;
      }

      if (/^[A-Za-z0-9]+$/.test(value)) {
        callback();
      } else {
        callback(new Error(this.$t("authorityManage.form.rules.numOrLetter")));
      }
    };
    return {
      form: {
        data: {
          code: "",
          name: "",
          mid: "",
          uri: "",
          httpMethod: "",
          description: "",
          sid: ""
        },

        rules: {
          code: [{ required: true, validator: validateCode, trigger: "blur" }],
          name: [
            {
              required: true,
              message: this.$t("authorityManage.form.label.name"),
              trigger: "blur"
            }
          ],
          uri: [
            {
              required: true,
              message: this.$t("authorityManage.form.label.uri"),
              trigger: "blur"
            }
          ],
          httpMethod: [
            {
              required: true,
              message: this.$t("authorityManage.form.label.httpMethod"),
              trigger: "blur"
            }
          ],
          mid: [
            {
              required: true,
              type: "number",
              message: this.$t("authorityManage.form.rules.module"),
              trigger: "blur"
            }
          ]
        }
      },

      moduleList: [],

      btnLoading: false
    };
  },
  created() {
    queryModuleList({}).then(res => {
      this.moduleList = res.data;
      this.$nextTick(() => {
        detail(this.$route.query.id).then(res => {
          this.form.data = res.data;
          this.moduleList.filter(item => {
            if (item.id == this.form.data.mid) {
              this.form.data.sid = item.sid;
            }
          });
        });
      });
    });
  },

  computed: {
    ...mapGetters(["user"])
  },

  methods: {
    //模块chang事件找到sid
    changeSubSystem(val) {
      this.form.data.mid = val;
      const match = this.moduleList.filter(item => item.id === val);
      if (match.length > 0) {
        this.form.data.sid = match[0].sid;
      }
    },

    confirm() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          update(this.form.data)
            .then(res => {
              this.$Message.success(this.$t("authorityManage.others.success"));
              this.$router.push({ name: "authority-list" });
            })
            .catch(err => {
              this.btnLoading = false;
              this.$Message.error(err.message);
            });
        }
      });
    }
  }
};
</script>

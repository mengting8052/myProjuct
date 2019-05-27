<template>
  <div>
    <Form :label-width="100" :model="form.data" ref="roleAdd" :rules="form.rules">
      <FormItem :label="$t('roleModify.form.label.code')" prop="code">
        <Input type="text" v-model="form.data.code" :maxlength="64"/>
      </FormItem>
      <FormItem :label="$t('roleModify.form.label.name')" prop="name">
        <Input type="text" v-model="form.data.name" :maxlength="64"/>
      </FormItem>
      <FormItem
        :label="$t('roleModify.form.label.privilege')"
        required
        :error="permissionError"
      >
        <Button type="ghost" icon="plus" @click="visible = true"></Button>
      </FormItem>

      <FormItem v-show="apps.length" >
        <Tabs type="card" :animated="false">
          <TabPane
            v-for="(app, index) in apps"
            :key="app.id"
            :name="`${index},${app.id}`"
            :label="app.name"
          >
            <div>
              <Checkbox
                v-model="app._appCheckAll"
                style="font-size: 16px;font-weight: bold"
                @on-change="appCheckAllChange(app.id, ...arguments)"
              >{{$t("userManage.form.label.checkAll")}}</Checkbox>
            </div>
            <app-detail :app="app" @on-check-all-change="detailCheckAllChange(index, ...arguments)"></app-detail>
          </TabPane>
        </Tabs>
      </FormItem>

      <FormItem>
        <Button
          type="primary"
          @click="confirm"
          :loading="btnLoading"
        >{{$t("common.form.btn.confirm")}}</Button>
        <Button type="ghost" @click="$router.go('-1')">{{$t("common.form.btn.cancel")}}</Button>
      </FormItem>
    </Form>

    <app-modal :visible.sync="visible" @selection-change="selectionChange"></app-modal>
  </div>
</template>

<script>
import AppModal from "./components/AppModal";
import AppDetail from "./components/AppDetail";
import { mapGetters } from "vuex";
import { findComponentsDownward } from "@/utils/helper";
import { queryTreeByAppIds } from "@/api/tenant/businessFeature";
import { add } from "@/api/tenant/roleManage";

export default {
  components: { AppModal, AppDetail },

  data() {
    var validateCode = (rule, value, callback) => {
      if (!value || value === "") {
        callback(new Error(this.$t("roleModify.form.rules.code")));
      } else {
        if (/^[A-Za-z0-9/-]+$/.test(value)) {
          callback();
        } else {
          callback(new Error(this.$t("roleModify.form.rules.only")));
        }
      }
    };
    return {
      btnLoading: false,
      visible: false,
      permissionError: "",
      collapse: "2",
      form: {
        data: {
          code: "",
          name: ""
        },
        rules: {
          code: [{ required: true, validator: validateCode, trigger: "blur" }],
          name: [
            {
              required: true,
              message: this.$t("roleModify.form.rules.name"),
              trigger: "blur"
            }
          ]
        }
      },
      apps: []
    };
  },

  computed: {
    ...mapGetters(["user"])
  },

  methods: {
    appCheckAllChange(id, checked) {
      const AppDetails = findComponentsDownward(this, "AppDetail");
      const AppDetail = AppDetails.find(
        component => component.detail.id === id
      );
      AppDetail.checkOrUnCheckAll(checked);
    },

    detailCheckAllChange(index, checked) {
      this.apps[index]._appCheckAll = checked;
    },

    selectionChange(selection) {
      queryTreeByAppIds(selection).then(response => {
        this.apps.push(
          ...response.data.map(item => {
            item._appCheckAll = false;
            return item;
          })
        );
      });
    },

    confirm() {
      const AppDetailComponents = findComponentsDownward(this, "AppDetail");
      const roleBisFuncList = [];
      AppDetailComponents.map(component => {
        const data = component.getRequestParams();
        if (data) roleBisFuncList.push(data);
      });

      if (roleBisFuncList.length === 0) {
        this.permissionError = this.$t("roleModify.form.rules.privilege");
        return;
      } else {
        const params = Object.assign({}, this.form.data, {
          roleBisFuncList,
          system: !this.user.isTenant
        });
        this.$refs["roleAdd"].validate(valid => {
          if (valid) {
            this.btnLoading = true;
            add(params)
              .then(response => {
                this.$Message.success(this.$t("roleModify.others.success"));
                this.$router.push({ name: "role-manage" });
              })
              .catch(error => {
                this.btnLoading = false;
                this.$Message.error(error.message);
              });
          }
        });
      }
    }
  }
};
</script>


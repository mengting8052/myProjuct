<template>
  <Form :model="form.data" ref="addForm" :rules="form.rules" :label-width="100">
    <FormItem :label="$t('userManage.form.label.userName')" prop="userName">
      <Input v-model="form.data.userName" :maxlength="128" :disabled="onlyRelevanceRole"></Input>
    </FormItem>
    <FormItem :label="$t('userManage.form.label.name')" prop="name">
      <Input v-model="form.data.name" :maxlength="128" :disabled="onlyRelevanceRole"></Input>
    </FormItem>
    <FormItem :label="$t('userManage.form.label.type')" prop="system">
      <Select v-model="form.data.system" disabled>
        <Option v-for="item in userTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem prop="roleIds">
      <h3 style="marginLeft:-60px">{{ $t("userManage.form.label.relevanceRole") }}</h3>
      <Checkbox
        v-model="checkAll"
        @on-change="checkBoxAllChange"
      >{{ $t("userManage.form.label.checkAll") }}</Checkbox>
      <CheckboxGroup v-model="form.data.roleIds" @on-change="checkBoxGroupChange">
        <Row>
          <Col :md="8" :lg="4" v-for="role in roleList" :key="role.id">
            <Checkbox :label="role.id" :key="role.id">{{role.name}}</Checkbox>
          </Col>
        </Row>
      </CheckboxGroup>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="confirm()" :loading="btnLoading">
        {{ $t("userManage.btns.save") }}
      </Button>
      <Button type="ghost" @click="$router.push({ name: 'user-list' })">
        {{ $t("userManage.btns.cancel") }}
      </Button>
    </FormItem>
  </Form>
</template>

<script>
import { queryRoleList } from "@/api/tenant/roleManage";
import { detail, update } from "@/api/admin/user-manage";

export default {
  name: "addForm",

  props: {
    onlyRelevanceRole: {
      //用来区分分配角色和编辑 分配角色表单为不可编辑状态
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      form: {
        data: {
          system: 0,
          userName: null,
          name: "",
          password: null,
          roleIds: []
        },

        rules: {
          userName: [
            {
              required: true,
              message: this.$t("userManage.form.rules.userName"),
              trigger: "blur"
            }
          ]
        }
      },

      userTypes: [
        { value: 1, label: this.$t("userManage.userTypes.admin") },
        { value: 0, label: this.$t("userManage.userTypes.tenant") }
      ],

      roleList: [], //角色列表集合

      checkAll: false, //控制全选状态

      btnLoading: false
    };
  },
  created() {
    // 获取角色列表
    queryRoleList({ uid: this.$route.query.id }).then(res => {
      this.roleList = res.data;
      return new Promise(resolve => {
        this.getUerDetail();
      });
    });
  },

  methods: {
    getUerDetail() {
      detail(this.$route.query.id).then(res => {
        this.form.data = {
          id: res.data.id,
          userName: res.data.userName,
          name: res.data.name,
          roleIds: res.data.roleIds,
          password: res.data.password
        };
        if (res.data.roleIds && res.data.roleIds.length > 0) {
          this.form.roleIds = res.data.roleIds;
          this.roleList.length === this.form.roleIds.length &&
            (this.checkAll = true);
        } else {
          this.form.roleIds = [];
        }
        if (res.data.system) {
          this.form.data.system = 1;
        } else {
          this.form.data.system = 0;
        }
      });
    },

    confirm() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          // system 1(true)  平台用户   0(false) 商户
          const system = this.form.data.system === 0 ? false : true;
          const params = Object.assign({}, this.form.data, { system });
          update(params)
            .then(res => {
              this.$Message.success(this.$t("userManage.others.success"));
              this.$router.push({ name: "user-list" });
            })
            .catch(err => {
              this.btnLoading = false;
              this.$Message.error(err.message);
            });
        }
      });
    },

    checkBoxAllChange(val) {
      if (val) {
        this.form.data.roleIds = this.roleList.map(item => item.id);
      } else {
        this.form.data.roleIds = [];
      }
    },

    checkBoxGroupChange(arr) {
      if (arr.length === this.roleList.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    }
  }
};
</script>

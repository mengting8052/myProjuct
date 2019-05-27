<template>
  <div class="staffEdit">
    <Form ref="editForm" :model="form.employeeDetail" :rules="rules" :label-width="100">
      <!-- ID -->
      <FormItem prop="ID" label="ID">
        <Input type="text" v-model="form.employeeDetail.id" readonly></Input>
      </FormItem>
      <!-- 用户名 -->
      <FormItem prop="cacheUserName" :label="$t('staffModify.form.employeeDetail.cacheUserName')">
        <Input
          type="text"
          v-model="form.employeeDetail.cacheUserName"
          :maxlength="64"
          style="width:200px"
          readonly
        ></Input>
      </FormItem>
      <!-- 密码 -->
      <!-- <FormItem prop="cachePassword" :label="$t('staffModify.form.employeeDetail.cachePassword')">
        <Input type="text" v-model="form.employeeDetail.cachePassword" disabled></Input>
      </FormItem> -->
      <!-- 姓名 -->
      <FormItem prop="name" :label="$t('staffModify.form.employeeDetail.name')">
        <Input type="text" v-model="form.employeeDetail.name" :maxlength="64"></Input>
      </FormItem>
      <!-- 电话 -->
      <FormItem prop="phone" :label="$t('staffModify.form.employeeDetail.phone')">
        <Input type="text" v-model="form.employeeDetail.phone"></Input>
      </FormItem>
      <!-- 身份证号 -->
      <FormItem prop="identityNo" :label="$t('staffModify.form.employeeDetail.identityNo')">
        <Input type="text" v-model="form.employeeDetail.identityNo"></Input>
      </FormItem>
      <!-- 生日 -->
      <FormItem prop="birthday" :label="$t('staffModify.form.employeeDetail.birthday')">
        <DatePicker type="date" format="yyyy-MM-dd" v-model="form.employeeDetail.birthday"></DatePicker>
      </FormItem>
      <!-- 入职时间 -->
      <FormItem prop="entryTime" :label="$t('staffModify.form.employeeDetail.entryTime')">
        <DatePicker type="date" v-model="form.employeeDetail.entryTime"></DatePicker>
      </FormItem>
      <!-- 离职时间 -->
      <FormItem prop="departureTime" :label="$t('staffModify.form.employeeDetail.departureTime')">
        <DatePicker type="date" v-model="form.employeeDetail.departureTime"></DatePicker>
      </FormItem>
      <!-- 所属部门 -->
      <FormItem prop="organName" :label="$t('staffModify.form.employeeDetail.organId')">
        <Input type="text" v-model="form.employeeDetail.organName" readonly style="width: 200px;">
          <Button
            slot="append"
            icon="ios-search"
            @click="modalState.showModal=!modalState.showModal"
          ></Button>
        </Input>
      </FormItem>
      <!-- 性别 -->
      <FormItem prop="gender" :label="$t('staffModify.form.employeeDetail.gender')">
        <RadioGroup v-model="form.employeeDetail.gender" style="width:200px">
          <Radio v-for="item in genderList" :key="item.code" :label="item.code">{{item.name}}</Radio>
        </RadioGroup>
      </FormItem>
      <!-- 工号 -->
      <FormItem prop="number" :label="$t('staffModify.form.employeeDetail.number')">
        <Input type="text" v-model="form.employeeDetail.number" :maxlength="128"></Input>
      </FormItem>
      <!-- <p class="tip">{{$t("staffModify.form.version")}}</p> -->
      <!-- 分配角色 -->
      <FormItem :label-width="30" prop="roleIds">
        <h3>{{$t("staffModify.form.roles.allot")}}</h3>
        <Checkbox
          v-model="checkData.checkAll"
          @on-change="checkBoxAllChange"
          style="marginLeft:30px"
        >{{$t("staffModify.form.roles.allCheck")}}</Checkbox>
        <CheckboxGroup
          v-model="form.roleIds"
          @on-change="checkBoxGroupChange"
          style="marginLeft:30px"
        >
          <Checkbox v-for="role in checkData.roleList" :label="role.id" :key="role.id">{{role.name}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          @click="confirm"
          :loading="btnLoading"
        >{{$t('staffModify.btns.save')}}</Button>
        <Button
          type="error"
          @click="passwordModal = !passwordModal"
        >{{$t('staffModify.btns.resetPassword')}}</Button>
        <Button type="ghost" @click="$router.go('-1')">{{$t('staffModify.btns.cancel')}}</Button>
      </FormItem>
    </Form>

    <!-- 组织机构弹窗 -->
    <Modal v-model="modalState.showModal" :title="$t('staffModify.form.modal.title')">
      <organ-tree @handleNodeChange="getNode"></organ-tree>
      <div slot="footer">
        <Button @click="modalState.showModal=!modalState.showModal">{{$t("common.modal.cancel")}}</Button>
        <Button @click="save" type="primary">{{$t("common.modal.save")}}</Button>
      </div>
    </Modal>

    <password v-model="passwordModal" :user-id="form.employeeDetail.uid" :password="form.employeeDetail.cachePassword" @on-success="passwordUpdateSuccess"></password>
  </div>
</template>
<script>
import organTree from "./components/organTree";
import Password from "@/components/password"

import { getGenderInfo } from "@/api/tenant/staffManage";
import { queryRoleList } from "@/api/tenant/roleManage";
import { detail, update, reset } from "@/api/tenant/staffManage";

import { validateIDNumber } from "@/validate/index";

export default {
  name: "staffEdit",

  components: { organTree, Password },

  data() {
    return {
      passwordModal: false,

      form: {
        employeeDetail: {
          id: "",
          cacheUserName: "", //用户名
          cachePassword: "", //密码
          name: "", //姓名
          phone: "", //电话
          uid: "",
          birthday: "", //生日
          identityNo: "", //身份证号
          gender: "MALE", //性别
          entryTime: "", //入职日期
          departureTime: "", //离职日期
          organId: "", //所属部门id
          organName: "", //所属部门
          number: "" //工号
        },

        roleIds: [] //角色
      },
      rules: {
        cacheUserName: [
          {
            required: true,
            message: this.$t("staffModify.form.rules.userName"),
            trigger: "blur"
          }
        ],
        cachePassword: [
          {
            required: true,
            message: this.$t("staffModify.form.rules.password"),
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: this.$t("staffModify.form.rules.name"),
            trigger: "blur"
          }
        ],
        //  phone: [{ type:"number", message:this.$t("common.form.rules.phone"),trigger: "blur" }],
        identityNo: [
          {
            max: 18,
            message: this.$t("staffModify.form.rules.identityNo"),
            trigger: "blur"
          }
        ],
        identityNo: [{ validator: validateIDNumber, trigger: "blur" }],
        organName: [
          {
            required: true,
            message: this.$t("staffModify.form.rules.organName"),
            trigger: "blur"
          }
        ]
      },
      btnLoading: false,
      modalState: {
        showModal: false //弹窗
      },
      genderList: [], //存放性别
      checkData: {
        checkAll: false, //控制全选
        roleList: [] //获取到的所有角色
      }
    };
  },

  computed: {
    tenantCode() {
      return "@" + this.$store.state.user.code;
    }
  },

  created() {
    // 获取角色列表
    queryRoleList({ id: this.form.employeeDetail.uid }).then(res => {
      this.checkData.roleList = res.data;
      return new Promise(resolve => {
        this.getStaffDetail();
      });
    }),
      // 获取性别
      getGenderInfo("gender").then(res => {
        this.genderList = res.data;
      });
  },

  methods: {
    passwordUpdateSuccess(newPassword) {
      this.form.employeeDetail.cachePassword = newPassword;
    },

    getStaffDetail() {
      detail(this.$route.query.id).then(res => {
        this.form.employeeDetail = {
          id: res.data.employeeDetail.id,
          uid: res.data.employeeDetail.uid,
          cacheUserName: res.data.employeeDetail.username,
          cachePassword: res.data.employeeDetail.password,
          name: res.data.employeeDetail.name,
          phone: res.data.employeeDetail.phone,
          identityNo: res.data.employeeDetail.identityNo,
          gender: res.data.employeeDetail.gender,
          organId: res.data.employeeDetail.organId,
          organName: res.data.employeeDetail.organName,
          number: res.data.employeeDetail.number
        };
        if (
          res.data.employeeDetail.birthday &&
          res.data.employeeDetail.birthday != null
        ) {
          this.form.employeeDetail.birthday = this.$options.filters.timeFormat(
            res.data.employeeDetail.birthday
          );
        } else {
          this.form.employeeDetail.birthday = null;
        }
        if (
          res.data.employeeDetail.entryTime &&
          res.data.employeeDetail.entryTime != null
        ) {
          this.form.employeeDetail.entryTime = this.$options.filters.timeFormat(
            res.data.employeeDetail.entryTime
          );
        } else {
          this.form.employeeDetail.entryTime = null;
        }
        if (
          res.data.employeeDetail.departureTime &&
          res.data.employeeDetail.departureTime != null
        ) {
          this.form.employeeDetail.departureTime = this.$options.filters.timeFormat(
            res.data.employeeDetail.departureTime
          );
        } else {
          this.form.employeeDetail.departureTime = null;
        }
        if (res.data.roleIds && res.data.roleIds.length > 0) {
          this.form.roleIds = res.data.roleIds;
          this.checkData.roleList.length === this.form.roleIds.length &&
            (this.checkData.checkAll = true);
        } else {
          this.form.roleIds = [];
        }
      });
    },

    // 所属部门确定按钮
    save() {
      this.modalState.showModal = false;
    },

    // 提交员工信息
    confirm() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          this.form.employeeDetail.password = this.form.employeeDetail.cachePassword;
          this.form.employeeDetail.username = this.form.employeeDetail.cacheUserName;
          update(this.form)
            .then(res => {
              this.$Message.success(this.$t("staffModify.others.success"));
              this.$router.push({ name: "staff-manage" });
            })
            .catch(err => {
              this.btnLoading = false;
              this.$Message.error(err.message);
            });
        }
      });
    },

    // 获取选择所属部门信息
    getNode(obj) {
      this.form.employeeDetail.organId = obj[0].value;
      this.form.employeeDetail.organName = obj[0].title;
    },

    checkBoxAllChange(val) {
      if (val) {
        this.form.roleIds = this.checkData.roleList.map(item => item.id);
      } else {
        this.form.roleIds = [];
      }
    },

    checkBoxGroupChange(arr) {
      if (arr.length === this.checkData.roleList.length) {
        this.checkData.checkAll = true;
      } else {
        this.checkData.checkAll = false;
      }
    }
  }
};
</script>

<style lang="less">
.staffEdit {
  .tip {
    padding-left: 40px;
    line-height: 40px;
    color: #909399;
  }
}
</style>

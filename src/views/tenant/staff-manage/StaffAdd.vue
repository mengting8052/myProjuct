<template>
  <div class="staffAdd">
    <Form ref="addForm" :model="form.employeeDetail" :rules="rules" :label-width="100">
      <!-- 用户名 -->
      <FormItem prop="cacheUserName" :label="$t('staffModify.form.employeeDetail.cacheUserName')">
        <Input
          type="text"
          v-model="form.employeeDetail.cacheUserName"
          :maxlength="64"
          style="width:200px"
        >
          <span slot="append">{{tenantCode}}</span>
        </Input>
      </FormItem>
      <!-- 密码 -->
      <FormItem prop="password" :label="$t('staffModify.form.employeeDetail.cachePassword')">
        <Input type="text" v-model="form.employeeDetail.password"></Input>
      </FormItem>
      <!-- 姓名 -->
      <FormItem prop="name" :label="$t('staffModify.form.employeeDetail.name')">
        <Input type="text" v-model="form.employeeDetail.name" :maxlength="64"></Input>
      </FormItem>
      <!-- 电话 -->
      <FormItem prop="phone" :label="$t('staffModify.form.employeeDetail.phone')">
        <Input type="text" v-model="form.employeeDetail.phone"  number></Input>
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
        <Input type="text" style="width:200px" v-model="form.employeeDetail.organName" readonly>
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
      <FormItem :label-width="36" prop="roleIds">
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
        <Button type="ghost" @click="$router.go('-1')">{{$t('staffModify.btns.cancel')}}</Button>
      </FormItem>
    </Form>

    <!-- 组织机构弹窗 -->
    <Modal v-model="modalState.showModal" :title="$t('staffModify.form.modal.title')">
      <organ-tree @handleNodeChange="getNode"></organ-tree>
      <div slot="footer">
        <Button @click="save" type="primary">{{$t("common.modal.save")}}</Button>
        <Button @click="modalState.showModal=!modalState.showModal">{{$t("common.modal.cancel")}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import organTree from "./components/organTree";

import { getGenderInfo } from "@/api/tenant/staffManage";
import { queryRoleList } from "@/api/tenant/roleManage";
import { add } from "@/api/tenant/staffManage";

import md5 from "js-md5";

 import { validateIDNumber } from "@/validate/index";

export default {
  name: "staffAdd",

  components: { organTree },

  props: {},

  data() {
    return {
      form: {
        employeeDetail: {
          cacheUserName: "", //用户名
          password: "", //密码
          name: "", //姓名
          phone: "", //电话
          birthday: "", //生日
          identityNo: "", //身份证号
          uid: "",
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
        password: [
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
    // 获取性别
    getGenderInfo("gender").then(res => {
      this.genderList = res.data;
    });
    // 获取角色列表
    queryRoleList({ id: this.form.employeeDetail.uid }).then(res => {
      this.checkData.roleList = res.data;
    });
  },

  methods: {
    // 所属部门确定按钮
    save() {
      this.modalState.showModal = false;
    },

    // 提交员工信息
    confirm() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          // 密码加密

          // this.form.employeeDetail.cachePassword=md5(this.form.employeeDetail.cachePassword);
          this.form.employeeDetail.username =
            this.form.employeeDetail.cacheUserName + this.tenantCode;
          const params = Object.assign(
            {},
            this.form.employeeDetail,
            { password: md5(this.form.employeeDetail.password) }
          );
          const requestData = Object.assign({}, this.form, {employeeDetail: params})
          add(requestData)
            .then(res => {
              this.$Message.success(this.$t("staffModify.others.success"));
              this.$router.push({ name: "staff-manage" });
            })
            .catch(error => {
              this.btnLoading = false;
              this.$Message.error(error.message);
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
.staffAdd {
  .tip {
    padding-left: 40px;
    line-height: 40px;
    color: #909399;
  }
}
</style>

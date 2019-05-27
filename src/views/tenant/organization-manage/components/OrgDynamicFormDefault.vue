<template>
<div>
  <Form :label-width="100" :model="form.data" ref="CreateOrUpdateForm" :rules="form.rules" >
    <FormItem :label="$t('OrgManage.form.label.parentIds')" prop="parentIds">
      <org-cascader :orgs="$attrs.orgs" :org-ids="form.data.parentIds" @on-selected-data-change="selectedDataChange"></org-cascader>
    </FormItem>
    <FormItem :label="$t('OrgManage.form.label.name')" prop="name">
      <Input type="text" v-model="form.data.name" :maxlength="64"></Input>
    </FormItem>
    <FormItem :label="$t('OrgManage.form.label.code')" prop="code">
      <Input type="text" v-model="form.data.code" :maxlength="64"></Input>
    </FormItem>
    <FormItem :label="$t('OrgManage.form.label.adminEmployeeName')" prop="adminEmployeeName">
      <Input type="text" style="width: 200px;" readonly v-model="form.data.adminEmployeeName">
        <Button slot="append" icon="ios-search-strong" @click="visible = !visible"></Button> 
      </Input>
    </FormItem>
    <FormItem>
       <Button type="primary" @click="createOrUpdate()" :loading="btnLoading">{{$t("common.form.btn.confirm")}}</Button>
       <Button type="ghost" @click="resetForm()">{{$t("common.form.btn.reset")}}</Button>
    </FormItem>
  </Form>

  <org-employee :visible.sync="visible" @on-select="employeeSelect"></org-employee>
</div>
</template>

<script>
import { OrgCascader, OrgEmployee } from "@/components/org"
import { mapGetters } from "vuex"
import { createOrg, updateOrg } from "@/api/tenant/orgManage"
import { deepCopy } from "@/utils/helper"

// 冻结一个 org object
// 它将作为初始值
// 用于"新增"和"编辑"时的数据结构初始化
const ORG_OBJ = Object.freeze({
  id: null,
  code: null,
  name: null,
  type: 1,
  tenantId: null,
  parentId: null,
  parentIds: [],
  adminEmployeeId: null,
  adminEmployeeName: null,
  level: null
})

export default {
  name: "OrgDynamicFormDefault",

  inheritAttrs: false,

  components: { OrgCascader, OrgEmployee },

  data() {
    return {
      // 备份一个 org 对象, 用以缓存当前 org 的详情数据源, 用于 "重置" 按钮点击时回显视图
      // 因为服务端 API 接口在查询 type = 1 的部门详情时, 未返回 parentIds, 为方便开发, 此处不调用接口获取数据
      // 初始化为 null, 便于判断当前场景为 "编辑" 还是 "新增"
      orgBackUp: null,

      visible: false,

      btnLoading: false,

      form: {
        data: Object.assign({}, ORG_OBJ),
        rules: {
          parentIds:[{required:true,type:"array",message:this.$t("OrgManage.form.rules.parentIds"),trigger:"blur"}],
          name:[{required:true,message:this.$t("OrgManage.form.rules.name"),trigger:"blur"}],
          code:[{required:true,message:this.$t("OrgManage.form.rules.code"),trigger:"blur"}],
        }
      },
    }
  },

  computed: {
    ...mapGetters(["user"]),

    orgType() {
      let text = ""
      switch(this.form.data.type) {
        case 1: 
          text = this.$t("OrgManage.others.typeList.department")
          break;
        case 2:
          text =this.$t("OrgManage.others.typeList.store")
          break;
        case 3:
          text = this.$t("OrgManage.others.typeList.warehouse")
          break;
        default:
          text = this.$t("OrgManage.others.typeList.no")
      }
      return text
    },
  },

  created() {
    this.$bus.on("create-btn-click", this.emptyForm)
    this.$bus.on("update-default", this.initForm)
  },

  beforeDestroy() {
    this.$bus.off("create-btn-click", this.emptyForm)
    this.$bus.off("update-default", this.initForm)
  },

  methods: {
    employeeSelect(employee) {
      this.form.data.adminEmployeeId = employee.uid
      this.form.data.adminEmployeeName = employee.name
    },

    selectedDataChange(parentIds) {
      // 每次切换级联选项时, 需要初始化 level, parentId, parentIds
      const parentIdsLength = parentIds.length
      this.form.data.level = parentIdsLength > 0 ? parentIdsLength + 1 : 1
      this.form.data.parentId = parentIds[parentIdsLength - 1]
      this.form.data.parentIds = parentIds
    },

    // "新增" 时初始化 form.data & orgBackUp
    emptyForm() {
      this.orgBackUp = null
      this.form.data = Object.assign({}, ORG_OBJ)
    },

    // "编辑" 时初始化 form.data & orgBackUp
    initForm(org) {
      this.orgBackUp = deepCopy(org)
      this.form.data = deepCopy(org)
    },

    // "重置" 按钮点击
    resetForm() {
      this.btnLoading = false
      this.form.data = this.orgBackUp === null ? Object.assign({}, ORG_OBJ) : deepCopy(this.orgBackUp)
    },

    createOrUpdate() {
       this.$refs["CreateOrUpdateForm"].validate((valid) => {
          if (valid) {
            this.btnLoading = true

            // 我也不清楚为什么需要传 tenantId... 服务端明明自己就能拿到
            // 因为 tenantId 在 vuex state 中初始值是 0
            // 此处需要用全等于判断是否为 null
            if(this.form.data.tenantId === null) this.form.data.tenantId = this.user.tenantId

            const requestMethod = this.form.data.id ? updateOrg : createOrg

            requestMethod(this.form.data).then(response => {
              this.$Message.success(this.$t("OrgManage.others.success"))
              // 操作成功时, 更新 orgBackUp
              this.orgBackUp = deepCopy(this.form.data)
              this.$bus.emit("default-create-or-update-success")
              this.btnLoading = false
            }).catch(error => {
              this.$Message.error(error.message)
              this.btnLoading = false
            })
          } 
       })
    }
  }
}
</script>


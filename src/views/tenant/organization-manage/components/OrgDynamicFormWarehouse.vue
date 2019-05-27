<template>
  <div>
    <Form :label-width="100" :model="form.data" ref="OrgDynamicFormWarehouse" :rules="form.rules">
      <FormItem :label="$t('warehouseManage.form.label.organParentId')" prop="warehouseDetail.organParentIds">
        <org-cascader
          :orgs="$attrs.orgs"
          :org-ids="form.data.warehouseDetail.organParentIds"
          @on-selected-data-change="orgChange"
        ></org-cascader>
      </FormItem>
      <FormItem :label="$t('warehouseManage.form.label.type')" prop="warehouseDetail.type">
        <config-select code="warehouseType" v-model="form.data.warehouseDetail.type"></config-select>
      </FormItem>
      <FormItem :label="$t('warehouseManage.form.label.name')" prop="warehouseDetail.name">
        <Input type="text" v-model="form.data.warehouseDetail.name"></Input>
      </FormItem>
      <FormItem :label="$t('warehouseManage.form.label.shortName')" prop="warehouseDetail.shortName">
        <Input type="text" v-model="form.data.warehouseDetail.shortName"></Input>
      </FormItem>
      <FormItem :label="$t('warehouseManage.form.label.code')" prop="warehouseDetail.code">
        <Input type="text" v-model="form.data.warehouseDetail.code"></Input>
      </FormItem>
      <FormItem :label="$t('warehouseManage.form.label.leaderEmp')" prop="warehouseDetail.leaderEmpName">
        <Input type="text" style="width: 200px;" readonly v-model="form.data.warehouseDetail.leaderEmpName">
          <Button slot="append" icon="ios-search-strong" @click="visible = !visible"></Button> 
        </Input>
      </FormItem>
      <!-- 邮箱 -->
      <FormItem :label="$t('warehouseManage.form.label.email')" prop="warehouseDetail.email">
            <Input type="text" v-model="form.data.warehouseDetail.email" :maxlength="128"></Input>
      </FormItem>
      <!-- 经度 -->
      <FormItem :label="$t('storeManage.form.label.longitude')" prop="warehouseDetail.longitude">
          <Input type="text" v-model="form.data.warehouseDetail.longitude"></Input>
      </FormItem>
      <!-- 维度 -->
      <FormItem :label="$t('storeManage.form.label.latitude')" prop="warehouseDetail.latitude">
          <Input type="text" v-model="form.data.warehouseDetail.latitude"></Input>
      </FormItem>
      <FormItem :label="$t('warehouseManage.form.label.phone')" prop="warehouseDetail.phone">
        <Input type="text" v-model="form.data.warehouseDetail.phone"></Input>
      </FormItem>
      <FormItem :label="$t('warehouseManage.form.label.tel')" prop="warehouseDetail.tel">
        <Input type="text" v-model="form.data.warehouseDetail.tel"></Input>
      </FormItem>
      <FormItem :label="$t('warehouseManage.form.label.address')" prop="warehouseDetail.address">
        <region-cascader 
          :region-ids="regionIds"
          @on-selected-data-change="regionChange"
          style="display: inline-block;">
        </region-cascader>
        <Input type="text" style="width: 200px;" v-model="form.data.warehouseDetail.address"></Input>
      </FormItem>
      <FormItem :label="$t('warehouseManage.form.label.remark')" prop="warehouseDetail.remark">
        <Input type="text" v-model="form.data.warehouseDetail.remark"></Input>
      </FormItem>
      <FormItem :label="$t('warehouseManage.form.label.appIds')" prop="appIds">
        <app-check-box-group :app-ids="form.data.appIds" @on-change="appChange"></app-check-box-group>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="confirm()" :loading="btnLoading">{{ $t("warehouseManage.btns.save") }}</Button>
        <Button type="ghost" @click="resetForm()">{{ $t("common.form.btn.reset") }}</Button>
      </FormItem>
    </Form>

    <org-employee :visible.sync="visible" @on-select="employeeSelect"></org-employee>
  </div>
</template>

<script>
import { OrgCascader, OrgEmployee } from "@/components/org"
import { RegionCascader } from "@/components/region"
import { AppCheckBoxGroup } from "@/components/app"
import { ConfigSelect } from "@/components/config"

import { getInfo, fetchWarehouse, updateWarehouse } from "@/api/tenant/orgManage"

const WAREHOUSE_OBJ = Object.freeze({
  warehouseDetail: {
    "id": null,
    "name": null,
    "shortName": null,
    "code": null,
    "organId": null,
    "organName": null,
    "organParentId": null,
    "organParentName": null,
    "leaderEmpId": null,
    "leaderEmpName": null,
    "phone": null,
    "tel": null,
    "country": null,
    "province": null,
    "city": null,
    "county": null,
    "address": null,
    "longitude":null,
    "latitude":null,
    "remark": null,
    "tenantId": null,
    "type": "",
    "aposId": null,
    "organParentIds": [],
    "abn":"abn",
    "acn":"acn",
    "email":""
  },
  appIds: []
})

export default {
  name: "OrgDynamicFormWarehouse",

  inheritAttrs: false,

  components: { OrgCascader,OrgEmployee, RegionCascader, ConfigSelect, AppCheckBoxGroup },

  data() {
    return {
      orgId: "",

      visible: false,

      btnLoading: false,

      regionIds: [],

      form: {
        data: Object.assign({}, WAREHOUSE_OBJ),
        rules: {
          "warehouseDetail.name": [{ required: true, message:this.$t('warehouseManage.form.rule.name'), trigger: "blur" }],
          "warehouseDetail.code": [{ required: true, message: this.$t('warehouseManage.form.rule.code'), trigger: "blur" }],
          "warehouseDetail.address":[{required:true,message:this.$t('warehouseManage.form.rule.address'),trigger:"blur"}],
          // "warehouseDetail.organParentIds": [{required: true,message: this.$t('warehouseManage.form.rule.organParentIds'),type: "array", trigger: "blur"}],
          "warehouseDetail.leaderEmpName": [{ required: true, message:this.$t('warehouseManage.form.rule.leaderEmpName'), trigger: "blur" }],
           appIds: [{ required: true,type:"array", message: this.$t('warehouseManage.form.rule.canUseApps'), trigger: "ignor" }]
        }
      }
    };
  },

  created() {
    this.$bus.on("update-warehouse", this.initWarehouse);
  },

  beforeDestroy() {
    this.$bus.off("update-warehouse", this.initWarehouse);
  },

  methods: {
    initWarehouse(orgId) {
      this.orgId = orgId
      getInfo({ id: orgId, type: 3 }).then(response => {
        const warehouseId = response.data.id;
        fetchWarehouse(warehouseId).then(response => {

          // 服务端返回数据时, 上级部门集合包含了自身
          // 此处使用 pop() 移除自身
          response.data.warehouseDetail.organParentIds.pop()

          // 而后进行赋值初始化 warehouse
          this.form.data = response.data;

          // 初始化城市级联 initRegions 模型, 用以初始化 RegionCascader 组件
          let regionIds = []
          this.form.data.warehouseDetail.country && regionIds.push(this.form.data.warehouseDetail.country)
          this.form.data.warehouseDetail.province && regionIds.push(this.form.data.warehouseDetail.province)
          this.form.data.warehouseDetail.city && regionIds.push(this.form.data.warehouseDetail.city)
          this.form.data.warehouseDetail.county && regionIds.push(this.form.data.warehouseDetail.county)
          this.regionIds = regionIds
        });
      });
    },

    orgChange(orgIds) {
      const orgIdsLength = orgIds.length
      this.form.data.warehouseDetail.organParentId = orgIds[orgIdsLength - 1]
      this.form.data.warehouseDetail.organParentIds = orgIds
    },

    employeeSelect(employee) {
      this.form.data.warehouseDetail.leaderEmpId = employee.uid
      this.form.data.warehouseDetail.leaderEmpName = employee.name
    },

    regionChange(regionIds) {
      this.form.data.warehouseDetail.country = regionIds[0] || ""
      this.form.data.warehouseDetail.province = regionIds[1] || ""
      this.form.data.warehouseDetail.city = regionIds[2] || ""
      this.form.data.warehouseDetail.county = regionIds[3] || ""
    },

    appChange(appIds) {
      this.form.data.appIds = appIds
    },

    confirm() {
       this.$refs["OrgDynamicFormWarehouse"].validate(valid => {
        if (valid) {
           this.btnLoading = true
            updateWarehouse(this.form.data).then(response => {
              this.$Message.success(this.$t('warehouseManage.others.success'))
              this.resetForm()
              this.$bus.emit("warehouse-update-success")
              this.btnLoading = false
            }).catch(error => {
              this.$Message.error(error.message)
              this.btnLoading = false
            })
          }
       })
    },

    resetForm() {
      this.form.data = WAREHOUSE_OBJ
      this.regionIds = []
      this.btnLoading = false
      this.initWarehouse(this.orgId)
    }
  }
};
</script>


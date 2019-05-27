<template>
  <div>
    <Form :label-width="100" ref="OrgDynamicFormStore" :model="form.data" :rules="form.rules">
      <FormItem :label="$t('storeManage.form.label.parentOrg')" prop="shopDetail.organParentIds">
        <org-cascader
          :orgs="$attrs.orgs"
          :org-ids="form.data.shopDetail.organParentIds"
          @on-selected-data-change="orgChange">
        </org-cascader>
      </FormItem>
      <FormItem :label="$t('storeManage.form.label.storeName')"  prop="shopDetail.name">
        <Input type="text" v-model="form.data.shopDetail.name"></Input>
      </FormItem>
      <FormItem :label="$t('storeManage.form.label.storeCode')" prop="shopDetail.code">
        <Input type="text" v-model="form.data.shopDetail.code"></Input>
      </FormItem>
      <FormItem :label="$t('storeManage.form.label.leaderEmp')" prop="shopDetail.leaderEmpName">
        <Input type="text" style="width: 200px;" readonly v-model="form.data.shopDetail.leaderEmpName">
          <Button slot="append" icon="ios-search-strong" @click="visible = !visible"></Button> 
        </Input>
      </FormItem>
      <FormItem :label="$t('storeManage.form.label.contactMethod')" prop="shopDetail.tel">
        <Input type="text" v-model="form.data.shopDetail.tel"></Input>
      </FormItem>
      <FormItem :label="$t('storeManage.form.label.currencyType')" prop="shopDetail.currencies">
        <config-select code="currensis" v-model="form.data.shopDetail.currencies"></config-select>
      </FormItem>
      <FormItem :label="$t('storeManage.form.label.salesRules')" prop="shopDetail.salesRuleCode">
        <config-select code="sales_rule" v-model="form.data.shopDetail.salesRuleCode"></config-select>
      </FormItem>
      <FormItem :label="$t('storeManage.form.label.detailAddress')" prop="shopDetail.address">
        <region-cascader 
          :region-ids="regionIds"
          @on-selected-data-change="regionChange"
          style="display: inline-block;">
        </region-cascader>
        <Input type="text" style="width: 200px;" v-model="form.data.shopDetail.address"></Input>
      </FormItem>
      <FormItem :label="$t('storeManage.form.label.longitude')" prop="shopDetail.longitude">
        <Input type="text" v-model="form.data.shopDetail.longitude"></Input>
      </FormItem>
      <FormItem :label="$t('storeManage.form.label.latitude')" prop="shopDetail.latitude">
        <Input type="text" v-model="form.data.shopDetail.latitude"></Input>
      </FormItem>
        <!-- 邮箱 -->
      <FormItem :label="$t('storeManage.form.label.email')" prop="shopDetail.email">
        <Input type="text" v-model="form.data.shopDetail.email" :maxlength="128"></Input>
      </FormItem>

      <FormItem :label="$t('storeManage.form.label.zeroStore')" prop="shopDetail.zeroStore">
        <RadioGroup v-model="form.data.shopDetail.zeroStore">
          <Radio :label="1">{{ $t("storeManage.others.support")}}</Radio>
          <Radio :label="2">{{ $t("storeManage.others.notSupport") }}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem :label="$t('storeManage.form.label.openStore')" prop="shopDetail.status">
        <!-- 1 开启 0 关闭 -->
        <RadioGroup v-model="form.data.shopDetail.status">
          <Radio :label="1">{{ $t("storeManage.others.open") }}</Radio>
          <Radio :label="0">{{ $t("storeManage.others.close") }}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem :label="$t('storeManage.form.label.canUseApps')" prop="appIds">
        <app-check-box-group :app-ids="form.data.appIds" @on-change="appChange"></app-check-box-group>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="confirm()" :loading="btnLoading">{{ $t("storeManage.btns.save") }}</Button>
        <Button type="ghost" @click="resetForm()">{{ $t("common.form.btn.reset") }}</Button>
      </FormItem>
    </Form>

    <org-employee :visible.sync="visible" @on-select="employeeSelect"></org-employee>
  </div>
</template>

<script>
import { OrgCascader, OrgEmployee } from "@/components/org"
import { ConfigSelect } from "@/components/config"
import { RegionCascader } from "@/components/region"
import { AppCheckBoxGroup } from "@/components/app"

import { getInfo, fetchShop, updateShop } from "@/api/tenant/orgManage"

const SHOP_OBJ = Object.freeze({
  "shopDetail": {
    "abn":"abn",
    "acn":"acn",
    "address": null,
    "aposId": null,
    "city": null,
    "code": null,
    "country": null,
    "county": null,
    "currencies": null,
    "id": null,
    "latitude": null,
    "leaderEmpId": null,
    "leaderEmpName": null,
    "longitude": null,
    "name": null,
    "organId": null,
    "organName": null,
    "organParentId": null,
    "organParentIds": [],
    "organParentName": null,
    "province": null,
    "salesRuleCode": null,
    "status": null,
    "tel": "",
    "tenantId": null,
    "status": null,
    "zeroStore": null,
    "email":null,

  },
  "appIds": []
})

export default {
  name: "OrgDynamicFormStore",

  inheritAttrs: false,

  components: { OrgCascader, OrgEmployee, ConfigSelect, RegionCascader, AppCheckBoxGroup },

  data() {
    return {
      orgId: "",

      visible: false,

      btnLoading: false,

      regionIds: [],

      form: {
        data: Object.assign({}, SHOP_OBJ),
        rules: {
          "shopDetail.name": [{ required: true, message:this.$t('storeManage.form.rules.name'), trigger: "blur" }],
          "shopDetail.code":[{required:true,message:this.$t('storeManage.form.rules.code'),trigger:"blur"}],
          "shopDetail.address":[{required:true,message:this.$t('storeManage.form.rules.address'),trigger:"blur"}],
          "shopDetail.leaderEmpName":[{required:true,message:this.$t('storeManage.form.rules.leaderEmpName'),trigger:"blur"}],
          "shopDetail.currencies":[{required:true,message:this.$t('storeManage.form.rules.currencies'),trigger:"blur"}],
          "shopDetail.salesRuleCode":[{required:true,message:this.$t('storeManage.form.rules.salesRuleCode'),trigger:"blur"}],  
           appIds:[{required:true,type:"array",message:this.$t('storeManage.form.rules.canUseApps'),trigger:"ignor"}]
        }
      }
    }
  },

  created() {
    this.$bus.on("update-store", this.initStore)
  },

  beforeDestroy() {
    this.$bus.off("update-store", this.initStore)
  },

  methods: {
    initStore(orgId) {
      this.orgId = orgId
      getInfo({id: orgId, type: 2}).then(response => {
        const shopId = response.data.id
        fetchShop(shopId).then(response => {
          response.data.shopDetail.organParentIds.pop()
          // 而后进行赋值初始化 warehouse
          this.form.data = response.data;
          // 初始化城市级联 initRegions 模型, 用以初始化 RegionCascader 组件
          let regionIds = []
          this.form.data.shopDetail.country && regionIds.push(this.form.data.shopDetail.country)
          this.form.data.shopDetail.province && regionIds.push(this.form.data.shopDetail.province)
          this.form.data.shopDetail.city && regionIds.push(this.form.data.shopDetail.city)
          this.form.data.shopDetail.county && regionIds.push(this.form.data.shopDetail.county)
          this.regionIds = regionIds
        })
      })
    },

    orgChange(orgIds) {
      const orgIdsLength = orgIds.length
      this.form.data.shopDetail.organParentId = orgIds[orgIdsLength - 1]
      this.form.data.shopDetail.organParentIds = orgIds
    },

    regionChange(regionIds) {
      this.form.data.shopDetail.country = regionIds[0] || ""
      this.form.data.shopDetail.province = regionIds[1] || ""
      this.form.data.shopDetail.city = regionIds[2] || ""
      this.form.data.shopDetail.county = regionIds[3] || ""
    },

    appChange(appIds) {
      this.form.data.appIds = appIds
    },

    employeeSelect(employee) {
      this.form.data.shopDetail.leaderEmpId = employee.uid
      this.form.data.shopDetail.leaderEmpName = employee.name
    },

    confirm() {
      this.$refs["OrgDynamicFormStore"].validate(valid => {
        if (valid) {
          this.btnLoading = true
          updateShop(this.form.data).then(response => {
            this.$Message.success(this.$t("storeManage.others.success"))
            this.resetForm()
            this.$bus.emit("store-update-success")
            this.btnLoading = false
          }).catch(error => {
            this.$Message.error(error.message)
            this.btnLoading = false
          })
        }
      })
    },

    resetForm() {
      this.form.data = SHOP_OBJ
      this.regionIds = []
      this.btnLoading = false
      this.initStore(this.orgId)
    },
  }
}
</script>


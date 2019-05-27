<template>
  <div>
    <Form :label-width="100" :rules="form.rules" :model="form.data" ref="OrgDynamicFormStore">
      <Row>
        <Col span="12">
          <FormItem
            :label="$t('storeManage.form.label.parentOrg')"
            prop="shopDetail.organParentIds"
          >
            <org-cascader
              :orgs="orgs"
              :org-ids="form.data.shopDetail.organParentIds"
              @on-selected-data-change="orgChange"
            ></org-cascader>
          </FormItem>
          <FormItem :label="$t('storeManage.form.label.storeName')" prop="shopDetail.name">
            <Input type="text" v-model="form.data.shopDetail.name" :maxlength="64"></Input>
          </FormItem>
          <FormItem :label="$t('storeManage.form.label.storeCode')" prop="shopDetail.code">
            <Input type="text" v-model="form.data.shopDetail.code" :maxlength="64"></Input>
          </FormItem>
          <FormItem :label="$t('storeManage.form.label.leaderEmp')" prop="shopDetail.leaderEmpName">
            <Input
              type="text"
              style="width: 200px;"
              readonly
              v-model="form.data.shopDetail.leaderEmpName"
            >
              <Button slot="append" icon="ios-search-strong" @click="visible = !visible"></Button>
            </Input>
          </FormItem>
          <FormItem :label="$t('storeManage.form.label.contactMethod')" prop="shopDetail.tel">
            <Input type="text" v-model="form.data.shopDetail.tel"></Input>
          </FormItem>
          <FormItem :label="$t('storeManage.form.label.currencyType')" prop="shopDetail.currencies">
            <config-select code="currensis" v-model="form.data.shopDetail.currencies"></config-select>
          </FormItem>
          <FormItem
            :label="$t('storeManage.form.label.salesRules')"
            prop="shopDetail.salesRuleCode"
          >
            <config-select code="sales_rule" v-model="form.data.shopDetail.salesRuleCode"></config-select>
          </FormItem>
          <FormItem :label="$t('storeManage.form.label.detailAddress')" prop="shopDetail.address">
            <region-cascader
              :region-ids="regionIds"
              @on-selected-data-change="regionChange"
              style="display: inline-block;"
            ></region-cascader>
            <Input type="text" style="width: 200px;" v-model="form.data.shopDetail.address"></Input>
          </FormItem>
        </Col>

        <Col span="12">
          <FormItem :label="$t('storeManage.form.label.longitude')" prop="shopDetail.longitude">
            <Input type="text" v-model="form.data.shopDetail.longitude"></Input>
          </FormItem>
          <FormItem :label="$t('storeManage.form.label.latitude')" prop="shopDetail.latitude">
            <Input type="text" v-model="form.data.shopDetail.latitude"></Input>
          </FormItem>
          <FormItem label="ABN" prop="abn">
            <Input type="text" v-model="form.data.shopDetail.abn"></Input>
          </FormItem>
          <FormItem label="ACN" prop="acn">
            <Input type="text" v-model="form.data.shopDetail.acn"></Input>
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
            <RadioGroup v-model="form.data.shopDetail.status">
              <Radio :label="1">{{ $t("storeManage.others.open") }}</Radio>
              <Radio :label="0">{{ $t("storeManage.others.close") }}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <FormItem :label="$t('storeManage.form.label.canUseApps')" prop="appIds">
        <app-check-box-group :app-ids="form.data.appIds" @on-change="appChange"></app-check-box-group>
      </FormItem>

      <FormItem>
        <Button
          type="primary"
          @click="confirm()"
          :loading="btnLoading"
        >{{ $t("storeManage.btns.save") }}</Button>
        <Button type="ghost" @click="reset">{{ $t("storeManage.btns.cancel") }}</Button>
      </FormItem>
    </Form>

    <org-employee :visible.sync="visible" @on-select="employeeSelect"></org-employee>
  </div>
</template>

<script>
import { OrgCascader, OrgEmployee } from "@/components/org";
import { ConfigSelect } from "@/components/config";
import { RegionCascader } from "@/components/region";
import { AppCheckBoxGroup } from "@/components/app";
import { Mixin_Redirect } from "@/mixins";

import { fetchShop, updateShop, createShop } from "@/api/tenant/orgManage";
import { fetchOrgTree } from "@/api/tenant/orgManage";

import { mapGetters } from "vuex";

const SHOP_OBJ = Object.freeze({
  shopDetail: {
    abn: "",
    acn: "",
    address: null,
    aposId: null,
    city: null,
    code: null,
    country: null,
    county: null,
    currencies: null,
    id: null,
    latitude: null,
    leaderEmpId: null,
    leaderEmpName: null,
    longitude: null,
    name: null,
    organId: null,
    organName: null,
    organParentId: null,
    organParentIds: [],
    organParentName: null,
    province: null,
    salesRuleCode: null,
    tel: "",
    tenantId: null,
    status: 1,
    zeroStore: 1,
    email: null
  },
  appIds: []
});

export default {
  name: "OrgDynamicFormStore",

  mixins: [Mixin_Redirect],

  inheritAttrs: false,

  components: {
    OrgCascader,
    OrgEmployee,
    ConfigSelect,
    RegionCascader,
    AppCheckBoxGroup
  },

  data() {
    return {
      visible: false,

      btnLoading: false,

      orgs: [],

      id: this.$route.params.id || "",

      regionIds: [],

      form: {
        data: Object.assign({}, SHOP_OBJ),
        rules: {
          "shopDetail.name": [
            {
              required: true,
              message: this.$t("storeManage.form.rules.name"),
              trigger: "blur"
            }
          ],
          "shopDetail.code": [
            {
              required: true,
              message: this.$t("storeManage.form.rules.code"),
              trigger: "blur"
            }
          ],
          "shopDetail.address": [
            {
              required: true,
              message: this.$t("storeManage.form.rules.address"),
              trigger: "blur"
            }
          ],
          "shopDetail.leaderEmpName": [
            {
              required: true,
              message: this.$t("storeManage.form.rules.leaderEmpName"),
              trigger: "blur"
            }
          ],
          "shopDetail.currencies": [
            {
              required: true,
              message: this.$t("storeManage.form.rules.currencies"),
              trigger: "blur"
            }
          ],
          "shopDetail.salesRuleCode": [
            {
              required: true,
              message: this.$t("storeManage.form.rules.salesRuleCode"),
              trigger: "blur"
            }
          ],
          appIds: [
            {
              required: true,
              type: "array",
              message: this.$t("storeManage.form.rules.canUseApps"),
              trigger: "ignor"
            }
          ]
        }
      }
    };
  },

  computed: {
    ...mapGetters(["user"])
  },

  created() {
    this.loadOrgs();

    this.id && this.initStore();
  },

  methods: {
    loadOrgs() {
      // 递归处理从服务端获取的数据集合
      // 添加 Tree、Cascade Component 所需的特殊键名: value, label, title 等
      // 添加后续 API 接口所需的特殊键名: parentIds, level 等
      function convertData(orgin, parentIds) {
        const orginParentIds =
          parentIds.length > 0 ? parentIds.slice(0, parentIds.length - 1) : [];
        if (!orgin.childTenantOrgan || orgin.childTenantOrgan.length == 0) {
          return {
            value: orgin.id,
            label: orgin.name,
            title: orgin.name,
            code: orgin.code,
            id: orgin.id,
            name: orgin.name,
            tenantId: orgin.tenantId,
            parentId: orgin.parentId,
            parentIds: orginParentIds,
            adminEmployeeId: orgin.adminEmployeeId,
            adminEmployeeName: orgin.adminEmployeeName,
            level: orgin.level,
            type: orgin.type
          };
        } else {
          const childrens = orgin.childTenantOrgan.map(item => {
            return convertData(item, parentIds.concat(item.id));
          });
          return {
            value: orgin.id,
            label: orgin.name,
            title: orgin.name,
            expand: true,
            children: childrens,
            name: orgin.name,
            id: orgin.id,
            code: orgin.code,
            tenantId: orgin.tenantId,
            parentId: orgin.parentId,
            parentIds: orginParentIds,
            adminEmployeeId: orgin.adminEmployeeId,
            adminEmployeeName: orgin.adminEmployeeName,
            level: orgin.level,
            type: orgin.type
          };
        }
      }

      fetchOrgTree(this.user.tenantId).then(response => {
        this.orgs = response.data.map(item => convertData(item, [item.id]));
      });
    },

    initStore() {
      fetchShop(this.id).then(response => {
        response.data.shopDetail.organParentIds.pop();
        // 而后进行赋值初始化 warehouse
        this.form.data = response.data;
        // 初始化城市级联 initRegions 模型, 用以初始化 RegionCascader 组件
        let regionIds = [];
        this.form.data.shopDetail.country &&
          regionIds.push(this.form.data.shopDetail.country);
        this.form.data.shopDetail.province &&
          regionIds.push(this.form.data.shopDetail.province);
        this.form.data.shopDetail.city &&
          regionIds.push(this.form.data.shopDetail.city);
        this.form.data.shopDetail.county &&
          regionIds.push(this.form.data.shopDetail.county);
        this.regionIds = regionIds;
      });
    },

    orgChange(orgIds) {
      const orgIdsLength = orgIds.length;
      this.form.data.shopDetail.organParentId = orgIds[orgIdsLength - 1];
      this.form.data.shopDetail.organParentIds = orgIds;
    },

    regionChange(regionIds) {
      this.form.data.shopDetail.country = regionIds[0] || "";
      this.form.data.shopDetail.province = regionIds[1] || "";
      this.form.data.shopDetail.city = regionIds[2] || "";
      this.form.data.shopDetail.county = regionIds[3] || "";
    },

    appChange(appIds) {
      this.form.data.appIds = appIds;
    },

    employeeSelect(employee) {
      this.form.data.shopDetail.leaderEmpId = employee.uid;
      this.form.data.shopDetail.leaderEmpName = employee.name;
    },

    confirm() {
      this.$refs["OrgDynamicFormStore"].validate(valid => {
        if (valid) {
          const fount = this.form.data.shopDetail.organParentIds.find(
            item => item === this.form.data.shopDetail.organId
          );

          if (fount) {
            this.$Message.error(this.$t("storeManage.form.rules.noSelf"));
            return;
          }
          const requestMethod = this.id ? updateShop : createShop;
          this.btnLoading = true;
          requestMethod(this.form.data)
            .then(response => {
              this.$Message.success(this.$t("storeManage.others.success"));
              this.$refs["OrgDynamicFormStore"].resetFields();
              this.$nextTick(() => {
                this.aposFlag
                  ? this.redirectApos()
                  : this.$router.push({ name: "store-manage" });
                this.btnLoading = false;
              });
            })
            .catch(error => {
              this.$Message.error(error.message);
              this.btnLoading = false;
            });
        }
      });
    },

    reset() {
      this.$refs["OrgDynamicFormStore"].resetFields();
      this.aposFlag
        ? this.redirectApos()
        : this.$router.push({ name: "store-manage" });
    }
  }
};
</script>


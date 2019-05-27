<template>
  <Form :model="form.data" ref="editForm" :rules="form.rules" :label-width="100">
    <Row>
      <Col span="12">
        <FormItem :label="$t('tenantManage.form.label.code')" prop="code">
          <Input v-model="form.data.code" :maxlength="64"></Input>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.name')" prop="name">
          <Input v-model="form.data.name" :maxlength="128"></Input>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.shortName')" prop="shortName">
          <Input v-model="form.data.shortName" :maxlength="64"></Input>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.tel')" prop="tel">
          <Input v-model="form.data.tel" :maxlength="32"></Input>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.phone')" prop="phone">
          <Input v-model="form.data.phone" :maxlength="32"></Input>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.email')" prop="email">
          <Input v-model="form.data.email" :maxlength="128"></Input>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.ranges')" prop="ranges">
          <CheckboxGroup v-model="form.data.ranges" style="width:200px">
            <Checkbox v-for="item in rangeList" :key="item.label" :label="item.label">{{item.value}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <!-- 地址 -->
        <FormItem :label="$t('tenantManage.form.label.address')" prop="address">
          <region-cascader
            :region-ids="regionIds"
            @on-selected-data-change="regionChange"
            style="display: inline-block;"
          ></region-cascader>
          <Input type="text" style="width: 300px;" v-model="form.data.address"></Input>
        </FormItem>        
      </Col>

      <Col span="12">
        <FormItem :label="$t('tenantManage.form.label.fax')" prop="fax">
          <Input v-model="form.data.fax" :maxlength="64"></Input>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.abn')" prop="abn">
          <Input v-model="form.data.abn" :maxlength="64"></Input>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.businessLicense')" prop="businessLicense">
          <Input v-model="form.data.businessLicense" :maxlength="64"></Input>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.userName')" prop="userName">
          <Input v-model="form.data.userName" :maxlength="128" readonly></Input>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.currencies')" prop="currencies">
          <Select v-model="form.data.currencies" clearable style="width:200px">
            <Option v-for="item in currencyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.language')" prop="language">
          <Select v-model="form.data.language">
            <Option value="zh">简体中文</Option>
            <Option value="en">English</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('tenantManage.form.label.remark')" prop="remark">
          <Input type="textarea" v-model="form.data.remark"></Input>
        </FormItem>
      </Col>
    </Row>

    <FormItem prop="appIds">
      <h3 style="marginLeft:-60px">{{$t("tenantManage.form.label.appManage")}}</h3>
      <Checkbox
        v-model="checkAll"
        @on-change="checkBoxAllChange"
      >{{$t("tenantManage.form.label.checkAll")}}</Checkbox>
      <CheckboxGroup v-model="form.data.appIds" @on-change="checkBoxGroupChange">
        <Row>
          <Col :md="8" :lg="4" v-for="appId in appIdList" :key="appId.id">
            <Checkbox :label="appId.id" :key="appId.id">{{appId.name}}</Checkbox>
          </Col>
        </Row>        
      </CheckboxGroup>
    </FormItem>

    <FormItem>
      <Button
        type="primary"
        @click="confirm()"
        :loading="btnLoading"
      >{{$t('tenantManage.btns.save')}}</Button>
      <Button
        type="ghost"
        @click="$router.push({ name: 'merchant-list' })"
      >{{$t('tenantManage.btns.cancel')}}</Button>
    </FormItem>
  </Form>
</template>

<script>
import { detail, update } from "@/api/admin/tenant";
import { getTenantApp } from "@/api/tenant/app";

import md5 from "js-md5";

import { mapGetters } from "vuex";
import { RegionCascader } from "@/components/region";
export default {
  name: "editForm",

  components: { RegionCascader },

  data() {
    var self = this;
    var validateCode = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error(this.$t("tenantManage.form.rules.code")));
        return;
      }

      if (/^[A-Za-z0-9]+$/.test(value)) {
        callback();
      } else {
        callback(new Error(this.$t("tenantManage.form.rules.numOrLetter")));
      }
    };
    return {
      form: {
        data: {
          code: "", //商户编码
          name: "", //商户名称
          shortName: "", //简称
          tel: "", //联系电话
          phone: "", //手机
          email: "", //邮箱
          fax: "", //传真
          businessLicense: "", //ABN
          abn: "", //营业执照
          address: "", //地址
          language: "",
          city: "",
          country: "",
          county: "",
          province: "",
          uid: "", //
          userName: "", //登录用户名
          currencies: "",
          originalPassword: "", //登录密码
          password: "", //密码
          remark: "", //备注
          ranges: [], //业务范围
          appIds: [], //已开通产品
          aposId: null
        },

        rules: {
          name: [
            {
              required: true,
              message: this.$t("tenantManage.form.rules.name"),
              trigger: "blur"
            }
          ],
          address: [
            {
              required: true,
              message: this.$t("tenantManage.form.rules.address"),
              trigger: "blur"
            }
          ],
          code: [{ required: true, validator: validateCode, trigger: "blur" }],
          ranges: [
            {
              required: true,
              type: "array",
              message: this.$t("tenantManage.form.rules.rangs"),
              trigger: "blur"
            }
          ],
          currencies:[{ required: true,message: this.$t("tenantManage.form.rules.currencies"),trigger: "change"}],
          language:[{ required: true,message: this.$t("tenantManage.form.rules.language"),trigger: "change"}]
        }
      },
      regionIds: [],
      rangeList: [
        {
          value: this.$t("tenantManage.rangeList.store"),
          label: 1
        },
        {
          value: this.$t("tenantManage.rangeList.warehouse"),
          label: 2
        },
        
      ],

      checkAll: false,

      appIdList: [],

      currencyList: [
        //币种列表
        { label: this.$t("tenantManage.currencyList.CNY"), value: "CNY" },
        { label: this.$t("tenantManage.currencyList.AUD"), value: "AUD" },
        { label: this.$t("tenantManage.currencyList.HKD"), value: "HKD" },
        { label: this.$t("tenantManage.currencyList.JPY"), value: "JPY" },
        { label: this.$t("tenantManage.currencyList.KRW"), value: "KRW" },
        { label: this.$t("tenantManage.currencyList.EUR"), value: "EUR" },
        { label: this.$t("tenantManage.currencyList.USD"), value: "USD" },
      ],

      btnLoading: false
    };
  },
  created() {
    // 获取产品管理
    getTenantApp().then(res => {
      this.appIdList = res.data;
    });

    detail(this.$route.query.id).then(res => {
      this.form.data = {
        id: res.data.id,
        code: res.data.code, //商户编码
        name: res.data.name, //商户名称
        shortName: res.data.shortName, //简称
        tel: res.data.tel, //联系电话
        phone: res.data.phone, //手机
        email: res.data.email, //邮箱
        fax: res.data.fax, //传真
        businessLicense: res.data.businessLicense, //ABN
        abn: res.data.abn, //营业执照
        address: res.data.address, //地址
        language: res.data.language,
        city: res.data.city,
        country: res.data.country,
        county: res.data.county,
        province: res.data.province,
        uid: res.data.uid, //
        userName: res.data.userName, //登录用户名
        currencies: res.data.currencies, //币种
        originalPassword: res.data.password, //登录密码
        password: res.data.password, //密码
        remark: res.data.remark, //备注
        ranges: res.data.ranges, //业务范围
        appIds: res.data.appIds, //已开通产品
        aposId: res.data.aposId
      };
      // 初始化城市级联 initRegions 模型, 用以初始化 RegionCascader 组件
      let regionIds = [];
      this.form.data.country && regionIds.push(this.form.data.country);
      this.form.data.province && regionIds.push(this.form.data.province);
      this.form.data.city && regionIds.push(this.form.data.city);
      this.form.data.county && regionIds.push(this.form.data.county);
      this.regionIds = regionIds;
    });
  },

  methods: {
    confirm() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          update(this.form.data)
            .then(res => {
              this.$Message.success(this.$t("tenantManage.others.success"));
              this.$router.push({ name: "merchant-list" });
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
        this.form.data.appIds = this.appIdList.map(item => item.id);
      } else {
        this.form.data.appIds = [];
      }
    },

    checkBoxGroupChange(arr) {
      if (arr.length === this.appIdList.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    // 选择省市
    regionChange(regionIds) {
      this.form.data.country = regionIds[0] || "";
      this.form.data.province = regionIds[1] || "";
      this.form.data.city = regionIds[2] || "";
      this.form.data.county = regionIds[3] || "";
    }
  }
};
</script>

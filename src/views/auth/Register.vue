<template>
  <div class="Register">
    <Form :model="form.data" ref="registerForm" :rules="form.rules" :label-width="100">
      <FormItem :label="$t('tenantManage.form.label.name')" prop="name">
        <Input v-model="form.data.name" :maxlength="128"></Input>
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
      <FormItem :label="$t('tenantManage.form.label.fax')" prop="fax">
        <Input v-model="form.data.fax" :maxlength="64"></Input>
      </FormItem>
      <FormItem :label="$t('tenantManage.form.label.abn')" prop="abn">
        <Input v-model="form.data.abn" :maxlength="64"></Input>
      </FormItem>
      <FormItem :label="$t('tenantManage.form.label.businessLicense')" prop="businessLicense">
        <Input v-model="form.data.businessLicense" :maxlength="64"></Input>
      </FormItem>
      <!-- 币种 -->
      <FormItem :label="$t('tenantManage.form.label.currencies')" prop="currencies">
        <Select v-model="form.data.currencies" clearable style="width:200px">
          <Option
            v-for="item in currencyList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <!-- 地址 -->
      <FormItem :label="$t('tenantManage.form.label.address')" prop="address">
        <region-cascader
          @on-selected-data-change="regionChange"
          style="display: inline-block;"
        ></region-cascader>
        <Input type="text" style="width: 300px;" v-model="form.data.address"></Input>
      </FormItem>
      <!-- 语言 -->
      <FormItem :label="$t('tenantManage.form.label.language')" prop="language">
        <Select v-model="form.data.language">
          <Option value="zh">简体中文</Option>
          <Option value="en">English</Option>
        </Select>
      </FormItem>
      <!-- 业务范围 -->
      <FormItem :label="$t('tenantManage.form.label.ranges')" prop="ranges">
        <CheckboxGroup v-model="form.data.ranges" style="width:200px">
          <Checkbox v-for="item in rangeList" :key="item.label" :label="item.label">{{item.value}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem :label="$t('tenantManage.form.label.remark')" prop="remark">
        <Input type="textarea" v-model="form.data.remark" :maxlength="256"></Input>
      </FormItem>
      <FormItem>
        <Button type="ghost" @click="cancel">{{$t('tenantManage.btns.cancel')}}</Button>
        <Button
          type="primary"
          @click="confirm()"
          :loading="btnLoading"
        >{{$t('tenantManage.btns.save')}}</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { register } from "@/api/auth";
import { RegionCascader } from "@/components/region";

export default {
  components: { RegionCascader },

  data() {
    return {
      form: {
        data: {
          name: "", //商户名称
          tel: "", //联系电话
          phone: "", //手机
          email: "", //邮箱
          fax: "", //传真
          businessLicense: "", //营业执照
          abn: "", //ABN
          address: "", //地址
          language: "",//语言
          city: "",
          country: "",
          county: "",
          province: "",
          currencies: "", //币种
          remark: "", //备注
          ranges: [] //业务范围
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
          ranges: [
            {
              required: true,
              type: "array",
              message: this.$t("tenantManage.form.rules.rangs"),
              trigger: "blur"
            }
          ]
        }
      },

      currencyList: [
        //币种列表
        { label: this.$t("tenantManage.currencyList.CNY"), value: "CNY" },
        { label: this.$t("tenantManage.currencyList.AUD"), value: "AUD" },
        { label: this.$t("tenantManage.currencyList.HKD"), value: "HKD" },
        { label: this.$t("tenantManage.currencyList.JPY"), value: "JPY" },
        { label: this.$t("tenantManage.currencyList.KRW"), value: "KRW" },
        { label: this.$t("tenantManage.currencyList.EUR"), value: "EUR" }
      ],

      rangeList: [
        {
          value: this.$t("tenantManage.rangeList.store"),
          label: 1
        },
        {
          value: this.$t("tenantManage.rangeList.warehouse"),
          label: 2
        }
      ],

      btnLoading: false
    };
  },

  methods: {
    cancel() {
      this.$router.push({ name: "login" });
    },

    confirm() {
      this.btnLoading = true
      register(this.form.data).then(response => {
        this.$Message.success(this.$t("tenantManage.others.success"))
        this.btnLoading = false
      }).catch(error => {
        this.$Message.error(error.message)
        this.btnLoading = false
      })
    },

    // 选择省市
    regionChange(regionIds) {
      console.log(regionIds)
      this.form.data.country = regionIds[0] || "";
      this.form.data.province = regionIds[1] || "";
      this.form.data.city = regionIds[2] || "";
      this.form.data.county = regionIds[3] || "";
    }
  }
};
</script>

<style lang="less">
.Register {
  background-color: #fff;
  padding: 10px;
}
</style>


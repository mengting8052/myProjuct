<template>
  <div class="TenantHome">
    <h3>{{ $t("tenantHome.title.basic") }}</h3>
    <Form inline :label-width="100" style="margin-top:10px;">
      <FormItem :label="$t('tenantHome.label.userName')">
        <strong class="label-value">{{ userInfo.userName || $t("tenantHome.empty") }}</strong>
      </FormItem>
      <FormItem :label="$t('tenantHome.label.code')">
        <strong class="label-value">{{ userInfo.code || $t("tenantHome.empty") }}</strong>
      </FormItem>
      <br>
      <FormItem :label="$t('tenantHome.label.name')">
        <strong class="label-value">{{ userInfo.name || $t("tenantHome.empty") }}</strong>
      </FormItem>
      <FormItem :label="$t('tenantHome.label.shortName')">
        <strong class="label-value">{{ userInfo.shortName || $t("tenantHome.empty") }}</strong>
      </FormItem>
    </Form>

    <h3>{{ $t("tenantHome.title.contact") }}</h3>
    <Form inline :label-width="100" style="margin-top:10px;">
      <FormItem :label="$t('tenantHome.label.tel')">
        <strong class="label-value">{{ userInfo.tel || $t("tenantHome.empty") }}</strong>
      </FormItem>
      <FormItem :label="$t('tenantHome.label.phone')">
        <strong class="label-value">{{ userInfo.phone || $t("tenantHome.empty") }}</strong>
      </FormItem>
      <br>
      <FormItem :label="$t('tenantHome.label.email')">
        <strong class="label-value">{{ userInfo.email || $t("tenantHome.empty") }}</strong>
      </FormItem>
      <FormItem :label="$t('tenantHome.label.fax')">
        <strong class="label-value">{{ userInfo.fax || $t("tenantHome.empty") }}</strong>
      </FormItem>
    </Form>

    <h3>{{ $t("tenantHome.title.remark") }}</h3>
    <Form :label-width="100" style="margin-top:10px;">
      <FormItem :label="$t('tenantHome.label.abn')">
        <strong class="label-value">{{ userInfo.abn || $t("tenantHome.empty") }}</strong>
      </FormItem>
      <FormItem :label="$t('tenantHome.label.bizLicense')">
        <strong class="label-value">{{ userInfo.businessLicense || $t("tenantHome.empty") }}</strong>
      </FormItem>
      <FormItem :label="$t('tenantHome.label.address')">
        <strong class="label-value">
          {{userInfo.countryName || ""}}{{userInfo.provinceName || ""}}{{userInfo.cityName || ""}}{{userInfo.countyName || ""}}{{userInfo.address || ""}} 
        </strong>
      </FormItem>
      <FormItem :label="$t('tenantHome.label.currencies')">
        <strong class="label-value">{{ userInfo.currencies || $t("tenantHome.empty") }}</strong>
      </FormItem>
      <FormItem :label="$t('tenantHome.label.remark')">
        <strong class="label-value">{{ userInfo.remark || $t("tenantHome.empty") }}</strong>
      </FormItem>
      <FormItem :label="$t('tenantHome.label.bizDistance')">
        <Tag v-for="item in userInfo.ranges" :key="item" type="border">
          <template v-if="item == 1">{{ $t("tenantHome.store") }}</template>
          <template v-if="item == 2">{{ $t("tenantHome.warehouse") }}</template>
        </Tag>
      </FormItem>
      <FormItem :label="$t('tenantHome.label.language')">
        <Tag v-if="userInfo.language" type="border" >{{ $t("tenantHome.language['" + userInfo.language + "']") }}</Tag>
        <strong v-else class="label-value">{{ $t("tenantHome.empty") }}</strong>
      </FormItem>
    </Form>

    <h3>{{ $t("tenantHome.title.apps") }}</h3>
    <Tag
      style="margin-top:10px;"
      type="dot"
      color="green"
      v-for="app in userInfo.appList"
      :key="app.id"
    >{{ app.name }}</Tag>
  </div>
</template>
<script>
import { getTenantDetail } from "@/api/tenant/tenantHome";
import { mapGetters } from "vuex";
export default {
  name: "TenantHome",

  data() {
    return {
      userInfo: {},
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  created() {
    this.fetchData();
  },

  
  methods: {
    fetchData() {
      getTenantDetail(this.user.tenantId).then(res => {
        this.userInfo = res.data;

        switch (res.data.currencies) {
          case "CNY":
            this.userInfo.currencies = "人民币CNY";
            break;
          case "AUD":
            this.userInfo.currencies = "澳币AUD";
            break;
          case "HKD":
            this.userInfo.currencies = "港币HKD";
            break;
          case "JPY":
            this.userInfo.currencies = "日元JPY";
            break;
          case "KRW":
            this.userInfo.currencies = "韩元KRW";
            break;
          case "EUR":
            this.userInfo.currencies = "欧元EUR";
            break;
        }
      });
    }
  }
};
</script>
<style lang="less">
.TenantHome {
  h3 {
    padding: 10px 0;
    border-bottom: 1px solid #f2f2f2;
  }
  .label-value {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>

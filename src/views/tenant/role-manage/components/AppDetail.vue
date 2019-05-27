<template>
  <div class="AppDetail">
    <app-detail-item 
    v-for="item in detail.bisFunctionList"
    :key="item.id"
    :bis-function-list="item"
    :checkeds="$attrs.checkeds"
    @on-check-all-change="itemCheckChange">
    </app-detail-item>
  </div>
</template>

<script>
import AppDetailItem from "./AppDetailItem"
import { findComponentsDownward } from "@/utils/helper"

export default {
  name: "AppDetail",

  components: { AppDetailItem },

  props: {
    app: Object
  },

  inheritAttrs: false,

  data() {
    return {
      detail: Object.assign({}, this.app),
      allItemChecked: false
    };
  },

  methods: {
    itemCheckChange() {
      const AppDetailItems = findComponentsDownward(this, "AppDetailItem")
      const AppDetailItemFilters = AppDetailItems.filter(component => {
        return component.data._checkAll === true
      })
      this.allItemChecked = AppDetailItems.length === AppDetailItemFilters.length
      this.$emit("on-check-all-change", this.allItemChecked)
    },

    checkOrUnCheckAll(checked) {
      const AppDetailItems = findComponentsDownward(this, "AppDetailItem")
      AppDetailItems.map(component => {
        component.checkOrUnCheckAll(checked)
      })
    },

    getRequestParams() {
      const Items = findComponentsDownward(this, "AppDetailItem")
      let result = {
        appId: this.detail.id,
        appName: this.detail.name,
        bisFuncIdList: [],
        bisFuncCodeList: []
      }
      Items.map(component => {
        const data = component.getData()
        data.bisFuncIdList.length && result.bisFuncIdList.push(...data.bisFuncIdList)
        data.bisFuncCodeList.length && result.bisFuncCodeList.push(...data.bisFuncCodeList)
      })

      if(!result.bisFuncIdList.length || !result.bisFuncCodeList.length) {
        return false
      } else {
        return result
      }
    }
  }
};
</script>
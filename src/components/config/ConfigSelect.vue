<template>
  <Select v-model="selected">
    <Option v-for="item in data" :key="item.id" :value="item.code">
      {{ item.name }}   
    </Option> 
  </Select>
</template>

<script>
import { looseIndexOf } from "@/utils/helper"

import { fetchConfigByCode } from "@/api/tenant/config"

// 配置码
// currensis:       货币种类
// sales_rule:      销售规则
// platform:        ?
// gender:          ?
// warehouseType:   仓库类型
// http_method:     请求方式
const CODES = ["currensis", "sales_rule", "platform", "gender", "warehouseType", "http_method"]

export default {
  name: "ConfigSelect",

  props: {
    code: {
      type: String,
      required: true,
      validator(val) {
        return !looseIndexOf(CODES, val)
      }
    },
    value: {
      type: [String, Number],
      default: ""
    }
  },

  data() {
    return {
      data: [],
      selected: this.value
    }
  },

  watch: {
    value(val) {
      this.selected = val
    },

    selected(val) {
      this.$emit("input", val)
    },
  },

  created() {
    this.loadData()
  },
  
  methods: {
    loadData() {
      fetchConfigByCode(this.code).then(response => {
        this.data = response.data
      }).catch(error => {
        console.error("FETCH SYSTEM CONFIG ERROR", error.message)
      })
    }
  }
}
</script>


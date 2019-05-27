<template>
  <div>
    <org-dynamic-form-default v-show="type === 'default'" v-bind="$attrs"></org-dynamic-form-default>
    <org-dynamic-form-store v-show="type === 'store'" v-bind="$attrs"></org-dynamic-form-store>
    <org-dynamic-form-warehouse v-show="type === 'warehouse'" v-bind="$attrs"></org-dynamic-form-warehouse>
  </div>
</template>

<script>
/**
 * 曾经这是一个异步加载的根组件
 * 
 * 由于需要接收父组件通过 bus emit eventName
 * 
 * 因此无法异步加载, 必须同步创建, 否则无法在 created() 中 bus on eventName
 * 
 * 猝...
 */

import { looseIndexOf } from "@/utils/helper"

import OrgDynamicFormDefault from "./OrgDynamicFormDefault"
import OrgDynamicFormStore from "./OrgDynamicFormStore"
import OrgDynamicFormWarehouse from "./OrgDynamicFormWarehouse"

const TYPES = ["default", "store", "warehouse"]

export default {
  name: "OrgDynamicForm",

  inheritAttrs: false,

  components: { OrgDynamicFormDefault, OrgDynamicFormStore, OrgDynamicFormWarehouse },

  props: {
    type: {
      type: String,
      default: "default",
      validator(val) {
        return !looseIndexOf(TYPES, val)
      }
    }
  }
}
</script>

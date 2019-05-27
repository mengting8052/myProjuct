
<template>
  <Cascader 
    :data="data" 
    v-model="value" 
    transfer 
    change-on-select
    @on-change="change"
    :clearable="clearable"
    style="width: 200px;"> 
  </Cascader>
</template>

<script>
import mixinsOrgs from "./mixins"

export default {
  name: "OrgCascader",

  mixins: [mixinsOrgs],

  props: {
    orgIds: Array,
    clearable:{
      type:Boolean,
      default:true
    }
  },

  data() {
    return {
      value: this.orgIds
    }
  },

  watch: {
    orgIds(val) {
      this.value = JSON.parse(JSON.stringify(val))
    }
  },

  methods: {
    change(val) {
      this.$emit("on-selected-data-change", JSON.parse(JSON.stringify(val)))
    }
  }

}
</script>


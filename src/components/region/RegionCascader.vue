<template>
  <Cascader
    :data="data"
    v-model="value"
    transfer
    @on-change="change"
    style="width: 200px"
    :disabled="disabled">
  </Cascader> 
</template>

<script>
import { fetchRegion } from "@/api/tenant/region"

export default {
  name: "RegionCascader",

  props: {
    regionIds: Array,
    disabled: Boolean,
  },

  data() {
    return {
      data: [],
      value: this.regionIds
    }
  },

  watch: {
    regionIds(val) {
      this.value = JSON.parse(JSON.stringify(val))
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    change(val) {
      this.$emit("on-selected-data-change", JSON.parse(JSON.stringify(val)))
    },

    loadData() {

      function parseData(region) {
        if(!region.children) {
          return Object.assign({}, region, { children: [] })
        } else {
          const childrens = region.children.map(item => {
            return parseData(item)
          })
          return Object.assign({}, region, { children: childrens })
        }
      }

      fetchRegion().then(response => {
        this.data = response.data.map(item => parseData(item))
      })
    }
  }

}
</script>


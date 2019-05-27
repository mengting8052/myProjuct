<template>
  <Tree :data="data" @on-select-change="selectChange"></Tree>
</template>

<script>
import mixinsOrgs from "./mixins"

export default {
  name: "OrgTree",

  mixins: [mixinsOrgs],

  methods: {
    selectChange(selectedNodes) {
      const node = selectedNodes.length === 0 ? false : selectedNodes[0]
      this.$emit("on-select", node)
    }
  }

};
</script>

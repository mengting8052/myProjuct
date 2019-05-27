<template>
  <div :class="prefixCls + '-operation'">
    <Button type="primary" size="small" :disabled="!rightActive" @click.native="moveToLeft">
      <Icon type="ios-arrow-left"></Icon>
      {{ operations[0] }}
    </Button>
    <Button type="primary" size="small" :disabled="!leftActive" @click.native="moveToRight">
      {{ operations[1] }}
      <Icon type="ios-arrow-right"></Icon>
    </Button>
  </div>
</template>

<script>
export default {
  name: "Operation",
  props: {
    prefixCls: String,
    operations: Array,
    leftActive: Boolean,
    rightActive: Boolean
  },
  methods: {
    moveToLeft() {
      this.$parent.moveTo("left");
    },
    moveToRight() {
      this.$parent.moveTo("right");
    }
  }
};
</script>

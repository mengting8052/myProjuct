<template>
    <!--菜单图标弹出框-->
    <Modal class="icon_modal" v-model="visble" width="560" @on-cancel="onCancel">
      <p slot="header">{{$t("businessFunctionManage.text.selectIcon")}}</p>
      <div class="icon_box">
        <div class="icon_svg" v-for="(icon,index) in iconArray" :key="index" @click="onChange(icon)">
          <hero-icon :name="icon"></hero-icon>
          <p>{{icon}}</p>
        </div>
      </div>
      <p slot="footer"></p>
    </Modal>

</template>
<script>
  /**
   *  图标弹出框
   */
  export default {
    name: "IconModal",

    props: {
      value: {
        type: Boolean,
        default:false
      }
    },

    data() {
      return {
        visble: this.value,
        iconArray: ["icon-setting", "icon-statement", "icon-purchase", "icon-warehouse", "icon-treasure", "icon-cargo", "icon-client", "icon-date", "icon-market", "icon-mywork", "icon-mywork", "icon-vip", "icon-member", "icon-search",],//菜单图标数组
      }
    },

    watch: {
      value (val){
        this.visble = val;
      }
    },

    methods: {
      onChange(icon){
        this.$emit("onChange", icon)
      },
      /***
       * 右上角关闭按钮
       */
      onCancel() {
        this.$emit("onCancel")
      }
    }
  }
</script>
<style lang="less">
  .icon_modal {
    .icon_svg {
      display: inline-block;
      text-align: center;
      width: 19%;
      text-align: center;
      background-color: #f3f3f3;
      margin: 0 2px 2px 0;
      padding: 10px 0;
      cursor: pointer;
    }
  }
</style>

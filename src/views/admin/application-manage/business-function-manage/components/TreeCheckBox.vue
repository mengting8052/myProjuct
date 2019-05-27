<template>
<div>
  <div class="tree_checkbox" v-for="(item, index) in dataArray" :key="item.id">
    <h3>{{ item.name }}</h3>
    <Checkbox v-model="item.checkAll" style="margin:10px 0" @on-change="val=>checkBoxChange(item,val)">全选</Checkbox>
    <CheckboxGroup v-model="item.checkGroup" @on-change="onChange(item)">
      <div v-for="module in item.functionList" :key="module.id" style="display: inline-block;padding: 0 10px;">
        <Checkbox :label="module.id">
          <span style="font-size: 14px;">{{ module.name}}</span>
        </Checkbox>
      </div>
    </CheckboxGroup>
  </div>
</div>
</template>
<script>
  /**
   *  checkbox组件
   */
  export default {
    name: "TreeCheckBox",
    props: {
      data: [Array]
    },

    data() {
      return {
        dataArray: Object.assign({},this.data),
      }
    },

    methods: {
      onChange(item){
        this.$emit("onCheckGroup", item)
        if(item.functionList.length===item.checkGroup.length){
            item.checkAll=true
          }else{
            item.checkAll=false
          }
      },
      checkBoxChange(item,val){
         item.checkGroup=[];
          if(val){
           this.$emit("oncheckAllGroup",item) 
          }else{
            this.$emit("onCancelcheckAllGroup",item)
          }
      }
    }
  }
</script>
<style lang="less">
  .tree_checkbox {
    padding: 15px 10px;
    border-bottom: 1px solid #eee;
  }
</style>

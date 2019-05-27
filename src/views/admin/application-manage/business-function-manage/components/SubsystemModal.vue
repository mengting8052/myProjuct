<template>
  <div class="subsystem_modal">
    <Modal v-model="visble" :mask-closable="false" width="600" @on-cancel="onCancel">
      <p slot="header">{{$t("businessFunctionManage.text.selectSubSystem")}}</p>
      <div>
        <Table
          ref="subsystemTable"
          :columns="table.columns"
          :data="table.data"
          border
          height="521"
          @on-selection-change="onSelectionChangeSystem"
        ></Table>
      </div>
      <div slot="footer">
        <Button type="text" @click="onCancel">{{$t("common.form.btn.cancel")}}</Button>
        <Button type="primary" @click="onSave">{{$t("common.form.btn.confirm")}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   *  选择子系统弹框
   */
  import { fetchSubSystem } from "@/api/admin/application-manage/business-function-manage/index"
  export default {
    name: "SubsystemModal",

    props: {
      value: {
        type: Boolean,
        default:false
      }
    },

    data() {
      return {
        visble: this.value,
        table:{
          data:[],
          columns:[
            {
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              renderHeader: (h, params) => {
                return h("span", this.$t("businessFunctionManage.table.thead.subSystemName"))
              },
              key: 'name',
              align: 'center'
            },
          ],
          selection:[]
        }
        
      }
    },

    watch: {
      value (val){
        this.visble = val;
      },
      visble(val){
        this.$emit("input",val)
      }
    },

    created() {
      this.loadSubSystemData()
      this.$bus.on("on-parent-success",this.parentInit)
    },

    mounted() {},

    methods: {
      parentInit(status,selection){
        switch(status){
          case "success":
          const target=[];
          this.table.data.filter((item,index)=>{
              selection.find(v=>v===item.id)&&target.push(index)
            }) ;
          this.table.data=this.table.data.filter((val,index)=>{return target.indexOf(index)===-1 })
          this.visble=false;
          break;
          case "faild":
          this.$Message.error(this.$t("businessFunctionManage.modal.createModule"));
          break;
        }
      },
      /**
       * 获取子系统Table数据
       */
      loadSubSystemData() {
        fetchSubSystem().then(res =>{
          if(res.code == "200") {
            if(res.data){
              this.table.data = res.data;
            }
          }
        })
      },
      /**
       * 选择子系统弹框 - 选中选项框函数触发
       */
      onSelectionChangeSystem(selection){
        this.table.selection=selection;
      },
      /**
       * 选择子系统 - 确定按钮
       */
      onSave(){
        if(this.table.selection.length===0){
          this.$Message.warning(this.$t("businessFunctionManage.modal.selectSystem"));
          return;
        }
        this.$emit("onSave",  this.table.selection.map(item => item.id))
      },
      /**
       * 选择子系统 - 右上角取消按钮  
       */
      onCancel() {
        this.$emit("onCancel")
      }
    }
  }
</script>


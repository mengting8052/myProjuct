<template>
  <Table class="expand-row" :columns="table.columns" :data="table.data" :show-header="false" border></Table>
</template>
<script>
import { deepCopy } from "@/utils/helper"
  export default {
    name: "ExpandRow",

    props: {
      tableData: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        table:{
          columns: [
            {
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              renderHeader: (h, params) =>{
                return h("span", this.$t("businessFunctionManage.table.thead.menuCode"))
              },
              key: 'code'
            },
            {
              renderHeader: (h, params) =>{
                return h("span", this.$t("businessFunctionManage.table.thead.menuName"))
              },
              key: 'name'
            },
            {
              renderHeader: (h, params) =>{
                return h("span", this.$t("businessFunctionManage.table.thead.sortValue"))
              },
              key: 'sort',
              render: (h, params) =>{
                return h("Input",{
                  props: {
                    maxlength: 4,
                    value: params.row.sort
                  },
                  on: {
                    "input":(value)=>{
                      params.row.sort = value;
                      this.table.data[params.index] = params.row;
                      this.$emit("change", params.index, value)
                    }
                  }
                })
              }
            },
          ],
          data: []
        }
      }
    },

    created() {
      this.updateTableData()
    },
    
    methods: {
      updateTableData() {
        this.table.data = deepCopy(this.tableData)
      }
    }
  }
</script>

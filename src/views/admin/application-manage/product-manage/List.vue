<template>
  <layout-list>
    <template slot="tool-left">
      <Button type="primary" @click="$router.push({name: 'product-create'})">{{$t("productManage.addProductBtn")}}</Button>
    </template>

    <template slot="table">
      <Table border :data="table.data" :columns="table.columns" :loading="table.loading" :height="$_layout.tableHeight"></Table>
    </template>

    <template slot="page">
      <Page :pagination="pagination" @on-page-change="loadData" @on-page-size-change="loadData"></Page>
    </template>
</layout-list>

</template>
<script>
  import LayoutList from "@/components/layout"
  import Page from "@/components/pagination/index"
  import { PAGE_PARAMS } from "@/utils/constants"
  import { fetchTable, deleteProductList } from "@/api/admin/application-manage/product-manage/index"
  import { Mixin_LayoutList } from "@/mixins"

  /**
   *  产品管理页面
   */
  export default {
    name: "ProductManage",

    components: { LayoutList, Page },

    mixins: [Mixin_LayoutList],

    data() {
      return {
        table: {
          loading:false,
          data:[],
          columns:[
            {
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              renderHeader: (h, params) => {
                return h("span", this.$t("productManage.table.thead.code"))
              },
              key: 'code',
            },
            {
              renderHeader: (h, params) => {
                return h("span", this.$t("productManage.table.thead.name"))
              },
              key: 'name',
            },

            {
              renderHeader: (h, params) => {
                return h("span", this.$t("common.table.thead.operate"))
              },
              key: "operation",
              render: (h, params) => {
                const editBtn = h("Button", {
                  props: {
                    type: "text"
                  },
                  class: "edit-btn",
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "product-edit",
                        params: {id: params.row.id}
                      })
                    }
                  }
                }, this.$t("common.table.tbody.operate.edit"));

                const removeBtn = h("Button", {
                  style: {
                    marginLeft: "5px",
                  },
                  props: {
                    type: "text"
                  },
                  class: "remove-btn",
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: this.$t("common.table.tbody.operate.remove"),
                        content: this.$t('common.modal.contentDel'),
                        onOk: () => {
                          this.deleteProductList(params.row.id);
                        }
                      });
                    }
                  }
                }, this.$t("common.table.tbody.operate.remove"));
                return h("div", [editBtn, removeBtn]);
              }
            }
          ]
        },
        pagination: Object.assign({}, PAGE_PARAMS),
      }
    },

    created() {
      this.loadData();
    },

    methods: {
      /**
       *  加载table数据
       */
      loadData(reload) {
        reload && (this.pagination = reload);
        this.table.loading=true;
        const params = Object.assign({},{
          page:this.pagination.pageNum,
          pageSize:this.pagination.pageSize
        })

        fetchTable(params).then(res =>{
          if(res.code == 200) {
            if(res.data && res.data.list.length > 0){
              this.table.data = res.data.list;
              this.pagination.total = res.data.total;
              this.pagination.pageSize = res.data.pageSize;
            }
          }
          this.table.loading=false;
        }).catch(err => {
          this.table.loading=false;
        })
      },
      /**
       * 删除数据
       */
      deleteProductList(id) {
        deleteProductList(id).then(res => {
          if(res.code == 200) {
            this.$Message.success(this.$t("common.modal.deleteSuccess"));
            this.pagination.pageNum = 1;
            this.loadData();
          }
        }).catch(error=>{
          this.$Message.error(error.message)
        })
      }
    }
  }
</script>
<template>
  <layout-list>
    <template slot="form">
      <Form inline :label-width="100" ref="searchForm" :model="form">
        <FormItem :label="$t('storeManage.form.label.storeName')" prop="name">
          <Input type="text" v-model="form.name"></Input>
        </FormItem>
        <FormItem :label="$t('storeManage.form.label.storeCode')" prop="code">
          <Input type="text" v-model="form.code"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData(true)">{{ $t("storeManage.btns.search") }}</Button>
          <Button type="ghost" @click="resetForm()">{{ $t("storeManage.btns.reset") }}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="tool-left">
      <Button type="primary" @click="$router.push({ name: 'store-manage-create' })">{{ $t("storeManage.btns.create") }}</Button>
    </template>

    <template slot="table">
      <Table border :loading="table.loading" :data="table.data" :columns="table.cols" :height="$_layout.tableHeight"></Table>
    </template>

    <template slot="page">
      <pagination :pagination="pagination" @on-page-change="loadData()" @on-page-size-change="loadData(true)"></pagination>
    </template>
  </layout-list>
</template>

<script>
import { LayoutList } from "@/components/layout"
import Pagination from "@/components/pagination"
import { PAGE_PARAMS } from "@/utils/constants"
import { fetchStoreList, updateStoreStatus, removeStore } from "@/api/tenant/store"
import { Mixin_LayoutList } from "@/mixins"

export default {
 
  components: { LayoutList, Pagination },

  mixins: [Mixin_LayoutList],

  data() {
    return {
      form: {
        name: "",
        code: ""
      },

      pagination: Object.assign({}, PAGE_PARAMS),

      table: {
        loading: false,
        data: [],
        cols: [
          {
            type: "index",
            align: "center",
            width: 60
          },
          {
            renderHeader: h => {
              return h("span", this.$t("storeManage.table.storeName"))
            },
            key: "name"
          },
          {
            renderHeader: h => {
              return h("span", this.$t("storeManage.table.storeCode"))
            },
            key: "code"
          },
          {
            renderHeader: h => {
              return h("span", this.$t("storeManage.table.leaderEmp"))
            },
            key: "leaderEmpName"
          },
          {
            renderHeader: h => {
              return h("span", this.$t("storeManage.table.status"))
            },
            key: "status",
            render: (h, params) => {
              const text = params.row.status === 1 ? this.$t("storeManage.btns.open") : this.$t("storeManage.btns.close")
              const cls = params.row.status === 1 ? ["success-btn"] : ["warning-btn"]
              return h("span", { class: cls }, text)
            }
          },
          {
            renderHeader: h => {
              return h("span", this.$t("storeManage.table.operate"))
            },
            key: "CURD",
            render: (h, params) => {
              const editBtn = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: "edit-btn",
                  on: {
                    click: () => {
                      this.$router.push({ name: "store-manage-edit", params: { id: params.row.id } })
                    }
                  }
                },
                this.$t("storeManage.btns.edit")
              )

              const statusBtn = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: params.row.status === 1 ? "warning-btn" : "success-btn",
                  on: {
                    click: () => {
                      const status = params.row.status === 1 ? 0 : 1
                      this.statusBtnClick(params.row.id, status)
                    }
                  }
                },
                params.row.status === 1 ? this.$t("storeManage.btns.close") : this.$t("storeManage.btns.open")
              )

              const removeBtn = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: "remove-btn",
                  on: {
                    click: () => {
                      this.removeBtnClick(params.row.id)
                    }
                  }
                },
                this.$t("storeManage.btns.remove")
              )

              return h("div", [editBtn, statusBtn, removeBtn])
            }
          }
        ]
      },
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    loadData(loadData = false) {
      loadData && (this.pagination.pageNum = 1)
      this.table.loading = true
      fetchStoreList(this.pagination, this.form).then(response => {
        if(response.data){
          this.table.data = response.data.list
          this.pagination.total = response.data.total
        }else{
           this.table.data=[];
        }
        
        this.$nextTick(() => {
          this.table.loading = false
        })
      }).catch(error => {
        this.table.loading = false
      })
    },

    resetForm() {
      this.$refs["searchForm"].resetFields()
    },

    statusBtnClick(storeId, status) {
      updateStoreStatus(storeId, status).then(response => {
        this.$Message.success(this.$t("storeManage.others.success"))
        this.loadData()
      }).catch(error => {
        this.$Message.error(error.message)
      })
    },

    removeBtnClick(storeId) {
      this.$Modal.confirm({
        title:this.$t("common.modal.title"),
        content:this.$t("common.modal.contentDel"),
        onOk: () => {
           removeStore(storeId).then(response => {
              this.$Message.success(this.$t("common.modal.deleteSuccess"))
              this.loadData()
            }).catch(error => {
              this.$Message.error(error.message)
            })
        }
      });
     
    }
  }
}
</script>


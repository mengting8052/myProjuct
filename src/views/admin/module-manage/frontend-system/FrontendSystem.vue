<template>
  <layout-list>
    <template slot="form">
      <Form ref="form" :model="form" inline :label-width="100">

        <FormItem prop="name" :label="$t('moduleManage.form.label.systemName')">
          <Input v-model="form.name"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData(true)">{{$t('common.form.btn.search')}}</Button>
          <Button type="ghost" @click="resetForm">{{$t('common.form.btn.reset')}}</Button>
       </FormItem>
      </Form>
    </template>

    <template slot="tool-left">
      <Button type="primary" @click="showModal('create')">{{$t('moduleManage.button.createFrontendSystem')}}</Button>
    </template>

    <template slot="table">
      <Table border :data="table.data" :columns="table.columns" :loading="table.loading" :height="$_layout.tableHeight"></Table>
    </template>

    <template slot="page">
      <Page :pagination="pagination" @on-page-change="loadData(false)" @on-page-size-change="loadData"></Page>
    </template>

    <!--新增/编辑 前端系统弹框-->
    <system-modal
      ref="system"
      v-model="systemModalShow"
      :type="modalText"
      @onCancel="systemModalShow =false"
      @onSuccess="loadData"
    ></system-modal>

  </layout-list>

</template>
<script>
  /**
   *  前端系统页面
   */
  import LayoutList from "@/components/layout/LayoutList"
  import Page from "@/components/pagination/index"
  import SystemModal from "./components/SystemModal"
  import {PAGE_PARAMS} from "@/utils/constants"
  import {fetchFrontSystem, deleteFrontSystem} from "@/api/admin/module-manage/frontend-system"
  import { Mixin_LayoutList } from "@/mixins"

  export default {
    name: "FrontendSystem",

    components: {LayoutList, Page, SystemModal},

    mixins: [Mixin_LayoutList],

    data() {
      return {
        form: {
          name: "",
        },

        table: {
          loading: false,
          data: [],
          columns: [
            {
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: "ID",
              key: 'id',
            },
            {
              renderHeader: (h, params) => {
                return h("span", this.$t("moduleManage.table.thead.systemName"))
              },
              key: 'name',
            },
            {
              renderHeader: (h, params) => {
                return h("span", this.$t("moduleManage.table.thead.url"))
              },
              key: 'url',
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
                      this.$refs.system.getDetail(params.row.id);
                      this.showModal("edit");
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
                          this.delete(params.row.id);
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
        modalText: "create",
        pagination: Object.assign({}, PAGE_PARAMS),
        systemModalShow: false,
        systemId: -1,// 系统id,编辑使用
      }
    },

    created() {
      this.loadData();

    },

    methods: {
      /**
       *  加载table数据
       */
      loadData(reload=false) {
        reload && (this.pagination.pageNum = 1);
        let params = {
          page: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
          data: this.form
        }
        fetchFrontSystem(params).then(res => {
          this.table.data = res.data.rows;
          this.pagination.total = res.data.total;
        }).catch(err => {
          this.$Message.error(err.message);
        })
      },
      /**
       * 删除系统
       */
      delete(id) {
        deleteFrontSystem({id: id}).then(res => {
          this.$Message.success(this.$t("common.modal.deleteSuccess"));
          this.loadData(true);
        }).catch(err => {
          this.$Message.error(err.message);
        })
      },
      /**
       * 打开模态框
       */
      showModal(type) {
        if (type == "create") {
          this.modalText = "create";
        } else if (type == "edit") {
          this.modalText = "edit";
        }
        this.systemModalShow = true;
      },
      /**
       * 重置
       */
      resetForm() {
        this.$refs["form"].resetFields();
      },

    }
  }
</script>

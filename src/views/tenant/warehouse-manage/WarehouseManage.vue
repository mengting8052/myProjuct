<template>
  <layout-list>
    <template slot="form">
      <Form inline :model="form" ref="searchForm" :label-width="100">
        <!-- 仓库类型 -->
        <FormItem :label="$t('warehouseManage.form.label.type')" prop="type">
          <config-select code="warehouseType" v-model="form.type"></config-select>
        </FormItem>
        <!-- 仓库编码 -->
        <FormItem :label="$t('warehouseManage.form.label.code')" prop="code">
          <Input v-model="form.code"></Input>
        </FormItem>
        <!-- 仓库名称 -->
        <FormItem :label="$t('warehouseManage.form.label.name')" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData(true)">{{$t("common.form.btn.search")}}</Button>
          <Button type="ghost" @click="resetForm">{{$t("common.form.btn.reset")}}</Button>
        </FormItem>
      </Form>
    </template>
    <template slot="tool-left">
      <Button
        type="primary"
        @click="$router.push({name:'warehouse-add'})"
      >{{$t("warehouseManage.btns.create")}}</Button>
    </template>

    <template slot="table">
      <Table
        border
        :loading="table.loading"
        :data="table.data"
        :columns="table.columns"
        :height="$_layout.tableHeight"
      ></Table>
    </template>
    <!-- 分页 -->
    <template slot="page">
      <pagination
        :pagination="pagination"
        @on-page-size-change="loadData(true)"
        @on-page-change="loadData()"
      ></pagination>
    </template>
  </layout-list>
</template>
<script>
import LayoutList from "@/components/layout";
import { ConfigSelect } from "@/components/config";
import Pagination from "@/components/pagination";
import { PAGE_PARAMS } from "@/utils/constants";
import { mapGetters } from "vuex";
import { getWareHouseList, del, changeStatus } from "@/api/tenant/wareHouse";
import { Mixin_LayoutList } from "@/mixins";

export default {
  name: "WareHouse",

  components: { LayoutList, Pagination, ConfigSelect },

  mixins: [Mixin_LayoutList],

  data() {
    return {
      form: {
        type: "",
        code: "",
        name: ""
      },

      table: {
        loading: false,
        data: [],
        columns: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            renderHeader: h => {
              return h("span", this.$t("warehouseManage.table.name"));
            },
            key: "name"
          },
          {
            renderHeader: h => {
              return h("span", this.$t("warehouseManage.table.shortName"));
            },
            key: "shortName"
          },
          {
            renderHeader: h => {
              return h("span", this.$t("warehouseManage.table.leaderEmp"));
            },
            key: "leaderEmpName"
          },
          {
            renderHeader: h => {
              return h("span", this.$t("warehouseManage.table.type"));
            },
            key: "type",
            render: (h, params) => {
              let text;
              if (params.row.type === "" || params.row.type === "undefined") {
                return;
              } else {
                switch (params.row.type) {
                  case "normal":
                    text = this.$t("warehouseManage.typeList.normal");
                    break;
                  case "bond":
                    text = this.$t("warehouseManage.typeList.bond");
                    break;
                  case "oversea":
                    text = this.$t("warehouseManage.typeList.oversea");
                    break;
                  case "onetemp":
                    text = this.$t("warehouseManage.typeList.onetemp");
                    break;
                  case "other":
                    text = this.$t("warehouseManage.typeList.other");
                    break;
                }
              }
              return h("span", text);
            }
          },
          {
            renderHeader: h => {
              return h("span", this.$t("warehouseManage.table.code"));
            },
            key: "code"
          },
          {
            renderHeader: h => {
              return h("span", this.$t("warehouseManage.table.status"));
            },
            key: "status",
            render: (h, params) => {
              const text =
                params.row.status === 1
                  ? this.$t("warehouseManage.btns.open")
                  : this.$t("warehouseManage.btns.close");
              const cls =
                params.row.status === 1 ? ["success-btn"] : ["warning-btn"];
              return h("span", { class: cls }, text);
            }
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("common.table.thead.operate"));
            },
            key: "CURD",
            render: (h, params) => {
              const editBth = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: "edit-btn",
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "warehouse-edit",
                        query: { id: params.row.id }
                      });
                    }
                  }
                },
                this.$t("warehouseManage.btns.edit")
              );
              const removeBtn = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: "remove-btn",
                  on: {
                    click: () => {
                      this.removeData(params.row.id);
                    }
                  }
                },
                this.$t("warehouseManage.btns.remove")
              );

              const statusBtn = h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class:
                    params.row.status === 1 ? "warning-btn" : "success-btn",
                  on: {
                    click: () => {
                      const status = params.row.status === 1 ? 0 : 1;
                      changeStatus(params.row.id, status)
                        .then(response => {
                          this.$Message.success(
                            this.$t("warehouseManage.others.success")
                          );
                          this.loadData();
                        })
                        .catch(error => {
                          this.$Message.error(error.message);
                        });
                    }
                  }
                },
                params.row.status == 1
                  ? this.$t("warehouseManage.btns.close")
                  : this.$t("warehouseManage.btns.open")
              );
              return h("div", [editBth, statusBtn, removeBtn]);
            }
          }
        ]
      },
      pagination: Object.assign({}, PAGE_PARAMS)
    };
  },

  computed: {
    ...mapGetters(["user"])
  },

  created() {
    this.loadData();
  },

  methods: {
    loadData(reload = false) {
      this.table.loading = true;
      reload && (this.pagination.pageNum = 1);
      !this.form.type && (this.form.type = undefined);
      getWareHouseList(this.pagination, this.form)
        .then(res => {
          this.table.data = res.data.list;
          this.pagination.total = res.data.total;
          this.$nextTick(() => {
            this.table.loading = false;
          });
        })
        .catch(err => {
          this.table.loading = false;
        });
    },

    resetForm() {
      this.$refs["searchForm"].resetFields();
    },

    removeData(id) {
      this.$Modal.confirm({
        title: this.$t("common.modal.title"),
        content: this.$t("common.modal.contentDel"),
        onOk: () => {
          del(id)
            .then(response => {
              this.loadData();
              this.$Message.success(this.$t("common.modal.deleteSuccess"));
            })
            .catch(error => {
              this.$Message.error(error.message);
            });
        }
      });
    }
  }
};
</script>
<style lang="less">
</style>

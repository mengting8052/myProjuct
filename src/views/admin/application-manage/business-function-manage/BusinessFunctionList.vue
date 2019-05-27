<template>
  <layout-tree>
    <template slot="tree-tool">
      <Button
        type="primary"
        @click="$router.push({name: 'create-business-function'})"
      >{{$t("businessFunctionManage.button.createFunction")}}</Button>
      <Button
        type="primary"
        @click="$router.push({name: 'menu-sort'})"
      >{{$t("businessFunctionManage.button.menuSort")}}</Button>
    </template>

    <template slot="tree">
      <Tree :data="treeData" @on-select-change="onClickTreeNodes" :style="$_layout.treeStyle"></Tree>
    </template>

    <template slot="form">
      <Form ref="form" :model="form" inline :label-width="100">
        <FormItem prop="code" :label="$t('businessFunctionManage.form.label.code')">
          <Input v-model="form.code"/>
        </FormItem>

        <FormItem prop="name" :label="$t('businessFunctionManage.form.label.name')">
          <Input v-model="form.name"/>
        </FormItem>

        <FormItem prop="type" :label="$t('businessFunctionManage.form.label.type')">
          <Select v-model="form.type" style="width:200px" clearable>
            <Option
              v-for="item in typeOptions"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="loadTableData">{{$t('common.form.btn.search')}}</Button>
          <Button type="ghost" @click="resetForm">{{$t('common.form.btn.reset')}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="table">
      <Table
        border
        :data="table.data"
        :columns="table.columns"
        :height="$_layout.tableHeight"
        :loading="table.loading"
      ></Table>
    </template>

    <template slot="page">
      <pagination
        :pagination="pagination"
        @on-page-change="loadTableData()"
        @on-page-size-change="loadTableData(true)"
      ></pagination>
    </template>
  </layout-tree>
</template>
<script>
/**
 *  业务功能管理页面
 */
import { LayoutTree } from "@/components/layout";
import Pagination from "@/components/pagination/index";
import { PAGE_PARAMS } from "@/utils/constants";
import {
  fetchFrontSystem,
  fetchBusinessFunctionList,
  fetchBusinessFunctionAllTree
} from "@/api/admin/application-manage/business-function-manage";
import { deleteBisfunction } from "@/api/admin/application-manage/product-manage";
import { Mixin_LayoutTree } from "@/mixins";

export default {
  name: "BusinessFunctionManage",

  components: { LayoutTree, Pagination },

  mixins: [Mixin_LayoutTree],

  data() {
    return {
      form: {
        id: "",
        code: "",
        name: "",
        type: ""
      },

      treeData: [],

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
            renderHeader: (h, params) => {
              return h(
                "span",
                this.$t("businessFunctionManage.table.thead.code")
              );
            },
            key: "code"
          },
          {
            renderHeader: (h, params) => {
              return h(
                "span",
                this.$t("businessFunctionManage.table.thead.name")
              );
            },
            key: "name"
          },
          {
            renderHeader: (h, params) => {
              return h(
                "span",
                this.$t("businessFunctionManage.table.thead.type")
              );
            },
            key: "type",
            render: (h, params) => {
              let text = "";
              if (params.row.type == "menu") {
                text = this.$t("businessFunctionManage.table.tbody.menu");
              } else if (params.row.type == "control") {
                text = this.$t("businessFunctionManage.table.tbody.control");
              }
              return h("span", text);
            }
          },
          {
            renderHeader: (h, params) => {
              return h(
                "span",
                this.$t("businessFunctionManage.table.thead.parents")
              );
            },
            key: "parentName"
          },
          {
            renderHeader: (h, params) => {
              return h(
                "span",
                this.$t("businessFunctionManage.table.thead.system")
              );
            },
            key: "frontName"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("common.table.thead.operate"));
            },
            key: "operation",
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
                      this.$router.push({
                        name: "edit-business-function",
                        query: { id: params.row.id }
                      });
                    }
                  }
                },
                this.$t("common.table.tbody.operate.edit")
              );

              const removeBtn = h(
                "Button",
                {
                  style: {
                    marginLeft: "5px"
                  },
                  props: {
                    type: "text"
                  },
                  class: "remove-btn",
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: this.$t("common.modal.delete"),
                        content: this.$t("common.modal.contentDel"),
                        onOk: () => {
                          deleteBisfunction(params.row.id)
                            .then(response => {
                              this.$Message.success(
                                this.$t("productManage.others.success")
                              );
                              this.loadTableData();
                            })
                            .catch(error => {
                              this.$Message.error(error.message);
                            });
                        }
                      });
                    }
                  }
                },
                this.$t("common.table.tbody.operate.remove")
              );
              return h("div", [editBtn, removeBtn]);
            }
          }
        ]
      },

      // 业务功能类型下拉框
      typeOptions: [
        {
          label: this.$t("businessFunctionManage.table.tbody.control"),
          value: "control"
        },
        {
          label: this.$t("businessFunctionManage.table.tbody.menu"),
          value: "menu"
        }
      ],

      pagination: Object.assign({}, PAGE_PARAMS)
    };
  },

  created() {
    this.loadTreeData();
    this.loadTableData();
  },

  methods: {
    loadTableData(reload = false) {
      this.table.loading = true;
      reload && (this.pagination.pageNum = 1);
      fetchBusinessFunctionList(this.pagination, this.form)
        .then(response => {
          this.table.data = response.data.list;
          this.pagination.total = response.data.total;
          this.$nextTick(() => {
            this.table.loading = false;
          });
        })
        .catch(error => {
          this.$Message.error(error.message);
          this.table.loading = false;
        });
    },

    loadTreeData() {
      let params = { type: "menu" };
      fetchBusinessFunctionAllTree(params).then(response => {
        this.treeData = this.traverseData(response.data);
      });
    },

    resetForm() {
      this.$refs["form"].resetFields();
    },

    traverseData(dataArray) {
      if (!dataArray) return [];
      let result = dataArray.map(item => ({
        id: item.id,
        title: item.name,
        expand: false,
        children: this.traverseData(item.child)
      }));
      return result;
    },

    onClickTreeNodes(params) {
      if (params.length > 0) {
        params[0]["expand"] = true;
        this.form.id = params[0]["id"];
      } else {
        this.form.id = "";
      }

      this.loadTableData(true);
    }
  }
};
</script>

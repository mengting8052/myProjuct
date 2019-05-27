<template>
  <layout-tree class="MenuSort">
    <template slot="tree">
      <Tree :data="sortTree" @on-select-change="onClickTreeNodes" :style="$_layout.treeStyle"></Tree>
    </template>

    <template slot="form">
      <span>{{$t("businessFunctionManage.text.sortRules")}}</span>
    </template>

    <template slot="tool-left">
      <Button
        type="primary"
        @click="confirm"
        :loading="btnloading"
      >{{$t("common.form.btn.confirm")}}</Button>
      <Button
        type="ghost"
        @click="$router.push({name:'business-function-list'})"
      >{{$t("common.form.btn.cancel")}}</Button>
    </template>

    <template slot="table">
      <Table
        border
        class="backgroud-module-table"
        :columns="table.columns"
        :data="table.data"
        :height="$_layout.tableHeight"
      ></Table>
    </template>
  </layout-tree>
</template>

<script>
/**
 *  菜单排序
 */
import expandRow from "./components/ExpandRow";
import {
  saveMenuSort,
  fetchBusinessFunctionAllTree
} from "@/api/admin/application-manage/business-function-manage";
import { findComponentsDownward, deepCopy } from "@/utils/helper";
import { LayoutTree } from "@/components/layout";
import { Mixin_LayoutTree } from "@/mixins";

export default {
  name: "MenuSort",

  components: { expandRow, LayoutTree },

  mixins: [Mixin_LayoutTree],

  data() {
    return {
      table: {
        columns: [
          {
            type: "expand",
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  tableData: params.row.child
                },
                on: {
                  change: (index, sort) => {
                    params.row.child[index]["sort"] = sort;
                    this.table.data[params.index] = params.row;
                  }
                }
              });
            }
          },
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            renderHeader: (h, params) => {
              return h(
                "span",
                this.$t("businessFunctionManage.table.thead.menuCode")
              );
            },
            key: "code"
          },
          {
            renderHeader: (h, params) => {
              return h(
                "span",
                this.$t("businessFunctionManage.table.thead.menuName")
              );
            },
            key: "name"
          },
          {
            renderHeader: (h, params) => {
              return h(
                "span",
                this.$t("businessFunctionManage.table.thead.sortValue")
              );
            },
            key: "sort",
            render: (h, params) => {
              return h("Input", {
                props: {
                  maxlength: 4,
                  value: params.row.sort
                },
                on: {
                  input: value => {
                    params.row.sort = value;
                    this.table.data[params.index] = params.row;
                  }
                }
              });
            }
          }
        ],
        data: []
      },
      btnloading: false,
      // 左侧 Tree data source
      sortTree: [],
      // 右侧 Table data source
      resultData: [],
      selectId: ""
    };
  },

  created() {
    this.loadTreeData(true);
  },

  methods: {

    // 加载树状结构数据
    loadTreeData(reload = false) {
      fetchBusinessFunctionAllTree({ type: "menu" }).then(response => {
        if (response.data) {
          if (reload) {
            response.data.map(item => {
              let result = {
                id: item.id,
                title: item.name,
                expand: false
              };
              this.sortTree.push(result);
            });
          }
          this.traverseData(response.data);
        }
      });
    },
    /**
     * 遍历Tree数据结构  渲染右侧table数据
     */
    traverseData(dataArray) {
      if (!dataArray) return [];
      const resultData = [];
      dataArray.map(item => {
        if (item.child.length > 0) {
          item.child.map(val => {
            let obj = {
              code: val.code,
              enName: val.enName,
              id: val.id,
              title: val.name,
              name: val.name,
              parentId: val.parentId,
              sid: val.sid,
              sort: val.sort
            };
            if (val.child.length > 0) {
              var arr = [];
              val.child.map(i => {
                let childObj = {
                  code: i.code,
                  enName: i.enName,
                  id: i.id,
                  title: i.name,
                  name: i.name,
                  parentId: i.parentId,
                  sid: i.sid,
                  sort: i.sort
                };
                arr.push(childObj);
                obj.child = arr;
              });
            }
            resultData.push(obj);
          });
        }
      });
      this.resultData = deepCopy(resultData);
      this.table.data = this.selectId
        ? this.resultData.filter(item => item.parentId === this.selectId)
        : resultData;
    },

    // 点击树状数据节点
    onClickTreeNodes(node) {
      this.selectId = node.length ? node[0]["id"] : "";
      this.table.data = node.length
        ? this.resultData.filter(item => item.parentId === node[0].id)
        : deepCopy(this.resultData);
    },
    /**
     * 确定按钮 - 保存数据
     */
    confirm() {
      this.btnloading = true;
      let flag = false;
      this.table.data.find(v => {
        if (!/^[1-9]+\d*$/.test(v.sort)) {
          this.$Message.error(
            this.$t("businessFunctionManage.rules.onlyInteger")
          );
          this.btnloading = false;
          flag = true;
          return true;
        }
      });
      if (!flag) {
        saveMenuSort(this.table.data)
          .then(res => {
            this.$Message.success(
              this.$t("businessFunctionManage.text.saveSuccess")
            );
            this.loadTreeData();
            this.btnloading = false;
          })
          .catch(err => {
            this.$Message.error(err.message);
            this.btnloading = false;
          });
      }
    }
  }
};
</script>

<style lang="less">
.MenuSort {
  .backgroud-module-table {
    .ivu-table-body {
      max-width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .expand-row {
      .ivu-table-body {
          overflow: hidden;
        }
    }
  }
}
</style>

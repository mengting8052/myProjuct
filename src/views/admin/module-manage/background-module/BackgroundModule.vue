<template>
  <layout-tree>
    <template slot="tree-tool">
        <Button type="primary" @click="showModal('create')">{{$t('moduleManage.button.createModule')}}</Button>
        <Button
          type="primary"
          @click="showSystemModal('create')"
        >{{$t('moduleManage.button.createSubsystem')}}</Button>
        <Button
          type="primary"
          @click="showSystemModal('edit')"
          :disabled="changeBtnFlag"
        >{{$t('moduleManage.button.editSubsystem')}}</Button>
    </template>

    <template slot="tree">
      <Tree :data="treeData" @on-select-change="onTreeChange" :style="$_layout.treeStyle"></Tree>
    </template>

    <template slot="form">
      <Form ref="form" :model="form" inline :label-width="100">
        <FormItem prop="name" :label="$t('moduleManage.form.label.moduleName')">
          <Input v-model="form.name"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData(true, true)">{{$t('common.form.btn.search')}}</Button>
          <Button type="ghost" @click="resetForm">{{$t('common.form.btn.reset')}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="table">
      <Table
        border
        :data="table.data"
        :columns="table.columns"
        :loading="table.loading"
        :height="$_layout.tableHeight"
      ></Table>
    </template>

    <template slot="page">
      <pagination
        :pagination="pagination"
        @on-page-change="loadData(false)"
        @on-page-size-change="loadData"
      ></pagination>
    </template>

    <module-modal
      ref="module"
      v-model="moduleModalShow"
      :type="modalText"
      :moduleId.sync="sysId"
      :systemOption="treeData"
      @onCancel="moduleModalShow = false"
      @onSuccess="loadData(true)"
    ></module-modal>

    <subsystem-modal
      ref="subsystem"
      v-model="systemModalShow"
      :type="systemModalText"
      @onCancel="systemModalShow = false"
      @onSuccess="loadSubSystem"
    ></subsystem-modal>
  </layout-tree>
</template>
<script>
/**
 *  后台模块页面
 */
import { LayoutTree } from "@/components/layout";
import Pagination from "@/components/pagination";
import ModuleModal from "./components/ModuleModal";
import SubsystemModal from "./components/SubsystemModal";
import { PAGE_PARAMS } from "@/utils/constants";
import {
  fetchSubSystem,
  fetchModule,
  deleteModule
} from "@/api/admin/module-manage/background-module";
import { Mixin_LayoutTree } from "@/mixins";

export default {
  name: "BackgroundModule",

  components: { LayoutTree, Pagination, ModuleModal, SubsystemModal },

  mixins: [Mixin_LayoutTree],

  data() {
    return {
      form: {
        name: ""
      },
      sid: "",
      treeData: [], // 左边树级结构
      moduleModalShow: false,
      modalText: "create", //模块弹框文案
      systemModalText: "create", //子系统模态框文案
      systemModalShow: false,
      changeBtnFlag: true, //修改子系统按钮标志
      sysId: "",
      table: {
        data: [],
        columns: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("moduleManage.table.thead.subsystem"));
            },
            key: "subsystemName"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("moduleManage.table.thead.moduleName"));
            },
            key: "name"
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
                      this.$refs.module.getDetail(params.row.id);
                      this.showModal("edit");
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
                        title: this.$t("common.table.tbody.operate.remove"),
                        content: this.$t("common.modal.contentDel"),
                        onOk: () => {
                          this.delete(params.row.id);
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
        ],
        loading: false
      },

      pagination: Object.assign({}, PAGE_PARAMS)
    };
  },

  created() {
    this.loadSubSystem();
    this.loadData();
  },

  methods: {
    /**
     *  加载左边树结构
     */
    loadSubSystem() {
      fetchSubSystem().then(res => {
        if (res.data.length > 0) {
          this.treeData = [];
          res.data.forEach(item => {
            const flag = this.sysId == item.id ? true : false;
            let temp = {
              title: `${item.name}:(${item.id})`,
              id: item.id,
              selected: flag
            };
            this.treeData.push(temp);
          });
        }
      });
    },
    /**
     * 加载表格数据
     * @param reload
     */
    loadData(reload, reset = false) {
      reload && (this.pagination.pageNum = 1);
      reset && ((this.form.sid = ""), (this.changeBtnFlag = true)); //点击查询按钮,清除sid(左边树)
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        data: this.form
      };
      fetchModule(params).then(res => {
        this.table.data = res.data.list;
        this.pagination.total = res.data.total;
      });
    },
    /**
     * 点击tree触发
     */
    onTreeChange(data) {
      if (data.length > 0) {
        this.sysId = data[0].id;
        this.form.sid = data[0].id;
      }
      this.changeBtnFlag = false;
      this.loadData(true);
    },
    /**
     * 弹出 "模块" 框
     */
    showModal(type) {
      if (type == "create") {
        this.modalText = "create";
      } else if (type == "edit") {
        this.modalText = "edit";
      }
      this.moduleModalShow = true;
    },
    /**
     * 弹出  "子系统"  框
     */
    showSystemModal(type) {
      if (type == "create") {
        this.systemModalText = "create";
      } else if (type == "edit") {
        this.$refs.subsystem.getDetail(this.form.sid);
        this.systemModalText = "edit";
      }
      this.systemModalShow = true;
    },
    /**
     * 删除模块
     */
    delete(id) {
      deleteModule(id)
        .then(res => {
          this.$Message.success(this.$t("common.modal.deleteSuccess"));
          this.loadData(true);
        })
        .catch(err => {
          this.$Message.error(err.message);
        });
    },
    /**
     * 重置
     */
    resetForm() {
      this.changeBtnFlag = true;
      this.loadSubSystem(); //为了取消树状数据选中状态
      this.$refs.form.resetFields();
    }
  }
};
</script>

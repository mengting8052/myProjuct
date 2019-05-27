<template>
  <layout-list>
    <template slot="form">
      <Form inline :model="form" ref="searchForm" :label-width="100">
        <!-- 名称 -->
        <FormItem :label="$t('staffManage.form.label.name')" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <!-- 用户名 -->
        <FormItem :label="$t('staffManage.form.label.userName')" prop="userName">
          <Input v-model="form.username"></Input>
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
        @click="$router.push({name:'staff-add'})"
      >{{$t('staffManage.btns.addStaffBtn')}}</Button>
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
import Pagination from "@/components/pagination";
import { getStaffList, remove } from "@/api/tenant/staffManage";
import { PAGE_PARAMS } from "@/utils/constants";
import { Mixin_LayoutList } from "@/mixins";

export default {
  name: "UserProfileOptions",

  components: { LayoutList, Pagination },

  mixins: [Mixin_LayoutList],

  data() {
    return {
      form: {
        name: "",
        username: ""
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
            renderHeader: (h, params) => {
              return h("span", this.$t("staffManage.table.thead.name"));
            },
            key: "name"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("staffManage.table.thead.userName"));
            },
            key: "username"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("staffManage.table.thead.organName"));
            },
            key: "organName"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("common.table.thead.operate"));
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
                      this.$router.push({
                        name: "staff-edit",
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
                  props: {
                    type: "text"
                  },
                  class: "remove-btn",
                  on: {
                    click: () => {
                      this.removeClick(params.row.id);
                    }
                  }
                },
                this.$t("common.table.tbody.operate.remove")
              );

              return h("span", [editBtn, removeBtn]);
            }
          }
        ]
      },

      pagination: Object.assign({}, PAGE_PARAMS)
    };
  },

  created() {
    this.loadData();
  },

  methods: {
    loadData(reload = false) {
      this.table.loading = true;
      reload && (this.pagination.pageNum = 1);
      getStaffList(this.pagination, this.form)
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
      this.form.username = "";
    },

    removeClick(id) {
      this.$Modal.confirm({
        title: this.$t("common.modal.delete"),
        content: this.$t("common.modal.contentDel"),
        onOk: () => {
          remove(id)
            .then(response => {
              this.$Message.success(this.$t("common.modal.deleteSuccess"));
              this.loadData();
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
<style lang="less" scoped>
</style>

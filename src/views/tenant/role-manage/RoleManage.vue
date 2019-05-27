<template>
  <layout-list>
    <template slot="form">
      <Form inline :label-width="100" :model="form" ref="searchForm">
        <!-- 角色名称 -->
        <FormItem :label="$t('roleManage.form.label.name')" prop="name">
          <Input type="text" v-model="form.name"/>
        </FormItem>
        <!-- 角色编码 -->
        <FormItem :label="$t('roleManage.form.label.code')" prop="code">
          <Input type="text" v-model="form.code"/>
        </FormItem>
        <!-- 关联产品 -->
        <FormItem :label="$t('roleManage.form.label.appId')" prop="appId">
          <Select v-model="form.appId">
            <Option v-for="item in apps" :key="item.id" :value="item.id">{{ item.name }}</Option>
          </Select>
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
        @click="$router.push({name: 'role-add'})"
      >{{$t("roleManage.btns.addRoleBtn")}}</Button>
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
import { PAGE_PARAMS } from "@/utils/constants";
import { getRoleList, del, listApp } from "@/api/tenant/roleManage";
import { Mixin_LayoutList } from "@/mixins";

export default {
  name: "RoleMange",

  components: { LayoutList, Pagination },

  mixins: [Mixin_LayoutList],

  data() {
    return {
      apps: [],

      form: {
        name: "",
        code: "",
        appId: ""
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
              return h("span", this.$t("roleManage.table.thead.code"));
            },
            key: "code"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("roleManage.table.thead.name"));
            },
            key: "name"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("roleManage.table.thead.appId"));
            },
            key: "appNames"
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
                        name: "role-edit",
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
                      this.removeData(params.row.id);
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
    this.fetchApps();
    this.loadData();
  },

  methods: {
    fetchApps() {
      listApp().then(response => (this.apps = response.data));
    },

    resetForm() {
      this.$refs["searchForm"].resetFields();
    },

    loadData(reload = false) {
      this.table.loading = true;
      reload && (this.pagination.pageNum = 1);

      getRoleList(this.pagination, this.form)
        .then(response => {
          if (response.data) {
            response.data.list.map(item => {
              if (item.appNames.indexOf(null) > -1) {
                item.appNames = "";
              }
            });
            this.table.data = response.data.list;
          } else {
            this.table.data = [];
          }

          this.pagination.total = response.data.total;

          this.$nextTick(() => {
            this.table.loading = false;
          });
        })
        .catch(error => (this.table.loading = false));
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

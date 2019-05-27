<template>
  <layout-list>
    <template slot="form">
      <Form :model="form" ref="searchForm" inline :label-width="100" @submit.native.prevent>
        <FormItem :label="$t('tenantManage.form.label.name')" prop="name">
          <Input v-model="form.name" @on-enter="loadData(true)"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData(true)">{{$t("tenantManage.btns.search")}}</Button>
          <Button type="ghost" @click="resetForm('searchForm')">{{$t("tenantManage.btns.reset")}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="tool-left">
      <Button
        type="primary"
        @click="$router.push({name:'tenant-add'})"
      >{{$t("tenantManage.btns.create")}}</Button>
    </template>

    <template slot="table">
      <Table
        border
        :data="table.data"
        :loading="table.loading"
        :columns="table.columns"
        :height="$_layout.tableHeight"
      ></Table>
    </template>

    <template slot="page">
      <pagination
        :pagination="pagination"
        @on-page-change="loadData()"
        @on-page-size-change="loadData(true)"
      ></pagination>
    </template>
  </layout-list>
</template>
<script>
import LayoutList from "@/components/layout";
import Pagination from "@/components/pagination";
import { gettenantList } from "@/api/admin/tenant";
import { PAGE_PARAMS } from "@/utils/constants";
import { Mixin_LayoutList } from "@/mixins";

export default {
  name: "MerchantList",

  components: { LayoutList, Pagination },

  mixins: [Mixin_LayoutList],

  data() {
    return {
      form: {
        name: ""
      },

      table: {
        loading: false,
        data: [],
        columns: [
          {
            title: "#",
            type: "index",
            align: "center",
            width: 60
          },
          {
            renderHeader: h => {
              return h("span", this.$t("tenantManage.table.name"));
            },
            key: "name"
          },
          {
            renderHeader: h => {
              return h("span", this.$t("tenantManage.table.tel"));
            },
            key: "tel"
          },
          {
            renderHeader: h => {
              return h("span", this.$t("tenantManage.table.operate"));
            },
            key: "CURD",
            render: (h, params) => {
              return h(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  class: "edit-btn",
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "tenant-edit",
                        query: { id: params.row.id }
                      });
                    }
                  }
                },
                this.$t("tenantManage.btns.edit")
              );
            }
          }
        ]
      },

      pagination: Object.assign({}, PAGE_PARAMS)
    };
  },

  computed: {},

  created() {
    this.loadData();
  },

  methods: {
    loadData(reload = false) {
      this.table.loading = true;
      reload && (this.pagination.pageNum = 1);
      gettenantList(this.pagination, this.form)
        .then(res => {
          if (res.data) {
            this.table.data = res.data.list;
            this.pagination.total = res.data.total;
          } else {
            this.table.data = [];
          }

          this.$nextTick(() => {
            this.table.loading = false;
          });
        })
        .catch(err => {
          this.table.loading = false;
        });
    },

    resetForm(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>
<style lang="less">
</style>

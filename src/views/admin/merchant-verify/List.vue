<template>
  <layout-list>
    <template slot="form">
      <Form :model="form" ref="searchForm" inline :label-width="100" @submit.native.prevent>
        <FormItem :label="$t('tenantManage.form.label.name')" prop="name">
          <Input v-model="form.name" @on-enter="loadData(true)"></Input>
        </FormItem>
        <Button type="primary" @click="loadData(true)">{{$t("tenantManage.btns.search")}}</Button>
      </Form>
    </template>

    <template slot="table">
      <Table
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
import LayoutList from "@/components/layout/LayoutList.vue";
import Pagination from "@/components/pagination";
import { PAGE_PARAMS } from "@/utils/constants";
import { Mixin_LayoutList } from "@/mixins";
import { tenantAuditPage } from "@/api/admin/tenant";

export default {
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
            key: "name",
            render: (h, params) => {
              return h("span", params.row.auditData.name)
            }
          },
          {
            renderHeader: h => {
              return h("span", this.$t("tenantManage.table.tel"));
            },
            key: "tel",
            render: (h, params) => {
              return h("span", params.row.auditData.tel)
            }
          },
          {
            renderHeader: h => {
              return h("span", this.$t("tenantManage.table.operate"));
            },
            key: "CURD",
            align: "center",
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
                        name: "merchant-verify-detail",
                        query: { id: params.row.id }
                      });
                    }
                  }
                },
                "审核"
              );
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
      const params = Object.assign({}, this.form, {
        page: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      });
      tenantAuditPage(params)
        .then(response => {
          this.table.data = response.data.list;
          this.pagination.total = response.data.total;
          this.$nextTick(() => {
            this.table.loading = false;
          });
        })
        .catch(err => {
          this.table.loading = false;
        });
    }
  }
};
</script>


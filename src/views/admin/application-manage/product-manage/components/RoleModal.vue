<template>
  <Modal
    v-model="modalShow"
    :title="$t('productManage.title')"
    width="700"
    @on-visible-change="visibleChange"
    :closable="false"
  >
    <Form inline :label-width="80">
      <FormItem :label="$t('roleManage.table.thead.name')">
        <Input type="text" v-model="form.name"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="loadData(true)">{{$t('common.form.btn.search')}}</Button>
      </FormItem>
    </Form>

    <Table
      :loading="table.loading"
      :height="521"
      :data="table.data"
      :columns="table.cols"
      @on-selection-change="selectionChange"
    ></Table>

    <pagination
      style="text-align: right; margin-top: 20px;"
      @on-page-change="loadData()"
      @on-page-size-change="loadData(true)"
      :pagination="pagination"
    ></pagination>

    <template slot="footer">
      <Button type="text" @click="cancel()">{{$t('common.form.btn.cancel')}}</Button>
      <Button type="primary" @click="confirmAndClose()">{{$t('common.form.btn.checked')}}</Button>
      <Button
        type="primary"
        @click="confirmAndClose(true)"
      >{{$t('common.form.btn.checkedAndClosed')}}</Button>
    </template>
  </Modal>
</template>

<script>
import Pagination from "@/components/pagination";
import { getRoleList } from "@/api/tenant/roleManage";
import { PAGE_PARAMS } from "@/utils/constants";
import { deepCopy } from "@/utils/helper";

export default {
  name: "RoleModal",

  components: { Pagination },

  props: {
    visible: Boolean
  },

  data() {
    return {
      modalShow: this.visible,

      pagination: Object.assign({}, PAGE_PARAMS),

      form: { name: "" },

      table: {
        loading: false,
        selections: [],
        data: [],
        cols: [
          {
            type: "index",
            align: "center",
            width: 60
          },
          {
            type: "selection",
            align: "center",
            width: 60
          },
          {
            renderHeader: h => {
              return h("span", this.$t("roleManage.table.thead.name"));
            },
            key: "name"
          },
          {
            renderHeader: h => {
              return h("span", this.$t("roleManage.table.thead.code"));
            },
            key: "code"
          }
        ]
      }
    };
  },

  watch: {
    visible(val) {
      this.modalShow = val;
    },

    modalShow(val) {
      this.$emit("update:visible", val);
    }
  },

  created() {
    this.loadData();
  },

  methods: {
    selectionChange(selection) {
      this.table.selections = selection;
    },

    confirmAndClose(close = false) {
      close && (this.modalShow = false);
      this.$emit("on-ok", deepCopy(this.table.selections));
      this.form = { name: "" };
      this.loadData();
    },

    cancel() {
      this.form = { name: "" };
      this.modalShow = !this.modalShow;
    },

    loadData(reload = false) {
      reload && (this.pagination.pageNum = 1);
      this.table.loading = true;
      getRoleList(this.pagination, this.form)
        .then(response => {
          if (response.data) {
            this.table.data = response.data.list;
            this.pagination.total = response.data.total;
          } else {
            this.table.data = [];
          }

          this.$nextTick(() => {
            this.table.loading = false;
          });
        })
        .catch(error => {
          this.table.loading = false;
        });
    },

    visibleChange(status) {
      if (status) {
        this.loadData(true)
      }
    }
  }
};
</script>


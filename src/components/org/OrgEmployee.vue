<template>
  <Modal v-model="modalShow" :title="$t('components.orgEmployee.selectCharge')" width="900" @on-ok="confirm">

    <Form inline :label-width="80" :model="form" ref="searchForm">
      <FormItem :label="$t('components.orgEmployee.name')" prop="name">
        <Input type="text" v-model="form.name"></Input>
      </FormItem>
      <FormItem :label="$t('components.orgEmployee.username')" prop="username">
        <Input type="text" v-model="form.username"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="loadData(true)">{{ $t("common.form.btn.search") }}</Button>
        <Button type="ghost" @click="resetForm">{{ $t("common.form.btn.reset") }}</Button>
      </FormItem>
    </Form>

    <Table 
      :height="521" 
      :loading="table.loading" 
      :data="table.data" 
      :columns="table.cols" 
      highlight-row
      @on-current-change="currentChange">
    </Table>

    <pagination 
      :pagination="pagination" 
      style="text-align: right; margin-top: 20px;"
      @on-page-change="loadData()"
      @on-page-size-change="loadData(true)">
    </pagination>

  </Modal>
</template>

<script>
import Pagination from "@/components/pagination"
import { PAGE_PARAMS } from "@/utils/constants"
import { fetchOrgEmployee } from "@/api/tenant/orgManage"

export default {
  name: "OrgEmployee",

  components: { Pagination },

  props: {
    visible: Boolean
  },

  data() {
    return {
      modalShow: this.visible,

      selectedItem: {},

      pagination: Object.assign({}, PAGE_PARAMS),

      form: {
        name: "",
        username: ""
      },

      table: {
        loading: false,
        data: [],
        cols: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("components.orgEmployee.name"))
            },
            key: "name"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("components.orgEmployee.username"))
            },
            key: "username"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("components.orgEmployee.organName"))
            },
            key: "organName"
          }
        ]
      }
    }
  },

  watch: {
    visible(val) {
      this.modalShow = val
    },
    modalShow(val) {
      this.$emit("update:visible", val)
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    loadData(reload = false) {
      this.table.loading = true
      reload && (this.pagination.pageNum = 1)
      fetchOrgEmployee(this.pagination, this.form).then(response => {
        this.table.data = response.data.list
        this.pagination.total = response.data.total
        this.$nextTick(() => {
          this.table.loading = false
        })
      }).catch(error => {
        this.table.loading = false
      })
    },

    resetForm() {
      this.$refs["searchForm"].resetFields()
    },

    currentChange(currentRow) {
      this.selectedItem = currentRow
    },

    confirm() {
      this.$emit("on-select", this.selectedItem)
    }
  }
}
</script>


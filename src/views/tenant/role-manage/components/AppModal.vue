<template>
  <Modal v-model="modalShow" :title="$t('roleModify.modal.title')" @on-ok="confirm">
    <Table 
      :height="521"
      :loading="table.loading" 
      :data="table.data" 
      :columns="table.columns"
      @on-selection-change="selectionChange">
    </Table>
  </Modal>
</template>

<script>
import { queryBymerchantId } from "@/api/tenant/app"
import { mapGetters } from "vuex"

export default {

  props: {
    visible: Boolean,
    checkeds: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      modalShow: this.visible,
      table: {
        loading: false,
        selection: [],
        data: [],
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            renderHeader: (h, params) => {
              return h("span", this.$t("roleModify.modal.table.thead.name"));
            },
            key: "name"
          }
        ]
      }
    }
  },

  computed: {
    ...mapGetters(["user"])
  },

  watch: {
    visible(val) {
      this.modalShow = val
    },
    modalShow(val) {
      this.$emit("update:visible", val)
    },
    checkeds(checkeds) {
      if(checkeds.length) {
        this.table.data = this.table.data.filter(v => checkeds.indexOf(v.id) === -1)
      }
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.table.loading = true
      queryBymerchantId(this.user.tenantId).then(response => {
        this.table.data = response.data
        this.$nextTick(() => {
          this.table.loading = false
        })
      }).catch(error => {
        this.table.loading = false
      })
    },

    confirm() {
      if(this.table.selection.length) {
        this.$emit("selection-change", this.table.selection.map(item => item.id))
        this.$nextTick(() => {
          // table.data 与 table.selection 嵌套循环
          // 找出被选中数据在 table.data 数组中的 index
          // 并用 target 缓存
          let target = []
          this.table.data.map((item, index) => {
            this.table.selection.find(v => v.id === item.id) && target.push(index)
          })
          // 通过 target, 使用 table.data.filter 过滤出不在 target 集合中的元素
          // 并使用 filter 返回全新的数组对象赋值给 table.data
          this.table.data = this.table.data.filter((val, index) => {
            return target.indexOf(index) === -1
          })
          // 完成全部操作后, 将 table.select 置为 []
          this.table.selection.length = 0
        })
      }
    },

    selectionChange(selection) {
      this.table.selection = selection
    }
  }

}
</script>


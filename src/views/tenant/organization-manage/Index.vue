<template>
  <Row>
    <Col span="8">
      <div class="orgnaizationManage_header">
        <Button type="ghost" @click="create()">{{$t("OrgManage.btns.add")}}</Button> 
        <Button type="ghost" @click="update()" :disabled="updateBtnDisabled">{{$t("OrgManage.btns.update")}}</Button> 
        <Button type="ghost" @click="remove()" :loading="removeBtnLoading" :disabled="removeBtnDisabled">{{$t("OrgManage.btns.del")}}</Button> 
      </div>
      <div class="orgnaizationManage_body" style="padding-right: 20px">
        <org-tree :orgs="data" @on-select="select" :style="$_layout.treeStyle"></org-tree>
      </div>
    </Col>
    <Col span="16">
      <div class="orgnaizationManage_header">
        <header>{{$t("OrgManage.others.depManage")}}</header>
      </div>
      <div class="orgnaizationManage_body" :style="$_layout.treeStyle">
        <org-dynamic-form :type="formType" :orgs="data"></org-dynamic-form>
      </div>
    </Col>
  </Row>
</template>

<script>
import { OrgTree } from "@/components/org"
import OrgDynamicForm from "./components/OrgDynamicForm"
import { mapGetters } from "vuex"
import { fetchOrgTree, removeOrg } from "@/api/tenant/orgManage"
import MixinTreeForm from "./mixins"

export default {
  name: "OrgManage",

  components: { OrgTree, OrgDynamicForm },

  mixins: [ MixinTreeForm ],

  data() {
    return {
      // 组织机构数据源集合
      data: [],
      // 右侧表单类型默认为 default
      formType: "default",
      // 初始化为 null, 便于初始化 修改 删除 按钮 disabled 状态
      selectedNode: null,
      // 删除按钮 loading 状态
      removeBtnLoading: false,
    }
  },

  computed: {
    ...mapGetters(["user"]),

    updateBtnDisabled() {
      // 未选中组织时无法修改
      if(!this.selectedNode) return true
      // 当前选中组织为根组织时, 无法修改
      if(this.selectedNode.level == 1) return true
    },

    removeBtnDisabled() {
      // 未选中组织时无法删除
      if(!this.selectedNode) return true
      // 当前选中组织为根组织时, 无法删除
      if(this.selectedNode.level == 1) return true
      // 当前选中组织下有子组织时, 无法删除
      if(this.selectedNode.children && this.selectedNode.children.length) return true
      // 门店或仓库, 无法删除
      if(this.selectedNode.type == 2 || this.selectedNode.type == 3) return true
    }
  },

  created() {
    this.$bus.on("default-create-or-update-success", this.loadData)
    this.$bus.on("warehouse-update-success", this.loadData)
    this.$bus.on("store-update-success", this.loadData)
  },

  mounted() {
    this.loadData()
  },

  beforeDestroy() {
    this.$bus.off("default-create-or-update-success", this.loadData)
    this.$bus.off("warehouse-update-success", this.loadData)
    this.$bus.off("store-update-success", this.loadData)
  },

  methods: {
    select(selectedNode) {
      this.selectedNode = selectedNode ? Object.assign({}, selectedNode) : null
    },

    create() {
      this.formType = "default"
      this.$bus.emit("create-btn-click")
    },

    update() {
      const type = this.selectedNode.type
      switch(type) {
        case 2:
          this.formType = "store"
          this.$bus.emit("update-store", this.selectedNode.id)
          break
        case 3:
          this.formType = "warehouse"
          this.$bus.emit("update-warehouse", this.selectedNode.id)
          break
        default:
          this.formType = "default"
          this.$bus.emit("update-default", this.selectedNode)
      }
    },

    remove() {
      this.$Modal.confirm({
        title:this.$t("common.modal.title"),
        content:this.$t("common.modal.contentDel"),
        onOk: () => {
            this.removeBtnLoading = true
            removeOrg(this.selectedNode.value).then(response => {
              this.removeBtnLoading = false
              this.$Message.success(this.$t("OrgManage.others.success"))
              this.loadData()
            }).catch(error => {
              this.$Message.error(error.message)
              this.removeBtnLoading = false
            })
        }
      });
    
    },

    loadData() {
      // 递归处理从服务端获取的数据集合
      // 添加 Tree、Cascade Component 所需的特殊键名: value, label, title 等
      // 添加后续 API 接口所需的特殊键名: parentIds, level 等
      function convertData(orgin, parentIds) {
        const orginParentIds =
          parentIds.length > 0 ? parentIds.slice(0, parentIds.length - 1) : []
        if (!orgin.childTenantOrgan || orgin.childTenantOrgan.length == 0) {
          return {
            value: orgin.id,
            label: orgin.name,
            title: orgin.name,
            code: orgin.code,
            id: orgin.id,
            name: orgin.name,
            tenantId: orgin.tenantId,
            parentId: orgin.parentId,
            parentIds: orginParentIds,
            adminEmployeeId: orgin.adminEmployeeId,
            adminEmployeeName: orgin.adminEmployeeName,
            level: orgin.level,
            type:orgin.type
          }
        } else {
          const childrens = orgin.childTenantOrgan.map(item => {
            return convertData(item, parentIds.concat(item.id))
          });
          return {
            value: orgin.id,
            label: orgin.name,
            title: orgin.name,
            expand: true,
            children: childrens,
            name: orgin.name,
            id: orgin.id,
            code: orgin.code,
            tenantId: orgin.tenantId,
            parentId: orgin.parentId,
            parentIds: orginParentIds,
            adminEmployeeId: orgin.adminEmployeeId,
            adminEmployeeName: orgin.adminEmployeeName,
            level: orgin.level,
            type:orgin.type
          }
        }
      }

      fetchOrgTree(this.user.tenantId).then(response => {
        this.data = response.data.map(item => convertData(item, [item.id]))
      });
    }
  }
}
</script>

<style lang="less">
.orgnaizationManage_header {
  border-bottom: 1px solid #eee;
  height: 42px;
  width: 100%;
  header {
    font-weight: bold;
    font-size: 14px;
    height: 32px;
    line-height: 28px;
  }
}
.orgnaizationManage_body {
  margin-top: 10px;
}
</style>


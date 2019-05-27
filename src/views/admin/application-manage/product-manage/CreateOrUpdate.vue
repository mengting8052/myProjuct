<template>
  <div>
    <Form :label-width="100" :model="form.data" ref="CreateOrUpdateForm" :rules="form.rules" inline>
      <FormItem :label="$t('productManage.productMsg.productName')" prop="name">
        <Input type="text" v-model="form.data.name"  :maxlength="32"></Input>
      </FormItem>
      <FormItem :label="$t('productManage.productMsg.productCode')" prop="code">
        <Input type="text" v-model="form.data.code" :maxlength="64"></Input>
      </FormItem>
      <br>  
      <FormItem :label="$t('productManage.productMsg.productType')"  prop="type">
        <Select v-model="form.data.type">
          <Option :value="0">{{$t("productManage.others.productTypes.tenant")}}</Option>
          <Option :value="1">{{$t("productManage.others.productTypes.admin")}}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('productManage.productMsg.productURL')"   prop="url">
        <Input type="text" v-model="form.data.url"></Input>
      </FormItem>
      <br>
      <FormItem :label="$t('productManage.productMsg.productLogo')"  prop="appLogo">
        <ul class="logoList">
          <li>
            <uploader v-model="form.data.appLogo" :max-height="50" :max-width="168">
              <div class="footer" slot="footer">
                <div>{{$t("productManage.productMsg.fullLogo")}}</div>
                <div style="color: #8c939d;">{{$t("productManage.productMsg.size")}}: 168*50 </div>
              </div>
          </uploader>
          </li>
          <li>
            <uploader v-model="form.data.shrinkAppLogo" :max-height="30" :max-width="30">
              <div slot="footer">
                <div>{{$t("productManage.productMsg.shrinkLogo")}}</div>
                <div style="color: #8c939d;">{{$t("productManage.productMsg.size")}}: 30*30 </div>
              </div>
            </uploader>
          </li>
        </ul>
      </FormItem>
      <br>
      <FormItem :label="$t('productManage.productMsg.defaultRole')"  prop="roleList">
        <Button type="ghost"  @click="visible = !visible">{{$t("productManage.productMsg.selectRole")}}</Button>
        <p v-show="form.data.roleList.length">{{$t("productManage.productMsg.selectedRole")}}</p>
        <div>
          <Tag
            v-for="(role,index) in form.data.roleList"
            :key="role.id"
            closable 
            @on-close="roleRemove"
            :name="index"
            color="blue">
            {{ role.name }}
          </Tag>
        </div>
      </FormItem>
      <br>
      <FormItem :label="$t('productManage.productMsg.selectAssociationRole')" >
        <TransferTree
          :data="bizs"
          :target-keys="targetKeys"
          :list-style="listStyle"
          filterable
          @on-change="bizChange"
        ></TransferTree>
      </FormItem>
      <br>
      <FormItem>
        <Button type="primary" :loading="btnLoading" @click="confirm()">{{$t("common.form.btn.confirm")}}</Button>
        <Button type="ghost" @click="$router.push({ name: 'product-list' })">{{$t("common.form.btn.cancel")}}</Button>
      </FormItem>
    </Form>

    <role-modal :visible.sync="visible" @on-ok="roleChange"></role-modal>
  </div>
</template>

<script>
import Uploader from "@/components/uploader"
import TransferTree from "@/components/transfer-tree"
import RoleModal from "./components/RoleModal"

import { fetchBusinessFunctionAllTree } from "@/api/admin/application-manage/business-function-manage"
import { saveOrUpdateApp, fetchApp } from "@/api/admin/application-manage/product-manage"
const APP_OBJ = Object.freeze({
  // 完整图标
  appLogo: "",
  // 产品编码
  code: "",
  // 产品 ID
  id: null,
  // 产品名称
  name: "",
  // 角色列表
  roleList: [],
  // 业务列表
  bisFunctionIds: [],
  // 压缩图标
  shrinkAppLogo: "",
  // 产品类型
  type: 0,
  // 产品链接
  url: ""
})
 
export default {
  components: { Uploader, RoleModal, TransferTree },

  data() {
    var validateCode = (rule, value, callback) => {

        if (value === "" || value == null) {
          callback(new Error(this.$t("productManage.rules.code")));
          return;
        }

        if (/^[A-Za-z0-9/-]+$/.test(value)) {
          callback();
        } else {
          callback(new Error(this.$t("productManage.rules.numOrLetter")));
        }
      };
    return {
      btnLoading: false,

      form: {
        data: Object.assign({}, APP_OBJ),
        rules: {
            code:[{required:true,validator: validateCode,trigger:"blur"}],
            name:[{required:true,message:this.$t("productManage.rules.name"),trigger:"blur"}]
        }
      },

      visible: false,

      bizs: [],

      targetKeys: [],

      listStyle: {
        width: "250px",
        height: "400px"
      }
    };
  },

  created() {
    this.loadBizs()
  },

  mounted() {
    // 关联功能 "bisFunctionIds" 的 "数据结构" 及 "回显" 参数组装说明:

    // transfer-tree 已选项:   targetKeys
    // 关联功能请求参数:        form.data.bisFunctionIds
    // 数据源:                 bizs

    /**
     *  穿梭框勾选完毕后, 视图中的 transfer-tree 右侧 UI 大致如下(假设文案与 key 相同):
     * 
     * "1"
     *    "1-1"
     *        "1-1-1"
     *        "1-1-2"
     */

    // transfer-tree 组件, 在获取 targetKeys 时, 只会返回每个 group 中的末节点, 因此在获取"已选项"时, 父组件只会拿到 targetKeys: ["1-1-1", "1-1-2"]
    // 服务端 API 除了末节点的值, 还需要上一级的值, 即需要请求参数 bisFunctionIds => ["1-1", "1-1-1", "1-1-2"]
    // 因此在 methods 中, 会通过 splitTree() 函数, 根据 "bizs" 和 "targetKeys", 解析出 transfer-tree 右侧树的数据结构:
    /**
     [
        {
          key: "1",
          children: [
            {
              key: "1-1",
              children: [
                {
                  key: "1-1-1"
                },
                {
                  key: "1-1-2"
                }
              ]
            }
          ]
        }
      ]
     */
    // 而后通过 initBisFunctionIds() 函数递归的解析出服务端所需要的 bisFunctionIds: ["1-1", "1-1-1", "1-1-2"]

    // ====================

    // 在编辑时, 服务端所返回的详情数据中, 对应 "关联功能" 的 key 为 child, 数据结构:
    /**
     {
       //... 其他参数, 如 appLogo, code, name 等
       child: [
         {
           id: "1",
           child: [
             {
               id: "1-1",
               child: [
                 {
                   id: "1-1-1",
                   id: "1-1-2"
                 }
               ]
             }
           ]
         }
       ]
     }
     */
    // 因此在 initApp() 函数中, 通过 initTargetKeys() 函数解析 child 键, 并获取到 targetKeys: ["1-1-1", "1-1-2"], 用以在编辑时, 回显 transfer-tree 右侧
    // 此外我们还需要移除 child 键, 若将 child 传递至服务端 API, 服务端将以 child 为主进行数据库操作 (这可能是 API 的一个 BUG)
  },

  methods: {
    initApp() {
      fetchApp(this.$route.params.id).then(response => {
        this.form.data = Object.assign({}, response.data)
        // 初始化 targetKeys 用以提供数据源, 初始化 transfer-tree 右侧树结构
        this.initTargetKeys(response.data.child)
        // 根据 targetKeys 拆分数据源, 将其拆分为 leftData and rightData
        const treeData = this.splitTree(this.bizs, this.targetKeys)
        // 从 rightData 中初始化 bisFunctionIds
        const bisFunctionIds = this.initBisFuncionIds(treeData.rightData)
        this.form.data.bisFunctionIds = bisFunctionIds
        // 移除由服务端带过来的 child 键
        delete this.form.data.child
      })
    },

    initTargetKeys(data, targetKeys = this.targetKeys) {
      if(!data) data = []
      for(let i = 0; i < data.length; i ++) {
        if(data[i].child && data[i].child.length) {
          this.initTargetKeys(data[i].child, targetKeys)
        } else {
          targetKeys.push(data[i].id)
        }
      }
    },

    initBisFuncionIds(data) {
      let bisFunctionIds = []

      loop(data)

      function loop(data) {
        data.map(item => {
          item.key.indexOf("GVT") === -1 && bisFunctionIds.push(item.key)
          if(item.children && item.children.length) {
            loop(item.children)
          }
        })
      }

      return bisFunctionIds
    },

    splitTree(data, keys) {
      const leftData = [];
      const rightData = [];
      data.forEach(obj => {
        this.$set(obj, "checked", false);
        this.$set(obj, "indeterminate", false);
        if (keys.includes(obj.key)) {
          rightData.push(obj);
        } else if (obj.children && obj.children.length) {
          const leftObj = { ...obj };
          const rightObj = { ...obj };
          const children = this.splitTree(obj.children, keys);
          leftObj.children = children.leftData;
          rightObj.children = children.rightData;
          leftObj.children && leftObj.children.length && leftData.push(leftObj);
          rightObj.children &&
            rightObj.children.length &&
            rightData.push(rightObj);
        } else {
          leftData.push(obj);
        }
      });
      return { leftData, rightData };
    },

    loadBizs() {
      fetchBusinessFunctionAllTree().then(response => {
        function parseData(biz) {
          if (biz.child && biz.child.length) {
            const childrens = biz.child.map(item => {
              return parseData(item);
            });
            return {
              key: biz.id,
              title: biz.name,
              children: childrens,
            };
          } else {
            return {
              key: biz.id,
              title: biz.name,
            };
          }
        }
        this.bizs = response.data.map(item => parseData(item));
        this.$route.params.id && this.initApp()
      });
    },

    bizChange(keys) {
      this.targetKeys = keys
      this.form.data.bisFunctionIds = keys.filter(item => item.indexOf("GVT") === -1 )
    },

    roleChange(roles) {
      roles.map(item => {
        const found = this.form.data.roleList.find(v => item.id == v.id)
        !found && this.form.data.roleList.push(item)
      })
      // this.form.data.roleList = roles
    },

    roleRemove(event, index) {
      this.form.data.roleList.splice(index, 1)
    },

    confirm() {
        this.$refs["CreateOrUpdateForm"].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            // 处理 bisFunctionIds
            const treeData = this.splitTree(this.bizs, this.targetKeys)
            const bisFunctionIds = this.initBisFuncionIds(treeData.rightData)
            // 拼接 bisFunctionIds
            const params = Object.assign({}, this.form.data, { bisFunctionIds })
              saveOrUpdateApp(params).then(response => {
              this.$Message.success(this.$t("productManage.others.success"))
              this.btnLoading = false
               this.$router.push({ name: "product-list" }) 
              }).catch(error => {
                this.$Message.error(error.message)
                this.btnLoading = false
            })
         }
      })
    }
  }
};
</script>
<style lang="less">
  .logoList{
     li{
     list-style:none;
     float: left;
  }
} 
</style>


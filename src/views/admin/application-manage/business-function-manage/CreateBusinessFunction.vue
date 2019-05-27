<template>
  <div>
    <Form ref="form" :model="form" :rules="rules" inline>
      <div class="search_box">
        <!--业务功能编码-->
        <FormItem prop="code" :label="$t('businessFunctionManage.form.label.code')" :label-width="110">
          <Input v-model="form.code" :maxlength="64" clearable/>
        </FormItem>
        <br>
        <!--业务功能名称-->
        <FormItem prop="name" :label="$t('businessFunctionManage.form.label.name')" :label-width="110">
          <Input v-model="form.name" :maxlength="32" clearable/>
        </FormItem>
        <br>
        <!-- 业务功能英文名 -->
        <FormItem prop="enName" :label="$t('businessFunctionManage.form.label.enName')" :label-width="110">
          <Input v-model="form.enName" clearable/>
        </FormItem>
        <br>
        <!--业务功能类型-->
        <FormItem prop="type" :label="$t('businessFunctionManage.form.label.type')" :label-width="110">
          <Select v-model="form.type" style="width:200px" clearable @on-change="onTypeChange">
            <Option v-for="item in typeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <br>
        <!--前端系统-->
        <FormItem prop="sid" :label="$t('businessFunctionManage.form.label.system')" :label-width="110">
          <Select v-model="form.sid" style="width:200px" clearable filterable>
            <Option v-for="item in frontSystemOptions" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <br>
        <!--上级功能-->
        <FormItem prop="parentIds" :label="$t('businessFunctionManage.form.label.parents')" :label-width="110" style="width: 310px;">
          <Cascader :data="functionOptions" v-model="form.parentIds" @on-change="onParentChange"  change-on-select></Cascader>
        </FormItem>
        <br>
        <!--URL地址-->
        <FormItem prop="uri" :label="$t('businessFunctionManage.form.label.url')" :label-width="110">
          <Input v-model="form.uri" clearable/>
        </FormItem>
        <br>
        <!--排序值-->
        <FormItem prop="sort" :label="$t('businessFunctionManage.form.label.sort')" :label-width="110" v-if="form.type == 'menu'">
          <Input class="input_width" v-model="form.sort" clearable/>
          <span>({{$t("businessFunctionManage.text.range")}})</span>
        </FormItem>
        <!--菜单图标-->
        <FormItem prop="icon" :label="$t('businessFunctionManage.form.label.icon')" :label-width="110" v-if="form.type == 'menu'">
          <hero-icon :name="form.icon" width="20" height="20"></hero-icon>
          <Button type="primary" @click="iconModalShow = true">{{$t("businessFunctionManage.button.selectIcon")}}</Button>
        </FormItem>
      </div>
      <!--关联权限-->
      <div>
        <p class="subtitle inline-box">{{$t("businessFunctionManage.text.authority")}}</p>
        <Button type="ghost" icon="plus" @click="onAddSubSystem"></Button>
      </div>
      <div>
        <Collapse v-model="collapse" accordion v-if="collapseData.length">
          <Panel :name="item.name" v-for="(item, index) in collapseData" :key="item.id">
            {{item.name}}
            <p slot="content">
              <!-- v-if="collapseData.length"重新渲染组件 -->
              <tree-check-box v-if="collapseData.length" 
                              :data="item.moduleList"
                              @onCheckGroup="onCheckGroup"
                              @oncheckAllGroup="oncheckAllGroup"
                              @onCancelcheckAllGroup="onCancelcheckAllGroup">
              </tree-check-box>
            </p>
          </Panel>
        </Collapse>
      </div>
      </br>
      <FormItem>
        <Button type="primary" @click="onSave" :loading="btnLoading">{{$t("common.form.btn.confirm")}}</Button>
        <Button type="ghost" @click="$router.push({name: 'business-function-manage'})">{{$t("common.form.btn.cancel")}}</Button>
       </FormItem>
    </Form>

    <!--图标弹框-->
    <icon-modal v-model="iconModalShow"
                @onChange="selectIconFun"
                @onCancel="iconModalShow =false">
    </icon-modal>

    <!--选择关联角色弹框-->
    <subsystem-modal v-model="subsystemTable.subsystemModalShow"
                     @onCancel="subsystemTable.subsystemModalShow =false"
                     @onSave="onSelectedSubSystem">
    </subsystem-modal>

  </div>
</template>
<script>
/**
 *  业务功能新增页面
 */
import {
  fetchFrontSystem,
  fetchBusinessFunctionAllTree,
  fetchSubSystemModule,
  saveBusinessFunction
} from "@/api/admin/application-manage/business-function-manage/index";
import TreeCheckBox from "@/views/admin/application-manage/business-function-manage/components/TreeCheckBox";
import IconModal from "./components/IconModal";
import SubsystemModal from "./components/SubsystemModal";

export default {
  name: "CreateBusinessFunction",

  components: { IconModal, TreeCheckBox, SubsystemModal },

  mixins: [],

  data() {
    // 异步提示信息会总是提示错误
    const sidRule = (rule, value, callback) => {
      if (value === "") {
        callback(
          new Error(
            this.$t("businessFunctionManage.rules.businessFunctionSystem")
          )
        );
      } else {
        callback();
      }
    };
    return {
      form: {
        // id: null,
        parentIds: [], //上级功能(不用提交的参数)
        code: "", //业务功能编码
        name: "", //业务功能名称
        enName: "", //业务功能英文名
        type: "", //功能类型
        sid: "", //前端系统
        uri: "", //URL地址
        icon: "", //菜单图标
        sort: "", //排序值
        subsystemIdList: [] //子系统
      },
      rules: {
        code: [
          {
            required: true,
            trigger: "blur",
            message: this.$t(
              "businessFunctionManage.rules.businessFunctionCode"
            )
          }
        ],
        name: [
          {
            required: true,
            trigger: "blur",
            message: this.$t(
              "businessFunctionManage.rules.businessFunctionName"
            )
          }
        ],
        type: [
          {
            required: true,
            trigger: "change",
            message: this.$t(
              "businessFunctionManage.rules.businessFunctionType"
            )
          }
        ],
        sid: [{ required: true, trigger: "change", validator: sidRule }],
        sort: [
          {
            required: true,
            trigger: "blur",
            message: this.$t(
              "businessFunctionManage.rules.businessFunctionSort"
            )
          }
        ],
        enName:[{required:true,trigger: "blur",message: this.$t("businessFunctionManage.rules.enName")}]
      },
      frontSystemOptions: [], // 前端系统下拉框
      functionOptions: [], //上级功能
      // 功能类型下拉框
      typeOptions: [
        {
          label: this.$t("businessFunctionManage.form.label.control"),
          value: "control"
        },
        {
          label: this.$t("businessFunctionManage.form.label.menu"),
          value: "menu"
        }
      ],
      iconModalShow: false, //菜单图标弹出框显示标志

      // 子系统弹框
      subsystemTable: {
        subsystemModalShow: false,
        ids: []
      },

      collapse: "1",
      collapseData: [], //折叠数据
      tempTreeObj: {}, // 临时遍历,获取 树 打钩的数据
      tempParent: { parentId: "", parentName: "" }, //临时变量, 存上级功能
      btnLoading: false, // 确定按钮loading
      selection: [],
      parentSelect: [] //上级功能选中集合
    };
  },

  created() {
    this.loadFrontSystemData();
    this.loadFunctionOptions();
  },

  methods: {
    /**
     * 获取前端系统下拉框数据
     */
    loadFrontSystemData() {
      fetchFrontSystem().then(res => {
        if (res.data) {
          this.frontSystemOptions = res.data;
        }
      });
    },
    /**
     * 获取上级功能下拉框数据
     */
    loadFunctionOptions() {
      fetchBusinessFunctionAllTree({ type: "menu" }).then(res => {
        this.functionOptions = this.traverseData(res.data);
      });
    },
    /**
     * 遍历数组,获取自己想要的格式
     * @param dataArray
     * @returns {*}
     */
    traverseData(dataArray) {
      if (!dataArray) return [];
      let result = dataArray.map(item => ({
        value: item.id,
        label: item.name,
        children: this.traverseData(item.child)
      }));
      return result;
    },
    /**
     * 菜单图标弹出框选中图标函数
     * @param name
     */
    selectIconFun(name) {
      this.form.icon = name;
      this.iconModalShow = false;
    },

    /**
     * 点击 "增加子系统" 按钮触发函数
     */
    onAddSubSystem() {
      // this.loadSubSystemData();
      this.subsystemTable.subsystemModalShow = true;
    },

    /**
     * 选择子系统 - 确定按钮
     */
    onSelectedSubSystem(selection) {
      let status = "";
      fetchSubSystemModule(selection).then(res => {
        if (res.data && res.data.length > 0) {
          this.collapseData.push(
            ...res.data.map(item => {
              return item;
            })
          );
          status = "success";
        } else {
          status = "faild";
        }
        this.$bus.emit("on-parent-success", status, selection);
      });
    },

    /**
     * 折叠 - checKboxh函数
     */
    onCheckGroup(item) {
      this.collapseData.forEach((tree, i) => {
        tree.moduleList.forEach((module, k) => {
          if (module.name == item.name) {
            this.$set(
              this.collapseData[i]["moduleList"][k],
              "checkGroup",
              item.checkGroup
            );
          }
        });
      });
    },
    // 全选
    oncheckAllGroup(item) {
      if (item.functionList.length) {
        item.functionList.map(f => {
          item.checkGroup.push(f.id);
        });
      }
    },
    // 全不选
    onCancelcheckAllGroup(item) {
      item.checkGroup = [];
    },
    /**
     * 功能类型 - 为控件时,不显示排序值和菜单图标
     */
    onTypeChange(type) {
      if (type == "control") {
        this.form.sort = null;
        this.form.icon = null;
      }
    },
    /**
     * 上级功能触发函数
     */
    onParentChange(value, selectedData) {
      if (!value||value.length==0) {
        this.form.parentIds = [];
        this.tempParent.parentId = "";
        this.tempParent.parentName = "";
        this.parentSelect =[];
      } else {
        if (selectedData.length && selectedData.length > 0) {
          let length = selectedData.length;
          this.parentSelect = selectedData;
          this.tempParent.parentId = selectedData[length - 1].value;
          this.tempParent.parentName = selectedData[length - 1].label;
        }
      }
    },
    /**
     * 确定 - 保存
     */
    onSave() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 上级功能
          if (!this.tempParent.parentId) {
            this.form.parentId = null;
            this.form.parentName = "";
          } else {
            if (this.parentSelect.length === 1) {
              this.$Message.error(
                this.$t("businessFunctionManage.rules.superior")
              );
              return;
            }
            this.form.parentId = this.tempParent.parentId;
            this.form.parentName = this.tempParent.parentName;
          }
          if (!(Math.round(this.form.sort) === Number(this.form.sort))) {
            this.$Message.error(
              this.$t("businessFunctionManage.rules.onlyInteger")
            );
            return;
          }
          this.form.subsystemIdList = []; //重复点击初始化
          // 关联子系统数据遍历
          this.collapseData.forEach(item => {
            item.moduleList.forEach(a => {
              if (a.checkGroup) {
                this.form.subsystemIdList.push(...a.checkGroup);
              }
            });
          });
          this.btnLoading = true;
          saveBusinessFunction(this.form)
            .then(res => {
              this.$Message.success(this.$t("productManage.others.success"));
              this.btnLoading = false;
              setTimeout(() => {
                this.$router.push({ name: "business-function-manage" });
              }, 500);
            })
            .catch(err => {
              this.btnLoading = false;
              this.$Message.error(err.message);
            });
        }
      });
    }
  }
};
</script>

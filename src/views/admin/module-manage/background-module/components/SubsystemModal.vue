<template>
  <div class="module_modal">
    <Modal v-model="visble" width="560" @on-cancel="onCancel" :mask-closable="false">
      <p slot="header" v-if="type == 'create'">{{createText}}</p>
      <p slot="header" v-if="type == 'edit'">{{editText}}</p>
      <div>
        <Form ref="form" :model="form" :label-width="100" :rules="rules">
          <FormItem prop="name" :label="$t('moduleManage.form.label.subsystemName')">
            <Input v-model="form.name" :maxlength="64"/>
          </FormItem>

          <FormItem prop="platform" :label="$t('moduleManage.form.label.technology')">
            <Select v-model="form.platform" style="width:200px">
              <Option v-for="item in platformOption" :value="item.code" :key="item.code">{{ item.name }}</Option>
            </Select>
          </FormItem>

          <FormItem prop="secret" :label="$t('moduleManage.form.label.securityCode')">
            <Input v-model="form.secret" :maxlength="128"/>
          </FormItem>

          <FormItem prop="description" :label="$t('moduleManage.form.label.description')">
            <Input v-model="form.description" :maxlength="128"/>
          </FormItem>

        </Form>
      </div>
      <p slot="footer">
        <Button type="ghost" @click="onCancel">{{$t("common.form.btn.cancel")}}</Button>
        <Button type="primary" @click="onSave">{{$t("common.modal.save")}}</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
  /**
   *  子系统模态框
   */
  import { getPlatform, saveOrUpdateSubSystem, getSubSystemDetail } from "@/api/admin/module-manage/background-module"
  export default {
    name: "SubsystemModal",

    props: {
      type: {
        validator: function (value) {
          // create显示新增文案,edit显示编辑文案
          return ['create', 'edit'].indexOf(value) !== -1
        }
      },
      value: {
        type: Boolean,
        default:false
      },
    },

    data() {
      // 直接"name"方式规则提示信息会总是提示错误
      const sidRule = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t("moduleManage.rules.subsystem")));
        } else {
          callback();
        }
      };
      return {
        createText: this.$t("moduleManage.text.createSystem"),
        editText: this.$t("moduleManage.text.editSystem"),
        visble: this.value,
        form: {
          name:"",
          platform:"",
          secret:"",
          description:""
        },
        platformOption:[],

        rules: {
          name: [{ required: true, trigger: 'blur', message: this.$t("moduleManage.rules.systemName")}],
          platform: [{ required: true, trigger: 'change', message: this.$t("moduleManage.rules.platform")}],
          secret: [{ required: true, trigger: 'blur', message: this.$t("moduleManage.rules.secretCode")}],
        },

      }
    },

    watch: {
      value (val){
        this.visble = val;
      },
    },

    created() {
      this.getPlatform();
    },

    methods: {
      /**
       * 加载 "技术" 下拉框数据
       */
      getPlatform(){
        getPlatform("platform").then(res => {
          this.platformOption = res.data
        })
      },
      /**
       * 编辑,根据ID获取详情
       */
      getDetail(id){
        getSubSystemDetail(id).then(res=>{
          this.form = res.data;
        }).catch(err=>{
          this.$Message.error(err.message);
        })
      },
      /**
       * 添加/编辑数据
       */
      onSave(){
        this.$refs["form"].validate((valid) => {
          if (valid) {
            saveOrUpdateSubSystem(this.form).then(res => {
              if(this.form.id){
                this.$Message.success(this.$t("common.modal.editSuccess"));
              }else{
                this.$Message.success(this.$t("common.modal.createSuccess"));
              }

              this.$refs["form"].resetFields();
              this.$emit("onCancel");
              this.$emit("onSuccess");//添加成功,重新加载table数据
            }).catch(err => {
              this.$Message.error(err.message);
            })
          }
        })
      },
      /***
       * 右上角关闭按钮
       */
      onCancel() {
        this.$refs["form"].resetFields();
        this.$emit("onCancel")
      }
    }
  }
</script>


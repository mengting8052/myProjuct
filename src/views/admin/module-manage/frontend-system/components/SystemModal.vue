<template>
  <div class="system_modal">
    <Modal v-model="visble" width="560" @on-cancel="onCancel" :mask-closable="false">
      <p slot="header" v-if="type == 'create'">{{createText}}</p>
      <p slot="header" v-if="type == 'edit'">{{editText}}</p>
      <div>
        <Form ref="form" :model="form" :label-width="100" :rules="rules">

          <FormItem prop="name" :label="$t('moduleManage.form.label.systemName')">
            <Input v-model="form.name" :maxlength="64"/>
          </FormItem>

          <FormItem prop="url" :label="$t('moduleManage.form.label.urlAddress')">
            <Input v-model="form.url" :maxlength="128"/>
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
   *  新增/ 编辑  前端系统
   */
  import { saveOrEditFrontSystem, getFrontSystemDetail } from "@/api/admin/module-manage/frontend-system"
  export default {
    name: "SystemModal",

    props: {
      type: {
        validator: function (value) {
          // 这个值必须匹配下列字符串中的一个,create显示新增文案,edit显示编辑文案
          return ['create', 'edit'].indexOf(value) !== -1
        }
      },
      value: {
        type: Boolean,
        default:false
      },
    },

    data() {
      return {
        visble: this.value,
        createText: this.$t("moduleManage.text.createText"),
        editText: this.$t("moduleManage.text.editText"),
        form:{
          name: "",
          url: ""
        },
        rules: {
          name: [{ required: true, trigger: 'blur', message: this.$t("moduleManage.rules.name") }],
          url: [{ required: true,trigger: 'blur', message: this.$t("moduleManage.rules.url")}],
        }
      }
    },

    computed: {},

    watch: {
      value (val){
        this.visble = val;
      },
    },

    created() {},

    methods: {
      /**
       * 编辑,根据ID获取详情
       */
      getDetail(id){
        getFrontSystemDetail({id: id}).then(res=>{
          this.form.id = res.data.id
          this.form.name = res.data.name
          this.form.url = res.data.url
        })
      },
      /**
       * 添加/编辑 前端系统
       */
      onSave() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            saveOrEditFrontSystem(this.form).then(res => {
              if(this.form.id) {
                this.$Message.success(this.$t("common.modal.editSuccess"));
              }else{
                this.$Message.success(this.$t("common.modal.createSuccess"));
              }

              this.$refs["form"].resetFields();
              this.visble = false;
              this.onCancel();
              this.$emit("onSuccess")
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

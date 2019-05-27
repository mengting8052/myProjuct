<template>
  <Form :model="form.data" ref="addForm" :rules="form.rules" :label-width="100">
      <FormItem :label="$t('userManage.form.label.userName')" prop="userName">
          <Input v-model="form.data.userName" :maxlength="128"></Input>
      </FormItem>
      <FormItem :label="$t('userManage.form.label.password')" prop="password">
          <Input v-model="form.data.password" :maxlength="64"></Input>
      </FormItem>
      <FormItem :label="$t('userManage.form.label.name')" prop="name">
          <Input v-model="form.data.name" :maxlength="128"></Input>
      </FormItem>
      <FormItem  prop="roleIds">
          <h3 style="marginLeft:-60px">{{$t("userManage.form.label.relevanceRole")}}</h3>
             <Checkbox v-model="checkAll"  @on-change="checkBoxAllChange">
                {{$t("userManage.form.label.checkAll")}}
            </Checkbox>
              <CheckboxGroup v-model="form.data.roleIds" @on-change="checkBoxGroupChange">
                <Row>
                    <Col :md="8" :lg="4" v-for="role in roleList" :key="role.id">
                        <Checkbox :label="role.id" :key="role.id">
                            {{role.name}}
                        </Checkbox>
                    </Col>
                </Row>
            </CheckboxGroup>
      </FormItem>
      <FormItem>
          <Button type="primary" @click="confirm()" :loading="btnLoading">{{$t("userManage.btns.save")}}</Button>
          <Button type="ghost" @click="$router.push({ name: 'user-list' })">{{$t("userManage.btns.cancel")}}</Button>
      </FormItem>
  </Form>
</template>

<script>
import {queryRoleList} from "@/api/tenant/roleManage"
import {add} from "@/api/admin/user-manage"

import {mapGetters} from "vuex"

import md5 from "js-md5";

export default {
    name:"addForm",

    data(){
      return{
        form:{
            data:{
              userName:"",
              password:"",
              name:"",
              roleIds:[],
              system:false
            },
            
            rules:{
                userName:[{required:true,message:this.$t("userManage.form.rules.userName"),trigger: 'blur'}],
                password:[{required:true,message:this.$t("userManage.form.rules.password"),trigger: 'blur'}],
            }
        },
        roleList:[],//角色列表集合
       
        checkAll:false,//控制全选状态
      
        btnLoading: false,
      }
    },
    created(){
        // 获取角色列表
        queryRoleList({uid:null}).then(res=>{
            this.roleList=res.data;
        })
    },

    computed:{
        ...mapGetters(["user"])
    },

    methods:{
        confirm(){
           this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        this.btnLoading = true
                        //密码加密
                        // system 1 平台用户 0 商户
                        this.form.data.system= this.user.isTenant?false:true
                        const params =Object.assign({},this.form.data,{password:md5(this.form.data.password)});
                        add(params).then(res=>{
                            this.$Message.success(this.$t("userManage.others.success"));
                            this.$router.push({ name: 'user-list' })
                            }).catch(err=>{
                            this.btnLoading = false
                            this.$Message.error(err.message);
                        })
                    }
             })
        },
        
        checkBoxAllChange(val){
            if(val) {
                this.form.data.roleIds = this.roleList.map(item => item.id)
            } else {
                this.form.data.roleIds = []
            }
        },

        checkBoxGroupChange(arr){
            if(arr.length === this.roleList.length) {
                this.checkAll = true
            } else {
                this.checkAll = false
            }
        }
    } 
}
</script>

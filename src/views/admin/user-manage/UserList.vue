<template>
  <layout-list>
    <template slot="form">
       <Form inline :label-width="100" ref="searchForm" :model="form">
        <FormItem :label="$t('userManage.table.system')" prop="system">
          <Select v-model="form.system">
              <Option v-for="item in userTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('userManage.table.tenantName')" prop="tenantName">
          <Input type="text" v-model="form.tenantName"></Input>
        </FormItem>
        <FormItem :label="$t('userManage.table.userName')" prop="userName">
          <Input type="text" v-model="form.userName"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData(true)">{{$t("userManage.btns.search")}}</Button>
          <Button type="ghost" @click="resetForm()">{{$t("userManage.btns.reset")}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="tool-left">
       <Button type="primary" @click="$router.push({name:'user-add'})">{{$t("userManage.btns.create")}}</Button>
    </template>

    <template slot="table">
       <Table border :loading="table.loading" :data="table.data" :columns="table.columns" :height="$_layout.tableHeight"></Table>
    </template>

    <template slot="page">
      <pagination :pagination="pagination" @on-page-change="loadData()" @on-page-size-change="loadData(true)"></pagination>
    </template>

    <password v-model="passwordModal" :user-id="user.id" :password="user.password" @on-success="success"></password>
  </layout-list>
</template>
<script>
  import { LayoutList } from "@/components/layout"
  import Pagination from "@/components/pagination"
  import Password from "@/components/password"
  import {getUserList,resetPassword} from "@/api/admin/user-manage"
  import { PAGE_PARAMS } from "@/utils/constants"
  import { Mixin_LayoutList} from "@/mixins"

  export default {
    name: "UserList",

    components: {LayoutList,Pagination, Password},

    mixins: [Mixin_LayoutList],

    data() {
      return {
        passwordModal: false,

        user: {id: "", password: ""},

        form: {
            system:"",
            tenantName:"",
            userName:""
        },

        table: {
          loading:false,
          data:[],
          columns:[
             {
                type: "index",
                width: 60,
                align: "center"
              },
              {
               renderHeader:h=>{
                 return h('span',this.$t("userManage.table.userName"))
               },
                key:"userName"
              },{
                renderHeader:h=>{
                 return h('span',this.$t("userManage.table.name"))
               },
                key:"name"
              },{
               renderHeader:h=>{
                 return h('span',this.$t("userManage.table.system"))
               },
                key:"system",
                render:(h,params)=>{
                  return h('span',params.row.system===0?this.$t("userManage.table.tenantName"):this.$t("userManage.table.admin"))
                }
              },
              {
                renderHeader:h=>{
                 return h('span',this.$t("userManage.table.tenantName"))
               },
                key:"tenantName"
              },
              {
                renderHeader:h=>{
                 return h('span',this.$t("userManage.table.operate"))
               },
                key: "CURD",
                render:(h,params)=>{
                  const resetBtn=h('Button',{
                    props:{
                      type:"text",
                    },
                    class:"warning-btn",
                    on:{
                      click:()=>{
                        this.user.id = params.row.id
                        this.user.password = params.row.password
                        this.$nextTick(() => {
                          this.passwordModal = !this.passwordModal
                        })
                          // this.$Modal.confirm({
                          //   title:this.$t("common.modal.title"),
                          //   content:this.$t("userManage.others.content"),
                          //   onOk: () => {
                          //        resetPassword({ id: params.row.id }).then(() => {
                          //           this.$Message.success(this.$t("userManage.others.reset"));
                          //       }).catch(err=>{
                          //           this.$Message.error(err.message)
                          //       })
                          //    }
                          // })
                      }
                    }
                  },this.$t("userManage.btns.resetPassword"));
                  const roleAllotBtn=h('Button',{
                    props:{
                      type:'text'
                    },
                    class:"edit-btn",
                    on:{
                      click:()=>{
                           this.$router.push({
                              name: "relevance-role",
                              query: { id: params.row.id }
                            });
                      }
                    }
                  },this.$t("userManage.btns.relevanceRole"));

                  const  editBtn=h('Button',{
                    props:{
                      type:"text"
                    },
                    class:"edit-btn",
                    on:{
                      click:()=>{
                         this.$router.push({
                            name: "user-edit",
                            query: { id: params.row.id }
                          });
                      }
                    }
                  },this.$t("userManage.btns.edit"));
                  return h("div",[resetBtn,roleAllotBtn,editBtn])
                }
              }
          ],
        },

        userTypes: [
          { value: 1, label: this.$t("userManage.userTypes.admin") },
          { value: 0, label: this.$t("userManage.userTypes.tenant") }
        ],
            
        pagination:Object.assign({},PAGE_PARAMS),
      }
    },

    created() {
      this.loadData()
    },

    methods: {
      loadData(reload=false){
        this.table.loading=true;
        reload&&(this.pagination.pageNum =1);
        getUserList(this.pagination,this.form).then(res=>
        {
          if(res.data!=null){
            this.table.data=res.data.list;
          }else{
            this.table.data=[]
          }
          
          this.pagination.total=res.data.total;
          this.$nextTick(()=>{
            this.table.loading=false;
          })  
        }).catch(err=>{this.table.loading=false})
      },

      resetForm(){
        this.$refs["searchForm"].resetFields();
      },

      success() {
        this.loadData()
      }
    }
  }
</script>
<style lang="less" scoped>

</style>

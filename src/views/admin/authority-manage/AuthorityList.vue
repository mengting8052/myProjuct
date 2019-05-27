<template>
  <layout-list>
    <template slot="form">
       <Form inline :label-width="100" ref="searchForm" :model="form">
        <FormItem :label="$t('authorityManage.table.moduleName')" prop="mid">
            <Select v-model="form.mid"  ref="midSelect" filterable  clearable>
              <Option v-for="item in moduleList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="loadData(true)">{{$t('authorityManage.btns.search')}}</Button>
          <Button type="ghost" @click="resetForm()">{{$t('authorityManage.btns.reset')}}</Button>
        </FormItem>
      </Form>
    </template>

    <template slot="tool-left">
       <Button type="primary" @click="$router.push({name:'authority-add'})">{{$t('authorityManage.btns.create')}}</Button>
    </template>

    <template slot="table">
       <Table border :loading="table.loading" :data="table.data" :columns="table.columns" :height="$_layout.tableHeight"></Table>
    </template>

    <template slot="page">
      <pagination :pagination="pagination" @on-page-change="loadData()" @on-page-size-change="loadData(true)"></pagination>
    </template>
  </layout-list>
</template>
<script>
  import { LayoutList } from "@/components/layout"
  import Pagination from "@/components/pagination"

  import {getAuthorityList,del} from "@/api/admin/authorityList"
  import {queryModuleList} from "@/api/admin/module-manage/background-module"

  import { PAGE_PARAMS } from "@/utils/constants"
  import { Mixin_LayoutList} from "@/mixins"

  export default {
    name: "AuthorityList",

    components: {LayoutList,Pagination},

    mixins: [Mixin_LayoutList],

    data() {
      return {
        form: {
            mid:"",
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
                  return h('span',this.$t("authorityManage.table.code"))
                },
                key:"code"
              },{
               renderHeader:h=>{
                  return h('span',this.$t("authorityManage.table.name"))
                },
                key:"name"
              },
              {
                renderHeader:h=>{
                  return h('span',this.$t("authorityManage.table.moduleName"))
                },
                key:"moduleName"
              },
              {
                renderHeader:h=>{
                  return h('span',this.$t("authorityManage.table.operate"))
                },
                key: "CURD",
                render:(h,params)=>{
                   const  editBtn=h('Button',{
                    props:{
                      type:"text"
                    },
                    class:"edit-btn",
                    on:{
                      click:()=>{
                         this.$router.push({
                            name: "authority-edit",
                            query: { id: params.row.id }
                          });
                      }
                    }
                  },this.$t("authorityManage.btns.edit"));
                  const removeBtn=h('Button',{
                    props:{
                      type:"text",
                    },
                    class:"remove-btn",
                    on:{
                      click:()=>{
                          this.$Modal.confirm({
                            title:this.$t("common.modal.title"),
                            content:this.$t("common.modal.contentDel"),
                            onOk: () => {
                                 del( params.row.id ).then(() => {
                                    this.$Message.success(this.$t("authorityManage.others.success"));
                                    this.loadData();
                                }).catch(err=>{
                                    this.$Message.error(err.message)
                                })
                             }
                          })
                        }
                    }
                  },this.$t("authorityManage.btns.remove"));
                 
                  return h("div",[editBtn,removeBtn])
                }
              }
          ],
        },

        moduleList:[],

        pagination:Object.assign({},PAGE_PARAMS),
      }
    },

    watch:{
      "form.mid":{
        handler:"resetMid"
      }
    },

    created() {
        queryModuleList({}).then(res=>{
          this.moduleList=res.data;
        })
        this.loadData()
      },

    methods: {
      resetMid(mid){
        if(mid===undefined){
          this.form.mis="";
          this.$refs["midSelect"].setQuery(null);
          this.$refs["midSelect"].clearSingleSelect();
        }
      },

      loadData(reload=false){
        this.table.loading=true;
        reload&&(this.pagination.pageNum =1);
        getAuthorityList(this.pagination,this.form).then(res=>
        {
          this.table.data=res.data.list;
          this.pagination.total=res.data.total;
          this.$nextTick(()=>{
            this.table.loading=false;
          })  
        }).catch(err=>{this.table.loading=false})
      },

      resetForm(){
         this.form.mid="";
         this.$refs["midSelect"].setQuery(null);
         this.$refs["midSelect"].clearSingleSelect();
      }
    }
  }
</script>
<style lang="less" scoped>

</style>

<template>
  <Tree :data="organizationData" @on-select-change="nodeChange" :style="{maxHeight:'521px',overflowY:'auto'}"></Tree>
</template>
<script>
import {getOrganAll} from '@/api/tenant/organization'
import {mapGetters} from "vuex"
export default {

  data(){
    return{
      organizationData:[],
    }
  },

  computed:{
    ...mapGetters(['user'])
  },

  created(){
    this.getOrganData();
  },
  methods:{
    getOrganData(){
        getOrganAll(this.user.tenantId).then(res=>{
        var result= res.data.map(item=>{
           return this.convertData(item,[item.id])
             
      })
      this.organizationData=result
     })
   
    },
    convertData(orgin, parentIds){
        var orginParentIds=parentIds.length>0?parentIds.slice(0,parentIds.length-1):[];
        // 子节点没有数据 只显示根节点
       if(!orgin.childTenantOrgan || orgin.childTenantOrgan.length == 0){
         return {
                value: orgin.id,
                title: orgin.name,
                code: orgin.code,
                isLeaf: 'leaf',
                parentId: orgin.parentId,
                parentIds: orginParentIds,
                adminEmployeeId: orgin.adminEmployeeId,
                adminEmployeeName: orgin.adminEmployeeName,
                level: orgin.level,
                type:orgin.type
         }
        }else{
          var childrens = orgin.childTenantOrgan.map(item => {
                return this.convertData(item, parentIds.concat(item.id));
            });
            return {
                value: orgin.id,
                title: orgin.name,
                code: orgin.code,
                parentIds: orginParentIds,
                parentId: orgin.parentId,
                adminEmployeeId: orgin.adminEmployeeId,
                adminEmployeeName: orgin.adminEmployeeName,
                level: orgin.level,
                children: childrens,
                type:orgin.type
            };
        }
    },
    nodeChange(val){
     this.$emit('handleNodeChange',val);
     
    }
  }
}
</script>




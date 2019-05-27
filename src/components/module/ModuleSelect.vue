<template>
    <Select v-model="selected" filterable >
          <Option v-for="item in data" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
</template>
<script>
import {queryModuleList} from "@/api/admin/module-manage/background-module"
export default {
    name:"ModelSelect",

    props:{
      value:{
        type:[String,Number],
        default:""
      }
    },
    data(){
      return {
        data:[],
        selected:this.value
      }
    },

    watch:{
      value(val){
        this.selected=val;
      },

      selected(val){
        this.$emit('input',val);
        const match=this.data.filter(item=>item.id===val);
        if(match.length>0){
           this.$emit('post-selectNode', match[0]);
        }
      }
    },

    created(){
       queryModuleList({}).then(res=>{
          this.data=res.data;
        })
    },

}
</script>

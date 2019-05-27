<template>
  <div>
    <Button type="primary" @click="syncRedis" :loading="btnloading"> {{$t("common.Redis")}}</Button>
    </div>
</template>
<script>
import {refreshRedis} from "@/api/auth"
export default {
    data(){
        return {
          btnloading:false
        }
    },

    methods:{

      syncRedis(){
        this.btnloading=true;
        refreshRedis().then(response=>{
            this.$Message.success(response.message)
            this.btnloading=false;
        }).catch(error=>{
            this.btnloading=false;
        })
      }
    }
}
</script>


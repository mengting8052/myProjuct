<template>
  <div>
    角色列表
  </div>
</template>
<script>
  /**
   *  权限列表
   */
  export default {
    name: "RoleList",

    components: {},

    directives: {},

    filters: {},

    extends: {},

    mixins: [],

    // Prop 声明, 始终使用 camelCase
    // 若有多个 Prop, 请按字母将其排序
    // g -> i -> l -> v
    props: {
      // greetingText: String,
      //
      // icon: String
      //
      // label: String,
      //
      // value: {
      //   type: String,
      //   required: true
      // }
    },

    data() {
      return {
        form: {},

        table: {},

        pagination: {},
      }
    },

    computed: {},

    watch: {},

    // 生命周期钩子函数

    created() {},

    mounted() {},

    // ...

    methods: {}
  }
</script>
<style lang="less" scoped>

</style>

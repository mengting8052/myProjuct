/**
 * 
 * 提取了 OrgTree.vue、OrgCascader.vue 中的公共属性
 * 
 * props.orgs: 从服务端获取到的数据源
 * 
 * data: 用以提供给 Tree、Cascader 组件的数据源
 * 
 */

const orgs = {
  props: {
    orgs: Array
  },

  data() {
    return {
      data: []
    }
  },

  watch: {
    orgs() {
      this.updateData()
    }
  },

  created() {
    this.updateData()
  },

  methods: {
    updateData() {
      this.data = this.orgs
    }
  }
}

export default orgs
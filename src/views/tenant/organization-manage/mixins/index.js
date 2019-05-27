import { Mixin_LayoutList } from "@/mixins"

const mixin = {
  mixins: [Mixin_LayoutList],

  methods: {
    updateTableHeight() {
      const minHeight = 450
      const clientHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      const header= this.getElHeight(".gvt-header")
      const toolHeight = this.getElHeight(".orgnaizationManage_header")
      // .gvt-content padding top & bottom => 10px * 2
      // .main        padding top & bottom => 10px * 2
      // .orgnaizationManage_body margin top => 10px
      let tableHeight = clientHeight - header - toolHeight - 10*2 - 10*2 - 10
      this.doNotUse = tableHeight > minHeight ? tableHeight : minHeight
    }
  }
}

export default mixin
<template>
  <div class="AppDetailItem">
    <div v-if="data.child.length">
      <strong>{{ data.name }}</strong>
      <br>
      <Checkbox :value="data._checkAll" @click.prevent.native="checkOrUnCheckAll(false)">{{$t("userManage.form.label.checkAll")}}</Checkbox>
    </div>
    <div v-else>
      <Checkbox :value="data._checkAll" @click.prevent.native="checkOrUnCheckAll(false)">
        <strong>{{ data.name }}</strong>
      </Checkbox>
    </div>
    <CheckboxGroup v-model="checkGroup" @on-change="checkGroupChange">
      <Row>
        <Col :md="8" :lg="4" v-for="child in data.child" :key="child.id">
          <Checkbox :label="child.id">{{ child.name }}</Checkbox>
        </Col>
      </Row>
    </CheckboxGroup>
  </div>
</template>

<script>
export default {
  name: "AppDetailItem",

  props: {
    bisFunctionList: {
      type: Object,
      default: () => ({ id: "", code: "", name: "", child: [] })
    },
    checkeds: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      data: Object.assign({}, this.bisFunctionList, { _checkAll: false }),
      checkGroup: []
    };
  },

  watch: {
    checkeds: {
      immediate: true,
      handler() {
        this.initCheckGroup()
      }
    }
  },

  methods: {
    initCheckGroup() {
      if(this.checkeds.length) {
        if(this.data.child && this.data.child.length) {
          const source = this.data.child.map(item => item.id)
          this.checkGroup = this.checkeds.filter(item => source.indexOf(item) > -1)
          if(this.checkGroup.length === this.data.child.length) {
            this.data._checkAll = true
          }
        } else {
          const found = this.checkeds.find(item => item == this.data.id)
          found && (this.data._checkAll = true)
        }
        this.$emit("on-check-all-change", this.data._checkAll)
      }
    },

    checkOrUnCheckAll(leading = false) {
      if(leading) {
        this.data._checkAll = leading
      } else {
        this.data._checkAll = !this.data._checkAll;
        this.$emit("on-check-all-change", this.data._checkAll)
      }
      this.checkGroup = this.data._checkAll
        ? this.data.child.map(item => item.id)
        : [];
    },

    checkGroupChange(checkeds) {
      this.data._checkAll = checkeds.length === this.data.child.length;
      this.$emit("on-check-all-change", this.data._checkAll)
    },

    getData() {
      let result = {
        bisFuncIdList: [],
        bisFuncCodeList: []
      };

      if (this.checkGroup.length) {
        result.bisFuncIdList = this.checkGroup.map(item => item);
        let bisFuncCodeList = [];
        this.data.child.map(item => {
          this.checkGroup.find(
            i => i == item.id && bisFuncCodeList.push(item.code)
          );
        });
        result.bisFuncCodeList = bisFuncCodeList;

        result.bisFuncIdList.push(this.data.id);
        result.bisFuncCodeList.push(this.data.code);
      } else {
        if (this.data._checkAll) {
          result.bisFuncIdList = [this.data.id];
          result.bisFuncCodeList = [this.data.code];
        }
      }

      return result;
    }
  }
};
</script>

<style lang="less">
.AppDetailItem {
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}
</style>



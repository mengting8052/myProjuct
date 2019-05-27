<template>
  <div>
    <CheckboxGroup v-model="value" @on-change="change">
      <Row>
        <Col :md="8" :lg="4" v-for="item in data" :key="item.id">
          <Checkbox :label="item.id">{{ item.name }}</Checkbox>
        </Col>
      </Row>
    </CheckboxGroup>
  </div>
</template>

<script>
import { queryBymerchantId } from "@/api/tenant/app";

import { mapGetters } from "vuex";

export default {
  name: "AppCheckBoxGroup",

  props: {
    appIds: Array
  },

  data() {
    return {
      data: [],
      value: this.appIds
    };
  },

  computed: {
    ...mapGetters(["user"])
  },

  watch: {
    appIds(val) {
      this.value = JSON.parse(JSON.stringify(val));
    }
  },

  created() {
    this.loadData();
  },

  methods: {
    loadData() {
      queryBymerchantId(this.user.tenantId).then(response => {
        this.data = response.data;
      });
    },

    change(appIds) {
      this.$emit("on-change", JSON.parse(JSON.stringify(appIds)));
    }
  }
};
</script>


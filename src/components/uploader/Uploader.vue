<template>
  <div class="Uploader">
    <ul>
      <li>
        <input
          type="file"
          @change="fileChange"
          style="display: none;"
          accept="image/jpg, image/jpeg, image/png"
          ref="file" />
        <img :src="url" :alt="name" @click="btnClick" v-if="url" />
        <div class="uploader-btn" @click="btnClick" v-else>
          <Icon type="plus-round"></Icon>
        </div>
      </li>
      <li>
        <div class="uploader-footer">
          <slot name="footer"></slot>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import html5ImageCompress from "html5-image-compress";

export default {
  name: "Uploader",

  props: {
    value: String,
    maxHeight: {
      type: Number,
      default: 1000,
      validator(val) {
        return val > 0;
      }
    },
    maxWidth: {
      type: Number,
      default: 1000,
      validator(val) {
        return val > 0;
      }
    }
  },

  data() {
    return {
      url: this.value,
      name: ""
    };
  },

  watch: {
    value(val) {
      this.url = val;
    },

    url(val) {
      this.$emit("input", val);
    }
  },

  methods: {
    btnClick() {
      this.$refs["file"].click();
    },

    fileChange() {
      let vm = this;
      let files = vm.$refs["file"].files;
      new html5ImageCompress(files[0], {
        maxWidth: this.maxWidth,
        maxHeight: this.maxHeight,
        before: file => {},

        complete: file => {},

        done: (file, base64) => {
          vm.url = base64;
          vm.name = file.name;
          vm.$refs["file"].value = "";
          file = null;
          vm.$emit("on-uploader-done", base64);
        },

        fail: file => {
          vm.$emit("on-uploader-fail", file);
        },

        notSupport: file => {
          vm.$emit("on-uploader-not-support", file);
        }
      });
    }
  }
};
</script>

<style lang="less">
.Uploader {
  ul li {
  float: left;
}
  img,
  .uploader-btn {
    width: 60px;
    height: 60px;
    line-height: 60px;
    border: 1px dashed #d9d9d9;
    display: block;
    cursor: pointer;
    &:hover {
      border-color: #2d8cf0;
      color: #2d8cf0;
    }
  }
  .uploader-btn {
    color: #8c939d;
    text-align: center;
    font-size: 28px;
  }
}
.uploader-footer {
  margin: 0 10px;
}
</style>


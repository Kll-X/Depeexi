<template>
  <div style="width:100%;">
    <el-radio-group v-model="activeName" style="margin-bottom: 10px;">
      <el-radio-button label="移动端详情">移动端详情</el-radio-button>
      <!-- <el-radio-button label="PC端详情">PC端详情</el-radio-button> -->
    </el-radio-group>

    <div style="overflow: hidden;">
      <v-editor
        v-show="activeName === '移动端详情'"
        :disabled="disabled"
        v-model="mobileContent"
      />
      <v-editor
        v-show="activeName === 'PC端详情'"
        :disabled="disabled"
        v-model="pcContent"
      />
    </div>
  </div>
</template>

<script>
import {RadioButton} from 'element-ui'

import VEditor from '@femessage/v-editor'

export default {
  name: 'DetailEditor',
  components: {
    VEditor,
    ElRadioButton: RadioButton,
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    this.setValue(this.value)
    return {
      activeName: '移动端详情',
    }
  },
  computed: {
    pcContent: {
      get: function() {
        return this.value && this.value[0] !== undefined
          ? this.value[0].toString()
          : ''
      },
      set: function(val) {
        this.$emit('input', [val, this.mobileContent])
      },
    },
    mobileContent: {
      get: function() {
        return this.value && this.value[1] !== undefined
          ? this.value[1].toString()
          : ''
      },
      set: function(val) {
        this.$emit('input', [this.pcContent, val])
      },
    },
  },
  methods: {
    setValue(list) {
      const pcContent = list && list[0] ? list[0] : ''
      const mobileContent = list && list[1] ? list[1] : ''
      this.pcContent = pcContent
      this.mobileContent = mobileContent
    },
  },
}
</script>

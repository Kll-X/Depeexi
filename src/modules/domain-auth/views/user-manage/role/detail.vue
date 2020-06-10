<template>
  <div class="role-detail">
    <content-title :title="title"></content-title>
    <el-form-renderer
      ref="form"
      :content="formContent"
      class="role-form"
      label-width="120px"
    ></el-form-renderer>
    <operate-row>
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="saveRole">提交</el-button>
    </operate-row>
  </div>
</template>

<script>
import ContentTitle from '../../../component/content-title'
import OperateRow from '../../../component/operate-row'
import formConfig from './form-config'

import {newRole, editRole, getRoleDetail} from '../../../services/role-manage'

export default {
  components: {
    ContentTitle,
    OperateRow,
  },
  data() {
    return {
      formContent: formConfig,
    }
  },
  computed: {
    title() {
      return this.id ? '编辑角色' : '新增角色'
    },
    id() {
      return this.$route.query.id
    },
  },
  async mounted() {
    if (!this.id) return

    try {
      let res = await getRoleDetail(this.id)
      this.$refs.form.updateForm(res.payload)
    } catch (e) {}
  },
  methods: {
    saveRole() {
      const form = this.$refs.form
      form.validate(valid => {
        if (!valid) return
        const data = form.getFormValue()
        const request = this.id ? editRole(this.id, data) : newRole(data)
        request.then(() => {
          this.$router.replace('role-management')
          this.$message.success('保存成功')
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.role-detail {
  padding: 25px;
}

.role-form {
  width: 580px;
}
</style>
